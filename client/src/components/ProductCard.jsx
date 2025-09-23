import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, cartItems, addToCart, removeFromCart, navigate } = useAppContext();

  return (
    product && (
      <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0)}}
        className="group relative cursor-pointer p-4 rounded-2xl flex flex-col justify-between
                   shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden bg-white"
      >
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"></div>

        {/* Product Image */}
        <div className="flex items-center justify-center relative z-10">
          <img
            className="group-hover:scale-110 transition-transform duration-300 max-h-34 object-contain drop-shadow-lg"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="mt-3 relative z-10">
          <p className="text-gray-400 text-sm">{product.category}</p>
          <p className="text-gray-800 font-semibold text-lg truncate">{product.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-4"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <p className="text-gray-500 text-xs">(4)</p>
          </div>

          {/* Price & Cart */}
          <div className="flex items-end justify-between mt-3">
            <p className="text-primary-dull font-semibold text-lg">
              {currency}
              {product.offerPrice}{" "}
              <span className="text-gray-400 text-sm line-through">
                {currency}
                {product.price}
              </span>
            </p>

            {/* Cart Buttons */}
            <div onClick={(e) => e.stopPropagation()} className="relative z-10">
              {!cartItems[product._id] ? (
                <button
                  onClick={() => addToCart(product._id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary-dull 
                             text-primary text-sm font-medium hover:bg-primary/20 transition"
                >
                  <img src={assets.cart_icon} alt="cart-icon" className="w-4" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2 px-2 w-20 h-9 bg-primary/10 rounded-lg">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="text-lg font-medium text-primary hover:text-red-500 transition"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-medium text-gray-700">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="text-lg font-medium text-primary hover:text-green-600 transition"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
