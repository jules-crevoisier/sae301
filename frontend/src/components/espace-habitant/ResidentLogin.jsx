"use client";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const ResidentLogin = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/resident?email=${encodeURIComponent(trimmed)}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Aucun dossier trouvé pour cet email.");
        return;
      }
      if (json.success && json.data) {
        onSuccess(json.data);
      } else {
        setError("Réponse invalide du serveur.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-bouilly-green/10 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-bouilly-green/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="text-bouilly-green" size={28} />
          </div>
          <h2 className="font-title font-bold text-xl text-bouilly-darkGreen mb-2">
            Accéder à mon espace citoyen
          </h2>
          <p className="text-sm text-gray-600">
            Saisissez l&apos;adresse email utilisée pour votre inscription
            cantine ou pour contacter la mairie.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="resident-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adresse email
            </label>
            <input
              id="resident-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bouilly-gold/50 focus:border-bouilly-green transition-all outline-none"
              disabled={loading}
              autoComplete="email"
              aria-describedby={error ? "resident-email-error" : undefined}
            />
          </div>

          {error && (
            <p
              id="resident-email-error"
              className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-bouilly-green text-white font-bold hover:bg-bouilly-darkGreen transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-pulse">Connexion...</span>
            ) : (
              <>
                Accéder à mon espace
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
