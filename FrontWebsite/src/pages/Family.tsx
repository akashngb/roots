import React from 'react';
import { motion } from 'motion/react';
import {
  Users2,
  GraduationCap,
  Heart,
  Baby,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  MessageSquare,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

const triggerChat = (message: string) => {
  window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { message } }));
};

export const Family = () => {
  return (
    <div className="min-h-screen bg-cream/30 p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-ink/20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-mint/20 border border-mint/40 text-forest text-xs font-bold uppercase tracking-widest rounded-sm">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              Module 04: Family Foundation
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-forest tracking-tight leading-tight">
              The Foundation
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-xl">
              Support for your spouse, children, and parents.
              Building a secure architecture for your family's future in Canada.
            </p>
          </div>

          <div className="flex items-center gap-3 px-5 py-4 bg-white border border-ink/20 shadow-sm shrink-0">
            <div className="w-10 h-10 bg-mint/30 flex items-center justify-center text-forest">
              <Users2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">Active Profile</p>
              <p className="text-sm font-bold text-charcoal">4 Family Members</p>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School Registration */}
              <div className="bg-white border border-ink/20 p-8 shadow-sm group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 text-forest/5 group-hover:text-forest/10 transition-colors duration-700 pointer-events-none -mr-6 -mt-6">
                  <GraduationCap size={96} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-forest/10 flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-all duration-300">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal tracking-tight mb-2">School Registration</h3>
                    <p className="text-sm text-charcoal/60 leading-relaxed">
                      Enroll your children in the Toronto District School Board (TDSB). We've mapped your local catchment architecture.
                    </p>
                  </div>
                  <button
                    onClick={() => triggerChat("I want to enroll my child in a TDSB school. What documents do I need and how does the catchment system work?")}
                    className="w-full py-3 bg-forest text-white text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} /> Start Enrollment <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Childcare */}
              <div className="bg-white border border-ink/20 p-8 shadow-sm group relative overflow-hidden">
                <div className="absolute top-0 right-0 text-terracotta/5 group-hover:text-terracotta/10 transition-colors duration-700 pointer-events-none -mr-6 -mt-6">
                  <Baby size={96} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-terracotta/10 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all duration-300">
                    <Baby size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal tracking-tight mb-2">Childcare & Daycare</h3>
                    <p className="text-sm text-charcoal/60 leading-relaxed">
                      Explore licensed daycare options and apply for the Canada-Wide Early Learning and Child Care (CWELCC) subsidy.
                    </p>
                  </div>
                  <button
                    onClick={() => triggerChat("How do I find licensed daycares in my area and apply for the CWELCC subsidy to reduce childcare costs?")}
                    className="w-full py-3 bg-white text-terracotta border border-terracotta/30 text-xs font-bold uppercase tracking-wider hover:bg-terracotta/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} /> Find Daycare <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Family Healthcare */}
            <div className="bg-white border border-ink/20 p-8 lg:p-12 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/10">
                <h3 className="text-xl font-semibold text-charcoal tracking-tight">Family Healthcare</h3>
                <div className="w-10 h-10 bg-terracotta/10 flex items-center justify-center text-terracotta">
                  <Heart size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { name: 'Mateo (You)', status: 'Active', active: true },
                  { name: 'Elena (Spouse)', status: 'Pending', active: false },
                  { name: 'Lucas (Child)', status: 'Active', active: true },
                ].map((member, i) => (
                  <div key={i} className="p-5 bg-cream border border-ink/10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        member.active ? "bg-forest shadow-sm shadow-forest/40" : "bg-terracotta animate-pulse shadow-sm shadow-terracotta/40"
                      )} />
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        member.active ? "text-forest" : "text-terracotta"
                      )}>{member.status}</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-charcoal tracking-tight">{member.name}</p>
                      <p className="text-[10px] text-charcoal/30 uppercase tracking-widest mt-1">OHIP Status</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-mint/10 border border-mint/30 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-12 h-12 bg-forest text-white flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm text-forest/80 leading-relaxed">
                    We've identified <span className="font-bold">2 family physicians</span> in your neighborhood currently accepting new patients with children.
                  </p>
                </div>
                <button
                  onClick={() => triggerChat("Can you show me family physicians near me who are accepting new patients, especially with children? I need help registering with one.")}
                  className="px-6 py-2.5 bg-forest text-white text-[10px] font-bold uppercase tracking-widest hover:bg-forest/90 transition-colors shrink-0 flex items-center gap-2"
                >
                  View List <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8 sticky top-8">

            {/* Family Bridge */}
            <div className="bg-forest text-white p-8 shadow-lg relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-white/5 group-hover:scale-110 transition-transform duration-700">
                <Award size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                  <Users2 size={24} className="text-mint" />
                </div>
                <div>
                  <h4 className="text-2xl font-serif font-bold mb-2">Family Bridge</h4>
                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    Immigration is a shared journey. We help families navigate cultural adjustment together.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => triggerChat("What cultural adjustment workshops or community programs are available in Toronto for immigrant families?")}
                    className="w-full py-3 bg-white text-forest text-xs font-bold uppercase tracking-wider hover:bg-mint transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} /> Explore Workshops
                  </button>
                  <button
                    onClick={() => triggerChat("I'd like to speak with a settlement counselor about cultural adjustment challenges my family is facing. How do I connect with one?")}
                    className="w-full py-3 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} /> Talk to a Counselor
                  </button>
                </div>
              </div>
            </div>

            {/* Family Benefits */}
            <div className="bg-white border border-ink/20 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/10">
                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Family Benefits</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Canada Child Benefit', amount: '$540 / mo', eligible: true },
                  { label: 'Ontario Child Benefit', amount: '$125 / mo', eligible: true },
                  { label: 'GST/HST Credit', amount: '$110 / qtr', eligible: false },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-cream border border-ink/10">
                    <div>
                      <p className="text-sm font-semibold text-charcoal tracking-tight">{benefit.label}</p>
                      <p className="text-base font-serif font-bold text-forest mt-0.5">{benefit.amount}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 uppercase tracking-widest",
                      benefit.eligible ? "bg-mint/30 text-forest" : "bg-taupe/20 text-charcoal/40"
                    )}>
                      {benefit.eligible ? 'Eligible' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => triggerChat("How do I apply for the Canada Child Benefit, Ontario Child Benefit, and GST/HST Credit as a new immigrant? What documents are required?")}
                className="w-full mt-6 py-3 bg-charcoal text-white text-xs font-bold uppercase tracking-wider hover:bg-charcoal/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={14} /> Apply for Benefits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
