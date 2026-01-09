"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMessage from '@/components/admin/AdminMessage';
import AdminSearchBar from '@/components/admin/AdminSearchBar';
import AdminStats from '@/components/admin/AdminStats';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminPage() {
  const [inscriptions, setInscriptions] = useState([]);
  const [filteredInscriptions, setFilteredInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Charger les inscriptions
  const fetchInscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/cantine');
      if (response.ok) {
        const data = await response.json();
        setInscriptions(data);
        setFilteredInscriptions(data);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors du chargement des inscriptions' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscriptions();
  }, []);

  // Filtrer les inscriptions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInscriptions(inscriptions);
      return;
    }

    const filtered = inscriptions.filter(inscription => 
      inscription.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.classe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.email_parent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.regime_alimentaire?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInscriptions(filtered);
  }, [searchTerm, inscriptions]);

  // Démarrer l'édition
  const startEdit = (inscription) => {
    setEditingId(inscription.id);
    setEditForm({
      nom: inscription.nom || '',
      prenom: inscription.prenom || '',
      classe: inscription.classe || '',
      email_parent: inscription.email_parent || '',
      regime_alimentaire: inscription.regime_alimentaire || ''
    });
    setMessage({ type: '', text: '' });
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setMessage({ type: '', text: '' });
  };

  // Sauvegarder les modifications
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/cantine/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Inscription modifiée avec succès' });
        setEditingId(null);
        fetchInscriptions();
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la modification' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

  // Supprimer une inscription
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/cantine/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Inscription supprimée avec succès' });
        fetchInscriptions();
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

  return (
    <main className="min-h-screen flex flex-col bg-bouilly-cream">
      <Header />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          
          <AdminHeader onRefresh={fetchInscriptions} />

          <AdminMessage 
            message={message} 
            onClose={() => setMessage({ type: '', text: '' })} 
          />

          <AdminSearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />

          <AdminStats 
            total={inscriptions.length}
            filtered={filteredInscriptions.length}
            editing={editingId}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <AdminTable
              loading={loading}
              inscriptions={filteredInscriptions}
              searchTerm={searchTerm}
              editingId={editingId}
              editForm={editForm}
              onEditFormChange={setEditForm}
              onStartEdit={startEdit}
              onSave={handleUpdate}
              onCancel={cancelEdit}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
