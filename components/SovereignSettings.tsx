import React, { useState } from 'react';

interface SovereignSettingsProps {
  onSave: (config: SovereignConfig) => void;
  currentConfig?: SovereignConfig;
}

export interface SovereignConfig {
  enabled: boolean;
  storageType: 'local' | 's3' | 'gcs' | 'azure';
  endpoint?: string;
  bucket?: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
}

const SovereignSettings: React.FC<SovereignSettingsProps> = ({ onSave, currentConfig }) => {
  const [config, setConfig] = useState<SovereignConfig>(currentConfig || {
    enabled: false,
    storageType: 'local'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="mb-6 sm:mb-10">
        <h2 className="text-4xl font-black text-white mb-3">Sovereign Mode</h2>
        <p className="text-slate-400 font-medium">
          Keep sensitive audit logs within your infrastructure. Zero secondary data egress.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Enable Toggle */}
        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Enable Sovereign Mode</h3>
              <p className="text-sm text-slate-400">Route all audit logs to your own storage infrastructure</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
            </div>
          </label>
        </div>

        {config.enabled && (
          <>
            {/* Storage Type */}
            <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800">
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
                Storage Provider
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['local', 's3', 'gcs', 'azure'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setConfig({ ...config, storageType: type })}
                    className={`p-6 rounded-2xl border-2 transition-all font-bold text-sm uppercase tracking-wider ${
                      config.storageType === type
                        ? 'border-indigo-600 bg-indigo-600/10 text-indigo-400'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {type === 's3' && '☁️ AWS S3'}
                    {type === 'gcs' && '☁️ GCS'}
                    {type === 'azure' && '☁️ Azure'}
                    {type === 'local' && '💾 Local'}
                  </button>
                ))}
              </div>
            </div>

            {/* S3 Config */}
            {config.storageType === 's3' && (
              <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white">AWS S3 Configuration</h3>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Bucket Name
                  </label>
                  <input
                    type="text"
                    value={config.bucket || ''}
                    onChange={(e) => setConfig({ ...config, bucket: e.target.value })}
                    placeholder="pulseaudit-logs-prod"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={config.region || ''}
                    onChange={(e) => setConfig({ ...config, region: e.target.value })}
                    placeholder="us-east-1"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Access Key ID
                    </label>
                    <input
                      type="password"
                      value={config.accessKey || ''}
                      onChange={(e) => setConfig({ ...config, accessKey: e.target.value })}
                      placeholder="AKI••••••••"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Secret Access Key
                    </label>
                    <input
                      type="password"
                      value={config.secretKey || ''}
                      onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GCS Config */}
            {config.storageType === 'gcs' && (
              <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white">Google Cloud Storage Configuration</h3>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Bucket Name
                  </label>
                  <input
                    type="text"
                    value={config.bucket || ''}
                    onChange={(e) => setConfig({ ...config, bucket: e.target.value })}
                    placeholder="pulseaudit-logs"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Azure Config */}
            {config.storageType === 'azure' && (
              <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white">Azure Blob Storage Configuration</h3>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Container Name
                  </label>
                  <input
                    type="text"
                    value={config.bucket || ''}
                    onChange={(e) => setConfig({ ...config, bucket: e.target.value })}
                    placeholder="pulseaudit-logs"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default SovereignSettings;
