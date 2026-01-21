/**
 * Utilitaires pour les actualités
 */

import { DEFAULT_IMAGE } from './newsConstants';

// Ré-export pour faciliter les imports
export { DEFAULT_IMAGE };

/**
 * Formate une date au format court (ex: "15 Oct.")
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'En cours';
  
  try {
    const date = new Date(dateString);
    const months = ['Janv.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  } catch {
    return dateString;
  }
};

/**
 * Formate une date au format long (ex: "15 octobre 2026")
 */
export const formatDateLong = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Vérifie si une actualité est à la une
 */
export const isFeatured = (newsItem) => {
  return newsItem.is_featured === 1 || newsItem.is_featured === true;
};
