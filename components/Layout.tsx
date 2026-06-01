
import React, { useState } from 'react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'upload', label: 'New Audit' },
    { id: 'ai-bom', label: 'AI BOM' },
    { id: 'dev-nexus', label: 'Dev Tools' },
    { id: 'sovereign', label: 'Sovereign' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate('landing')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">{APP_NAME}</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-semibold transition-colors ${currentView === item.id ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-2xl z-40">
            <nav className="px-4 py-6 space-y-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                    currentView === item.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-800 mt-4">
                <div className="px-4 py-2">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-indigo-400 uppercase tracking-widest font-black">{user.role}</p>
                </div>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="w-full text-left px-4 py-3 rounded-xl font-semibold text-red-400 hover:bg-slate-800 transition-all"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-5 h-16">
          {[
            { id: 'dashboard', icon: '◫', label: 'Home' },
            { id: 'upload', icon: '+', label: 'Audit' },
            { id: 'ai-bom', icon: '⊞', label: 'BOM' },
            { id: 'sovereign', icon: '⊗', label: 'Sovereign' },
            { id: 'pricing', icon: '⋯', label: 'More' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
                currentView === tab.id ? 'text-indigo-400' : 'text-slate-500'
              }`}
            >
              <span className={`text-lg font-black leading-none ${
                tab.id === 'upload' ? 'w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl' : ''
              }`}>{tab.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

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
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
