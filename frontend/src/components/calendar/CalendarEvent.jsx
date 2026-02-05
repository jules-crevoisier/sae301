"use client";
import { motion } from 'framer-motion';

// Couleurs pastels harmonisées
const EVENT_STYLES = {
  'GENERAL': 'bg-gray-100 text-gray-600 border-gray-200',
  'CULTURE': 'bg-purple-50 text-purple-700 border-purple-100',
  'FESTIVITÉS': 'bg-amber-50 text-amber-700 border-amber-100',
  'SANTÉ': 'bg-rose-50 text-rose-700 border-rose-100',
  'TRAVAUX': 'bg-orange-50 text-orange-700 border-orange-100',
  'CITOYENNETÉ': 'bg-blue-50 text-blue-700 border-blue-100',
  'ENVIRONNEMENT': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'URBANISME': 'bg-slate-50 text-slate-700 border-slate-100',
  'SPORT': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'EDUCATION': 'bg-pink-50 text-pink-700 border-pink-100'
};

export const CalendarEvent = ({ event, onClick }) => {
  const style = EVENT_STYLES[event.category] || EVENT_STYLES['GENERAL'];
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className={`
        ${style}
        w-full text-left px-2 py-1 rounded-md border
        text-[10px] font-semibold truncate leading-tight
        shadow-sm hover:shadow transition-all
      `}
    >
      {event.title}
    </motion.button>
  );
};