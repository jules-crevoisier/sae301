"use client";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const CalendarHeader = ({ currentDate, onPreviousMonth, onNextMonth, onToday }) => {
  const monthName = MONTHS[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white rounded-2xl p-6 shadow-sm border border-bouilly-green/10">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-bouilly-cream rounded-2xl border border-bouilly-gold/20 flex items-center justify-center shadow-inner">
          <CalendarIcon className="text-bouilly-gold" size={28} />
        </div>
        <div>
          <h2 className="font-title font-bold text-3xl text-bouilly-darkGreen capitalize">
            {monthName} <span className="text-bouilly-green">{year}</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium">Agenda des événements municipaux</p>
        </div>
      </div>

      <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
        <button
          onClick={onPreviousMonth}
          className="p-3 rounded-lg hover:bg-white hover:text-bouilly-gold hover:shadow-sm transition-all text-gray-400"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        <button
          onClick={onToday}
          className="px-6 py-2 bg-white text-bouilly-darkGreen rounded-lg shadow-sm border border-gray-100 font-title font-bold text-xs uppercase tracking-wider hover:text-bouilly-gold transition-colors"
        >
          Aujourd'hui
        </button>
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        <button
          onClick={onNextMonth}
          className="p-3 rounded-lg hover:bg-white hover:text-bouilly-gold hover:shadow-sm transition-all text-gray-400"
          aria-label="Mois suivant"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};