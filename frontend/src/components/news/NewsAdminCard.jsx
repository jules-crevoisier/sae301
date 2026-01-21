"use client";
import { motion } from 'framer-motion';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { formatDateLong, isFeatured, DEFAULT_IMAGE } from './newsUtils';

export default function NewsAdminCard({ item, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={item.image_url || DEFAULT_IMAGE}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {isFeatured(item) && (
          <div className="absolute top-2 right-2 bg-bouilly-gold text-white px-2 py-1 rounded text-xs font-bold">
            À la une
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-bouilly-green text-white px-2 py-1 rounded text-xs font-bold">
          {item.category}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-title font-bold text-lg text-bouilly-darkGreen mb-2 line-clamp-2">
          {item.title}
        </h3>
        {item.content && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.content}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar size={14} />
          <span>{formatDateLong(item.date)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-bouilly-green/10 text-bouilly-green rounded-lg hover:bg-bouilly-green hover:text-white transition-colors"
          >
            <Edit size={16} />
            <span>Modifier</span>
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
