import { useState, useEffect, useRef } from 'react';
import { FileText, Trash2, Sparkles, Loader2, Zap, Briefcase, Code2, RefreshCcw, CheckCircle2, AlertCircle, Play, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardResume() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'confirming' | 'processing' | 'success'>('idle');
  const [processingStatus, setProcessingStatus] = useState<'uploading' | 'analyzing'>('uploading');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = JSON.parse(localStorage.getItem('hb_user') || '{"name": "Ashutosh", "id": 4}');

  const [aiAnalysis, setAiAnalysis] = useState({
    profile: {
      name: "",
      target_role: "",
      summary: "",
      core_skills: [] as string[],       
      additional_skills: [] as string[],
      vibe: ""
    },
    improvements: [] as string[]
  });

  // ==========================================
  // INITIAL FETCH: Check DB for existing profile
  // ==========================================
  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/get-profile/${user.id}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.profile) {
            setAiAnalysis({
              profile: {
                name: result.profile.name || "",
                target_role: result.profile.target_role || "",
                summary: result.profile.summary || "",
                core_skills: result.profile.core_skills || [],
                additional_skills: result.profile.additional_skills || [],
                vibe: result.profile.vibe || "",
              },
              improvements: result.profile.improvements || []
            });
            setUploadPhase('success');
            // Optional: Keep local storage in sync as a backup
            localStorage.setItem('hb_resume_context', JSON.stringify(result.profile));
          }
        }
      } catch (err) {
        console.log("No existing profile found or server error. Defaulting to upload screen.");
      } finally {
        setIsLoading(false); // Done checking, reveal the UI
      }
    };

    fetchExistingProfile();
  }, [user.id]);

  // --- Drag & Drop & Validation Handlers ---
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf') {
      setError("Invalid format. Please upload a PDF file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    setFile(selectedFile);
    setUploadPhase('confirming');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const cancelUpload = () => {
    setFile(null);
    setUploadPhase('idle');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ==========================================
  // PROCESS RESUME: Parse -> Save -> Render
  // ==========================================
  const processResume = async () => {
    if (!file) return;
    setError(null);
    setUploadPhase('processing');
    setProcessingStatus('uploading'); 
    
    const formData = new FormData();
    formData.append('resume', file);

    setTimeout(async () => {
      setProcessingStatus('analyzing'); 
      try {
        // 1. Call AI to parse
        const aiResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/parse-resume`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('hb_token')}` },
          body: formData
        });

        const parseData = await aiResponse.json();

        if (parseData.success && parseData.data) {
          
          // 2. WAIT FOR DATABASE SAVE
          const saveResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/save-profile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('hb_token')}`
            },
            body: JSON.stringify({ 
              profileData: parseData.data,
              userId: user.id 
            })
          });

          const dbResult = await saveResponse.json();

          if (dbResult.success) {
            // 3. ONLY UPDATE UI IF SAVE WAS SUCCESSFUL
            setAiAnalysis(parseData.data);
            setUploadPhase('success');
            localStorage.setItem('hb_resume_context', JSON.stringify(parseData.data));
            console.log("Data parsed and securely saved to Vault.");
          } else {
            throw new Error(dbResult.error || "Failed to persist data to database.");
          }

        } else {
          setError(parseData.message || "Failed to parse resume.");
          setUploadPhase('confirming'); 
        }
      } catch (err: any) {
        console.error("Pipeline error:", err);
        setError(err.message || "Network error. Please check your connection and try again.");
        setUploadPhase('confirming');
      }
    }, 800); 
  };

  const clearResume = () => {
    // Note: This currently only clears the local UI. 
    // You'd need a DELETE route on your backend to clear the DB row entirely.
    setFile(null);
    setUploadPhase('idle');
    setError(null);
    setAiAnalysis({
      profile: { name: "", target_role: "", summary: "", core_skills: [], additional_skills: [], vibe: "" },
      improvements: []
    });
    localStorage.removeItem('hb_resume_context');
  };

  // ==========================================
  // INITIAL LOADING SCREEN
  // ==========================================
  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
        <p className="text-sm font-medium text-slate-500 tracking-tight">Syncing with Vault...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto bg-slate-50 text-slate-900 min-h-screen font-sans overflow-x-hidden">
      
      <header className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight text-slate-900">Resume Context</h1>
        <p className="text-sm text-slate-500 mt-2 font-light leading-relaxed max-w-xl">
          Upload your latest CV to curate your profile based on your experience and let the AI generate tailored proposals.
        </p>
      </header>

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileChange}
        accept=".pdf"
      />

      <AnimatePresence>
        {error && uploadPhase === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 shadow-sm"
          >
            <AlertCircle size={16} />
            <p className="text-xs font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* ================= STATE 1: IDLE ================= */}
        {uploadPhase === 'idle' && (
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto mt-4"
          >
            <div 
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative overflow-hidden border border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer text-center group shadow-[0_4px_20px_rgb(0,0,0,0.03)]
                ${isDragging 
                  ? 'border-indigo-400 bg-indigo-50/50 shadow-[0_8px_30px_rgb(99,102,241,0.1)] scale-[1.02]' 
                  : 'border-slate-300 hover:border-indigo-400 bg-white hover:shadow-[0_8px_30px_rgb(99,102,241,0.06)]'
                }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500" />
              
              <div className="relative z-10 pointer-events-none">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300
                  ${isDragging ? 'bg-indigo-100 border-indigo-200' : 'bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100'}
                `}>
                  <UploadCloud size={28} className={`transition-colors duration-300 ${isDragging ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2 tracking-tight">
                  {isDragging ? 'Drop it like it\'s hot' : 'Upload your Resume'}
                </h3>
                <p className="text-slate-500 text-[13px] font-light max-w-xs mx-auto leading-relaxed">
                  Drag and drop your PDF here, or click to browse. HustleBuddy will extract your skills and analyze your vibe.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-indigo-600 transition-all shadow-md pointer-events-auto">
                  <FileText size={16} /> Browse Files
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STATE 2: CONFIRMATION ================= */}
        {uploadPhase === 'confirming' && file && (
          <motion.div 
            key="confirm-state"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto mt-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.05)] text-center"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FileText size={28} />
            </div>
            <h2 className="text-2xl font-medium text-slate-900 mb-2 tracking-tight">Ready to Analyze?</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block min-w-[260px] mb-6">
              <p className="text-slate-800 text-sm font-medium truncate max-w-[240px]">{file.name}</p>
              <p className="text-slate-500 text-[11px] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                onClick={cancelUpload}
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-[13px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={processResume}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[13px] font-medium transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Play size={14} fill="currentColor" /> Start Analysis
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STATE 3: PROCESSING ================= */}
        {uploadPhase === 'processing' && (
          <motion.div 
            key="loading-state"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="max-w-xl mx-auto mt-20 text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-full h-full bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Loader2 size={28} className="text-indigo-600 animate-spin" />
              </div>
            </div>
            
            <h2 className="text-2xl font-medium text-slate-900 mb-3 tracking-tight">
              {processingStatus === 'uploading' ? 'Uploading document...' : 'Analyzing your Hustle...'}
            </h2>
            
            <p className="text-slate-500 font-light text-sm transition-all max-w-sm mx-auto">
              {processingStatus === 'uploading' 
                ? 'Securely transferring your resume.' 
                : 'Sarvam Arya is reading your PDF and saving to the Vault.'}
            </p>

            <div className="w-56 h-1.5 bg-slate-100 rounded-full mx-auto mt-6 overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }} 
                animate={{ width: processingStatus === 'uploading' ? "40%" : "95%" }}
                transition={{ duration: processingStatus === 'uploading' ? 0.8 : 8, ease: "easeOut" }}
                className="h-full bg-indigo-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* ================= STATE 4: DASHBOARD / SUCCESS ================= */}
        {uploadPhase === 'success' && (
          <motion.div 
            key="parsed-state"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-4 space-y-5">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 tracking-tight">Context Loaded</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-light truncate max-w-[150px]">{file ? file.name : "Saved Resume Active"}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2.5">
                    <button 
                      onClick={triggerFileInput}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <RefreshCcw size={14} /> Update File
                    </button>
                    <button 
                      onClick={clearResume}
                      className="p-2.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Clear Context"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {file && (
                    <button 
                      onClick={() => setUploadPhase('confirming')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Sparkles size={14} /> Re-analyze Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                  <Code2 size={12} className="text-indigo-500" /> Core Stack
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {aiAnalysis.profile.core_skills?.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-full text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {aiAnalysis.profile.additional_skills && aiAnalysis.profile.additional_skills.length > 0 && (
                  <>
                    <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4 border-t border-slate-100 pt-6">
                      Tools & Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.profile.additional_skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-full text-[10px] font-light"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* MAIN AREA */}
            <div className="lg:col-span-8 space-y-5">
              
              <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/60 via-transparent to-transparent blur-2xl pointer-events-none" />
                
                <div className="p-8 md:p-10 relative z-10">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-8">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase text-slate-500">
                      <Sparkles size={10} className="text-indigo-500" />
                      HustleBuddy Profile
                    </div>
                    {aiAnalysis.profile.vibe && (
                      <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase text-indigo-600">
                        {aiAnalysis.profile.vibe}
                      </span>
                    )}
                  </div>
                  
                  {aiAnalysis.profile.name && (
                    <h2 className="text-3xl md:text-4xl font-medium text-slate-900 tracking-tight mb-3 leading-tight">
                      {aiAnalysis.profile.name}
                    </h2>
                  )}
                  {aiAnalysis.profile.target_role && (
                     <div className="mb-6">
                      <span className="text-indigo-600 text-[14px] md:text-base font-light tracking-wide">
                        {aiAnalysis.profile.target_role}
                      </span>
                    </div>
                  )}
                  
                  <div className="relative mt-8">
                    <div className="absolute -left-3 -top-5 text-5xl text-slate-100 font-serif leading-none">"</div>
                    <p className="text-[14px] md:text-[15px] font-light leading-relaxed text-slate-600 relative z-10 max-w-2xl">
                      {aiAnalysis.profile.summary}
                    </p>
                  </div>
                </div>
              </div>

              {aiAnalysis.improvements && aiAnalysis.improvements.length > 0 && (
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                   <h3 className="text-xl font-medium text-slate-900 mb-8 flex items-center gap-2.5 tracking-tight">
                    <div className="p-2 bg-orange-50 border border-orange-100 rounded-lg">
                      <Briefcase size={16} className="text-orange-500" />
                    </div>
                    Resume Gaps & AI Coaching
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiAnalysis.improvements.map((tip, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-orange-200/60 hover:shadow-sm transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                          <Zap size={14} className="text-orange-500" />
                        </div>
                        <p className="text-[13px] text-slate-600 font-light leading-relaxed pt-0.5">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}