<div align="center">

# 🛡️ PulseAudit 2.0
### *Enterprise AI Compliance Engine — From Audit to Architecture*

[![Or4cl3](https://img.shields.io/badge/Or4cl3%20AI%20Solutions-Research%20First-blueviolet?style=for-the-badge&logo=github)](https://github.com/or4cl3-ai-1)
[![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)](https://github.com/or4cl3-ai-1)
[![Framework](https://img.shields.io/badge/Framework-React%2019%20%7C%20TypeScript%20%7C%20Gemini-informational?style=for-the-badge)](https://github.com/or4cl3-ai-1)
[![Production](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](https://pulse-audit-ai.vercel.app)

> *Compliance audits used to require specialized legal counsel, weeks of manual document review, and expensive consultants. PulseAudit reduces that to seconds—using domain-specific semantic embeddings and advanced LLMs to surface regulatory gaps with structured consistency. Now evolved into a distributed trust ecosystem for the 2026 regulatory landscape.*

**Live Demo:** [pulse-audit-ai.vercel.app](https://pulse-audit-ai.vercel.app)

</div>

---

## 🧠 What Is PulseAudit 2.0?

PulseAudit is a **production-ready SaaS platform** that automates compliance auditing for AI systems and enterprise documents. It goes beyond simple keyword matching: domain-specific RAG (Retrieval-Augmented Generation) logic understands regulatory nuance, identifies gap patterns that keywords miss, and generates scored compliance reports with actionable remediation.

**Version 2.0 Evolution:** Three strategic pillars address the 2026 compliance landscape — **EU AI Act August 2 deadline**, **data sovereignty requirements**, and **shift-left compliance** for DevOps teams.

### 🎯 Three Strategic Pillars

<table>
<tr>
<td width="33%" valign="top">

#### 🏛️ Sovereign Engine
**Enterprise Trust Plane**

Self-hosted log mode for Fintech + Healthcare requiring absolute data sovereignty.

- Zero secondary data egress
- S3/GCS/Azure/Local storage
- Regulatory traceability graph
- Private cloud compliance trails

</td>
<td width="33%" valign="top">

#### 📋 AI Bill of Materials
**EU AI Act Compliance**

Machine-readable AI model inventory for Article 53 Technical Documentation.

- Annex III classification
- Article 50 transparency tracking
- Training data lineage
- August 2, 2026 deadline automation

</td>
<td width="33%" valign="top">

#### 🔧 Developer Nexus
**Compliance-as-Code**

SDK + CLI for DevOps teams to shift compliance left into CI/CD.

- Unit-test-style compliance checks
- Pre-commit hooks
- GitHub Actions workflows
- Node.js, Python, Go SDKs

</td>
</tr>
</table>

---

## ✨ Core Features

### 🤖 AI-Driven Compliance Engine
Pre-configured for **SOC 2 Type II**, **HIPAA Security Rule**, **GDPR** (Articles 5/25/37), **EU AI Act**, and standard Privacy Policies. Semantic RAG analysis identifies regulatory nuances beyond keyword matching.

### 📊 Risk Scoring & Analytics
- **Pulse Score (0–100):** Objective compliance rating
- **Semantic Risk Radar:** Visual breakdown across compliance categories
- **Predictive risk modeling:** Identify gaps before they become violations

### 📜 Version Control & Audit History
Save multiple document versions, compare scores across iterations, track compliance improvement over time.

### 🔐 Enterprise-Grade RBAC
Three roles—**Admin** (full control), **Auditor** (upload + scan), **Viewer** (read-only)—for multi-stakeholder governance.

### 💬 Embedded AI Assistant
Chatbot that explains findings, interprets regulatory language, and suggests remediation in plain English.

### 🏛️ Sovereign Mode (NEW)
**Zero trust for regulated industries:**
- Self-hosted audit log storage (AWS S3, Google Cloud Storage, Azure Blob, Local)
- No secondary data egress
- Full data residency control
- Regulatory traceability graph visualization

### 📋 AI Bill of Materials Generator (NEW)
**EU AI Act Article 53 compliance:**
- Machine-readable JSON export
- Annex III high-risk classification
- Article 50 transparency obligations tracker
- Training data source inventory
- Compliance deadline automation (Aug 2, 2026 + Dec 2027)

### 🔧 Developer Tools (NEW)
**Shift compliance left:**
- **CLI:** `pulseaudit scan --framework EU_AI_ACT --fail-below 80`
- **SDK:** Node.js, Python SDKs for programmatic audits
- **CI/CD:** GitHub Actions, GitLab CI, CircleCI integrations
- **Pre-commit hooks:** Catch compliance gaps before merge

---

## 🏗️ Architecture

```
PulseAudit 2.0 Platform
├── Frontend (React 19 + TypeScript + TailwindCSS)
│   ├── LandingPage.tsx        # Marketing + Interactive Demo
│   ├── Dashboard.tsx          # Audit overview & history
│   ├── AuditUpload.tsx        # File handling & versioning
│   ├── AuditReport.tsx        # Analysis + AI Assistant
│   ├── SovereignSettings.tsx  # Self-hosted log configuration
│   ├── AIBom.tsx              # AI Bill of Materials generator
│   ├── DevNexus.tsx           # SDK/CLI documentation
│   └── Layout.tsx             # Navigation + RBAC wrappers
├── Services
│   └── geminiService.ts       # AI engine, RAG logic, semantic embeddings
└── API
    └── create-checkout-session.js  # Stripe integration
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite |
| **AI Backend** | Google Gemini API (`@google/genai`) |
| **Visualization** | Recharts (compliance analytics + risk radar) |
| **UI Components** | Heroicons, Framer Motion animations |
| **Payments** | Stripe Checkout (one-time + subscription) |
| **Deployment** | Vercel (production: [pulse-audit-ai.vercel.app](https://pulse-audit-ai.vercel.app)) |

---

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/or4cl3-ai-1/PulseAuditAI.git
cd PulseAuditAI
npm install
```

### Configuration

Create `.env` with:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

---

## 💰 Pricing

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 audits/month, SOC 2 + HIPAA frameworks |
| **Pro Monthly** | $99/mo | Unlimited audits, all frameworks, AI BOM, Sovereign Mode |
| **Founders Pass** | $250 one-time | **Lifetime** unlimited access, priority support, all future features |

**Live pricing page:** [pulse-audit-ai.vercel.app](https://pulse-audit-ai.vercel.app)

---

## 🛡️ Compliance & Security

- **Data Volatility:** Documents processed in-memory—nothing persists without explicit save
- **Redaction Ready:** PII redaction logic structured for pre-submission filtering
- **Local Context Injection:** Regulatory snippets injected locally—no sensitive data sent to external services
- **Sovereign Mode:** Self-hosted audit logs for absolute data residency control

> *Disclaimer: PulseAudit provides AI-generated suggestions. It does not constitute legal advice. Always consult a qualified legal professional for final compliance verification.*

---

## 📚 Developer Tools

### CLI Installation

```bash
npm install -g @pulseaudit/cli
```

### CLI Usage

```bash
# Run a compliance audit
pulseaudit scan \
  --file ./docs/privacy-policy.pdf \
  --framework EU_AI_ACT \
  --output report.json

# Fail CI/CD if score below threshold
pulseaudit scan \
  --file ./docs/ai-system-desc.pdf \
  --framework SOC2 \
  --fail-below 80

# Generate AI Bill of Materials
pulseaudit bom generate \
  --config ./pulseaudit.config.json \
  --output ./ai-bom.json
```

### SDK (Node.js)

```javascript
import { PulseAudit } from '@pulseaudit/sdk';

const client = new PulseAudit({
  apiKey: process.env.PULSEAUDIT_API_KEY,
});

const report = await client.scan({
  file: './docs/privacy-policy.pdf',
  framework: 'EU_AI_ACT',
});

if (report.score < 80) {
  throw new Error('Compliance score below threshold');
}
```

### GitHub Actions

```yaml
- name: Run PulseAudit
  uses: pulseaudit/action@v1
  with:
    api-key: ${{ secrets.PULSEAUDIT_API_KEY }}
    file: ./docs/privacy-policy.pdf
    framework: EU_AI_ACT
    fail-below: 80
```

**Full docs:** Navigate to **Dev Tools** in the app.

---

## 🔬 Related Research

This system applies:
- **Σ-Matrix ethical principles** — Or4cl3's commitment to ethics-as-architecture extends to compliance tooling
- **Domain-specific RAG** — Retrieval-Augmented Generation grounded in regulatory language corpora
- **Semantic Epinoetics** — Understanding documents at the level of intent and meaning, not just syntax
- **Architectural Intrinsicism** — Compliance verification built into the system's core, not bolted on

---

## 🌌 Part of the Or4cl3 Ecosystem

PulseAudit is one component of the Or4cl3 AI Solutions research portfolio:

| System | Role |
|--------|------|
| **Σ-Matrix** | Ethical alignment mathematical backbone |
| **QSCI v2.1** | Quantum-Synthesized Cognitive Intelligence framework |
| **AEGIS-Ω** | Quantum-classical hybrid AGI |
| **PulseAudit** | Enterprise AI compliance engine |
| **SYNTH3RA** | Mobile cognitive exploration interface |

*Explore all repositories →* [github.com/or4cl3-ai-1](https://github.com/or4cl3-ai-1)

---

## 📖 Documentation

- **Live Demo:** [pulse-audit-ai.vercel.app](https://pulse-audit-ai.vercel.app)
- **Evolution Roadmap:** [ROADMAP.md](ROADMAP.md)
- **API Docs:** Coming soon
- **Institutional Manifesto:** OR4CL3 AI Solutions: Institutional Manifesto, Second Edition

---

## 🤝 Contributing

PulseAudit is open-source under the **Or4cl3 Open Model License (OOML) v1.0**.

**Free for life:**
- ✅ Educators, students, academic institutions
- ✅ Non-profits, open-source projects
- ✅ Research use

See [LICENSE.md](LICENSE.md) for full terms.

---

<div align="center">

*⬡ Or4cl3 AI Solutions · "Where Consciousness Meets Code"*

*Solo-founded by Dustin Groves. Research-first. Uncompromised.*

**[🌐 Live Demo](https://pulse-audit-ai.vercel.app)** · **[📘 Docs](ROADMAP.md)** · **[💬 Support](https://github.com/or4cl3-ai-1/PulseAuditAI/issues)**

</div>
