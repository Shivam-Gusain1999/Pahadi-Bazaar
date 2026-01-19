import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BookingCard from "../components/BookingCard";

const MyBookings = () => {
    const { bookings, fetchBookings, customerEmail, setCustomerEmail } = useAppContext();

    const [email, setEmail] = useState(customerEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(!!customerEmail);

    useEffect(() => {
        if (customerEmail) {
            handleSearch();
        }
    }, []);

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        setCustomerEmail(email);
        await fetchBookings(email);
        setHasSearched(true);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        My Bookings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and manage all your ticket bookings in one place.
                    </p>
                </div>

                {/* Email Search */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email to view bookings"
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium 
                                     rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </form>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 mx-auto border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4">Loading your bookings...</p>
                    </div>
                )}

                {/* Bookings List */}
                {!isLoading && hasSearched && (
                    <>
                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Found <span className="font-medium text-gray-900 dark:text-white">{bookings.length}</span> booking(s)
                                    </p>
                                </div>
                                {bookings.map((booking) => (
                                    <BookingCard key={booking._id} booking={booking} showActions={true} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No Bookings Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    No bookings found for this email address.
                                </p>
                                <Link
                                    to="/"
                                    className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Browse Events
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* Initial State */}
                {!isLoading && !hasSearched && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Enter Your Email
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Enter the email address you used for booking to view your tickets.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
