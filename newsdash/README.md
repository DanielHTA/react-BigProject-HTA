# NewsDash — Dashboard Notizie

Web app full-stack che integra notizie e meteo in un'unica dashboard.

## Stack tecnologico
- **Frontend**: Next.js 14 (App Router) + React
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **API esterne**: GNews API + OpenWeatherMap

## Struttura progetto
```
newsdash/
├── backend/      # Express API server
└── frontend/     # Next.js app
```

## Setup rapido

### 1. Clona il repo
```bash
git clone https://github.com/TUO_USERNAME/newsdash.git
cd newsdash
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Compila le variabili in .env
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Compila le variabili in .env.local
npm run dev
```

## Variabili d'ambiente

### backend/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/newsdash
JWT_SECRET=una_stringa_segreta_lunga
GNEWS_API_KEY=la_tua_chiave_gnews
OPENWEATHER_API_KEY=la_tua_chiave_openweather
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API GNews
Registrati su https://gnews.io per ottenere la chiave API gratuita (100 req/giorno).

## API OpenWeatherMap
Registrati su https://openweathermap.org/api per la chiave gratuita.

## Sprint Planning
| Sprint | Obiettivo |
|--------|-----------|
| 1 | Setup e architettura |
| 2 | Login + visualizzazione notizie ← **PR 2 (core)** |
| 3 | Filtro categoria |
| 4 | Salvataggio articoli |
| 5 | Bug fixing + prodotto finale |

## PR 2 — Feature verticale core
**Feed notizie con autenticazione**: l'utente si registra/accede → vede articoli reali da GNews → può filtrare per categoria.
