import styles from './WeatherWidget.module.css';

const ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '🌤️', '02n': '🌤️',
  '03d': '⛅', '03n': '⛅',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌦️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export default function WeatherWidget({ weather }) {
  const icon = ICONS[weather.icon] || '🌡️';

  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <div className={styles.temp}>{weather.temp}°C</div>
        <div className={styles.city}>{weather.city}</div>
        <div className={styles.desc}>{weather.description}</div>
      </div>
      <div className={styles.extra}>
        <div>💧 Umidità {weather.humidity}%</div>
        <div>💨 Vento {weather.wind} km/h</div>
        <div>🌡 Percepita {weather.feels}°C</div>
      </div>
    </div>
  );
}
