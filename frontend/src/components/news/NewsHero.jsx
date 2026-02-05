"use client";
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function NewsHero() {
  
  const fadeUpVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-bouilly-cream overflow-hidden pt-32 pb-20">
      
      {/* 1. FOND EXACT DE L'ACCUEIL (Sans modification) */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-white/40 skew-x-12 translate-x-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bouilly-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVars}
          className="flex flex-col items-center text-center"
        >
            {/* Surtitre Centré avec traits */}
            <div className="flex items-center gap-4 mb-6">
               <span className="h-[1px] w-8 md:w-12 bg-bouilly-gold"></span>
               <span className="font-title font-bold text-xs uppercase tracking-[0.25em] text-bouilly-gold">
                 Vie de la commune
               </span>
               <span className="h-[1px] w-8 md:w-12 bg-bouilly-gold"></span>
            </div>

            {/* Gros Titre (Typo Accueil) */}
            <h1 className="font-title font-bold text-5xl md:text-7xl text-bouilly-darkGreen leading-[0.95] mb-8">
              L'actualité à <br/>
              <span className="italic font-serif text-bouilly-gold relative inline-block">Bouilly</span>
            </h1>

            {/* Description épurée */}
            <p className="font-sans text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              Restez connecté avec votre village. Découvrez les derniers événements, les travaux en cours et les annonces municipales importantes.
            </p>

        </motion.div>

      </div>
    </section>
  );
}