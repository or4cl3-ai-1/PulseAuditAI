export enum UserTier {
  FREE = 'FREE',
  PRO_MONTHLY = 'PRO_MONTHLY',
  PRO_ANNUAL = 'PRO_ANNUAL',
  LIFETIME = 'LIFETIME'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  AUDITOR = 'AUDITOR',
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  role: UserRole;
  createdAt: Date;
  referralCode?: string;
  companyName?: string; // For Client company constraints
}

export interface TemplateChecklistItem {
  id: string;
  text: string;
  citation: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface AuditTemplate {
  id: string;
  name: string;
  description: string;
  framework: ComplianceFrameworkId;
  checklists: TemplateChecklistItem[];
  scoringCriteria: {
    passThreshold: number;
    criticalWeight: number;
    highWeight: number;
    mediumWeight: number;
  };
  evidenceRequirements: string[];
  isCustom?: boolean;
}

export type ComplianceFrameworkId = 'SOC2' | 'HIPAA' | 'GDPR' | 'PRIVACY' | 'EU_AI_ACT' | 'CUSTOM';

export interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  citation: string;
  remediation: string;
  status: 'pending' | 'remediating' | 'resolved';
}

export interface RiskMetric {
  label: string;
  value: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeline: string;
}

export interface ComplianceAudit {
  id: string;
  groupId: string; // Used to group versions of the same document
  version: number;
  userId: string;
  fileName: string;
  fileType: string;
  framework: ComplianceFrameworkId;
  timestamp: Date;
  score: number;
  summary: string;
  findings: Finding[];
  riskAnalysis: RiskMetric[]; // Visualizes domain-specific risk matrix (Access Control, Encryption, etc.)
  roadmap: RoadmapItem[];      // Mapped chronologically by impact and effort
  executiveBriefing: string;  // 2-3 paragraph executive narrative
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Interfaces for document generator
export interface GeneratedDocument {
  id: string;
  type: string;
  title: string;
  targetFramework: string;
  scope: string;
  status: 'pending' | 'ingesting' | 'structuring' | 'completed';
  content?: string; // Markdown text
}
