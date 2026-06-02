import React, { useState } from 'react';
import { ComplianceAudit, ChatMessage, UserRole, Finding, RoadmapItem } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { chatWithAuditor } from '../services/geminiService';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clipboard, 
  X, 
  Send, 
  Terminal, 
  Map, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  HelpCircle,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

interface AuditReportProps {
  audit: ComplianceAudit;
  allVersions: ComplianceAudit[];
  onSelectVersion: (audit: ComplianceAudit) => void;
  onNewVersion: (audit: ComplianceAudit) => void;
  userRole: UserRole;
}

const AuditReport: React.FC<AuditReportProps> = ({ audit, allVersions, onSelectVersion, onNewVersion, userRole }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Greetings! I am preloaded with the audit blueprint context of ${audit.fileName} (v${audit.version}). Ask me to draft AWS KMS double-encryption keys, design HIPAA network configurations, or prioritize immediate items before upcoming deadlines.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Allow client to resolve or remediate findings interactively to observe real-time posture adjustments!
  const [fndStatuses, setFndStatuses] = useState<Record<string, 'pending' | 'remediating' | 'resolved'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getFindingStatus = (fndId: string) => fndStatuses[fndId] || 'pending';

  const toggleFindingStatus = (fndId: string) => {
    const current = getFindingStatus(fndId);
    let next: 'pending' | 'remediating' | 'resolved' = 'pending';
    if (current === 'pending') next = 'remediating';
    else if (current === 'remediating') next = 'resolved';
    else next = 'pending';
    
    setFndStatuses(prev => ({ ...prev, [fndId]: next }));
  };

  // Adjust global score based on remediated items dynamically
  const calculateAdjustedScore = () => {
    const findings = audit.findings;
    if (findings.length === 0) return audit.score;
    const resolvedCount = Object.values(fndStatuses).filter(s => s === 'resolved').length;
    const remediatingCount = Object.values(fndStatuses).filter(s => s === 'remediating').length;
    const boost = resolvedCount * 8 + remediatingCount * 3;
    return Math.min(100, audit.score + boost);
  };

  const currentScore = calculateAdjustedScore();

  const getSeverityStyle = (sev: string) => {
    switch(sev?.toLowerCase()) {
      case 'critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700/50';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawVal = textToSend || input;
    if (!rawVal.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', content: rawVal, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAuditor(audit, rawVal, chatHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "An error occurred with the auditor cognitive chat stack. Please retry.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { title: "KMS Policy", prompt: "Draft a corporate AES-256 AWS KMS Key policy configured to remediate double-encryption gaps." },
    { title: "Bash Script", prompt: "Write me a shell script or AWS IAM template securing cloud endpoints with MFA parameters." },
    { title: "HIPAA PHI Setup", prompt: "Write down the exact steps to configure PostgreSQL PHI network isolation." },
    { title: "August 2, 2026", prompt: "Outline a regulatory alignment task schedule prioritizing upcoming EU AI Act deadlines." }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12 pb-32 flex flex-col lg:flex-row gap-10 bg-slate-950 text-white relative">
      
      {/* Dynamic Lineage Sidebar */}
      <div className="lg:w-80 flex-shrink-0 space-y-8 lg:sticky lg:top-24 h-fit">
        <div className="bg-slate-900 border border-slate-800/80 p-5 sm:p-6 rounded-[2rem] space-y-6 shadow-md">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Regulatory Lineage</h3>
            <p className="text-xs text-slate-450 font-semibold">Track historical iterations of this dataset</p>
          </div>
          
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-72 pr-1 pb-3 lg:pb-0 scroll-smooth snap-x snap-mandatory">
            {allVersions
              .filter(v => v.groupId === audit.groupId)
              .sort((a, b) => b.version - a.version)
              .map((v) => (
                <button
                  key={v.id}
                  onClick={() => onSelectVersion(v)}
                  className={`w-64 sm:w-72 lg:w-full shrink-0 snap-start p-4 rounded-xl text-left transition-all group font-sans border cursor-pointer select-none min-h-[44px] ${
                    v.id === audit.id 
                      ? 'bg-indigo-600 text-white border-transparent shadow-xl shadow-indigo-600/10' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm group-hover:text-white transition-colors">Iteration v{v.version}</span>
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${v.id === audit.id ? 'bg-indigo-500/80 text-white' : 'bg-slate-900 text-indigo-400'}`}>
                      {v.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] mt-2 font-black uppercase tracking-widest opacity-60">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(v.timestamp).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
          </div>

          {(userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR) && (
            <button 
              onClick={() => onNewVersion(audit)}
              className="w-full py-4 bg-slate-950 text-indigo-400 border border-slate-800 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-slate-900 hover:border-slate-700/80 hover:text-indigo-300 transition-colors cursor-pointer select-none flex items-center justify-center gap-2 min-h-[44px]"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Re-Audit New Version
            </button>
          )}
        </div>

        {/* Quick Help box */}
        <div className="hidden lg:block bg-gradient-to-b from-indigo-950/20 to-slate-900 border border-slate-800 p-6 rounded-[2rem]">
          <HelpCircle className="w-6 h-6 text-indigo-400 mb-3" />
          <h4 className="font-bold text-white text-sm">Interactive Status Indicators</h4>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            Click finding status buttons inside the vulnerabilities register to simulate remediations and watch the aggregate index calculate adjustments in real time!
          </p>
        </div>
      </div>

      {/* Main Report Flow */}
      <div className="flex-1 space-y-10">
        
        {/* Dynamic score header card */}
        <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-10 border border-slate-800 shadow-2xl flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-bl-full filter blur-xl pointer-events-none"></div>
          
          {/* Compliance dial */}
          <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="76" stroke="#1e293b" strokeWidth="8" fill="transparent" />
              <circle cx="88" cy="88" r="76" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={477.5} 
                strokeDashoffset={477.5 * (1 - currentScore / 100)} 
                className={`${currentScore >= 80 ? 'text-green-400' : currentScore >= 55 ? 'text-amber-400' : 'text-red-400'} transition-all duration-700`} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white font-mono">{currentScore}</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Index Posture</span>
            </div>
          </div>
          
          {/* Header Description */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="px-3 py-1 bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono font-black rounded-lg uppercase tracking-wider">{audit.framework} STANDARDS</span>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2">{audit.fileName} <span className="text-slate-600 font-bold ml-1 text-2xl font-mono">v{audit.version}</span></h1>
              </div>
            </div>
            
            <p className="text-slate-400 leading-relaxed text-sm font-semibold">{audit.summary}</p>
          </div>
        </div>

        {/* C-Suite Executive Briefing card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            <h3 className="text-lg font-black text-white tracking-tight">Executive Briefing Narrative</h3>
          </div>
          <div className="text-slate-300 space-y-4 text-sm font-medium leading-relaxed">
            {audit.executiveBriefing ? (
              audit.executiveBriefing.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>Analysis narrative summary compilation pending...</p>
            )}
          </div>
        </div>

        {/* Bento: Domain-Specific Risk Matrix & Priority action timeline */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* Radar details */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl xl:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight mb-2">Category Vector Scores</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-6">Domain-specific completeness matrix index.</p>
            </div>
            <div className="h-60 flex items-center justify-center">
              {audit.riskAnalysis?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={audit.riskAnalysis}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="label" fontSize={8} stroke="#64748b" fontWeight="800" />
                    <Radar name="Scans" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 font-bold text-sm">Matrix indexing empty for custom checks.</p>
              )}
            </div>
          </div>

          {/* Action roadmap timeline */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl xl:col-span-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-black text-white tracking-tight">Prioritized Action Roadmap</h3>
              </div>
              <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded">Chronological</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-6">Remediations prioritized by operational impact rating and effort estimates.</p>
            
            <div className="space-y-4">
              {audit.roadmap?.map((item, idx) => (
                <div key={item.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-slate-700 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-indigo-400 font-black text-xs flex items-center justify-center flex-shrink-0 font-mono border border-slate-800">
                    {idx + 1}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                      <span className={`text-[8px] font-black uppercase font-mono px-2 py-0.5 rounded border ${
                        item.impact === 'critical' || item.impact === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}>
                        {item.impact}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                        Effort: {item.effort}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">{item.description}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Suggested Target: {item.timeline}</p>
                  </div>
                </div>
              ))}
              {(!audit.roadmap || audit.roadmap.length === 0) && (
                <div className="p-8 text-center text-slate-500 text-sm font-bold">
                  Roadmap parameters automatically consolidated. Review full finding register cards.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Findings Register card list */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-xl font-black text-white tracking-tight">Structured Gaps & Critical Deviations</h3>
            <span className="bg-rose-500/15 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-[10px] font-mono font-black">{audit.findings.length} Vulnerabilities</span>
          </div>

          <div className="space-y-6">
            {audit.findings.map((finding, idx) => {
              const status = getFindingStatus(finding.id || finding.title);
              
              return (
                <div key={finding.id || idx} className="p-8 rounded-[2.5rem] border border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors space-y-6">
                  
                  {/* Status header bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-sans font-black uppercase tracking-widest border ${getSeverityStyle(finding.severity)}`}>
                        {finding.severity} Severity
                      </span>
                      <span className="text-xs font-mono font-black text-slate-500 uppercase tracking-wider">{finding.category}</span>
                    </div>
                    
                    {/* Interactive workflow state changer block */}
                    <div className="flex items-center gap-3.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Remediation:</span>
                      <button 
                        onClick={() => toggleFindingStatus(finding.id || finding.title)}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border flex items-center gap-2 cursor-pointer transition-all ${
                          status === 'resolved' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : status === 'remediating'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {status === 'resolved' && <Check className="w-3.5 h-3.5" />}
                        <span>{status === 'resolved' ? 'RESOLVED' : status === 'remediating' ? 'REMEDIATING' : 'PENDING'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Finding Title & Regulatory Requirement Citation */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono font-black tracking-widest text-indigo-400 uppercase">Requirement Code: {finding.citation}</p>
                    <h4 className="font-extrabold text-white text-2xl leading-snug tracking-tight">{finding.title || finding.description}</h4>
                    <p className="text-slate-400 text-sm font-semibold leading-relaxed mt-2">{finding.description}</p>
                  </div>

                  {/* Step-by-Step Remediation Playbook with instant copy click */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        <span>Step-By-Step Command Playbook</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(finding.remediation, finding.id || idx.toString())}
                        className="text-indigo-400 hover:text-indigo-300 font-black cursor-pointer flex items-center gap-1 leading-none uppercase tracking-wider"
                      >
                        {copiedId === (finding.id || idx.toString()) ? 'COPIED!' : 'COPY CODE'}
                      </button>
                    </div>
                    
                    <pre className="text-xs text-indigo-200 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed bg-slate-950/60 p-4 border border-slate-800 rounded-lg max-h-56">
                      {finding.remediation}
                    </pre>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Slide-out persistent contextual Chat Assistant Panel (Section 3) */}
      <div className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-50">
        {chatOpen ? (
          <div className="w-[calc(100vw-2rem)] md:w-[460px] max-w-[460px] h-[560px] md:h-[640px] bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-slide-up ring-1 ring-white/5">
            
            {/* Slide Header */}
            <div className="bg-slate-800/80 p-5 md:p-6 text-white flex justify-between items-center border-b border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <div>
                  <span className="font-black text-xs uppercase tracking-[0.15em] block leading-none">Compliance Intelligence Assist</span>
                  <span className="text-[8px] text-indigo-400 font-mono font-bold uppercase tracking-widest leading-none mt-1.5 block">Audit Context Locked: v{audit.version}</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide message corpus */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-950/45 scroll-smooth select-text">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed font-sans max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-lg font-bold' 
                      : 'bg-slate-800/85 text-slate-200 rounded-bl-none border border-slate-700/60 font-semibold'
                  }`}>
                    {msg.content.includes('#') || msg.content.includes('```') ? (
                      <div className="whitespace-pre-wrap font-mono text-[10px] text-indigo-200 bg-slate-950/80 p-3 rounded border border-slate-800 mt-1">
                        {msg.content}
                      </div>
                    ) : (
                      <span className="whitespace-pre-line">{msg.content}</span>
                    )}
                    <span className="block text-[8px] text-slate-500 text-right mt-1.5 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 p-4 rounded-2xl rounded-bl-none border border-slate-700/50">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Smart compliance templates Quick Prompts Drawer */}
            <div className="bg-slate-950 border-t border-slate-800 p-4">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Preloaded Workspace Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.prompt)}
                    className="p-2.5 bg-slate-900 hover:bg-slate-850 text-left rounded-xl transition-all border border-slate-800/80 hover:border-indigo-600/30 text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer select-none line-clamp-1 truncate"
                  >
                    {q.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Input tray */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex gap-3 items-center">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Query and ask script remediation..."
                className="flex-1 p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-semibold font-sans"
              />
              <button 
                onClick={() => handleSendMessage()} 
                disabled={isTyping}
                className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setChatOpen(true)}
            className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer relative"
          >
            <Sparkles className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[8px] font-black text-white items-center justify-center">AI</span>
            </span>
          </button>
        )}
      </div>

    </div>
  );
};

export default AuditReport;
