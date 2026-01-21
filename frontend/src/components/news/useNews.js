"use client";
import { useState, useEffect } from 'react';
import { API_URL } from './newsConstants';

export const useNews = (category = 'all', limit = null) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = category === 'all' 
        ? `${API_URL}/api/news`
        : `${API_URL}/api/news/category/${category}`;
      
      if (limit) {
        url += `?limit=${limit}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data || []);
      } else {
        setError('Erreur lors du chargement des actualités');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les actualités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, limit]);

  return { news, loading, error, refetch: fetchNews };
};
