import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'zh' | 'pa' | 'es' | 'ar' | 'tl' | 'it' | 'de' | 'pt' | 'hi';

export interface Translations {
    // Nav
    overview: string;
    arrivalEngine: string;
    pulse: string;
    documents: string;
    career: string;
    family: string;
    community: string;
    messages: string;
    settings: string;
    // Settings page
    settingsTitle: string;
    settingsSubtitle: string;
    appearance: string;
    darkMode: string;
    darkModeDesc: string;
    language: string;
    languageDesc: string;
    selectLanguage: string;
    saveSettings: string;
    saved: string;
    lightMode: string;
    // Overview
    welcomeHome: string;
    protocolStatus: string;
    // Common
    enterDashboard: string;
    roadmapComplete: string;
}

const translations: Record<Language, Translations> = {
    en: {
        overview: 'Overview', arrivalEngine: 'Arrival Engine', pulse: 'Pulse',
        documents: 'Documents', career: 'Career', family: 'Family',
        community: 'Community', messages: 'Messages', settings: 'Settings',
        settingsTitle: 'Settings', settingsSubtitle: 'Protocol Preferences',
        appearance: 'Appearance', darkMode: 'Dark Mode', darkModeDesc: 'Switch between light and dark interface.',
        language: 'Language', languageDesc: 'Choose the language for the entire application.',
        selectLanguage: 'Select a language', saveSettings: 'Save Settings', saved: 'Saved!',
        lightMode: 'Light Mode',
        welcomeHome: 'Welcome home,', protocolStatus: 'Protocol Status: Active',
        enterDashboard: 'Enter dashboard', roadmapComplete: 'Roadmap Complete',
    },
    fr: {
        overview: 'Aperçu', arrivalEngine: "Moteur d'arrivée", pulse: 'Pouls',
        documents: 'Documents', career: 'Carrière', family: 'Famille',
        community: 'Communauté', messages: 'Messages', settings: 'Paramètres',
        settingsTitle: 'Paramètres', settingsSubtitle: 'Préférences du protocole',
        appearance: 'Apparence', darkMode: 'Mode Sombre', darkModeDesc: "Basculer entre l'interface claire et sombre.",
        language: 'Langue', languageDesc: "Choisissez la langue de toute l'application.",
        selectLanguage: 'Choisir une langue', saveSettings: 'Enregistrer', saved: 'Enregistré!',
        lightMode: 'Mode Clair',
        welcomeHome: 'Bienvenue,', protocolStatus: 'Statut du protocole : Actif',
        enterDashboard: 'Accéder au tableau de bord', roadmapComplete: 'Feuille de route complète',
    },
    ar: {
        overview: 'نظرة عامة', arrivalEngine: 'محرك الوصول', pulse: 'النبض',
        documents: 'المستندات', career: 'المسيرة المهنية', family: 'العائلة',
        community: 'المجتمع', messages: 'الرسائل', settings: 'الإعدادات',
        settingsTitle: 'الإعدادات', settingsSubtitle: 'تفضيلات البروتوكول',
        appearance: 'المظهر', darkMode: 'الوضع الداكن', darkModeDesc: 'التبديل بين الوضع الفاتح والداكن.',
        language: 'اللغة', languageDesc: 'اختر لغة التطبيق بالكامل.',
        selectLanguage: 'اختر لغة', saveSettings: 'حفظ الإعدادات', saved: 'تم الحفظ!',
        lightMode: 'الوضع الفاتح',
        welcomeHome: 'مرحباً بعودتك،', protocolStatus: 'حالة البروتوكول: نشط',
        enterDashboard: 'دخول لوحة التحكم', roadmapComplete: 'اكتملت خارطة الطريق',
    },
    es: {
        overview: 'Resumen', arrivalEngine: 'Motor de llegada', pulse: 'Pulso',
        documents: 'Documentos', career: 'Carrera', family: 'Familia',
        community: 'Comunidad', messages: 'Mensajes', settings: 'Configuración',
        settingsTitle: 'Configuración', settingsSubtitle: 'Preferencias del protocolo',
        appearance: 'Apariencia', darkMode: 'Modo Oscuro', darkModeDesc: 'Cambiar entre interfaz clara y oscura.',
        language: 'Idioma', languageDesc: 'Elige el idioma de toda la aplicación.',
        selectLanguage: 'Selecciona un idioma', saveSettings: 'Guardar', saved: '¡Guardado!',
        lightMode: 'Modo Claro',
        welcomeHome: 'Bienvenido a casa,', protocolStatus: 'Estado del protocolo: Activo',
        enterDashboard: 'Ir al panel', roadmapComplete: 'Hoja de ruta completa',
    },
    zh: {
        overview: '概览', arrivalEngine: '到达引擎', pulse: '脉冲',
        documents: '文件', career: '职业', family: '家庭',
        community: '社区', messages: '消息', settings: '设置',
        settingsTitle: '设置', settingsSubtitle: '协议首选项',
        appearance: '外观', darkMode: '深色模式', darkModeDesc: '在浅色和深色界面之间切换。',
        language: '语言', languageDesc: '为整个应用程序选择语言。',
        selectLanguage: '选择语言', saveSettings: '保存设置', saved: '已保存！',
        lightMode: '浅色模式',
        welcomeHome: '欢迎回家，', protocolStatus: '协议状态：活跃',
        enterDashboard: '进入仪表板', roadmapComplete: '路线图完成',
    },
    hi: {
        overview: 'अवलोकन', arrivalEngine: 'आगमन इंजन', pulse: 'पल्स',
        documents: 'दस्तावेज़', career: 'करियर', family: 'परिवार',
        community: 'समुदाय', messages: 'संदेश', settings: 'सेटिंग्स',
        settingsTitle: 'सेटिंग्स', settingsSubtitle: 'प्रोटोकॉल प्राथमिकताएं',
        appearance: 'दिखावट', darkMode: 'डार्क मोड', darkModeDesc: 'लाइट और डार्क इंटरफ़ेस के बीच स्विच करें।',
        language: 'भाषा', languageDesc: 'पूरे ऐप्लिकेशन की भाषा चुनें।',
        selectLanguage: 'भाषा चुनें', saveSettings: 'सेटिंग्स सहेजें', saved: 'सहेजा गया!',
        lightMode: 'लाइट मोड',
        welcomeHome: 'घर में आपका स्वागत है,', protocolStatus: 'प्रोटोकॉल स्थिति: सक्रिय',
        enterDashboard: 'डैशबोर्ड दर्ज करें', roadmapComplete: 'रोडमैप पूर्ण',
    },
    pt: {
        overview: 'Visão geral', arrivalEngine: 'Motor de chegada', pulse: 'Pulso',
        documents: 'Documentos', career: 'Carreira', family: 'Família',
        community: 'Comunidade', messages: 'Mensagens', settings: 'Configurações',
        settingsTitle: 'Configurações', settingsSubtitle: 'Preferências do protocolo',
        appearance: 'Aparência', darkMode: 'Modo Escuro', darkModeDesc: 'Alternar entre interface clara e escura.',
        language: 'Idioma', languageDesc: 'Escolha o idioma de todo o aplicativo.',
        selectLanguage: 'Selecione um idioma', saveSettings: 'Salvar', saved: 'Salvo!',
        lightMode: 'Modo Claro',
        welcomeHome: 'Bem-vindo a casa,', protocolStatus: 'Status do protocolo: Ativo',
        enterDashboard: 'Entrar no painel', roadmapComplete: 'Roteiro concluído',
    },
    tl: {
        overview: 'Pangkalahatang-tanaw', arrivalEngine: 'Makina ng Pagdating', pulse: 'Pulso',
        documents: 'Mga Dokumento', career: 'Karera', family: 'Pamilya',
        community: 'Komunidad', messages: 'Mga Mensahe', settings: 'Mga Setting',
        settingsTitle: 'Mga Setting', settingsSubtitle: 'Mga Kagustuhan ng Protokol',
        appearance: 'Hitsura', darkMode: 'Madilim na Mode', darkModeDesc: 'Lumipat sa pagitan ng maliwanag at madilim na interface.',
        language: 'Wika', languageDesc: 'Piliin ang wika para sa buong application.',
        selectLanguage: 'Pumili ng wika', saveSettings: 'I-save', saved: 'Nai-save!',
        lightMode: 'Maliwanag na Mode',
        welcomeHome: 'Maligayang pagdating,', protocolStatus: 'Katayuan ng Protokol: Aktibo',
        enterDashboard: 'Pumasok sa dashboard', roadmapComplete: 'Kumpleto ang Roadmap',
    },
    pa: {
        overview: 'ਸੰਖੇਪ ਜਾਣਕਾਰੀ', arrivalEngine: 'ਪਹੁੰਚਣ ਦਾ ਇੰਜਣ', pulse: 'ਪਲਸ',
        documents: 'ਦਸਤਾਵੇਜ਼', career: 'ਕਰੀਅਰ', family: 'ਪਰਿਵਾਰ',
        community: 'ਭਾਈਚਾਰਾ', messages: 'ਸੁਨੇਹੇ', settings: 'ਸੈਟਿੰਗਾਂ',
        settingsTitle: 'ਸੈਟਿੰਗਾਂ', settingsSubtitle: 'ਪ੍ਰੋਟੋਕੋਲ ਤਰਜੀਹਾਂ',
        appearance: 'ਦਿੱਖ', darkMode: 'ਡਾਰਕ ਮੋਡ', darkModeDesc: 'ਲਾਈਟ ਅਤੇ ਡਾਰਕ ਮੋਡ ਵਿਚਕਾਰ ਬਦਲੋ।',
        language: 'ਭਾਸ਼ਾ', languageDesc: 'ਪੂਰੀ ਐਪਲੀਕੇਸ਼ਨ ਲਈ ਭਾਸ਼ਾ ਚੁਣੋ।',
        selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ', saveSettings: 'ਸੈਟਿੰਗਾਂ ਸੇਵ ਕਰੋ', saved: 'ਸੇਵ ਹੋ ਗਿਆ!',
        lightMode: 'ਲਾਈਟ ਮੋਡ',
        welcomeHome: 'ਜੀ ਆਇਆਂ ਨੂੰ,', protocolStatus: 'ਪ੍ਰੋਟੋਕੋਲ ਸਥਿਤੀ: ਸਰਗਰਮ',
        enterDashboard: 'ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਜਾਓ', roadmapComplete: 'ਰੋਡਮੈਪ ਪੂਰਾ',
    },
    it: {
        overview: 'Panoramica', arrivalEngine: 'Motore di Arrivo', pulse: 'Pulsazioni',
        documents: 'Documenti', career: 'Carriera', family: 'Famiglia',
        community: 'Comunità', messages: 'Messaggi', settings: 'Impostazioni',
        settingsTitle: 'Impostazioni', settingsSubtitle: 'Preferenze Protocollo',
        appearance: 'Aspetto', darkMode: 'Modalità Scura', darkModeDesc: 'Passa tra interfaccia chiara e scura.',
        language: 'Lingua', languageDesc: "Scegli la lingua per l'intera applicazione.",
        selectLanguage: 'Seleziona una lingua', saveSettings: 'Salva', saved: 'Salvato!',
        lightMode: 'Modalità Chiara',
        welcomeHome: 'Bentornato a casa,', protocolStatus: 'Stato Protocollo: Attivo',
        enterDashboard: 'Vai alla dashboard', roadmapComplete: 'Tabella di marcia completata',
    },
    de: {
        overview: 'Übersicht', arrivalEngine: 'Ankunfts-Engine', pulse: 'Puls',
        documents: 'Dokumente', career: 'Karriere', family: 'Familie',
        community: 'Gemeinschaft', messages: 'Nachrichten', settings: 'Einstellungen',
        settingsTitle: 'Einstellungen', settingsSubtitle: 'Protokollpräferenzen',
        appearance: 'Erscheinungsbild', darkMode: 'Dunkelmodus', darkModeDesc: 'Wechseln Sie zwischen heller und dunkler Oberfläche.',
        language: 'Sprache', languageDesc: 'Wählen Sie die Sprache für die gesamte Anwendung.',
        selectLanguage: 'Sprache auswählen', saveSettings: 'Speichern', saved: 'Gespeichert!',
        lightMode: 'Heller Modus',
        welcomeHome: 'Willkommen zuhause,', protocolStatus: 'Protokollstatus: Aktiv',
        enterDashboard: 'Zum Dashboard', roadmapComplete: 'Fahrplan abgeschlossen',
    },
};

