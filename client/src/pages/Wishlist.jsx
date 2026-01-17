import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Wishlist = () => {
    const { axios, navigate, user, currency, setShowUserLogin } = useAppContext();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Show login prompt if not logged in
    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">💚</div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Login to View Wishlist</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Please login to see your saved items</p>
                <button
                    onClick={() => setShowUserLogin(true)}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full transition shadow-lg hover:shadow-green-500/30 font-medium"
                >
                    Login Now
                </button>
            </div>
        );
    }

    const fetchWishlist = async () => {
        try {
            const { data } = await axios.get("/api/wishlist");
            if (data.success) {
                setWishlist(data.data.wishlist || []);
            }
        } catch (error) {
            toast.error("Failed to fetch wishlist");
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await axios.delete(`/api/wishlist/remove/${productId}`);
            if (data.success) {
                setWishlist(wishlist.filter((item) => item._id !== productId));
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            toast.error("Failed to remove");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="py-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-8">
                💚 My Wishlist ({wishlist.length})
            </h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">💔</div>
                    <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Save products you love for later!</p>
                    <Link
                        to="/products"
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <div
                            key={product._id}
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition group"
                        >
                            <Link to={`/products/${product.category.toLowerCase()}/${product._id}`}>
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image?.[0]}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-medium">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="p-4">
                                <h3 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {currency}{product.offerPrice}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {currency}{product.price}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/products/${product.category.toLowerCase()}/${product._id}`}
                                        className="flex-1 py-2 text-center text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        View Product
                                    </Link>
                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                        title="Remove from wishlist"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
