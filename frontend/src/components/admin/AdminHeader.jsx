"use client";
import { motion } from 'framer-motion';
import { Users, RefreshCw } from 'lucide-react';

export default function AdminHeader({ onRefresh }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-bouilly-green/10 rounded-full flex items-center justify-center">
            <Users className="text-bouilly-green" size={24} />
          </div>
          <div>
            <h1 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen mb-2">
              Panel d'Administration
            </h1>
            <p className="text-gray-600 text-sm">
              Gestion des inscriptions à la cantine
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors"
          title="Actualiser"
        >
          <RefreshCw size={18} />
          <span className="hidden md:inline">Actualiser</span>
        </button>
      </div>
    </motion.div>
  );
}
