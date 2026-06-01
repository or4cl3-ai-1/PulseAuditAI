# 🛡️ PulseAudit: AI-Powered Compliance Intelligence

![PulseAudit Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=400)

PulseAudit AI is a production-grade SaaS compliance intelligence platform designed to automate regulatory audits, synthesize production-ready compliance documentation, and deliver interactive, context-aware remediation guidance.

The system leverages a self-hostable, real-time backend powered by a PostgreSQL and Supabase stack. Deep cognitive processing and automated auditing are driven directly via the Google Gemini API, completely eliminating proprietary orchestrators and third-party gateways.

## 🚀 Key Features

### 🤖 AI-Driven Compliance Engine
- **Framework Support**: Pre-configured for EU AI Act, SOC 2 Type II, HIPAA Security Rule, and GDPR.
- **Blueprint-Driven Auditing**: Integrates custom auditing templates containing weights, benchmarks, and structured checklists into the Gemini API pipeline.
- **Risk Scoring**: Generates an objective compliance score (0-100) based on weighted finding metrics.

### 🌐 Multi-Cloud File Synchronization
- **External Providers**: Direct integrations for **Amazon AWS S3**, **Google Cloud Storage (GCS)**, and **Azure Blob Storage**.
- **In-App Ingestion**: Seamlessly select target buckets, browse directory trees, review file sizes, track cloud regions, and trigger instant compliance scanning on specific cloud files without manual downloads.

### 🔐 Enterprise-Grade Multi-Tenant RBAC
- **Strict Tenant Isolation**:
  - **Admin**: Full system controls, global telemetry visibility, billing adjustments, and configuration metrics.
  - **Auditor**: Standard scanning triggers, visual posture comparative reviews, report creation, and customizable blueprint mapping.
  - **Client**: Restricted READ-ONLY stakeholder portal. Clients are securely locked down to self-owned tenant UUID tags. They can ONLY view reports belonging specifically to their company and check dedicated corporate profiles. Direct scans, template modifiers, and document generators are automatically filtered out.

### 📈 Custom Blueprint Builders
- **Customizable Checklists**: Design tailored law rules, configure weighted impact multipliers, and declare required ingestion evidence benchmarks.
- **Target Application**: Instantly apply saved blueprints to new compliance audits to enforce specialized organizational structures.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19) + TypeScript + Vite.
- **Styling**: Tailwind CSS + custom high-contrast dark visual parameters.
- **AI Backend**: Google Gemini API (`@google/genai` TypeScript SDK).
- **Visualization**: Recharts for dynamic multi-axis compliance analytics.
- **Icons**: Lucide React.

---

## 🏗️ Project Structure

```text
/
├── components/
│   ├── LandingPage.tsx     # Modern Marketing site + Interactive Demo
│   ├── Dashboard.tsx       # Audit list, history comparison, and Client widgets
│   ├── AuditUpload.tsx     # In-app scan designer with custom template active badges
│   ├── AuditReport.tsx     # Posture briefing charts and interactive conversational AI
│   ├── Layout.tsx          # Dynamic RBAC-driven global navigation rails
│   ├── Pricing.tsx         # SaaS premium plans & Lifetime features gates
│   ├── CloudStorage.tsx    # Multi-cloud storage auth setups and direct scan brokers
│   └── AuditTemplates.tsx  # Dynamic custom checking blueprint blueprint tool
├── services/
│   └── geminiService.ts    # Model schemas, system grounding, and template instructions
├── types.ts                # Strong types, UserRole.CLIENT enums, and Templates
├── constants.ts            # Regulatory definitions, law frameworks, and document models
└── App.tsx                 # Core App lifecycle, auth simulations, and view switches
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js environment.
- A **Google Gemini API Key**.

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables:
   Create a `.env` file or provide environment secrets:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Execution
Run the development server on the dedicated port 3000:
```bash
npm run dev
```

---

## 🛡️ Compliance & Security Note

PulseAudit is designed with privacy-first principles:
- **Data Volatility**: Documents are processed in-memory during analysis.
- **Redaction Ready**: Logic is structured to support PII redactions.
- **Local Context**: Regulatory law frameworks are loaded locally to keep models grounded without data leaks.

---

## 📄 License

PulseAudit is released under the **MIT License**.

---

*Disclaimer: PulseAudit provides AI-generated suggestions. It does not constitute legal advice. Always consult with a qualified legal professional for final compliance verification.*
