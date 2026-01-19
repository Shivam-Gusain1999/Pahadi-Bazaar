import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const BookingForm = ({ event, onSuccess }) => {
    const { bookTickets, customerEmail } = useAppContext();

    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: customerEmail || "",
        seatsBooked: 1,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const maxSeats = Math.min(event.availableSeats, 10); // Max 10 seats per booking

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "seatsBooked" ? parseInt(value) || 1 : value,
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.customerName.trim()) {
            setError("Please enter your name");
            return;
        }
        if (!formData.customerEmail.trim()) {
            setError("Please enter your email");
            return;
        }
        if (formData.seatsBooked < 1 || formData.seatsBooked > maxSeats) {
            setError(`Please select between 1 and ${maxSeats} seats`);
            return;
        }

        setIsLoading(true);
        try {
            const result = await bookTickets(
                event._id,
                formData.customerName,
                formData.customerEmail,
                formData.seatsBooked
            );

            if (result) {
                onSuccess(result.booking);
            }
        } catch (err) {
            setError("Booking failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const totalAmount = event.price * formData.seatsBooked;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                </label>
                <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all duration-200"
                    required
                />
            </div>

            {/* Email Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             transition-all duration-200"
                    required
                />
            </div>

            {/* Seats Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Seats *
                </label>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, seatsBooked: Math.max(1, prev.seatsBooked - 1) }))}
                        className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-xl font-bold
                                 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        disabled={formData.seatsBooked <= 1}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        name="seatsBooked"
                        value={formData.seatsBooked}
                        onChange={handleChange}
                        min="1"
                        max={maxSeats}
                        className="w-20 text-center text-2xl font-bold py-2 rounded-lg border border-gray-300 
                                 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, seatsBooked: Math.min(maxSeats, prev.seatsBooked + 1) }))}
                        className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-xl font-bold
                                 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        disabled={formData.seatsBooked >= maxSeats}
                    >
                        +
                    </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Maximum {maxSeats} seats available
                </p>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Ticket Price</span>
                    <span>₹{event.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Seats</span>
                    <span>× {formData.seatsBooked}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                    <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                        ₹{totalAmount.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading || event.availableSeats < 1}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg
                         rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         transform hover:scale-[1.02] active:scale-[0.98]"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    `Book Now - ₹${totalAmount.toLocaleString()}`
                )}
            </button>
        </form>
    );
};

export default BookingForm;
