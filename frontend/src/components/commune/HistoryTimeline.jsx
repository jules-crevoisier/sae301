"use client";
import { motion } from "framer-motion";

const HISTORY_EVENTS = [
  {
    year: "Antiquité",
    title: "La Voie Romaine",
    desc: "Le territoire est traversé par l'ancienne voie romaine reliant Milan à Boulogne-sur-Mer, témoignant d'une occupation très ancienne du site."
  },
  {
    year: "XIIe Siècle",
    title: "Fondation de l'Église",
    desc: "Construction de l'église Saint-Laurent, classée monument historique. Son architecture témoigne de l'importance du village au Moyen-Âge."
  },
  {
    year: "1789",
    title: "La Révolution",
    desc: "Le village de Bouilly devient chef-lieu de canton, marquant son rôle central dans l'administration locale de l'Aube."
  },
  {
    year: "XIXe Siècle",
    title: "L'Essor Économique",
    desc: "Développement de l'agriculture et des échanges commerciaux grâce à sa position stratégique au pied de la colline de Montaigu."
  },
  {
    year: "Aujourd'hui",
    title: "Un Village Dynamique",
    desc: "Bouilly conjugue préservation de son patrimoine rural et modernisation de ses services (écoles, commerces, pôle santé) pour ses 1000 habitants."
  }
];

export default function HistoryTimeline() {
  return (
    <section className="py-24 bg-bouilly-cream overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
           <h2 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen mb-4">
             Au fil des siècles
           </h2>
           <div className="w-24 h-1 bg-bouilly-gold mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          {/* La Ligne Centrale */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-bouilly-green/0 via-bouilly-green/30 to-bouilly-green/0 md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {HISTORY_EVENTS.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Contenu (Texte) */}
                <div className="flex-1 md:w-1/2 pl-12 md:pl-0 md:px-12">
                   <div className={`text-left ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <span className="inline-block py-1 px-3 rounded bg-bouilly-gold/10 text-bouilly-gold font-bold text-sm mb-2 border border-bouilly-gold/20">
                        {event.year}
                      </span>
                      <h3 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {event.desc}
                      </p>
                   </div>
                </div>

                {/* Le Point Central */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white border-4 border-bouilly-green rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.5)] transform -translate-x-1/2 mt-1.5 md:mt-0 z-10"></div>

                {/* Espace vide pour l'équilibre (Desktop uniquement) */}
                <div className="hidden md:block flex-1"></div>

              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}