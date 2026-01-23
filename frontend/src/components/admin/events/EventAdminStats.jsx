"use client";
import { Calendar, Tag } from 'lucide-react';

export const EventAdminStats = ({ events, filteredCount }) => {
  const categoriesCount = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-bouilly-green/10 rounded-xl flex items-center justify-center">
            <Calendar className="text-bouilly-green" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-bouilly-darkGreen">{events.length}</div>
            <div className="text-sm text-gray-600">Total événements</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Tag className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-bouilly-darkGreen">{Object.keys(categoriesCount).length}</div>
            <div className="text-sm text-gray-600">Catégories</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Calendar className="text-purple-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-bouilly-darkGreen">{filteredCount}</div>
            <div className="text-sm text-gray-600">Résultats filtrés</div>
          </div>
        </div>
      </div>
    </div>
  );
};
