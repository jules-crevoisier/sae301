"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const allItems = [
  // Ligne 1
  { category: "CULTURE", title: "Saison Culturelle 2026", date: "15 Oct.", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80" },
  { category: "FESTIVITÉS", title: "Marché de Noël", date: "12 Déc.", img: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&q=80" },
  { category: "SANTÉ", title: "Don du sang", date: "20 Janv.", img: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=600&q=80" },
  { category: "TRAVAUX", title: "Rénovation Voirie", date: "En cours", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80" },
  
  // Ligne 2 (Cachée par défaut)
  { category: "CITOYENNETÉ", title: "Conseil Municipal", date: "05 Fév.", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80" },
  { category: "ENVIRONNEMENT", title: "Calendriers de collecte", date: "2026", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" },
  { category: "URBANISME", title: "Enquête Publique PLU", date: "20 Fév.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
  { category: "NUMÉRIQUE", title: "PanneauPocket", date: "Appli", img: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=600&q=80" },
];

export default function NewsGrid() {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isExpanded ? allItems : allItems.slice(0, 4);

  return (
    <section className="relative z-20  pb-24 bg-bouilly-cream rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500">
      
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
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {visibleItems.map((item, index) => (
              <motion.div
                layout
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col gap-4 cursor-pointer"
              >
                {/* CARTE IMAGE */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 border border-white/50">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm text-center min-w-[60px]">
                      <span className="block text-xs font-bold text-gray-400 uppercase">{item.date.split(' ')[1]}</span>
                      <span className="block text-lg font-title font-bold text-bouilly-green leading-none">{item.date.split(' ')[0]}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                     <span className="inline-block px-2 py-1 rounded bg-bouilly-gold text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">{item.category}</span>
                  </div>
                </div>

                {/* TEXTE */}
                <div>
                   <h3 className="font-title font-bold text-lg text-bouilly-darkGreen leading-tight group-hover:text-bouilly-gold transition-colors">{item.title}</h3>
                   <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                      <Clock size={14} />
                      <span>Lire l'article</span>
                      <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-bouilly-gold"/>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- BOUTON D'EXPANSION (DA EXACTE DEMANDÉE) --- */}
        <div className="flex justify-center mt-16">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                // J'ai appliqué exactement tes classes CSS ici :
                className="group flex items-center gap-2 px-6 py-3 rounded-full border border-bouilly-green/20 text-bouilly-green hover:bg-bouilly-green hover:text-white transition-all duration-300 bg-transparent"
            >
                <span className="font-title font-bold text-xs uppercase tracking-widest">
                    {isExpanded ? "Voir moins" : "Toutes les actus"}
                </span>
                
                {/* J'adapte l'icône pour que ce soit logique (Haut/Bas) mais avec ton style d'animation */}
                {isExpanded ? (
                    <ChevronUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                ) : (
                    <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                )}
            </button>
        </div>

      </div>
    </section>
  );
}