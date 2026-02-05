"use client";
import { motion } from "framer-motion";

const HERITAGE_ITEMS = [
  {
    title: "Église Saint-Laurent",
    desc: "Un joyau de l'architecture religieuse locale, datant du XIIe siècle et remaniée au XVIe. Son clocher domine le village.",
    img: "https://images.unsplash.com/photo-1548625361-eeca8d617930?auto=format&fit=crop&q=80&w=800" // Placeholder "Église de village"
  },
  {
    title: "La Colline de Montaigu",
    desc: "Point culminant offrant des panoramas exceptionnels sur la plaine de Troyes et le début du Pays d'Othe. Un lieu prisé des randonneurs.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800" // Placeholder "Colline/Nature"
  },
  {
    title: "Le Lavoir Communal",
    desc: "Témoin de la vie sociale d'autrefois, ce lavoir restauré rappelle l'importance de l'eau dans l'histoire du village.",
    img: "https://images.unsplash.com/photo-1596395995878-838634567283?auto=format&fit=crop&q=80&w=800" // Placeholder "Pierre/Ancien"
  }
];

export default function HeritageGallery() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen">
             Patrimoine & Nature
           </h2>
           <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
             Bouilly conserve les traces de son passé tout en offrant un cadre naturel préservé.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HERITAGE_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-all duration-500">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-title font-bold text-xl text-bouilly-darkGreen mb-2 group-hover:text-bouilly-green transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}