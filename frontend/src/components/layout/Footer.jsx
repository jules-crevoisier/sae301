"use client";
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowUp, Facebook, Instagram, ExternalLink, ChevronRight, Clock } from 'lucide-react';

export default function Footer() {
  
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <footer className="bg-bouilly-blue text-bouilly-cream pt-20 pb-10 relative overflow-hidden font-sans">
      
      {/* Blason géant en filigrane */}
      <div className="absolute -right-20 -bottom-20 w-[600px] h-[600px] opacity-[0.03] pointer-events-none grayscale">
         <img src="/images/blason.png" alt="" className="w-full h-full object-contain" />
      </div>
      
      {/* Ligne dorée supérieure (Mise à jour du dégradé avec le bleu) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bouilly-blue via-bouilly-gold to-bouilly-blue opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <motion.div 
           variants={containerVars}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          
          {/* COLONNE 1 : CONTACT */}
          <motion.div variants={itemVars}>
             <h3 className="font-title font-bold text-lg uppercase tracking-widest text-white mb-6">
                Nous Contacter <br/> & Horaires
             </h3>
             
             <ul className="space-y-4 text-sm text-bouilly-cream/80">
                <li className="flex items-start gap-3 group cursor-pointer">
                   <MapPin className="text-bouilly-gold shrink-0 mt-1 group-hover:scale-110 transition-transform" size={18} />
                   <span className="group-hover:text-white transition-colors leading-relaxed">
                      Place de l'Hôtel de Ville<br/>10320 Bouilly
                   </span>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer">
                   <Phone className="text-bouilly-gold shrink-0 group-hover:scale-110 transition-transform" size={18} />
                   <span className="group-hover:text-white transition-colors">03 25 40 20 10</span>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer">
                   <Mail className="text-bouilly-gold shrink-0 group-hover:scale-110 transition-transform" size={18} />
                   <a href="mailto:mairie.bouilly@wanadoo.fr" className="group-hover:text-white transition-colors underline decoration-bouilly-gold/30 underline-offset-4 hover:decoration-bouilly-gold">
                      Contact Mairie
                   </a>
                </li>
             </ul>

             <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-start gap-3">
                    <Clock className="text-bouilly-gold shrink-0 mt-1" size={18} />
                    <div className="text-sm text-bouilly-cream/80">
                        <p><span className="text-white font-medium">Lun - Ven :</span> 8h30-12h / 13h30-17h30</p>
                        <p><span className="text-white font-medium">Mer & Sam :</span> 8h30-12h</p>
                    </div>
                </div>
             </div>
          </motion.div>


          {/* COLONNE 2 : ACCÈS RAPIDE */}
          <motion.div variants={itemVars}>
             <h3 className="font-title font-bold text-lg uppercase tracking-widest text-white mb-6">
                Accès Rapide <br/> & Urgences
             </h3>
             <ul className="space-y-3 text-sm">
                {['Les Numéros Utiles', 'Plan de Bouilly', 'Avis à la Population', 'Démarches en ligne', 'Menu Cantine'].map((item) => (
                    <li key={item}>
                        <a href="#" className="flex items-center gap-2 text-bouilly-cream/70 hover:text-bouilly-gold transition-all group">
                            <ChevronRight size={14} className="text-bouilly-gold opacity-50 group-hover:translate-x-1 transition-transform" />
                            {item}
                        </a>
                    </li>
                ))}
             </ul>
          </motion.div>


          {/* COLONNE 3 : ENVIRONNEMENT */}
          <motion.div variants={itemVars}>
             <h3 className="font-title font-bold text-lg uppercase tracking-widest text-white mb-6">
                Environnement <br/> & Partenaires
             </h3>
             <ul className="space-y-3 text-sm">
                {[
                    { label: 'Troyes Champagne Métropole', ext: true },
                    { label: 'Secteur Économique', ext: false },
                    { label: 'Galerie Photos', ext: false },
                    { label: 'Associations', ext: false },
                    { label: 'Urbanisme (PLU)', ext: false }
                ].map((item, i) => (
                    <li key={i}>
                        <a href="#" className="flex items-center gap-2 text-bouilly-cream/70 hover:text-bouilly-gold transition-all group">
                            <div className="w-1.5 h-1.5 rounded-full bg-bouilly-gold/50 group-hover:bg-bouilly-gold transition-colors"></div>
                            {item.label}
                            {item.ext && <ExternalLink size={10} className="opacity-50" />}
                        </a>
                    </li>
                ))}
             </ul>
          </motion.div>


          {/* COLONNE 4 : NEWSLETTER */}
          <motion.div variants={itemVars}>
             <h3 className="font-title font-bold text-lg uppercase tracking-widest text-white mb-6">
                Newsletter
             </h3>
             <p className="text-sm text-bouilly-cream/70 mb-4">
                Recevez les dernières actualités de la commune directement par email.
             </p>
             
             <form className="relative group">
                <input 
                    type="email" 
                    placeholder="exemple@mail.com" 
                    className="w-full bg-bouilly-cream text-gray-800 placeholder-gray-500 text-sm py-3 pl-5 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-bouilly-gold shadow-lg"
                />
                <button 
                    type="submit" 
                    // Bouton dans le bleu charte pour rappeler le fond
                    className="absolute right-1 top-1 bottom-1 w-9 h-9 bg-bouilly-blue text-white rounded-full flex items-center justify-center hover:bg-bouilly-gold transition-colors shadow-md"
                >
                    <ArrowUp size={18} />
                </button>
             </form>

             <div className="mt-8 flex gap-4">
                 <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-bouilly-gold hover:border-bouilly-gold hover:text-white transition-all duration-300">
                    <Facebook size={18} />
                 </a>
                 <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-bouilly-gold hover:border-bouilly-gold hover:text-white transition-all duration-300">
                    <Instagram size={18} />
                 </a>
             </div>
          </motion.div>

        </motion.div>

        {/* BOTTOM BAR */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-bouilly-cream/40"
        >
            <p>&copy; {new Date().getFullYear()} Mairie de Bouilly. Tous droits réservés.</p>
            
            <div className="flex gap-6">
                <a href="#" className="hover:text-bouilly-gold transition-colors">Mentions Légales</a>
                <a href="#" className="hover:text-bouilly-gold transition-colors">Politique de Confidentialité</a>
                <a href="#" className="hover:text-bouilly-gold transition-colors">Plan du site</a>
            </div>

            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hidden md:flex items-center gap-2 hover:text-bouilly-gold transition-colors"
            >
                Haut de page <ArrowUp size={12} />
            </button>
        </motion.div>

      </div>
    </footer>
  );
}