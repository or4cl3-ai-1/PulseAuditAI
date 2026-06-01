import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Database, 
  Upload, 
  Download, 
  Server, 
  Check, 
  Lock, 
  Key, 
  FolderPlus, 
  FileText, 
  AlertCircle, 
  Play, 
  RefreshCw, 
  Trash2,
  HardDrive
} from 'lucide-react';
import { UserRole } from '../types';

interface CloudFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  mimeType: string;
  content: string;
}

interface Bucket {
  name: string;
  region: string;
  files: CloudFile[];
}

interface CloudStorageProps {
  userRole: UserRole;
  onSelectFileForAudit: (fileName: string, fileContent: string) => void;
}

const DEFAULT_BUCKETS: Record<string, Bucket[]> = {
  aws: [
    {
      name: "s3://pulseaudit-compliance-credentials-prod",
      region: "us-east-1",
      files: [
        { id: "aws_1", name: "Corporate_Auth_Policies.pdf", size: "324 KB", uploadedAt: "2026-05-28 14:22", mimeType: "application/pdf", content: "CC6.1 logical access controls enforce rotating tokens every 12 hours. MFA is globally compulsory for all IAM resources." },
        { id: "aws_2", name: "Helios_Medical_AI_Router.json", size: "48 KB", uploadedAt: "2026-05-30 09:12", mimeType: "application/json", content: "Post-market neural monitoring plan active. High-risk healthcare AI router routing patient charts to pediatric care coordinators with data isolation mechanisms." }
      ]
    },
    {
      name: "s3://compliance-legal-vault-raw",
      region: "eu-west-1",
      files: [
        { id: "aws_3", name: "Standard_GDPR_Consent_Wording.txt", size: "12 KB", uploadedAt: "2026-05-15 11:05", mimeType: "text/plain", content: "Under Article 5 and 25 requirements, consent must be freely given, specific, informed, and an unambiguous indication of the data subject's wishes." }
      ]
    }
  ],
  gcp: [
    {
      name: "gs://pulseaudit-gcs-governance-ledger",
      region: "us-central1",
      files: [
        { id: "gcp_1", name: "Incident_Response_Playbook_v4.txt", size: "142 KB", uploadedAt: "2026-05-10 16:45", mimeType: "text/plain", content: "Incident identification initiates a 72-hour regulatory clock. DPO will instantly receive encrypted logs containing system telemetry data." }
      ]
    }
  ],
  azure: [
    {
      name: "blob://pulseauditareashare/legal-exports",
      region: "eastus2",
      files: [
        { id: "azure_1", name: "Data_Retention_Policy_Draft.docx", size: "89 KB", uploadedAt: "2026-05-20 08:30", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", content: "We retain consumer data for a maximum of 30 days after deletion triggers. Storage limits are audited semi-annually under CC8 regulations." }
      ]
    }
  ]
};

export const CloudStorage: React.FC<CloudStorageProps> = ({ userRole, onSelectFileForAudit }) => {
  const [provider, setProvider] = useState<'aws' | 'gcp' | 'azure'>('aws');
  const [buckets, setBuckets] = useState<Record<string, Bucket[]>>(DEFAULT_BUCKETS);
  
  // Connection state
  const [isConnected, setIsConnected] = useState<Record<string, boolean>>({ aws: true, gcp: false, azure: false });
  // Credentials input
  const [creds, setCreds] = useState({
    awsKeyId: 'AKIAIOSFODNN7EXAMPLE',
    awsSecret: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    awsRegion: 'us-east-1',
    gcpProject: 'pulseaudit-saas-prod',
    gcpServiceAccount: '',
    azureConnectionString: '',
  });

  const [showCreds, setShowCreds] = useState(false);
  const [selectedBucketIndex, setSelectedBucketIndex] = useState(0);
  
  // Virtual upload file simulate
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active bucket based on selected index
  const activeBucketList = buckets[provider] || [];
  const activeBucket = activeBucketList[selectedBucketIndex] || null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsConnected(prev => ({ ...prev, [provider]: true }));
      setIsRefreshing(false);
    }, 800);
  };

  const handleDisconnect = () => {
    setIsConnected(prev => ({ ...prev, [provider]: false }));
    setSelectedBucketIndex(0);
  };

  const handleCreateBucket = () => {
    const defaultName = provider === 'aws' ? `s3://new-compliance-bucket-${Math.floor(Math.random() * 9000 + 1000)}`
                      : provider === 'gcp' ? `gs://new-gcs-data-${Math.floor(Math.random() * 9000 + 1000)}`
                      : `blob://newcontainer-${Math.floor(Math.random() * 900 + 100)}`;
    
    const newBucket: Bucket = {
      name: defaultName,
      region: provider === 'aws' ? 'us-east-1' : provider === 'gcp' ? 'us-central1' : 'eastus2',
      files: []
    };

    setBuckets(prev => ({
      ...prev,
      [provider]: [...prev[provider], newBucket]
    }));
    setSelectedBucketIndex(buckets[provider].length);
  };

  const handleVirtualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!newFileName.trim()) {
      setUploadError('Please provide a file name.');
      return;
    }
    if (!newFileContent.trim()) {
      setUploadError('Please provide system or policy content to upload.');
      return;
    }

    setIsSimulatingUpload(true);
    
    setTimeout(() => {
      const newFile: CloudFile = {
        id: `file_${Date.now()}`,
        name: newFileName.endsWith('.txt') || newFileName.endsWith('.json') || newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.txt`,
        size: `${Math.round(newFileContent.length / 1024) || 1} KB`,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        mimeType: newFileName.endsWith('.json') ? 'application/json' : 'text/plain',
        content: newFileContent
      };

      setBuckets(prev => {
        const updatedBuckets = [...prev[provider]];
        if (updatedBuckets[selectedBucketIndex]) {
          updatedBuckets[selectedBucketIndex] = {
            ...updatedBuckets[selectedBucketIndex],
            files: [newFile, ...updatedBuckets[selectedBucketIndex].files]
          };
        }
        return {
          ...prev,
          [provider]: updatedBuckets
        };
      });

      setNewFileName('');
      setNewFileContent('');
      setIsSimulatingUpload(false);
    }, 600);
  };

  const handleDeleteFile = (fileId: string) => {
    setBuckets(prev => {
      const updatedBuckets = [...prev[provider]];
      if (updatedBuckets[selectedBucketIndex]) {
        updatedBuckets[selectedBucketIndex] = {
          ...updatedBuckets[selectedBucketIndex],
          files: updatedBuckets[selectedBucketIndex].files.filter(f => f.id !== fileId)
        };
      }
      return {
        ...prev,
        [provider]: updatedBuckets
      };
    });
  };

  const handleSimulatedDownload = (file: CloudFile) => {
    const element = document.createElement("a");
    const fileContentBlob = new Blob([file.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(fileContentBlob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Reset bucket index on provider switch
  useEffect(() => {
    setSelectedBucketIndex(0);
  }, [provider]);

  // Restrict feature access for Clients
  const canManageCredentials = userRole === UserRole.ADMIN;
  const canManageStorage = userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR;

  if (!canManageStorage) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-slate-900 rounded-[3rem] border border-slate-800 mt-20">
        <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
          <Lock className="w-10 h-10 text-amber-400" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Access Restricted</h2>
        <p className="text-slate-400 mt-3 font-medium leading-relaxed max-w-md mx-auto">
          Cloud integration configurations are restricted to Admin or Auditor sessions. Please consult your PulseAudit engineering contact to set up continuous cloud ingest pipelines.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12 py-12 bg-slate-950 text-white">
      
      {/* Title & Stats */}
      <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/85 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 font-mono">Secure Cloud Storage Pipes</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Active Cloud Connections</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Audit files directly from AWS S3, Google Cloud Storage, or Azure Blob Storage buckets.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={triggerRefresh}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all flex items-center gap-2 font-bold text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Files
          </button>
          <button 
            onClick={handleCreateBucket}
            disabled={!isConnected[provider]}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all disabled:opacity-40 flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            Provision Bucket/Container
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'aws', label: 'AWS S3 Storage', desc: 'Simple Storage Service buckets', color: 'indigo' },
          { key: 'gcp', label: 'Google Cloud Storage', desc: 'GCS Binary Object containers', color: 'emerald' },
          { key: 'azure', label: 'Azure Blob Storage', desc: 'Scale storage blob accounts', color: 'sky' }
        ].map(prov => (
          <button
            key={prov.key}
            onClick={() => setProvider(prov.key as any)}
            className={`p-6 rounded-[2rem] border text-left transition-all ${
              provider === prov.key 
                ? 'bg-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-950/20' 
                : 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center">
                <Database className={`w-5 h-5 ${provider === prov.key ? 'text-indigo-400' : 'text-slate-400'}`} />
              </div>
              {isConnected[prov.key] ? (
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[8px] font-mono font-black uppercase tracking-widest">
                  Live Sync
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[8px] font-mono font-bold uppercase tracking-widest">
                  Disconnected
                </span>
              )}
            </div>
            <h3 className="font-bold text-base text-white">{prov.label}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">{prov.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Credentials Setup */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                Connection Keys
              </h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Configure credential payloads. All parameters are encrypted locally with high-strength security measures.
              </p>
            </div>

            {isConnected[provider] ? (
              <div className="p-5 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Storage Access Authorized</h4>
                    <p className="text-[10px] text-indigo-400 font-mono">Status: Read & Write enabled</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1">
                  <p><span className="text-indigo-400">Target Provider:</span> {provider.toUpperCase()}</p>
                  {provider === 'aws' && <p><span className="text-indigo-400">IAM Key:</span> AKIAIOS...7EX</p>}
                  {provider === 'gcp' && <p><span className="text-indigo-400">Project Workspace:</span> {creds.gcpProject}</p>}
                  {provider === 'azure' && <p><span className="text-indigo-400">Active SAS Token:</span> Connected</p>}
                </div>

                {canManageCredentials ? (
                  <button
                    onClick={handleDisconnect}
                    className="w-full py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Disconnect Integration
                  </button>
                ) : (
                  <p className="text-[9px] text-amber-400/80 font-semibold text-center italic">
                    Modifying credentials restricted to Admins
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleConnect} className="space-y-4">
                {provider === 'aws' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">AWS Access Key ID</label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={creds.awsKeyId}
                          onChange={e => setCreds({...creds, awsKeyId: e.target.value})}
                          placeholder="AKIAIOSFODNN7EXAMPLE"
                          className="w-full bg-slate-950 rounded-xl pl-10 pr-4 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">AWS Secret Access Key</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                        <input
                          type={showCreds ? "text" : "password"}
                          value={creds.awsSecret}
                          onChange={e => setCreds({...creds, awsSecret: e.target.value})}
                          placeholder="Secret Key Value"
                          className="w-full bg-slate-950 rounded-xl pl-10 pr-10 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCreds(!showCreds)}
                          className="text-[10px] absolute right-3.5 top-3.5 text-indigo-400 font-bold"
                        >
                          {showCreds ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Default Region</label>
                      <input
                        type="text"
                        value={creds.awsRegion}
                        onChange={e => setCreds({...creds, awsRegion: e.target.value})}
                        className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white font-mono"
                        required
                      />
                    </div>
                  </>
                )}

                {provider === 'gcp' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">GCP Project ID</label>
                      <input
                        type="text"
                        value={creds.gcpProject}
                        onChange={e => setCreds({...creds, gcpProject: e.target.value})}
                        className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Service Account Key (JSON)</label>
                      <textarea
                        value={creds.gcpServiceAccount}
                        onChange={e => setCreds({...creds, gcpServiceAccount: e.target.value})}
                        placeholder='{ "type": "service_account", ... }'
                        rows={4}
                        className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white font-mono placeholder-slate-700 resize-none"
                        required
                      />
                    </div>
                  </>
                )}

                {provider === 'azure' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Azure SAS Connection String</label>
                    <textarea
                      value={creds.azureConnectionString}
                      onChange={e => setCreds({...creds, azureConnectionString: e.target.value})}
                      placeholder="BlobEndpoint=https://pulseaudit.blob.core.windows.net/;SharedAccessSignature=..."
                      rows={5}
                      className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white font-mono placeholder-slate-700 resize-none"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all"
                >
                  Link Integration
                </button>
              </form>
            )}
          </div>

          {/* Connected Buckets Select */}
          {isConnected[provider] && activeBucketList.length > 0 && (
            <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Select Active Container</h3>
              <div className="space-y-2">
                {activeBucketList.map((buc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedBucketIndex(idx)}
                    className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      selectedBucketIndex === idx
                        ? 'bg-slate-950 border-indigo-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-2">
                      <p className="font-bold text-xs truncate">{buc.name}</p>
                      <p className="text-[9px] font-mono font-bold text-slate-500">Region: {buc.region}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-400/10 text-indigo-400 font-mono text-[9px] font-bold flex-shrink-0">
                      {buc.files.length} items
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column (Takes 2/3 wide): Bucket Assets File Explorer & Ingestion */}
        <div className="lg:col-span-2 space-y-6">

          {/* Virtual File list */}
          <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-905/40 backdrop-blur-sm">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white tracking-tight">
                    {activeBucket ? activeBucket.name : 'Container Inactive'}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">Virtual Storage File Explorer</p>
                </div>
                {activeBucket && (
                  <span className="px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] uppercase font-mono font-black tracking-widest">
                    {activeBucket.region.toUpperCase()} region
                  </span>
                )}
              </div>

              {!isConnected[provider] ? (
                <div className="p-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Integration Offline</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Fill out access codes on the left panel to establish secure row-level telemetry linking and browse live object lists.</p>
                  </div>
                </div>
              ) : !activeBucket ? (
                <div className="p-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                    <HardDrive className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">No active bucket selected</h4>
                    <p className="text-xs text-slate-400 mt-1">Please configure or provision a new object bucket above.</p>
                  </div>
                </div>
              ) : activeBucket.files.length === 0 ? (
                <div className="p-16 text-center space-y-4">
                  <div className="w-14 h-14 bg-slate-950 rounded-full flex items-center justify-center mx-auto text-slate-600 border border-slate-800">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Empty Bucket Workspace</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm mx-auto">There are no files compiled yet in this virtual area. Upload compliance evidence text inputs below to populate the workspace.</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-800/20 border-b border-slate-800/60">
                        <th className="px-6 py-3.5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Object Path</th>
                        <th className="px-6 py-3.5 text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">Weight</th>
                        <th className="px-6 py-3.5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Ingested</th>
                        <th className="px-6 py-3.5 text-[8px] font-black text-slate-500 uppercase tracking-widest text-right">Action Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {activeBucket.files.map((file) => (
                        <tr key={file.id} className="hover:bg-slate-900/40 transition-colors group">
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="truncate max-w-[200px]">
                                <p className="font-bold text-xs text-white truncate">{file.name}</p>
                                <p className="text-[8px] text-slate-500 font-bold tracking-wider font-mono uppercase">{file.mimeType}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-center text-xs font-semibold text-slate-300 font-mono">
                            {file.size}
                          </td>
                          <td className="px-6 py-4.5 text-xs font-semibold text-slate-400 font-mono">
                            {file.uploadedAt}
                          </td>
                          <td className="px-6 py-4.5 text-right space-x-1.5 flex justify-end">
                            <button
                              onClick={() => handleSimulatedDownload(file)}
                              title="Secure Client-Side Download"
                              className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSelectFileForAudit(file.name, file.content)}
                              title="Audit File Immediately"
                              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[9px] font-bold uppercase tracking-wider text-white rounded-md transition-all flex items-center gap-1"
                            >
                              <Play className="w-2.5 h-2.5 fill-white" />
                              Audit Text
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              title="Delete Object"
                              className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-md border border-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Base notice */}
            {activeBucket && (
              <div className="p-6 border-t border-slate-800 bg-slate-950/40 text-slate-400 flex items-center gap-2 text-[10px] font-semibold">
                <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>You can click <b className="text-white">Audit Text</b> to launch standard cognitive AI framework evaluation metrics on that object.</span>
              </div>
            )}
          </div>

          {/* Simulated File Ingester Upload Area */}
          {isConnected[provider] && activeBucket && (
            <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white tracking-tight">Upload New Object Payload</h3>
                <p className="text-xs text-slate-400 font-semibold">Simulate drag-and-drop or write a virtual policy module directly to populate your bucket.</p>
              </div>

              <form onSubmit={handleVirtualUpload} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Destination Object Key (File Name)</label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    placeholder="e.g. AWS_IAM_MFA_Policies.txt"
                    className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Object Body (Compliance Policy Text)</label>
                  <textarea
                    value={newFileContent}
                    onChange={e => setNewFileContent(e.target.value)}
                    placeholder="e.g. SOC2 control statement: Global security policy requires multifactor authentication (MFA) enabled on all engineering accounts with strict token policies..."
                    rows={4}
                    className="w-full bg-slate-950 rounded-xl px-4 py-3 text-xs border border-slate-800 focus:border-indigo-500 text-white leading-relaxed placeholder-slate-700 font-semibold"
                    required
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {uploadError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSimulatingUpload}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-white font-black text-xs uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  {isSimulatingUpload ? "Ingesting..." : "Upload Object Payload"}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
