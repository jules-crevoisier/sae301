"use client";
import { motion } from 'framer-motion';
import { Smartphone, Bell } from 'lucide-react';

export default function PanneauPocket() {
  return (
    <section className="py-20 bg-bouilly-cream relative overflow-hidden">
      
      {/* --- FOND HERO INVERSÉ --- */}
      {/* 1. Bloc Blanc Biaisé (Positionné à GAUCHE avec inclinaison inversée) */}
      <div className="absolute top-0 left-0 w-2/3 h-full bg-white/40 -skew-x-12 -translate-x-32 pointer-events-none"></div>

      {/* 2. Forme Flou Doré (Positionnée à DROITE) */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-bouilly-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* LA CARTE BLANCHE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row items-center border border-gray-100"
        >
          
          {/* GAUCHE : TEXTE */}
          <div className="flex-1 p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-yellow-100 p-2 rounded-full">
                  <Bell size={20} className="text-yellow-600" />
               </div>
               <span className="font-title font-bold text-bouilly-green uppercase tracking-widest text-xs">Alerte Mairie</span>
            </div>

            <h2 className="font-title font-bold text-3xl text-gray-800">
              <span className="underline decoration-bouilly-gold decoration-4 underline-offset-4">PANNEAUPOCKET</span>
            </h2>
            
            <p className="font-sans text-gray-600 leading-relaxed text-sm md:text-base">
              Est une application mobile gratuite qui transforme votre téléphone portable en un panneau de poche 
              permettant de recevoir les informations et les alertes publiées par les services de votre municipalité.
            </p>

            {/* UX BOOST : Boutons de téléchargement */}
            <div className="flex flex-wrap gap-4 pt-4">
               <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition shadow-md">
                  <span className="text-2xl"></span> {/* Icône Apple simple */}
                  <div className="text-left leading-tight">
                      <div className="text-[10px] uppercase opacity-70">Télécharger sur</div>
                      <div className="font-bold text-sm">App Store</div>
                  </div>
               </button>
               <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition shadow-md">
                  <Smartphone size={24} />
                  <div className="text-left leading-tight">
                      <div className="text-[10px] uppercase opacity-70">DISPONIBLE SUR</div>
                      <div className="font-bold text-sm">Google Play</div>
                  </div>
               </button>
            </div>
          </div>

          {/* DROITE : VISUEL (Logo) */}
          <div className="flex-1 p-8 md:p-12 flex justify-center items-center bg-gray-50/50 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100">
             <motion.img 
               whileHover={{ scale: 1.05 }}
               transition={{ type: "spring", stiffness: 300 }}
               src="/images/PanneauPocket.png" 
               alt="Logo PanneauPocket" 
               className="max-w-[250px] w-full object-contain drop-shadow-lg"
             />
          </div>

        </motion.div>
      </div>
    </section>
  );
}