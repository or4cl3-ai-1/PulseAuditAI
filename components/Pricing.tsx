
import React, { useState } from 'react';
import { PRICING_PLANS } from '../constants';
import { UserTier } from '../types';

interface PricingProps {
  onUpgrade: (tier: UserTier) => void;
  currentTier: UserTier;
}

const Pricing: React.FC<PricingProps> = ({ onUpgrade, currentTier }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, tier: UserTier, priceId?: string, mode?: string) => {
    if (!priceId) return; // Free tier — no checkout
    setLoadingPlan(planId);
    setError(null);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode: mode || 'payment' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoadingPlan(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-32">
      <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
        <h2 className="text-5xl font-black text-white tracking-tight leading-[0.9]">Subscription Protocol</h2>
        <p className="text-xl text-slate-400 font-medium">
          Scale your compliance operations. Instant provisioning for all enterprise tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier;
          
          return (
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
                  Most Optimized
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
                disabled={isCurrent || !!loadingPlan}
                onClick={() => handleSubscribe(plan.id, plan.tier, plan.priceId, plan.mode)}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  isCurrent 
                  ? 'bg-slate-800 text-slate-500 cursor-default' 
                  : plan.isPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20'
                    : 'bg-white text-slate-900 hover:bg-slate-200'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Provisioning...
                  </span>
                ) : isCurrent ? 'Active Protocol' : 'Select Iteration'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
