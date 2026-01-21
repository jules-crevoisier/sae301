"use client";
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminMessage from '@/components/admin/AdminMessage';
import NewsAdminSearch from '@/components/news/NewsAdminSearch';
import NewsAdminStats from '@/components/news/NewsAdminStats';
import NewsAdminList from '@/components/news/NewsAdminList';
import NewsFormModal from '@/components/news/NewsFormModal';
import { FileText, Plus, LogOut, Users } from 'lucide-react';
import Link from 'next/link';
import { API_URL, NEWS_CATEGORIES } from '@/components/news/newsConstants';

const initialFormData = {
  title: '',
  category: 'CULTURE',
  content: '',
  image_url: '',
  date: new Date().toISOString().split('T')[0],
  is_featured: false
};

export default function AdminActualitesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('admin_authenticated') === 'true';
      const loginTime = localStorage.getItem('admin_login_time');
      
      if (authenticated && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_login_time');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Charger les actualités
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/news`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data || []);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors du chargement des actualités' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNews();
    }
  }, [isAuthenticated]);

  // Filtrer les actualités
  const filteredNews = useMemo(() => {
    if (!searchTerm.trim()) return news;
    const searchLower = searchTerm.toLowerCase();
    return news.filter(item => 
      item.title?.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower) ||
      item.content?.toLowerCase().includes(searchLower)
    );
  }, [news, searchTerm]);

  // Ouvrir le formulaire pour créer
  const handleCreate = () => {
    setEditingNews(null);
    setFormData(initialFormData);
    setShowForm(true);
  };

  // Ouvrir le formulaire pour modifier
  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'CULTURE',
      content: item.content || '',
      image_url: item.image_url || '',
      date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
      is_featured: item.is_featured === 1 || item.is_featured === true
    });
    setShowForm(true);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingNews 
        ? `${API_URL}/api/news/${editingNews.id}`
        : `${API_URL}/api/news`;
      
      const method = editingNews ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: editingNews ? 'Actualité modifiée avec succès' : 'Actualité créée avec succès' 
        });
        setShowForm(false);
        setEditingNews(null);
        fetchNews();
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de l\'enregistrement' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

  // Supprimer une actualité
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/news/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Actualité supprimée avec succès' });
        fetchNews();
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la suppression' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bouilly-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bouilly-green mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <main className="min-h-screen flex flex-col bg-bouilly-cream">
      <Header />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bouilly-green/10 rounded-full flex items-center justify-center">
                  <FileText className="text-bouilly-green" size={24} />
                </div>
                <div>
                  <h1 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen mb-2">
                    Gestion des Actualités
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Créez, modifiez et supprimez les actualités de la commune
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors"
                >
                  <Plus size={18} />
                  <span className="hidden md:inline">Nouvelle actualité</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Déconnexion</span>
                </button>
              </div>
            </div>

            {/* Navigation Admin */}
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/admin"
                className="px-4 py-2 bg-white border-2 border-bouilly-green text-bouilly-green rounded-lg hover:bg-bouilly-green/10 transition-colors flex items-center gap-2"
              >
                <Users size={18} />
                <span>Inscriptions</span>
              </Link>
              <Link
                href="/admin/actualites"
                className="px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors flex items-center gap-2"
              >
                <FileText size={18} />
                <span>Actualités</span>
              </Link>
            </div>
          </motion.div>

          <AdminMessage 
            message={message} 
            onClose={() => setMessage({ type: '', text: '' })} 
          />

          <NewsAdminSearch value={searchTerm} onChange={setSearchTerm} />

          <NewsAdminStats news={news} filteredCount={filteredNews.length} />

          <NewsAdminList
            news={filteredNews}
            loading={loading}
            searchTerm={searchTerm}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <NewsFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingNews(null);
        }}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={!!editingNews}
      />

      <Footer />
    </main>
  );
}
