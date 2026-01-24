
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
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
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
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I had trouble answering that." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 pb-32 flex flex-col lg:flex-row gap-8">
      {/* Version Sidebar */}
      <div className="lg:w-64 flex-shrink-0 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Audit History</h3>
        <div className="space-y-1">
          {allVersions
            .filter(v => v.groupId === audit.groupId)
            .sort((a, b) => b.version - a.version)
            .map((v) => (
              <button
                key={v.id}
                onClick={() => onSelectVersion(v)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  v.id === audit.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">v{v.version}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${v.id === audit.id ? 'bg-indigo-500' : 'bg-slate-100'}`}>
                    {v.score}%
                  </span>
                </div>
                <p className={`text-[10px] mt-1 ${v.id === audit.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {v.timestamp.toLocaleDateString()}
                </p>
              </button>
            ))}
        </div>
        {(userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR) && (
          <button 
            onClick={() => onNewVersion(audit)}
            className="w-full py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
          >
            + Run New Version
          </button>
        )}
      </div>

      <div className="flex-1 space-y-8">
        {/* Header Summary */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={439.8} strokeDashoffset={439.8 * (1 - audit.score / 100)} className={`${audit.score > 80 ? 'text-green-500' : audit.score > 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{audit.score}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Score</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{audit.fileName} <span className="text-slate-400 font-medium">v{audit.version}</span></h1>
                <p className="text-slate-500 font-medium">Framework: {audit.framework} • Analyzed on {audit.timestamp.toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">Export PDF</button>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed text-lg">{audit.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm col-span-1">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Semantic Risk Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={audit.riskAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" fontSize={10} />
                  <Radar name="Risk" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm col-span-2">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Critical Findings & Recommendations</h3>
            <div className="space-y-6">
              {audit.findings.map((finding, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getSeverityColor(finding.severity)}`}>
                      {finding.severity} Severity
                    </span>
                    <span className="text-sm font-bold text-slate-500">{finding.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">{finding.description}</h4>
                  <div className="pl-4 border-l-4 border-indigo-400">
                    <p className="text-sm text-slate-600 italic">Recommended Fix:</p>
                    <p className="text-slate-800 font-medium">{finding.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Assistant */}
      <div className="fixed bottom-8 right-8 z-50">
        {chatOpen ? (
          <div className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
              <span className="font-bold text-sm">Compliance AI Assistant (v{audit.version})</span>
              <button onClick={() => setChatOpen(false)} className="text-indigo-200 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 shadow-sm rounded-bl-none border border-slate-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about v{audit.version}..."
                className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={handleSendMessage} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 flex items-center justify-center transition-all hover:scale-105"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AuditReport;
