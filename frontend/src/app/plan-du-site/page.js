"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Home, 
  FileText, 
  Utensils, 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  Map,
  Info
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Configuration des sections du site
const SITE_SECTIONS = [
  {
    title: "Général",
    icon: Home,
    links: [
      { label: "Accueil", href: "/" },
      { label: "Contact", href: "/contact" }, // Page à créer ou lien vers footer
      { label: "À propos de la commune", href: "/commune" }, // Page classique mairie
    ]
  },
  {
    title: "Vie Municipale",
    icon: FileText,
    links: [
      { label: "Actualités", href: "/actualites" },
      { label: "Agenda des événements", href: "/agenda" },
      { label: "Conseil Municipal", href: "/conseil-municipal" },
    ]
  },
  {
    title: "Services en ligne",
    icon: Utensils,
    links: [
      { label: "Inscription Cantine", href: "/inscription-cantine" },
      { label: "Portail Famille", href: "/portail-famille" },
      { label: "Démarches administratives", href: "/demarches" },
    ]
  },
  {
    title: "Administration",
    icon: Lock,
    links: [
      { label: "Espace Agent", href: "/admin" },
      { label: "Gestion des actualités", href: "/admin/actualites" },
    ]
  },
  {
    title: "Informations Légales",
    icon: Shield,
    links: [
      { label: "Mentions Légales", href: "/mentions-legales" },
      { label: "Politique de Confidentialité", href: "/confidentialite" },
      { label: "Accessibilité", href: "/accessibilite" },
    ]
  }
];

export default function PlanDuSite() {
  return (
    <main className="min-h-screen bg-bouilly-cream flex flex-col">
      <Header />

      <div className="flex-1 pt-32 pb-20">
        
        {/* En-tête de page */}
        <section className="max-w-7xl mx-auto px-4 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
               <span className="h-[1px] w-12 bg-bouilly-gold"></span>
               <span className="font-title font-bold text-xs uppercase tracking-[0.25em] text-bouilly-gold">
                 Navigation
               </span>
               <span className="h-[1px] w-12 bg-bouilly-gold"></span>
            </div>
            
            <h1 className="font-title font-bold text-4xl md:text-5xl text-bouilly-darkGreen mb-4">
              Plan du Site
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Retrouvez l'ensemble des pages et services disponibles sur le portail numérique de Bouilly.
            </p>
          </motion.div>
        </section>

        {/* Grille des liens */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SITE_SECTIONS.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Titre de Section */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-bouilly-green/10 flex items-center justify-center text-bouilly-green">
                    <section.icon size={20} />
                  </div>
                  <h2 className="font-title font-bold text-lg text-bouilly-darkGreen">
                    {section.title}
                  </h2>
                </div>

                {/* Liste des liens */}
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="group flex items-center justify-between text-gray-600 hover:text-bouilly-green transition-colors text-sm font-medium p-2 rounded-lg hover:bg-gray-50"
                      >
                        <span className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-bouilly-gold transition-colors"></span>
                           {link.label}
                        </span>
                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-bouilly-gold" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}