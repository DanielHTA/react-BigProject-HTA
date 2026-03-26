const mongoose = require('mongoose');

const savedArticleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    image: { type: String },
    source: { type: String },
    publishedAt: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

// Un utente non può salvare lo stesso articolo due volte
savedArticleSchema.index({ user: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('SavedArticle', savedArticleSchema);
