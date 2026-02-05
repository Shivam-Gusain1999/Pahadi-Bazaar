import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
            setQuery("");
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            {/* Search Button for Mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {/* Search Form - Desktop always visible, Mobile toggleable */}
            <form
                onSubmit={handleSearch}
                className={`${isOpen ? "flex" : "hidden"} md:flex items-center absolute md:relative right-0 top-12 md:top-0 bg-white md:bg-gray-100 rounded-full shadow-lg md:shadow-none`}
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 sm:w-64 px-4 py-2 bg-transparent text-sm focus:outline-none placeholder-gray-500"
                />
                <button
                    type="submit"
                    className="p-2 text-gray-600 hover:text-green-600 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
