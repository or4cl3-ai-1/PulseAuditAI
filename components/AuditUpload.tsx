
import React, { useState } from 'react';
import { FRAMEWORKS } from '../constants';
import { auditDocument } from '../services/geminiService';
import { ComplianceAudit, UserRole } from '../types';

interface AuditUploadProps {
  onAuditComplete: (audit: ComplianceAudit) => void;
  onBack?: () => void;
  userRole: UserRole;
  existingAudit?: ComplianceAudit;
}

const AuditUpload: React.FC<AuditUploadProps> = ({ onAuditComplete, onBack, userRole, existingAudit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [framework, setFramework] = useState(existingAudit?.framework || FRAMEWORKS[0].id);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAudit = userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Maximum upload size is 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleStartAudit = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        try {
          const result = await auditDocument(
            text, 
            framework, 
            file.name, 
            existingAudit?.groupId, 
            (existingAudit?.version || 0) + 1
          );
          onAuditComplete(result);
        } catch (err) {
          setError('Analysis failed. Verification engine timeout.');
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Internal file system error.');
        setIsUploading(false);
      };
      reader.readAsText(file);
    } catch (err) {
      setError('System core failure.');
      setIsUploading(false);
    }
  };

  if (!canAudit) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-slate-900 rounded-[3rem] border border-slate-800 mt-20">
        <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-2xl font-black text-white">Privilege Escalation Required</h2>
        <p className="text-slate-500 mt-3 font-medium">Your current session lacks 'AUDITOR' clearance. Request access from System Admin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-12 pb-32">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          Back to Dashboard
        </button>
      )}
      <div className="bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 p-12 space-y-12">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tight">
            {existingAudit ? `Iteration v${existingAudit.version + 1}` : 'Audit Initialization'}
          </h2>
          <p className="text-slate-400 font-medium">Deploying semantic analysis for regulatory verification.</p>
        </div>
        
        <div className="space-y-10">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Regulatory Vector</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  disabled={!!existingAudit}
                  onClick={() => setFramework(fw.id)}
                  className={`p-6 text-left border rounded-2xl transition-all ${
                    framework === fw.id 
                    ? 'border-indigo-600 bg-indigo-600/5 ring-1 ring-indigo-600' 
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-600'
                  } ${existingAudit ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <p className="font-black text-white">{fw.name}</p>
                  <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest leading-relaxed">{fw.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Document Payload</label>
            <div 
              className={`border-2 border-dashed rounded-[2rem] p-16 text-center transition-all ${
                file ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/50'
              }`}
            >
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileChange}
                accept=".txt,.pdf,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                {file ? (
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-lg font-black text-white">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Click to rotate payload</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <p className="text-lg font-black text-white">Upload Compliance Data</p>
                    <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">PDF, TXT, DOCX Supported</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="p-5 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/20 font-bold">
              {error}
            </div>
          )}

          <button
            onClick={handleStartAudit}
            disabled={!file || isUploading}
            className={`w-full py-6 rounded-2xl font-black text-white transition-all shadow-2xl ${
              !file || isUploading ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing Vector v{existingAudit ? existingAudit.version + 1 : 1}...
              </span>
            ) : existingAudit ? 'Deploy New Version' : 'Execute AI Verification Engine'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditUpload;
