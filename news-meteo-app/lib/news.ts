// The Guardian Open Platform — chiave "test" gratuita, funziona subito.
// Per maggiori richieste: https://open-platform.theguardian.com/
const GUARDIAN_API_KEY = 'test';
const GUARDIAN_BASE = 'https://content.guardianapis.com';

export interface Article {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
    byline?: string;
  };
}

export interface NewsResponse {
  articles: Article[];
  total: number;
  currentPage: number;
  pages: number;
}

export const NEWS_CATEGORIES = [
  { id: 'top', label: 'In Primo Piano', query: 'politics|economy|world', section: '' },
  { id: 'world', label: 'Mondo', query: '', section: 'world' },
  { id: 'technology', label: 'Tecnologia', query: '', section: 'technology' },
  { id: 'science', label: 'Scienza', query: '', section: 'science' },
  { id: 'sport', label: 'Sport', query: '', section: 'sport' },
  { id: 'culture', label: 'Cultura', query: '', section: 'culture' },
  { id: 'environment', label: 'Ambiente', query: '', section: 'environment' },
  { id: 'business', label: 'Economia', query: '', section: 'business' },
];

export async function fetchNews(
  category: string = 'top',
  search: string = '',
  page: number = 1
): Promise<NewsResponse> {
  const cat = NEWS_CATEGORIES.find((c) => c.id === category) ?? NEWS_CATEGORIES[0];

  const params = new URLSearchParams({
    'api-key': GUARDIAN_API_KEY,
    'show-fields': 'thumbnail,trailText,byline',
    'page-size': '12',
    page: String(page),
    'order-by': 'newest',
  });

  if (search.trim()) {
    params.set('q', search.trim());
  } else if (cat.section) {
    params.set('section', cat.section);
  } else if (cat.query) {
    params.set('q', cat.query);
  }

  const url = `${GUARDIAN_BASE}/search?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Guardian API error: ${res.status}`);

  const data = await res.json();
  const r = data.response;

  return {
    articles: r.results as Article[],
    total: r.total,
    currentPage: r.currentPage,
    pages: r.pages,
  };
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ore fa`;
  const days = Math.floor(hours / 24);
  return `${days} giorni fa`;
}
