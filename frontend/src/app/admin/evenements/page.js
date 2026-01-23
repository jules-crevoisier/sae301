"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminMessage from "@/components/admin/AdminMessage";
import { EventAdminSearch } from "@/components/admin/events/EventAdminSearch";
import { EventAdminStats } from "@/components/admin/events/EventAdminStats";
import { EventAdminList } from "@/components/admin/events/EventAdminList";
import { EventFormModal } from "@/components/admin/events/EventFormModal";
import { Calendar, Plus, LogOut, Users, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/utils/eventConstants";

const initialFormData = {
  title: "",
  category: "GENERAL",
  description: "",
  start_date: "",
  end_date: "",
  location: "",
};

export default function AdminEvenementsPage() {
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Data States
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // 1. Vérification d'authentification
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
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // 2. Auto-dismiss des messages de succès
  useEffect(() => {
    if (message.type === 'success') {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Charger les événements
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();

      if (data.success) {
        // Tri par date croissante (plus proche en premier)
        const sortedEvents = (data.data || []).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        setEvents(sortedEvents);
      } else {
        setMessage({ type: "error", text: "Erreur lors du chargement des événements" });
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
      fetchEvents();
    }
  }, [isAuthenticated]);

  // Filtrer les événements
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    const searchLower = searchTerm.toLowerCase();
    return events.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.location?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower),
    );
  }, [events, searchTerm]);

  // Handlers Formulaire
  const handleCreate = () => {
    setEditingEvent(null);
    const now = new Date();
    const defaultDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Demain
    const defaultDateStr = defaultDate.toISOString().slice(0, 16);
    
    setFormData({
      ...initialFormData,
      start_date: defaultDateStr,
    });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingEvent(item);
    const startDate = new Date(item.start_date);
    const endDate = item.end_date ? new Date(item.end_date) : null;
    
    setFormData({
      title: item.title || "",
      category: item.category || "GENERAL",
      description: item.description || "",
      start_date: startDate.toISOString().slice(0, 16),
      end_date: endDate ? endDate.toISOString().slice(0, 16) : "",
      location: item.location || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const url = editingEvent
        ? `${API_URL}/api/events/${editingEvent.id}`
        : `${API_URL}/api/events`;

      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: editingEvent ? "Événement modifié avec succès" : "Événement créé avec succès",
        });
        setShowForm(false);
        setEditingEvent(null);
        fetchEvents();
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;
    
    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Événement supprimé avec succès" });
        setEvents(prev => prev.filter(item => item.id !== id));
      } else {
        setMessage({ type: "error", text: data.message || "Erreur lors de la suppression" });
        fetchEvents();
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
                  <Calendar className="text-bouilly-green" size={28} />
                </div>
                <div>
                  <h1 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen">
                    Événements
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Gestion du calendrier des événements
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-bouilly-green text-white rounded-xl hover:bg-bouilly-darkGreen transition-all shadow-lg shadow-bouilly-green/20 transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  <span className="font-semibold">Nouvel événement</span>
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

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 w-fit mb-8">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-bouilly-green hover:bg-white transition-all"
              >
                <Users size={18} />
                <span>Inscriptions</span>
              </Link>
              <Link
                href="/admin/actualites"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-bouilly-green hover:bg-white transition-all"
              >
                <FileText size={18} />
                <span>Actualités</span>
              </Link>
              <div className="flex items-center gap-2 px-6 py-2.5 bg-bouilly-green text-white rounded-lg shadow-sm text-sm font-semibold">
                <Calendar size={18} />
                <span>Événements</span>
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

          <EventAdminSearch value={searchTerm} onChange={setSearchTerm} />

          <EventAdminStats events={events} filteredCount={filteredEvents.length} />

          <EventAdminList
            events={filteredEvents}
            loading={loading}
            searchTerm={searchTerm}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <EventFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={!!editingEvent}
        isLoading={isSubmitting} 
      />

      <Footer />
    </main>
  );
}
