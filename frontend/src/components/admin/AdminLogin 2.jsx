"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, LogIn } from 'lucide-react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'; // Mot de passe par défaut

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérification simple du mot de passe
    // En production, il faudrait faire une vraie authentification avec le backend
    if (password === ADMIN_PASSWORD) {
      // Stocker la session dans localStorage
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_login_time', Date.now().toString());
      onLogin(true);
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bouilly-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-bouilly-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-bouilly-green" size={32} />
          </div>
          <h1 className="font-title font-bold text-2xl text-bouilly-darkGreen mb-2">
            Accès Administrateur
          </h1>
          <p className="text-gray-600 text-sm">
            Veuillez entrer le mot de passe pour accéder au panel d'administration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-bouilly-darkGreen mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-bouilly-gold focus:ring-bouilly-gold/20'
              }`}
              placeholder="Entrez le mot de passe"
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              loading || !password.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-bouilly-green hover:bg-bouilly-darkGreen focus:outline-none focus:ring-4 focus:ring-bouilly-gold/30'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Accès réservé aux administrateurs autorisés
          </p>
        </div>
      </motion.div>
    </div>
  );
}
