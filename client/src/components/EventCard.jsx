import React from "react";
import { useAppContext } from "../context/AppContext";

const EventCard = ({ event }) => {
    const { navigate } = useAppContext();

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

    const isAvailable = event.availableSeats > 0;
    const availabilityPercent = (event.availableSeats / event.totalSeats) * 100;

    // Color based on availability
    const getAvailabilityColor = () => {
        if (availabilityPercent > 50) return "text-green-500";
        if (availabilityPercent > 20) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div
            onClick={() => navigate(`/event/${event._id}`)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer 
                       transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                       border border-gray-200 dark:border-gray-700"
        >
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {event.category}
                </span>
                {/* Availability Badge */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">SOLD OUT</span>
                    </div>
                )}
            </div>

            {/* Event Details */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {event.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {/* Date & Time */}
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.date)} at {formatTime(event.date)}</span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{event.venue}</span>
                    </div>
                </div>

                {/* Price & Availability */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        ₹{event.price.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${getAvailabilityColor()}`}>
                        {isAvailable ? `${event.availableSeats} seats left` : "Sold Out"}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${availabilityPercent > 50 ? "bg-green-500" :
                                availabilityPercent > 20 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                        style={{ width: `${availabilityPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default EventCard;