export const LANGUAGE_NAMES: Record<Language, string> = {
    en: 'English',
    fr: 'Français',
    zh: '中文',
    pa: 'ਪੰਜਾਬੀ',
    es: 'Español',
    ar: 'العربية',
    tl: 'Filipino',
    it: 'Italiano',
    de: 'Deutsch',
    pt: 'Português',
    hi: 'हिन्दी',
};

interface AppContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    darkMode: boolean;
    setDarkMode: (dark: boolean) => void;
    t: Translations;
}

const AppContext = createContext<AppContextType>({
    language: 'en',
    setLanguage: () => { },
    darkMode: false,
    setDarkMode: () => { },
    t: translations.en,
});

// Maps our language codes to Google Translate's cookie format
const GT_LANG_MAP: Record<Language, string | null> = {
    en: null, // null = restore English
    fr: '/en/fr', zh: '/en/zh-CN', pa: '/en/pa',
    es: '/en/es', ar: '/en/ar', tl: '/en/tl', it: '/en/it',
    de: '/en/de', pt: '/en/pt', hi: '/en/hi',
};

const setGTCookie = (value: string | null) => {
    const expiry = value ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    const val = value ?? '';
    document.cookie = `googtrans=${val}${expiry}; path=/`;
    document.cookie = `googtrans=${val}${expiry}; path=/; domain=${window.location.hostname}`;
};

const triggerGoogleTranslate = (lang: Language) => {
    const gtValue = GT_LANG_MAP[lang];
    setGTCookie(gtValue);
    window.location.reload();
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('app-language') as Language) || 'en';
    });
    const [darkMode, setDarkModeState] = useState(() => {
        return localStorage.getItem('app-dark-mode') === 'true';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app-language', lang);
        triggerGoogleTranslate(lang);
    };

    const setDarkMode = (dark: boolean) => {
        setDarkModeState(dark);
        localStorage.setItem('app-dark-mode', String(dark));
    };

    // Apply dark class to <html> element
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Apply RTL for Arabic
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    return (
        <AppContext.Provider value={{ language, setLanguage, darkMode, setDarkMode, t: translations[language] }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
