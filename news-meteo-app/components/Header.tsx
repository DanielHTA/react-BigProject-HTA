'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(value), 500);
    },
    [onSearch]
  );

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <span className="text-sm leading-none">📰</span>
          </div>
          <span className="font-display text-xl text-white font-bold tracking-tight hidden sm:block">
            Cronache
          </span>
        </div>

        {/* Search */}
        <div
          className={`flex-1 max-w-md relative flex items-center transition-all duration-300 ${
            focused ? 'max-w-lg' : 'max-w-md'
          }`}
        >
          <div className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 border transition-all duration-200 ${
            focused
              ? 'bg-white/10 border-amber-500/40'
              : 'bg-white/[0.04] border-white/10'
          }`}>
            <svg className="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Cerca notizie…"
              className="flex-1 bg-transparent text-sm font-body text-white placeholder-white/30 outline-none min-w-0"
            />
            {query && (
              <button
                onClick={() => handleChange('')}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right: source badge */}
        <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-xs font-body text-white/25">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-slow" />
          The Guardian
        </div>
      </div>
    </header>
  );
}
