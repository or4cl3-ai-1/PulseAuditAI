
import React, { useState, useEffect } from 'react';
import { PRICING_PLANS } from '../constants';
import { UserTier } from '../types';

interface LandingPageProps {
  onStart: (role?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [demoStep, setDemoStep] = useState<'idle' | 'uploading' | 'result'>('idle');
  const [demoProgress, setDemoProgress] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planId: string, priceId?: string) => {
    if (!priceId) return;
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode: 'payment' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoadingPlan(null);
      }
    } catch (err) {
      setLoadingPlan(null);
    }
  };

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
    <div className="bg-slate-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-40">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent opacity-50 blur-[120px]"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 mb-10 animate-pulse">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            Version 3.0 Production Ready
          </div>
          <h1 className="text-6xl md:text-[92px] font-black tracking-tight leading-[0.9] mb-10">
            Compliance at <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">
              Computational Speed
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed mb-14">
            Audit complex regulatory documents in seconds. Harness domain-specific embeddings to identify hidden risks in SOC 2, HIPAA, and GDPR policies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => onStart()}
              className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-500 shadow-2xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Launch Platform
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <a href="#demo" className="w-full sm:w-auto px-12 py-5 bg-slate-900/50 text-white text-lg font-bold rounded-2xl border border-slate-800 backdrop-blur-sm hover:bg-slate-800 transition-all text-center">
              Interactive Preview
            </a>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale invert">
            <span className="text-2xl font-black tracking-tighter">FINTECH</span>
            <span className="text-2xl font-black tracking-tighter">SECURE</span>
            <span className="text-2xl font-black tracking-tighter">GOV.FLOW</span>
            <span className="text-2xl font-black tracking-tighter">AUDIT.IQ</span>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-32 bg-slate-900/30" id="demo">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-6">Semantic Engine Preview</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Test our audit logic on sample documents without an account. Real-time reasoning across regulatory vectors.</p>
          </div>

          <div className="bg-slate-950 rounded-[3rem] p-4 md:p-8 shadow-[0_0_100px_rgba(79,70,229,0.1)] relative overflow-hidden border border-slate-800">
            <div className="w-full bg-slate-900/50 backdrop-blur-xl rounded-3xl min-h-[500px] flex flex-col overflow-hidden relative z-10 border border-white/5">
              
              <div className="bg-slate-800/50 border-b border-slate-700/50 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Semantic Core Terminal</span>
                </div>
                {demoStep === 'result' && (
                  <button onClick={() => setDemoStep('idle')} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">New Simulation</button>
                )}
              </div>

              <div className="flex-1 p-10 flex flex-col items-center justify-center">
                {demoStep === 'idle' && (
                  <div className="max-w-md w-full text-center space-y-10">
                    <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto ring-1 ring-indigo-500/20">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white">Select a Vector</h3>
                      <p className="text-slate-400 font-medium">Choose a sample regulatory document to visualize the embedding analysis.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <button onClick={runDemo} className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-slate-800 transition-all text-left group">
                        <p className="font-bold text-slate-100 group-hover:text-indigo-400">HealthData_Privacy_v4.pdf</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">HIPAA Security Framework</p>
                      </button>
                      <button onClick={runDemo} className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-slate-800 transition-all text-left group">
                        <p className="font-bold text-slate-100 group-hover:text-indigo-400">Cloud_Security_Policy.docx</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">SOC 2 Trust Criteria</p>
                      </button>
                    </div>
                  </div>
                )}

                {demoStep === 'uploading' && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-10">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-[6px] border-slate-800 border-t-indigo-500 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-indigo-400">{demoProgress}%</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white tracking-tight">Mapping Semantic Vectors...</h3>
                      <p className="text-slate-400 font-medium">Cross-referencing document fragments with regulatory knowledge graph.</p>
                    </div>
                  </div>
                )}

                {demoStep === 'result' && (
                  <div className="w-full max-w-4xl space-y-10 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-1 flex flex-col items-center justify-center bg-slate-800/30 rounded-3xl p-8 border border-slate-700">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                            <circle cx="64" cy="64" r="58" stroke="#f59e0b" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="102" strokeLinecap="round" />
                          </svg>
                          <span className="absolute text-3xl font-black text-white">72</span>
                        </div>
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Risk Level: Moderate</p>
                      </div>
                      <div className="md:col-span-2 bg-slate-800/30 rounded-3xl p-8 border border-slate-700 flex flex-col justify-center">
                        <h4 className="text-xl font-black text-white mb-2">Analysis Summary</h4>
                        <p className="text-slate-400 leading-relaxed font-medium text-sm">
                          Embedding analysis identified 3 high-probability violations of Article 32 (Technical safeguards). Encryption protocols are mentioned but lack specifics on "At-Rest" requirements for sensitive PHI fields.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-6">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <div>
                          <p className="font-black text-white text-lg">Incomplete Encryption Clause</p>
                          <p className="text-sm text-red-400 mt-1 font-bold">Regulatory ID: HIPAA §164.312(a)(2)(iv)</p>
                          <p className="text-slate-400 mt-2 text-sm leading-relaxed">System lacks explicit mention of AES-256 standards for mobile data endpoints.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-6">
                      <button onClick={() => onStart()} className="px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">
                        Unlock Full Automated Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Enterprise Infrastructure</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">Designed for regulated entities requiring high-fidelity automated verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Vector Embeddings",
              desc: "Contextual grounding ensures the AI understands legal intent, not just string matching.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            },
            {
              title: "Audit Lineage",
              desc: "Full immutable history of every audit version with direct delta comparisons.",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            },
            {
              title: "Granular RBAC",
              desc: "Production-ready permissions for Admins, Auditors, and Viewers.",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 10a2 2 0 100-4 2 2 0 000 4z"
            }
          ].map((f, i) => (
            <div key={i} className="group p-10 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] hover:bg-slate-800/50 transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-slate-800 text-indigo-400 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon}></path></svg>
              </div>
              <h3 className="text-2xl font-black mb-4">{f.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 max-w-7xl mx-auto px-4" id="pricing">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            EU AI Act deadline: August 2, 2026
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">Start free. Upgrade when you're ready to automate compliance at scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-10 bg-slate-900 rounded-[3rem] border transition-all ${
                plan.isPopular
                  ? 'border-indigo-600 shadow-[0_0_80px_rgba(79,70,229,0.15)] ring-1 ring-indigo-600 scale-105 z-10'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
                  Founders Deal
                </div>
              )}
              <div className="mb-10">
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-3 font-semibold">{plan.description}</p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                  {plan.interval && (
                    <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">{plan.interval}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-5 mb-12">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-slate-300 text-sm font-bold">{feature}</span>
                  </div>
                ))}
              </div>
              <button
                disabled={!plan.priceId || !!loadingPlan}
                onClick={() => handleCheckout(plan.id, plan.priceId)}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-center ${
                  !plan.priceId
                    ? 'bg-slate-800 text-slate-500 cursor-default'
                    : plan.isPopular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20'
                      : 'bg-white text-slate-900 hover:bg-slate-200'
                }`}
              >
                {loadingPlan === plan.id ? 'Loading...' : (!plan.priceId ? 'Free — No Card Required' : plan.isPopular ? 'Get Founders Pass' : 'Start Pro')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 -skew-y-3 translate-y-20"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            The Future of Compliance <br />
            Starts Here.
          </h2>
          <p className="text-indigo-100 text-2xl font-medium max-w-2xl mx-auto">
            Ready to deploy your first automated audit? Launch the platform now.
          </p>
          <div className="pt-6">
            <button 
              onClick={() => onStart()}
              className="px-16 py-6 bg-white text-indigo-600 text-xl font-black rounded-3xl hover:bg-slate-100 shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
