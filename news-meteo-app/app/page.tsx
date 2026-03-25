'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WeatherWidget from '@/components/WeatherWidget';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      <Header onSearch={setSearchQuery} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Weather sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-0.5 h-5 bg-amber-500 rounded-full" />
                <h2 className="text-xs font-body font-semibold tracking-widest text-white/40 uppercase">
                  Meteo
                </h2>
              </div>
              <WeatherWidget />

              {/* Attribution */}
              <p className="text-xs text-white/20 font-body text-center">
                Dati meteo:{' '}
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/40 transition-colors underline"
                >
                  Open-Meteo
                </a>
              </p>
            </div>
          </div>

          {/* Right: News */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-0.5 h-5 bg-amber-500 rounded-full" />
              <h2 className="text-xs font-body font-semibold tracking-widest text-white/40 uppercase">
                {searchQuery ? `Risultati per "${searchQuery}"` : 'Ultime Notizie'}
              </h2>
            </div>
            <NewsSection searchQuery={searchQuery} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/20 text-xs font-body">
            Cronache — News da{' '}
            <a
              href="https://www.theguardian.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              The Guardian
            </a>
            {' '}· Meteo da{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              Open-Meteo
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
