import Image from 'next/image';
import styles from './NewsCard.module.css';

const CAT_COLORS = {
  tecnologia: '#7c5cbf',
  economia:   '#2980b9',
  sport:      '#27ae60',
  politica:   '#c0392b',
  scienza:    '#16a085',
  cultura:    '#d35400',
  generale:   '#8e44ad',
};

export default function NewsCard({ article, saved, onSave }) {
  const color = CAT_COLORS[article.category?.toLowerCase()] || '#7c5cbf';
  const pub = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap} style={{ background: `${color}22` }}>
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        ) : (
          <span className={styles.placeholder}>📰</span>
        )}
        {article.category && (
          <span className={styles.cat} style={{ background: color }}>
            {article.category}
          </span>
        )}
        <button
          className={styles.saveBtn}
          onClick={() => onSave(article)}
          title={saved ? 'Rimuovi dai salvati' : 'Salva articolo'}
        >
          {saved ? '🔖' : '🏷️'}
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.source}>{article.source}</div>
        <div className={styles.title}>{article.title}</div>
        {article.description && (
          <div className={styles.desc}>{article.description}</div>
        )}
        <div className={styles.footer}>
          <span className={styles.time}>🕐 {pub}</span>
          {article.url && (
            <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.readBtn}>
              Leggi tutto →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
