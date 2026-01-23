"use client";
import { NEWS_CATEGORIES_WITH_ALL } from "@/utils/newsConstants";
import { motion } from "framer-motion";

export default function NewsFilters({ selectedCategory, onCategoryChange }) {
  return (
    <section className="pt-8 pb-10 bg-bouilly-cream relative z-20">
      <div className="max-w-full mx-auto px-4">
        
        {/* Container en ligne unique (flex-nowrap).
            J'ai ajouté les styles pour cacher la scrollbar (no-scrollbar) 
            afin de garder l'esthétique épurée demandée.
        */}
        <div className="flex flex-nowrap justify-center items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {NEWS_CATEGORIES_WITH_ALL.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                // 'shrink-0' empêche les boutons de s'écraser si l'écran est petit
                className="relative group shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-bouilly-gold/50 rounded-full"
              >
                {/* Fond Animé du bouton actif */}
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-bouilly-darkGreen rounded-full shadow-lg shadow-bouilly-green/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Contenu du bouton */}
                <span
                  className={`relative block px-5 py-2.5 md:px-6 md:py-3 rounded-full text-[10px] md:text-xs font-title font-bold uppercase tracking-[0.15em] transition-colors duration-300 border ${
                    isSelected
                      ? "text-white border-transparent"
                      : "bg-white text-gray-500 border-bouilly-gold/20 hover:border-bouilly-gold hover:text-bouilly-darkGreen hover:bg-white"
                  }`}
                >
                  {category === "all" ? "Tout voir" : category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}