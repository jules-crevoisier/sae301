"use client";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import NewsForm from './NewsForm';

export default function NewsFormModal({ isOpen, onClose, formData, onChange, onSubmit, isEditing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen">
            {isEditing ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <NewsForm
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onClose}
          isEditing={isEditing}
        />
      </motion.div>
    </div>
  );
}
