import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  MessageCircle,
  Globe,
  Heart,
  ArrowRight,
  Search,
  Calendar,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Award,
} from 'lucide-react';
import { PROXIES } from '../constants';
import { cn } from '../lib/utils';

const triggerChat = (message: string) => {
  window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { message } }));
};

export const Community = () => {
  const [apiProxies, setApiProxies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { getProxies } = await import('../api');
        const proxies = await getProxies({ city: 'Toronto', profession: 'Engineer' });
        setApiProxies(proxies);
      } catch {
        setApiProxies([]);
      }
    })();
  }, []);

  const displayProxies = apiProxies.length > 0
    ? apiProxies.map((p, i) => ({
      id: `api-${i}`,
      name: p.name,
      profession: p.profession,
      city: 'Toronto, ON',
      origin: p.origin,
      quote: p.wisdomEntries?.[0]?.insight || 'Connect to learn from my experience.',
      match: 90 - i * 3
    }))
    : PROXIES;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      triggerChat(`Tell me about newcomer community groups or circles related to "${searchQuery.trim()}" in Toronto.`);
      setSearchQuery('');
    }
  };

  const groups = [
    { name: 'Toronto Tech Newcomers', members: '1.2k', type: 'Professional', icon: Globe, color: 'forest' },
    { name: 'Latinos in GTA', members: '850', type: 'Cultural', icon: Heart, color: 'terracotta' },
    { name: 'Etobicoke Parents', members: '420', type: 'Local', icon: Users, color: 'charcoal' },
    { name: 'English Practice Circle', members: '2.1k', type: 'Language', icon: MessageCircle, color: 'forest' },
  ];

  const events = [
    { title: 'Newcomer Welcome Mixer', date: 'March 15', time: '6:00 PM', location: 'Liberty Village', type: 'Social' },
    { title: 'Resume Workshop for Engineers', date: 'March 18', time: '2:00 PM', location: 'Online', type: 'Career' },
    { title: 'Cultural Heritage Festival', date: 'March 22', time: '11:00 AM', location: 'Nathan Phillips Square', type: 'Festival' },
  ];

  return (
    <div className="min-h-screen bg-cream/30 p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-ink/20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-mint/20 border border-mint/40 text-forest text-xs font-bold uppercase tracking-widest rounded-sm">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              Module 03: Community
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-forest tracking-tight leading-tight">
              The Collective
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-xl">
              Find your tribe and connect with those who've walked the path.
              A curated ecosystem of support, wisdom, and shared experience.
            </p>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search groups..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-ink/40 text-sm font-medium focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-shadow rounded-sm placeholder:text-charcoal/30 shadow-sm"
            />
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">

            {/* Recommended Circles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-charcoal tracking-tight">Recommended Circles</h3>
                <button
                  onClick={() => triggerChat("Show me all newcomer community circles and groups available in Toronto.")}
                  className="text-xs font-bold uppercase tracking-widest text-forest hover:text-forest/70 transition-colors flex items-center gap-1"
                >
                  Explore All <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((group, i) => (
                  <button
                    key={i}
                    onClick={() => triggerChat(`I'd like to join the "${group.name}" circle. How do I get connected and what should I expect?`)}
                    className="bg-white border border-ink/20 p-6 shadow-sm text-left group relative overflow-hidden hover:border-forest/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative z-10 flex flex-col gap-5">
                      <div className={cn(
                        "w-11 h-11 flex items-center justify-center transition-all duration-300",
                        group.color === 'forest' ? "bg-mint/30 text-forest group-hover:bg-forest group-hover:text-white" :
                          group.color === 'terracotta' ? "bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-white" :
                            "bg-cream text-charcoal group-hover:bg-charcoal group-hover:text-white"
                      )}>
                        <group.icon size={22} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-base font-semibold text-charcoal group-hover:text-forest transition-colors tracking-tight">{group.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">{group.type}</span>
                          <span className="w-1 h-1 bg-ink/20" />
                          <span className="text-[10px] font-bold text-forest uppercase tracking-widest">{group.members} members</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40 group-hover:text-forest transition-colors flex items-center gap-1.5">
                          <MessageSquare size={12} /> Join Circle
                        </span>
                        <ArrowRight size={14} className="text-ink/20 group-hover:text-forest group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Upcoming Gatherings */}
            <section className="bg-white border border-ink/20 p-8 lg:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/10">
                <h3 className="text-xl font-semibold text-charcoal tracking-tight">Upcoming Gatherings</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerChat("Show me all upcoming newcomer events and gatherings in Toronto this month.")}
                    className="text-xs font-bold uppercase tracking-widest text-forest flex items-center gap-1 hover:text-forest/70 transition-colors"
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {events.map((event, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 group pb-6 border-b border-ink/10 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-forest/5 flex flex-col items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-all duration-300 shrink-0">
                      <span className="text-[9px] font-bold uppercase tracking-widest">{event.date.split(' ')[0]}</span>
                      <span className="text-2xl font-serif font-bold leading-none">{event.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-forest">{event.type}</span>
                      <h4 className="text-base font-semibold text-charcoal group-hover:text-forest transition-colors tracking-tight">{event.title}</h4>
                      <div className="flex items-center gap-5 text-xs text-charcoal/40 font-medium">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {event.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={12} /> {event.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => triggerChat(`I want to RSVP for "${event.title}" on ${event.date} at ${event.time} in ${event.location}. Can you help me register?`)}
                      className="px-5 py-2.5 border border-ink/30 text-[10px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white hover:border-forest transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <MessageSquare size={12} /> RSVP
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8 sticky top-8">

            {/* Proxy Mentors */}
            <div className="bg-forest text-white p-8 shadow-lg relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-white/5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Award size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={18} className="text-mint" />
                  <h3 className="text-lg font-semibold tracking-tight">Proxy Mentors</h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-6 font-light">
                  Real wisdom from people who made a similar move before you.
                </p>

                <div className="space-y-4">
                  {displayProxies.map(proxy => (
                    <div key={proxy.id} className="bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white flex items-center justify-center text-forest font-bold text-base shrink-0">
                          {proxy.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm tracking-tight truncate">{proxy.name}</p>
                            <span className="text-[10px] font-bold text-mint uppercase tracking-widest shrink-0">{proxy.match}%</span>
                          </div>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5 truncate">{proxy.profession} · {proxy.origin}</p>
                        </div>
                      </div>
                      <p className="text-xs italic text-white/60 mb-4 leading-relaxed">"{proxy.quote}"</p>
                      <button
                        onClick={() => triggerChat(`I'd like to request a 20-minute call with ${proxy.name}, a ${proxy.profession} from ${proxy.origin}. How can I connect with them?`)}
                        className="w-full py-2.5 bg-white text-forest text-[10px] font-bold uppercase tracking-widest hover:bg-mint transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare size={12} /> Request 20-min Call
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => triggerChat("Show me all available proxy mentors in Toronto who can help with my immigration and career journey.")}
                  className="w-full mt-5 py-3 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  View All Mentors <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Support Centres */}
            <div className="bg-white border border-ink/20 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/10">
                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Support Centres</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'YMCA Newcomer Centre', dist: '1.2 km' },
                  { name: 'COSTI Immigrant Services', dist: '2.5 km' },
                  { name: 'CultureLink Toronto', dist: '3.1 km' },
                ].map((centre, i) => (
                  <button
                    key={i}
                    onClick={() => triggerChat(`Tell me more about ${centre.name} and how it can help me as a newcomer in Toronto.`)}
                    className="w-full flex items-center justify-between group py-2 hover:text-forest transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-cream flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all">
                        <MapPin size={16} />
                      </div>
                      <p className="text-sm font-semibold text-charcoal group-hover:text-forest transition-colors text-left">{centre.name}</p>
                    </div>
                    <span className="text-[10px] font-bold text-charcoal/20 uppercase tracking-widest shrink-0">{centre.dist}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
