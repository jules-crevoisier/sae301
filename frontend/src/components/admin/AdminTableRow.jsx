"use client";
import { Edit2, Trash2, Save, X } from 'lucide-react';

export default function AdminTableRow({ 
  inscription, 
  isEditing, 
  editForm, 
  onEditFormChange,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
  formatDate
}) {
  if (isEditing) {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {inscription.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="text"
            value={editForm.nom}
            onChange={(e) => onEditFormChange({ ...editForm, nom: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bouilly-gold/20 text-sm"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="text"
            value={editForm.prenom}
            onChange={(e) => onEditFormChange({ ...editForm, prenom: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bouilly-gold/20 text-sm"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="text"
            value={editForm.classe}
            onChange={(e) => onEditFormChange({ ...editForm, classe: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bouilly-gold/20 text-sm"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="email"
            value={editForm.email_parent}
            onChange={(e) => onEditFormChange({ ...editForm, email_parent: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bouilly-gold/20 text-sm"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="text"
            value={editForm.regime_alimentaire}
            onChange={(e) => onEditFormChange({ ...editForm, regime_alimentaire: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bouilly-gold/20 text-sm"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(inscription.created_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onSave(inscription.id)}
              className="text-green-600 hover:text-green-800 transition-colors"
              title="Enregistrer"
            >
              <Save size={18} />
            </button>
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              title="Annuler"
            >
              <X size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {inscription.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {inscription.nom}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {inscription.prenom}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {inscription.classe}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {inscription.email_parent}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {inscription.regime_alimentaire}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(inscription.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onStartEdit(inscription)}
            className="text-bouilly-gold hover:text-bouilly-green transition-colors"
            title="Modifier"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(inscription.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
