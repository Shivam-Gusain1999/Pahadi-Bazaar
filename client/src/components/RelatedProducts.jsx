import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const RelatedProducts = ({ currentProductId, category }) => {
    const { products, currency } = useAppContext();
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0 && category) {
            const filtered = products
                .filter(
                    (p) =>
                        p.category?.toLowerCase() === category.toLowerCase() &&
                        p._id !== currentProductId
                )
                .slice(0, 4);
            setRelated(filtered);
        }
    }, [products, category, currentProductId]);

    if (related.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white mb-6">
                🛒 Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((product) => (
                    <Link
                        key={product._id}
                        to={`/products/${product.category?.toLowerCase()}/${product._id}`}
                        className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition bg-white dark:bg-gray-800"
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={product.image?.[0]}
                                alt={product.name}
                                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {!product.inStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">Out of Stock</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <h3 className="font-medium text-gray-800 dark:text-white line-clamp-1 text-sm">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-green-600 dark:text-green-400">
                                    {currency}{product.offerPrice}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {currency}{product.price}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
