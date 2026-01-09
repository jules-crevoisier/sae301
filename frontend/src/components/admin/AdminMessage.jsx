"use client";
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function AdminMessage({ message, onClose }) {
  if (!message.text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border-2 flex items-center gap-3 mb-6 ${
        message.type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {message.type === 'success' ? (
        <CheckCircle2 size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <p className="flex-1 text-sm font-medium">{message.text}</p>
      <button
        onClick={onClose}
        className="text-current hover:opacity-70"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}
