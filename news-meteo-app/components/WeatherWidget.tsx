'use client';

import { useEffect, useState } from 'react';
import { fetchWeather, getWeatherGradient, WeatherData } from '@/lib/weather';

function SkeletonWeather() {
  return (
    <div className="glass rounded-3xl overflow-hidden relative" style={{ minHeight: 320 }}>
      <div className="p-8 space-y-4">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-20 w-48 rounded-2xl" />
        <div className="skeleton h-4 w-40 rounded-full" />
        <div className="flex gap-3 mt-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="skeleton h-20 flex-1 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalizzazione non disponibile');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await fetchWeather(coords.latitude, coords.longitude);
          setWeather(data);
        } catch (e) {
          setError('Impossibile caricare il meteo');
          console.error(e);
        } finally {
          setLoading(false);
        }
      },
      () => {
        // Default to Rome if geolocation denied
        fetchWeather(41.9028, 12.4964)
          .then(setWeather)
          .catch(() => setError('Impossibile caricare il meteo'))
          .finally(() => setLoading(false));
      },
      { timeout: 8000 }
    );
  }, []);

  if (loading) return <SkeletonWeather />;

  if (error || !weather) {
    return (
      <div className="glass rounded-3xl p-8 flex items-center gap-4">
        <span className="text-4xl">🌡️</span>
        <div>
          <p className="text-white/60 text-sm">{error ?? 'Meteo non disponibile'}</p>
        </div>
      </div>
    );
  }

  const gradient = getWeatherGradient(weather.weatherCode);
  const today = weather.forecast[selectedDay];

  return (
    <div className="glass rounded-3xl overflow-hidden relative animate-fade-in">
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 pointer-events-none`} />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="text-white/50 text-xs font-body tracking-widest uppercase">
                {weather.city}{weather.country && `, ${weather.country}`}
              </span>
            </div>
            <p className="text-white/40 text-xs font-body">
              {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="text-5xl leading-none select-none">{weather.icon}</div>
        </div>

        {/* Main temperature */}
        <div className="mb-6">
          <div className="flex items-end gap-3 mb-2">
            <span className="font-display text-8xl leading-none text-white font-bold tracking-tighter">
              {selectedDay === 0 ? weather.temperature : today.maxTemp}
            </span>
            <span className="text-4xl text-white/40 mb-3">°C</span>
          </div>
          <p className="text-white/60 font-body text-sm">{weather.description}</p>
          {selectedDay === 0 && (
            <div className="flex items-center gap-4 mt-3 text-xs text-white/40 font-body">
              <span>💧 {weather.humidity}%</span>
              <span>💨 {weather.windSpeed} km/h</span>
              <span>🌡️ Percepita {weather.feelsLike}°</span>
            </div>
          )}
        </div>

        {/* 7-day forecast */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weather.forecast.map((day, i) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(i)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                selectedDay === i
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/[0.04] border border-transparent hover:bg-white/[0.07]'
              }`}
            >
              <span className={`text-xs font-body font-medium ${selectedDay === i ? 'text-amber-400' : 'text-white/50'}`}>
                {day.dayName}
              </span>
              <span className="text-xl leading-none">{day.icon}</span>
              <span className="text-xs font-body text-white font-medium">{day.maxTemp}°</span>
              <span className="text-xs font-body text-white/30">{day.minTemp}°</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
