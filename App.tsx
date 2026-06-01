
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AuditUpload from './components/AuditUpload';
import AuditReport from './components/AuditReport';
import Pricing from './components/Pricing';
import LandingPage from './components/LandingPage';
import SovereignSettings from './components/SovereignSettings';
import AIBom from './components/AIBom';
import DevNexus from './components/DevNexus';
import { User, UserTier, UserRole, ComplianceAudit } from './types';
import { SovereignConfig } from './components/SovereignSettings';

const MOCK_USERS: Record<string, User> = {
  admin: {
    id: 'usr_admin',
    email: 'admin@pulseaudit.com',
    name: 'Admin User',
    tier: UserTier.LIFETIME,
    role: UserRole.ADMIN,
    createdAt: new Date()
  },
  auditor: {
    id: 'usr_auditor',
    email: 'auditor@pulseaudit.com',
    name: 'Sarah Compliance',
    tier: UserTier.PRO_MONTHLY,
    role: UserRole.AUDITOR,
    createdAt: new Date()
  },
  viewer: {
    id: 'usr_viewer',
    email: 'viewer@pulseaudit.com',
    name: 'John Stakeholder',
    tier: UserTier.FREE,
    role: UserRole.VIEWER,
    createdAt: new Date()
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [audits, setAudits] = useState<ComplianceAudit[]>([
    {
      id: 'demo_001',
      groupId: 'demo_001',
      version: 1,
      userId: 'demo',
      fileName: 'HealthData_Privacy_v4.pdf',
      fileType: 'pdf',
      framework: 'HIPAA',
      timestamp: new Date('2026-05-28'),
      score: 72,
      summary: 'HIPAA compliance audit identified 3 high-severity gaps in technical safeguards.',
      findings: [
        {
          severity: 'high',
          category: 'Encryption',
          description: 'At-rest encryption specification missing for PHI endpoints',
          recommendation: 'Add explicit AES-256 requirement for mobile data storage'
        },
        {
          severity: 'medium',
          category: 'Access Controls',
          description: 'Multi-factor authentication policy not documented',
          recommendation: 'Document MFA requirements for administrative access'
        },
        {
          severity: 'low',
          category: 'Audit Logs',
          description: 'Log retention period not specified',
          recommendation: 'Define 6-year retention per HIPAA requirements'
        }
      ],
      riskAnalysis: [
        { label: 'Security', value: 68 },
        { label: 'Privacy', value: 82 },
        { label: 'Administrative', value: 75 },
        { label: 'Physical', value: 90 },
        { label: 'Technical', value: 65 }
      ]
    },
    {
      id: 'demo_002',
      groupId: 'demo_002',
      version: 1,
      userId: 'demo',
      fileName: 'Cloud_Security_Policy.docx',
      fileType: 'docx',
      framework: 'SOC2',
      timestamp: new Date('2026-05-29'),
      score: 88,
      summary: 'SOC 2 Type II assessment shows strong security posture with minor gaps.',
      findings: [
        {
          severity: 'medium',
          category: 'Availability',
          description: 'Backup recovery testing frequency not documented',
          recommendation: 'Document quarterly DR testing schedule'
        },
        {
          severity: 'low',
          category: 'Confidentiality',
          description: 'Data classification scheme could be more granular',
          recommendation: 'Add sensitivity labels for internal use data'
        }
      ],
      riskAnalysis: [
        { label: 'Security', value: 92 },
        { label: 'Availability', value: 85 },
        { label: 'Processing', value: 90 },
        { label: 'Confidentiality', value: 88 },
        { label: 'Privacy', value: 86 }
      ]
    }
  ]);
  const [selectedAudit, setSelectedAudit] = useState<ComplianceAudit | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<ComplianceAudit | undefined>(undefined);
  const [sovereignConfig, setSovereignConfig] = useState<SovereignConfig | undefined>(undefined);

  const handleLogin = (roleKey: string = 'admin') => {
    setUser(MOCK_USERS[roleKey] || MOCK_USERS.admin);
    setIsAuth(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuth(false);
    setCurrentView('landing');
  };

  const handleAuditComplete = (newAudit: ComplianceAudit) => {
    setAudits(prev => [newAudit, ...prev]);
    setSelectedAudit(newAudit);
    setCurrentView('report');
    setUploadTarget(undefined);
  };

  const handleUpgrade = (tier: UserTier) => {
    if (user) setUser({ ...user, tier });
  };

  const renderView = () => {
    // If we're on a private view but not authenticated, show role selector (mock auth)
    if (!isAuth && currentView !== 'landing') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-200 text-center space-y-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
              <span className="text-white font-black text-3xl">P</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Select a role to preview the PulseAudit experience.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => handleLogin('admin')} 
                className="p-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-100 flex items-center justify-between"
              >
                <span>Login as Admin</span>
                <span className="text-[10px] uppercase bg-white/20 px-2 py-1 rounded">Full Control</span>
              </button>
              <button 
                onClick={() => handleLogin('auditor')} 
                className="p-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all hover:scale-[1.02] flex items-center justify-between"
              >
                <span>Login as Auditor</span>
                <span className="text-[10px] uppercase bg-white/20 px-2 py-1 rounded">Scans & Reports</span>
              </button>
              <button 
                onClick={() => handleLogin('viewer')} 
                className="p-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all hover:scale-[1.02] flex items-center justify-between border border-slate-200"
              >
                <span>Login as Viewer</span>
                <span className="text-[10px] uppercase bg-slate-400/20 px-2 py-1 rounded">Read Only</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={(role) => handleLogin(role)} />;
      case 'dashboard':
        return <Dashboard 
          audits={audits} 
          onSelectAudit={(a) => { setSelectedAudit(a); setCurrentView('report'); }} 
          onNewAudit={() => { setUploadTarget(undefined); setCurrentView('upload'); }} 
        />;
      case 'upload':
        return <AuditUpload 
          onAuditComplete={handleAuditComplete}
          onBack={() => setCurrentView('dashboard')}
          userRole={user?.role || UserRole.VIEWER} 
          existingAudit={uploadTarget}
        />;
      case 'report':
        return selectedAudit ? (
          <AuditReport 
            audit={selectedAudit} 
            allVersions={audits} 
            onSelectVersion={setSelectedAudit}
            onNewVersion={(v) => { setUploadTarget(v); setCurrentView('upload'); }}
            onBack={() => setCurrentView('dashboard')}
            userRole={user?.role || UserRole.VIEWER}
          />
        ) : <div className="p-20 text-center">No report selected.</div>;
      case 'pricing':
        return <Pricing onUpgrade={handleUpgrade} currentTier={user?.tier || UserTier.FREE} />;
      case 'sovereign':
        return <SovereignSettings onSave={(c) => { setSovereignConfig(c); setCurrentView('dashboard'); }} currentConfig={sovereignConfig} />;
      case 'ai-bom':
        return <AIBom />;
      case 'dev-nexus':
        return <DevNexus />;
      default:
        return <div>404</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-100">
      {isAuth ? (
        <Layout user={user} onLogout={handleLogout} onNavigate={setCurrentView} currentView={currentView}>
          {renderView()}
        </Layout>
      ) : renderView()}
    </div>
  );
};

export default App;
