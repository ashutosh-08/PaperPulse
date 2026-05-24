import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Plus, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  LogOut,
  Zap,
  ArrowRight,
  LayoutList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ScanModal from '../components/scanner/ScanModal';
import api from '../lib/api';

/**
 * Animated SVG Gauge Component for Compliance Scoring.
 * Visualizes the 0-100% metric using a circular stroke animation.
 */
const ComplianceGauge = ({ score = 0 }) => {
  const [offset, setOffset] = useState(251);

  useEffect(() => {
    const progress = 251 - (score / 100) * 251;
    const timer = setTimeout(() => setOffset(progress), 500);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r="40" className="stroke-zinc-800 fill-none" strokeWidth="8" />
        <circle
          cx="64" cy="64" r="40"
          className="stroke-blue-500 fill-none transition-all duration-1000 ease-out"
          strokeWidth="8"
          strokeDasharray="251"
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{score}%</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
};

/**
 * Core Dashboard View for PaperPulse.
 * Fetches real certificate data and displays live metrics in a Bento Grid.
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expiring: 0 });
  const [complianceScore, setComplianceScore] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetches real certificate data from the backend and computes dashboard metrics.
   */
  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/certificates');
      const certs = response.data;
      setCertificates(certs);

      const today = new Date();
      let active = 0;
      let expiring = 0;

      certs.forEach(cert => {
        const expiry = new Date(cert.expiryDate);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        if (diffDays > 30) active++;
        else if (diffDays > 0) expiring++;
      });

      setStats({ total: certs.length, active, expiring });
      const score = certs.length > 0 ? Math.round((active / certs.length) * 100) : 0;
      setComplianceScore(score);
    } catch (err) {
      console.error('Dashboard data fetch error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleScanClose = () => {
    setIsScanModalOpen(false);
    fetchDashboardData();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 pb-20">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">PaperPulse</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Welcome, {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/certificates')}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors text-sm text-zinc-400 hover:text-white"
          >
            <LayoutList className="w-4 h-4" />
            My Certificates
          </button>
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors"
          >
            <LogOut className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {/* Compliance Gauge */}
        <motion.div variants={itemVariants} className="md:col-span-1 glass-card p-6 rounded-[2rem] flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider">Compliance Health</h3>
          <ComplianceGauge score={complianceScore} />
          <p className="mt-6 text-xs text-zinc-500 leading-relaxed px-4">
            {stats.expiring > 0 
              ? `${stats.expiring} certificate${stats.expiring > 1 ? 's' : ''} expiring soon.`
              : stats.total > 0 ? 'All certificates are in good standing.' : 'Upload your first certificate to begin.'}
          </p>
        </motion.div>

        {/* Super-Scan Trigger */}
        <motion.div variants={itemVariants} className="md:col-span-2 glass-card p-8 rounded-[2rem] relative overflow-hidden group cursor-pointer" onClick={() => setIsScanModalOpen(true)}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none group-hover:bg-blue-600/20 transition-all" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                <Zap className="w-8 h-8 text-blue-400 fill-blue-400/20" />
              </div>
              <h3 className="text-3xl font-bold mb-3 tracking-tight">Super-Scan</h3>
              <p className="text-zinc-400 max-w-sm mb-8">
                Upload a compliance document and let the AI extract, verify, and save it automatically.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex-1 h-[1px] bg-zinc-800" />
              <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                Upload Document <Plus className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Certificates Sidebar */}
        <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2 glass-card p-6 rounded-[2rem] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Recent Uploads</h3>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {certificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <FileText className="w-10 h-10 text-zinc-800 mb-3" />
                <p className="text-zinc-600 text-sm">No certificates yet.</p>
                <p className="text-zinc-700 text-xs mt-1">Use Super-Scan to add your first one.</p>
              </div>
            ) : (
              certificates.slice(0, 5).map(cert => {
                const expiry = new Date(cert.expiryDate);
                const diffDays = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                const statusColor = diffDays <= 0 ? 'text-red-500 bg-red-500/10' : diffDays <= 30 ? 'text-amber-500 bg-amber-500/10' : 'text-green-500 bg-green-500/10';
                const statusLabel = diffDays <= 0 ? 'Expired' : diffDays <= 30 ? 'Expiring' : 'Active';

                return (
                  <div key={cert._id} className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor}`}>
                        {statusLabel}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono">{cert.licenseNumber?.slice(-6)}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-200 truncate">{cert.legalName || cert.type}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Expires: {expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <button 
            onClick={() => navigate('/certificates')}
            className="mt-6 py-3 w-full rounded-2xl border border-zinc-800 text-xs font-semibold text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
          >
            View All Certificates <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Stats Summary Row */}
        <motion.div variants={itemVariants} className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Certificates', value: stats.total, icon: FileText, color: 'text-zinc-400' },
            { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'Expiring Soon', value: stats.expiring, icon: AlertTriangle, color: 'text-amber-500' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-[2rem] flex items-center justify-between overflow-hidden group cursor-pointer" onClick={() => navigate('/certificates')}>
              <div>
                <p className="text-sm text-zinc-500 font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <stat.icon className={`w-12 h-12 ${stat.color} opacity-20 group-hover:opacity-40 transition-all group-hover:scale-110`} />
            </div>
          ))}
        </motion.div>
      </motion.main>

      {isScanModalOpen && (
        <ScanModal onClose={handleScanClose} />
      )}
    </div>
  );
};

export default DashboardPage;
