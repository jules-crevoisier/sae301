"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { formatDateShort, DEFAULT_IMAGE } from '@/utils/newsUtils'; // <--- Import corrigé
export default function NewsCard({ item, index = 0 }) {
  const dateFormatted = item.date ? formatDateShort(item.date) : "En cours";
  const dateParts = dateFormatted.split(" ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col gap-4 cursor-pointer"
    >
      <Link href="/actualites" className="flex flex-col gap-4">
        {/* Carte Image */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 border border-white/50">
          <img
            src={item.image_url || item.img || DEFAULT_IMAGE}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm text-center min-w-[60px]">
            <span className="block text-xs font-bold text-gray-400 uppercase">
              {dateParts[1] || ""}
            </span>
            <span className="block text-lg font-title font-bold text-bouilly-green leading-none">
              {dateParts[0] || ""}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
            <span className="inline-block px-2 py-1 rounded bg-bouilly-gold text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {item.category}
            </span>
          </div>
        </div>

        {/* Texte */}
        <div>
          <h3 className="font-title font-bold text-lg text-bouilly-darkGreen leading-tight group-hover:text-bouilly-gold transition-colors">
            {item.title}
          </h3>
          {item.content && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {item.content.substring(0, 100)}...
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
            <Clock size={14} />
            <span>Lire l'article</span>
            <ArrowUpRight
              size={14}
              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-bouilly-gold"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
