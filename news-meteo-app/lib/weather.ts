export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  icon: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  icon: string;
}

export function getWeatherDescription(code: number): string {
  const codes: Record<number, string> = {
    0: 'Cielo sereno',
    1: 'Prevalentemente sereno',
    2: 'Parzialmente nuvoloso',
    3: 'Coperto',
    45: 'Nebbia',
    48: 'Nebbia con brina',
    51: 'Pioggerella leggera',
    53: 'Pioggerella',
    55: 'Pioggerella intensa',
    61: 'Pioggia leggera',
    63: 'Pioggia',
    65: 'Pioggia forte',
    71: 'Neve leggera',
    73: 'Neve',
    75: 'Neve intensa',
    77: 'Granelli di neve',
    80: 'Rovesci leggeri',
    81: 'Rovesci',
    82: 'Rovesci violenti',
    85: 'Nevicate leggere',
    86: 'Nevicate',
    95: 'Temporale',
    96: 'Temporale con grandine',
    99: 'Temporale con grandine forte',
  };
  return codes[code] ?? 'Condizioni variabili';
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

export function getWeatherGradient(code: number): string {
  if (code === 0) return 'from-amber-400 via-orange-300 to-sky-400';
  if (code <= 2) return 'from-sky-400 via-blue-300 to-amber-300';
  if (code <= 3) return 'from-slate-500 via-slate-400 to-slate-600';
  if (code <= 48) return 'from-slate-600 via-gray-500 to-slate-700';
  if (code <= 82) return 'from-slate-700 via-blue-800 to-slate-800';
  if (code <= 86) return 'from-slate-400 via-blue-200 to-white';
  return 'from-slate-800 via-purple-900 to-slate-900';
}

export async function getCityFromCoords(
  lat: number,
  lon: number
): Promise<{ city: string; country: string }> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'it' } }
  );
  const data = await res.json();
  const city =
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.county ||
    'Posizione sconosciuta';
  const country = data.address?.country_code?.toUpperCase() || '';
  return { city, country };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const [weatherRes, locationData] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=7`
    ),
    getCityFromCoords(lat, lon),
  ]);

  const weather = await weatherRes.json();
  const current = weather.current;
  const daily = weather.daily;

  const forecast: ForecastDay[] = daily.time.map((date: string, i: number) => {
    const d = new Date(date);
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const code = daily.weather_code[i];
    return {
      date,
      dayName: i === 0 ? 'Oggi' : dayNames[d.getDay()],
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      minTemp: Math.round(daily.temperature_2m_min[i]),
      weatherCode: code,
      icon: getWeatherIcon(code),
    };
  });

  return {
    city: locationData.city,
    country: locationData.country,
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    weatherCode: current.weather_code,
    description: getWeatherDescription(current.weather_code),
    icon: getWeatherIcon(current.weather_code),
    forecast,
  };
}
