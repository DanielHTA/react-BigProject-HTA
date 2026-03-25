import { Article, timeAgo } from '@/lib/news';

interface NewsCardProps {
  article: Article;
  featured?: boolean;
  index?: number;
}

export default function NewsCard({ article, featured = false, index = 0 }: NewsCardProps) {
  const delay = Math.min(index * 60, 400);
  const thumb = article.fields?.thumbnail;
  const excerpt = article.fields?.trailText?.replace(/<[^>]+>/g, '');
  const byline = article.fields?.byline;

  if (featured) {
    return (
      <a
        href={article.webUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="news-card block glass rounded-3xl overflow-hidden group animate-slide-up"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
      >
        {thumb && (
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <img
              src={thumb}
              alt={article.webTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-2">
                {article.sectionName}
              </span>
            </div>
          </div>
        )}
        <div className="p-5">
          {!thumb && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
              {article.sectionName}
            </span>
          )}
          <h2 className="font-display text-xl text-white leading-snug mb-2 group-hover:text-amber-300 transition-colors duration-200">
            {article.webTitle}
          </h2>
          {excerpt && (
            <p className="text-white/50 text-sm font-body leading-relaxed line-clamp-2 mb-3">
              {excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-white/30 font-body">
            <span>{byline || 'The Guardian'}</span>
            <span>{timeAgo(article.webPublicationDate)}</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={article.webUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card flex gap-3 glass rounded-2xl overflow-hidden group p-3 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {thumb && (
        <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
          <img
            src={thumb}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <span className="text-xs font-body font-semibold text-amber-400/70 uppercase tracking-wider">
            {article.sectionName}
          </span>
          <h3 className="font-body font-semibold text-sm text-white leading-snug mt-0.5 group-hover:text-amber-300 transition-colors line-clamp-3">
            {article.webTitle}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30 font-body mt-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{timeAgo(article.webPublicationDate)}</span>
        </div>
      </div>
    </a>
  );
}
