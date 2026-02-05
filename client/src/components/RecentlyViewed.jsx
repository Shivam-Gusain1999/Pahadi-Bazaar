import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const STORAGE_KEY = "pahadi_recently_viewed";
const MAX_ITEMS = 8;

// Hook to manage recently viewed products
export const useRecentlyViewed = () => {
    const addToRecentlyViewed = (product) => {
        if (!product?._id) return;

        const stored = localStorage.getItem(STORAGE_KEY);
        let items = stored ? JSON.parse(stored) : [];

        // Remove if already exists
        items = items.filter((item) => item._id !== product._id);

        // Add to beginning
        items.unshift({
            _id: product._id,
            name: product.name,
            image: product.image?.[0],
            offerPrice: product.offerPrice,
            price: product.price,
            category: product.category,
        });

        // Keep only MAX_ITEMS
        items = items.slice(0, MAX_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    const getRecentlyViewed = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    };

    const clearRecentlyViewed = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    return { addToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed };
};

// Component to display recently viewed products
const RecentlyViewed = () => {
    const { currency } = useAppContext();
    const [items, setItems] = useState([]);
    const { getRecentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        setItems(getRecentlyViewed());
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white">
                    👀 Recently Viewed
                </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {items.map((product) => (
                    <Link
                        key={product._id}
                        to={`/products/${product.category?.toLowerCase()}/${product._id}`}
                        className="flex-shrink-0 w-40 group"
                    >
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition bg-white dark:bg-gray-800">
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-2">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                        {currency}{product.offerPrice}
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                        {currency}{product.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
