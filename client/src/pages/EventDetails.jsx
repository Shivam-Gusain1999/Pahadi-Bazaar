import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BookingForm from "../components/BookingForm";

const EventDetails = () => {
    const { id } = useParams();
    const { fetchEventById, navigate } = useAppContext();

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEvent = async () => {
            setIsLoading(true);
            const data = await fetchEventById(id);
            setEvent(data);
            setIsLoading(false);
        };
        loadEvent();
    }, [id]);

    const handleBookingSuccess = (booking) => {
        navigate(`/booking/${booking.bookingId}`);
    };

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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                            <div className="space-y-4">
                                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-700">
                        ← Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    const availabilityPercent = (event.availableSeats / event.totalSeats) * 100;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event Image & Info */}
                    <div>
                        <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
                            <img
                                src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                                alt={event.name}
                                className="w-full h-80 object-cover"
                            />
                            <span className="absolute top-4 left-4 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                                {event.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {event.name}
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            {event.description}
                        </p>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{formatDate(event.date)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{formatTime(event.date)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow col-span-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{event.venue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seat Availability */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Seat Availability</span>
                                <span className={`font-bold ${availabilityPercent > 50 ? "text-green-600" :
                                        availabilityPercent > 20 ? "text-yellow-600" : "text-red-600"
                                    }`}>
                                    {event.availableSeats} / {event.totalSeats} seats
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${availabilityPercent > 50 ? "bg-green-500" :
                                            availabilityPercent > 20 ? "bg-yellow-500" : "bg-red-500"
                                        }`}
                                    style={{ width: `${availabilityPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Tickets</h2>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Starting from</p>
                                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                        ₹{event.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {event.availableSeats > 0 ? (
                                <BookingForm event={event} onSuccess={handleBookingSuccess} />
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sold Out</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        This event is fully booked. Please check other events.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
