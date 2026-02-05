"use client";
import { motion } from 'framer-motion';
import { MapPin, Clock, BookOpen, Warehouse, Trophy, ArrowUpRight } from 'lucide-react';

const FACILITIES = [
  {
    name: "Médiathèque Municipale", // Nom plus moderne
    desc: "Un espace de culture lumineux avec plus de 5000 ouvrages, un coin lecture cosy et des ateliers numériques.",
    icon: BookOpen,
    // Image : Intérieur bibliothèque moderne et chaleureux
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1600&auto=format&fit=crop",
    open: "Mercredi & Samedi",
    badgeColor: "bg-blue-500/20 text-blue-100"
  },
  {
    name: "Espace Culturel & Fêtes",
    desc: "Une salle polyvalente de 300m² pour vos réceptions familiales, mariages et les grands événements associatifs.",
    icon: Warehouse,
    // Image : Salle de réception élégante (ambiance événement)
    image: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1600&auto=format&fit=crop",
    open: "Sur Réservation",
    badgeColor: "bg-purple-500/20 text-purple-100"
  },
  {
    name: "Complexe Sportif",
    desc: "Stade d'honneur, piste d'athlétisme et City Stade nouvelle génération accessible à tous 7j/7.",
    icon: Trophy,
    // Image : Stade/Piste athlétisme ensoleillé
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop",
    open: "Accès Libre",
    badgeColor: "bg-orange-500/20 text-orange-100"
  }
];

export default function FacilitiesList() {
  return (
    <section className="py-24 bg-white relative z-10 overflow-hidden">
      
      {/* Élément de fond décoratif subtil */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête de section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bouilly-green/5 text-bouilly-green text-xs font-bold uppercase tracking-widest mb-4 border border-bouilly-green/10"
          >
            <MapPin size={12} />
            Lieux de vie
          </motion.div>
          <h2 className="font-title font-bold text-4xl md:text-5xl text-bouilly-darkGreen mb-6">
            Nos Équipements Publics
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">
            Des infrastructures modernes et entretenues pour le sport, la culture et vos moments de convivialité.
          </p>
        </div>

        {/* Grille des cartes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {FACILITIES.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative h-[500px] w-full rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl shadow-gray-200/50"
            >
              {/* IMAGE DE FOND (avec effet de zoom au survol) */}
              <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[2.5rem]">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                {/* Overlay dégradé intelligent : plus sombre en bas pour le texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-bouilly-darkGreen/90 via-bouilly-darkGreen/20 to-transparent opacity-90 transition-opacity duration-500" />
              </div>

              {/* CONTENU AU PREMIER PLAN */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                
                {/* Haut de carte : Badges */}
                <div className="flex justify-between items-start translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                   <div className={`backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${item.badgeColor}`}>
                      {item.open}
                   </div>
                   <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 text-white">
                      <ArrowUpRight size={20} />
                   </div>
                </div>

                {/* Bas de carte : Textes */}
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  {/* Icône flottante */}
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-bouilly-gold mb-6 shadow-lg">
                    <item.icon size={28} />
                  </div>

                  <h3 className="font-title font-bold text-3xl text-white mb-3 leading-tight drop-shadow-md">
                    {item.name}
                  </h3>
                  
                  {/* Description qui apparaît au survol */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-32 transition-all duration-700 ease-in-out">
                    <p className="text-white/80 text-base leading-relaxed font-medium pb-2">
                      {item.desc}
                    </p>
                    <span className="inline-block mt-4 text-sm font-bold text-bouilly-gold border-b border-bouilly-gold/50 pb-0.5">
                      En savoir plus
                    </span>
                  </div>
                </div>
              </div>

              {/* Bordure intérieure subtile pour la finition */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}