import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Weather code to description and icon mapping
    const getWeatherInfo = (code) => {
        const weatherMap = {
            0: { desc: 'Clear sky', icon: '☀️' },
            1: { desc: 'Mainly clear', icon: '🌤️' },
            2: { desc: 'Partly cloudy', icon: '⛅' },
            3: { desc: 'Overcast', icon: '☁️' },
            45: { desc: 'Foggy', icon: '🌫️' },
            48: { desc: 'Rime fog', icon: '🌫️' },
            51: { desc: 'Light drizzle', icon: '🌧️' },
            53: { desc: 'Drizzle', icon: '🌧️' },
            55: { desc: 'Dense drizzle', icon: '🌧️' },
            61: { desc: 'Light rain', icon: '🌧️' },
            63: { desc: 'Rain', icon: '🌧️' },
            65: { desc: 'Heavy rain', icon: '🌧️' },
            71: { desc: 'Light snow', icon: '❄️' },
            73: { desc: 'Snow', icon: '🌨️' },
            75: { desc: 'Heavy snow', icon: '🌨️' },
            77: { desc: 'Snow grains', icon: '🌨️' },
            80: { desc: 'Light showers', icon: '🌦️' },
            81: { desc: 'Showers', icon: '🌦️' },
            82: { desc: 'Heavy showers', icon: '🌦️' },
            85: { desc: 'Snow showers', icon: '🌨️' },
            86: { desc: 'Heavy snow showers', icon: '🌨️' },
            95: { desc: 'Thunderstorm', icon: '⛈️' },
            96: { desc: 'Thunderstorm with hail', icon: '⛈️' },
            99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' },
        };
        return weatherMap[code] || { desc: 'Unknown', icon: '🌡️' };
    };

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);

                // Step 1: Get user's location from IP (using HTTPS-enabled API)
                const ipResponse = await fetch('https://ipapi.co/json/');
                const ipData = await ipResponse.json();

                if (ipData.error) {
                    throw new Error('Could not detect location');
                }

                setLocation({
                    city: ipData.city,
                    region: ipData.region,
                    country: ipData.country_name,
                    lat: ipData.latitude,
                    lon: ipData.longitude
                });

                // Step 2: Get weather data from Open-Meteo
                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
                );
                const weatherData = await weatherResponse.json();

                setWeather({
                    temperature: Math.round(weatherData.current.temperature_2m),
                    humidity: weatherData.current.relative_humidity_2m,
                    windSpeed: Math.round(weatherData.current.wind_speed_10m),
                    weatherCode: weatherData.current.weather_code
                });

                setLoading(false);
            } catch (err) {
                console.error('Weather fetch error:', err);
                setError('Could not load weather');
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    if (loading) {
        return (
            <div className="my-8 flex justify-center">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return null; // Silently hide if error
    }

    const weatherInfo = getWeatherInfo(weather?.weatherCode);

    return (
        <div className="my-8 flex justify-center">
            <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-700/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-6">
                    {/* Weather Icon */}
                    <div className="text-5xl animate-bounce" style={{ animationDuration: '3s' }}>
                        {weatherInfo.icon}
                    </div>

                    {/* Weather Details */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-gray-800 dark:text-white">
                                {weather?.temperature}°
                            </span>
                            <span className="text-lg text-gray-500 dark:text-gray-400">C</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            {weatherInfo.desc}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

                    {/* Location & Extra Info */}
                    <div className="hidden sm:flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold">{location?.city}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                💧 {weather?.humidity}%
                            </span>
                            <span className="flex items-center gap-1">
                                💨 {weather?.windSpeed} km/h
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Location */}
                <div className="sm:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {location?.city}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            💧 {weather?.humidity}% • 💨 {weather?.windSpeed} km/h
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
