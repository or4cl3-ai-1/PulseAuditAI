
import React from 'react';
import { ComplianceAudit } from '../types';

interface DashboardProps {
  audits: ComplianceAudit[];
  onSelectAudit: (audit: ComplianceAudit) => void;
  onNewAudit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ audits, onSelectAudit, onNewAudit }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-10 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Intelligence Dashboard</h1>
          <p className="text-slate-400 font-semibold mt-1">Reviewing active compliance vectors</p>
        </div>
        <button 
          onClick={onNewAudit}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
        >
          + Initialize Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Scans', val: audits.length, color: 'text-indigo-400' },
          { 
            label: 'Global Score', 
            val: audits.length > 0 ? Math.round(audits.reduce((acc, curr) => acc + curr.score, 0) / audits.length) : 0, 
            suffix: '/100',
            color: 'text-green-400' 
          },
          { label: 'Active Frameworks', val: new Set(audits.map(a => a.framework)).size, color: 'text-violet-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-sm">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">{stat.label}</p>
            <p className={`text-5xl font-black ${stat.color}`}>
              {stat.val}<span className="text-xl text-slate-700 font-bold ml-1">{stat.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <h2 className="text-xl font-black text-white">Document Registry</h2>
        </div>
        
        {audits.length === 0 ? (
          <div className="p-24 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-800 text-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p className="text-slate-500 font-bold text-lg">Platform is currently idle. No datasets found.</p>
            <button onClick={onNewAudit} className="text-indigo-400 font-black hover:text-indigo-300 transition-colors">Start First Run →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dataset Identifier</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vector</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Iteration</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance Vector</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black ring-1 ring-indigo-500/20">
                          {audit.fileName.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{audit.fileName}</p>
                          <p className="text-[10px] text-slate-600 font-black tracking-widest">{audit.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-indigo-400 border border-slate-700">{audit.framework}</span>
                    </td>
                    <td className="px-10 py-6 text-center text-sm font-bold text-slate-400">
                      v{audit.version}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${audit.score > 80 ? 'bg-green-500' : audit.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${audit.score}%` }}
                          />
                        </div>
                        <span className={`font-black text-sm ${audit.score > 80 ? 'text-green-400' : audit.score > 50 ? 'text-amber-400' : 'text-red-400'}`}>{audit.score}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => onSelectAudit(audit)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-black text-white rounded-lg border border-slate-700 transition-all"
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
    </div>
  );
};

export default Dashboard;
