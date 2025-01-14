import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../features/weatherSlice';
import { CloudIcon, SunIcon } from '@heroicons/react/24/solid'; // Only these are available
import { format } from 'date-fns';

const WeatherWidget = ({ location, taskId }) => {
  const dispatch = useDispatch();
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const weatherData = useSelector((state) => state.weather.weatherData[taskId]);
  const loading = useSelector((state) => state.weather.loading[taskId]);
  const error = useSelector((state) => state.weather.errors[taskId]);

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchWeather({ location, taskId }));
      setLastFetchTime(new Date());
    };

    // Fetch initially if no data
    if (!weatherData && !loading && !error) {
      fetchData();
    }

    // Refresh every 30 minutes
    const interval = setInterval(() => {
      if (lastFetchTime && (new Date() - lastFetchTime) >= 30 * 60 * 1000) {
        fetchData();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dispatch, location, taskId, weatherData, loading, error, lastFetchTime]);

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return <CloudIcon className="w-6 h-6 text-gray-600" />;
    if (weatherCode >= 300 && weatherCode < 600) return <CloudIcon className="w-6 h-6 text-blue-400" />;
    if (weatherCode >= 600 && weatherCode < 700) return <CloudIcon className="w-6 h-6 text-blue-200" />;
    if (weatherCode >= 700 && weatherCode < 800) return <CloudIcon className="w-6 h-6 text-gray-400" />;
    if (weatherCode === 800) return <SunIcon className="w-6 h-6 text-yellow-400" />;
    return <CloudIcon className="w-6 h-6 text-gray-400" />;
  };

  const getWeatherBackground = (temp) => {
    if (temp <= 0) return 'bg-blue-50';
    if (temp <= 15) return 'bg-green-50';
    if (temp <= 25) return 'bg-yellow-50';
    return 'bg-orange-50';
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg shadow-sm animate-pulse">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-lg shadow-sm">
        <CloudIcon className="w-6 h-6 text-red-400" />
        <div className="text-red-500 text-sm">Weather unavailable</div>
      </div>
    );
  }

  if (!weatherData) return null;

  const { temp } = weatherData.main;
  const weatherCode = weatherData.weather[0].id;
  const bgClass = getWeatherBackground(temp);

  return (
    <div className={`flex flex-col ${bgClass} p-3 rounded-lg shadow-sm transition-all duration-300`}>
      <div className="flex items-center space-x-3">
        {getWeatherIcon(weatherCode)}
        <div>
          <div className="font-medium">{temp.toFixed(1)}°C</div>
          <div className="text-sm text-gray-500">{weatherData.weather[0].description}</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Humidity: {weatherData.main.humidity}%</span>
          <span>Wind: {(weatherData.wind.speed * 3.6).toFixed(1)} km/h</span>
        </div>
        <div className="mt-1 text-right">
          Last updated: {format(lastFetchTime || new Date(), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
