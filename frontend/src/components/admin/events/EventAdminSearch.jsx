"use client";
import { Search } from 'lucide-react';

export const EventAdminSearch = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="text-gray-400" size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un événement (titre, catégorie, lieu...)"
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bouilly-green focus:border-bouilly-green outline-none transition-all"
      />
    </div>
  );
};
