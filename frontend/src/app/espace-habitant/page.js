"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ResidentLogin } from "@/components/espace-habitant/ResidentLogin";
import { ResidentDashboard } from "@/components/espace-habitant/ResidentDashboard";
import { motion } from "framer-motion";

export default function EspaceHabitantPage() {
  const [residentData, setResidentData] = useState(null);

  const handleSuccess = (data) => {
    setResidentData(data);
  };

  const handleLogout = () => {
    setResidentData(null);
  };

  return (
    <main className="min-h-screen bg-bouilly-cream flex flex-col">
      <Header />

      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-white/40 skew-x-12 translate-x-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-bouilly-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="h-px w-12 bg-bouilly-gold" />
              <span className="font-title font-bold text-xs uppercase tracking-[0.25em] text-bouilly-gold">
                Espace citoyen
              </span>
              <span className="h-px w-12 bg-bouilly-gold" />
            </div>
            <h1 className="font-title font-bold text-4xl md:text-5xl text-bouilly-darkGreen mb-4">
              Mon espace <span className="italic font-serif text-bouilly-gold">citoyen</span>
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Consultez les informations de votre dossier, vos enfants inscrits
              à la cantine et vos démarches.
            </p>
          </motion.div>

          {residentData ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResidentDashboard data={residentData} onLogout={handleLogout} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResidentLogin onSuccess={handleSuccess} />
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
