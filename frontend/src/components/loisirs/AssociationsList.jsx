"use client";
import { motion } from 'framer-motion';
import { Users, Music, Trophy, Heart } from 'lucide-react';

const ASSOCIATIONS = [
  {
    category: "Sport",
    icon: Trophy,
    color: "bg-orange-50 text-orange-600",
    list: [
      { name: "Football Club Bouilly", president: "M. Dupont", phone: "06 00 00 00 00" },
      { name: "Tennis Club", president: "Mme Martin", phone: "06 00 00 00 00" },
      { name: "Judo Club", president: "M. Bernard", phone: "06 00 00 00 00" }
    ]
  },
  {
    category: "Culture & Loisirs",
    icon: Music,
    color: "bg-purple-50 text-purple-600",
    list: [
      { name: "Harmonie Municipale", president: "M. Petit", phone: "06 00 00 00 00" },
      { name: "Club Photo", president: "Mme Durand", phone: "06 00 00 00 00" },
      { name: "Bibliothèque pour Tous", president: "Mme Leroy", phone: "06 00 00 00 00" }
    ]
  },
  {
    category: "Solidarité",
    icon: Heart,
    color: "bg-rose-50 text-rose-600",
    list: [
      { name: "Aînés Ruraux", president: "M. Morel", phone: "06 00 00 00 00" },
      { name: "Secours Populaire", president: "Mme Simon", phone: "06 00 00 00 00" },
      { name: "Association des Parents d'Élèves", president: "M. Michel", phone: "06 00 00 00 00" }
    ]
  }
];

export default function AssociationsList() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen">
              Annuaire des Associations
            </h2>
            <p className="text-gray-500 mt-2">
              Retrouvez les contacts pour rejoindre les clubs et activités de la commune.
            </p>
          </div>
          <button className="px-6 py-3 bg-white border border-gray-200 text-bouilly-green font-bold rounded-xl hover:bg-bouilly-green hover:text-white transition-all shadow-sm">
            Télécharger le guide PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ASSOCIATIONS.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${section.color}`}>
                  <section.icon size={24} />
                </div>
                <h3 className="font-title font-bold text-2xl text-bouilly-darkGreen">
                  {section.category}
                </h3>
              </div>

              <ul className="space-y-6">
                {section.list.map((asso, idx) => (
                  <li key={idx} className="flex flex-col pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <span className="font-bold text-gray-800 text-lg">{asso.name}</span>
                    <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                      <span>Prés. : {asso.president}</span>
                      <span className="font-medium text-bouilly-green bg-bouilly-green/5 px-2 py-0.5 rounded">
                        {asso.phone}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}