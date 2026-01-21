"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2 rounded-full border transition-all ${
          currentPage === 1
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-bouilly-green text-bouilly-green hover:bg-bouilly-green hover:text-white'
        }`}
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-bouilly-darkGreen font-medium">
        Page {currentPage} sur {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full border transition-all ${
          currentPage === totalPages
            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-bouilly-green text-bouilly-green hover:bg-bouilly-green hover:text-white'
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
