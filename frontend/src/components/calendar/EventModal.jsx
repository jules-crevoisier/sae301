"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, MapPin, Clock, Tag } from 'lucide-react';

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

export const EventModal = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  const categoryColor = EVENT_CATEGORY_COLORS[event.category] || EVENT_CATEGORY_COLORS['GENERAL'];
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isMultiDay = endDate && startDate.toDateString() !== endDate.toDateString();

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-2">
                    {event.title}
                  </h2>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${categoryColor}`}>
                    <Tag size={12} />
                    {event.category}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Date et heure */}
                <div className="flex items-start gap-3">
                  <CalendarIcon className="text-bouilly-green mt-1" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {formatDate(startDate)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      <span>
                        {formatTime(startDate)}
                        {isMultiDay && ` - ${formatTime(endDate)}`}
                      </span>
                    </div>
                    {isMultiDay && (
                      <div className="text-sm text-gray-600 mt-1">
                        Jusqu'au {formatDate(endDate)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lieu */}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-bouilly-green mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-gray-900">Lieu</div>
                      <div className="text-sm text-gray-600 mt-1">{event.location}</div>
                    </div>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="font-semibold text-gray-900 mb-2">Description</div>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {event.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
