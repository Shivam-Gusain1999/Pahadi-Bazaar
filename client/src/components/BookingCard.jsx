import React from "react";
import { useAppContext } from "../context/AppContext";

const BookingCard = ({ booking, showActions = false }) => {
    const { navigate, cancelBooking } = useAppContext();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isConfirmed = booking.status === "confirmed";
    const event = booking.event;

    const handleCancel = async () => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            await cancelBooking(booking.bookingId);
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border 
                        ${isConfirmed ? "border-gray-200 dark:border-gray-700" : "border-red-300 dark:border-red-700"}`}>
            <div className="flex flex-col md:flex-row">
                {/* Event Image */}
                {event?.imageUrl && (
                    <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
                        <img
                            src={event.imageUrl}
                            alt={event.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Booking Details */}
                <div className="flex-1 p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {event?.name || "Event"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Booking ID: <span className="font-mono font-medium">{booking.bookingId}</span>
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isConfirmed
                                ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                            }`}>
                            {isConfirmed ? "Confirmed" : "Cancelled"}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {/* Date */}
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Event Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {event?.date ? formatDate(event.date) : "N/A"}
                            </p>
                        </div>
                        {/* Time */}
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Time</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {event?.date ? formatTime(event.date) : "N/A"}
                            </p>
                        </div>
                        {/* Seats */}
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Seats</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {booking.seatsBooked}
                            </p>
                        </div>
                        {/* Amount */}
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Total Paid</p>
                            <p className="font-bold text-indigo-600 dark:text-indigo-400">
                                ₹{booking.totalAmount?.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Venue */}
                    {event?.venue && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.venue}</span>
                        </div>
                    )}

                    {/* Actions */}
                    {showActions && isConfirmed && (
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => navigate(`/booking/${booking.bookingId}`)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                View Details
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 
                                         text-red-600 dark:text-red-400 text-sm font-medium rounded-lg transition-colors"
                            >
                                Cancel Booking
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
