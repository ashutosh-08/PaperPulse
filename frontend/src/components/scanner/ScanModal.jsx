import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Scan, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Hash,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';
import api from '../../lib/api';

/**
 * Super-Scan Modal Component for PaperPulse.
 * Implements a high-fidelity 'WOW' factor with AI scanning animations
 * and a Bento-style review form.
 * 
 * @param {onClose} Function to trigger modal dismissal.
 */
const ScanModal = ({ onClose }) => {
  const [step, setStep] = useState('upload'); // upload, scanning, review, success
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * File drop handler.
   */
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStep('scanning');
      startAiProcessing(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    multiple: false
  });

  /**
   * Dispatches the raw file to the 'Super-Test' backend endpoint.
   * Leverages the multi-stage AI extraction and validation logic.
   */
  const startAiProcessing = async (targetFile) => {
    const formData = new FormData();
    formData.append('certificate', targetFile);

    try {
      const response = await api.post('/admin/verify-full-flow', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setOcrData(response.data.data.ocrExtraction);
      setStep('review');
    } catch (err) {
      setError(err.response?.data?.message || 'AI extraction stream disrupted');
      setStep('upload');
    }
  };

  /**
   * Commits the reviewed data to the permanent certificate collection.
   */
  const handleSave = async () => {
    try {
      const payload = {
        type: ocrData.certificateType || 'General',
        licenseNumber: ocrData.licenseNumber,
        expiryDate: ocrData.expiryDate,
        issueDate: ocrData.issueDate || new Date().toISOString().split('T')[0], // Fallback to today
        legalName: ocrData.legalName,
        status: 'Active'
      };
      
      await api.post('/certificates', payload);
      setStep('success');
      setTimeout(onClose, 2000);
    } catch (err) {
      setError('Failed to persist certificate record');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`relative w-full max-w-4xl glass rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 ${
          step === 'scanning' ? 'animate-pulse-glow' : ''
        }`}
      >
        {/* Modal Decorative Header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
        >
          <X className="w-5 h-5 text-zinc-500" />
        </button>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Upload Dropzone */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="mb-8">
                  <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-4">
                    <ShieldCheck className="w-10 h-10 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white">Initialize Token Stream</h2>
                  <p className="text-zinc-500 mt-2">Scale AI extraction per compliance protocols</p>
                </div>

                <div 
                  {...getRootProps()} 
                  className={`relative group border-2 border-dashed rounded-[2rem] p-16 transition-all cursor-pointer ${
                    isDragActive ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800 hover:border-zinc-700 bg-black/20'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-zinc-400" />
                    </div>
                    <p className="text-lg font-medium text-zinc-300">
                      {isDragActive ? 'Drop Payload' : 'Drop compliance image/PDF here'}
                    </p>
                    <p className="text-sm text-zinc-600 mt-1">Binary throughput max 10MB</p>
                  </div>
                </div>
                
                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
              </motion.div>
            )}

            {/* Step 2: High-Impact Scanning Animation */}
            {step === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-64 h-80 rounded-2xl border border-white/10 overflow-hidden mb-10 shadow-2xl">
                  {preview && <img src={preview} className="w-full h-full object-cover blur-sm opacity-50 transition-all duration-1000" alt="Scanning..." />}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_20px_#60a5fa] z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scan className="w-12 h-12 text-blue-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Analyzing Document Insights</h2>
                <p className="text-zinc-500 text-sm max-w-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  Calibrating Gemini Engine...
                </p>
              </motion.div>
            )}

            {/* Step 3: Bento Review Form */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Review Mapping</h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-1">AI Assurance Tier: High</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Field Bento Cards */}
                  {[
                    { label: 'Legal Entity', val: ocrData.legalName, icon: User, key: 'legalName' },
                    { label: 'License Code', val: ocrData.licenseNumber, icon: Hash, key: 'licenseNumber' },
                    { label: 'Asset Type', val: ocrData.certificateType, icon: FileSearch, key: 'certificateType' },
                    { label: 'Termination', val: ocrData.expiryDate, icon: Calendar, key: 'expiryDate' },
                  ].map((field, i) => (
                    <div 
                      key={field.key} 
                      className={`glass-card p-4 rounded-2xl border border-zinc-800 transition-all ${
                        !field.val ? 'bg-amber-500/10 border-amber-500/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3 text-zinc-500">
                        <field.icon className={`w-4 h-4 ${!field.val ? 'text-amber-400' : 'text-blue-500'}`} />
                        <span className="text-[10px] uppercase font-bold tracking-widest leading-none">{field.label}</span>
                      </div>
                      <input 
                        value={field.val || ''}
                        onChange={(e) => setOcrData({ ...ocrData, [field.key]: e.target.value })}
                        className="bg-transparent border-none outline-none text-white font-medium text-sm w-full placeholder:text-amber-500/50"
                        placeholder={!field.val ? 'Correction Required' : ''}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <ExternalLink className="w-4 h-4" />
                    Verified against Sandbox.co.in protocols
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('upload')}
                      className="px-6 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 font-semibold hover:text-white hover:bg-zinc-900 transition-all"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      Commit Asset <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success State */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Payload Serialized</h2>
                <p className="text-zinc-500">Certificate successfully mapped to active ledger.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanModal;
