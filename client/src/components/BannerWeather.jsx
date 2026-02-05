import React, { useState, useEffect } from 'react';

const BannerWeather = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    const getWeatherInfo = (code) => {
        const map = {
            0: { icon: '☀️', desc: 'Clear' }, 1: { icon: '🌤️', desc: 'Sunny' },
            2: { icon: '⛅', desc: 'Cloudy' }, 3: { icon: '☁️', desc: 'Overcast' },
            45: { icon: '🌫️', desc: 'Fog' }, 48: { icon: '🌫️', desc: 'Fog' },
            51: { icon: '🌧️', desc: 'Drizzle' }, 53: { icon: '🌧️', desc: 'Drizzle' }, 55: { icon: '🌧️', desc: 'Rain' },
            61: { icon: '🌧️', desc: 'Rain' }, 63: { icon: '🌧️', desc: 'Rain' }, 65: { icon: '🌧️', desc: 'Rain' },
            71: { icon: '❄️', desc: 'Snow' }, 73: { icon: '🌨️', desc: 'Snow' }, 75: { icon: '🌨️', desc: 'Snow' },
            80: { icon: '🌦️', desc: 'Showers' }, 81: { icon: '🌦️', desc: 'Showers' }, 82: { icon: '🌦️', desc: 'Showers' },
            95: { icon: '⛈️', desc: 'Storm' }, 96: { icon: '⛈️', desc: 'Storm' }, 99: { icon: '⛈️', desc: 'Storm' },
        };
        return map[code] || { icon: '🌡️', desc: 'Weather' };
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const ipRes = await fetch('http://ip-api.com/json/');
                const ipData = await ipRes.json();

                if (ipData.status === 'success') {
                    setLocation(ipData.city);

                    const weatherRes = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto`
                    );
                    const weatherData = await weatherRes.json();

                    setWeather({
                        temp: Math.round(weatherData.current.temperature_2m),
                        code: weatherData.current.weather_code,
                        humidity: weatherData.current.relative_humidity_2m
                    });
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg animate-pulse z-20">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!weather) return null;

    const { icon, desc } = getWeatherInfo(weather.code);

    return (
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-gray-100 dark:border-gray-700 z-20 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">{weather.temp}°C</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{desc}</span>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{location}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">💧{weather.humidity}%</span>
            </div>
        </div>
    );
};

export default BannerWeather;
