import React, { useState } from 'react';

interface AIModel {
  id: string;
  name: string;
  version: string;
  provider: string;
  type: 'foundation' | 'fine-tuned' | 'custom';
  purpose: string;
  trainingDataSources: string[];
  annex3Classification: 'high-risk' | 'limited-risk' | 'minimal-risk' | 'unclassified';
  article50Applicable: boolean;
  deploymentDate?: string;
}

const ANNEX3_BADGE: Record<string, string> = {
  'high-risk': 'bg-red-500/10 text-red-400 border-red-500/30',
  'limited-risk': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'minimal-risk': 'bg-green-500/10 text-green-400 border-green-500/30',
  'unclassified': 'bg-slate-500/10 text-slate-400 border-slate-500/30'
};

const DEFAULT_MODELS: AIModel[] = [
  {
    id: '1',
    name: 'Credit Scoring Engine',
    version: '2.1.0',
    provider: 'Internal',
    type: 'custom',
    purpose: 'Automated creditworthiness assessment for loan applications',
    trainingDataSources: ['Internal transaction history', 'Bureau data'],
    annex3Classification: 'high-risk',
    article50Applicable: true,
    deploymentDate: '2025-11-01'
  },
  {
    id: '2',
    name: 'Document Classifier',
    version: '1.4.2',
    provider: 'OpenAI',
    type: 'fine-tuned',
    purpose: 'Compliance document classification and routing',
    trainingDataSources: ['Labeled compliance documents', 'Internal audit data'],
    annex3Classification: 'limited-risk',
    article50Applicable: false,
    deploymentDate: '2026-01-15'
  }
];

const AIBom: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>(DEFAULT_MODELS);
  const [showAdd, setShowAdd] = useState(false);
  const [newModel, setNewModel] = useState<Partial<AIModel>>({
    type: 'custom',
    annex3Classification: 'unclassified',
    article50Applicable: false,
    trainingDataSources: []
  });
  const [dataSource, setDataSource] = useState('');

  const handleExportBOM = () => {
    const bom = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        standard: 'EU AI Act — Article 53 Technical Documentation',
        organization: 'PulseAudit'
      },
      models: models.map(m => ({
        ...m,
        euAiActCompliance: {
          annex3Category: m.annex3Classification,
          article50TransparencyRequired: m.article50Applicable,
          fullComplianceDeadline: m.annex3Classification === 'high-risk' ? '2027-12-01' : null,
          transparencyDeadline: m.article50Applicable ? '2026-08-02' : null
        }
      }))
    };
    const blob = new Blob([JSON.stringify(bom, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-bom-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addModel = () => {
    if (!newModel.name || !newModel.provider) return;
    setModels([...models, { ...newModel, id: Date.now().toString() } as AIModel]);
    setNewModel({ type: 'custom', annex3Classification: 'unclassified', article50Applicable: false, trainingDataSources: [] });
    setShowAdd(false);
  };

  const highRiskCount = models.filter(m => m.annex3Classification === 'high-risk').length;
  const article50Count = models.filter(m => m.article50Applicable).length;

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 mb-4">
            EU AI Act — August 2, 2026
          </div>
          <h2 className="text-4xl font-black text-white mb-3">AI Bill of Materials</h2>
          <p className="text-slate-400 font-medium">
            Machine-readable inventory of all AI models in production. Required under Article 53 Technical Documentation.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportBOM}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all"
          >
            Export BOM (JSON)
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all"
          >
            + Add Model
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Models</p>
          <p className="text-4xl font-black text-white">{models.length}</p>
        </div>
        <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Annex III High-Risk</p>
          <p className="text-4xl font-black text-red-400">{highRiskCount}</p>
        </div>
        <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/20">
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Article 50 Required</p>
          <p className="text-4xl font-black text-amber-400">{article50Count}</p>
        </div>
      </div>

      {/* Models List */}
      <div className="space-y-4 mb-8">
        {models.map((model) => (
          <div key={model.id} className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white">{model.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">v{model.version}</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full border uppercase tracking-wider ${ANNEX3_BADGE[model.annex3Classification]}`}>
                    {model.annex3Classification.replace('-', ' ')}
                  </span>
                  {model.article50Applicable && (
                    <span className="text-[10px] font-black px-2 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 uppercase tracking-wider">
                      Art. 50
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{model.purpose}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{model.provider}</p>
                <p className="text-[10px] text-slate-600 mt-1">{model.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Training Data Sources</p>
                <div className="flex flex-wrap gap-2">
                  {model.trainingDataSources.map((src, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-lg font-medium">{src}</span>
                  ))}
                </div>
              </div>
              {model.annex3Classification === 'high-risk' && (
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Compliance Deadlines</p>
                  <div className="space-y-1">
                    {model.article50Applicable && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-amber-400 font-bold">Article 50: Aug 2, 2026</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs text-red-400 font-bold">Full Annex III: Dec 2027</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Model Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-white mb-6">Add AI Model to BOM</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Model Name *</label>
                  <input
                    type="text"
                    value={newModel.name || ''}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    placeholder="e.g. Credit Scoring Engine"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Version</label>
                  <input
                    type="text"
                    value={newModel.version || ''}
                    onChange={(e) => setNewModel({ ...newModel, version: e.target.value })}
                    placeholder="1.0.0"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Provider *</label>
                  <input
                    type="text"
                    value={newModel.provider || ''}
                    onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                    placeholder="e.g. OpenAI, Internal"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Annex III Classification</label>
                  <select
                    value={newModel.annex3Classification}
                    onChange={(e) => setNewModel({ ...newModel, annex3Classification: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="unclassified">Unclassified</option>
                    <option value="minimal-risk">Minimal Risk</option>
                    <option value="limited-risk">Limited Risk</option>
                    <option value="high-risk">High Risk (Annex III)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Purpose / Use Case</label>
                <textarea
                  value={newModel.purpose || ''}
                  onChange={(e) => setNewModel({ ...newModel, purpose: e.target.value })}
                  placeholder="Describe what this AI model does..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Training Data Sources</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && dataSource) {
                        setNewModel({ ...newModel, trainingDataSources: [...(newModel.trainingDataSources || []), dataSource] });
                        setDataSource('');
                      }
                    }}
                    placeholder="Add source and press Enter"
                    className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(newModel.trainingDataSources || []).map((src, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-lg font-medium flex items-center gap-2">
                      {src}
                      <button onClick={() => setNewModel({ ...newModel, trainingDataSources: newModel.trainingDataSources?.filter((_, j) => j !== i) })} className="text-slate-500 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newModel.article50Applicable || false}
                  onChange={(e) => setNewModel({ ...newModel, article50Applicable: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm font-bold text-white">Article 50 transparency obligations apply</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={addModel} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all">
                  Add to BOM
                </button>
                <button onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBom;
