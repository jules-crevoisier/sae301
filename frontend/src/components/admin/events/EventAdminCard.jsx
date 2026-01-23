"use client";
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag, Edit, Trash2 } from 'lucide-react';

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

export const EventAdminCard = ({ event, onEdit, onDelete }) => {
  const categoryColor = EVENT_CATEGORY_COLORS[event.category] || EVENT_CATEGORY_COLORS['GENERAL'];
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isMultiDay = endDate && startDate.toDateString() !== endDate.toDateString();

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.title}</h3>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${categoryColor}`}>
            <Tag size={12} />
            {event.category}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-bouilly-green" />
          <span>
            {formatDate(startDate)} à {formatTime(startDate)}
            {isMultiDay && ` - ${formatDate(endDate)} à ${formatTime(endDate)}`}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-bouilly-green" />
            <span>{event.location}</span>
          </div>
        )}
        {event.description && (
          <p className="text-gray-700 mt-2 line-clamp-2">{event.description}</p>
        )}
      </div>
    </motion.div>
  );
};
