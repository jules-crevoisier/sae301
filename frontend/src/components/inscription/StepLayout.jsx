import { motion } from "framer-motion";

export default function StepLayout({ stepNumber, title, description, children }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
      {/* Colonne de gauche : Le Numéro */}
      <div className="hidden md:flex flex-col items-center sticky top-24 shrink-0 w-24">
        <div className="w-20 h-20 rounded-full bg-white border-4 border-bouilly-green text-bouilly-darkGreen font-title font-bold text-4xl flex items-center justify-center shadow-lg z-10">
          {stepNumber}
        </div>
        <div className="w-1 h-32 bg-gradient-to-b from-bouilly-green to-transparent -mt-2 opacity-30 rounded-full" />
      </div>

      {/* Colonne de droite : Le contenu */}
      <div className="flex-1 w-full">
        <div className="mb-6 md:hidden flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-bouilly-green text-white font-bold text-xl flex items-center justify-center">
            {stepNumber}
          </div>
          <h2 className="text-xl font-bold text-bouilly-darkGreen">{title}</h2>
        </div>
        
        <div className="md:mb-8 hidden md:block">
           <h2 className="text-3xl font-title font-bold text-bouilly-darkGreen mb-2">{title}</h2>
           <p className="text-gray-500">{description}</p>
        </div>

        {children}
      </div>
    </div>
  );
}