import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export const FormInput = ({ label, error, icon: Icon, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-bold text-bouilly-darkGreen mb-2 ml-1">
      {label} {props.required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-bouilly-gold transition-colors">
          <Icon size={20} />
        </div>
      )}
      <input
        className={`w-full ${Icon ? 'pl-12' : 'pl-5'} pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-300
        ${error 
          ? 'border-red-200 bg-red-50 focus:border-red-400 text-red-900' 
          : 'border-transparent focus:border-bouilly-gold focus:bg-white focus:shadow-lg text-gray-700'
        } placeholder-gray-400 font-medium`}
        {...props}
      />
      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
        >
          <AlertCircle size={20} />
        </motion.div>
      )}
    </div>
    {error && <p className="mt-1 ml-2 text-xs font-semibold text-red-500">{error}</p>}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-[30px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 p-6 md:p-10 ${className}`}
  >
    {children}
  </motion.div>
);

export const ActionButton = ({ variant = "primary", loading, icon: Icon, children, ...props }) => {
  const baseStyle = "flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95";
  const styles = {
    primary: "bg-bouilly-darkGreen text-white shadow-lg shadow-bouilly-green/30 hover:shadow-bouilly-green/50 hover:bg-bouilly-green",
    secondary: "bg-white text-bouilly-darkGreen border-2 border-gray-200 hover:border-bouilly-darkGreen",
    ghost: "text-gray-400 hover:text-bouilly-darkGreen hover:bg-gray-50"
  };

  return (
    <button className={`${baseStyle} ${styles[variant]}`} disabled={loading} {...props}>
      {loading ? <span className="animate-spin">⌛</span> : Icon && <Icon size={20} />}
      {children}
    </button>
  );
};