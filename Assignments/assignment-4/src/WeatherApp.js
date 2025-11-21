import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
export default function WeatherApp() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Using OpenWeatherMap API - You'll need to sign up for a free API key
    const API_KEY = '1d0c766b75caf20bb7fde7c9e55980b6'; // Replace with your actual API key
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const fetchWeather = async (cityName) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(
                `${BASE_URL}?q=${cityName}&appid=${API_KEY}`
            );
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            setWeather(data);
        } catch (err) {
            setError(err.message);
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather(city);
        }
    };
    // Optional: Fetch weather for a default city on component mount
    useEffect(() => {
        // fetchWeather('London');
    }, []);
    return (
        <div className="weather-app">
            <h1>Weather App</h1>
            <form onSubmit={handleSubmit} className="weather-form">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="city-input"
                />
                <button type="submit" className="search-btn">
                    Search
                </button>
            </form>
            {loading && <div className="loading">Loading weather data...</div>}
            {error && (
                <div className="error">
                    Error: {error}. Please check the city name and try again.
                </div>
            )}
            {weather && !loading && (
                <div className="weather-card">
                    <h2>{weather.name}, {weather.sys.country}</h2>
                    <div className="weather-main">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                            className="weather-icon"
                        />
                        <div className="temperature">
                            {Math.round(weather.main.temp)}°F
                        </div>
                    </div>
                    <div className="weather-details">
                        <p className="weather-description">
                            {weather.weather[0].description}
                        </p>
                        <div className="weather-stats">
                            <div>Feels like: {Math.round(weather.main.feels_like)}°C</div>
                            <div>Humidity: {weather.main.humidity}%</div>
                            <div>Wind: {weather.wind.speed} m/s</div>
                            <div>Pressure: {weather.main.pressure} hPa</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}