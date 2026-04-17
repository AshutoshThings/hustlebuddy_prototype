import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Clock, MapPin } from 'lucide-react';

const MOCK_JOBS = [
  { id: 1, title: 'Frontend Developer', company: 'Razorpay', location: 'Remote', platform: 'LinkedIn', date: '2h ago', tags: ['React', 'Next.js'] },
  { id: 2, title: 'Product Intern', company: 'Zomato', location: 'Gurgaon', platform: 'Unstop', date: '5h ago', tags: ['Product', 'Figma'] },
  { id: 3, title: 'SDE-1', company: 'CRED', location: 'Bangalore', platform: 'Internshala', date: '1d ago', tags: ['Node.js', 'Redis'] },
];

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Smart Feed</h1>
          <p className="text-sm text-slate-500">Discovery engine synced with Sarvam-105B context.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter</span>
            <select className="text-xs font-medium bg-transparent outline-none cursor-pointer">
              <option>All Opportunities</option>
              <option>Full-time</option>
              <option>Internships</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {MOCK_JOBS.map((job, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={job.id}
            className="group bg-white border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-widest">
                  {job.platform}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className="text-slate-600">{job.company}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                <span className="flex items-center gap-1"><Clock size={12}/> {job.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 justify-between md:justify-end">
              <div className="hidden sm:flex gap-2">
                {job.tags.map(tag => (
                   <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase border border-slate-100 px-2 py-1 rounded-md bg-slate-50/50">
                    {tag}
                   </span>
                ))}
              </div>
              <button className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                <Sparkles size={14} />
                Generate Draft
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}