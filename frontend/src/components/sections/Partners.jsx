"use client";
import { motion } from 'framer-motion';

const partners = [
  { name: "Enfance Lyme & Co", logo: "/images/Partners1.png" },
  { name: "ASLO", logo: "/images/Partners2.png" },
  { name: "Sapeurs Pompiers", logo: "/images/Partners3.png" },
  { name: "AMA", logo: "/images/Partners4.png" },
  { name: "Donne ton soutif", logo: "/images/Partners5.png" },
];

export default function Partners() {
  return (
    <section className="bg-bouilly-cream py-24 relative z-10 overflow-hidden">
      
      {/* 1. TITRE */}
      <div className="flex flex-col items-center justify-center mb-20 px-4">
          <div className="flex items-center gap-4 mb-3">
             <span className="h-[1px] w-12 bg-bouilly-gold"></span>
             <span className="font-title font-bold text-xs text-bouilly-gold uppercase tracking-[0.25em]">
                Vie Locale & Associative
             </span>
             <span className="h-[1px] w-12 bg-bouilly-gold"></span>
          </div>
          <h2 className="font-title font-bold text-3xl md:text-5xl text-bouilly-green text-center">
            Nos Partenaires <span className="italic font-serif text-bouilly-gold">Engagés</span>
          </h2>
      </div>

      {/* 2. BANDEAU DÉFILANT */}
      <div className="relative bg-bouilly-green py-20 transform -skew-y-2 shadow-2xl border-y-4 border-bouilly-gold/30">
        
        <div className="transform skew-y-2">
            
            {/* Masque de dégradé sur les côtés */}
            <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                
                <motion.div 
                  className="flex gap-10 px-4 items-center"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    repeat: Infinity, 
                    ease: "linear", 
                    duration: 40,
                  }}
                  whileHover={{ animationPlayState: "paused" }} 
                >
                  {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
                    <div
                      key={index}
                      className="group flex-shrink-0 w-72 h-44 bg-white rounded-[2.5rem] shadow-lg flex items-center justify-center p-8 cursor-pointer border border-transparent transition-all duration-500 hover:scale-105 hover:border-bouilly-gold hover:shadow-[0_0_40px_rgba(193,166,99,0.4)]"
                    >
                      {/* CORRECTION : Suppression des filtres grayscale/opacity */}
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </motion.div>
            </div>
        </div>

        {/* Texture de fond */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
      
    </section>
  );
}