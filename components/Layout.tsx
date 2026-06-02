
import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { UserRole } from '../types';
import { Cloud, ClipboardList, ShieldAlert, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentView }) => {
  const isClient = user?.role === UserRole.CLIENT;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group py-2" 
            onClick={() => handleMobileNavigate('dashboard')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">{APP_NAME}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-semibold transition-colors ${currentView === 'dashboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              Dashboard
            </button>

            {!isClient && (
              <>
                <button 
                  onClick={() => onNavigate('upload')}
                  className={`text-sm font-semibold transition-colors ${currentView === 'upload' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                  New Audit
                </button>
                <button 
                  onClick={() => onNavigate('generator')}
                  className={`text-sm font-semibold transition-colors ${currentView === 'generator' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                  Document Generator
                </button>
                <button 
                  onClick={() => onNavigate('storage')}
                  className={`text-sm font-semibold flex items-center gap-1 transition-colors ${currentView === 'storage' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                  <Cloud className="w-3.5 h-3.5" />
                  Cloud Sync
                </button>
                <button 
                  onClick={() => onNavigate('templates')}
                  className={`text-sm font-semibold flex items-center gap-1 transition-colors ${currentView === 'templates' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  Templates
                </button>
                <button 
                  onClick={() => onNavigate('pricing')}
                  className={`text-sm font-semibold transition-colors ${currentView === 'pricing' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                >
                  Pricing
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <div className="flex items-center justify-end gap-1.5">
                <p className={`text-[9px] uppercase tracking-widest font-black ${
                  user?.role === UserRole.ADMIN ? 'text-rose-400' : 
                  user?.role === UserRole.AUDITOR ? 'text-teal-400' : 'text-amber-400'
                }`}>
                  {user?.role} VIEW
                </p>
                {isClient && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />}
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="text-sm text-slate-500 hover:text-red-400 font-bold transition-colors hidden sm:block py-2 px-1"
            >
              Logout
            </button>

            {/* Mobile Hamburguer Button: Min 44x44 active area */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Box */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 transition-all">
            <div className="pb-3 border-b border-slate-850 px-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white mb-0.5">{user?.name}</p>
                <span className={`text-[9.5px] uppercase tracking-wider font-black ${
                  user?.role === UserRole.ADMIN ? 'text-rose-400' : 
                  user?.role === UserRole.AUDITOR ? 'text-teal-400' : 'text-amber-400'
                }`}>
                  {user?.role} View Mode
                </span>
              </div>
              {isClient && <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
            </div>

            <button 
              onClick={() => handleMobileNavigate('dashboard')}
              className={`w-full text-left py-3 px-3 rounded-xl text-base font-bold transition-all block min-h-[44px] ${
                currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Dashboard
            </button>

            {!isClient && (
              <>
                <button 
                  onClick={() => handleMobileNavigate('upload')}
                  className={`w-full text-left py-3 px-3 rounded-xl text-base font-bold transition-all block min-h-[44px] ${
                    currentView === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  New Audit
                </button>
                <button 
                  onClick={() => handleMobileNavigate('generator')}
                  className={`w-full text-left py-3 px-3 rounded-xl text-base font-bold transition-all block min-h-[44px] ${
                    currentView === 'generator' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Document Generator
                </button>
                <button 
                  onClick={() => handleMobileNavigate('storage')}
                  className={`w-full text-left py-3 px-3 rounded-xl text-base font-bold transition-all flex items-center gap-2.5 min-h-[44px] ${
                    currentView === 'storage' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Cloud className="w-5 h-5 shrink-0" />
                  Cloud Sync
                </button>
                <button 
                  onClick={() => handleMobileNavigate('templates')}
                  className={`w-full text-left py-3 px-3 rounded-xl text-base font-bold transition-all flex items-center gap-2.5 min-h-[44px] ${
                    currentView === 'templates' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ClipboardList className="w-5 h-5 shrink-0" />
                  Templates
                </button>
                <button 
                  onClick={() => handleMobileNavigate('pricing')}
                  className={`w-full text-left py-3 px-3 rounded-xl text-base font-bold transition-all block min-h-[44px] ${
                    currentView === 'pricing' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Pricing
                </button>
              </>
            )}

            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full text-left py-3 px-3 rounded-xl text-base font-bold text-red-400 hover:bg-red-500/10 transition-all block min-h-[44px]"
            >
              Logout Account
            </button>
          </div>
        )}
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
          <p className="text-slate-500 text-sm">© 2026 PulseAudit. Enterprise AI Compliance Engine.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors font-semibold">Security Vault</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
