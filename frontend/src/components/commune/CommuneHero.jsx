"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function CommuneHero() {
  return (
    <section className="relative pt-32 pb-20 bg-bouilly-cream overflow-hidden">
      {/* Fond décoratif DA */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-white/40 skew-x-12 translate-x-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bouilly-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge Localisation */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-[1px] w-12 bg-bouilly-gold"></span>
                <span className="font-title font-bold text-xs uppercase tracking-[0.25em] text-bouilly-gold">
                    Aube (10) • Grand Est
                </span>
                <span className="h-[1px] w-12 bg-bouilly-gold"></span>
            </div>
          

          <h1 className="font-title font-bold text-5xl md:text-7xl text-bouilly-darkGreen mb-6 leading-tight">
            Bouilly, Porte du <br/>
              <span className="italic font-serif text-bouilly-gold relative inline-block">
              Pays d'Othe
            </span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Entre plaines et forêts, découvrez un village où patrimoine historique et douceur de vivre se conjuguent au présent.
          </p>
        </motion.div>
      </div>
    </section>
  );
}