"use client";

/**
 * Retourne la date de début d'un événement (à minuit).
 * @param {Object} event - { start_date }
 * @returns {Date}
 */
export const getEventStartDate = (event) => {
  const d = new Date(event.start_date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Retourne la date de fin d'un événement (à minuit).
 * @param {Object} event - { end_date?, start_date }
 * @returns {Date}
 */
export const getEventEndDate = (event) => {
  if (!event.end_date) return getEventStartDate(event);
  const d = new Date(event.end_date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Vrai si l'événement s'étend sur plus d'un jour.
 */
export const isMultiDayEvent = (event) => {
  const start = getEventStartDate(event);
  const end = getEventEndDate(event);
  return end.getTime() > start.getTime();
};

/**
 * Vrai si la date (à minuit) est entre start et end (inclus).
 */
export const isDateInEventRange = (date, event) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const start = getEventStartDate(event);
  const end = getEventEndDate(event);
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
};

/**
 * Pour un événement multi-jours et une semaine (début = dimanche, fin = samedi),
 * retourne { startCol (0-6), span (1-7) } pour la barre dans cette semaine, ou null.
 * @param {Object} event
 * @param {Date} weekStart - premier jour de la semaine (dimanche)
 * @param {Date} weekEnd - dernier jour de la semaine (samedi)
 */
export const getMultiDaySegmentInWeek = (event, weekStart, weekEnd) => {
  const start = getEventStartDate(event);
  const end = getEventEndDate(event);
  const wStart = new Date(weekStart);
  wStart.setHours(0, 0, 0, 0);
  const wEnd = new Date(weekEnd);
  wEnd.setHours(0, 0, 0, 0);
  if (end.getTime() < wStart.getTime() || start.getTime() > wEnd.getTime()) return null;
  const segStart = start.getTime() < wStart.getTime() ? wStart : start;
  const segEnd = end.getTime() > wEnd.getTime() ? wEnd : end;
  const startCol = Math.round((segStart.getTime() - wStart.getTime()) / (24 * 60 * 60 * 1000));
  const endCol = Math.round((segEnd.getTime() - wStart.getTime()) / (24 * 60 * 60 * 1000));
  const span = endCol - startCol + 1;
  return { startCol, span };
};
