"use client";
import { EVENT_CATEGORIES } from '@/utils/eventConstants';

export const EventForm = ({ formData, onChange, onSubmit, isLoading, isEditing }) => {
  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Titre */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bouilly-green focus:border-bouilly-green outline-none transition-all"
          placeholder="Ex: Conseil municipal"
        />
      </div>

      {/* Catégorie */}
      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
          Catégorie <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bouilly-green focus:border-bouilly-green outline-none transition-all"
        >
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date de début */}
      <div>
        <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
          Date de début <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          id="start_date"
          value={formData.start_date}
          onChange={(e) => handleChange('start_date', e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bouilly-green focus:border-bouilly-green outline-none transition-all"
        />
      </div>

      {/* Date de fin */}
      <div>
        <label htmlFor="end_date" className="block text-sm font-semibold text-gray-700 mb-2">
          Date de fin (optionnel)
        </label>
        <input
          type="datetime-local"
          id="end_date"
          value={formData.end_date || ''}
          onChange={(e) => handleChange('end_date', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bouilly-green focus:border-bouilly-green outline-none transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si non renseignée, la date de fin sera identique à la date de début
        </p>
      </div>

      {/* Lieu */}
      <div>
        <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
          Lieu
        </label>
        <input
          type="text"
          id="location"
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bouilly-green focus:border-bouilly-green outline-none transition-all"
          placeholder="Ex: Salle des fêtes"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={5}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bouilly-green focus:border-bouilly-green outline-none transition-all resize-none"
          placeholder="Description de l'événement..."
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-bouilly-green text-white rounded-lg font-semibold hover:bg-bouilly-darkGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};
