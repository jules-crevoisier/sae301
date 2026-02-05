"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Tag } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Renseignement',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi ici
    alert("Message envoyé (Simulation)");
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-title font-bold text-3xl md:text-4xl text-bouilly-darkGreen mb-4">
            Envoyer un message
          </h2>
          <div className="w-20 h-1 bg-bouilly-gold mx-auto rounded-full opacity-50"></div>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-bouilly-cream/30 p-8 md:p-12 rounded-[3rem] border border-bouilly-green/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Nom */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-bouilly-darkGreen ml-2">Nom & Prénom</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-bouilly-green focus:ring-2 focus:ring-bouilly-green/20 outline-none transition-all"
                  placeholder="Votre nom complet"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-bouilly-darkGreen ml-2">Adresse Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-bouilly-green focus:ring-2 focus:ring-bouilly-green/20 outline-none transition-all"
                  placeholder="exemple@email.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sujet */}
          <div className="space-y-2 mb-8">
            <label className="text-sm font-bold text-bouilly-darkGreen ml-2">Sujet de la demande</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag size={20} />
              </div>
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-bouilly-green focus:ring-2 focus:ring-bouilly-green/20 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Renseignement">Demande de renseignement</option>
                <option value="EtatCivil">État Civil</option>
                <option value="Urbanisme">Urbanisme / Travaux</option>
                <option value="Signalement">Signalement</option>
                <option value="Autre">Autre demande</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2 mb-10">
            <label className="text-sm font-bold text-bouilly-darkGreen ml-2">Votre Message</label>
            <div className="relative">
              <div className="absolute left-4 top-6 text-gray-400">
                <MessageSquare size={20} />
              </div>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-bouilly-green focus:ring-2 focus:ring-bouilly-green/20 outline-none transition-all resize-none"
                placeholder="Comment pouvons-nous vous aider ?"
                required
              ></textarea>
            </div>
          </div>

          {/* Bouton Submit */}
          <div className="text-center">
            <button 
              type="submit"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-bouilly-green text-white font-bold rounded-full shadow-lg shadow-bouilly-green/30 hover:bg-bouilly-darkGreen hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Envoyer mon message
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </motion.form>
      </div>
    </section>
  );
}