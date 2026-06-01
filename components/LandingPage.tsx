import React, { useState, useEffect } from 'react';
import { PRICING_PLANS } from '../constants';

interface LandingPageProps {
  onStart: (role?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [demoStep, setDemoStep] = useState<'idle' | 'uploading' | 'result'>('idle');
  const [demoProgress, setDemoProgress] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      if (data.url) window.location.href = data.url;
      else setLoadingPlan(null);
    } catch {
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
    <div className="bg-black text-white overflow-x-hidden relative">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-20 transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            left: `${mousePos.x - 400}px`,
            top: `${mousePos.y - 400}px`,
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/30 to-transparent rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/30 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Particle grid */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: `translateY(${scrollY * 0.3}px)`
        }} />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Floating badge */}
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 mb-12 hover:scale-105 transition-transform cursor-default shadow-2xl shadow-indigo-500/20"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            PulseAudit 2.0 — Production Ready
          </div>

          {/* Main headline with kinetic effect */}
          <h1 className="text-5xl sm:text-7xl lg:text-[120px] font-black tracking-tighter leading-[0.85] mb-10">
            <span className="block mb-4" style={{ transform: `translateX(${scrollY * -0.05}px)` }}>
              Compliance
            </span>
            <span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 animate-gradient"
              style={{ 
                backgroundSize: '200% 200%',
                transform: `translateX(${scrollY * 0.05}px)`
              }}
            >
              Reimagined
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed mb-16">
            Enterprise AI compliance engine. Audit SOC 2, HIPAA, EU AI Act in seconds.
            <br className="hidden sm:block" />
            <span className="text-indigo-300">Sovereign logs. Compliance-as-code. Zero trust architecture.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <button 
              onClick={() => onStart()}
              className="group relative w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg font-black rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Launch Platform
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <a 
              href="#demo" 
              className="w-full sm:w-auto px-12 py-6 bg-white/5 backdrop-blur-xl text-white text-lg font-black rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center"
            >
              Interactive Demo
            </a>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Frameworks', value: '12+' },
              { label: 'Avg Score', value: '94%' },
              { label: 'Audits/sec', value: '<3s' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="relative p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-violet-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/10 group-hover:to-violet-500/10 rounded-2xl transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="relative py-32 px-4" id="demo">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
              See It <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">In Action</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Real-time semantic analysis. No account required.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[3rem] p-1 shadow-2xl border border-white/20">
            <div className="bg-black/40 backdrop-blur-xl rounded-[2.8rem] overflow-hidden border border-white/10">
              {/* Terminal header */}
              <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl px-8 py-5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Engine v2.0</span>
                </div>
                {demoStep === 'result' && (
                  <button onClick={() => setDemoStep('idle')} className="text-xs font-bold text-indigo-400 uppercase tracking-wider hover:text-indigo-300 transition-colors">
                    New Scan →
                  </button>
                )}
              </div>

              {/* Demo content */}
              <div className="p-10 min-h-[500px] flex items-center justify-center">
                {demoStep === 'idle' && (
                  <div className="max-w-2xl w-full space-y-12 text-center">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl shadow-indigo-500/20">
                      <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black mb-4">Select a Sample Document</h3>
                      <p className="text-slate-400 font-medium">Watch real-time semantic analysis across regulatory frameworks</p>
                    </div>
                    <div className="grid gap-4">
                      {[
                        { name: 'HealthData_Privacy_v4.pdf', framework: 'HIPAA Security Rule', risk: 'high' },
                        { name: 'Cloud_Security_Policy.docx', framework: 'SOC 2 Type II', risk: 'medium' },
                      ].map((doc, i) => (
                        <button 
                          key={i}
                          onClick={runDemo} 
                          className="group relative p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-left overflow-hidden"
                        >
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{doc.name}</p>
                              <span className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider ${doc.risk === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                {doc.risk}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{doc.framework}</p>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/10 group-hover:to-violet-500/10 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {demoStep === 'uploading' && (
                  <div className="text-center space-y-12">
                    <div className="relative w-40 h-40 mx-auto">
                      <div className="absolute inset-0 rounded-full border-8 border-white/10"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-t-indigo-500 border-r-violet-500 border-b-transparent border-l-transparent animate-spin"
                        style={{ animationDuration: '1s' }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                          {demoProgress}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black mb-4">Analyzing Compliance Vectors</h3>
                      <p className="text-slate-400 font-medium max-w-md mx-auto">
                        Cross-referencing {Math.floor(demoProgress * 4.2)} document fragments with regulatory knowledge graph
                      </p>
                    </div>
                  </div>
                )}

                {demoStep === 'result' && (
                  <div className="w-full max-w-5xl space-y-8">
                    {/* Score card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-1 relative p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl border border-amber-500/20 flex flex-col items-center justify-center shadow-2xl shadow-amber-500/10">
                        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
                            <circle 
                              cx="80" 
                              cy="80" 
                              r="70" 
                              stroke="url(#gradient)" 
                              strokeWidth="12" 
                              fill="transparent" 
                              strokeDasharray="439.8" 
                              strokeDashoffset="123" 
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#f97316" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">72</span>
                        </div>
                        <p className="text-sm font-black text-amber-400 uppercase tracking-wider">Moderate Risk</p>
                      </div>

                      <div className="lg:col-span-2 relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                        <h4 className="text-2xl font-black mb-4">Executive Summary</h4>
                        <p className="text-slate-300 leading-relaxed mb-6">
                          Semantic analysis identified <span className="text-red-400 font-bold">3 high-severity violations</span> of HIPAA Article 32 (Technical Safeguards). Encryption protocols are mentioned but lack specifics on at-rest requirements for PHI endpoints.
                        </p>
                        <div className="flex gap-3">
                          <span className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold border border-red-500/20">3 Critical</span>
                          <span className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-xl text-xs font-bold border border-amber-500/20">5 Warnings</span>
                          <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-xl text-xs font-bold border border-green-500/20">42 Passed</span>
                        </div>
                      </div>
                    </div>

                    {/* Finding */}
                    <div className="relative p-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl border border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden group hover:scale-[1.02] transition-transform">
                      <div className="flex gap-6 items-start relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/30 flex-shrink-0">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xl font-black text-white mb-2">Incomplete Encryption Specification</h5>
                          <p className="text-sm text-red-300 font-bold mb-3">HIPAA §164.312(a)(2)(iv) — Technical Safeguards</p>
                          <p className="text-slate-300 leading-relaxed text-sm mb-4">
                            Document references "encryption in transit" but lacks explicit AES-256 requirement for mobile PHI endpoints. FDA guidance mandates specificity for Class II+ medical software.
                          </p>
                          <button className="px-6 py-2 bg-white/10 backdrop-blur-xl rounded-xl text-sm font-bold text-white hover:bg-white/20 transition-all border border-white/10">
                            View Remediation →
                          </button>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/5 group-hover:to-orange-500/5 transition-all" />
                    </div>

                    <div className="flex justify-center pt-4">
                      <button 
                        onClick={() => onStart()} 
                        className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/40"
                      >
                        Unlock Full Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature showcase with 3D cards */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Regulated Industries</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Three strategic pillars addressing the 2026 compliance landscape
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Sovereign Engine',
                desc: 'Self-hosted audit logs. Zero secondary data egress. S3/GCS/Azure storage.',
                icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'AI Bill of Materials',
                desc: 'EU AI Act Article 53 compliance. Annex III classification. Aug 2 deadline tracking.',
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                title: 'Developer Nexus',
                desc: 'Compliance-as-code. CLI + SDK. Pre-commit hooks. GitHub Actions integration.',
                icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                gradient: 'from-violet-500 to-purple-500'
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-default"
                style={{ 
                  transitionDelay: `${i * 100}ms`,
                  transform: `perspective(1000px) rotateX(${scrollY * 0.01}deg)`
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-32 px-4" id="pricing">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/20 mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
              EU AI Act Deadline: August 2, 2026
            </div>
            <h2 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start free. Scale when ready.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan, i) => (
              <div
                key={plan.id}
                className={`relative flex flex-col p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border transition-all hover:scale-105 ${
                  plan.isPopular
                    ? 'border-indigo-500 shadow-2xl shadow-indigo-500/30 lg:scale-110 z-10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-xl">
                    🔥 Founders Deal
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-black tracking-tight">{plan.price}</span>
                    {plan.interval && <span className="text-slate-500 font-bold text-sm uppercase">{plan.interval}</span>}
                  </div>
                </div>
                <div className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  disabled={!plan.priceId || !!loadingPlan}
                  onClick={() => handleCheckout(plan.id, plan.priceId)}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                    !plan.priceId
                      ? 'bg-white/5 text-slate-500 cursor-default border border-white/10'
                      : plan.isPopular
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/40'
                        : 'bg-white text-black hover:bg-slate-100'
                  }`}
                >
                  {loadingPlan === plan.id ? 'Processing...' : (!plan.priceId ? 'Free Forever' : plan.isPopular ? 'Get Lifetime Access' : 'Start Pro')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-purple-600/20 blur-3xl" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-12">
          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9]">
            The Future of Compliance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              Starts Now
            </span>
          </h2>
          <p className="text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
            Join regulated enterprises building trust through automated compliance architecture.
          </p>
          <button 
            onClick={() => onStart()}
            className="group px-16 py-7 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xl font-black rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-indigo-500/50 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Launch Dashboard
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="font-bold">© 2026 PulseAudit — Or4cl3 AI Solutions</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
