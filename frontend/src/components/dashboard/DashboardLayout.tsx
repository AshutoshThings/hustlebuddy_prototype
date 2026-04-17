import { motion } from 'framer-motion';
import { LayoutDashboard, Zap, FolderSearch, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Smart Feed', path: '/dashboard' },
    { icon: <Zap size={18} />, label: 'Sarvam Engine', path: '/dashboard/engine' },
    { icon: <FolderSearch size={18} />, label: 'Proposal Vault', path: '/dashboard/vault' },
  ];

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* Sidebar - Sarvam Style (Light Gray) */}
      <aside className="w-64 border-r border-slate-100 flex flex-col p-6 bg-[#F9FAFB]">
        <div className="text-xl font-bold tracking-tighter mb-12 flex items-center gap-2 text-indigo-600">
          hustlebuddy<span className="text-slate-900">.</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  isActive 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <Settings size={18} /> Settings
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500/70 hover:text-red-600 transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Systems Nominal</span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900 uppercase">Ashutosh V.</p>
                <p className="text-[10px] text-indigo-500 font-mono font-bold uppercase tracking-tight">Pro Member</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-indigo-600">
                AV
             </div>
          </div>
        </header>

        {/* Content Container */}
        <section className="flex-1 overflow-y-auto bg-[#FCFCFD] p-8">
          {children}
        </section>
      </main>
    </div>
  );
}