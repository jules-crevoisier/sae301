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
    <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-bouilly-green/10 rounded-xl flex items-center justify-center">
          <CalendarIcon className="text-bouilly-green" size={24} />
        </div>
        <div>
          <h2 className="font-title font-bold text-2xl text-bouilly-darkGreen">
            {monthName} {year}
          </h2>
          <p className="text-sm text-gray-600">Calendrier des événements</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button
          onClick={onToday}
          className="px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors text-sm font-semibold"
        >
          Aujourd'hui
        </button>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};
