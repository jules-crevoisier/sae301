"use client";
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Quote } from 'lucide-react';

// --- VARIANTS D'ANIMATION (La clé pour que ce soit beau) ---

// Animation fluide pour le texte (remonte doucement)
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Courbe "Apple" (très douce)
  }
};

// Conteneur pour décaler l'arrivée des textes (Cascade)
const staggerText = {
  visible: { transition: { staggerChildren: 0.15 } }
};

// Animation pour la composition graphique (Assemblage)
const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { type: "spring", stiffness: 50, damping: 20, delay: 0.2 }
  }
};

export default function About() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      
      {/* FOND & TEXTURE */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#2F5233 1px, transparent 1px), linear-gradient(90deg, #2F5233 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>

      <div className="absolute -left-20 top-20 font-title font-bold text-[40rem] text-bouilly-green opacity-[0.02] leading-none select-none pointer-events-none z-0">
        B
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* --- COLONNE GAUCHE : TEXTE (Animation en cascade) --- */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerText}
            className="lg:pr-10"
          >
            {/* Tagline */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bouilly-cream border border-bouilly-gold/30 mb-6">
               <div className="w-2 h-2 rounded-full bg-bouilly-gold animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-bouilly-green">Territoire d'Exception</span>
            </motion.div>

            {/* Titre */}
            <motion.h2 variants={fadeInUp} className="font-title font-bold text-4xl lg:text-6xl text-bouilly-green mb-8 leading-[1.1]">
              Découvrez <br/>
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-bouilly-green">Bouilly</span>
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-bouilly-gold opacity-60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </motion.h2>

            {/* Paragraphes */}
            <motion.div variants={fadeInUp} className="relative font-sans text-gray-600 text-lg leading-relaxed space-y-6 text-justify">
              <div className="absolute -left-6 top-2 bottom-2 w-[2px] bg-gradient-to-b from-bouilly-green/20 via-bouilly-green to-bouilly-green/20 hidden lg:block"></div>
              <p>
                <strong className="text-bouilly-green font-semibold">Charmante commune de l'Aube</strong>, située en région Grand Est, à seulement 13 km au sud-ouest de Troyes. 
                Membre de la communauté d'agglomération Troyes Champagne Métropole, Bouilly accueille un peu plus de 1 000 habitants, 
                les Bouillerands, dans un cadre à la fois rural et dynamique.
              </p>
              <p>
                Notre village se distingue par son environnement naturel préservé, typique du terroir champenois, 
                propice aux promenades et aux activités de plein air.
              </p>
            </motion.div>

            {/* Bouton */}
            <motion.div variants={fadeInUp} className="mt-12">
                <button className="group relative px-8 py-4 bg-bouilly-green text-white font-title font-bold text-sm uppercase tracking-widest rounded-xl overflow-hidden shadow-xl shadow-bouilly-green/30 border-2 border-bouilly-green transition-all duration-300 hover:bg-bouilly-gold hover:border-bouilly-gold hover:scale-105 hover:shadow-2xl">
                  
                  {/* Contenu du bouton */}
                  <span className="relative z-10 flex items-center gap-3 transition-colors">
                    En Savoir Plus 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                  </span>
                  
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </motion.div>
          </motion.div>


          {/* --- COLONNE DROITE : COMPOSITION GRAPHIQUE (Animation d'assemblage) --- */}
          <div className="relative flex justify-center items-center py-10 lg:py-0">
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               className="relative w-full max-w-md aspect-[3/4]"
            >

              {/* COUCHE 1 : CADRE FILAIRE OR (Apparition retardée) */}
              <motion.div 
                initial={{ opacity: 0, rotate: 0 }}
                whileInView={{ opacity: 1, rotate: 6 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-0 border-[3px] border-bouilly-gold/40 rounded-[2rem] transform scale-105 z-0"
              ></motion.div>

              {/* COUCHE 2 : BLOC VERT (Glisse de la gauche) */}
              <motion.div 
                initial={{ x: -50, opacity: 0, rotate: 0 }}
                whileInView={{ x: 16, y: 16, opacity: 1, rotate: -3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
                className="absolute inset-0 bg-bouilly-green rounded-[2rem] z-10 shadow-2xl"
              ></motion.div>

              {/* COUCHE 3 : IMAGE (Zoom out reveal) */}
              <motion.div 
                 initial={{ opacity: 0, scale: 1.1 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.4 }}
                 className="absolute inset-0 rounded-[2rem] overflow-hidden z-20 shadow-lg bg-gray-200"
              >
                  <img 
                    src="/images/BouillyVue.jpg" 
                    alt="Vue aérienne de Bouilly" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-bouilly-green/10 mix-blend-multiply pointer-events-none"></div>
              </motion.div>

              {/* COUCHE 4 : BADGE FLOTTANT (Pop effect) */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                className="absolute -bottom-10 -left-6 z-30"
              >
                <div className="bg-white p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                   <div className="border border-dashed border-gray-300 bg-gray-50 px-6 py-4 rounded-xl flex items-center gap-4">
                      <div className="bg-bouilly-green text-bouilly-gold p-3 rounded-full shadow-md ring-2 ring-bouilly-gold/20">
                         <MapPin size={24} fill="currentColor" fillOpacity={0.2} />
                      </div>
                      <div>
                         <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Localisation</p>
                         <div className="flex items-baseline gap-1">
                            <span className="text-bouilly-green font-title font-bold text-xl">13</span>
                            <span className="text-gray-600 font-medium text-sm">km de Troyes</span>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>

              {/* ÉLÉMENT DÉCORATIF : BULLE OR */}
              <motion.div 
                 initial={{ scale: 0 }}
                 whileInView={{ scale: 1 }}
                 transition={{ delay: 1, type: "spring" }}
                 className="absolute -top-8 -right-8 z-30 bg-bouilly-gold text-white p-4 rounded-full shadow-xl animate-bounce duration-[3000ms]"
              >
                 <Quote size={20} fill="currentColor" />
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}