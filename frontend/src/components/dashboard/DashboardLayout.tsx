import { type ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { Home, Sparkles, Database, LogOut,FileUser, Briefcase,Bell, Command } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Simulated user fetch
  const user = JSON.parse(localStorage.getItem('hb_user') || '{"name": "Ashutosh"}');

  const navigation = [
    { name: 'Overview', path: '/dashboard', icon: Home },
    { name: 'Drafting Engine', path: '/dashboard/engine', icon: Sparkles },
    { name: 'Applications', path: '/dashboard/applications', icon: Briefcase },
    { name: 'Resume Context', path: '/dashboard/resume', icon: FileUser },
    { name: 'Community Vault', path: '/dashboard/vault', icon: Database },
  ];

  return (
    // Matches the bg-slate-50 base of the resume page for a seamless blend
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 flex flex-col h-full bg-white border-r border-slate-200/60 z-20 shadow-[4px_0_24px_rgb(0,0,0,0.01)]">
        <div className="p-8 pb-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="text-xl font-medium tracking-tight text-slate-900">HustleBuddy</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1.5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50/80 text-indigo-700 font-medium shadow-sm shadow-indigo-100/50 border border-indigo-100/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-light border border-transparent'
                }`}
              >
                <item.icon 
                  size={16} 
                  className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Premium User Card */}
        <div className="p-5 mt-auto">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3.5">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-100/50 rounded-full flex items-center justify-center text-indigo-600 text-[13px] font-medium shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[13px] font-medium text-slate-900 truncate tracking-tight">{user.name}</p>
                <p className="text-[11px] text-slate-400 font-light truncate tracking-wide">Free Plan</p>
              </div>
            </div>
            <button 
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="w-full py-2.5 bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-xl text-[11px] font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Floating Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Styled matching the "Sparkles" badge from the resume page */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/60 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase text-slate-500 shadow-sm shadow-slate-200/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              v1.0 Prototype
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-50" />
            </button>
            <div className="h-5 w-[1px] bg-slate-200 mx-1" />
            <kbd className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200/60 shadow-sm rounded-lg text-[10px] font-mono text-slate-400">
              <Command size={10} /> K
            </kbd>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}