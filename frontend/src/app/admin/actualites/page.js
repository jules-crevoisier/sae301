"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminMessage from "@/components/admin/AdminMessage";
import NewsAdminSearch from "@/components/admin/news/NewsAdminSearch";
import NewsAdminStats from "@/components/admin/news/NewsAdminStats";
import NewsAdminList from "@/components/admin/news/NewsAdminList";
import NewsFormModal from "@/components/admin/news/NewsFormModal";
import { FileText, Plus, LogOut, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/utils/newsConstants";

const initialFormData = {
  title: "",
  category: "CULTURE",
  content: "",
  image_url: "",
  date: new Date().toISOString().split("T")[0],
  is_featured: false,
};

export default function AdminActualitesPage() {
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Data States
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nouvel état pour les actions
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // 1. Vérification d'authentification améliorée
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem("admin_authenticated") === "true";
      const loginTime = localStorage.getItem("admin_login_time");

      if (authenticated && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
          handleLogout(); // Utilisation de la fonction centralisée
        }
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // 2. Auto-dismiss des messages de succès (UX)
  useEffect(() => {
    if (message.type === 'success') {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Charger les actualités
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/news`);
      const data = await response.json();

      if (data.success) {
        // Tri par date décroissante (plus récent en haut)
        const sortedNews = (data.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setNews(sortedNews);
      } else {
        setMessage({ type: "error", text: "Erreur lors du chargement des actualités" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage({ type: "error", text: "Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNews();
    }
  }, [isAuthenticated]);

  // Filtrer les actualités (Memoized)
  const filteredNews = useMemo(() => {
    if (!searchTerm.trim()) return news;
    const searchLower = searchTerm.toLowerCase();
    return news.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.content?.toLowerCase().includes(searchLower),
    );
  }, [news, searchTerm]);

  // Handlers Formulaire
  const handleCreate = () => {
    setEditingNews(null);
    setFormData(initialFormData);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title || "",
      category: item.category || "CULTURE",
      content: item.content || "",
      image_url: item.image_url || "",
      date: item.date ? item.date.split("T")[0] : new Date().toISOString().split("T")[0],
      is_featured: item.is_featured === 1 || item.is_featured === true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Empêche le double clic

    setIsSubmitting(true);
    try {
      const url = editingNews
        ? `${API_URL}/api/news/${editingNews.id}`
        : `${API_URL}/api/news`;

      const method = editingNews ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: editingNews ? "Actualité modifiée avec succès" : "Actualité créée avec succès",
        });
        setShowForm(false);
        setEditingNews(null);
        fetchNews();
      } else {
        setMessage({ type: "error", text: data.message || "Erreur lors de l'enregistrement" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage({ type: "error", text: "Erreur de connexion au serveur" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) return;
    
    // On met un petit loading global ou on désactive l'interface idéalement, 
    // mais ici on garde simple en bloquant juste les autres actions via le flag
    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/news/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Actualité supprimée avec succès" });
        // Optimistic update : on retire l'élément de la liste immédiatement
        setNews(prev => prev.filter(item => item.id !== id));
      } else {
        setMessage({ type: "error", text: data.message || "Erreur lors de la suppression" });
        fetchNews(); // Re-sync en cas d'erreur
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage({ type: "error", text: "Erreur de connexion au serveur" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_login_time");
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bouilly-cream">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-bouilly-green" />
          <p className="text-bouilly-darkGreen font-medium">Chargement de l'administration...</p>
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
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-bouilly-green/10 rounded-2xl flex items-center justify-center shadow-sm">
                  <FileText className="text-bouilly-green" size={28} />
                </div>
                <div>
                  <h1 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen">
                    Actualités
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Gestion des articles et communications
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-bouilly-green text-white rounded-xl hover:bg-bouilly-darkGreen transition-all shadow-lg shadow-bouilly-green/20 transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  <span className="font-semibold">Nouvelle actualité</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-white border-2 border-red-100 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs - Style unifié "Bouilly" */}
            <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 w-fit mb-8">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-bouilly-green hover:bg-white transition-all"
              >
                <Users size={18} />
                <span>Inscriptions</span>
              </Link>
              <div className="flex items-center gap-2 px-6 py-2.5 bg-bouilly-green text-white rounded-lg shadow-sm text-sm font-semibold">
                <FileText size={18} />
                <span>Actualités</span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <AdminMessage
                  message={message}
                  onClose={() => setMessage({ type: "", text: "" })}
                />
              </motion.div>
            )}
          </AnimatePresence>

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
        isLoading={isSubmitting} 
      />

      <Footer />
    </main>
  );
}