'use client';

import { useCallback, useEffect, useState } from 'react';
import { Article, fetchNews, NEWS_CATEGORIES } from '@/lib/news';
import NewsCard from './NewsCard';

interface NewsSectionProps {
  searchQuery: string;
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden p-3 flex gap-3">
      <div className="skeleton w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-3.5 w-full rounded-full" />
        <div className="skeleton h-3.5 w-4/5 rounded-full" />
        <div className="skeleton h-3.5 w-3/5 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonFeatured() {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="skeleton h-64 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-5 w-full rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded-full" />
        <div className="skeleton h-3 w-32 rounded-full" />
      </div>
    </div>
  );
}

export default function NewsSection({ searchQuery }: NewsSectionProps) {
  const [category, setCategory] = useState('top');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(
    async (cat: string, q: string, pg: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNews(cat, q, pg);
        setArticles(data.articles);
        setTotalPages(Math.min(data.pages, 10));
      } catch (e) {
        setError('Impossibile caricare le notizie. Riprova tra poco.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    load(category, searchQuery, 1);
  }, [category, searchQuery, load]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    load(category, searchQuery, newPage);
    document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategory = (id: string) => {
    setCategory(id);
    setPage(1);
  };

  const featured = articles.slice(0, 2);
  const rest = articles.slice(2);

  return (
    <div id="news-section">
      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            className={`cat-pill flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium border transition-all ${
              category === cat.id
                ? 'active bg-amber-500/15 text-amber-400 border-amber-500/40'
                : 'text-white/50 border-white/10 hover:text-amber-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="glass rounded-2xl p-6 text-center text-white/50 font-body text-sm">
          <span className="text-2xl block mb-2">⚠️</span>
          {error}
        </div>
      )}

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <SkeletonFeatured />
            <SkeletonFeatured />
          </div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </>
      ) : (
        <>
          {/* Featured 2 */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {featured.map((article, i) => (
                <NewsCard key={article.id} article={article} featured index={i} />
              ))}
            </div>
          )}

          {/* Rest as compact list */}
          {rest.length > 0 && (
            <div className="space-y-3 mb-6">
              {rest.map((article, i) => (
                <NewsCard key={article.id} article={article} index={i + 2} />
              ))}
            </div>
          )}

          {articles.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-white/50 font-body text-sm">Nessun risultato trovato.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl glass border border-white/10 text-sm font-body text-white/60 disabled:opacity-30 hover:text-white transition-colors"
              >
                ← Precedente
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-body transition-all ${
                        p === page
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'glass border border-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl glass border border-white/10 text-sm font-body text-white/60 disabled:opacity-30 hover:text-white transition-colors"
              >
                Successiva →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
