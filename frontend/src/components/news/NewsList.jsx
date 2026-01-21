"use client";
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from './NewsCard';

export default function NewsList({ news, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[4/5] rounded-2xl bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-bouilly-green text-white rounded-full hover:bg-bouilly-darkGreen transition-colors"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-bouilly-darkGreen text-lg">Aucune actualité disponible</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      <AnimatePresence>
        {news.map((item, index) => (
          <NewsCard key={item.id || item.title} item={item} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
