/**
 * Constantes pour les actualités
 */

export const NEWS_CATEGORIES = [
  'CULTURE',
  'FESTIVITÉS',
  'SANTÉ',
  'TRAVAUX',
  'CITOYENNETÉ',
  'ENVIRONNEMENT',
  'URBANISME',
  'NUMÉRIQUE'
];

export const NEWS_CATEGORIES_WITH_ALL = [
  'all',
  ...NEWS_CATEGORIES
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80";
