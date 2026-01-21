"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import NewsList from '@/components/news/NewsList';
import { useNews } from '@/components/news/useNews';
import { DEFAULT_IMAGE } from '@/components/news/newsConstants';

// Données par défaut en cas d'erreur de chargement
const defaultItems = [
  { category: "CULTURE", title: "Saison Culturelle 2026", date: "15 Oct.", image_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80" },
  { category: "FESTIVITÉS", title: "Marché de Noël", date: "12 Déc.", image_url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&q=80" },
  { category: "SANTÉ", title: "Don du sang", date: "20 Janv.", image_url: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=600&q=80" },
  { category: "TRAVAUX", title: "Rénovation Voirie", date: "En cours", image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80" },
  { category: "CITOYENNETÉ", title: "Conseil Municipal", date: "05 Fév.", image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80" },
  { category: "ENVIRONNEMENT", title: "Calendriers de collecte", date: "2026", image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" },
  { category: "URBANISME", title: "Enquête Publique PLU", date: "20 Fév.", image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
  { category: "NUMÉRIQUE", title: "PanneauPocket", date: "Appli", image_url: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=600&q=80" },
];

export default function NewsGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { news, loading } = useNews('all', 8);

  // Utiliser les données par défaut si aucune actualité n'est disponible
  const allItems = (news.length > 0 ? news : defaultItems).map(item => ({
    ...item,
    img: item.image_url || item.img || DEFAULT_IMAGE
  }));
  
  const visibleItems = isExpanded ? allItems : allItems.slice(0, 4);

  return (
    <section className="relative z-20 pb-24 bg-bouilly-cream rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500">
      
      {/* Texture de fond */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2F5233 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 relative z-10">
        
        {/* --- EN-TÊTE --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="h-[2px] w-8 bg-bouilly-gold"></span>
                <span className="font-title font-bold text-xs text-bouilly-gold uppercase tracking-[0.2em]">En ce moment</span>
            </div>
            <h2 className="font-title font-bold text-3xl md:text-4xl text-bouilly-green">
              À la une à <span className="italic font-serif text-bouilly-gold">Bouilly</span>
            </h2>
          </div>
        </div>

        {/* --- GRILLE DYNAMIQUE --- */}
        <NewsList 
          news={visibleItems}
          loading={loading}
          error={null}
        />

        {/* --- BOUTON D'EXPANSION --- */}
        <div className="flex justify-center mt-16">
            {isExpanded ? (
              <button 
                  onClick={() => setIsExpanded(false)}
                  className="group flex items-center gap-2 px-6 py-3 rounded-full border border-bouilly-green/20 text-bouilly-green hover:bg-bouilly-green hover:text-white transition-all duration-300 bg-transparent"
              >
                  <span className="font-title font-bold text-xs uppercase tracking-widest">
                      Voir moins
                  </span>
                  <ChevronUp size={16} className="group-hover:-translate-y-1 transition-transform" />
              </button>
            ) : (
              <Link 
                  href="/actualites"
                  className="group flex items-center gap-2 px-6 py-3 rounded-full border border-bouilly-green/20 text-bouilly-green hover:bg-bouilly-green hover:text-white transition-all duration-300 bg-transparent"
              >
                  <span className="font-title font-bold text-xs uppercase tracking-widest">
                      Toutes les actus
                  </span>
                  <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
              </Link>
            )}
        </div>

      </div>
    </section>
  );
}
