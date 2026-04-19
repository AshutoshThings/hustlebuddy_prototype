import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardResume() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  
  const [aiAnalysis, setAiAnalysis] = useState({
    summary: "Upload your resume to see your AI analysis.",
    skills: [] as string[]
  });
  useEffect(() => {
    const savedContext = localStorage.getItem('hb_resume_context');
    if (savedContext) {
      const parsed = JSON.parse(savedContext);
      setAiAnalysis(parsed);
      setIsParsed(true);
      // We don't have the File object anymore after a refresh, but we have the data.
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await processResume(selectedFile);
    }
  };

  const processResume = async (selectedFile: File) => {
    setIsUploading(true);
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/parse-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hb_token')}`
          // Note: Do NOT set Content-Type header when sending FormData, the browser handles the boundaries automatically
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setAiAnalysis(data.analysis);
        setIsParsed(true);
        localStorage.setItem('hb_resume_context', JSON.stringify(data.analysis));
      } else {
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearResume = () => {
    setFile(null);
    setIsParsed(false);
    setAiAnalysis({ summary: "Upload your resume to see your AI analysis.", skills: [] });
    localStorage.removeItem('hb_resume_context');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">Resume & Context</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Upload your latest CV to train the Sarvam Engine on your experience.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`relative border-2 border-dashed rounded-3xl p-12 transition-all ${
            file || isParsed ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-indigo-400 bg-white'
          }`}>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileChange}
              accept=".pdf"
            />
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                file || isParsed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {file || isParsed ? <CheckCircle2 size={32} /> : <Upload size={32} />}
              </div>
              
              {file ? (
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{file.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : isParsed ? (
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Resume Active</h3>
                  <p className="text-xs text-slate-500 mt-1">Click to upload a newer version</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Click or drag to upload resume</h3>
                  <p className="text-xs text-slate-500 mt-1">Supports PDF (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isUploading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-indigo-600 p-4 rounded-2xl text-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest">Sarvam is reading your PDF...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isParsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Active Profile Context
                </h3>
                <button 
                  onClick={clearResume}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <FileText className="text-slate-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Context Loaded</p>
                    <p className="text-[10px] text-slate-500">Ready for Copilot Generation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: AI Analysis Display */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 transition-all">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-4">
              <Sparkles size={14} /> AI Analysis
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              {aiAnalysis.summary}
            </p>
            <div className="mt-6 space-y-2">
              {aiAnalysis.skills.map((skill, index) => (
                <div key={index} className="inline-block mr-2 mb-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Privacy</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your resume is stored securely and used only for grounding AI generation. We never share your data with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}