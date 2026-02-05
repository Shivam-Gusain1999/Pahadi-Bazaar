import React, { useEffect, useState } from 'react';
import { dummyOrders } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const {data} = await axios.get("/api/order/user")
      if(data.success){
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.log(error);
    }
  
  };

  useEffect(() => {
    if(user){ 
         fetchMyOrders();
    }
 
  },[user]);

  return (
    <div className="mt-16 pb-16">
      {/* Heading */}
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* Orders List */}
      {myOrders.map((order) => (
        <div
          key={order.order_id}
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          {/* Order Info */}
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col mb-4">
            <span>OrderId: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency}{order.amount}</span>
          </p>

          {/* Order Items */}
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className={`relative bg-white text-gray-500/70 ${
                idx !== order.items.length - 1 ? 'border-b' : ''
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 md:gap-4 w-full`}
            >
              {/* Left Side: Image + Details */}
              <div className="flex items-center mb-4 md:mb-0 gap-4">
                {/* Product Image */}
                <div className="bg-primary/10 p-4 rounded-lg">
                  <img
                    src={item.product.image[0]}
                    alt={item.product.name}
                    className="w-16 h-16"
                  />
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="text-xl font-medium text-gray-800">
                    {item.product.name}
                  </h2>
                  <p>Category: {item.product.category}</p>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Right Side: Amount */}
              <p className="text-primary text-lg font-medium md:ml-auto mt-2 md:mt-0">
                Amount: {currency}{item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
