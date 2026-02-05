"use client";
import { motion } from 'framer-motion';

export default function LoisirsHero() {
  return (
    <section className="relative pt-32 pb-20 bg-bouilly-cream overflow-hidden">
      {/* Fond DA (Identique Mairie/Accueil) */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-white/40 skew-x-12 translate-x-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bouilly-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 bg-bouilly-gold"></span>
            <span className="font-title font-bold text-xs uppercase tracking-[0.25em] text-bouilly-gold">
              Vivre Ensemble
            </span>
            <span className="h-px w-12 bg-bouilly-gold"></span>
          </div>
          
          <h1 className="font-title font-bold text-5xl md:text-7xl text-bouilly-darkGreen mb-6 leading-tight">
            Loisirs & <br/>
              <span className="italic font-serif text-bouilly-gold relative inline-block">
              Vie Locale
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Associations, sports, culture... Découvrez tout ce qui fait battre le cœur de Bouilly au quotidien.
          </p>
        </motion.div>
      </div>
    </section>
  );
}