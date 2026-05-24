import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { UserPlus, Mail, Lock, User, Phone, Hash, ShieldCheck } from 'lucide-react';

/**
 * Modern Registration Page for PaperPulse.
 * Implements full-field onboarding with glassmorphism and subtle animations.
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gstin: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  /**
   * Dispatches registration data to the Node.js backend.
   * On success, immediately serializes User and JWT to localStorage.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Trim whitespace and validate passwords match
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...dataToSend } = formData;
      dataToSend.password = password; // Use trimmed password
      const response = await api.post('/auth/register', dataToSend);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-xl"
          >
            <ShieldCheck className="w-7 h-7 text-purple-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Access Node</h1>
          <p className="text-zinc-400 mt-2">Initialize your PaperPulse profile</p>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">GSTIN/ID</label>
                <div className="relative group">
                  <Hash className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400" />
                  <input
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="GSTIN/ID"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400" />
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  placeholder="Phone (WhatsApp enabled)"
                />
              </div>
            </div>

            <div className="space-y-1.5 pb-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  placeholder="8+ Characters"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pb-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-black/40 border rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none transition-all ${
                    formData.confirmPassword && formData.password.trim() !== formData.confirmPassword.trim()
                      ? 'border-red-500/50 focus:border-red-500/50'
                      : 'border-zinc-800 focus:border-purple-500/50'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              {formData.confirmPassword && formData.password.trim() !== formData.confirmPassword.trim() && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Request Access
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Operational session active? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 ml-1 font-medium transition-colors">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
