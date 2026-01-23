"use client";
import { EventAdminCard } from './EventAdminCard';
import { Calendar, AlertCircle } from 'lucide-react';

export const EventAdminList = ({ events, loading, searchTerm, onCreate, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bouilly-green mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-gray-400" size={32} />
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2">Aucun événement</h3>
        <p className="text-gray-600 mb-6">
          {searchTerm
            ? 'Aucun événement ne correspond à votre recherche'
            : 'Commencez par créer votre premier événement'}
        </p>
        {!searchTerm && (
          <button
            onClick={onCreate}
            className="px-6 py-3 bg-bouilly-green text-white rounded-lg font-semibold hover:bg-bouilly-darkGreen transition-colors"
          >
            Créer un événement
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventAdminCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
