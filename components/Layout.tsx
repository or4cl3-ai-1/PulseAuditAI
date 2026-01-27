
import React from 'react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate('landing')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">{APP_NAME}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-semibold transition-colors ${currentView === 'dashboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('upload')}
              className={`text-sm font-semibold transition-colors ${currentView === 'upload' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              New Audit
            </button>
            <button 
              onClick={() => onNavigate('pricing')}
              className={`text-sm font-semibold transition-colors ${currentView === 'pricing' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              Pricing
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">{user.role}</p>
            </div>
            <button 
              onClick={onLogout}
              className="text-sm text-slate-500 hover:text-red-400 font-bold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-slate-300 font-bold">PulseAudit</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 PulseAudit. Enterprise AI Compliance Engine.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
