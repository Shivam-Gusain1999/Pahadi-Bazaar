import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const BookingSuccess = () => {
    const { id } = useParams();
    const { fetchBookingById } = useAppContext();

    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBooking = async () => {
            setIsLoading(true);
            const data = await fetchBookingById(id);
            setBooking(data);
            setIsLoading(false);
        };
        loadBooking();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Booking Not Found</h2>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-700">
                        ← Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    const event = booking.event;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-bounce">
                        <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your tickets have been booked successfully.
                    </p>
                </div>

                {/* Booking Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* Event Image */}
                    {event?.imageUrl && (
                        <div className="h-48 overflow-hidden">
                            <img
                                src={event.imageUrl}
                                alt={event.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6">
                        {/* Booking ID */}
                        <div className="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
                            <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                {booking.bookingId}
                            </p>
                        </div>

                        {/* Event Details */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {event?.name}
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{event?.date ? formatDate(event.date) : "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{event?.date ? formatTime(event.date) : "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event?.venue || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Info */}
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tickets</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {booking.seatsBooked}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        ₹{booking.totalAmount?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            <p>Booked by: <span className="font-medium text-gray-900 dark:text-white">{booking.customerName}</span></p>
                            <p>Email: <span className="font-medium text-gray-900 dark:text-white">{booking.customerEmail}</span></p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/bookings"
                                className="flex-1 text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                            >
                                View All Bookings
                            </Link>
                            <Link
                                to="/"
                                className="flex-1 text-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                            >
                                Browse More Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
