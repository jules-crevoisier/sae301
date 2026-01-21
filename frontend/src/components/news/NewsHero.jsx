"use client";
import { motion } from 'framer-motion';

export default function NewsHero() {
  return (
    <section className="relative pt-32 pb-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden border-b border-gray-200/50">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2F5233 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-bouilly-gold"></span>
            <span className="font-title font-bold text-xs text-bouilly-gold uppercase tracking-[0.2em]">Actualités</span>
            <span className="h-[2px] w-8 bg-bouilly-gold"></span>
          </div>
          <h1 className="font-title font-bold text-4xl md:text-5xl text-bouilly-darkGreen mb-4">
            À la une à <span className="italic font-serif text-bouilly-gold">Bouilly</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Restez informé des dernières actualités de votre commune
          </p>
        </motion.div>
      </div>
    </section>
  );
}
