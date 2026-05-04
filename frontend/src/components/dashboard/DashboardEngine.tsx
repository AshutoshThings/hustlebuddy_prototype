import { useState } from 'react';
import { Sparkles, History, ChevronRight, Zap } from 'lucide-react';

export default function DashboardEngine() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleGenerate = async () => {
    if (!jd) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/generate-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hb_token')}`
        },
        body: JSON.stringify({ 
          jobDescription: jd,
          userProfile: "Student specializing in..."
        }),
      });

      // Handle Session Expiry (401)
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      if (data.success) {
        setOutput(data.proposal);
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Backend is not responding. Check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Main Workbench */}
      <div className="flex-1 flex flex-col p-8 border-r border-slate-100">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Cover Letter Drafting Workbench</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold border border-indigo-100">
            <Zap size={12} fill="currentColor" /> 3 Credits Remaining
          </div>
        </div>

        <div className="flex-1 grid grid-rows-2 gap-6">
          <div className="flex flex-col">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Job Description / Requirements</label>
            <textarea 
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="flex-1 p-6 bg-slate-50 border border-slate-200 rounded-2xl resize-none text-sm leading-relaxed focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
              placeholder="Paste the job description here..."
            />
          </div>
          
          <div className="flex flex-col relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Personalized Cover Letter</label>
            <div className="flex-1 p-6 bg-white border border-slate-200 rounded-2xl text-sm leading-relaxed text-slate-700 overflow-y-auto font-medium whitespace-pre-wrap">
              {output || <span className="text-slate-300 italic">Click generate to start...</span>}
            </div>
            {output && (
              <button 
                onClick={() => navigator.clipboard.writeText(output)}
                className="absolute bottom-4 right-4 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-lg"
              >
                <Copy size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleGenerate}
            disabled={loading || !jd}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? 'Synthesizing...' : 'Generate Personalized Proposal'}
            
          </button>
        </div>
      </div>

      {/* Settings Sidebar */}
      <div className="w-80 p-6 bg-[#FCFCFD]">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">Engine Settings</h3>
        
        <div className="space-y-6">
          <section>
            <label className="text-[11px] font-bold text-slate-700 block mb-3">Language Model</label>
            <div className="p-3 bg-white border border-indigo-200 rounded-xl flex items-center justify-between group cursor-pointer shadow-sm">
              <span className="text-xs font-bold">Sarvam 105B</span>
              <ChevronRight size={14} className="text-indigo-500" />
            </div>
          </section>

          <section>
            <label className="text-[11px] font-bold text-slate-700 block mb-3">Personalization Depth</label>
            <input type="range" className="w-full accent-indigo-600" />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
              <span>Generic</span>
              <span>Highly Tailored</span>
            </div>
          </section>

          <div className="h-px bg-slate-200 my-6" />

          <section>
            <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-2 mb-4">
              <History size={14} /> Recent Drafts
            </h4>
            <div className="space-y-2">
              {['CRED_Backend.pdf', 'Groww_Fullstack.pdf', 'Zomato_UI.pdf'].map(file => (
                <div key={file} className="p-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 flex items-center justify-between hover:border-slate-300 cursor-pointer transition-colors">
                  {file}
                  <Sparkles size={10} className="text-indigo-400" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}