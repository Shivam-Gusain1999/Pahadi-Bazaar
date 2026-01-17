import React, { useState, useEffect } from 'react';

const NavbarWeather = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    const getWeatherIcon = (code) => {
        const icons = {
            0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
            45: '🌫️', 48: '🌫️',
            51: '🌧️', 53: '🌧️', 55: '🌧️',
            61: '🌧️', 63: '🌧️', 65: '🌧️',
            71: '❄️', 73: '🌨️', 75: '🌨️', 77: '🌨️',
            80: '🌦️', 81: '🌦️', 82: '🌦️',
            85: '🌨️', 86: '🌨️',
            95: '⛈️', 96: '⛈️', 99: '⛈️',
        };
        return icons[code] || '🌡️';
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const ipRes = await fetch('http://ip-api.com/json/');
                const ipData = await ipRes.json();

                if (ipData.status === 'success') {
                    setLocation(ipData.city);

                    const weatherRes = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current=temperature_2m,weather_code&timezone=auto`
                    );
                    const weatherData = await weatherRes.json();

                    setWeather({
                        temp: Math.round(weatherData.current.temperature_2m),
                        code: weatherData.current.weather_code
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Weather error:', err);
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="w-8 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-full border border-blue-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all cursor-default">
            <span className="text-base">{getWeatherIcon(weather.code)}</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-white">{weather.temp}°</span>
            <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-300">{location}</span>
        </div>
    );
};

export default NavbarWeather;
