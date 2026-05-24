import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  MoreVertical, 
  Trash2, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

/**
 * Compliance Ledger View for PaperPulse.
 * Implements a high-end glassmorphism table with status-specific badge logic.
 */
const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Fetches the complete certificate collection from the Node.js backend.
     */
    const fetchCertificates = async () => {
      try {
        const response = await api.get('/certificates');
        // The backend returns an array directly, not response.data.data
        setCertificates(response.data);
      } catch (err) {
        console.error('Failed to stream certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const openDetails = (cert) => {
    setSelectedCertificate(cert);
    setIsDetailsModalOpen(true);
  };

  const filteredCerts = certificates.filter(cert => 
    cert.legalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { label: 'Expired', color: 'bg-red-500/10 text-red-500', icon: AlertCircle };
    if (diffDays <= 30) return { label: 'Expiring', color: 'bg-amber-500/10 text-amber-500', icon: Clock };
    return { label: 'Active', color: 'bg-green-500/10 text-green-500', icon: CheckCircle };
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-bold">Back to Node</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Compliance Ledger</h1>
            <p className="text-zinc-500">Managing {certificates.length} registered assets across the network</p>
          </div>

          <div className="relative group min-w-[320px]">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Filter by Entity or License..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Responsive Table Context */}
        <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Asset Details</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Registry Code</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Termination</th>
                  <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right whitespace-nowrap">Interface</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-10 text-center text-zinc-700 font-mono tracking-widest">Hydrating Frame...</td>
                    </tr>
                  ))
                ) : filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                      <p className="text-zinc-500 font-medium">No records found in the current stream context.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((cert) => {
                    const status = getStatusBadge(cert.expiryDate);
                    return (
                      <motion.tr 
                        key={cert._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => openDetails(cert)}
                        className="hover:bg-white/[0.01] transition-colors group cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-all">
                              <FileText className="w-5 h-5 text-zinc-500" />
                            </div>
                            <div>
                              <p className="font-bold text-zinc-200 group-hover:text-white transition-colors leading-none">{cert.legalName || cert.type}</p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1.5 font-semibold">{cert.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-mono text-xs text-zinc-400">{cert.licenseNumber}</td>
                        <td className="px-8 py-6">
                          <div className={`mx-auto w-fit flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${status.color}`}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-zinc-400">
                          {new Date(cert.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-blue-400 transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-red-400 transition-all" onClick={(e) => { e.stopPropagation(); /* Delete Logic */ }}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-zinc-600 uppercase tracking-[0.3em]">
          End of Local Audit History • Encrypted Response Stream
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsDetailsModalOpen(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-xl glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            <button 
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-4">
                <FileText className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Asset Metadata</h2>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Registry Extraction Stream</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Legal Entity</p>
                <p className="text-white font-medium">{selectedCertificate.legalName || 'Unspecified'}</p>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Identity Code</p>
                <p className="text-white font-mono">{selectedCertificate.licenseNumber}</p>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Certificate Type</p>
                <p className="text-white font-medium">{selectedCertificate.type}</p>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Termination Date</p>
                <p className="text-white font-medium">
                  {new Date(selectedCertificate.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsDetailsModalOpen(false)}
              className="mt-8 w-full py-3 bg-zinc-100 text-black font-bold rounded-2xl hover:bg-white transition-all active:scale-[0.98]"
            >
              Close Ledger View
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Add X icon for modal
const X = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default CertificatesPage;
