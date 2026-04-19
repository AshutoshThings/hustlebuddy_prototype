import { useState, useEffect } from 'react';
import { Search, Loader2, Globe, Briefcase, ExternalLink, Users, Zap, CheckCircle2, Circle, Banknote } from 'lucide-react';

// --- SLEEK UI COMPONENT FOR JOB CARDS ---
const JobCard = ({ job, isSelected, toggleSelection }: any) => (
  <div 
    onClick={toggleSelection}
    className={`group border rounded-2xl p-6 transition-all cursor-pointer relative flex flex-col justify-between h-full ${
      isSelected 
        ? 'bg-indigo-50/50 border-indigo-500 shadow-md transform -translate-y-1' 
        : 'bg-white border-slate-200/80 hover:shadow-xl hover:border-indigo-300'
    }`}
  >
    {/* Checkbox Icon Top Right */}
    <div className="absolute top-5 right-5 text-slate-300 group-hover:text-indigo-400 transition-colors">
      {isSelected ? <CheckCircle2 className="text-indigo-600" size={24} /> : <Circle size={24} />}
    </div>

    <div>
      <div className="flex items-start gap-4 mb-5 pr-10">
        {/* Company Avatar Logo */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold uppercase transition-all shrink-0 ${
          isSelected 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700'
        }`}>
          {job.company ? job.company.charAt(0) : 'C'}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{job.title}</h3>
          <p className="text-sm text-slate-500 font-medium line-clamp-1">{job.company}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-3 mb-5 py-4 border-y border-slate-100">
        <div className="flex items-center gap-2.5 text-slate-600">
          <Banknote size={16} className="text-emerald-600" />
          <span className="text-sm font-bold text-emerald-700">{job.stipend || 'Not Disclosed'}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-500">
          <Users size={16} className="text-slate-400" />
          <span className="text-sm font-medium line-clamp-1">{job.location || 'India'}</span>
        </div>
      </div>
    </div>

    {/* Footer Tags & Links */}
    <div className="flex items-center justify-between mt-auto pt-2">
      <div className="flex gap-2">
        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
          {job.source}
        </span>
      </div>
      <a 
        href={job.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        onClick={(e) => e.stopPropagation()} 
      >
        <ExternalLink size={18} />
      </a>
    </div>
  </div>
);

export default function DashboardHome() {
  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState('mern stack');
  const [selectedPlatform, setSelectedPlatform] = useState('naukri');
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const platforms = [
    { id: 'naukri', name: 'Naukri (Best for India)' },
    { id: 'internshala', name: 'Internshala (Best for Interns)' },
    { id: 'unstop', name: 'Unstop (upcoming)' },
    { id: 'remotive', name: 'Remotive (upcoming)' }
  ];

  // --- DYNAMIC DATA FETCHING ---
  const fetchJobs = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    setIsLoading(true);
    setJobs([]); 
    setSelectedJobs([]); 
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/jobs/scrape?search=${encodeURIComponent(searchQuery)}&source=${selectedPlatform}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('hb_token')}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      } else {
        alert("Failed to fetch jobs: " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleJobSelection = (job: any) => {
    setSelectedJobs(prev => {
      const isAlreadySelected = prev.find(j => j.link === job.link);
      if (isAlreadySelected) {
        return prev.filter(j => j.link !== job.link); 
      } else {
        return [...prev, job]; 
      }
    });
  };

  // --- SEQUENTIAL COPILOT APPLY LOGIC WITH MAILROOM ---
  const handleBulkApply = async () => {
    setIsProcessing(true);
    
    const userStore = JSON.parse(localStorage.getItem('hb_user') || '{}');
    const userId = userStore.id || userStore._id || "temp-user-id";

    const savedResumeContext = localStorage.getItem('hb_resume_context');
    let dynamicUserProfile = "Software engineering student with a focus on web development."; 
    
    if (savedResumeContext) {
      const parsed = JSON.parse(savedResumeContext);
      dynamicUserProfile = `${parsed.summary} My top technical skills include: ${parsed.skills.join(', ')}.`;
    }

    for (const [index, job] of selectedJobs.entries()) {
      try {
        // Step A: Call Sarvam AI
        const aiResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/generate-proposal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('hb_token')}`
          },
          body: JSON.stringify({
            userProfile: dynamicUserProfile, 
            jobDescription: `Title: ${job.title}, Company: ${job.company}`
          })
        });
        
        const aiData = await aiResponse.json();
        
        if (aiData.success) {
          const proposalText = aiData.proposal;

          // Step B: Save to Supabase (Record keeping)
          try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/applications/save`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('hb_token')}`
              },
              body: JSON.stringify({
                userId: userId,
                jobTitle: job.title,
                companyName: job.company,
                proposalText: proposalText
              })
            });
          } catch (dbError) {
            console.error("Failed to save to Supabase:", dbError);
          }

          // Step C: Copy to clipboard
          await navigator.clipboard.writeText(proposalText);
          
          // Step D: THE DEEP-SCAN AUTO-MAILER
          console.log(`[Copilot] Initiating Mailroom sequence for ${job.company}...`);
          let isMailSent = false;

          try {
            const mailRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/applications/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('hb_token')}`
              },
              body: JSON.stringify({
                hrEmail: job.email, // Passing the sniffed email (or null)
                jobLink: job.link,  // Passing the full link for the backend Deep Scan
                jobTitle: job.title,
                companyName: job.company,
                proposalText: proposalText 
              })
            });
            
            const mailData = await mailRes.json();
            
            if (mailData.success) {
              console.log(`[Copilot] ✅ Success: ${mailData.message}`);
              isMailSent = true;
            } else if (mailData.action === "fallback_to_tab") {
              console.log(`[Copilot] ⚠️ Deep Scan found no email. Opening tab instead.`);
              window.open(job.link, '_blank');
            }
          } catch (err) {
            console.error("Mail API crashed, falling back to tab open.", err);
            window.open(job.link, '_blank');
          }
          
          // Step E: Sequential Pause
          if (index < selectedJobs.length - 1) {
             const proceed = window.confirm(
               `✅ Processed ${job.company}.\n\n` +
               (isMailSent ? `Silent email successfully sent to HR!` : `Application page opened in new tab. Proposal is copied to clipboard.`) +
               `\n\nClick 'OK' for the next one.`
             );
             if (!proceed) break; 
          } else {
             await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (err) {
        console.error("Failed to process job:", job.title);
      }
    }
    
    setIsProcessing(false);
    setSelectedJobs([]);
    alert("🎉 HustleBuddy Pipeline Complete! All applications processed.");
  };

  // --- RENDER UI ---
  return (
    <div className="p-8 max-w-7xl mx-auto relative pb-32">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Radar</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Scrape live jobs across India and deploy your AI Copilot.</p>
        </div>
      </header>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-10">
        <form onSubmit={fetchJobs} className="flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., React Developer, Frontend Intern..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-slate-800"
              required
            />
          </div>

          <div className="relative min-w-[240px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none outline-none font-medium text-slate-700"
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 min-w-[160px] shadow-md shadow-indigo-200"
          >
            {isLoading ? (
              <><Loader2 className="animate-spin h-5 w-5" /> Scanning...</>
            ) : (
              <><Briefcase className="h-5 w-5" /> Find Jobs</>
            )}
          </button>
        </form>
      </div>

      {/* The Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && jobs.length === 0 ? (
           <div className="col-span-full py-24 text-center text-slate-500 flex flex-col items-center bg-white rounded-3xl border border-dashed border-slate-200">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
              <p className="font-bold text-lg text-slate-800">Deploying scraper to {selectedPlatform}...</p>
              <p className="text-sm mt-2 text-slate-500">Bypassing bot protection and fetching live data (approx. 5-10s)</p>
           </div>
        ) : jobs.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-300">
             <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
             <p className="text-lg font-bold text-slate-700">No jobs found on this platform.</p>
             <p className="text-sm mt-1">Try adjusting your search term or switching to a different source.</p>
          </div>
        ) : (
          jobs.map((job, idx) => (
            <JobCard 
              key={idx}
              job={job}
              isSelected={selectedJobs.some(j => j.link === job.link)}
              toggleSelection={() => toggleJobSelection(job)}
            />
          ))
        )}
      </div>
      {/* Floating Action Bar for Selected Jobs */}
      {selectedJobs.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 transition-all animate-in slide-in-from-bottom-10">
          <div className="text-sm font-medium">
            <span className="font-bold text-indigo-400 text-lg">{selectedJobs.length}</span> roles selected
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <button 
            onClick={handleBulkApply}
            disabled={isProcessing}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg"
          >
            {isProcessing ? (
              <><Loader2 size={18} className="animate-spin" /> Processing Pipeline...</>
            ) : (
              <><Zap size={18} fill="currentColor" className="text-yellow-400" /> Launch Sarvam AI</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}


