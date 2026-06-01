import { UserTier } from './types';

export const APP_NAME = "PulseAudit AI";

// Simulated domain-specific embeddings corpus (Regulatory Snippets)
export const REGULATORY_CONTEXT = {
  EU_AI_ACT: `The European Union Artificial Intelligence Act (EU AI Act) classifies AI systems by risk: Unacceptable risk (banned), High risk (Art 9 & 27), Transparency risk (Art 13 & 50), and Minimal risk. 
Key requirements:
- Art 9 & 27: Implement an exhaustive Risk Management System and Fundamental Rights Impact Assessments (FRIA).
- Art 11 & Annex IV: Detailed Technical Documentation demonstrating compliance before placing in the market.
- Art 13: Clear transparency to users for systems interacting with humans (chatbots), biometrics, or generating synthetic content (Art 50 deepfakes).
- Art 14: Rigorous human oversight framework tracking mechanisms built into system operations.
- Title V: General Purpose AI (GPAI) model obligations, including model card reports, adversarial testing, and cybersecurity evaluations.
- Trajectory roadmap: Tracking upcoming August 2, 2026 enforcement milestones for high-risk system obligations.`,

  SOC2: `System and Organization Controls (SOC 2) Type II centers on 5 Trust Services Criteria (TSC) spanning:
- Trust Service Criteria CC1-CC9 (Security): Governing logical access control, physical security, risk management, and systems monitoring.
- TSC A1 (Availability): Managing system capacity, performance scaling, and disaster recovery.
- TSC PI1 (Processing Integrity): Ensuring inputs/outputs are authorization-approved, accurate, complete, and reliable.
- TSC C1 (Confidentiality): Scoping data classifications, protection labels, and encryption constraints.
- TSC P1-P8 (Privacy): Reviewing purpose notifications, explicit consent vectors, disclosure limits, and user data-rights requests.`,

  HIPAA: `Health Insurance Portability and Accountability Act (HIPAA) Security and Privacy rules require strict safeguards for Protected Health Information (PHI) under 45 CFR Part 164:
- Administrative Safeguards (§164.308): Security management processes, risk analyses, information access policies, and workforce training.
- Physical Safeguards (§164.310): Facility access controls, device security, and media sanitization.
- Technical Safeguards (§164.312): Granular access controls, unique IDs, emergency login protocols, audit logs, transmission integrity, and transit/at-rest encryption.
- PHI Isolation Vectors: Rigorous network-level segregation and continuous database access monitoring.
- Business Associate Agreements (BAA): Mandatory validation rules for third-party endpoints.`,

  GDPR: `EU General Data Protection Regulation (GDPR) mandates strict data governance guidelines:
- Article 5 Principles: Lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, and integrity/confidentiality.
- Article 25 (Data Protection by Design & Default): Proactive structural parameters avoiding retroactive patches.
- Articles 15-22 (Data Subject Rights): Supporting instant erasure (Right to be Forgotten), access requests, data portability, and processing object rights.
- Article 37+ (DPO Mandates): Official appointments and operational independence tracking.
- Article 35 (DPIAs): Compulsory assessments for high-risk processing tasks.
- Breach Notifications: Automated pipeline ensuring 72-hour notifications to supervisory authorities.
- Cross-Border Transfers: Requiring data location validation and Standard Contractual Clauses (SCCs).`,

  PRIVACY: `Standard Privacy Policy requirements demand high transparency and accurate data flow representations:
- Automated Data Collection Disclosures: Precise lists tracking browser profiling, telemetry logs, and tracking scripts.
- Specifying Legal bases: Articulation of GDPR consent, contractual necessity, or legitimate interest parameters.
- Retention maps: Exact timelines per data category instead of vague 'as long as necessary' wording.
- COPPA compliance: Explicit statements regarding the non-collection of telemetry from users under 13.
- Cookie Consent: Detailed, revocable preference mechanics.
- Consumer Rights: Clear contact points and specific procedures for CCPA, CPRA, and GDPR actions.`,

  CUSTOM: `Custom Corporate and Institutional Framework:
- Organization-specific cybersecurity baselines and customized bylaws.
- Localized state, federal, or country-specific legal criteria.
- Internal codes of conduct, system boundaries, and customized security standards.
- Proprietary multi-cloud logic boundaries and localized operational procedures.`
};

