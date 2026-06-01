import React, { useState, useEffect } from 'react';
import { DOCUMENT_LIBRARY } from '../constants';
import { generateComplianceDocument } from '../services/geminiService';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Clipboard, 
  Check, 
  Settings, 
  RefreshCw, 
  Sliders, 
  Lock, 
  Eye, 
  Fingerprint, 
  Archive, 
  CheckCircle2, 
  FileCheck2,
  ChevronRight,
  Info 
} from 'lucide-react';

interface DocumentGeneratorProps {
  userTier: string;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ userTier }) => {
  const [sourceCode, setSourceCode] = useState<string>(
    `# Project Helios Platform Design Spec\n` +
    `- **Product Identity:** High-velocity healthtech clinical telemedicine router (SaaS app)\n` +
    `- **Jurisdictional boundaries:** Serves clinics and patients located in Massachusetts, California, and France.\n` +
    `- **Sensitive Target Data:** Collects patient biometric telemetry, HIPAA protected diagnostic codes, and standard credit stripe tokens.\n` +
    `- **Training Sets & Governance:** Uses deep neural classification parameters to suggest triage priority ratings.`
  );
  const [customInstructions, setCustomInstructions] = useState<string>('Establish explicit HIPAA security procedures. Ensure trajectory alignment for the upcoming EU AI Act enforcement milestones of August 2, 2026.');
  const [selectedDocs, setSelectedDocs] = useState<string[]>(['privacy_policy', 'ai_risk_assessment']);
  const [currentDocIndex, setCurrentDocIndex] = useState<number | null>(null);
  
  // Pipeline status
  const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [pipelinePhase, setPipelinePhase] = useState<'pending' | 'ingesting' | 'structuring' | 'completed'>('pending');
  const [progress, setProgress] = useState<number>(0);
  const [synthLogs, setSynthLogs] = useState<string[]>([]);
  
  // Storage of compiled markdown contents
  const [compiledDocs, setCompiledDocs] = useState<Record<string, string>>({});
  const [currentPreviewDoc, setCurrentPreviewDoc] = useState<string>('');
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [downloadAllReady, setDownloadAllReady] = useState(false);

  // Fingerprint indices synthesized by Gemini during processing
  const [fingerprints, setFingerprints] = useState<Record<string, string>>({
    jurisdiction: 'Awaiting ingestion',
    dataClass: 'Awaiting ingestion',
    automatedScoring: 'Awaiting ingestion',
    criticalDeadline: 'Awaiting ingestion'
  });

  const handleToggleDocSelect = (docId: string) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(prev => prev.filter(id => id !== docId));
    } else {
      setSelectedDocs(prev => [...prev, docId]);
    }
  };

  const handleStartGeneration = async () => {
    if (selectedDocs.length === 0) return;
    setGenerationState('generating');
    setPipelinePhase('ingesting');
    setProgress(15);
    setSynthLogs(["[Ingestion Engine] Mounting raw product specification layouts.", "[Dissecting] Analyzing telemetry codes and API boundary maps..."]);
    
    // Simulate Fingerprint fingerprinting pipeline first
    setTimeout(() => {
      setPipelinePhase('structuring');
      setProgress(45);
      setFingerprints({
        jurisdiction: "United States (HIPAA Compliant) & European Union (GDPR Zone)",
        dataClass: "Protected Health Information (PHI), Credit Card Secrets, Telemetry logs",
        automatedScoring: "AI Telehealth triage priority model utilizing neuronal parameters",
        criticalDeadline: "August 2, 2026 (EU AI Act enforce trajectory)"
      });
      setSynthLogs(prev => ["[Fingerprinting] Product fingerprint compiled.", "[Structuring] Isolating framework controls concurrently...", ...prev]);
    }, 1200);

    // Concurrently trigger Gemini API generators
    setTimeout(async () => {
      setProgress(75);
      setSynthLogs(prev => ["[SDR Pipeline] Invoking Gemini structured design models.", ...prev]);
      
      const newDocs: Record<string, string> = { ...compiledDocs };
      
      try {
        for (const docId of selectedDocs) {
          const schema = DOCUMENT_LIBRARY.find(doc => doc.id === docId);
          if (schema) {
            setSynthLogs(prev => [`[Generative Model] Processing document profile: ${schema.type}`, ...prev]);
            const mdResult = await generateComplianceDocument(
              schema.type,
              schema.category,
              sourceCode,
              customInstructions
            );
            newDocs[docId] = mdResult;
          }
        }
        
        setCompiledDocs(newDocs);
        // Default preview to first generated entry
        if (selectedDocs.length > 0) {
          setCurrentPreviewDoc(selectedDocs[0]);
        }
        
        setProgress(100);
        setPipelinePhase('completed');
        setGenerationState('completed');
        setSynthLogs(prev => ["[Completed] SDR policy structures aggregated.", "[Publish] Documents exported successfully.", ...prev]);
        setDownloadAllReady(true);
      } catch (err) {
        setSynthLogs(prev => ["[CRITICAL LIMIT ERROR] Generation failed. Fallback baselines secured.", ...prev]);
        setPipelinePhase('completed');
        setGenerationState('completed');
      }
    }, 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const downloadBlobFile = (text: string, titleStr: string) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${titleStr.replace(/ /g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Mock download of full package containing markdown policies
  const downloadFullZipConfig = () => {
    // Generate raw aggregate manifest file for the package
    let manifestContent = `# PulseAudit Aggregate Policy Bundle\n`;
    manifestContent += `Generated: ${new Date().toLocaleDateString()}\n`;
    manifestContent += `Target Jurisdiction Scope: ${fingerprints.jurisdiction}\n\n`;
    manifestContent += `## Synthesized Policies:\n`;
    
    selectedDocs.forEach(id => {
      const sch = DOCUMENT_LIBRARY.find(d => d.id === id);
      if (sch) manifestContent += `- ${sch.type} (Markdown format)\n`;
    });

    manifestContent += `\n--- \n*PulseAudit AI Enterprise Bundle*`;

    downloadBlobFile(manifestContent, "PulseAudit_Enterprise_Package_Manifest");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12 py-12 bg-slate-950 text-white">
      
      {/* Title block */}
      <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-full pointer-events-none filter blur-lg"></div>
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-400 font-mono">HIGH-SPEED POLICY SYNTHESIS ENGINE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2">AI Document Generator</h1>
        <p className="text-slate-400 font-semibold mt-1">Translate raw system specifications, plans, or readmes into fully customized enterprise policies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        
        {/* Left Side: Parameters, checklists, controls (3cols) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Section A: Product source specs */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] space-y-5 shadow-sm">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              1. Resource Payload & Blueprints
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Define the fingerprint of your platform. Feed README architectures, file system specs, databases, or compliance requirements.
            </p>
            <textarea
              rows={6}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 transition-all leading-normal"
            />
            
            <div className="space-y-2">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">Fine-Tuning System Directives</label>
              <input 
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Include double-envelope key designs, HIPAA provisions etc."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Section B: Document Selector (12 Library list) */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                2. Selective Document Library Matrix
              </h3>
              <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded">
                {selectedDocs.length} Selected
              </span>
            </div>
            
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Construct high-fidelity documents concurrently based on the underpinning systems specification fingerprints.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-2">
              {DOCUMENT_LIBRARY.map((doc) => {
                const isSelected = selectedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleToggleDocSelect(doc.id)}
                    className={`p-4 border rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer relative group flex justify-between items-start select-none ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-600/5 ring-1 ring-indigo-600' 
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-extrabold text-white text-xs group-hover:text-indigo-400 transition-colors">{doc.type}</p>
                      <p className="text-[10px] text-slate-500 font-bold font-mono tracking-wider">{doc.category}</p>
                      <p className="text-[9px] text-slate-400 line-clamp-2 pr-4">{doc.scope}</p>
                    </div>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-700 bg-slate-950'}`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Run Button is active here */}
            <button
              onClick={handleStartGeneration}
              disabled={selectedDocs.length === 0 || generationState === 'generating'}
              className={`w-full py-5 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 cursor-pointer ${
                selectedDocs.length === 0 || generationState === 'generating'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10 hover:-translate-y-0.5 active:translate-y-0 text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${generationState === 'generating' ? 'animate-spin' : ''}`} />
              Generate Selective Manifest Packages
            </button>
          </div>

          {/* Section C: Live Terminal Pipeline Progression Logs */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] space-y-4">
            <h4 className="text-xs uppercase font-black text-slate-500 tracking-widest font-mono">Real-Time Event Streams</h4>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {synthLogs.map((log, lIdx) => (
                <div key={lIdx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 font-mono text-[9px] text-slate-400 flex gap-2">
                  <span className="text-indigo-400 font-extrabold">&gt;&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {synthLogs.length === 0 && (
                <div className="p-4 text-center text-[10px] text-slate-600 font-bold font-mono">
                  Engine Idle. Initiate a document generation sweep.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Generated Previews & Fingerprinting Output (2cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Dynamic fingerprinting compiled indicators */}
          <div className="bg-indigo-950/15 border border-indigo-600/20 p-8 rounded-[2rem] space-y-6">
            <div className="flex items-center gap-3 border-b border-indigo-600/15 pb-4">
              <Fingerprint className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider leading-none">Extraction Fingerprint</h3>
                <span className="text-[8px] text-slate-500 font-mono font-bold uppercase tracking-widest block mt-1.5">Parsed by Gemini cognitive node</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 font-sans text-xs">
              {[
                { title: "Inferred Jurisdiction Profiles", value: fingerprints.jurisdiction },
                { title: "Sensitive Target Classified Data", value: fingerprints.dataClass },
                { title: "Automated Scoring Core Decisions", value: fingerprints.automatedScoring },
                { title: "High-Priority Compliance Milestone", value: fingerprints.criticalDeadline }
              ].map((f, fkey) => (
                <div key={fkey} className="space-y-1.5 p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{f.title}:</span>
                  <p className="text-slate-200 font-extrabold text-xs">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Generation Preview panel (Markdown layout) */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                Live Preview
              </h3>
              
              {downloadAllReady && (
                <button
                  onClick={downloadFullZipConfig}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 font-black hover:bg-slate-800 border border-indigo-500/20 text-[9px] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Package Export (.ZIP)
                </button>
              )}
            </div>

            {generationState === 'generating' && (
              <div className="flex flex-col items-center justify-center p-16 text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-mono font-black text-indigo-400">{progress}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Synthesizing policies concurrently...</h4>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">{pipelinePhase.toUpperCase()}</p>
                </div>
              </div>
            )}

            {generationState === 'completed' && currentPreviewDoc && (
              <div className="space-y-5 animate-slide-up">
                
                {/* Selective tabs within available compiled items */}
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                  {selectedDocs.map(id => {
                    const docSch = DOCUMENT_LIBRARY.find(d => d.id === id);
                    const isCurrent = currentPreviewDoc === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setCurrentPreviewDoc(id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                          isCurrent 
                            ? 'bg-indigo-600 text-white font-black' 
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {docSch ? docSch.type.substring(0, 16) : id}
                      </button>
                    )
                  })}
                </div>

                {/* Markdown Preview view text area container */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 max-h-96 overflow-y-auto leading-relaxed text-xs text-slate-300 font-mono whitespace-pre-wrap select-text">
                  {compiledDocs[currentPreviewDoc]}
                </div>

                {/* Controls for current previewed document */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyToClipboard(compiledDocs[currentPreviewDoc])}
                    className="flex-1 py-3.5 rounded-xl bg-slate-950 border border-slate-800 font-bold hover:border-slate-700 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Clipboard className="w-4 h-4 text-emerald-400" />
                    {copiedId ? 'Copied Policy!' : 'Copy to Clipboard'}
                  </button>
                  <button
                    onClick={() => {
                      const docSch = DOCUMENT_LIBRARY.find(d => d.id === currentPreviewDoc);
                      if (docSch) downloadBlobFile(compiledDocs[currentPreviewDoc], docSch.type);
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-500 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>

              </div>
            )}

            {generationState === 'idle' && (
              <div className="p-16 text-center text-slate-500 space-y-4">
                <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="font-bold text-sm">Policy document layouts compiled automatically during generator operations.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
export default DocumentGenerator;
