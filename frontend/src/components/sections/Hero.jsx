"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, ChevronDown } from 'lucide-react';

export default function Hero() {
  
  const fadeUpVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerVars = {
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  return (
    <section className="relative min-h-screen flex bg-bouilly-cream overflow-hidden pt-28 pb-12 lg:pt-32">
      
      {/* 1. ÉLÉMENTS DE FOND SUBTILS (Charte) */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-white/40 skew-x-12 translate-x-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bouilly-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* --- COLONNE GAUCHE : TEXTE & ACTIONS (5 colonnes) --- */}
          <motion.div 
            variants={staggerVars}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex flex-col items-start text-left"
          >
            {/* Surtitre Élégant */}
            <motion.div variants={fadeUpVars} className="flex items-center gap-3 mb-4">
               <span className="h-[1px] w-8 bg-bouilly-gold"></span>
               <span className="font-title font-bold text-xs uppercase tracking-[0.25em] text-bouilly-gold">
                 Site Officiel
               </span>
            </motion.div>

            {/* Gros Titre "Grande Mairie" */}
            <motion.h1 variants={fadeUpVars} className="font-title font-bold text-5xl lg:text-7xl text-bouilly-green leading-[0.9] mb-6">
              Bienvenue à <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r bg-bouilly-green">
                Bouilly
              </span>
            </motion.h1>

            {/* Description courte et accueillante */}
            <motion.p variants={fadeUpVars} className="font-sans text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
              Un village authentique au cœur de l'Aube, alliant patrimoine, nature et dynamisme pour le bien-être de ses habitants.
            </motion.p>

            
                  <motion.div variants={fadeUpVars} className="flex flex-wrap gap-4 w-full">
                     <a href="/mairie" className="flex-1 bg-bouilly-green text-white px-6 py-4 rounded-xl shadow-lg shadow-bouilly-green/20 hover:bg-bouilly-darkGreen hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
                      <FileText size={20} className="text-bouilly-gold" />
                      <div className="text-left">
                       <span className="block text-[10px] uppercase opacity-70 tracking-wider">Accès Direct</span>
                       <span className="block font-title font-bold text-sm">Mes Démarches</span>
                      </div>
                      <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                     </a>

                     <a href="/mairie" className="flex-1 bg-white text-bouilly-green border border-bouilly-green/10 px-6 py-4 rounded-xl shadow-md hover:shadow-xl hover:border-bouilly-gold/50 transition-all duration-300 flex items-center justify-center gap-3 group">
                      <Calendar size={20} className="text-bouilly-gold" />
                      <div className="text-left">
                       <span className="block text-[10px] uppercase opacity-70 tracking-wider">Événements</span>
                       <span className="block font-title font-bold text-sm">Agenda</span>
                      </div>
                     </a>
                  </motion.div>

                  </motion.div>


                  {/* --- COLONNE DROITE : COMPOSITION PHOTO (7 colonnes) --- */}
          <div className="lg:col-span-7 relative h-[500px] lg:h-[600px] hidden lg:block">
            
            {/* IMAGE 1 : PRINCIPALE (Verticale - Architecture/Patrimoine) */}
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="absolute top-0 right-10 w-72 h-[550px] rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl z-10 border-4 border-white"
            >
               <img 
                 // Remplacez par une photo de la Mairie, de l'église ou d'une rue typique
                 src="/images/accueil2.png" 
                 alt="Architecture Bouilly" 
                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]"
               />
            </motion.div>

            {/* IMAGE 2 : SECONDAIRE (Horizontale - Nature/Vie) */}
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.4 }}
               className="absolute bottom-12 left-10 w-80 h-56 rounded-[2rem] overflow-hidden shadow-xl z-20 border-4 border-white"
            >
               <img 
                 // Remplacez par une photo de nature, forêt ou parc de Bouilly
                 src="/images/HotelVillage.jpeg" 
                 alt="Nature Bouilly" 
                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]"
               />
               {/* Overlay léger */}
               <div className="absolute inset-0 bg-bouilly-green/10"></div>
            </motion.div>

            {/* ÉLÉMENT DÉCO : CERCLE DORÉ */}
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="absolute bottom-40 left-0 w-24 h-24 rounded-full border-2 border-bouilly-gold/30 flex items-center justify-center z-0 animate-[spin_10s_linear_infinite]"
            >
               <div className="w-16 h-16 rounded-full border border-bouilly-gold/50 border-dashed"></div>
            </motion.div>

            {/* BADGE FLOTTANT "1000 Habitants" ou autre chiffre clé */}
            <motion.div 
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: "spring", delay: 0.8 }}
               className="absolute top-20 right-0 bg-white p-4 rounded-2xl shadow-xl z-30 max-w-[140px]"
            >
                <p className="font-title font-bold text-3xl text-bouilly-gold">10320</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code Postal</p>
            </motion.div>

          </div>
        </div>
        
        {/* INDICATEUR DE SCROLL (Subtil en bas) */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.5, duration: 1 }}
           className="absolute  left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
           onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
            <span className="text-[10px] uppercase tracking-widest text-bouilly-green/50">Découvrir</span>
            <ChevronDown className="text-bouilly-gold animate-bounce" size={20} />
        </motion.div>

      </div>
    </section>
  );
}