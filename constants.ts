
import { UserTier } from './types';

export const APP_NAME = "PulseAudit";

// Simulated domain-specific embeddings corpus (Regulatory Snippets)
export const REGULATORY_CONTEXT = {
  SOC2: `Security involves protection against unauthorized access. Availability refers to system accessibility. Processing Integrity ensures data is complete and accurate. Confidentiality restricts data access. Privacy governs personal info collection.`,
  HIPAA: `The Security Rule requires administrative, physical, and technical safeguards. Protected Health Information (PHI) must be encrypted at rest and in transit. Access controls must follow the principle of least privilege.`,
  GDPR: `Article 5 principles: Lawfulness, fairness, transparency. Data minimization (only collect what's needed). Right to erasure (Right to be forgotten). Data protection by design and default.`,
  PRIVACY: `A clear statement of data collection purposes is required. Third-party sharing must be disclosed. Users must have a way to contact the data controller. Opt-out mechanisms for marketing must be explicit.`
};

export const FRAMEWORKS = [
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'Trust Services Criteria: Security, Availability, Processing Integrity' },
  { id: 'HIPAA', name: 'HIPAA Security', description: 'Healthcare data privacy and security requirements' },
  { id: 'GDPR', name: 'GDPR Compliance', description: 'EU General Data Protection Regulation standards' },
  { id: 'PRIVACY', name: 'Privacy Policy', description: 'Standard privacy policy completeness check' }
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
    tier: UserTier.PRO_MONTHLY,
    priceId: 'price_1TcSlACNzl6cArE760ugSYfb',
    mode: 'subscription'
  },
  {
    id: 'lifetime',
    name: 'Founders Pass',
    price: '$299',
    interval: 'one-time',
    description: 'Lock in lifetime access at launch pricing',
    features: ['Everything in Pro', 'Lifetime Updates', 'Custom Frameworks', 'Team Access (3 seats)'],
    tier: UserTier.LIFETIME,
    isPopular: true,
    priceId: 'price_1TcSnGCNzl6cArE7jLLhuysR',
    mode: 'payment'
  }
];
