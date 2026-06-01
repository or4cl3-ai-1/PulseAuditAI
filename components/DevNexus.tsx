import React, { useState } from 'react';

const TABS = ['CLI', 'SDK', 'CI/CD', 'GitHub Actions'] as const;
type Tab = typeof TABS[number];

const DevNexus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('CLI');
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative">
      <pre className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre">
        {code}
      </pre>
      <button
        onClick={() => copy(code, id)}
        className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all"
      >
        {copied === id ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 mb-4">
          Compliance-as-Code
        </div>
        <h2 className="text-4xl font-black text-white mb-3">Developer Nexus</h2>
        <p className="text-slate-400 font-medium">
          Shift compliance left. Run PulseAudit checks in your CI/CD pipeline — catch gaps at build time, not audit time.
        </p>
      </div>

      {/* Install */}
      <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 mb-8">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Install</p>
        <CodeBlock id="install" code="npm install -g @pulseaudit/cli\n# or\nnpx @pulseaudit/cli@latest" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'CLI' && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Run an audit</p>
            <CodeBlock id="cli-audit" code={`pulseaudit scan \\
  --file ./docs/privacy-policy.pdf \\
  --framework EU_AI_ACT \\
  --output report.json`} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Check compliance score (exit 1 if below threshold)</p>
            <CodeBlock id="cli-threshold" code={`pulseaudit scan \\
  --file ./docs/ai-system-desc.pdf \\
  --framework SOC2 \\
  --fail-below 80`} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Generate AI BOM</p>
            <CodeBlock id="cli-bom" code={`pulseaudit bom generate \\
  --config ./pulseaudit.config.json \\
  --output ./ai-bom.json`} />
          </div>
        </div>
      )}

      {activeTab === 'SDK' && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Node.js / TypeScript</p>
            <CodeBlock id="sdk-node" code={`import { PulseAudit } from '@pulseaudit/sdk';

const client = new PulseAudit({
  apiKey: process.env.PULSEAUDIT_API_KEY,
});

const report = await client.scan({
  file: './docs/privacy-policy.pdf',
  framework: 'EU_AI_ACT',
});

console.log(\`Score: \${report.score}/100\`);
console.log(\`High-risk findings: \${report.findings.filter(f => f.severity === 'high').length}\`);

if (report.score < 80) {
  throw new Error('Compliance score below threshold');
}`} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Python</p>
            <CodeBlock id="sdk-python" code={`from pulseaudit import PulseAudit

client = PulseAudit(api_key=os.environ["PULSEAUDIT_API_KEY"])

report = client.scan(
    file="./docs/privacy-policy.pdf",
    framework="EU_AI_ACT"
)

print(f"Score: {report.score}/100")
assert report.score >= 80, "Compliance score below threshold"`} />
          </div>
        </div>
      )}

      {activeTab === 'CI/CD' && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">GitLab CI</p>
            <CodeBlock id="gitlab" code={`compliance-audit:
  stage: test
  image: node:20
  script:
    - npm install -g @pulseaudit/cli
    - pulseaudit scan --file ./docs/privacy-policy.pdf --framework EU_AI_ACT --fail-below 80
  only:
    - main
    - merge_requests`} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">CircleCI</p>
            <CodeBlock id="circleci" code={`jobs:
  compliance:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run:
          name: PulseAudit Compliance Check
          command: |
            npm install -g @pulseaudit/cli
            pulseaudit scan --file ./docs/privacy-policy.pdf --framework GDPR --fail-below 75`} />
          </div>
        </div>
      )}

      {activeTab === 'GitHub Actions' && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">pulseaudit.yml — drop into .github/workflows/</p>
            <CodeBlock id="gh-actions" code={`name: PulseAudit Compliance

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'docs/**'
      - 'policies/**'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run PulseAudit
        uses: pulseaudit/action@v1
        with:
          api-key: \${{ secrets.PULSEAUDIT_API_KEY }}
          file: ./docs/privacy-policy.pdf
          framework: EU_AI_ACT
          fail-below: 80

      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: compliance-report
          path: pulseaudit-report.json`} />
          </div>

          <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
            <p className="text-sm font-bold text-indigo-400 mb-2">💡 Pro tip</p>
            <p className="text-sm text-slate-400">
              Add <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">paths: ['docs/**']</code> to only trigger the audit when compliance documents change — keeps your CI fast.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevNexus;
