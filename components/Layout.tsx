
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('landing')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">{APP_NAME}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('upload')}
              className={`text-sm font-medium ${currentView === 'upload' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              New Audit
            </button>
            <button 
              onClick={() => onNavigate('pricing')}
              className={`text-sm font-medium ${currentView === 'pricing' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Pricing
            </button>
            {user?.tier === 'ADMIN' && (
              <button 
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium ${currentView === 'admin' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{user.tier}</p>
            </div>
            <button 
              onClick={onLogout}
              className="text-sm text-slate-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 PulseAudit Compliance Engine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
