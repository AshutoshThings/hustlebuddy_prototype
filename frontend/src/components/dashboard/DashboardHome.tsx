import { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Users, Banknote, Zap, Loader2 } from 'lucide-react';

// Notice we updated the props to match your scraped data structure!
const JobCard = ({ title, company, stipend, location, link, tags }: any) => (
  <div className="group bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-md hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between">
    <div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-lg font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors uppercase">
            {company.charAt(0)}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{title}</h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-1">{company}</p>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <Zap size={10} fill="currentColor" /> 98% Match
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-slate-50">
        <div className="flex items-center gap-2 text-slate-500">
          <Banknote size={14} />
          <span className="text-xs font-semibold">{stipend}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Users size={14} />
          <span className="text-xs font-semibold">{location}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-auto">
      <div className="flex gap-1.5">
        {tags.map((tag: string) => (
          <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded text-[10px] font-bold">
            {tag}
          </span>
        ))}
      </div>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-indigo-600 transition-colors"
        onClick={(e) => e.stopPropagation()} // Prevents card click if you add one later
      >
        <ExternalLink size={16} />
      </a>
    </div>
  </div>
);

export default function DashboardHome() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveJobs = async () => {
      try {
        // Hitting your live Puppeteer scraper!
        const response = await fetch('http://localhost:3000/jobs/scrape/internshala?search=mern');
        const data = await response.json();
        
        if (data.success) {
          setJobs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveJobs();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recommended for you</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Live MERN stack opportunities fetched directly from Internshala.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="h-9 px-4 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
          >
            Refresh Feed
          </button>
        </div>
      </header>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <h3 className="text-sm font-bold text-slate-900">Deploying Scraper Bots...</h3>
          <p className="text-xs text-slate-500 mt-1">Navigating Internshala for fresh MERN roles (~10s)</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <JobCard 
                key={index}
                title={job.title} 
                company={job.company} 
                stipend={job.stipend}
                location={job.location}
                link={job.link}
                tags={['MERN', job.source]} // Injecting dynamic tags
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-slate-500 text-sm">
              No jobs found. Try adjusting your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}