export const FRAMEWORKS = [
  { id: 'EU_AI_ACT', name: 'EU AI Act', description: 'Art 9, 27 Risk Classification & August 2, 2026 trajectories' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria: CC1–CC9, A1, PI1, C1, P1–P8' },
  { id: 'HIPAA', name: 'HIPAA Security', description: '45 CFR Part 164 safeguards, PHI isolation & BAA validation' },
  { id: 'GDPR', name: 'GDPR Compliance', description: 'Art 5 Principles, Art 25 Design/Default & 72-hr breach notifications' },
  { id: 'PRIVACY', name: 'Privacy Policy', description: 'Global data rights, COPPA directives & explicit cookies consent' },
  { id: 'CUSTOM', name: 'Custom Framework', description: 'Organizational bylaws, proprietary mandates, or localized bylaws' }
] as const;

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    description: 'Perfect for initial assessment',
    features: ['1 Basic Scan/month', 'Standard Support', 'PDF Reports (Basic)'],
    tier: UserTier.FREE
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: '$19',
    interval: '/mo',
    description: 'For growing compliance teams',
    features: ['Unlimited Scans', 'Deep AI Analysis', 'Priority Support', 'Full CSV/PDF Export'],
    tier: UserTier.PRO_MONTHLY
  },
  {
    id: 'lifetime',
    name: 'Lifetime Deal',
    price: '$500',
    interval: 'one-time',
    description: 'Best for long-term partners',
    features: ['Everything in Pro', 'Lifetime Updates', 'Custom Frameworks', 'Team Access (3 seats)'],
    tier: UserTier.LIFETIME,
    isPopular: true
  }
];

export const DOCUMENT_LIBRARY = [
  { id: 'privacy_policy', type: 'Privacy Policy', category: 'GDPR / CCPA / CPRA', scope: 'Comprehensive data tracing, legal processing bases, data-rights management, and retention maps.' },
  { id: 'terms_of_service', type: 'Terms of Service', category: 'General Commercial Law', scope: 'Contractual boundaries, acceptable system use, liability limits, and dispute resolution.' },
  { id: 'ai_risk_assessment', type: 'AI Risk Assessment', category: 'EU AI Act (Art 9 & 27)', scope: 'Risk classification matrix, mitigation plans, and Fundamental Rights Impact Assessments (FRIA).' },
  { id: 'ai_transparency_notice', type: 'AI Transparency Notice', category: 'EU AI Act (Art 13 & 50)', scope: 'End-user notifications tracking generative outputs, biometric processing, or automated scoring.' },
  { id: 'ai_technical_doc', type: 'AI Technical Documentation', category: 'EU AI Act (Annex IV)', scope: 'Technical architecture specifications, model validation criteria, training sets, and data governance logs.' },
  { id: 'data_processing_agreement', type: 'Data Processing Agreement', category: 'GDPR (Art 28)', scope: 'Legally binding data processor constraints, sub-processor obligations, and liability frameworks.' },
  { id: 'info_sec_policy', type: 'Information Security Policy', category: 'SOC 2 / ISO 27001', scope: 'Detailed corporate security rules governing logical access, network security, and cryptography.' },
  { id: 'business_associate_agreement', type: 'Business Associate Agreement', category: 'HIPAA', scope: 'Protected Health Information (PHI) safeguards, administrative constraints, and breach rules.' },
  { id: 'acceptable_use_policy', type: 'Acceptable Use Policy', category: 'SOC 2 / Corporate Security', scope: 'System boundaries, restricted internal actions, and employee data-safety obligations.' },
  { id: 'incident_response_plan', type: 'Incident Response Plan', category: 'SOC 2 / HIPAA / GDPR', scope: 'Explicit triage ownership, digital forensics playbooks, and strict 72-hour reporting countdowns.' },
  { id: 'cookie_policy', type: 'Cookie & Tracking Policy', category: 'GDPR / ePrivacy Directive', scope: 'Cookie categorization matrices, script behavior tracking, and user consent retention rules.' },
  { id: 'data_retention_policy', type: 'Data Retention Policy', category: 'GDPR / HIPAA / FINRA', scope: 'Definitive retention schedules mapped by data type, secure-deletion steps, and legal hold rules.' }
] as const;
