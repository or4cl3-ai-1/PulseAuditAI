
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AuditUpload from './components/AuditUpload';
import AuditReport from './components/AuditReport';
import Pricing from './components/Pricing';
import LandingPage from './components/LandingPage';
import DocumentGenerator from './components/DocumentGenerator';
import { CloudStorage } from './components/CloudStorage';
import { AuditTemplates, PRESET_TEMPLATES } from './components/AuditTemplates';
import { User, UserTier, UserRole, ComplianceAudit, AuditTemplate } from './types';

const INITIAL_AUDITS: ComplianceAudit[] = [
  {
    id: "aud_eu_ai_1",
    groupId: "grp_eu_ai",
    version: 1,
    userId: "usr_viewer", // Owned by John Stakeholder (usr_viewer)
    fileName: "Helios_Medical_AI_Router.json",
    fileType: "document",
    framework: "EU_AI_ACT",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    score: 65,
    summary: "High-risk medical triaging AI architecture reviewed. Critical risk assessment gaps identified.",
    findings: [
      {
        id: "fnd_eu_1",
        severity: "critical",
        category: "Risk Governance",
        title: "No In-Market Continuous Quality Logs",
        description: "Post-market monitoring plan (Art 61) lacks automatic tracking parameters for neural model calibration drift.",
        citation: "EU AI Act Art 61 & Annex IV",
        remediation: "Deploy continuous telemetry drift logs via cloud cron monitors. Run:\n`aws cloudwatch put-dashboard --dashboard-name HeliosNeuralDrift --dashboard-body file://drift_metrics.json`",
        status: "pending"
      },
      {
        id: "fnd_eu_2",
        severity: "high",
        category: "Transparency",
        title: "Lack of explicit human-in-the-loop overrides",
        description: "System documentation does not prove physical intervention steps for triage recommendation actions.",
        citation: "EU AI Act Art 14",
        remediation: "Add human supervisor validation gate API routes requiring click token confirmation before dispatch logic.",
        status: "pending"
      }
    ],
    riskAnalysis: [
      { label: "Data Quality", value: 60 },
      { label: "Human Oversight", value: 45 },
      { label: "Technical Docs", value: 70 },
      { label: "Accuracy Indices", value: 55 },
      { label: "Cybersecurity", value: 80 }
    ],
    roadmap: [
      {
        id: "rd_eu_1",
        title: "Deploy Continuous Telemetry Monitoring Dashboard",
        description: "Integrate automatic tracking variables for neural model drift checkups.",
        impact: "critical",
        effort: "medium",
        timeline: "Within 5 days"
      },
      {
        id: "rd_eu_2",
        title: "Human Override Validation Workflow",
        description: "Draft supervisor physical click verification steps.",
        impact: "high",
        effort: "low",
        timeline: "Next 2 weeks"
      }
    ],
    executiveBriefing: "During our professional verification of the [Helios_Medical_AI_Router.json] against official EU AI Act compliance milestones, PulseAudit identified two high-impact discrepancies in Quality Governance and Human Oversight.\n\nWhile the underlying technical systems have extremely robust general cybersecurity protections, you must immediately address drift and human intervention checkpoints to align with the regulatory deadlines finalized for August 2, 2026."
  },
  {
    id: "aud_soc2_1",
    groupId: "grp_soc2",
    version: 1,
    userId: "usr_admin", // Owned by Admin
    fileName: "Corporate_Auth_Policies.pdf",
    fileType: "document",
    framework: "SOC2",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    score: 88,
    summary: "Auth system design is secure. Recommended rotation parameters must be enforced automatically.",
    findings: [
      {
        id: "fnd_sc_1",
        severity: "medium",
        category: "Logical Access",
        title: "MFA Rotation Standard Discrepancy",
        description: "Standard corporate policy does not force session sign-out rotations after consecutive day changes.",
        citation: "SOC 2 CC6.1",
        remediation: "Update security context parameters inside backend auth gateways:\n`jwt.sign(payload, SECRET, { expiresIn: '12h' });`",
        status: "pending"
      }
    ],
    riskAnalysis: [
      { label: "Access Control", value: 85 },
      { label: "EncryptionRest", value: 95 },
      { label: "Logging Auditor", value: 80 },
      { label: "TransmissionSec", value: 90 },
      { label: "DisasterControls", value: 85 }
    ],
    roadmap: [
      {
        id: "rd_sc_1",
        title: "Session Rotation Auto-Lifespans",
        description: "Enforce JSON token validity rotations across active gateways.",
        impact: "medium",
        effort: "low",
        timeline: "Within 1 week"
      }
    ],
    executiveBriefing: "The authentication review indicates a secure logical control structure. Only one medium gaps was discovered in rotation protocols.\n\nFulfilling this token change will bring our security measures strictly into alignment with SOC 2 CC6 standards."
  }
];

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
    role: UserRole.CLIENT, // Map John Stakeholder as a CLIENT user
    createdAt: new Date(),
    companyName: 'Helios Medical AI Corp'
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [audits, setAudits] = useState<ComplianceAudit[]>(INITIAL_AUDITS);
  const [selectedAudit, setSelectedAudit] = useState<ComplianceAudit | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<ComplianceAudit | undefined>(undefined);

  // Storage & Templates states
  const [savedTemplates, setSavedTemplates] = useState<AuditTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<AuditTemplate | null>(null);
  const [preloadedFileName, setPreloadedFileName] = useState<string | null>(null);
  const [preloadedFileContent, setPreloadedFileContent] = useState<string | null>(null);

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
    // Force assign the logged-in user id to the audit report
    const auditWithOwner = {
      ...newAudit,
      userId: user?.id || 'usr_admin'
    };
    setAudits(prev => [auditWithOwner, ...prev]);
    setSelectedAudit(auditWithOwner);
    setCurrentView('report');
    setUploadTarget(undefined);
    setActiveTemplate(null);
  };

  const handleUpgrade = (tier: UserTier) => {
    if (user) setUser({ ...user, tier });
  };

  const renderView = () => {
    // If we're on a private view but not authenticated, show role selector (mock auth)
    if (!isAuth && currentView !== 'landing') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 selection:bg-indigo-900 selection:text-white">
          <div className="max-w-md w-full bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 text-center space-y-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-550/20">
              <span className="text-white font-black text-3xl">P</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 font-semibold text-sm">Select an authentication profile to unlock security layers.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => handleLogin('admin')} 
                className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all hover:scale-[1.02] flex items-center justify-between"
              >
                <span>Login as Admin</span>
                <span className="text-[10px] bg-white/20 px-2 py-1 rounded font-black tracking-wider uppercase">Full Control</span>
              </button>
              <button 
                onClick={() => handleLogin('auditor')} 
                className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all hover:scale-[1.02] flex items-center justify-between border border-slate-700/65"
              >
                <span>Login as Auditor</span>
                <span className="text-[10px] bg-teal-400/20 text-teal-400 px-2 py-1 rounded font-black tracking-wider uppercase">Lead Auditor</span>
              </button>
              <button 
                onClick={() => handleLogin('viewer')} 
                className="p-4 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl font-bold transition-all hover:scale-[1.02] flex items-center justify-between border border-slate-800/80"
              >
                <span>Login as Client</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-1 rounded font-black tracking-wider uppercase">Client Portal</span>
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
          user={user}
          onSelectAudit={(a) => { setSelectedAudit(a); setCurrentView('report'); }} 
          onNewAudit={() => { setUploadTarget(undefined); setActiveTemplate(null); setPreloadedFileName(null); setPreloadedFileContent(null); setCurrentView('upload'); }} 
        />;
      case 'upload':
        return <AuditUpload 
          onAuditComplete={handleAuditComplete} 
          userRole={user?.role || UserRole.CLIENT} 
          existingAudit={uploadTarget}
          activeTemplate={activeTemplate}
          preloadedFileName={preloadedFileName}
          preloadedFileContent={preloadedFileContent}
          clearPreloads={() => { setPreloadedFileName(null); setPreloadedFileContent(null); }}
        />;
      case 'generator':
        return <DocumentGenerator userTier={user?.tier || UserTier.FREE} />;
      case 'storage':
        return <CloudStorage 
          userRole={user?.role || UserRole.CLIENT} 
          onSelectFileForAudit={(name, content) => {
            setPreloadedFileName(name);
            setPreloadedFileContent(content);
            setActiveTemplate(null);
            setCurrentView('upload');
          }}
        />;
      case 'templates':
        return <AuditTemplates 
          userRole={user?.role || UserRole.CLIENT}
          onApplyTemplate={(tmpl) => {
            setActiveTemplate(tmpl);
            setPreloadedFileName(null);
            setPreloadedFileContent(null);
            setCurrentView('upload');
          }}
          savedTemplates={savedTemplates}
          onChangeTemplates={setSavedTemplates}
        />;
      case 'report':
        return selectedAudit ? (
          <AuditReport 
            audit={selectedAudit} 
            allVersions={audits} 
            onSelectVersion={setSelectedAudit}
            onNewVersion={(v) => { setUploadTarget(v); setCurrentView('upload'); }}
            userRole={user?.role || UserRole.CLIENT}
          />
        ) : <div className="p-20 text-center bg-slate-950 text-slate-400 font-bold">No report selected.</div>;
      case 'pricing':
        return <Pricing onUpgrade={handleUpgrade} currentTier={user?.tier || UserTier.FREE} />;
      default:
        return <div>404</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      {isAuth ? (
        <Layout user={user} onLogout={handleLogout} onNavigate={setCurrentView} currentView={currentView}>
          {renderView()}
        </Layout>
      ) : renderView()}
    </div>
  );
};

export default App;
