import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';

/**
 * Centered Authentication Page for PaperPulse.
 * High-end glassmorphism design with animated background and feedback loops.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles user login and Bearer token persistence.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-30 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-xl shadow-blue-500/10"
          >
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">PaperPulse</h1>
          <p className="text-zinc-400">Secure AI Compliance Stream</p>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Initialize Session
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Operational context missing? <Link to="/register" className="text-blue-400 hover:text-blue-300 ml-1 font-medium transition-colors">Join PaperPulse</Link>
          </p>
        </div>
        
        <div className="mt-12 text-center text-zinc-600 text-xs tracking-widest uppercase opacity-40">
          PaperPulse v1.0 • Node/React Stream
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
