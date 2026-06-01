import React, { useState } from 'react';
import { 
  Clipboard, 
  Plus, 
  Trash2, 
  Sliders, 
  FileText, 
  CheckSquare, 
  X, 
  ArrowRight, 
  Save, 
  Copy, 
  PlusCircle, 
  ShieldCheck, 
  Info,
  Layers,
  Settings,
  Flame,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { AuditTemplate, ComplianceFrameworkId, TemplateChecklistItem, UserRole } from '../types';
import { FRAMEWORKS } from '../constants';

interface AuditTemplatesProps {
  userRole: UserRole;
  onApplyTemplate: (template: AuditTemplate) => void;
  savedTemplates: AuditTemplate[];
  onChangeTemplates: (templates: AuditTemplate[]) => void;
}

export const PRESET_TEMPLATES: AuditTemplate[] = [
  {
    id: "tpl_soc2_logical",
    name: "SOC 2 CC6 Security controls & Logical Access",
    description: "Evaluates production multi-tenant authentication patterns, identity rotates, credential lifetimes, and password entropy rules.",
    framework: "SOC2",
    checklists: [
      { id: "ch_s1", text: "Multi-factor authentication (MFA) is globally enforced for all privileged users.", citation: "SOC 2 CC6.1 & CC6.3", severity: "critical" },
      { id: "ch_s2", text: "Identity sessions expire and force sign-out rotations after a maximum of 12 hours.", citation: "SOC 2 CC6.1", severity: "medium" },
      { id: "ch_s3", text: "Cryptographic keys at-rest are securely rotated annually via KMS key guidelines.", citation: "SOC 2 CC6.2", severity: "high" },
      { id: "ch_s4", text: "API gateways log and block anomalous ingress traffic exceeding safe rate parameters.", citation: "SOC 2 CC6.5 & CC6.6", severity: "high" }
    ],
    scoringCriteria: {
      passThreshold: 85,
      criticalWeight: 15,
      highWeight: 8,
      mediumWeight: 4
    },
    evidenceRequirements: [
      "KMS Key Rotator Settings (JSON config payload code template)",
      "VPC Security Group rules screenshot proving TLS 1.3 requirements",
      "IAM MFA compulsory enforcement statement"
    ]
  },
  {
    id: "tpl_eu_ai_high",
    name: "EU AI Act Art 9 & Art 27 High-Risk Protocol",
    description: "Evaluates high-impact cognitive models, pediatric medical classifiers, and automated scoring systems against EU AI Act milestones.",
    framework: "EU_AI_ACT",
    checklists: [
      { id: "ch_e1", text: "Model contains automatic drift telemetry metrics to gauge and fix model calibration decay.", citation: "EU AI Act Art 61", severity: "critical" },
      { id: "ch_e2", text: "Supervisor physical override gates are required before dispatching AI decisions.", citation: "EU AI Act Art 14", severity: "high" },
      { id: "ch_e3", text: "Model card metrics explicitly document training sets data classifications & source biases.", citation: "EU AI Act Art 11 & Annex IV", severity: "medium" },
      { id: "ch_e4", text: "All neural pipeline API loops are verified safe against token-injection attacks.", citation: "EU AI Act Title V Obligations", severity: "high" }
    ],
    scoringCriteria: {
      passThreshold: 80,
      criticalWeight: 20,
      highWeight: 10,
      mediumWeight: 5
    },
    evidenceRequirements: [
      "Art 35 Fundamental Rights Impact Assessment (FRIA) document",
      "Telemetry neural drift prometheus metric rules screenshots",
      "Human-in-the-loop audit protocol workflow layout diagram"
    ]
  },
  {
    id: "tpl_gdpr_defaults",
    name: "GDPR Article 25 Privacy by Design Baseline",
    description: "Evaluates storage limitations, revocable cookies assent, Article 35 processing safety, and 72-hour breaches notify streams.",
    framework: "GDPR",
    checklists: [
      { id: "ch_g1", text: "Data is actively minimized and restricted from secondary data profiling runs.", citation: "GDPR Article 5 & Article 25", severity: "critical" },
      { id: "ch_g2", text: "Data subjects can trigger irreversible erasure ('Right to be Forgotten') programmatically.", citation: "GDPR Article 17 obligations", severity: "critical" },
      { id: "ch_g3", text: "DPO holds functional authority with executive reporting metrics directly.", citation: "GDPR Article 37 requirements", severity: "medium" },
      { id: "ch_g4", text: "Incident response rules trigger automated countdown notifications within 72 hours of breaches.", citation: "GDPR Article 33 guidelines", severity: "high" }
    ],
    scoringCriteria: {
      passThreshold: 90,
      criticalWeight: 18,
      highWeight: 9,
      mediumWeight: 3
    },
    evidenceRequirements: [
      "Article 35 DPIA raw report",
      "Erasure microservice query codebase snippets or DB rules",
      "Automated Incident Response Notification script layout"
    ]
  }
];

export const AuditTemplates: React.FC<AuditTemplatesProps> = ({ 
  userRole, 
  onApplyTemplate, 
  savedTemplates, 
  onChangeTemplates 
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  
  // Editor mode state
  const [editingTemplate, setEditingTemplate] = useState<AuditTemplate | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<ComplianceFrameworkId>('SOC2');
  const [checklists, setChecklists] = useState<TemplateChecklistItem[]>([]);
  const [passThreshold, setPassThreshold] = useState(80);
  const [criticalWeight, setCriticalWeight] = useState(15);
  const [highWeight, setHighWeight] = useState(8);
  const [mediumWeight, setMediumWeight] = useState(4);
  const [evidence, setEvidence] = useState<string[]>([]);

  // Helpers for editing checklists/evidence
  const [newCheckItemText, setNewCheckItemText] = useState('');
  const [newCheckItemCitation, setNewCheckItemCitation] = useState('');
  const [newCheckItemSeverity, setNewCheckItemSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [newEvidenceReq, setNewEvidenceReq] = useState('');

  const canEdit = userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR;

  const handleEditStart = (tmpl: AuditTemplate, isNewFlag = false) => {
    setEditingTemplate(tmpl);
    setIsNew(isNewFlag);
    setName(tmpl.name);
    setDescription(tmpl.description);
    setFramework(tmpl.framework);
    setChecklists([...tmpl.checklists]);
    setPassThreshold(tmpl.scoringCriteria.passThreshold);
    setCriticalWeight(tmpl.scoringCriteria.criticalWeight);
    setHighWeight(tmpl.scoringCriteria.highWeight);
    setMediumWeight(tmpl.scoringCriteria.mediumWeight);
    setEvidence([...tmpl.evidenceRequirements]);
    
    // reset draft fields
    setNewCheckItemText('');
    setNewCheckItemCitation('');
    setNewCheckItemSeverity('high');
    setNewEvidenceReq('');
  };

  const handleCreateNew = () => {
    const blank: AuditTemplate = {
      id: `tpl_custom_${Date.now()}`,
      name: "Untitled Customizable Template",
      description: "Custom compliance criteria suite mapped specifically for internal regulations.",
      framework: "CUSTOM",
      checklists: [],
      scoringCriteria: {
        passThreshold: 80,
        criticalWeight: 15,
        highWeight: 8,
        mediumWeight: 4
      },
      evidenceRequirements: [],
      isCustom: true
    };
    handleEditStart(blank, true);
  };

  const handleClonePreset = (preset: AuditTemplate) => {
    const cloned: AuditTemplate = {
      ...preset,
      id: `tpl_cloned_${Date.now()}`,
      name: `${preset.name} (Copy)`,
      isCustom: true
    };
    handleEditStart(cloned, true);
  };

  const handleAddChecklist = () => {
    if (!newCheckItemText.trim()) return;
    const newItem: TemplateChecklistItem = {
      id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: newCheckItemText,
      citation: newCheckItemCitation || "Custom Reference",
      severity: newCheckItemSeverity
    };
    setChecklists([...checklists, newItem]);
    setNewCheckItemText('');
    setNewCheckItemCitation('');
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklists(checklists.filter(c => c.id !== id));
  };

  const handleAddEvidence = () => {
    if (!newEvidenceReq.trim()) return;
    setEvidence([...evidence, newEvidenceReq]);
    setNewEvidenceReq('');
  };

  const handleRemoveEvidence = (idx: number) => {
    setEvidence(evidence.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const saved: AuditTemplate = {
      id: editingTemplate?.id || `tpl_custom_${Date.now()}`,
      name,
      description,
      framework,
      checklists,
      scoringCriteria: {
        passThreshold,
        criticalWeight,
        highWeight,
        mediumWeight
      },
      evidenceRequirements: evidence,
      isCustom: true
    };

    let updatedList: AuditTemplate[];
    if (isNew) {
      updatedList = [...savedTemplates, saved];
    } else {
      updatedList = savedTemplates.map(t => t.id === saved.id ? saved : t);
    }

    onChangeTemplates(updatedList);
    setEditingTemplate(null);
  };

  const handleDelete = (id: string) => {
    const filtered = savedTemplates.filter(t => t.id !== id);
    onChangeTemplates(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12 py-12 bg-slate-950 text-white">
      
      {/* Editorial Title banner */}
      <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/85 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clipboard className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 font-mono">Custom Governance Blueprints</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Compliance Templates</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Design checklists, customize weights, and dictate explicit evidence verification maps.</p>
        </div>
        
        {canEdit && !editingTemplate && (
          <button 
            onClick={handleCreateNew}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Custom Template
          </button>
        )}
      </div>

      {editingTemplate ? (
        /* ==================== EDITOR WORKSPACE ==================== */
        <div className="bg-slate-900 rounded-[3rem] border border-slate-800/80 p-8 sm:p-12 space-y-10 shadow-2xl relative">
          <button 
            onClick={() => setEditingTemplate(null)}
            className="absolute top-8 right-8 text-slate-500 hover:text-white p-2 bg-slate-950 rounded-full border border-slate-850/60"
          >
            <X className="w-5 h-5"/>
          </button>

          <div className="space-y-1 pb-4 border-b border-slate-800/80">
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 font-mono">
              {isNew ? 'New Custom Architecture' : 'Modify Core Blueprint'}
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">Template Builder Panel</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Column 1: Core Definitions & Ratios */}
            <div className="space-y-6">
              
              {/* Box: Details */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-6 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full"></span>
                  1. Template Classification
                </h3>
                
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Template Identifier Label</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="e.g. Critical Storage HIPAA Guard" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Corporate Description & Mandate</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Provide description..." 
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Target Legal Framework</label>
                  <select 
                    value={framework} 
                    onChange={e => setFramework(e.target.value as any)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-indigo-400 font-bold"
                  >
                    {FRAMEWORKS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Box: Scoring Adjustments */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    2. Score Multiplier Metrics
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">Configure penalty weights subtracted from base posture index (out of 100).</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold">
                      <span className="text-slate-400">PASS CRITERIA THRESHOLD:</span>
                      <span className="text-green-400">{passThreshold}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="95" 
                      value={passThreshold} 
                      onChange={e => setPassThreshold(Number(e.target.value))} 
                      className="w-full accent-indigo-500 cursor-pointer text-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/40">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-slate-500 font-mono">Critical Weight</label>
                      <input 
                        type="number" 
                        value={criticalWeight} 
                        onChange={e => setCriticalWeight(Number(e.target.value))} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-rose-400 font-mono font-bold text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-slate-500 font-mono">High Weight</label>
                      <input 
                        type="number" 
                        value={highWeight} 
                        onChange={e => setHighWeight(Number(e.target.value))} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-orange-400 font-mono font-bold text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-slate-500 font-mono">Medium Weight</label>
                      <input 
                        type="number" 
                        value={mediumWeight} 
                        onChange={e => setMediumWeight(Number(e.target.value))} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-amber-400 font-mono font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Box: Evidence Requirements */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    3. Proof Evidence Verification Sets
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">Enforce specific document configurations required before initiating compliance checks.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newEvidenceReq} 
                      onChange={e => setNewEvidenceReq(e.target.value)} 
                      placeholder="e.g. AWS Security Hub Audit PDF" 
                      className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-700"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddEvidence}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold rounded-xl transition-all"
                    >
                      Add Code/Rule
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {evidence.map((ev, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 text-xs flex items-center justify-between">
                        <span className="font-semibold text-slate-300 truncate pr-2">{ev}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveEvidence(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1 bg-slate-950 rounded border border-rose-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {evidence.length === 0 && (
                      <p className="text-[10px] text-slate-600 font-bold text-center py-4">No evidence locks active yet.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Column 2: Specific Checklists items Creator */}
            <div className="bg-slate-950 rounded-[2rem] border border-slate-800/80 p-8 space-y-6">
              <div>
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-400" />
                  4. Rule Assertions & Checklists ({checklists.length})
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Specify regulatory checks that the auditing engine will verify against loaded policy assets.</p>
              </div>

              {/* Add checklist box */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Assert Rule Description</label>
                  <input 
                    type="text" 
                    value={newCheckItemText} 
                    onChange={e => setNewCheckItemText(e.target.value)} 
                    placeholder="e.g. Identity provider sessions automatically sign out after 15 mins." 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Law Citation</label>
                    <input 
                      type="text" 
                      value={newCheckItemCitation} 
                      onChange={e => setNewCheckItemCitation(e.target.value)} 
                      placeholder="e.g. SOC 2 CC6.1" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-indigo-400 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Severity Level</label>
                    <select 
                      value={newCheckItemSeverity} 
                      onChange={e => setNewCheckItemSeverity(e.target.value as any)} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      <option value="critical">Critical (penalty weight)</option>
                      <option value="high">High (penalty weight)</option>
                      <option value="medium">Medium (penalty weight)</option>
                      <option value="low">Low (low penalty)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleAddChecklist}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Append Rule to Template
                </button>
              </div>

              {/* Show items list */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {checklists.map((chk, index) => (
                  <div key={chk.id} className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-1 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black text-slate-500">#{index+1}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-mono font-black border ${
                          chk.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          chk.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {chk.severity}
                        </span>
                        <span className="text-[10px] text-indigo-400 font-bold font-mono tracking-wide">{chk.citation}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300 whitespace-normal leading-relaxed">{chk.text}</p>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => handleRemoveChecklist(chk.id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 bg-slate-950 rounded border border-rose-900/10 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {checklists.length === 0 && (
                  <div className="p-12 text-center text-slate-600 border border-dashed border-slate-850 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase">No rules specified</p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-8 border-t border-slate-850 flex justify-between">
            <button 
              type="button" 
              onClick={() => setEditingTemplate(null)}
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-400 border border-slate-800 transition-all"
            >
              Cancel Adjustments
            </button>
            <button 
              type="button" 
              onClick={handleSave}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Compile & Save Template
            </button>
          </div>

        </div>
      ) : (
        /* ==================== SELECTOR VIEWS ==================== */
        <div className="space-y-8">
          
          {/* Toggle Tabs */}
          <div className="flex border-b border-slate-800 pb-1 gap-6">
            <button
              onClick={() => setActiveTab('presets')}
              className={`text-sm font-bold pb-4 border-b-2 transition-all ${activeTab === 'presets' ? 'text-indigo-400 border-indigo-500 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              System Default Blueprints ({PRESET_TEMPLATES.length})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`text-sm font-bold pb-4 border-b-2 transition-all ${activeTab === 'custom' ? 'text-indigo-400 border-indigo-500 font-black' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              Custom Templates ({savedTemplates.length})
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeTab === 'presets' ? (
              PRESET_TEMPLATES.map((tmpl) => (
                <div 
                  key={tmpl.id} 
                  className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between group h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 bg-slate-950 rounded-lg text-[9px] font-mono font-black border border-slate-800 text-indigo-400">
                        {tmpl.framework} STANDARD
                      </span>
                      <span className="text-[10px] font-mono font-bold text-green-400 bg-green-500/5 px-2 py-0.5 rounded">
                        Threshold: {tmpl.scoringCriteria.passThreshold}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Miniature Checklist preview */}
                    <div className="py-4 border-t border-b border-slate-800/80 space-y-2">
                      <p className="text-[9px] uppercase font-black tracking-wider text-slate-500">Active Rule Verification Matrix ({tmpl.checklists.length} items):</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {tmpl.checklists.slice(0, 3).map((chk) => (
                          <div key={chk.id} className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                            <span className="truncate flex-1">{chk.text}</span>
                            <span className="text-[8px] font-mono font-black uppercase text-slate-500 shrink-0">{chk.citation.split('&')[0].trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Penalties: CR={tmpl.scoringCriteria.criticalWeight} HP={tmpl.scoringCriteria.highWeight}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {canEdit && (
                        <button 
                          onClick={() => handleClonePreset(tmpl)}
                          className="px-3 py-2 bg-slate-950 border border-slate-800/80 hover:bg-slate-900 rounded-lg text-[10px] font-bold text-white transition-all flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Clone
                        </button>
                      )}
                      <button 
                        onClick={() => onApplyTemplate(tmpl)}
                        className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-wider text-white transition-all hover:scale-102 flex items-center gap-1"
                      >
                        Apply Template
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Custom template list card */
              savedTemplates.map((tmpl) => (
                <div 
                  key={tmpl.id} 
                  className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between group h-full relative"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 bg-slate-950 rounded-lg text-[9px] font-mono font-black border border-slate-800 text-indigo-400">
                        {tmpl.framework} CUSTOM BLUEPRINT
                      </span>
                      <span className="text-[10px] font-mono font-bold text-green-400 bg-green-500/5 px-2 py-0.5 rounded">
                        Threshold: {tmpl.scoringCriteria.passThreshold}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Miniature Checklist preview */}
                    <div className="py-4 border-t border-b border-slate-800/80 space-y-2">
                      <p className="text-[9px] uppercase font-bold text-slate-500 font-mono">Assigned Rules ({tmpl.checklists.length}):</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {tmpl.checklists.slice(0, 3).map((chk) => (
                          <div key={chk.id} className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                            <span className="truncate flex-1">{chk.text}</span>
                            <span className="text-[8px] font-mono font-bold uppercase text-slate-500">{chk.citation}</span>
                          </div>
                        ))}
                        {tmpl.checklists.length === 0 && (
                          <p className="text-[10px] text-slate-600 font-semibold italic">No checks loaded inside template yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800/60">
                    {canEdit ? (
                      <button 
                        onClick={() => handleDelete(tmpl.id)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Trash
                      </button>
                    ) : <div className="text-[9px] text-slate-600 font-bold uppercase">View Only Mode</div>}
                    
                    <div className="flex gap-2">
                      {canEdit && (
                        <button 
                          onClick={() => handleEditStart(tmpl, false)}
                          className="px-3.5 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 rounded-lg text-[10px] font-bold text-indigo-400 transition-all flex items-center gap-1.5"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Modify Rules
                        </button>
                      )}
                      <button 
                        onClick={() => onApplyTemplate(tmpl)}
                        className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-wider text-white transition-all hover:scale-102 flex items-center gap-1"
                      >
                        Apply Template
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {activeTab === 'custom' && savedTemplates.length === 0 && (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-[2rem] p-12 text-center lg:col-span-2 space-y-4">
                <Clipboard className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="font-bold text-white text-base">No Custom Blueprints Formulated</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Establish a customized sequence of compliance checks matching unique organizational objectives and security mandates perfectly.
                </p>
                {canEdit && (
                  <button 
                    onClick={handleCreateNew}
                    className="mt-2 text-indigo-400 hover:text-indigo-300 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto"
                  >
                    Create Core Template Now <ChevronRight className="w-4 h-4"/>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
