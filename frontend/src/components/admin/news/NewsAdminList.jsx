"use client";
import { FileText, Plus } from 'lucide-react';
import NewsAdminCard from './NewsAdminCard';

export default function NewsAdminList({ news, loading, searchTerm, onCreate, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bouilly-green mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-500">
        <FileText size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">
          {searchTerm ? 'Aucun résultat trouvé' : 'Aucune actualité pour le moment'}
        </p>
        <p className="text-sm mb-4">
          {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Créez votre première actualité'}
        </p>
        {!searchTerm && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors"
          >
            <Plus size={18} />
            Créer une actualité
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsAdminCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
