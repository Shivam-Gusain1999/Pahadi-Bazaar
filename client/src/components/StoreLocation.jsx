import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Store location: Pauri Garhwal, Uttarakhand
const STORE_LOCATION = {
    lat: 30.1466,
    lng: 78.7765,
    name: "Pahadi Bazaar",
    address: "Pauri Garhwal, Uttarakhand, India",
    phone: "+91 9756769613",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM",
};

const StoreLocation = () => {
    return (
        <div className="mt-16">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
                    📍 Visit Our Store
                </h2>
                <p className="text-gray-600 mt-2">
                    Find us in the heart of Pauri Garhwal, Uttarakhand
                </p>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                {/* Map Container */}
                <div className="h-[400px] w-full">
                    <MapContainer
                        center={[STORE_LOCATION.lat, STORE_LOCATION.lng]}
                        zoom={14}
                        scrollWheelZoom={false}
                        className="h-full w-full z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[STORE_LOCATION.lat, STORE_LOCATION.lng]}>
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold text-green-700">{STORE_LOCATION.name}</h3>
                                    <p className="text-sm text-gray-600">{STORE_LOCATION.address}</p>
                                    <p className="text-sm text-gray-600 mt-1">📞 {STORE_LOCATION.phone}</p>
                                    <p className="text-sm text-gray-600">🕐 {STORE_LOCATION.hours}</p>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {/* Store Info Card */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold">{STORE_LOCATION.name}</h3>
                            <p className="text-green-100">{STORE_LOCATION.address}</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span>📞</span>
                                <span>{STORE_LOCATION.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🕐</span>
                                <span>{STORE_LOCATION.hours}</span>
                            </div>
                        </div>
                        <a
                            href={`https://www.google.com/maps?q=${STORE_LOCATION.lat},${STORE_LOCATION.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocation;
