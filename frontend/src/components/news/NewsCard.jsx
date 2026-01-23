"use client";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDateShort, DEFAULT_IMAGE } from '@/utils/newsUtils'; 

export default function NewsCard({ item, index = 0 }) {
  const dateFormatted = item.date ? formatDateShort(item.date) : "En cours";
  // On sépare jour et mois si possible (dépend de ta fonction utils, on assume qu'elle renvoie "15 Oct.")
  const dateParts = dateFormatted.split(" "); 

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group h-full"
    >
      <Link href={`/actualites/${item.id || '#'}`} className="flex flex-col h-full bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 transition-all duration-500 hover:-translate-y-2">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image_url || item.img || DEFAULT_IMAGE}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badge Date Flottant */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-md rounded-2xl p-3 text-center min-w-[70px] border border-gray-100 flex flex-col items-center justify-center">
            <span className="block text-xl font-title font-bold text-bouilly-darkGreen leading-none">
              {dateParts[0] || ""}
            </span>
            <span className="block text-[10px] font-bold text-bouilly-gold uppercase tracking-wider mt-1">
              {dateParts[1] || ""}
            </span>
          </div>

          {/* Badge Catégorie */}
          <div className="absolute top-4 right-4">
             <span className="inline-block px-3 py-1.5 rounded-full bg-bouilly-green text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20">
              {item.category}
            </span>
          </div>
          
          {/* Gradient Overlay au survol */}
          <div className="absolute inset-0 bg-bouilly-darkGreen/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Contenu */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-title font-bold text-xl text-bouilly-darkGreen mb-3 leading-snug group-hover:text-bouilly-gold transition-colors">
            {item.title}
          </h3>
          
          {item.content && (
            <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 font-medium leading-relaxed">
              {item.content.replace(/(<([^>]+)>)/gi, "").substring(0, 120)}...
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
               <Calendar size={14} className="text-bouilly-gold" />
               <span>Article</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-bold text-bouilly-green group-hover:translate-x-1 transition-transform duration-300">
              Lire la suite
              <div className="w-6 h-6 rounded-full bg-bouilly-green/10 flex items-center justify-center group-hover:bg-bouilly-green group-hover:text-white transition-colors">
                 <ArrowRight size={12} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}