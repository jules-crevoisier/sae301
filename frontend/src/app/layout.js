import { Inter, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";

// Configuration des polices selon la charte
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap'
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat",
  display: 'swap'
});

const greatVibes = Great_Vibes({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-great-vibes",
  display: 'swap'
});

export const metadata = {
  title: "Mairie de Bouilly",
  description: "Site officiel de la commune de Bouilly (Aube), au cœur de la nature.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${montserrat.variable} ${greatVibes.variable} font-sans bg-gray-50 text-gray-800 antialiased`}>
        {children}
      </body>
    </html>
  );
}