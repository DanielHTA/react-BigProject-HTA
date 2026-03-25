# 📰 Cronache — News & Meteo

App Next.js con news in tempo reale e meteo della tua città. Deploy automatico su GitHub Pages.

## 🚀 Deploy su GitHub Pages (in 3 passi)

### 1. Crea il repository su GitHub
- Vai su [github.com/new](https://github.com/new)
- Scegli un nome (es. `cronache-app`)
- Clicca **Create repository**

### 2. Carica il codice
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/NOME_REPO.git
git push -u origin main
```

### 3. Abilita GitHub Pages
- Vai su **Settings → Pages**
- In **Source**, seleziona **GitHub Actions**
- Salva

Il workflow `.github/workflows/deploy.yml` si attiverà automaticamente ad ogni push su `main`.  
La tua app sarà disponibile su `https://TUO_USERNAME.github.io/NOME_REPO/`

---

## 🔧 Sviluppo locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## 🌐 API utilizzate

| Servizio | API | Chiave | Costo |
|----------|-----|--------|-------|
| Meteo | [Open-Meteo](https://open-meteo.com/) | ❌ Non richiesta | Gratuito |
| Geocoding inverso | [Nominatim (OSM)](https://nominatim.org/) | ❌ Non richiesta | Gratuito |
| Notizie | [The Guardian](https://open-platform.theguardian.com/) | ✅ Chiave `test` inclusa | Gratuito |

> **Notizie**: La chiave `test` di The Guardian funziona subito ma ha limiti di rate.  
> Per un uso intensivo, registrati gratis su [open-platform.theguardian.com](https://open-platform.theguardian.com/) e sostituisci `test` con la tua chiave in `lib/news.ts`.

---

## 📁 Struttura progetto

```
├── app/
│   ├── layout.tsx       # Layout root con font
│   ├── page.tsx         # Pagina principale
│   └── globals.css      # Stili globali
├── components/
│   ├── Header.tsx       # Intestazione con ricerca
│   ├── WeatherWidget.tsx # Widget meteo
│   ├── NewsSection.tsx  # Sezione notizie con filtri
│   └── NewsCard.tsx     # Card singola notizia
├── lib/
│   ├── weather.ts       # Logica API meteo
│   └── news.ts          # Logica API notizie
├── .github/
│   └── workflows/
│       └── deploy.yml   # Deploy automatico GitHub Pages
└── next.config.js       # Config Next.js (export statico)
```
