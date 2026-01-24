
# 🛡️ PulseAudit: AI-Powered Compliance Intelligence

![PulseAudit Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=400)

PulseAudit is a production-ready SaaS platform designed to automate document compliance audits using cutting-edge Generative AI. By leveraging domain-specific semantic embeddings and advanced LLMs, PulseAudit transforms weeks of manual legal review into seconds of automated intelligence.

## 🚀 Key Features

### 🤖 AI-Driven Compliance Engine
- **Framework Support**: Pre-configured for SOC 2 Type II, HIPAA Security Rule, GDPR (Article 5/25/37), and standard Privacy Policies.
- **Semantic Analysis**: Utilizes domain-specific RAG (Retrieval-Augmented Generation) logic to identify regulatory nuances beyond simple keyword matching.
- **Risk Scoring**: Generates an objective compliance score (0-100) based on identified gaps.

### 📜 Version Control & History
- **Incremental Audits**: Save multiple versions of the same document to track compliance improvements over time.
- **Comparison Engine**: Review history sidebar to compare scores and findings across document iterations.

### 🔐 Enterprise-Grade RBAC
- **Role-Based Access Control**:
  - **Admin**: Full system control, user management, and configuration.
  - **Auditor**: Permissions to upload documents, run scans, and manage reports.
  - **Viewer**: Read-only access to dashboards and existing reports for stakeholders.

### 💳 SaaS Monetization
- **Stripe-Ready Integration**: Pricing tiers including Free, Pro Monthly, and a $500 Lifetime Deal.
- **Tiered Limits**: Feature gates based on user subscription level.

### 📊 Interactive Analytics
- **Semantic Risk Radar**: Visual breakdown of risk across different compliance categories.
- **AI Assistant**: Embedded chatbot to explain specific findings and suggest legal remediations.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19), TypeScript, Tailwind CSS.
- **AI Backend**: Google Gemini API (@google/genai).
- **Visualization**: Recharts for compliance analytics.
- **Icons & UI**: Heroicons, Inter Font, Framer-motion inspired animations.

---

## 🏗️ Project Structure

```text
src/
├── components/
│   ├── LandingPage.tsx   # Marketing site + Interactive Demo
│   ├── Dashboard.tsx     # Audit overview & history
│   ├── AuditUpload.tsx   # File handling & versioning logic
│   ├── AuditReport.tsx   # Detailed analysis & AI Assistant
│   ├── Layout.tsx        # Global navigation & RBAC wrappers
│   └── Pricing.tsx       # Stripe-ready payment UI
├── services/
│   └── geminiService.ts  # Core AI, Embeddings simulation & RAG
├── types.ts              # Global TypeScript interfaces
├── constants.ts          # Regulatory context & framework defs
└── App.tsx               # Main Router & Auth Simulation
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js installed.
- A **Google Gemini API Key**.

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables:
   Create a `.env` file or ensure your environment provides:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

### Execution
Run the development server:
```bash
npm run dev
```

---

## 🛡️ Compliance & Security Note

PulseAudit is designed with privacy-first principles:
- **Data Volatility**: Documents are processed in-memory during analysis.
- **Redaction Ready**: Logic is structured to support PII redaction prior to AI submission.
- **Local Context**: Regulatory snippets are injected locally via `REGULATORY_CONTEXT` to ensure grounding without excessive data leakage.

---

## 📄 License

PulseAudit is released under the **MIT License**.

---

*Disclaimer: PulseAudit provides AI-generated suggestions. It does not constitute legal advice. Always consult with a qualified legal professional for final compliance verification.*
