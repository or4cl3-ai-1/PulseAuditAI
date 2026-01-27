
import React, { useState } from 'react';
import { ComplianceAudit, ChatMessage, UserRole } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { chatWithAuditor } from '../services/geminiService';

interface AuditReportProps {
  audit: ComplianceAudit;
  allVersions: ComplianceAudit[];
  onSelectVersion: (audit: ComplianceAudit) => void;
  onNewVersion: (audit: ComplianceAudit) => void;
  userRole: UserRole;
}

const AuditReport: React.FC<AuditReportProps> = ({ audit, allVersions, onSelectVersion, onNewVersion, userRole }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAuditor(audit, input, chatHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "System logic error. Try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-10 pb-40 flex flex-col lg:flex-row gap-10 bg-slate-950 text-white">
      {/* Version Sidebar */}
      <div className="lg:w-72 flex-shrink-0 space-y-6">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Lineage history</h3>
        <div className="space-y-2">
          {allVersions
            .filter(v => v.groupId === audit.groupId)
            .sort((a, b) => b.version - a.version)
            .map((v) => (
              <button
                key={v.id}
                onClick={() => onSelectVersion(v)}
                className={`w-full p-4 rounded-2xl text-left transition-all group ${
                  v.id === audit.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm">Iteration v{v.version}</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md ${v.id === audit.id ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                    {v.score}%
                  </span>
                </div>
                <p className={`text-[10px] mt-2 font-bold opacity-60`}>
                  Timestamp: {v.timestamp.toLocaleDateString()}
                </p>
              </button>
            ))}
        </div>
        {(userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR) && (
          <button 
            onClick={() => onNewVersion(audit)}
            className="w-full py-4 bg-slate-900 text-indigo-400 border border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            + Run New Iteration
          </button>
        )}
      </div>

      <div className="flex-1 space-y-10">
        {/* Header Summary */}
        <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="84" stroke="#1e293b" strokeWidth="10" fill="transparent" />
              <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={527.7} strokeDashoffset={527.7 * (1 - audit.score / 100)} className={`${audit.score > 80 ? 'text-green-500' : audit.score > 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{audit.score}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Score</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">{audit.fileName} <span className="text-slate-700 font-bold ml-2">v{audit.version}</span></h1>
                <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mt-1">{audit.framework} Vector Protocol</p>
              </div>
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all">Download Audit PDF</button>
            </div>
            <p className="text-slate-400 leading-relaxed text-lg font-medium">{audit.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-xl col-span-1">
            <h3 className="text-xl font-black text-white mb-8 tracking-tight">Semantic Vectors</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={audit.riskAnalysis}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="label" fontSize={9} stroke="#64748b" fontWeight="800" />
                  <Radar name="Risk" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-xl col-span-2">
            <h3 className="text-xl font-black text-white mb-8 tracking-tight">Critical Deviations</h3>
            <div className="space-y-6">
              {audit.findings.map((finding, idx) => (
                <div key={idx} className="p-8 rounded-[2rem] border border-slate-800 bg-slate-800/20 space-y-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSeverityColor(finding.severity)}`}>
                      {finding.severity} Criticality
                    </span>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{finding.category}</span>
                  </div>
                  <h4 className="font-black text-white text-xl leading-snug">{finding.description}</h4>
                  <div className="pl-6 border-l-4 border-indigo-500/50">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 italic">Recommended Remediation</p>
                    <p className="text-slate-300 font-semibold leading-relaxed">{finding.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Chat Assistant */}
      <div className="fixed bottom-10 right-10 z-50">
        {chatOpen ? (
          <div className="w-80 md:w-[420px] h-[600px] bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-slide-up ring-1 ring-white/5">
            <div className="bg-slate-800 p-6 text-white flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-black text-xs uppercase tracking-widest">Compliance AI (Iteration v{audit.version})</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/50 scroll-smooth">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-lg' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex gap-3">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Query v{audit.version} analysis..."
                className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
              />
              <button onClick={handleSendMessage} className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setChatOpen(true)}
            className="w-16 h-16 bg-indigo-600 text-white rounded-[2rem] shadow-2xl hover:bg-indigo-500 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-indigo-600/30"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AuditReport;
