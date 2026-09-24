import React, { useState, useEffect, useRef } from 'react';
import { Language, NavigationTab, UserSession, ManagedLanguage } from '../types';
import { translations } from '../data/translations';
import { 
  Home,
  Sparkles, 
  HeartHandshake, 
  User, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut,
  ShieldCheck,
  Lock,
  Settings,
  Users,
  Globe,
  Check,
  Bell,
  Heart,
  MessageCircle,
  HelpCircle,
  Search,
  CheckCircle2,
  Calendar,
  Award,
  ShieldAlert
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { HelpSupportModal } from './HelpSupportModal';

export const LANGUAGES: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'zh', label: '中文', flag: '🇨🇳', nativeName: '中文 (简体)' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
];

export interface AppNotification {
  id: string;
  type: 'proposal' | 'wali' | 'message' | 'badge' | 'security';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  timeAr: string;
  timeEn: string;
  isRead: boolean;
  actionTab?: NavigationTab;
  actionCategory?: 'privacy' | 'security' | 'account' | 'wali';
}

interface NavbarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  openCreateBioModal: () => void;
  openLoginModal: (defaultTab?: 'login' | 'register') => void;
  pendingProposalsCount: number;
  currentSession?: UserSession;
  onSelectSession?: (session: UserSession) => void;
  adminAlertsCount?: number;
  onLogout?: () => void;
  availableLanguages?: ManagedLanguage[];
  onOpenSettingsCategory?: (category: 'privacy' | 'security' | 'account' | 'wali') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  currentLang,
  onLangChange,
  openCreateBioModal,
  openLoginModal,
  pendingProposalsCount,
  currentSession,
  onSelectSession,
  adminAlertsCount = 0,
  onLogout,
  availableLanguages,
  onOpenSettingsCategory
}) => {
  const t = translations[currentLang] || translations.ar;
  const isAr = currentLang === 'ar';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Notifications State with realistic Islamic matrimonial alerts
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'proposal',
      titleAr: 'طلب خطوبة شرعي جديد',
      titleEn: 'New Formal Proposal',
      descAr: 'تقدم خاطب موثق بطلب خطوبة رسمي وموافقة الولي بانتظار المراجعة',
      descEn: 'A verified suitor submitted a proposal with Wali oversight awaiting review',
      timeAr: 'منذ ١٠ دقائق',
      timeEn: '10 min ago',
      isRead: false,
      actionTab: 'activity'
    },
    {
      id: 'notif-2',
      type: 'wali',
      titleAr: 'اعتماد الولي الشرعي',
      titleEn: 'Wali Verification Approved',
      descAr: 'تم توثيق بيانات الولي الشرعي بنجاح وتفعيل مجلس الرؤية والمراسلة المأمونة',
      descEn: 'Wali details verified successfully; Sharia council active',
      timeAr: 'منذ ساعتين',
      timeEn: '2 hrs ago',
      isRead: false,
      actionTab: 'wali'
    },
    {
      id: 'notif-3',
      type: 'message',
      titleAr: 'رسالة جديدة في مجلس الرؤية',
      titleEn: 'New Message in Vision Council',
      descAr: 'وصلتكم رسالة استفسار جديدة في مجلس الرؤية الشرعية بإشراف الولي',
      descEn: 'You received a message in the supervised council chat',
      timeAr: 'منذ يوم',
      timeEn: '1 day ago',
      isRead: true,
      actionTab: 'messages'
    },
    {
      id: 'notif-4',
      type: 'badge',
      titleAr: 'وسام التوثيق الشرعي 🌟',
      titleEn: 'New Profile Achievement 🌟',
      descAr: 'مبارك! حصل ملفك على وسام التوثيق والالتزام الديني الراسخ',
      descEn: 'Congratulations! You earned the Sharia Verified profile badge',
      timeAr: 'منذ يومين',
      timeEn: '2 days ago',
      isRead: true,
      actionTab: 'profile'
    }
  ]);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setIsNotificationsOpen(false);

    if (notif.actionTab) {
      if (notif.actionTab === 'wali') {
        if (onOpenSettingsCategory) {
          onOpenSettingsCategory('wali');
        } else {
          onTabChange('wali');
        }
      } else {
        onTabChange(notif.actionTab);
      }
    }
  };

  // Close dropdowns on outside click
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active languages enabled by Admin
  const activeLanguageOptions = availableLanguages && availableLanguages.length > 0
    ? availableLanguages.filter(l => l.isEnabled).map(l => ({
        code: l.code,
        label: l.nameNative || l.nameAr,
        flag: l.flag,
        nativeName: l.nameNative
      }))
    : LANGUAGES;

  const isLoggedIn = Boolean(currentSession && currentSession.role !== 'guest');
  const isAdmin = Boolean(currentSession && currentSession.role === 'admin');

  // Helper to scroll smoothly to a section on landing page
  const scrollToHomeSection = (sectionId: string) => {
    if (currentTab !== 'home') {
      onTabChange('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // User First Name (e.g. "عمر" from "عمر السعيد")
  const userFirstName = currentSession?.name
    ? currentSession.name.trim().split(' ')[0]
    : (isAr ? 'عمر' : 'Omar');

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#ede5dd] font-cairo w-full transition-colors select-none">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* 1. BRAND LOGO (الشعار) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              id="brand-logo-btn"
              onClick={() => {
                if (isLoggedIn) {
                  onTabChange('explore');
                } else {
                  onTabChange('home');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                fireCelebrationConfetti();
              }}
              className="group flex items-center gap-3 text-start cursor-pointer focus:outline-none select-none"
              title="منصة نكاح للزواج الإسلامي الشرعي"
            >
              {/* Dual Intertwined Heart Logo Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6 text-[#9b4c2e]"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5.5c-.8.8-1.5 1.5-2 2.5" />
                </svg>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 leading-none font-display">
                  {isAr ? 'نكاح' : 'Nikah'}
                </span>
                <span className="text-xs text-neutral-500 font-medium tracking-wide mt-1">
                  {isAr ? 'موقع زواج إسلامي' : 'Islamic Matrimonial Portal'}
                </span>
              </div>
            </button>
          </div>

          {/* 2. NAVIGATION BAR (التنقل الرئيسي) */}
          {/* CASE A: BEFORE LOGIN (قبل تسجيل الدخول: الرئيسية | كيف يعمل | الأمان والخصوصية | قصص الزواج) */}
          {!isLoggedIn ? (
            <nav 
              aria-label="التنقل الرئيسي قبل تسجيل الدخول"
              className="hidden md:flex items-center gap-6 lg:gap-8"
            >
              <button
                id="nav-link-home"
                onClick={() => {
                  onTabChange('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-sm lg:text-base font-semibold transition pb-1 border-b-2 cursor-pointer ${
                  currentTab === 'home' 
                    ? 'border-[#9b4c2e] text-[#9b4c2e]' 
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
              >
                {isAr ? 'الرئيسية' : 'Home'}
              </button>

              <button
                id="nav-link-how-it-works"
                onClick={() => scrollToHomeSection('how-it-works-section')}
                className="text-sm lg:text-base font-semibold transition pb-1 border-b-2 border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 cursor-pointer"
              >
                {isAr ? 'كيف يعمل' : 'How it Works'}
              </button>

              <button
                id="nav-link-safety-privacy"
                onClick={() => scrollToHomeSection('sharia-pillars-section')}
                className="text-sm lg:text-base font-semibold transition pb-1 border-b-2 border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 cursor-pointer"
              >
                {isAr ? 'الأمان والخصوصية' : 'Safety & Privacy'}
              </button>

              <button
                id="nav-link-marriage-stories"
                onClick={() => scrollToHomeSection('marriage-stories-section')}
                className="text-sm lg:text-base font-semibold transition pb-1 border-b-2 border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300 cursor-pointer"
              >
                {isAr ? 'قصص الزواج' : 'Marriage Stories'}
              </button>
            </nav>
          ) : (
            /* CASE B: AFTER LOGIN (بعد تسجيل الدخول: نظيف وعصري -> اكتشف | المطابقات | الرسائل | المفضلة) */
            <nav 
              aria-label="التنقل الرئيسي بعد تسجيل الدخول"
              className="hidden md:flex items-center gap-6 lg:gap-8"
            >
              {/* اكتشف / البحث عن شريك */}
              <button
                id="nav-link-explore"
                onClick={() => onTabChange('explore')}
                className={`text-sm lg:text-base font-semibold transition pb-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'explore' 
                    ? 'border-[#9b4c2e] text-[#9b4c2e]' 
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                title={isAr ? 'البحث عن شريك واستعراض السير' : 'Explore candidates'}
              >
                <Search className="w-4 h-4 opacity-70" />
                <span>{isAr ? 'اكتشف' : 'Explore'}</span>
              </button>

              {/* المطابقات */}
              <button
                id="nav-link-matches"
                onClick={() => onTabChange('activity')}
                className={`text-sm lg:text-base font-semibold transition pb-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'activity' || currentTab === 'proposals'
                    ? 'border-[#9b4c2e] text-[#9b4c2e]' 
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                title={isAr ? 'طلبات الخطوبة والمطابقات الشرعية' : 'Matches & Proposals'}
              >
                <HeartHandshake className="w-4 h-4 opacity-70" />
                <span>{isAr ? 'المطابقات' : 'Matches'}</span>
                {pendingProposalsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#9b4c2e] text-white text-[11px] font-mono font-bold leading-tight">
                    {pendingProposalsCount}
                  </span>
                )}
              </button>

              {/* الرسائل */}
              <button
                id="nav-link-messages"
                onClick={() => onTabChange('messages')}
                className={`text-sm lg:text-base font-semibold transition pb-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'messages' 
                    ? 'border-[#9b4c2e] text-[#9b4c2e]' 
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                title={isAr ? 'مراسلات ومجالس الرؤية الشرعية' : 'Messages'}
              >
                <MessageCircle className="w-4 h-4 opacity-70" />
                <span>{isAr ? 'الرسائل' : 'Messages'}</span>
              </button>

              {/* المفضلة (معروضة بجمالية في الشاشات الأكبر) */}
              <button
                id="nav-link-favorites"
                onClick={() => onTabChange('favorites')}
                className={`hidden xl:flex text-sm lg:text-base font-semibold transition pb-1 border-b-2 items-center gap-1.5 cursor-pointer ${
                  currentTab === 'favorites' 
                    ? 'border-[#9b4c2e] text-[#9b4c2e]' 
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                title={isAr ? 'السير المحفوظة في المفضلة' : 'Favorite Profiles'}
              >
                <Heart className="w-4 h-4 opacity-70" />
                <span>{isAr ? 'المفضلة' : 'Favorites'}</span>
              </button>

              {/* Admin badge if admin */}
              {isAdmin && (
                <button
                  id="admin-nav-quick-link"
                  onClick={() => onTabChange('admin')}
                  className={`text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer ${
                    currentTab === 'admin'
                      ? 'bg-[#9b4c2e] text-white border-[#9b4c2e]'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {isAr ? 'لوحة الإشراف الشرعي' : 'Admin Panel'}
                </button>
              )}
            </nav>
          )}

          {/* 3. ACTION CONTROLS (منطقة الأزرار والحساب) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* SUB-CASE A: BEFORE LOGIN (🌐 عربي | تسجيل الدخول | إنشاء حساب) */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* 🌐 Language Dropdown (عربي) */}
                <div className="relative" ref={langRef}>
                  <button
                    id="header-lang-btn-guest"
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-2 text-neutral-700 text-xs sm:text-sm font-medium hover:text-neutral-950 transition rounded-xl hover:bg-black/5 cursor-pointer select-none"
                    title="تغيير اللغة"
                    aria-expanded={isLangDropdownOpen}
                  >
                    <Globe className="w-4 h-4 text-neutral-500" />
                    <span>{activeLanguageOptions.find(l => l.code === currentLang)?.label || 'عربي'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLangDropdownOpen && (
                    <div className="absolute end-0 mt-2 w-48 bg-white border border-neutral-200 rounded-2xl p-2 z-50 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-xs text-neutral-400 border-b border-neutral-100 mb-1">
                        اختر اللغة
                      </div>
                      <div className="space-y-0.5">
                        {activeLanguageOptions.map((langItem) => {
                          const isSelected = currentLang === langItem.code;
                          return (
                            <button
                              key={langItem.code}
                              onClick={() => {
                                onLangChange(langItem.code);
                                setIsLangDropdownOpen(false);
                              }}
                              className={`w-full text-start px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold transition cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#fdf6f0] text-[#9b4c2e]' 
                                  : 'text-neutral-700 hover:bg-neutral-50'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{langItem.flag}</span>
                                <span>{langItem.label}</span>
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-[#9b4c2e]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* تسجيل الدخول (Outlined) */}
                <button
                  id="header-login-btn"
                  onClick={() => openLoginModal('login')}
                  className="rounded-2xl border border-[#c4b5a5] text-neutral-800 bg-white/70 hover:bg-white px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-3xs"
                >
                  {isAr ? 'تسجيل الدخول' : 'Log In'}
                </button>

                {/* إنشاء حساب (Solid Terracotta) */}
                <button
                  id="header-register-btn"
                  onClick={() => openLoginModal('register')}
                  className="rounded-2xl bg-[#9b4c2e] hover:bg-[#853e24] text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
                >
                  {isAr ? 'إنشاء حساب' : 'Create Account'}
                </button>
              </div>
            ) : (
              /* SUB-CASE B: AFTER LOGIN (🔔 | 👤 عمر ▾ + Dropdown) */
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Language Switcher Compact Icon */}
                <div className="relative hidden sm:block" ref={langRef}>
                  <button
                    id="header-lang-btn-user"
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="p-2 text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-black/5 transition cursor-pointer"
                    title="تغيير اللغة"
                  >
                    <Globe className="w-4 h-4" />
                  </button>

                  {isLangDropdownOpen && (
                    <div className="absolute end-0 mt-2 w-44 bg-white border border-neutral-200 rounded-2xl p-1.5 z-50 shadow-xl">
                      <div className="space-y-0.5">
                        {activeLanguageOptions.map((langItem) => (
                          <button
                            key={langItem.code}
                            onClick={() => {
                              onLangChange(langItem.code);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full text-start px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                              currentLang === langItem.code ? 'bg-[#fdf6f0] text-[#9b4c2e]' : 'text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{langItem.flag}</span>
                              <span>{langItem.label}</span>
                            </span>
                            {currentLang === langItem.code && <Check className="w-3.5 h-3.5 text-[#9b4c2e]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 🔔 NOTIFICATIONS ICON & POPOVER (الإشعارات) */}
                <div className="relative" ref={notifRef}>
                  <button
                    id="header-notifications-btn"
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center transition cursor-pointer ${
                      isNotificationsOpen
                        ? 'border-[#9b4c2e] bg-[#fdf6f0] text-[#9b4c2e]'
                        : 'border-[#ede5dd] bg-white text-neutral-700 hover:text-[#9b4c2e] hover:border-[#9b4c2e]/40 shadow-3xs'
                    }`}
                    title={isAr ? 'الإشعارات والتنبيهات الشرعية' : 'Notifications'}
                    aria-expanded={isNotificationsOpen}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-[#9b4c2e] text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute end-0 mt-2 w-80 sm:w-96 bg-white border border-[#ede5dd] rounded-3xl p-3 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* Notifications Header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-900">
                            {isAr ? 'الإشعارات' : 'Notifications'}
                          </span>
                          {unreadNotifsCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                              {unreadNotifsCount} {isAr ? 'جديدة' : 'new'}
                            </span>
                          )}
                        </div>

                        {unreadNotifsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotifsRead}
                            className="text-xs font-semibold text-[#9b4c2e] hover:underline cursor-pointer"
                          >
                            {isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="mt-2 space-y-1.5 max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => {
                            return (
                              <button
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`w-full text-start p-3 rounded-2xl flex items-start gap-3 transition cursor-pointer border ${
                                  !notif.isRead 
                                    ? 'bg-[#faf8f5] border-[#ede5dd]' 
                                    : 'bg-white border-transparent hover:bg-neutral-50'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                  notif.type === 'proposal' 
                                    ? 'bg-[#fbf1eb] text-[#9b4c2e]' 
                                    : notif.type === 'wali'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : notif.type === 'badge'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-sky-50 text-sky-700'
                                }`}>
                                  {notif.type === 'proposal' && <HeartHandshake className="w-4 h-4" />}
                                  {notif.type === 'wali' && <ShieldCheck className="w-4 h-4" />}
                                  {notif.type === 'message' && <MessageCircle className="w-4 h-4" />}
                                  {notif.type === 'badge' && <Award className="w-4 h-4" />}
                                  {notif.type === 'security' && <Lock className="w-4 h-4" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className={`text-xs font-bold truncate ${!notif.isRead ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                      {isAr ? notif.titleAr : notif.titleEn}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                                      {isAr ? notif.timeAr : notif.timeEn}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-snug">
                                    {isAr ? notif.descAr : notif.descEn}
                                  </p>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-6 text-center text-xs text-neutral-400">
                            {isAr ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications'}
                          </div>
                        )}
                      </div>

                      {/* Footer Tip */}
                      <div className="pt-2 mt-2 border-t border-neutral-100 px-3 text-center">
                        <span className="text-[10px] text-neutral-400">
                          {isAr ? 'إشعارات مؤتمتة وموثقة بضوابط الشريعة' : 'Sharia verified notification system'}
                        </span>
                      </div>

                    </div>
                  )}
                </div>

                {/* 👤 USER AVATAR & DROPDOWN MENU (👤 عمر ▾) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="header-user-dropdown-btn"
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                      setIsNotificationsOpen(false);
                    }}
                    className={`flex items-center gap-2 ps-2 pe-3 py-1.5 rounded-2xl border transition cursor-pointer select-none ${
                      isUserDropdownOpen
                        ? 'border-[#9b4c2e] bg-[#fdf6f0] text-[#9b4c2e]'
                        : 'border-[#ede5dd] bg-white text-neutral-800 hover:border-[#9b4c2e]/40 shadow-3xs'
                    }`}
                    title="قائمة الحساب"
                    aria-expanded={isUserDropdownOpen}
                  >
                    {/* User Avatar Circle with Online Dot */}
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-[#fdf6f0] text-[#9b4c2e] border border-[#f4dfd4] flex items-center justify-center font-bold text-xs">
                        {currentSession?.avatar ? (
                          <img 
                            src={currentSession.avatar} 
                            alt={currentSession.name} 
                            className="w-full h-full rounded-full object-cover" 
                          />
                        ) : (
                          userFirstName.charAt(0)
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -end-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    </div>

                    {/* User First Name + Chevron */}
                    <span className="text-xs sm:text-sm font-bold text-neutral-800 max-w-[100px] truncate">
                      {userFirstName}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180 text-[#9b4c2e]' : ''}`} />
                  </button>

                  {/* EXACT DROPDOWN MENU REQUESTED BY USER */}
                  {isUserDropdownOpen && (
                    <div className="absolute end-0 mt-2 w-64 bg-white border border-[#ede5dd] rounded-3xl p-2 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* 1. User Header Badge */}
                      <div className="p-3 bg-[#faf8f5] rounded-2xl border border-[#ede5dd] mb-1.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          {userFirstName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {currentSession?.name || userFirstName}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded-full mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isAdmin ? 'مشرف شرعي' : 'خاطب موثق'}</span>
                          </span>
                        </div>
                      </div>

                      {/* 2. Menu Links */}
                      <div className="space-y-0.5 text-xs">
                        
                        {/* لوحة تحكم الإدارة الكاملة للمشرف */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              window.history.pushState(null, '', '/admin');
                              window.dispatchEvent(new PopStateEvent('popstate'));
                              onTabChange('admin');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-start px-3 py-2.5 rounded-xl flex items-center gap-2.5 font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition cursor-pointer border border-amber-200 mb-1"
                          >
                            <ShieldAlert className="w-4 h-4 text-[#9b4c2e]" />
                            <span>{isAr ? 'لوحة تحكم الإدارة الكاملة (/admin)' : 'Admin Dashboard'}</span>
                          </button>
                        )}

                        {/* ملفي الشخصي */}
                        <button
                          type="button"
                          onClick={() => {
                            onTabChange('profile');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-start px-3 py-2.5 rounded-xl flex items-center gap-2.5 font-bold text-neutral-700 hover:text-[#9b4c2e] hover:bg-[#fdf6f0] transition cursor-pointer"
                        >
                          <User className="w-4 h-4 text-neutral-400 group-hover:text-[#9b4c2e]" />
                          <span>{isAr ? 'ملفي الشخصي' : 'My Profile'}</span>
                        </button>

                        {/* إعدادات الحساب */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenSettingsCategory) {
                              onOpenSettingsCategory('account');
                            } else {
                              onTabChange('settings');
                            }
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-start px-3 py-2.5 rounded-xl flex items-center gap-2.5 font-bold text-neutral-700 hover:text-[#9b4c2e] hover:bg-[#fdf6f0] transition cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-neutral-400" />
                          <span>{isAr ? 'إعدادات الحساب' : 'Account Settings'}</span>
                        </button>

                        {/* الخصوصية */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenSettingsCategory) {
                              onOpenSettingsCategory('privacy');
                            } else {
                              onTabChange('settings');
                            }
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-start px-3 py-2.5 rounded-xl flex items-center gap-2.5 font-bold text-neutral-700 hover:text-[#9b4c2e] hover:bg-[#fdf6f0] transition cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-neutral-400" />
                          <span>{isAr ? 'الخصوصية' : 'Privacy'}</span>
                        </button>

                        {/* الأمان */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenSettingsCategory) {
                              onOpenSettingsCategory('security');
                            } else {
                              onTabChange('settings');
                            }
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-start px-3 py-2.5 rounded-xl flex items-center gap-2.5 font-bold text-neutral-700 hover:text-[#9b4c2e] hover:bg-[#fdf6f0] transition cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-neutral-400" />
                          <span>{isAr ? 'الأمان' : 'Security'}</span>
                        </button>

                        {/* ولي الأمر / العائلة */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenSettingsCategory) {
                              onOpenSettingsCategory('wali');
                            } else {
                              onTabChange('wali');
                            }
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-start px-3 py-2.5 rounded-xl flex items-center gap-2.5 font-bold text-neutral-700 hover:text-[#9b4c2e] hover:bg-[#fdf6f0] transition cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-neutral-400" />
                          <span>{isAr ? 'ولي الأمر / العائلة' : 'Wali / Family Portal'}</span>
                        </button>

                        {/* المساعدة */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsHelpModalOpen(true);
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-start px-3 py-2.5 rounded-xl flex items-center gap-2.5 font-bold text-neutral-700 hover:text-[#9b4c2e] hover:bg-[#fdf6f0] transition cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-neutral-400" />
                          <span>{isAr ? 'المساعدة' : 'Help & Support'}</span>
                        </button>

                        {/* Divider */}
                        <div className="my-1.5 border-t border-neutral-100" />

                        {/* تسجيل الخروج */}
                        {onLogout && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full text-start px-3 py-2 rounded-xl flex items-center gap-2.5 font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                          </button>
                        )}

                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-2xl border border-[#ede5dd] bg-white flex items-center justify-center text-neutral-800 hover:bg-neutral-50 cursor-pointer shadow-3xs"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* MOBILE DRAWER MENU (القائمة المتجاوبة للشاشات الصغيرة) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#ede5dd] bg-white p-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
            
            {/* If Logged In: Show User Profile Card */}
            {isLoggedIn ? (
              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ede5dd] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {userFirstName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{currentSession?.name || userFirstName}</h4>
                    <span className="text-[11px] text-emerald-700 font-semibold">{isAr ? 'خاطب موثق شرعياً' : 'Verified Member'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsHelpModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white border border-[#ede5dd] flex items-center justify-center text-neutral-600"
                  title="المساعدة"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* Navigation Links inside Mobile Drawer */}
            <div className="space-y-1">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      onTabChange('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-3 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2"
                  >
                    <Home className="w-4 h-4 text-[#9b4c2e]" />
                    <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                  </button>

                  <button
                    onClick={() => {
                      scrollToHomeSection('how-it-works-section');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-3 px-3 text-sm font-bold text-neutral-700 border-b border-neutral-100 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#9b4c2e]" />
                    <span>{isAr ? 'كيف يعمل' : 'How it Works'}</span>
                  </button>

                  <button
                    onClick={() => {
                      scrollToHomeSection('sharia-pillars-section');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-3 px-3 text-sm font-bold text-neutral-700 border-b border-neutral-100 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#9b4c2e]" />
                    <span>{isAr ? 'الأمان والخصوصية' : 'Safety & Privacy'}</span>
                  </button>

                  <button
                    onClick={() => {
                      scrollToHomeSection('marriage-stories-section');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-3 px-3 text-sm font-bold text-neutral-700 border-b border-neutral-100 flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-[#9b4c2e]" />
                    <span>{isAr ? 'قصص الزواج' : 'Marriage Stories'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onTabChange('explore');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <Search className="w-4 h-4 text-[#9b4c2e]" />
                    <span>{isAr ? 'اكتشف / البحث عن شريك' : 'Explore candidates'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('activity');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-[#9b4c2e]" />
                      <span>{isAr ? 'المطابقات' : 'Matches'}</span>
                    </span>
                    {pendingProposalsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#9b4c2e] text-white text-xs font-mono font-bold">
                        {pendingProposalsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('messages');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <MessageCircle className="w-4 h-4 text-[#9b4c2e]" />
                    <span>{isAr ? 'الرسائل' : 'Messages'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('favorites');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{isAr ? 'المفضلة' : 'Favorites'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-[#9b4c2e]" />
                    <span>{isAr ? 'ملفي الشخصي' : 'My Profile'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenSettingsCategory) {
                        onOpenSettingsCategory('account');
                      } else {
                        onTabChange('settings');
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-neutral-500" />
                    <span>{isAr ? 'إعدادات الحساب' : 'Account Settings'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenSettingsCategory) {
                        onOpenSettingsCategory('privacy');
                      } else {
                        onTabChange('settings');
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <Lock className="w-4 h-4 text-neutral-500" />
                    <span>{isAr ? 'الخصوصية' : 'Privacy'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenSettingsCategory) {
                        onOpenSettingsCategory('security');
                      } else {
                        onTabChange('settings');
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-neutral-500" />
                    <span>{isAr ? 'الأمان' : 'Security'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenSettingsCategory) {
                        onOpenSettingsCategory('wali');
                      } else {
                        onTabChange('wali');
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'ولي الأمر / العائلة' : 'Wali / Family'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsHelpModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-start py-2.5 px-3 text-sm font-bold text-neutral-900 border-b border-neutral-100 flex items-center gap-2.5"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>{isAr ? 'المساعدة' : 'Help & Support'}</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Language Switcher */}
            <div className="bg-[#faf8f5] p-3 rounded-2xl border border-[#ede5dd]">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-2">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{isAr ? 'لغة المنصة' : 'Platform Language'}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">{currentLang}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {activeLanguageOptions.map((langItem) => {
                  const isSelected = currentLang === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      onClick={() => {
                        onLangChange(langItem.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`py-2 px-1 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                        isSelected 
                          ? 'border-[#9b4c2e] bg-[#9b4c2e] text-white shadow-2xs' 
                          : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <span>{langItem.flag}</span>
                      <span className="truncate">{langItem.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Bottom Actions (Login / Register / Logout) */}
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    openLoginModal('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-3 text-sm font-bold rounded-2xl border border-[#c4b5a5] text-neutral-800 bg-white hover:bg-neutral-50 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الدخول' : 'Log In'}</span>
                </button>
                <button
                  onClick={() => {
                    openLoginModal('register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-3 text-sm font-bold rounded-2xl bg-[#9b4c2e] hover:bg-[#853e24] text-white flex items-center justify-center gap-2 shadow-2xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isAr ? 'إنشاء حساب' : 'Create Account'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 text-sm font-bold rounded-2xl border border-red-200 bg-red-50 text-red-700 flex items-center justify-center gap-2 hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
              </button>
            )}

          </div>
        )}

      </header>

      {/* Interactive Help & Support Modal */}
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        lang={currentLang}
        onGoToFaq={() => scrollToHomeSection('faq-section')}
      />
    </>
  );
};
