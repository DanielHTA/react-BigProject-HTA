const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const GNEWS_BASE = 'https://gnews.io/api/v4';
const WEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

// Mappa categorie UI → GNews
const CATEGORY_MAP = {
  tecnologia: 'technology',
  economia: 'business',
  sport: 'sports',
  scienza: 'science',
  politica: 'nation',
  cultura: 'entertainment',
  salute: 'health',
};

// GET /api/news?category=tecnologia&q=ricerca&lang=it
router.get('/', protect, async (req, res) => {
  const { category = '', q = '', lang = 'it', max = 9 } = req.query;
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) return res.status(500).json({ message: 'Chiave GNews non configurata' });

  try {
    let url;
    const gnewsCategory = CATEGORY_MAP[category.toLowerCase()];

    if (q) {
      // Ricerca per parola chiave
      url = `${GNEWS_BASE}/search?q=${encodeURIComponent(q)}&lang=${lang}&max=${max}&apikey=${apiKey}`;
    } else if (gnewsCategory) {
      // Top headlines per categoria
      url = `${GNEWS_BASE}/top-headlines?category=${gnewsCategory}&lang=${lang}&max=${max}&apikey=${apiKey}`;
    } else {
      // Top headlines generali
      url = `${GNEWS_BASE}/top-headlines?lang=${lang}&max=${max}&apikey=${apiKey}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`GNews error: ${response.status}`);

    const data = await response.json();

    // Normalizza la risposta
    const articles = (data.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.image,
      publishedAt: a.publishedAt,
      source: a.source?.name || 'Fonte sconosciuta',
      category: category || 'generale',
    }));

    res.json({ articles, totalArticles: data.totalArticles });
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero notizie', error: err.message });
  }
});

// GET /api/news/weather?city=Torino
router.get('/weather', protect, async (req, res) => {
  const { city = 'Torino' } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) return res.status(500).json({ message: 'Chiave OpenWeather non configurata' });

  try {
    const url = `${WEATHER_BASE}/weather?q=${encodeURIComponent(city)}&units=metric&lang=it&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OpenWeather error: ${response.status}`);

    const data = await response.json();

    res.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      feels: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || '',
      icon: data.weather[0]?.icon || '',
      wind: Math.round(data.wind.speed * 3.6), // m/s → km/h
    });
  } catch (err) {
    res.status(500).json({ message: 'Errore meteo', error: err.message });
  }
});

module.exports = router;
