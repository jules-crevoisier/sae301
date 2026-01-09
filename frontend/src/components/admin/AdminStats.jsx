"use client";

export default function AdminStats({ total, filtered, editing }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Total inscriptions</p>
        <p className="text-2xl font-bold text-bouilly-darkGreen">{total}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Résultats de recherche</p>
        <p className="text-2xl font-bold text-bouilly-darkGreen">{filtered}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">En cours d'édition</p>
        <p className="text-2xl font-bold text-bouilly-darkGreen">{editing ? 1 : 0}</p>
      </div>
    </div>
  );
}
