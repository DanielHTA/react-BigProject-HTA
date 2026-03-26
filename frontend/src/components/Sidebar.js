import styles from './Sidebar.module.css';

const NAV_CATEGORIES = [
  { label: 'Tecnologia', icon: '💻' },
  { label: 'Economia',   icon: '📈' },
  { label: 'Sport',      icon: '⚽' },
  { label: 'Politica',   icon: '🏛️' },
  { label: 'Scienza',    icon: '🔬' },
  { label: 'Cultura',    icon: '🎬' },
];

export default function Sidebar({ view, setView, category, setCategory, savedCount, user, onLogout }) {
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className={styles.sidebar}>
      <div className={styles.brand}>
        NewsDash
        <span>Dashboard Notizie</span>
      </div>

      <p className={styles.section}>Sezioni</p>
      <button
        className={`${styles.item} ${view === 'home' ? styles.active : ''}`}
        onClick={() => setView('home')}
      >
        <span>🏠</span> Home
      </button>
      <button
        className={`${styles.item} ${view === 'saved' ? styles.active : ''}`}
        onClick={() => setView('saved')}
      >
        <span>🔖</span> Salvati
        {savedCount > 0 && <span className={styles.badge}>{savedCount}</span>}
      </button>

      <p className={styles.section}>Categorie</p>
      {NAV_CATEGORIES.map(({ label, icon }) => (
        <button
          key={label}
          className={`${styles.item} ${category === label && view === 'home' ? styles.active : ''}`}
          onClick={() => setCategory(label)}
        >
          <span>{icon}</span> {label}
        </button>
      ))}

      <div className={styles.bottom}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button className={styles.logout} onClick={onLogout}>← Esci</button>
      </div>
    </nav>
  );
}
