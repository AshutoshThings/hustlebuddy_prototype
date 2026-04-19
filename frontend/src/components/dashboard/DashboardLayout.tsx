import { ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Sparkles, Database, Settings, LogOut, Command, Search,FileUser, Briefcase,Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('hb_user') || '{"name": "Ashutosh"}');

  const navigation = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Drafting Engine', path: '/dashboard/engine', icon: Sparkles },
    { name: 'My Applications', path: '/dashboard/applications', icon: Briefcase },
    { name: 'Resume & Profile', path: '/dashboard/resume', icon: FileUser },
    { name: 'Community Vault', path: '/dashboard/vault', icon: Database },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-slate-900 antialiased">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200/60 flex flex-col h-full bg-white shadow-[1px_0_0_rgba(0,0,0,0.02)]">
        <div className="p-6 pb-2">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="text-lg font-bold tracking-tight">HustleBuddy</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 mt-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">Free Plan</p>
              </div>
            </div>
            <button 
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="w-full py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 py-1 px-2.5 bg-slate-100 rounded-md text-[11px] font-mono text-slate-500 border border-slate-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              prototype version 1.0
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono text-slate-400">
              <span className="text-xs">⌘</span>K
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