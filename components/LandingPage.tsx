
import React, { useState, useEffect } from 'react';
import { PRICING_PLANS } from '../constants';
import { UserTier } from '../types';

interface LandingPageProps {
  onStart: (role?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [demoStep, setDemoStep] = useState<'idle' | 'uploading' | 'result'>('idle');
  const [demoProgress, setDemoProgress] = useState(0);

  const runDemo = () => {
    setDemoStep('uploading');
    setDemoProgress(0);
  };

  useEffect(() => {
    if (demoStep === 'uploading') {
      const interval = setInterval(() => {
        setDemoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setDemoStep('result'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [demoStep]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
            v2.5: Semantic Embedding Engine Live
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
            Compliance Audits <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">
              At The Speed Of AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
            Automate SOC 2, HIPAA, and GDPR document analysis. Use domain-specific semantic embeddings to catch risks manual audits miss.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onStart()}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Get Started for Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <a href="#demo" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 text-lg font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-center">
              Try Interactive Demo
            </a>
          </div>

          <div className="mt-20">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by industry leaders in compliance</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
              <span className="text-2xl font-black tracking-tighter">FINTECH.OS</span>
              <span className="text-2xl font-black tracking-tighter">HEALTHSEC</span>
              <span className="text-2xl font-black tracking-tighter">GLOBALAW</span>
              <span className="text-2xl font-black tracking-tighter">SECURECLOUD</span>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-indigo-300 rounded-full blur-[120px] opacity-20"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-violet-300 rounded-full blur-[120px] opacity-20"></div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 bg-white" id="demo">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">See It In Action</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Experience our semantic audit engine by running a simulated scan on a sample document.</p>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-4 md:p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex items-center justify-center">
            {/* Mock Interface Wrapper */}
            <div className="w-full bg-slate-50 rounded-3xl min-h-[400px] shadow-inner flex flex-col overflow-hidden animate-fade-in relative z-10">
              
              {/* Demo Toolbar */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PulseAudit Simulation</span>
                </div>
                {demoStep === 'result' && (
                  <button 
                    onClick={() => setDemoStep('idle')} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Reset Demo
                  </button>
                )}
              </div>

              {/* Demo Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                {demoStep === 'idle' && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">Ready to Scan</h3>
                      <p className="text-slate-500 max-w-sm">Choose a sample framework to see how PulseAudit identifies risks.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                      <button onClick={runDemo} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-lg transition-all text-left group">
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600">PrivacyPolicy.pdf</p>
                        <p className="text-xs text-slate-400 mt-1">GDPR Compliance Framework</p>
                      </button>
                      <button onClick={runDemo} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-lg transition-all text-left group">
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600">VendorMSA_v2.docx</p>
                        <p className="text-xs text-slate-400 mt-1">SOC 2 Security Controls</p>
                      </button>
                    </div>
                  </div>
                )}

                {demoStep === 'uploading' && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-black text-indigo-600">{demoProgress}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">Scanning with Semantic Context...</h3>
                      <p className="text-slate-500">Cross-referencing embeddings with Article 5 & 25 guidelines.</p>
                    </div>
                    <div className="w-full max-w-md bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${demoProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {demoStep === 'result' && (
                  <div className="animate-slide-up space-y-8 pb-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="w-24 h-24 rounded-full border-[6px] border-amber-500 flex items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">72</span>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-lg font-bold text-slate-900">GDPR Compliance Review</h4>
                        <p className="text-sm text-slate-500">Document: PrivacyPolicy.pdf • Score: At-Risk</p>
                        <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                          The document lacks explicit data retention limits and fails to clearly identify the Data Protection Officer contact details as required by Article 37.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Key Findings</h5>
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-4">
                        <div className="w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center flex-shrink-0 text-xs font-bold">!</div>
                        <div>
                          <p className="font-bold text-red-900 text-sm">Missing Data Minimization Clause</p>
                          <p className="text-xs text-red-700 mt-1">High Severity: Violates GDPR principle of Purpose Limitation.</p>
                        </div>
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-4">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded flex items-center justify-center flex-shrink-0 text-xs font-bold">W</div>
                        <div>
                          <p className="font-bold text-amber-900 text-sm">Vague Cookie Consent Language</p>
                          <p className="text-xs text-amber-700 mt-1">Medium Severity: Language is too broad for "Freely Given" consent.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-center">
                      <button onClick={() => onStart()} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                        Get Full Versioned Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Background Gradients for the Demo Section */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>

      {/* Problem / Solution Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Stop Wasting Hundreds of Hours on Paperwork</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Traditional auditing is slow, expensive, and prone to human error. PulseAudit uses semantic intelligence to solve this.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Semantic Analysis",
                desc: "Goes beyond keyword matching. Our AI understands the regulatory context of every clause using domain-specific embeddings.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              },
              {
                title: "Version Control",
                desc: "Track compliance improvements over time. Compare document iterations and see exactly how your score evolved.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              },
              {
                title: "Built-in RBAC",
                desc: "Enterprise-grade access control. Assign roles like Admin, Auditor, and Viewer to keep your sensitive documents secure.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Manual vs PulseAudit</h2>
          <p className="text-slate-500">Why leading legal teams are switching to automation.</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Feature</th>
                <th className="p-6 text-sm font-bold text-slate-900">Manual Audit</th>
                <th className="p-6 text-sm font-bold text-indigo-600 bg-indigo-50/50">PulseAudit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { label: "Turnaround Time", manual: "3-5 Weeks", pulse: "45 Seconds" },
                { label: "Risk Detection", manual: "Human Subjective", pulse: "Semantic-Model Accurate" },
                { label: "Cost per Scan", manual: "$5,000+", pulse: "Included in Plan" },
                { label: "Updates", manual: "Requires Re-audit", pulse: "Instant v2 Generation" }
              ].map((row, i) => (
                <tr key={i}>
                  <td className="p-6 font-bold text-slate-700">{row.label}</td>
                  <td className="p-6 text-slate-500 font-medium">{row.manual}</td>
                  <td className="p-6 text-indigo-600 font-black bg-indigo-50/30">{row.pulse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black leading-tight mb-8">"PulseAudit cut our compliance preparation time by 80%."</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=sarah" alt="User" />
                </div>
                <div>
                  <p className="font-bold">Sarah Jenkins</p>
                  <p className="text-indigo-300 text-sm font-medium">Head of Compliance at FinTech Hub</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-4xl font-black">200+</p>
                <p className="text-indigo-300 font-medium">Enterprise Clients</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black">1.2M</p>
                <p className="text-indigo-300 font-medium">Documents Analyzed</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black">99.8%</p>
                <p className="text-indigo-300 font-medium">Accuracy Rating</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black">SOC 2</p>
                <p className="text-indigo-300 font-medium">Ready in Days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {[
            { q: "Is my data secure?", a: "Absolutely. We don't store your documents long-term. Everything is analyzed in volatile memory and deleted immediately after the session or version storage is confirmed." },
            { q: "How accurate is the AI?", a: "Our models are trained on specific regulatory datasets for SOC 2, HIPAA, and GDPR. It achieves higher consistency than human auditors across large document sets." },
            { q: "Can I use it for enterprise internal policies?", a: "Yes, our engine is versatile. While it has pre-built frameworks, its semantic core can analyze any legal or procedural document for internal consistency." }
          ].map((faq, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Magnet CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to Audit Your First Document?</h2>
            <p className="text-indigo-100 text-xl max-w-2xl mx-auto font-medium">
              Join 5,000+ teams automating their compliance. Start a free trial scan today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => onStart()}
                className="px-10 py-5 bg-white text-indigo-600 text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all hover:scale-105"
              >
                Get Started Now
              </button>
              <button className="px-10 py-5 bg-indigo-500/50 text-white text-lg font-bold rounded-2xl hover:bg-indigo-500 transition-all">
                Download Free Guide
              </button>
            </div>
          </div>
          {/* Subtle Decorative Circle */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
