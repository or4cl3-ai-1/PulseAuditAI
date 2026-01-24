
import React, { useState } from 'react';
import { PRICING_PLANS } from '../constants';
import { UserTier } from '../types';

interface PricingProps {
  onUpgrade: (tier: UserTier) => void;
  currentTier: UserTier;
}

const Pricing: React.FC<PricingProps> = ({ onUpgrade, currentTier }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string, tier: UserTier) => {
    setLoadingPlan(planId);
    // Simulate Stripe Checkout
    setTimeout(() => {
      onUpgrade(tier);
      setLoadingPlan(null);
      alert('Subscription successful! (Simulation)');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
        <h2 className="text-4xl font-black text-slate-900 sm:text-5xl">Simple, Transparent Pricing</h2>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">
          Choose the plan that fits your compliance needs. Start for free and upgrade as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier;
          
          return (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 bg-white rounded-3xl border transition-all ${
                plan.isPopular 
                ? 'border-indigo-600 shadow-2xl shadow-indigo-100 ring-2 ring-indigo-600 ring-opacity-20 scale-105 z-10' 
                : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-2">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                  {plan.interval && (
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">{plan.interval}</span>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isCurrent || !!loadingPlan}
                onClick={() => handleSubscribe(plan.id, plan.tier)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  isCurrent 
                  ? 'bg-slate-100 text-slate-500 cursor-default' 
                  : plan.isPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                ) : isCurrent ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Coupons & Trust Badges */}
      <div className="mt-20 text-center space-y-6">
        <p className="text-slate-500 text-sm font-medium">Have a discount code? Enter it at checkout.</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale pointer-events-none">
          <img src="https://picsum.photos/id/1/100/40" alt="Partner" />
          <img src="https://picsum.photos/id/2/100/40" alt="Partner" />
          <img src="https://picsum.photos/id/3/100/40" alt="Partner" />
          <img src="https://picsum.photos/id/4/100/40" alt="Partner" />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
