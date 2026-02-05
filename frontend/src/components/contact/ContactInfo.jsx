"use client";
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Calendar, ArrowRight } from 'lucide-react';

export default function ContactInfo() {
  return (
    <section className="py-12 relative z-20 -mt-20"> {/* Remonté un peu plus sur le hero pour l'effet de superposition */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* --- CARTE 1 : ADRESSE --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-bouilly-gold/30 hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center"
          >
            {/* Icône avec effet de cercle */}
            <div className="w-20 h-20 rounded-full bg-bouilly-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <MapPin size={32} className="text-bouilly-gold group-hover:text-bouilly-darkGreen transition-colors" />
            </div>
            
            <h3 className="font-title font-bold text-xl text-bouilly-darkGreen mb-4">
              Nous rendre visite
            </h3>
            
            <div className="relative">
              <p className="text-gray-500 leading-relaxed mb-6 font-medium">
                Mairie de Bouilly<br/>
                1 Place de l'Hôtel de Ville<br/>
                10320 BOUILLY
              </p>
              
              <a 
                href="https://maps.google.com/?q=Mairie+de+Bouilly" 
                target="_blank" 
                className="inline-flex items-center gap-2 text-sm font-bold text-bouilly-green hover:text-bouilly-gold transition-colors uppercase tracking-wider group/link"
              >
                Voir sur la carte
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* --- CARTE 2 : HORAIRES (Refaite en blanc) --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-bouilly-gold/30 hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Petit indicateur visuel en haut */}

            <div className="w-20 h-20 rounded-full bg-bouilly-green/5 flex items-center justify-center mb-6 group-hover:bg-bouilly-green/10 transition-colors duration-500">
              <Clock size={32} className="text-bouilly-green" />
            </div>

            <h3 className="font-title font-bold text-xl text-bouilly-darkGreen mb-6">
              Horaires d'ouverture
            </h3>

            <div className="w-full space-y-3 text-sm">
              <div className="flex justify-between items-center w-full px-4 py-2 rounded-xl bg-gray-50 group-hover:bg-bouilly-cream/30 transition-colors">
                <span className="text-gray-500 font-medium">Lundi - Vendredi</span>
                <div className="text-right">
                    <span className="block font-bold text-bouilly-darkGreen">8h30 - 12h00</span>
                    <span className="block font-bold text-bouilly-darkGreen">13h30 - 17h00</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center w-full px-4 py-2 rounded-xl bg-gray-50 group-hover:bg-bouilly-cream/30 transition-colors">
                <span className="text-gray-500 font-medium flex items-center gap-2">
                    Samedi <span className="w-1.5 h-1.5 rounded-full bg-bouilly-gold"></span>
                </span>
                <span className="font-bold text-bouilly-darkGreen">9h00 - 12h00</span>
              </div>
            </div>

            <p className="mt-4 text-[10px] uppercase tracking-wide text-gray-400 font-bold">
              *État civil uniquement le samedi
            </p>
          </motion.div>

          {/* --- CARTE 3 : CONTACT --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="group bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-bouilly-gold/30 hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-bouilly-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Phone size={32} className="text-bouilly-gold group-hover:text-bouilly-darkGreen transition-colors" />
            </div>

            <h3 className="font-title font-bold text-xl text-bouilly-darkGreen mb-4">
              Nous contacter
            </h3>
            
            <p className="text-gray-500 mb-8 font-medium">
              Une réponse vous sera apportée dans les meilleurs délais.
            </p>

            <div className="w-full space-y-3">
              <a href="tel:0325402010" className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border border-gray-100 bg-white text-gray-600 font-bold hover:bg-bouilly-darkGreen hover:text-white hover:border-bouilly-darkGreen transition-all duration-300 shadow-sm">
                <Phone size={18} />
                03 25 40 20 10
              </a>
              <a href="mailto:mairie@bouilly.fr" className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border border-gray-100 bg-white text-gray-600 font-bold hover:bg-bouilly-gold hover:text-white hover:border-bouilly-gold transition-all duration-300 shadow-sm">
                <Mail size={18} />
                mairie@bouilly.fr
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}