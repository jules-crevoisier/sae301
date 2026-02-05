"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Users, Trees, Ruler, Building2 } from "lucide-react";

// J'ai transformé "value" en nombre pur (number) et ajouté "suffix" pour le texte (m, %, etc.)
const FIGURES = [
  { 
    id: 1, 
    label: "Habitants", 
    value: 1093, 
    suffix: "",
    sub: "Bouillerands & Bouillerandes",
    icon: Users,
    color: "bg-bouilly-green",
    span: "md:col-span-2",
    decimals: 0
  },
  { 
    id: 2, 
    label: "Superficie", 
    value: 15.49, 
    suffix: "", // Le km² est dans le sub, ou on peut le mettre ici
    sub: "km² de territoire",
    icon: Ruler,
    color: "bg-bouilly-gold",
    span: "md:col-span-1",
    decimals: 2
  },
  { 
    id: 3, 
    label: "Altitude", 
    value: 155, 
    suffix: "m",
    sub: "Au niveau de la mairie",
    icon: Building2,
    color: "bg-blue-500",
    span: "md:col-span-1",
    decimals: 0
  },
  { 
    id: 4, 
    label: "Nature", 
    value: 40, 
    suffix: "%",
    sub: "De couverture forestière",
    icon: Trees,
    color: "bg-emerald-600",
    span: "md:col-span-2",
    decimals: 0
  },
];

/**
 * Composant dédié au compteur animé
 */
function AnimatedNumber({ value, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" }); // Déclenche quand visible
  
  // Gestion du mouvement du chiffre
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50, // Freinage (plus haut = s'arrête plus net)
    stiffness: 60, // Rapidité (plus haut = plus vite)
    duration: 3000 // Durée approximative si on utilisait tween
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    // S'abonne aux changements de valeur pour mettre à jour le texte
    return springValue.on("change", (latest) => {
      if (ref.current) {
        // Formatage français (espace pour milliers, virgule pour décimales)
        ref.current.textContent = new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(latest) + suffix;
      }
    });
  }, [springValue, decimals, suffix]);

  return <span ref={ref} />;
}

export default function KeyFigures() {
  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FIGURES.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${item.span} relative group overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-100 p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-gray-200`}>
                  <item.icon size={24} />
                </div>
                
                {/* Zone du Chiffre Animé */}
                <h3 className="text-5xl font-title font-bold text-bouilly-darkGreen mb-2 tabular-nums">
                  <AnimatedNumber 
                    value={item.value} 
                    suffix={item.suffix} 
                    decimals={item.decimals}
                  />
                </h3>
                
                <p className="text-lg font-bold text-gray-800">{item.label}</p>
                <p className="text-sm text-gray-500 mt-1">{item.sub}</p>
              </div>
              
              {/* Effet décoratif hover */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}