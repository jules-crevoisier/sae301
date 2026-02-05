"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoisirsHero from "@/components/loisirs/LoisirsHero";
import FacilitiesList from "@/components/loisirs/FacilitiesList";
import AssociationsList from "@/components/loisirs/AssociationsList";
import Link from "next/link"; // N'oublie pas l'import de Link
import { ArrowRight } from "lucide-react"; // Et de l'icône

export default function LoisirsPage() {
  return (
    <main className="min-h-screen bg-bouilly-cream">
      <Header />
      
      {/* 1. Hero */}
      <LoisirsHero />

      {/* 2. Équipements */}
      <FacilitiesList />

      {/* 3. Liste Associations */}
      <AssociationsList />

      {/* 4. Call to Action Final - Style Premium */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-bouilly-gold/20">
        
        {/* Déco fond subtile */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-bouilly-cream -skew-x-12 translate-x-32 pointer-events-none opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bouilly-green/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
           
           {/* Petit ornement doré pour le style */}
           <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-bouilly-gold to-transparent rounded-full opacity-60"></div>
           </div>

           <h2 className="font-title font-bold text-4xl md:text-5xl text-bouilly-darkGreen mb-6">
             Vous organisez un événement ?
           </h2>
           <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-light">
             Associations, faites apparaître vos manifestations dans l'agenda communal et sur le site internet de la mairie pour toucher un plus large public.
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
             <Link 
               href="/contact" 
               className="group px-9 py-4 bg-bouilly-darkGreen text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-bouilly-green transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-1"
             >
               Proposer un événement
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </Link>
             
             <Link 
               href="/mairie" 
               className="px-9 py-4 bg-white border border-gray-200 text-bouilly-darkGreen font-bold rounded-full hover:border-bouilly-gold hover:text-bouilly-gold hover:bg-bouilly-cream/30 transition-all duration-300 shadow-sm"
             >
               Voir l'agenda
             </Link>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}