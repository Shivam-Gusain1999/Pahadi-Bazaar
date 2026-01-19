import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col text-gray-700 bg-white dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/booking/:id" element={<BookingSuccess />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
