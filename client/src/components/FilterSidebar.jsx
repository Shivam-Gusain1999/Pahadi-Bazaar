import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const FilterSidebar = ({ onFilterChange, isOpen, onClose }) => {
    const { axios } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        category: "all",
        minPrice: "",
        maxPrice: "",
        sort: "newest",
        inStock: false,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("/api/product/categories");
            if (data.success) {
                setCategories(data.data.categories || []);
            }
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters = {
            category: "all",
            minPrice: "",
            maxPrice: "",
            sort: "newest",
            inStock: false,
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
        toast.success("Filters cleared");
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-72 lg:w-64 lg:flex-shrink-0 bg-white dark:bg-gray-800 z-50 lg:z-0 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    } p-5 border-r lg:border lg:rounded-xl shadow-lg lg:shadow-sm border-gray-200 dark:border-gray-700`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h3>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full dark:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                        value={filters.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => handleChange("minPrice", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => handleChange("maxPrice", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                    <select
                        value={filters.sort}
                        onChange={(e) => handleChange("sort", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="name_asc">Name: A to Z</option>
                        <option value="name_desc">Name: Z to A</option>
                    </select>
                </div>

                {/* In Stock */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => handleChange("inStock", e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
                    </label>
                </div>

                {/* Clear Button */}
                <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                >
                    Clear All Filters
                </button>
            </div>
        </>
    );
};

export default FilterSidebar;
