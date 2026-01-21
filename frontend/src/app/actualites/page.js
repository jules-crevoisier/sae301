"use client";
import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsHero from '@/components/news/NewsHero';
import NewsFilters from '@/components/news/NewsFilters';
import NewsList from '@/components/news/NewsList';
import NewsPagination from '@/components/news/NewsPagination';
import { useNews } from '@/components/news/useNews';

const ITEMS_PER_PAGE = 8;

export default function ActualitesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { news, loading, error, refetch } = useNews(selectedCategory);

  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return news.slice(start, end);
  }, [news, currentPage]);

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bouilly-cream">
      <Header />
      
      <NewsHero />

      <NewsFilters 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <NewsList 
            news={paginatedNews}
            loading={loading}
            error={error}
            onRetry={refetch}
          />
          
          <NewsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
