'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { newsApi, savedApi, authApi } from '../../lib/api';
import Sidebar from '../../components/Sidebar';
import WeatherWidget from '../../components/WeatherWidget';
import NewsCard from '../../components/NewsCard';
import styles from './dashboard.module.css';

const CATEGORIES = ['Tutte', 'Tecnologia', 'Economia', 'Sport', 'Politica', 'Scienza', 'Cultura'];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [category, setCategory] = useState('Tutte');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [saved, setSaved] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Verifica autenticazione
  useEffect(() => {
    const token = localStorage.getItem('nd_token');
    if (!token) { router.replace('/login'); return; }
    const stored = localStorage.getItem('nd_user');
    if (stored) setUser(JSON.parse(stored));
    else authApi.me().then(setUser).catch(() => router.replace('/login'));
  }, [router]);

  // Carica articoli salvati
  useEffect(() => {
    if (!user) return;
    savedApi.getAll().then(setSaved).catch(() => {});
  }, [user]);

  // Carica meteo
  useEffect(() => {
    if (!user) return;
    newsApi.getWeather('Torino').then(setWeather).catch(() => {});
  }, [user]);

  // Carica notizie
  const loadNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const cat = category === 'Tutte' ? '' : category.toLowerCase();
      const data = await newsApi.getHeadlines(cat, search);
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    if (user && view === 'home') loadNews();
  }, [user, view, loadNews]);

  const handleSave = async (article) => {
    const already = saved.find((a) => a.url === article.url);
    try {
      if (already) {
        await savedApi.remove(already._id);
        setSaved(saved.filter((a) => a._id !== already._id));
        showToast('Articolo rimosso dai preferiti');
      } else {
        const created = await savedApi.save(article);
        setSaved([created, ...saved]);
        showToast('Articolo salvato ✓');
      }
    } catch (err) {
      showToast('Errore: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nd_token');
    localStorage.removeItem('nd_user');
    router.replace('/login');
  };

  const displayArticles = view === 'saved' ? saved : articles;
  const isSaved = (url) => saved.some((a) => a.url === url);

  if (!user) return null;

  return (
    <div className={styles.app}>
      <Sidebar
        view={view}
        setView={setView}
        category={category}
        setCategory={(c) => { setCategory(c); setView('home'); }}
        savedCount={saved.length}
        user={user}
        onLogout={handleLogout}
      />

      <div className={styles.main}>
        {/* TOPBAR */}
        <div className={styles.topbar}>
          <h2>
            {view === 'saved'
              ? 'Articoli salvati'
              : category === 'Tutte'
              ? 'Tutte le notizie'
              : category}
          </h2>
          {view === 'home' && (
            <div className={styles.searchBox}>
              <span>🔍</span>
              <input
                placeholder="Cerca articoli..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadNews()}
              />
              <button onClick={loadNews} className={styles.searchBtn}>Cerca</button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {view === 'home' && weather && <WeatherWidget weather={weather} />}

          {/* FILTRI */}
          {view === 'home' && (
            <div className={styles.filters}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* STATI */}
          {loading && (
            <div className={styles.center}>
              <div className={styles.spinner} />
              <p>Caricamento notizie...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <p>⚠️ {error}</p>
              <button onClick={loadNews}>Riprova</button>
            </div>
          )}

          {/* GRIGLIA */}
          {!loading && !error && (
            displayArticles.length === 0 ? (
              <div className={styles.empty}>
                <span>{view === 'saved' ? '🔖' : '📰'}</span>
                <h3>{view === 'saved' ? 'Nessun articolo salvato' : 'Nessun risultato'}</h3>
                <p>
                  {view === 'saved'
                    ? 'Salva gli articoli dalla home con 🏷️'
                    : 'Prova con un\'altra categoria o parola chiave'}
                </p>
              </div>
            ) : (
              <div className={styles.grid}>
                {displayArticles.map((article, i) => (
                  <NewsCard
                    key={article.url || article._id || i}
                    article={article}
                    saved={isSaved(article.url)}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
