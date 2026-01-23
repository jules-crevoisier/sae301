"use client";
import { useState, useEffect } from 'react';
import { API_URL } from '@/utils/eventConstants';

export const useEvents = (options = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.start_date) params.append('start_date', options.start_date);
      if (options.end_date) params.append('end_date', options.end_date);
      if (options.category) params.append('category', options.category);
      
      const queryString = params.toString();
      const url = `${API_URL}/api/events${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data || []);
      } else {
        setError(data.message || 'Erreur lors du chargement des événements');
      }
    } catch (err) {
      console.error('Erreur fetch events:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [options.start_date, options.end_date, options.category]);

  const refetch = () => {
    fetchEvents();
  };

  return { events, loading, error, refetch };
};
