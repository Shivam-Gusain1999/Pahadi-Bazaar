import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Loading from "./components/Loading";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import WhatsAppButton from "./components/WhatsAppButton";
import InstallPrompt from "./components/InstallPrompt";


const App = () => {
  const { showUserLogin, isSeller } = useAppContext();
  const isSellerPath = useLocation().pathname.includes("seller")
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      {isSellerPath ? null : <Navbar></Navbar>}
      {showUserLogin ? <Login></Login> : null}
      <Toaster></Toaster>

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/seller" element={isSeller ? <SellerLayout></SellerLayout> : <SellerLogin></SellerLogin>}>
            <Route index element={isSeller ? <AddProduct></AddProduct> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders></Orders>} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer></Footer>}
      {!isSellerPath && <WhatsAppButton />}
      {!isSellerPath && <InstallPrompt />}
    </div>
  );
};

export default App;
