import React, { useState, useRef, useEffect } from 'react';
import { FRAMEWORKS } from '../constants';
import { auditDocument } from '../services/geminiService';
import { ComplianceAudit, UserRole, ComplianceFrameworkId, AuditTemplate } from '../types';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Clipboard, Sliders, Settings } from 'lucide-react';

interface AuditUploadProps {
  onAuditComplete: (audit: ComplianceAudit) => void;
  userRole: UserRole;
  existingAudit?: ComplianceAudit;
  activeTemplate?: AuditTemplate | null;
  preloadedFileName?: string | null;
  preloadedFileContent?: string | null;
  clearPreloads?: () => void;
}

const AuditUpload: React.FC<AuditUploadProps> = ({ 
  onAuditComplete, 
  userRole, 
  existingAudit,
  activeTemplate,
  preloadedFileName,
  preloadedFileContent,
  clearPreloads
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [framework, setFramework] = useState<ComplianceFrameworkId>(existingAudit?.framework || 'EU_AI_ACT');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paste fallback option if user doesn't have standard files
  const [pastedText, setPastedText] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'file' | 'paste'>('file');

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAudit = userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR;

  // Track applied templates and preloaded files
  useEffect(() => {
    if (activeTemplate) {
      setFramework(activeTemplate.framework);
    }
  }, [activeTemplate]);

  useEffect(() => {
    if (preloadedFileContent) {
      setUploadMode('paste');
      setPastedText(preloadedFileContent);
    }
  }, [preloadedFileContent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError('Maximum upload size is 15MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 15 * 1024 * 1024) {
        setError('Maximum upload size is 15MB.');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleStartAudit = async () => {
    setIsUploading(true);
    setError(null);

    // Format active template rules into a concrete checklist prompt
    let templateInstructions = "";
    if (activeTemplate) {
      templateInstructions = `ACTIVE BLUEPRINT TEMPLATE: "${activeTemplate.name}"
BACKGROUND: ${activeTemplate.description}
      
CRITICAL AUDITING CHECKLIST (WEIGHTS SPECIFIED):
${activeTemplate.checklist.map((c, i) => `- [RULE ${i+1}] ${c.title}: ${c.description} (Weight: ${c.weight}x multiplier)`).join("\n")}

MANDATORY EVIDENCE REQUIREMENTS:
${activeTemplate.evidenceRequirements.map((r, i) => `- [EVIDENCE REQUIREMENT ${i+1}] ${r}`).join("\n")}

TARGET BASE SCORE: Needs to align with benchmark minimum of ${activeTemplate.benchmarkScore || 70}/100. Generate score calculation adhering strictly to these weights.`;
    }

    try {
      if (uploadMode === 'paste') {
        if (!pastedText.trim()) {
          setError('Please input policy text or system descriptions.');
          setIsUploading(false);
          return;
        }

        // Directly run analysis
        const result = await auditDocument(
          pastedText, 
          framework, 
          preloadedFileName || "Direct_Paste_Model_Design.txt", 
          existingAudit?.groupId, 
          (existingAudit?.version || 0) + 1,
          templateInstructions || undefined
        );
        onAuditComplete(result);
      } else {
        if (!file) {
          setError('Please select or drag a system payload document.');
          setIsUploading(false);
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          try {
            const result = await auditDocument(
              text, 
              framework, 
              file.name, 
              existingAudit?.groupId, 
              (existingAudit?.version || 0) + 1,
              templateInstructions || undefined
            );
            onAuditComplete(result);
          } catch (err: any) {
            setError(err?.message || 'Cognitive analysis failed. Verify credentials in Settings.');
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          setError('Internal file system error.');
          setIsUploading(false);
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      setError('Regulatory verification engine timeout.');
      setIsUploading(false);
    }
  };

  if (!canAudit) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-slate-900 rounded-[3rem] border border-slate-800 mt-20">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Privilege Escalation Required</h2>
        <p className="text-slate-400 mt-3 font-medium leading-relaxed max-w-md mx-auto">
          Your current session lacks 'AUDITOR' clearance levels. Request security access flags from your PulseAudit System Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-12 pb-32">
      <div className="bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800/80 p-8 sm:p-12 space-y-12">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tight">
              {existingAudit ? `Iterate Audit Protocol v${existingAudit.version + 1}` : 'Audit Inception'}
            </h2>
            <p className="text-slate-400 font-medium">Verify structural compliance, architectures, diagrams, or policy text against active law vectors.</p>
          </div>
          {existingAudit && (
            <div className="bg-indigo-600/10 border border-indigo-600/30 px-4 py-2 rounded-xl text-xs font-mono font-bold text-indigo-400">
              Target ID: {existingAudit.groupId.toUpperCase()}
            </div>
          )}
        </div>

        {/* Active Custom Blueprint Badge */}
        {activeTemplate && (
          <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-indigo-500/10 border-l border-b border-indigo-500/30 text-[9px] uppercase font-black text-indigo-400 font-mono tracking-wider rounded-bl-xl">
              Template Blueprint Active
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <Clipboard className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1 w-full">
                <h4 className="text-lg font-black text-white">{activeTemplate.name}</h4>
                <p className="text-xs text-slate-400 font-semibold">{activeTemplate.description}</p>
                
                <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-805">
                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-wider block font-mono">Target Checklist (Weighted)</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {activeTemplate.checklist.map((item, i) => (
                        <li key={i}>
                          <span className="font-bold text-slate-200">{item.title}</span>: {item.description}
                          <span className="text-orange-400 font-mono text-[9px] ml-1">({item.weight}x weight)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-805">
                    <span className="text-[10px] text-rose-400 font-black uppercase tracking-wider block font-mono">Required Ingestion Evidence</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {activeTemplate.evidenceRequirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preloaded file notification */}
        {preloadedFileName && (
          <div className="bg-slate-950 border border-green-500/20 rounded-xl p-4 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
              <p className="text-slate-300 font-medium font-mono">
                Symmetric analysis context imported from: <span className="text-green-400 font-bold">{preloadedFileName}</span>
              </p>
            </div>
            {clearPreloads && (
              <button 
                onClick={clearPreloads}
                className="text-slate-500 hover:text-white transition-colors uppercase text-[9px] font-black tracking-wider cursor-pointer"
              >
                Clear Context
              </button>
            )}
          </div>
        )}
        
        <div className="space-y-10">
          
          {/* Section 1: Select Regulatory Vectors */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Target Law Vector</label>
              {framework === 'EU_AI_ACT' && (
                <span className="text-[9px] font-mono font-bold text-green-400 uppercase tracking-widest bg-green-500/15 border border-green-500/20 px-2 py-0.5 rounded-full animate-pulse">
                  ACT IN FORCE: AUG 2, 2026 ROADMAP
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  disabled={!!existingAudit}
                  onClick={() => setFramework(fw.id as ComplianceFrameworkId)}
                  className={`p-6 text-left border rounded-2xl transition-all relative overflow-hidden group select-none ${
                    framework === fw.id 
                      ? 'border-indigo-600 bg-indigo-600/5 ring-1 ring-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.1)]' 
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  } ${existingAudit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-extrabold text-white text-base group-hover:text-indigo-400 transition-colors">{fw.name}</p>
                    <span className="text-[8px] font-mono text-slate-500 font-black tracking-widest bg-slate-800 px-1 py-0.5 rounded uppercase">{fw.id}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2.5 font-semibold leading-relaxed">{fw.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggles: File Upload vs pasted string */}
          <div className="flex border-b border-slate-800 pb-2 gap-4">
            <button 
              onClick={() => setUploadMode('file')}
              className={`pb-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${uploadMode === 'file' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              System File Upload
            </button>
            <button 
              onClick={() => setUploadMode('paste')}
              className={`pb-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${uploadMode === 'paste' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Direct Code / Policy Text Paste
            </button>
          </div>

          {/* Payload Ingestion Container */}
          <div>
            {uploadMode === 'file' ? (
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer relative group ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-500/5 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]' 
                    : file 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700/80 hover:bg-slate-900/10'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.docx,.json,.js,.py,.yaml"
                />
                
                {file ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center border border-green-500/20 shadow-lg shadow-green-500/5">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-white">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-2 font-mono font-bold uppercase tracking-widest">
                        {(file.size / 1024).toFixed(1)} KB | Click to swap payload
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-5 py-6">
                    <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center group-hover:indigo-500 group-hover:scale-110 transition-all border border-slate-700/60 shadow-md">
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">Drag and drop resource files here</p>
                      <p className="text-xs text-slate-400 mt-2 font-semibold">Or click to explore PDF, TXT, DOCX, JSON, YAML files manually</p>
                      <p className="text-[9px] text-slate-600 font-black tracking-widest mt-4 uppercase">Maximum Payload size 15MB</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste system design spec blueprints, architecture outlines, IAM credential templates, legal parameters, or source guidelines directly here for Deep Context auditing..."
                  className="w-full p-6 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-5 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/20 font-bold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleStartAudit}
            disabled={isUploading || (uploadMode === 'file' ? !file : !pastedText.trim())}
            className={`w-full py-5 rounded-2xl font-extrabold text-white text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 cursor-pointer ${
              isUploading || (uploadMode === 'file' ? !file : !pastedText.trim())
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-98'
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Deploying Semantic Intel Vector v{existingAudit ? existingAudit.version + 1 : 1}...</span>
              </>
            ) : (
              <>
                <span>Launch PulseAudit Verification sweep</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditUpload;
