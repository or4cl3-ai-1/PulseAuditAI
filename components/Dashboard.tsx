import React, { useState, useEffect } from 'react';
import { ComplianceAudit, User, UserRole } from '../types';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Plus, 
  RefreshCw, 
  Zap, 
  ArrowUpRight, 
  History, 
  Layers, 
  FileCheck,
  ToggleLeft,
  Building,
  Users,
  Shield,
  Briefcase,
  Key
} from 'lucide-react';
import { FRAMEWORKS } from '../constants';

interface DashboardProps {
  audits: ComplianceAudit[];
  user: User | null;
  onSelectAudit: (audit: ComplianceAudit) => void;
  onNewAudit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ audits: rawAudits, user, onSelectAudit, onNewAudit }) => {
  const isClient = user?.role === UserRole.CLIENT;
  const audits = isClient ? rawAudits.filter(a => a.userId === user?.id) : rawAudits;

  const [activeWarningTab, setActiveWarningTab] = useState<'critical' | 'all'>('critical');

  // Generate simulated chart datasets derived organically from actual audits list
  // or elegant defaults to demonstrate full platform aesthetics on first launch
  const defaultRadarData = [
    { subject: 'Access Control', SOC2: 85, GDPR: 72, EU_AI: 90, actual: 80 },
    { subject: 'Data Protection', SOC2: 90, GDPR: 88, EU_AI: 75, actual: 85 },
    { subject: 'Risk Assessment', SOC2: 70, GDPR: 65, EU_AI: 82, actual: 72 },
    { subject: 'Continuous Audit', SOC2: 75, GDPR: 80, EU_AI: 60, actual: 68 },
    { subject: 'Encryption Standards', SOC2: 95, GDPR: 90, EU_AI: 70, actual: 88 },
    { subject: 'Incident Pipeline', SOC2: 80, GDPR: 85, EU_AI: 80, actual: 82 },
  ];

  const getRadarDataset = () => {
    if (audits.length === 0) return defaultRadarData;
    // Map existing subjects and dynamically calculate from audit findings
    const subjects = ['Access Control', 'Data Protection', 'Risk Management', 'Security Safeguard', 'Log Integrity', 'Incident Plan'];
    return subjects.map(sub => {
      // Find average index for this general domain category
      const scoreSum = audits.reduce((acc, a) => {
        const met = a.riskAnalysis.find(r => r.label.toLowerCase().includes(sub.toLowerCase().split(' ')[0]));
        return acc + (met ? met.value : a.score);
      }, 0);
      return {
        subject: sub,
        actual: Math.round(scoreSum / audits.length)
      };
    });
  };

  const barData = [
    { framework: 'SOC 2 Type II', score: audits.find(a => a.framework === 'SOC2')?.score || 88, benchmark: 90 },
    { framework: 'HIPAA Security', score: audits.find(a => a.framework === 'HIPAA')?.score || 72, benchmark: 85 },
    { framework: 'GDPR Privacy', score: audits.find(a => a.framework === 'GDPR')?.score || 81, benchmark: 95 },
    { framework: 'EU AI Act', score: audits.find(a => a.framework === 'EU_AI_ACT')?.score || 65, benchmark: 85 },
    { framework: 'Privacy Policy', score: audits.find(a => a.framework === 'PRIVACY')?.score || 92, benchmark: 95 },
    { framework: 'Custom Bylaws', score: audits.find(a => a.framework === 'CUSTOM')?.score || 80, benchmark: 80 },
  ];

  const defaultVelocityData = [
    { period: 'Scan V1', SOC2: 60, GDPR: 50, HIPAA: 70 },
    { period: 'Scan V2', SOC2: 72, GDPR: 65, HIPAA: 75 },
    { period: 'Scan V3', SOC2: 81, GDPR: 74, HIPAA: 72 },
    { period: 'Scan V4', SOC2: 88, GDPR: 81, HIPAA: 85 },
  ];

  const getVelocityDataset = () => {
    if (audits.length === 0) return defaultVelocityData;
    // Walk history grouped chronologically
    return audits
      .slice()
      .reverse()
      .map((a, index) => ({
        period: `Iteration ${index + 1} (${a.framework})`,
        score: a.score,
        remediations: a.findings.filter(f => f.status === 'resolved').length
      }));
  };

  const getAggregateCriticalCount = () => {
    return audits.reduce((sum, a) => sum + a.findings.filter(f => f.severity === 'critical' || f.severity === 'high').length, 0);
  };

  const getResolvedCount = () => {
    return audits.reduce((sum, a) => sum + a.findings.filter(f => f.status === 'resolved').length, 2);
  };

  const allFindingsCollector = audits.flatMap(a => a.findings.map(f => ({ ...f, auditName: a.fileName, framework: a.framework })));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12 py-12 bg-slate-950 text-white leading-relaxed">
      
      {/* Title block with persistent evaluation engine indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/80 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-400 font-mono">COGNITIVE COMPLIANCE ENGINE ACTIVE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2">
            {isClient ? `${user?.companyName || 'Corporate Client'} Console` : 'Compliance Intelligence'}
          </h1>
          <p className="text-slate-400 font-semibold mt-1">
            {isClient ? 'Secure Client Portal & Dedicated Security Posture Trajectory' : 'SaaS Unified Command Center & Operational Trajectory Analysis'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!isClient ? (
            <button 
              onClick={onNewAudit}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-xl font-black shadow-lg shadow-indigo-600/15 text-xs tracking-widest uppercase transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              Initialize Scan
            </button>
          ) : (
            <div className="flex items-center gap-2 p-3.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-black uppercase rounded-xl tracking-wider">
              <Key className="w-4 h-4 text-indigo-400" />
              Secure Client Feed Only
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Company Information Widget (Visible ONLY to Client Users) */}
      {isClient && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-mono">Assigned Corporation</h3>
                  <p className="text-xl font-black text-white">{user?.companyName || 'Corporate Client User'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Your organizational data flow, policy files, and EU AI Act neural verification matrices are fully isolated with Row-Level Security policy directives.
              </p>
              <div className="pt-2">
                <span className="px-3 py-1 bg-slate-950 text-[10px] text-green-400 font-black border border-green-500/20 rounded-md uppercase tracking-wider font-mono">
                  ● Continuous Protection Active
                </span>
              </div>
            </div>

            <div className="space-y-4 border-t lg:border-t-0 lg:border-l lg:border-r border-slate-800/80 p-0 lg:px-8">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                Account Clearance Parameters
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[8px] font-mono text-slate-500 font-bold block">SECURITY SUBSCRIPTION</span>
                  <span className="text-xs font-bold text-white">{user?.tier || 'FREE'}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[8px] font-mono text-slate-500 font-bold block">AUDITED MATRICES</span>
                  <span className="text-xs font-bold text-white">{audits.length} Records</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[8px] font-mono text-slate-500 font-bold block">SECURE REGIONS</span>
                  <span className="text-xs font-bold text-indigo-400 font-mono">US-EAST-1 GCS</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-[8px] font-mono text-slate-500 font-bold block">TENANT UUID TOKEN</span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold">usr_viewer</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Your Assigned PulseAudit Team
              </h4>
              <div className="space-y-2 text-xs font-semibold text-slate-300">
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                  <span>Sarah Compliance (Auditor)</span>
                  <a href="mailto:auditor@pulseaudit.com" className="text-indigo-400 hover:underline">Contact</a>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                  <span>PulseAudit SecOps Team</span>
                  <a href="mailto:support@pulseaudit.com" className="text-indigo-400 hover:underline">Support</a>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic font-semibold leading-normal">
                If you detect configuration discrepancies or require further policy ingestion support, please file access ticket escalations securely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Executive Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Total Audited Matrices", 
            value: audits.length > 0 ? audits.length : "6 Active", 
            sub: "Across complete catalog", 
            icon: Layers, 
            color: "text-indigo-400",
            bg: "bg-indigo-500/5"
          },
          { 
            label: "Global Compliance Posture", 
            value: audits.length > 0 
              ? `${Math.round(audits.reduce((acc, curr) => acc + curr.score, 0) / audits.length)}%` 
              : "81% Posture", 
            sub: "Overall mathematical index", 
            icon: FileCheck, 
            color: "text-green-400",
            bg: "bg-green-500/5"
          },
          { 
            label: "Vulnerabilities Identified", 
            value: audits.length > 0 ? getAggregateCriticalCount() : "2 High-Priority", 
            sub: "Required remediation steps", 
            icon: ShieldAlert, 
            color: "text-rose-400",
            bg: "bg-rose-500/5"
          },
          { 
            label: "Remediated Safeguards", 
            value: audits.length > 0 ? getResolvedCount() : "3 Tasks resolved", 
            sub: "Continuous track velocity", 
            icon: CheckCircle, 
            color: "text-sky-400",
            bg: "bg-sky-500/5"
          }
        ].map((card, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full ${card.bg} opacity-50 flex items-center justify-center`}>
              <card.icon className={`w-8 h-8 ${card.color} opacity-40 translate-x-3 -translate-y-3 group-hover:scale-110 transition-transform`} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-4">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-black ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-3">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Production-Ready Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radar Coverage Chart */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white tracking-tight">Radar Coverage Chart</h3>
              <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded">6 Domains</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-6">
              Coverage percentage mapping across all checked system security controls.
            </p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="85%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getRadarDataset()}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" fontSize={8} stroke="#94a3b8" fontWeight="800" />
                <Radar name="Active Posture" dataKey="actual" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Framework Comparison Bar Chart */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white tracking-tight font-sans">Framework Read Discrepancy</h3>
              <span className="text-[9px] font-mono bg-violet-500/10 text-violet-400 px-2 py-1 rounded">Comparative Matrix</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-6">
              Exposing alignment score differentials against target compliance benchmarks.
            </p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="framework" tick={{ fill: '#64748b', fontSize: 7, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 8 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="score" name="Scored Posture" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" name="Benchmark Std" fill="#4d5360" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Velocity Line Chart */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white tracking-tight">Compliance Velocity Track</h3>
              <span className="text-[9px] font-mono bg-green-500/10 text-green-400 px-2 py-1 rounded">Lineage Track</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-6">
              Historical scoring velocity over consecutive iteration steps and remediation runs.
            </p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={getVelocityDataset()} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 7, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 8 }} domain={[40, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={3} activeDot={{ r: 8 }} name="Post Remediation Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid: Document Registry & Active Framework Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Document Registry Registry */}
        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden lg:col-span-2">
          <div className="px-10 py-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex justify-between items-center">
            <h2 className="text-lg font-black text-white tracking-tight">Active Registries & Systems</h2>
            <span className="px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{audits.length} Logs</span>
          </div>

          {audits.length === 0 ? (
            <div className="p-20 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-800 text-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-bold text-lg">Platform is awaiting first run payload.</p>
              <button 
                onClick={onNewAudit} 
                className="text-indigo-400 font-black hover:text-indigo-300 transition-colors uppercase tracking-widest text-xs"
              >
                Incept Compliance Vector →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800/40">
                    <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Dataset Identifier</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Vector</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Version</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Scoring Posture</th>
                    <th className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Registry Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {audits.map((audit) => (
                    <tr key={audit.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black ring-1 ring-indigo-500/20 text-sm">
                            {audit.fileName.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">{audit.fileName}</p>
                            <p className="text-[9px] text-slate-500 font-black tracking-widest font-mono uppercase">{audit.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2.5 py-1 bg-slate-800 rounded-md text-[9px] font-mono font-black text-indigo-400 border border-slate-700">{audit.framework}</span>
                      </td>
                      <td className="px-8 py-5 text-center text-xs font-bold text-slate-400 font-mono">
                        v{audit.version}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full ${audit.score > 80 ? 'bg-green-500' : audit.score > 55 ? 'bg-amber-400' : 'bg-red-500'}`} 
                              style={{ width: `${audit.score}%` }}
                            />
                          </div>
                          <span className={`font-black text-xs font-mono ${audit.score > 80 ? 'text-green-400' : audit.score > 55 ? 'text-amber-400' : 'text-red-400'}`}>{audit.score}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => onSelectAudit(audit)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest text-white rounded-md border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                        >
                          Launch Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Regulatory Standards Baseline List */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white tracking-tight">Active Benchmarks</h3>
              <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded">Targeted Standards</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Primary regulatory frameworks enforced across active audit sets.
            </p>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {FRAMEWORKS.map((fw) => {
                const auditsOfFramework = audits.filter(a => a.framework === fw.id);
                return (
                  <div key={fw.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                        <h4 className="font-bold text-xs text-white uppercase">{fw.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{fw.description}</p>
                    </div>
                    {auditsOfFramework.length > 0 ? (
                      <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-black whitespace-nowrap">
                        {auditsOfFramework.length} {auditsOfFramework.length === 1 ? 'Record' : 'Records'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded whitespace-nowrap">
                        Inactive
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 mt-6 text-center">
            <span className="text-[10px] font-bold text-slate-505 uppercase tracking-widest font-mono">
              Continuous Ingestion Engine
            </span>
          </div>
        </div>

      </div>

      {/* Aggregate Regulatory Gaps findings summary */}
      {audits.length > 0 && (
        <div className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-800 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Active Operational Gaps</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Directly aggregated findings compiled from active indices</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveWarningTab('critical')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${activeWarningTab === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'border-slate-800 text-slate-500'}`}
              >
                Critical / High Gaps
              </button>
              <button 
                onClick={() => setActiveWarningTab('all')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${activeWarningTab === 'all' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'border-slate-800 text-slate-400'}`}
              >
                All Findings
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allFindingsCollector
              .filter(f => activeWarningTab === 'all' || ['critical', 'high'].includes(f.severity))
              .map((f, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest border ${
                      f.severity === 'critical' || f.severity === 'high' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : f.severity === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {f.severity} Severeness
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{f.framework} Protocols</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{f.title}</h4>
                    <p className="text-[10px] text-indigo-400 font-bold font-mono tracking-wide mt-1">Citation: {f.citation}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            {allFindingsCollector.filter(f => activeWarningTab === 'all' || ['critical', 'high'].includes(f.severity)).length === 0 && (
              <div className="p-12 md:col-span-2 text-center text-slate-500 font-bold">
                No active gaps matching selected severity range.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
