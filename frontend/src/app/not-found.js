"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Map, ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  
  // Variantes d'animation pour faire apparaître les éléments en cascade
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* --- ÉLÉMENTS DE FOND DÉCORATIFS --- */}
      {/* Cercle flou vert */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-bouilly-green/10 rounded-full blur-3xl pointer-events-none" />
      {/* Cercle flou or */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-bouilly-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* --- GROS TEXTE 404 EN ARRIÈRE-PLAN --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute select-none font-title font-bold text-[12rem] md:text-[20rem] text-gray-900/[0.03] leading-none z-0"
      >
        404
      </motion.div>

      {/* --- CONTENU PRINCIPAL --- */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center"
      >
        
        {/* Icône animée (Boussole qui flotte) */}
        <motion.div 
          variants={itemVars}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ 
            rotate: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 } 
          }}
          className="mb-6 p-4 bg-white rounded-3xl shadow-lg shadow-bouilly-green/10 border border-white/50 backdrop-blur-sm"
        >
          <Compass size={64} className="text-bouilly-gold" strokeWidth={1.5} />
        </motion.div>

        {/* Titres */}
        <motion.h1 variants={itemVars} className="font-title text-4xl md:text-6xl font-bold text-bouilly-darkGreen mb-4">
          Oups ! Vous semblez égaré.
        </motion.h1>

        <motion.p variants={itemVars} className="text-gray-500 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
          Il semblerait que la page que vous cherchez n'existe pas ou a été déplacée. Pas d'inquiétude, retrouvez votre chemin vers la mairie ci-dessous.
        </motion.p>

        {/* --- BOUTONS D'ACTION --- */}
        <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          
          {/* Bouton Principal : Retour Accueil */}
          <Link href="/" className="group relative overflow-hidden rounded-full bg-bouilly-green px-8 py-3.5 text-white shadow-md shadow-bouilly-green/20 transition-all hover:bg-bouilly-darkGreen hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
              <Home size={18} />
              Retour à l'accueil
            </span>
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </Link>

          {/* Bouton Secondaire : Contact / Mairie */}
          <Link href="/plan-du-site" className="group rounded-full bg-white border border-gray-200 px-8 py-3.5 text-gray-600 transition-all hover:border-bouilly-gold/50 hover:text-bouilly-gold hover:shadow-md active:bg-gray-50">
            <span className="flex items-center justify-center gap-2 font-medium">
              <Map size={18} />
              Plan du site
            </span>
          </Link>

        </motion.div>

      </motion.div>

      {/* --- FOOTER DISCRET --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-sm text-gray-400 font-medium"
      >
        Mairie de Bouilly
      </motion.div>

    </div>
  );
}