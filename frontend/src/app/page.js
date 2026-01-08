import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import NewsGrid from '@/components/sections/NewsGrid';
import Partners from '@/components/sections/Partners';
import About from '@/components/sections/About';
import PanneauPocket from '@/components/sections/PanneauPocket';
import Footer from '@/components/layout/Footer';


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <NewsGrid />
      <Partners />
      <About />
      <PanneauPocket />
      <Footer />
    </main>
  );
}