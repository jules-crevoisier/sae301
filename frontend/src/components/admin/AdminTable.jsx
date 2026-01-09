"use client";
import { motion } from 'framer-motion';
import { Loader2, Users } from 'lucide-react';
import AdminTableRow from './AdminTableRow';

export default function AdminTable({ 
  loading, 
  inscriptions, 
  searchTerm,
  editingId,
  editForm,
  onEditFormChange,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
  formatDate
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-bouilly-green" size={40} />
      </div>
    );
  }

  if (inscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Users size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium">
          {searchTerm ? 'Aucun résultat trouvé' : 'Aucune inscription pour le moment'}
        </p>
        <p className="text-sm mt-2">
          {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Les inscriptions apparaîtront ici une fois créées'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-bouilly-green/10 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              Prénom
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              Classe
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              Email Parent
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              Régime
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-bouilly-darkGreen uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {inscriptions.map((inscription) => (
            <AdminTableRow
              key={inscription.id}
              inscription={inscription}
              isEditing={editingId === inscription.id}
              editForm={editForm}
              onEditFormChange={onEditFormChange}
              onStartEdit={onStartEdit}
              onSave={onSave}
              onCancel={onCancel}
              onDelete={onDelete}
              formatDate={formatDate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
