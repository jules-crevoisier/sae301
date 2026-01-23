"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import NewsCard from './NewsCard';

export default function NewsList({ news, loading, error, onRetry }) {
  // Squelette de chargement
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12 pt-2">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-[2rem] p-4 border border-gray-100 h-[400px] flex flex-col gap-4">
            <div className="aspect-[4/3] rounded-xl bg-gray-100 animate-pulse w-full"></div>
            <div className="flex-1 space-y-3 px-2">
               <div className="h-6 bg-gray-100 rounded-full w-3/4 animate-pulse"></div>
               <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse"></div>
               <div className="h-4 bg-gray-100 rounded-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 mx-auto max-w-2xl mt-4">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  // État vide
  if (news.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Newspaper size={40} className="text-bouilly-green opacity-50" />
        </div>
        <h3 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-2">Aucune actualité trouvée</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Il n'y a pas d'articles correspondant à votre recherche pour le moment.
        </p>
      </motion.div>
    );
  }

  // Liste des actualités
  return (
    <motion.div
      layout
      // pt-2 pour coller aux filtres, pb-12 pour aérer le bas avant la pagination
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12 pt-2"
    >
      <AnimatePresence mode="popLayout">
        {news.map((item, index) => (
          <NewsCard key={item.id || item.title} item={item} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}