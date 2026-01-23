"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar } from '@/components/calendar/Calendar';
import { useEvents } from '@/hooks/useEvents';
import { FileText, Calendar as CalendarIcon, Building2 } from 'lucide-react';

export default function MairiePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Récupérer tous les événements (on peut filtrer par catégorie si nécessaire)
  const { events, loading, error } = useEvents(
    selectedCategory !== 'all' ? { category: selectedCategory } : {}
  );

  return (
    <main className="min-h-screen flex flex-col bg-bouilly-cream">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-bouilly-green/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-bouilly-green/10 rounded-2xl flex items-center justify-center">
                <Building2 className="text-bouilly-green" size={32} />
              </div>
              <h1 className="font-title font-bold text-4xl md:text-5xl text-bouilly-darkGreen">
                Mairie & Démarches
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Retrouvez tous les événements et informations importantes de la mairie de Bouilly
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calendrier Section */}
      <section className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <p>Erreur lors du chargement des événements : {error}</p>
            </div>
          )}
          
          <Calendar events={events} loading={loading} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
