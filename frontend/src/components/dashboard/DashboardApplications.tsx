import { useState as _useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Applied': 'bg-blue-50 text-blue-600 border-blue-100',
    'Interviewing': 'bg-amber-50 text-amber-600 border-amber-100',
    'Offered': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Rejected': 'bg-slate-50 text-slate-500 border-slate-200',
  };

  const icons: Record<string, any> = {
    'Applied': Clock,
    'Interviewing': AlertCircle,
    'Offered': CheckCircle2,
    'Rejected': XCircle,
  };

  const Icon = icons[status] || Clock;

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${styles[status]}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const ApplicationRow = ({ company, role, date, status, platform }: any) => (
  <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
    <td className="py-4 pl-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white border border-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-400">
          {company.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{company}</p>
          <p className="text-[11px] text-slate-500 font-medium">{platform}</p>
        </div>
      </div>
    </td>
    <td className="py-4">
      <p className="text-sm font-medium text-slate-700">{role}</p>
    </td>
    <td className="py-4">
      <p className="text-sm text-slate-500 font-mono">{date}</p>
    </td>
    <td className="py-4">
      <StatusBadge status={status} />
    </td>
    <td className="py-4 pr-4 text-right">
      <div className="flex items-center justify-end gap-2">
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ExternalLink size={16} />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default function DashboardApplications() {
  const apps = [
    { company: 'CRED', role: 'Backend Intern', date: 'Apr 16, 2026', status: 'Applied', platform: 'Internshala' },
    { company: 'Zomato', role: 'Frontend Engineer', date: 'Apr 12, 2026', status: 'Interviewing', platform: 'LinkedIn' },
    { company: 'Razorpay', role: 'SDE-1', date: 'Mar 28, 2026', status: 'Rejected', platform: 'Direct' },
    { company: 'Groww', role: 'Fullstack Intern', date: 'Apr 05, 2026', status: 'Offered', platform: 'Unstop' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Tracking {apps.length} active opportunities.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: '12', color: 'text-slate-900' },
          { label: 'Active', value: '4', color: 'text-blue-600' },
          { label: 'Interviews', value: '1', color: 'text-amber-600' },
          { label: 'Success', value: '1', color: 'text-emerald-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search apps..." 
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
            <Filter size={14} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50">
                <th className="py-3 pl-4">Company</th>
                <th className="py-3">Role</th>
                <th className="py-3">Applied On</th>
                <th className="py-3">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app, i) => (
                <ApplicationRow key={i} {...app} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}