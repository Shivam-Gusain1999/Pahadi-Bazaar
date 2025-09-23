import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets, dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials= true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
const currency = import.meta.env.VITE_CURRENCY;


  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  //fetch seller status//

  const fetchSeller = async ()=>{
    try {
          const {data} = await axios.get("/api/seller/is-auth")
      if(data.success){
        setIsSeller(true)
      }else{setIsSeller(false)}
    } catch (error) {
      setIsSeller(false)
    }
  }


  /// fetch user data //
  const fetchUser = async ()=>{
    try {
      const {data} = await axios.get('/api/user/is-auth')
      if(data.success){
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }else{
        setUser(null)
      }
      
    } catch (error) {
      setUser(null)
    }
  }

 

// fetch all products //
    
const fetchProducts = async ()=>{
try {
    const {data} = await axios.get("/api/product/list")
    if(data.success){
      toast.success(data.message)
      setProducts(data.products)
    }else{
      toast.error(data.message)
    }

} catch (error) {
  toast.error(error.message)
}
}

// add products to cart //

const addToCart = (itemId)=>{
  let cartData = structuredClone(cartItems)
  if(cartData[itemId]){
    cartData[itemId] += 1;
  }else{
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

const removeFromCart = (itemId)=>{
  let cartData = structuredClone(cartItems);
  if(cartData[itemId]){
    cartData[itemId] -= 1;
    if(cartData[itemId] === 0){
      delete cartData[itemId];
    }

  }
  toast.success("remove from cart")
  setCartItems(cartData)


}





const getCartCount = ()=>{
  let totalCount = 0;
  for(const item in cartItems){
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

    // agar item cart me exist karta hai (quantity > 0)
    if (cartItems[items] > 0) {
      totalAmount += itemInfo.offerPrice * cartItems[items];
    }
  }

  // 2 decimal tak value return karega
  return Math.floor(totalAmount * 100) / 100;
};



useEffect(()=>{
  fetchUser()

  fetchSeller()
 
  fetchProducts()
},[])



useEffect(()=>{
  const updateCart= async() =>{
    try {
      const {data} = await axios.post("/api/cart/update", {cartItems})
      if(!data.success){
        toast.error(data.message)

      }
    } catch (error) {
      toast.error("dikkt h")
    }
  }
  if(user){
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
  return useContext(AppContext);
};
