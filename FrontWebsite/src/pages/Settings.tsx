import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Check, Globe } from 'lucide-react';
import { useApp, type Language } from '../context/AppContext';

const LANGUAGES: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'tl', name: 'Tagalog', native: 'Filipino' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
];

export const Settings = () => {
    const { language, setLanguage, darkMode, setDarkMode, t } = useApp();
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="h-screen overflow-hidden bg-white relative">
            <div className="max-w-7xl mx-auto h-full px-8 md:px-12 pt-16 flex flex-col md:flex-row gap-12 md:gap-24">

                {/* Left Column: Header & Appearance (Fixed width) */}
                <div className="md:w-[400px] flex-shrink-0 flex flex-col h-full pb-16">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12"
                    >
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-charcoal/30 mb-2">{t.settingsSubtitle}</p>
                        <h1 className="font-serif italic text-6xl text-forest mb-4 leading-none">{t.settingsTitle}</h1>
                        <div className="h-px w-24 bg-ink mb-6" />
                        <p className="text-charcoal/50 font-light text-sm leading-relaxed">
                            Configure the protocol environment, language primitives, and visual preferences.
                        </p>
                    </motion.div>

                    {/* Appearance */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-auto"
                    >
                        <h3 className="font-serif font-bold text-xl text-forest mb-4">{t.appearance}</h3>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDarkMode(false)}
                                className={`flex-1 flex flex-col items-center justify-center gap-3 py-6  border transition-all duration-300 ${!darkMode
                                    ? 'border-forest bg-forest text-cream shadow-xl shadow-forest/20'
                                    : 'border-ink bg-cream/30 text-charcoal/50 hover:border-forest/20 hover:bg-cream'
                                    }`}
                            >
                                <Sun size={20} className={!darkMode ? "text-mint" : ""} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t.lightMode}</span>
                            </button>
                            <button
                                onClick={() => setDarkMode(true)}
                                className={`flex-1 flex flex-col items-center justify-center gap-3 py-6  border transition-all duration-300 ${darkMode
                                    ? 'border-forest bg-forest text-cream shadow-xl shadow-forest/20'
                                    : 'border-ink bg-cream/30 text-charcoal/50 hover:border-forest/20 hover:bg-cream'
                                    }`}
                            >
                                <Moon size={20} className={darkMode ? "text-mint" : ""} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t.darkMode}</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Save Action */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <button
                            onClick={handleSave}
                            className={`w-full py-5  text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-300 flex items-center justify-center gap-3 ${saved
                                ? 'bg-mint text-forest border border-forest/20 scale-[0.98]'
                                : 'bg-forest text-cream hover:bg-forest/90 shadow-xl shadow-forest/20'
                                }`}
                        >
                            {saved ? (
                                <><Check size={14} /> {t.saved}</>
                            ) : (
                                t.saveSettings
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Language Grid (Fluid width) */}
                <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full flex flex-col justify-center"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Globe size={18} className="text-forest/40" />
                            <h3 className="font-serif font-bold text-2xl text-forest">{t.language}</h3>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {LANGUAGES.map((lang, index) => {
                                const isSelected = language === lang.code;
                                return (
                                    <motion.button
                                        key={lang.code}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + (index * 0.02) }}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`flex flex-col items-start px-6 py-5  border transition-all duration-300 relative overflow-hidden group ${isSelected
                                            ? 'border-forest bg-forest text-cream shadow-xl shadow-forest/20 scale-[1.02] z-10'
                                            : 'border-ink bg-white hover:border-forest/30 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="relative z-10 w-full text-left">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-cream/80' : 'text-charcoal/40 group-hover:text-charcoal/60'}`}>
                                                    {lang.name}
                                                </span>
                                                {isSelected && <Check size={14} className="text-mint" />}
                                            </div>
                                            <span className={`text-xl font-serif italic block ${isSelected ? 'text-mint' : 'text-forest'}`}>
                                                {lang.native}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};
