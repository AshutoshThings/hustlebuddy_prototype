import { Search, Filter, ExternalLink, Users, DollarSign, Zap } from 'lucide-react';

const JobCard = ({ title, company, salary, applicants, match, tags }: any) => (
  <div className="group bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-md hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden">
    <div className="flex items-start justify-between mb-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-lg font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          {company.charAt(0)}
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">{company}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          <Zap size={10} fill="currentColor" /> {match}% Match
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-slate-50">
      <div className="flex items-center gap-2 text-slate-500">
        <DollarSign size={14} />
        <span className="text-xs font-semibold">{salary}</span>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <Users size={14} />
        <span className="text-xs font-semibold">{applicants} applicants</span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex gap-1.5">
        {tags.map((tag: string) => (
          <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded text-[10px] font-bold">
            {tag}
          </span>
        ))}
      </div>
      <button className="text-slate-400 group-hover:text-slate-900 transition-colors">
        <ExternalLink size={16} />
      </button>
    </div>
  </div>
);

export default function DashboardHome() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recommended for you</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Based on your MERN stack profile and college location.</p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Refresh Feed
          </button>
        </div>
      </header>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by title, company, or tech stack..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
          />
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-600 hover:border-slate-300 transition-all">
          <Filter size={14} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JobCard title="Backend Intern" company="CRED" salary="₹30k - ₹45k" applicants={142} match={98} tags={['Node.js', 'Redis']} />
        <JobCard title="Full Stack Developer" company="Groww" salary="₹12L - ₹18L" applicants={89} match={94} tags={['React', 'PostgreSQL']} />
        <JobCard title="Systems Engineer" company="Razorpay" salary="₹15L - ₹22L" applicants={230} match={88} tags={['Go', 'Kubernetes']} />
        <JobCard title="UI/UX Developer" company="Zomato" salary="₹8L - ₹12L" applicants={56} match={82} tags={['Figma', 'Tailwind']} />
      </div>
    </div>
  );
}