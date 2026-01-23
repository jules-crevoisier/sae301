"use client";
import { useState } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calendar } from "@/components/calendar/Calendar";
import { motion } from "framer-motion";
import { 
  FileText, 
  Users, 
  Building2, 
  ArrowRight, 
  Download, 
  Search 
} from "lucide-react";
import Link from 'next/link';

// Données fictives pour les démarches
const DEMARCHES = [
  { title: "Carte d'identité & Passeport", icon: Users, href: "#", color: "bg-blue-50 text-blue-600" },
  { title: "État Civil (Naissance, Mariage)", icon: FileText, href: "#", color: "bg-rose-50 text-rose-600" },
  { title: "Urbanisme (Permis, PLU)", icon: Building2, href: "#", color: "bg-orange-50 text-orange-600" },
];

export default function MairiePage() {
  // État fictif pour le calendrier (à remplacer par ton useNews ou un hook useEvents)
  const [events] = useState([
    { id: 1, title: "Conseil Municipal", start_date: new Date().toISOString(), category: "CITOYENNETÉ", location: "Salle du Conseil" },
    { id: 2, title: "Collecte Déchets", start_date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), category: "ENVIRONNEMENT" }
  ]);

  return (
    <main className="min-h-screen bg-bouilly-cream flex flex-col">
      <Header />

      {/* --- HERO SECTION MAIRIE --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
         {/* Fond DA */}
         <div className="absolute top-0 right-0 w-2/3 h-full bg-white/40 skew-x-12 translate-x-32 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-bouilly-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-bouilly-gold"></span>
                <span className="font-title font-bold text-xs uppercase tracking-[0.25em] text-bouilly-gold">
                  Administration
                </span>
                <span className="h-px w-12 bg-bouilly-gold"></span>
              </div>
              
              <h1 className="font-title font-bold text-5xl md:text-6xl text-bouilly-darkGreen mb-6">
                Mairie & <span className="italic font-serif text-bouilly-gold">Démarches</span>
              </h1>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Retrouvez toutes les informations pratiques, l'agenda des élus et accédez à vos démarches administratives en ligne.
              </p>
            </motion.div>
         </div>
      </section>

      {/* --- SECTION DÉMARCHES RAPIDES (Premium) --- */}
      <section className="py-20 bg-white relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative">
          
          {/* En-tête de section stylisé */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-8 bg-bouilly-gold"></span>
                  <span className="font-title font-bold text-xs text-bouilly-gold uppercase tracking-[0.25em]">
                    Simplifiez-vous la vie
                  </span>
              </div>
              <h2 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen">
                Vos démarches <span className="text-bouilly-green">en un clic</span>
              </h2>
            </div>

            <Link 
              href="/demarches" 
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gray-50 text-bouilly-darkGreen font-bold text-sm hover:bg-bouilly-green hover:text-white transition-all duration-300 border border-gray-200 hover:border-bouilly-green shadow-sm"
            >
              Portail Citoyen
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grille des cartes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMARCHES.map((item, index) => (
              <motion.a
                href={item.href}
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-bouilly-gold/30 transition-all duration-500 overflow-hidden h-full"
              >
                {/* Gradient de fond au survol (Effet Glow) */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-bouilly-cream/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex items-start justify-between mb-8">
                   {/* Icône avec fond coloré */}
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                     <item.icon size={28} />
                   </div>
                   
                   {/* Bouton "Go" circulaire qui s'active au survol */}
                   <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-bouilly-green group-hover:bg-bouilly-green group-hover:text-white transition-all duration-300">
                      <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                   </div>
                </div>
                
                <div className="relative z-10 mt-auto">
                  <h3 className="font-title font-bold text-xl text-bouilly-darkGreen mb-2 group-hover:text-bouilly-green transition-colors pr-4">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-bouilly-gold transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-bouilly-gold transition-colors"></span>
                    Commencer
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

     {/* --- SECTION CALENDRIER --- */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen mb-4">
                Agenda Municipal
              </h2>
              <div className="w-20 h-1 bg-bouilly-gold mx-auto rounded-full opacity-50"></div>
           </div>
           
           {/* Intégration du Calendrier */}
           <Calendar events={events} />
        </div>
      </section>

      <Footer />
    </main>
  );
}