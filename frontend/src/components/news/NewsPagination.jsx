"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-6 mt-16 pb-12">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
          currentPage === 1
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-bouilly-green text-bouilly-green hover:bg-bouilly-green hover:text-white hover:shadow-lg'
        }`}
        aria-label="Page précédente"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-2 font-title font-bold text-bouilly-darkGreen">
        <span className="text-xl">{currentPage}</span>
        <span className="text-gray-300 text-lg">/</span>
        <span className="text-lg text-gray-400">{totalPages}</span>
      </div>
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-bouilly-green text-bouilly-green hover:bg-bouilly-green hover:text-white hover:shadow-lg'
        }`}
        aria-label="Page suivante"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}