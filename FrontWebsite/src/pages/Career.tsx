import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';

const pathways = [
  { id: 'eng', name: 'Engineering', steps: 5, active: true, icon: <Briefcase className="w-5 h-5" /> },
  { id: 'nurse', name: 'Nursing', steps: 7, active: false, icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'acc', name: 'Accounting', steps: 4, active: false, icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'soft', name: 'Software', steps: 3, active: false, icon: <FileText className="w-5 h-5" /> },
];

export const Career = () => {
  const [selectedProfession, setSelectedProfession] = useState('Engineering');
  const [searchQuery, setSearchQuery] = useState('');

  const triggerChat = (message: string) => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { message } }));
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      triggerChat(`I want to explore a career path as a ${searchQuery.trim()} in Canada. What are the licensing requirements and job market?`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-ink/20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-mint/20 border border-mint/40 text-forest text-xs font-bold uppercase tracking-widest rounded-sm">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              Module 02: Economic Integration
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-forest tracking-tight leading-tight">
              Career Navigator
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-xl">
              Strategic alignment of your professional background with the Canadian Labor Market.
              Precision-engineered career pathways to accelerate your licensing and integration.
            </p>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search professions..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-ink/40 text-sm font-medium focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-shadow rounded-sm placeholder:text-charcoal/30 shadow-sm"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column - Navigation & Secondary Cards */}
          <div className="lg:col-span-4 space-y-8 sticky top-8">
            <div className="bg-white border border-ink/20 p-6 shadow-sm rounded-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-6">
                Select Protocol
              </h3>
              <div className="space-y-2">
                {pathways.map((p) => {
                  const isActive = selectedProfession === p.name;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProfession(p.name)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 transition-all rounded-sm border text-left",
                        isActive
                          ? "bg-forest/5 border-forest/40 text-forest shadow-sm"
                          : "bg-transparent border-transparent text-charcoal/70 hover:bg-cream hover:border-ink/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-sm", isActive ? "bg-white shadow-sm text-forest" : "bg-cream text-charcoal/40")}>
                          {p.icon}
                        </div>
                        <div>
                          <span className={cn("block font-semibold text-[15px]", isActive ? "text-forest" : "text-charcoal")}>
                            {p.name}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-charcoal/40 font-semibold">
                            {p.steps} Nodes
                          </span>
                        </div>
                      </div>
                      {isActive && <ChevronRight size={18} className="text-forest" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-forest text-white p-8 border border-forest shadow-md rounded-sm relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-white/10 group-hover:scale-110 transition-transform duration-700">
                <Award size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-sm">
                  <Award size={24} className="text-mint" />
                </div>
                <div>
                  <h4 className="text-2xl font-serif font-bold mb-2">Portable Reputation</h4>
                  <p className="text-sm text-white/80 leading-relaxed font-light">
                    Don't start from zero. Let your international history speak for you in the Canadian market.
                  </p>
                </div>
                <button
                  onClick={() => triggerChat(`I would like to verify my international ${selectedProfession.toLowerCase()} experience for the Canadian market. Where do I start?`)}
                  className="w-full py-3.5 bg-white text-forest text-xs font-bold uppercase tracking-wider hover:bg-mint transition-colors rounded-sm"
                >
                  Verify Experience
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Pathway Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-ink/20 p-8 lg:p-12 shadow-sm rounded-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-forest rounded-sm"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-forest/70">Active Roadmap</span>
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-charcoal tracking-tight">{selectedProfession}</h2>
                  <p className="text-charcoal/50 mt-2 text-base">The architectural roadmap to professional licensing.</p>
                </div>
                <div className="hidden sm:flex w-20 h-20 bg-mint/30 items-center justify-center rounded-sm shrink-0">
                  <GraduationCap size={40} className="text-forest" />
                </div>
              </div>

              {/* Minimalist Timeline */}
              <div className="relative pl-6 md:pl-10 space-y-12">
                <div className="absolute left-[39px] md:left-[55px] top-4 bottom-4 w-px bg-gradient-to-b from-forest/30 via-ink/20 to-transparent" />

                {[
                  { title: 'Credential Assessment', desc: 'Submit your international degrees to WES or ICAS for Canadian equivalency.', status: 'done', time: '4-6 Weeks' },
                  { title: 'Language Proficiency', desc: 'Achieve the required IELTS or CELPIP scores for professional registration.', status: 'ready', time: '2-3 Months' },
                  { title: 'Professional Exam', desc: 'Register for the Canadian professional practice exam (NPPE).', status: 'locked', time: 'Scheduled' },
                  { title: 'Work Experience', desc: 'Gain 12 months of supervised Canadian experience under a licensed professional.', status: 'locked', time: '12 Months' },
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex items-start gap-6 md:gap-10 group">
                    <div className="flex flex-col items-center mt-1">
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-sm shrink-0 border-2 transition-colors bg-white",
                        step.status === 'done' ? "border-forest text-forest" :
                          step.status === 'ready' ? "border-forest ring-4 ring-mint/40 text-forest" :
                            "border-ink/30 text-charcoal/20"
                      )}>
                        {step.status === 'done' ? <CheckCircle2 size={16} strokeWidth={3} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                      </div>
                    </div>

                    <div className={cn(
                      "flex-1 border p-6 rounded-sm transition-all",
                      step.status === 'ready' ? "bg-white border-forest/30 shadow-md shadow-forest/5 ring-1 ring-forest/5" :
                        step.status === 'done' ? "bg-cream/50 border-ink/10" : "bg-white border-ink/20 opacity-70"
                    )}>
                      <div className="flex items-center justify-between mb-3 border-b border-ink/10 pb-3">
                        <h4 className="text-lg font-semibold text-charcoal tracking-tight">{step.title}</h4>
                        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest bg-cream px-2 py-1 rounded-sm">{step.time}</span>
                      </div>
                      <p className="text-sm text-charcoal/60 leading-relaxed max-w-2xl">{step.desc}</p>

                      {step.status === 'ready' && (
                        <div className="mt-6 pt-5">
                          <button
                            onClick={() => triggerChat(`I'm ready to execute the module: ${step.title}`)}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest hover:text-forest/80 transition-colors group/btn bg-mint/20 hover:bg-mint/40 px-4 py-2 rounded-sm"
                          >
                            <MessageSquare size={14} /> Execute Module
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Grid: Readiness & Bridging */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Readiness Audit */}
              <div className="bg-white border border-ink/20 p-8 shadow-sm rounded-sm">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-ink/20">
                  <ShieldCheck className="text-forest/80" size={24} />
                  <h4 className="text-sm font-bold uppercase tracking-widest text-charcoal/70">Readiness Audit</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Canadian-style Resume', done: true },
                    { label: 'LinkedIn Optimization', done: true },
                    { label: 'Local Networking Strategy', done: false },
                    { label: 'Interview Preparation', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className={cn(
                        "w-5 h-5 flex items-center justify-center shrink-0 border rounded-sm transition-colors",
                        item.done ? "bg-forest border-forest text-white" : "border-ink/40 text-transparent"
                      )}>
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        item.done ? "text-charcoal/40 line-through" : "text-charcoal/80"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bridging Protocols */}
              <div className="bg-mint/10 border border-mint/30 p-8 relative overflow-hidden rounded-sm group">
                <div className="absolute right-0 bottom-0 text-forest/5 group-hover:scale-110 transition-transform duration-700 pointer-events-none translate-x-1/4 translate-y-1/4">
                  <GraduationCap size={160} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <h4 className="text-xl font-serif font-bold text-forest mb-2">Bridging Protocols</h4>
                    <p className="text-sm text-forest/70 font-medium">
                      Specialized programs for international <span className="font-bold">{selectedProfession.toLowerCase()}s</span> focusing on market integration.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => triggerChat(`Tell me more about the U of T Bridge program for ${selectedProfession.toLowerCase()}s.`)}
                      className="w-full flex items-center justify-between px-5 py-3.5 bg-white text-forest text-xs font-bold uppercase tracking-wider hover:bg-forest hover:text-white transition-colors shadow-sm rounded-sm border border-forest/10"
                    >
                      U of T Bridge Module <ExternalLink size={14} />
                    </button>
                    <button
                      onClick={() => triggerChat(`Tell me more about the ACCES Tech program for ${selectedProfession.toLowerCase()}s.`)}
                      className="w-full flex items-center justify-between px-5 py-3.5 bg-white text-forest text-xs font-bold uppercase tracking-wider hover:bg-forest hover:text-white transition-colors shadow-sm rounded-sm border border-forest/10"
                    >
                      ACCES Tech Module <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
