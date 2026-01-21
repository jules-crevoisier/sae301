"use client";
import { isFeatured } from "@/utils/newsUtils";

export default function NewsAdminStats({ news, filteredCount }) {
  const featuredCount = news.filter(isFeatured).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Total actualités</p>
        <p className="text-2xl font-bold text-bouilly-darkGreen">
          {news.length}
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">À la une</p>
        <p className="text-2xl font-bold text-bouilly-darkGreen">
          {featuredCount}
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Résultats de recherche</p>
        <p className="text-2xl font-bold text-bouilly-darkGreen">
          {filteredCount}
        </p>
      </div>
    </div>
  );
}
