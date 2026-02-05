"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import { Phone, ShieldCheck, HeartPulse, Flame } from "lucide-react"; 

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bouilly-cream">
      <Header />
      
      {/* 1. Hero */}
      <ContactHero />

      {/* 2. Infos (Cartes) */}
      <ContactInfo />

      {/* 3. Formulaire */}

      {/* 4. Section Urgences - Version Premium */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4">
           
           {/* Conteneur Carte Blanche */}
           <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-xl shadow-bouilly-darkGreen/5 border border-bouilly-green/5 relative overflow-hidden">
              
              {/* Décoration d'arrière-plan (Lueur rouge très légère) */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                 
                 {/* Titre & Info */}
                 <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest mb-3 border border-red-100">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                       24h/24 • 7j/7
                    </div>
                    <h2 className="font-title font-bold text-3xl text-bouilly-darkGreen mb-2">
                       Numéros d'Urgence
                    </h2>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">
                       En cas de danger immédiat, contactez les services de secours adaptés à votre situation.
                    </p>
                 </div>

                 {/* Grille des Numéros */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                    
                    {/* 15 - SAMU */}
                    <div className="group bg-gray-50 hover:bg-white hover:shadow-lg hover:shadow-red-100 hover:scale-105 transition-all duration-300 rounded-2xl p-4 w-full md:w-28 text-center border border-transparent hover:border-red-100 cursor-default">
                       <span className="block text-4xl font-black text-bouilly-darkGreen group-hover:text-red-600 transition-colors mb-1">15</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-400">Samu</span>
                    </div>

                    {/* 18 - POMPIERS */}
                    <div className="group bg-gray-50 hover:bg-white hover:shadow-lg hover:shadow-red-100 hover:scale-105 transition-all duration-300 rounded-2xl p-4 w-full md:w-28 text-center border border-transparent hover:border-red-100 cursor-default">
                       <span className="block text-4xl font-black text-bouilly-darkGreen group-hover:text-red-600 transition-colors mb-1">18</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-400">Feu</span>
                    </div>

                    {/* 17 - POLICE */}
                    <div className="group bg-gray-50 hover:bg-white hover:shadow-lg hover:shadow-red-100 hover:scale-105 transition-all duration-300 rounded-2xl p-4 w-full md:w-28 text-center border border-transparent hover:border-red-100 cursor-default">
                       <span className="block text-4xl font-black text-bouilly-darkGreen group-hover:text-red-600 transition-colors mb-1">17</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-400">Police</span>
                    </div>

                    {/* 112 - EUROPE */}
                    <div className="group bg-bouilly-darkGreen hover:bg-bouilly-green transition-all duration-300 rounded-2xl p-4 w-full md:w-28 text-center shadow-lg shadow-bouilly-green/20 cursor-default">
                       <span className="block text-4xl font-black text-white mb-1">112</span>
                       <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Europe</span>
                    </div>

                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}