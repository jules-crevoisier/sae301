"use client";
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

const EVENT_CATEGORY_COLORS = {
  'GENERAL': 'bg-blue-100 text-blue-700 border-blue-200',
  'CULTURE': 'bg-purple-100 text-purple-700 border-purple-200',
  'FESTIVITÉS': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'SANTÉ': 'bg-red-100 text-red-700 border-red-200',
  'TRAVAUX': 'bg-orange-100 text-orange-700 border-orange-200',
  'CITOYENNETÉ': 'bg-green-100 text-green-700 border-green-200',
  'ENVIRONNEMENT': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'URBANISME': 'bg-gray-100 text-gray-700 border-gray-200',
  'SPORT': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'EDUCATION': 'bg-pink-100 text-pink-700 border-pink-200'
};

export const CalendarEvent = ({ event, onClick }) => {
  const categoryColor = EVENT_CATEGORY_COLORS[event.category] || EVENT_CATEGORY_COLORS['GENERAL'];
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isMultiDay = endDate && startDate.toDateString() !== endDate.toDateString();

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => onClick?.(event)}
      className={`
        ${categoryColor}
        border rounded-lg p-2 mb-1 cursor-pointer
        hover:shadow-md transition-all duration-200
        text-xs
      `}
    >
      <div className="font-semibold truncate mb-1">{event.title}</div>
      <div className="flex items-center gap-1 text-xs opacity-80">
        <Clock size={10} />
        <span>
          {formatTime(startDate)}
          {isMultiDay && ` - ${formatTime(endDate)}`}
        </span>
      </div>
      {event.location && (
        <div className="flex items-center gap-1 text-xs opacity-80 mt-1">
          <MapPin size={10} />
          <span className="truncate">{event.location}</span>
        </div>
      )}
    </motion.div>
  );
};
