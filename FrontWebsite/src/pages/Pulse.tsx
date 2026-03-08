import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Info,
  ChevronRight,
  TrendingUp,
  History
} from 'lucide-react';
import { POLICY_ALERTS } from '../constants';
import { searchPolicies } from '../api';

export const Pulse = () => {
  const [statusInput, setStatusInput] = useState('');
  const [statusType, setStatusType] = useState('Permanent Residency (Express Entry)');
  const [statusMonths, setStatusMonths] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusResponse, setStatusResponse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState<any[]>(POLICY_ALERTS);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setAlerts(POLICY_ALERTS);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchPolicies(searchQuery);
      setAlerts(results);
    } catch (e) {
      console.error(e);
      window.alert("Failed to reach intelligence database.");
    }
    setIsSearching(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-32">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-12 h-[1px] bg-forest"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest/60">Module 01</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-forest leading-[0.85] tracking-tighter mb-8 flex items-baseline gap-4 md:gap-6">
            The
            <span className="italic text-terracotta text-5xl md:text-7xl">Pulse.</span>
          </h1>
          <p className="text-xl text-charcoal/60 leading-relaxed font-light">
            Policy intelligence and application status tracking.
            Real-time insights into the shifting landscape of Canadian immigration.
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-auto">
          <button
            onClick={() => window.alert('No new notifications at this time.')}
            className="p-4 bg-white border border-taupe rounded-sm text-charcoal/40 hover:text-forest transition-all shadow-sm group"
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-forest transition-colors" size={18} />
            <input
              type="text"
              placeholder="Ask an intelligence question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-taupe rounded-sm focus:outline-none focus:border-forest text-sm w-64 transition-all focus:w-80 shadow-sm"
              disabled={isSearching}
            />
          </form>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Side - Policy Feed */}
        <div className="lg:col-span-7 space-y-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-charcoal/20"></span>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-charcoal/40">Policy Alerts</h3>
            </div>
            <button
              onClick={() => window.alert('Feed Customization module opening...')}
              className="text-[10px] font-bold uppercase tracking-widest text-forest hover:underline"
            >
              Customize Feed
            </button>
          </div>

          <div className="space-y-6">
            {isSearching ? (
              <div className="p-16 flex flex-col items-center justify-center gap-4 text-forest/40">
                <div className="w-6 h-6 border-2 border-forest/20 border-t-forest animate-spin rounded-full shadow-lg" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Running Semantic Search</span>
              </div>
            ) : alerts.length > 0 ? alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex flex-col items-center gap-4 shrink-0 mt-8">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal/30 rotate-180 [writing-mode:vertical-lr]">{alert.date}</span>
                    <div className="w-[1px] h-full bg-ink/30 group-hover:bg-forest transition-colors duration-500" />
                  </div>
                  <div className="flex-1 bg-white p-8 border border-ink shadow-sm hover:border-forest transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex flex-wrap gap-2">
                        {alert.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold px-3 py-1 bg-cream text-forest rounded-sm uppercase tracking-widest border border-forest/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-charcoal mb-3 group-hover:text-forest transition-colors duration-300 leading-tight">{alert.title}</h4>
                    <p className="text-base text-charcoal/60 leading-relaxed max-w-2xl mb-8 font-light">
                      {alert.summary}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-ink/40 mt-auto">
                      <button
                        onClick={() => window.alert(`Opening plain-language summary document for: ${alert.title}`)}
                        className="text-[10px] font-bold uppercase tracking-widest text-forest flex items-center gap-2 group/btn"
                      >
                        Read plain-language summary <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-charcoal/40">
                        <History size={12} /> 2 min read
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="p-12 text-center text-charcoal/40 font-serif italic border border-ink/30 border-dashed rounded-sm shadow-sm bg-white/50">
                No policies match your search query. Try asking a different question.
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Status Tracker */}
        <div className="lg:col-span-5 space-y-12">
          <div className="bg-forest rounded-sm p-10 text-white shadow-md relative overflow-hidden group">
            <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
              <ShieldCheck size={24} className="text-mint" /> Status Tracker.
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-[9px] font-bold uppercase tracking-widest opacity-60">Application Type</label>
                <select
                  value={statusType}
                  onChange={(e) => setStatusType(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:bg-white/10 transition-all appearance-none cursor-pointer text-white"
                >
                  <option className="text-charcoal" value="Permanent Residency (Express Entry)">Permanent Residency (Express Entry)</option>
                  <option className="text-charcoal" value="Work Permit Extension">Work Permit Extension</option>
                  <option className="text-charcoal" value="Citizenship Application">Citizenship Application</option>
                  <option className="text-charcoal" value="Study Permit">Study Permit</option>
                  <option className="text-charcoal" value="PR - Spousal">PR - Spousal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-bold uppercase tracking-widest opacity-60">Months Waiting</label>
                <input
                  type="number"
                  placeholder="e.g. 6"
                  value={statusMonths}
                  onChange={(e) => setStatusMonths(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-sm px-4 py-3 text-sm focus:outline-none focus:bg-white/10 transition-all placeholder:text-white/30 text-white"
                />
              </div>
              {statusResponse && (
                <div className="bg-white/10 border border-white/20 rounded-sm p-5">
                  <p className="text-sm whitespace-pre-line leading-relaxed opacity-90">{statusResponse}</p>
                </div>
              )}
              <button
                onClick={async () => {
                  if (!statusMonths) return;
                  setStatusLoading(true);
                  setStatusResponse('');
                  try {
                    const { checkStatus } = await import('../api');
                    const response = await checkStatus(statusType, parseInt(statusMonths));
                    setStatusResponse(response);
                  } catch {
                    setStatusResponse('Unable to connect to the server. Please try again later.');
                  }
                  setStatusLoading(false);
                }}
                disabled={statusLoading || !statusMonths}
                className="w-full py-4 bg-white text-forest rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-all shadow-sm disabled:opacity-50 mt-4"
              >
                {statusLoading ? 'Analyzing...' : 'Track Application'}
              </button>
            </div>
          </div>

          {/* Status Insights Card */}
          <div className="bg-white p-10 rounded-sm border border-ink shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1px] bg-charcoal/20"></span>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/40">Current Insight</h4>
              </div>
              <div className="px-3 py-1 bg-mint/10 text-forest text-[9px] font-bold rounded-sm uppercase tracking-widest border border-forest/10">Updated Today</div>
            </div>

            <div className="flex items-center gap-6 mb-10">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-ink" />
                  <motion.circle
                    initial={{ strokeDashoffset: 226 }}
                    animate={{ strokeDashoffset: 56.5 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" className="text-forest"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-serif font-bold text-forest">75%</div>
              </div>
              <div>
                <p className="text-xl font-serif font-bold text-charcoal leading-tight">Processing <br />Confidence.</p>
                <p className="text-[9px] text-charcoal/40 uppercase tracking-widest mt-1">Based on IRCC trends</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="p-6 bg-cream rounded-sm border border-ink/30 relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-forest text-white rounded-sm flex items-center justify-center shadow-sm">
                  <TrendingUp size={12} />
                </div>
                <p className="text-base text-charcoal/70 leading-relaxed font-light">
                  "Your application is currently in the 'Background Check' phase. This typically takes 4-6 weeks. IRCC processing speeds for Express Entry have increased by 12% this month."
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[9px] font-bold text-charcoal/50 uppercase tracking-widest mb-4">Suggested Actions</h5>
              <div className="space-y-3">
                {[
                  'Ensure your biometrics are up to date',
                  'Check your email for medical request',
                  'Verify your proof of funds'
                ].map((action, i) => (
                  <div
                    key={i}
                    onClick={() => window.alert(`Initiating action sequence: ${action}`)}
                    className="flex items-start gap-3 text-sm font-medium text-charcoal/80 group cursor-pointer border-b border-ink/40 pb-3 last:border-0 last:pb-0 hover:bg-black/5 p-2 rounded-sm transition-colors"
                  >
                    <div className="w-1.5 h-1.5 bg-terracotta rounded-full mt-1.5 group-hover:bg-forest transition-colors" />
                    <span className="group-hover:text-forest transition-colors">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
