
import React from 'react';
import { ComplianceAudit } from '../types';

interface DashboardProps {
  audits: ComplianceAudit[];
  onSelectAudit: (audit: ComplianceAudit) => void;
  onNewAudit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ audits, onSelectAudit, onNewAudit }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Compliance Dashboard</h1>
          <p className="text-slate-500 font-medium">Overview of your automated document audits</p>
        </div>
        <button 
          onClick={onNewAudit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          + New Audit
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Audits</p>
          <p className="text-4xl font-black text-slate-900">{audits.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Average Score</p>
          <p className="text-4xl font-black text-slate-900">
            {audits.length > 0 
              ? Math.round(audits.reduce((acc, curr) => acc + curr.score, 0) / audits.length) 
              : 0}
            <span className="text-xl text-slate-400 font-normal">/100</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Frameworks Used</p>
          <p className="text-4xl font-black text-slate-900">{new Set(audits.map(a => a.framework)).size}</p>
        </div>
      </div>

      {/* Recent Audits Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Recent Audits</h2>
        </div>
        
        {audits.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p className="text-slate-500 font-medium">No audits found. Run your first scan to see results here.</p>
            <button onClick={onNewAudit} className="mt-4 text-indigo-600 font-bold hover:underline">Get started →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Document</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Framework</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Score</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                          {audit.fileName.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{audit.fileName}</p>
                          <p className="text-xs text-slate-500">ID: {audit.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">{audit.framework}</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">
                      {audit.timestamp.toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${audit.score > 80 ? 'bg-green-500' : audit.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${audit.score}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900">{audit.score}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => onSelectAudit(audit)}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        View Report
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
