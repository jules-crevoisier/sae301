"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, X, Search, ChevronDown, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: "Accueil", href: "/", id: "home" }, 
  { name: "Mairie & Démarches", href: "/mairie", id: "mairie" }, 
  { name: "Loisirs & Vie Locale", href: "/loisirs", id: "loisirs" },
  { name: "Découvrir la Commune", href: "/decouvrir", id: "decouvrir" },
  { name: "Actualités", href: "/actualites", id: "actus" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("home");
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 300);
    }
  }, [isSearchOpen]);

  // VARIANTS ANIMATIONS
  const mobileMenuVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  const containerVars = {
    initial: { transition: { staggerChildren: 0.05 } },
    open: { transition: { delayChildren: 0.1, staggerChildren: 0.07 } }
  };
  const linkVars = {
    initial: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b 
          ${scrolled 
            ? 'py-3 bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-sm' 
            : 'py-5 bg-transparent border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12 relative z-50">
          
          {/* --- BLOC IDENTITÉ (Interaction Or au survol) --- */}
          {/* J'utilise 'group' ici : survoler l'image OU le texte déclenche l'effet */}
          <div className={`flex items-center gap-3 group cursor-pointer ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
            
            {/* L'Image : Zoom + légère rotation au survol */}
            <div className="relative w-9 h-11 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
                <img src="/images/blason.png" alt="Blason" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="text-[0.6rem] uppercase tracking-[0.2em] font-sans font-bold text-gray-400 leading-tight transition-colors duration-300 group-hover:text-bouilly-green">Mairie de</span>
              
              {/* Le Texte : Devient Or au survol du groupe */}
              <span className={`font-title font-bold text-lg leading-none tracking-wide mt-0.5 transition-colors duration-300 group-hover:text-bouilly-gold ${scrolled ? 'text-bouilly-green' : 'text-bouilly-darkGreen'}`}>
                Bouilly
              </span>
            </div>
          </div>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex flex-1 justify-center items-center px-4">
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div
                  key="search-bar"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-xl relative"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bouilly-green pointer-events-none" size={18} />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Rechercher..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-bouilly-gold/50 transition-all shadow-inner"
                  />
                </motion.div>
              ) : (
                <nav 
                    className="flex items-center bg-white/50 p-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-sm"
                    onMouseLeave={() => setHoveredTab(null)}
                >
                  {navLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); setActiveTab(link.id); }}
                      onMouseEnter={() => setHoveredTab(link.id)}
                      className="relative px-4 py-1.5 text-sm font-medium transition-colors outline-none"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {/* 1. INDICATEUR ACTIF (Blanc pur + Ombre douce) */}
                      {activeTab === link.id && (
                        <motion.span
                          layoutId="active-pill"
                          className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      {/* 2. LE FANTÔME (Vert très pâle au lieu de gris) */}
                      {hoveredTab === link.id && activeTab !== link.id && (
                        <motion.span
                          layoutId="hover-pill"
                          className="absolute inset-0 bg-bouilly-green/5 rounded-full z-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}

                      <span className={`relative z-10 transition-colors duration-200 ${activeTab === link.id ? "text-bouilly-green font-bold" : "text-gray-600 hover:text-bouilly-darkGreen"}`}>
                        {link.name}
                      </span>
                    </a>
                  ))}
                </nav>
              )}
            </AnimatePresence>
          </div>

          {/* --- DESKTOP ACTIONS --- */}
          <div className="hidden lg:flex items-center gap-3">
             <AnimatePresence mode="wait">
               {isSearchOpen ? (
                 <motion.button 
                    key="close" 
                    initial={{ rotate: -90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    exit={{ rotate: 90, opacity: 0 }} 
                    onClick={() => setIsSearchOpen(false)} 
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border text-red-500 hover:bg-red-50 transition-colors"
                 >
                   <X size={18} />
                 </motion.button>
               ) : (
                 <motion.button 
                    key="search" 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.8, opacity: 0 }} 
                    onClick={() => setIsSearchOpen(true)} 
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-gray-200 text-gray-500 hover:text-bouilly-gold hover:border-bouilly-gold transition-colors shadow-sm"
                 >
                   <Search size={16} />
                 </motion.button>
               )}
             </AnimatePresence>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-bouilly-darkGreen hover:bg-bouilly-green/5 rounded-full transition-colors">
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>

        </div>
      </motion.header>


      {/* --- MENU MOBILE (Plein écran) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            variants={mobileMenuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40 bg-bouilly-cream/98 backdrop-blur-3xl flex flex-col pt-24 px-6"
          >
             <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <img src="/images/blason.png" className="w-80 h-80 object-contain" />
             </div>

             <motion.div variants={containerVars} initial="initial" animate="open" className="flex flex-col space-y-6 max-w-md mx-auto w-full relative z-10">
                
                {/* Recherche Mobile */}
                <motion.div variants={linkVars} className="relative mb-4">
                   <input type="text" placeholder="Rechercher..." className="w-full bg-white border border-bouilly-gold/20 rounded-xl py-4 px-5 text-lg outline-none focus:ring-2 focus:ring-bouilly-gold/50 shadow-sm" />
                   <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-bouilly-gold" />
                </motion.div>

                <nav className="flex flex-col space-y-2">
                   {navLinks.map((link) => (
                      <motion.a 
                        key={link.name} 
                        variants={linkVars} 
                        href="#" 
                        className="text-2xl font-title font-medium text-bouilly-darkGreen py-3 border-b border-gray-200/50 flex justify-between items-center group active:scale-95 transition-transform"
                      >
                         {link.name}
                         <ArrowRight size={20} className="text-gray-300 group-hover:text-bouilly-gold group-hover:translate-x-2 transition-all" />
                      </motion.a>
                   ))}
                </nav>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}