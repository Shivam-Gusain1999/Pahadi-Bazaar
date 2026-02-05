import React, { memo, useMemo } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import StarRating from "./StarRating";

const ProductCard = memo(({ product }) => {
  const { currency, cartItems, addToCart, removeFromCart, navigate, toggleWishlist, isInWishlist } = useAppContext();

  // Memoize random review count to prevent re-render issues
  const reviewCount = useMemo(() => Math.floor(Math.random() * 50) + 5, [product._id]);

  if (!product) return null;

  return (
    <div onClick={(e) => {
      // Prevent navigation when clicking buttons
      if (e.target.closest('button')) return;
      navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
      scrollTo(0, 0)
    }}
      className="group relative cursor-pointer p-4 rounded-2xl flex flex-col justify-between
                 shadow-md hover:shadow-2xl transition-all duration-200 overflow-hidden bg-white dark:bg-gray-800 dark:shadow-none dark:hover:shadow-gray-700/50
                 transform-gpu hover:-translate-y-1"
    >
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 shadow-sm transition-colors duration-150"
      >
        <svg
          className={`w-5 h-5 transition-colors duration-150 ${isInWishlist(product._id) ? "text-red-500 fill-red-500" : "text-gray-400 dark:text-gray-300 hover:text-red-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Product Image */}
      <div className="flex items-center justify-center relative z-10 bg-white dark:bg-gray-700 rounded-xl p-2 mb-2">
        <img
          className="group-hover:scale-105 transition-transform duration-200 transform-gpu h-40 object-contain drop-shadow-lg"
          src={product.image[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3 relative z-10">
        <p className="text-gray-400 dark:text-gray-400 text-sm">{product.category}</p>
        <p className="text-gray-800 dark:text-white font-semibold text-lg truncate">{product.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={4} size="sm" />
          <p className="text-gray-500 text-xs">({reviewCount})</p>
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
                           text-primary text-sm font-medium hover:bg-primary/20 transition-colors duration-150"
              >
                <img src={assets.cart_icon} alt="cart-icon" className="w-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2 px-2 w-20 h-9 bg-primary/10 rounded-lg">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-lg font-medium text-primary hover:text-red-500 transition-colors duration-150"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-medium text-gray-700">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="text-lg font-medium text-primary hover:text-green-600 transition-colors duration-150"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

