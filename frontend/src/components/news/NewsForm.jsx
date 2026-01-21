"use client";
import { Save, Image as ImageIcon } from 'lucide-react';
import { NEWS_CATEGORIES } from './newsConstants';

export default function NewsForm({ formData, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-bouilly-gold"
          placeholder="Ex: Saison Culturelle 2026"
        />
      </div>

      {/* Catégorie et Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => onChange({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-bouilly-gold"
          >
            {NEWS_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => onChange({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-bouilly-gold"
          />
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de l'image
        </label>
        <div className="flex items-center gap-2">
          <ImageIcon className="text-gray-400" size={20} />
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => onChange({ ...formData, image_url: e.target.value })}
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-bouilly-gold"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Preview"
            className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Contenu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => onChange({ ...formData, content: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-bouilly-gold resize-none"
          placeholder="Description de l'actualité..."
        />
      </div>

      {/* À la une */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.is_featured}
          onChange={(e) => onChange({ ...formData, is_featured: e.target.checked })}
          className="w-4 h-4 text-bouilly-gold focus:ring-bouilly-gold rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Mettre à la une
        </label>
      </div>

      {/* Boutons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors"
        >
          <Save size={18} />
          {isEditing ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
