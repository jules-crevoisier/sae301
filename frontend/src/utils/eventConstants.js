/**
 * Constantes pour les événements
 */

export const EVENT_CATEGORIES = [
  'GENERAL',
  'CULTURE',
  'FESTIVITÉS',
  'SANTÉ',
  'TRAVAUX',
  'CITOYENNETÉ',
  'ENVIRONNEMENT',
  'URBANISME',
  'SPORT',
  'EDUCATION'
];

export const EVENT_CATEGORIES_WITH_ALL = [
  'all',
  ...EVENT_CATEGORIES
];

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
