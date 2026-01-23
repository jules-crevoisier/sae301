"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMessage from '@/components/admin/AdminMessage';
import AdminSearchBar from '@/components/admin/AdminSearchBar';
import AdminStats from '@/components/admin/AdminStats';
import AdminRegistrationCard from '@/components/admin/AdminRegistrationCard';
import AdminLogin from '@/components/admin/AdminLogin';
import { Users, AlertCircle, Plus, LogOut, RefreshCw, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [oldInscriptions, setOldInscriptions] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showOldInscriptions, setShowOldInscriptions] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('admin_authenticated') === 'true';
      const loginTime = localStorage.getItem('admin_login_time');
      
      // Vérifier si la session n'a pas expiré (24 heures)
      if (authenticated && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
          // Session expirée
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

  // Charger les inscriptions complètes (nouvelle API)
  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/inscriptions');
      if (response.ok) {
        const data = await response.json();
        const registrationsData = data.data || data;
        setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
      } else {
        console.warn('Erreur lors du chargement des nouvelles inscriptions');
      }
    } catch (error) {
      console.error('Erreur nouvelles inscriptions:', error);
    }
  };

  // Charger les anciennes inscriptions (ancienne API)
  const fetchOldInscriptions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/cantine');
      if (response.ok) {
        const data = await response.json();
        setOldInscriptions(Array.isArray(data) ? data : []);
      } else {
        console.warn('Erreur lors du chargement des anciennes inscriptions');
      }
    } catch (error) {
      console.error('Erreur anciennes inscriptions:', error);
    }
  };

  // Charger toutes les inscriptions
  const fetchAllInscriptions = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchRegistrations(), fetchOldInscriptions()]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllInscriptions();
    }
  }, [isAuthenticated]);

  // Filtrer les inscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const allItems = [...registrations];
    
    // Ajouter les anciennes inscriptions si activées
    if (showOldInscriptions && oldInscriptions.length > 0) {
      oldInscriptions.forEach(old => {
        allItems.push({
          id: `old_${old.id}`,
          isOld: true,
          summary: {
            family: {
              email: old.email_parent,
              reference_number: `OLD-${old.id}`
            },
            children: [{
              first_name: old.prenom,
              last_name: old.nom,
              class_level: old.classe,
              allergies: [],
              canteen_days: []
            }]
          },
          oldData: old
        });
      });
    }

    if (!searchTerm.trim()) {
      setFilteredRegistrations(allItems);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = allItems.filter(registration => {
      // Anciennes inscriptions
      if (registration.isOld && registration.oldData) {
        const old = registration.oldData;
        return (
          old.nom?.toLowerCase().includes(searchLower) ||
          old.prenom?.toLowerCase().includes(searchLower) ||
          old.classe?.toLowerCase().includes(searchLower) ||
          old.email_parent?.toLowerCase().includes(searchLower) ||
          old.regime_alimentaire?.toLowerCase().includes(searchLower)
        );
      }

      // Nouvelles inscriptions
      const summary = registration.summary || {};
      const family = summary.family || {};
      const parents = summary.parents || [];
      const children = summary.children || [];

      if (
        family.reference_number?.toLowerCase().includes(searchLower) ||
        family.email?.toLowerCase().includes(searchLower) ||
        family.address_line1?.toLowerCase().includes(searchLower) ||
        family.city?.toLowerCase().includes(searchLower) ||
        family.postal_code?.toLowerCase().includes(searchLower) ||
        family.phone_primary?.toLowerCase().includes(searchLower) ||
        parents.some(parent => 
          parent.first_name?.toLowerCase().includes(searchLower) ||
          parent.last_name?.toLowerCase().includes(searchLower) ||
          parent.email?.toLowerCase().includes(searchLower)
        ) ||
        children.some(child => 
          child.first_name?.toLowerCase().includes(searchLower) ||
          child.last_name?.toLowerCase().includes(searchLower) ||
          child.school_name?.toLowerCase().includes(searchLower) ||
          child.class_level?.toLowerCase().includes(searchLower)
        )
      ) {
        return true;
      }

      return false;
    });
    setFilteredRegistrations(filtered);
  }, [searchTerm, registrations, oldInscriptions, showOldInscriptions, isAuthenticated]);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    setMessage({ type: '', text: '' });
  };

  // Supprimer une inscription
  const handleDelete = async (id, isOld = false) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      return;
    }

    try {
      const endpoint = isOld 
        ? `http://localhost:4000/api/cantine/${id.replace('old_', '')}`
        : `http://localhost:4000/api/inscriptions/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Inscription supprimée avec succès' });
        fetchAllInscriptions();
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la suppression' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalChildren = registrations.reduce((sum, reg) => {
    return sum + (reg.summary?.children?.length || 0);
  }, 0) + oldInscriptions.length;

  const totalParents = registrations.reduce((sum, reg) => {
    return sum + (reg.summary?.parents?.length || 0);
  }, 0);

  // Afficher le login si non authentifié
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bouilly-green/10 rounded-full flex items-center justify-center">
                  <Users className="text-bouilly-green" size={24} />
                </div>
                <div>
                  <h1 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen mb-2">
                    Panel d'Administration
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Gestion des inscriptions à la cantine
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAllInscriptions}
                  className="flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors"
                  title="Actualiser"
                >
                  <RefreshCw size={18} />
                  <span className="hidden md:inline">Actualiser</span>
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
                className="px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors flex items-center gap-2"
              >
                <Users size={18} />
                <span>Inscriptions</span>
              </Link>
              <Link
                href="/admin/actualites"
                className="px-4 py-2 bg-white border-2 border-bouilly-green text-bouilly-green rounded-lg hover:bg-bouilly-green/10 transition-colors flex items-center gap-2"
              >
                <FileText size={18} />
                <span>Actualités</span>
              </Link>
              <Link
                href="/admin/evenements"
                className="px-4 py-2 bg-white border-2 border-bouilly-green text-bouilly-green rounded-lg hover:bg-bouilly-green/10 transition-colors flex items-center gap-2"
              >
                <Calendar size={18} />
                <span>Événements</span>
              </Link>
            </div>
          </motion.div>

          <AdminMessage 
            message={message} 
            onClose={() => setMessage({ type: '', text: '' })} 
          />

          {/* Message si aucune inscription */}
          {!loading && registrations.length === 0 && oldInscriptions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="text-yellow-600 shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Aucune inscription trouvée
                  </h3>
                  <p className="text-sm text-yellow-700 mb-4">
                    Il n'y a actuellement aucune inscription dans la base de données. 
                    Créez votre première inscription via le formulaire d'inscription.
                  </p>
                  <Link
                    href="/inscription-cantine"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors"
                  >
                    <Plus size={18} />
                    Créer une inscription
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Toggle pour afficher les anciennes inscriptions */}
          {oldInscriptions.length > 0 && (
            <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-bouilly-darkGreen">
                  Anciennes inscriptions trouvées ({oldInscriptions.length})
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Ces inscriptions utilisent l'ancien format simplifié
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOldInscriptions}
                  onChange={(e) => setShowOldInscriptions(e.target.checked)}
                  className="w-4 h-4 text-bouilly-gold focus:ring-bouilly-gold rounded"
                />
                <span className="text-sm font-medium">Afficher les anciennes inscriptions</span>
              </label>
            </div>
          )}

          <AdminSearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />

          <AdminStats 
            total={registrations.length + (showOldInscriptions ? oldInscriptions.length : 0)}
            filtered={filteredRegistrations.length}
            editing={false}
          />

          {/* Statistiques supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total parents</p>
              <p className="text-2xl font-bold text-bouilly-darkGreen">{totalParents}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total enfants</p>
              <p className="text-2xl font-bold text-bouilly-darkGreen">{totalChildren}</p>
            </div>
          </div>

          {/* Liste des inscriptions */}
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bouilly-green mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des inscriptions...</p>
              </div>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-500">
              <Users size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {searchTerm ? 'Aucun résultat trouvé' : 'Aucune inscription pour le moment'}
              </p>
              <p className="text-sm mb-4">
                {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Les inscriptions apparaîtront ici une fois créées'}
              </p>
              {!searchTerm && (
                <Link
                  href="/inscription-cantine"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-bouilly-green text-white rounded-lg hover:bg-bouilly-darkGreen transition-colors"
                >
                  <Plus size={18} />
                  Créer une inscription
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((registration) => (
                <AdminRegistrationCard
                  key={registration.id}
                  registration={registration}
                  onDelete={(id) => handleDelete(id, registration.isOld)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
