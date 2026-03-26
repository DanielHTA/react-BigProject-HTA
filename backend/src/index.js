require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const savedRoutes = require('./routes/saved');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connesso'))
  .catch((err) => console.error('❌ Errore MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/saved', savedRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server in ascolto su porta ${PORT}`));
