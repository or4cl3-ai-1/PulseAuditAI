
import React, { useState } from 'react';
import { FRAMEWORKS } from '../constants';
import { auditDocument } from '../services/geminiService';
import { ComplianceAudit, UserRole } from '../types';

interface AuditUploadProps {
  onAuditComplete: (audit: ComplianceAudit) => void;
  userRole: UserRole;
  existingAudit?: ComplianceAudit; // If provided, we are creating a new version
}

const AuditUpload: React.FC<AuditUploadProps> = ({ onAuditComplete, userRole, existingAudit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [framework, setFramework] = useState(existingAudit?.framework || FRAMEWORKS[0].id);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // RBAC: Check if user has permission to upload/audit
  const canAudit = userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
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
          // Versioning Logic: If existing audit exists, use its groupId and increment version
          const result = await auditDocument(
            text, 
            framework, 
            file.name, 
            existingAudit?.groupId, 
            (existingAudit?.version || 0) + 1
          );
          onAuditComplete(result);
        } catch (err) {
          setError('AI Audit failed. Please check your API key or document content.');
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setIsUploading(false);
      };
      reader.readAsText(file);
    } catch (err) {
      setError('An unexpected error occurred.');
      setIsUploading(false);
    }
  };

  if (!canAudit) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-500 mt-2">Only Admins and Auditors can run compliance scans. Please contact your administrator.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {existingAudit ? `Update Audit: ${existingAudit.fileName} (v${existingAudit.version + 1})` : 'Create New Compliance Audit'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">Using semantic embeddings for enhanced regulatory analysis.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Framework</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  disabled={!!existingAudit} // Framework locked for new versions
                  onClick={() => setFramework(fw.id)}
                  className={`p-4 text-left border rounded-xl transition-all ${
                    framework === fw.id 
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600 ring-opacity-10' 
                    : 'border-slate-200 hover:border-indigo-300'
                  } ${existingAudit ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <p className="font-bold text-slate-900">{fw.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{fw.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Document (.pdf, .txt, .docx)</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-indigo-400'
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
                    <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="text-sm font-medium text-slate-900">Drop your file here or browse</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <button
            onClick={handleStartAudit}
            disabled={!file || isUploading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              !file || isUploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing v{existingAudit ? existingAudit.version + 1 : 1}...
              </span>
            ) : existingAudit ? 'Create New Version' : 'Start Automated Audit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditUpload;
