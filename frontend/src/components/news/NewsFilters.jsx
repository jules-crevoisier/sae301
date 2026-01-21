"use client";
import { NEWS_CATEGORIES_WITH_ALL } from "../../utils/newsConstants";

export default function NewsFilters({ selectedCategory, onCategoryChange }) {
  return (
    <section className="py-8 bg-white border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {NEWS_CATEGORIES_WITH_ALL.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-bouilly-green text-white shadow-md"
                  : "bg-bouilly-cream text-bouilly-darkGreen hover:bg-bouilly-green/10"
              }`}
            >
              {category === "all" ? "Toutes" : category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
