import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const { user, setUser, showUserLogin, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, axios } = useAppContext();

  useEffect(()=>{
    if(searchQuery.length > 0){
      navigate('/products')
    }
  }, [searchQuery])

  const logout = async () => {
    try {
      const {data} = await axios.get("/api/user/logout")
      if(data.success){
      toast.success(data.message)
        setUser(null);
         navigate("/");
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <nav className="h-20 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3 
                    border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 relative transition-all">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-14 w-auto object-contain"
          src={assets.ppppp}
          alt="pahadibazarlogo"
      
        />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" className="hover:text-primary font-medium transition">Home</NavLink>
        <NavLink to="/products" className="hover:text-primary font-medium transition">All Product</NavLink>
        <NavLink to="/contact" className="hover:text-primary font-medium transition">Contact</NavLink>

        {/* Search Box */}
        <div onChange={(e)=>{setSearchQuery(e.target.value)}} className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full bg-gray-50">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-70" />
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* Login / Profile */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10" alt="profile" />

            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow-md border border-gray-200 py-2.5 w-36 rounded-lg text-sm z-40">
              <li
                onClick={() => navigate("/my-orders")}
                className="p-2 hover:bg-primary/10 cursor-pointer rounded-md"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-2 hover:bg-primary/10 cursor-pointer rounded-md"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>


         
         <div className="flex items-center gap-10 sm:hidden">
         <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
    
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        
      >
        <img src={assets.menu_icon} alt="menu" />
      </button>
    </div>
      {/* Mobile Menu */}
      {open && (
        <div
          className="absolute top-[70px] left-0 w-full 
                     bg-gradient-to-b from-primary to-primary-dull text-white shadow-2xl 
                     py-5 flex flex-col items-start gap-3 px-6 text-base sm:hidden 
                     z-50 rounded-b-2xl animate-slideDown"
        >
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 hover:bg-white/20 rounded-md transition"
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 hover:bg-white/20 rounded-md transition"
          >
            All Product
          </NavLink>

          {user && (
            <NavLink
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="block w-full py-2 px-3 hover:bg-white/20 rounded-md transition"
            >
              My Orders
            </NavLink>
          )}

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="block w-full py-2 px-3 hover:bg-white/20 rounded-md transition"
          >
            Contact
          </NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="w-full cursor-pointer py-2 mt-4 bg-white text-primary font-medium 
                         hover:bg-gray-100 transition rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full cursor-pointer py-2 mt-4 bg-white text-primary font-medium 
                         hover:bg-gray-100 transition rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
