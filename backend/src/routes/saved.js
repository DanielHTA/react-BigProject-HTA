const express = require('express');
const SavedArticle = require('../models/SavedArticle');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/saved — tutti gli articoli salvati dall'utente
router.get('/', protect, async (req, res) => {
  try {
    const articles = await SavedArticle.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero articoli', error: err.message });
  }
});

// POST /api/saved — salva un articolo
router.post('/', protect, async (req, res) => {
  const { title, description, url, image, source, publishedAt, category } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Titolo e URL sono obbligatori' });
  }

  try {
    const article = await SavedArticle.create({
      user: req.user._id,
      title,
      description,
      url,
      image,
      source,
      publishedAt,
      category,
    });
    res.status(201).json(article);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Articolo già salvato' });
    }
    res.status(500).json({ message: 'Errore nel salvataggio', error: err.message });
  }
});

// DELETE /api/saved/:id — rimuovi un articolo salvato
router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await SavedArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Articolo non trovato' });
    if (article.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }
    await article.deleteOne();
    res.json({ message: 'Articolo rimosso' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nella rimozione', error: err.message });
  }
});

module.exports = router;
