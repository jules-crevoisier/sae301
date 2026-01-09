"use client";
import { Search } from 'lucide-react';

export default function AdminSearchBar({ value, onChange }) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Rechercher par nom, prénom, classe, email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-bouilly-gold focus:ring-bouilly-gold/20"
      />
    </div>
  );
}
