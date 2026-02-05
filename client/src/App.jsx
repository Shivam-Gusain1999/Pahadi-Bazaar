import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import Loading from "./components/Loading";
import WhatsAppButton from "./components/WhatsAppButton";
import InstallPrompt from "./components/InstallPrompt";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const AllProducts = lazy(() => import("./pages/AllProducts"));
const ProductCategory = lazy(() => import("./pages/ProductCategory"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const AddAddress = lazy(() => import("./pages/AddAddress"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./components/Contact"));
const SellerLogin = lazy(() => import("./components/seller/SellerLogin"));
const SellerLayout = lazy(() => import("./pages/seller/SellerLayout"));
const AddProduct = lazy(() => import("./pages/seller/AddProduct"));
const ProductList = lazy(() => import("./pages/seller/ProductList"));
const Orders = lazy(() => import("./pages/seller/Orders"));

// Page loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const { showUserLogin, isSeller } = useAppContext();
  const isSellerPath = useLocation().pathname.includes("seller")
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      {isSellerPath ? null : <Navbar></Navbar>}
      {showUserLogin ? <Login></Login> : null}
      <Toaster></Toaster>

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </div>
      {!isSellerPath && <Footer></Footer>}
      {!isSellerPath && <WhatsAppButton />}
      {!isSellerPath && <InstallPrompt />}
    </div>
  );
};

export default App;

