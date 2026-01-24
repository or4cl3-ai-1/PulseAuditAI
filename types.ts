
export enum UserTier {
  FREE = 'FREE',
  PRO_MONTHLY = 'PRO_MONTHLY',
  PRO_ANNUAL = 'PRO_ANNUAL',
  LIFETIME = 'LIFETIME'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  AUDITOR = 'AUDITOR',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  role: UserRole;
  createdAt: Date;
  referralCode?: string;
}

export interface ComplianceAudit {
  id: string;
  groupId: string; // Used to group versions of the same document
  version: number;
  userId: string;
  fileName: string;
  fileType: string;
  framework: 'SOC2' | 'HIPAA' | 'GDPR' | 'PRIVACY';
  timestamp: Date;
  score: number;
  summary: string;
  findings: Finding[];
  riskAnalysis: RiskMetric[];
}

export interface Finding {
  severity: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  recommendation: string;
}

export interface RiskMetric {
  label: string;
  value: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
