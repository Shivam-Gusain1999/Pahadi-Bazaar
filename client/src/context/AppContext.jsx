import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets, dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };


  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  //fetch seller status//

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth")
      if (data.success) {
        setIsSeller(true)
      } else { setIsSeller(false) }
    } catch (error) {
      setIsSeller(false)
    }
  }


  const [wishlist, setWishlist] = useState([]);

  // Fetch Wishlist
  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const { data } = await axios.get("/api/wishlist");
      if (data.success) {
        // Filter out null items (deleted products) before mapping to IDs
        const validWishlist = (data.data.wishlist || []).filter(item => item !== null);
        setWishlist(validWishlist.map(item => item._id));
      }
    } catch (error) {
      console.error("Failed to fetch wishlist");
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to initiate wishlist");
      navigate("/");
      return;
    }

    // Optimistic update
    const isInWishlist = wishlist.includes(productId);
    let newWishlist;
    if (isInWishlist) {
      newWishlist = wishlist.filter(id => id !== productId);
      toast.success("Removed from wishlist");
    } else {
      newWishlist = [...wishlist, productId];
      toast.success("Added to wishlist");
    }
    setWishlist(newWishlist);

    try {
      const { data } = await axios.post("/api/wishlist/toggle", { productId });
      if (!data.success) {
        // Revert if failed
        setWishlist(wishlist);
        toast.error(data.message);
      }
    } catch (error) {
      // Revert if failed
      setWishlist(wishlist);
      toast.error("Failed to update wishlist");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  /// fetch user data //
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth')
      if (data.success) {
        setUser(data.user)
        setCartItems(data.user.cartItems)
        // Set initial wishlist from user data if populated, otherwise fetch
        if (data.user.wishlist && data.user.wishlist.length > 0) {
          // If populated objects, map to IDs. If IDs, keep as is.
          const wishlistIds = data.user.wishlist.map(item => typeof item === 'object' ? item._id : item);
          setWishlist(wishlistIds);
        }
      } else {
        setUser(null)
      }

    } catch (error) {
      setUser(null)
    }
  }

  // fetch all products //

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/product/list")
      if (data.success && data.data.products && data.data.products.length > 0) {
        setProducts(data.data.products)
      } else {
        // Use dummyProducts as fallback when no products from API
        console.log("Using fallback dummyProducts");
        setProducts(dummyProducts);
      }

    } catch (error) {
      // Use dummyProducts as fallback on error
      console.log("API error, using fallback dummyProducts");
      setProducts(dummyProducts);
    } finally {
      setIsLoading(false);
    }
  }

  // add products to cart //

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems)
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData)
    toast.success("added to cart")
  }

  // update product to cart //

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems)
    cartData[itemId] = quantity;
    setCartItems(cartData)
    toast.success("Cart Updated")
  }

  // delete product to cart //

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }

    }
    toast.success("remove from cart")
    setCartItems(cartData)


  }





  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item]
    }
    return totalCount;
  }

  // Get Cart Total Amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      // product ki details nikalna
      let itemInfo = products.find(
        (product) => product._id === items
      );

      // agar item cart me exist karta hai (quantity > 0) aur product found hai
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }

    // 2 decimal tak value return karega
    return Math.floor(totalAmount * 100) / 100;
  };



  useEffect(() => {
    fetchUser()

    fetchSeller()

    fetchProducts()
  }, [])

  // Reload wishlist when user changes
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);



  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems })
        if (!data.success) {
          toast.error(data.message)

        }
      } catch (error) {
        toast.error("Failed to update cart")
      }
    }
    if (user) {
      updateCart()
    }

  }, [cartItems])


  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    isLoading,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    fetchUser,
    wishlist,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
    darkMode,
    toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
  return useContext(AppContext);
};
