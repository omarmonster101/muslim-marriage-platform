import React, { useState, useEffect } from 'react';
import { 
  Language, 
  NavigationTab, 
  Profile, 
  Proposal, 
  UserSettings, 
  CelebrationInvitation, 
  Gender, 
  PrayerHabit, 
  MaritalStatus, 
  UserSession, 
  GlobalSiteSettings, 
  LocalizationConfig,
  PhotoPermissionRequest
} from './types';
import { translations } from './data/translations';
import { mockProfiles, mockCelebrations } from './data/mockProfiles';
import { DEFAULT_LOCALIZATION_CONFIG } from './data/defaultLocalizationData';
import { 
  auth,
  saveProfileToDb,
  fetchProfilesFromDb,
  saveProposalToDb,
  fetchProposalsFromDb,
  saveCelebrationToDb,
  logoutUser,
  subscribeToProfiles,
  subscribeToProposals,
  subscribeToCelebrations,
  saveUserSettingsToDb,
  fetchUserSettingsFromDb,
  subscribeToPageSettings,
  subscribeToSitePages,
  subscribeToGlobalSiteSettings,
  subscribeToLocalizationConfig,
  subscribeToRealPlatformStats,
  DEFAULT_PAGE_LAYOUT_SETTINGS,
  DEFAULT_GLOBAL_SITE_SETTINGS
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GuestIslamicHome } from './components/GuestIslamicHome';
import { LatestProfilesSection } from './components/LatestProfilesSection';
import { FilterBar } from './components/FilterBar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileModal } from './components/ProfileModal';
import { CreateProfileModal } from './components/CreateProfileModal';
import { LoginModal } from './components/LoginModal';
import { RegisterPage } from './components/RegisterPage';
import { WaliPortal } from './components/WaliPortal';
import { ProposalsView } from './components/ProposalsView';
import { AiCounselorView } from './components/AiCounselorView';
import { CelebrationsView } from './components/CelebrationsView';
import { SettingsView, SettingsCategoryTab } from './components/SettingsView';
import { ApiDocumentationView } from './components/ApiDocumentationView';
import { Footer } from './components/Footer';
import { RoleSwitcher, availableSessions } from './components/RoleSwitcher';
import { SupervisedChatModal } from './components/SupervisedChatModal';
import { ScheduleMeetingModal } from './components/ScheduleMeetingModal';
import { NikahContractModal } from './components/NikahContractModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { MemberProfileView } from './components/MemberProfileView';
import { IslamicStar, IslamicDivider, IslamicCorner, IslamicArchOrnament } from './components/IslamicOrnaments';
import { MarriagePreferencesModal } from './components/MarriagePreferencesModal';
import { MarriageRequestModal } from './components/MarriageRequestModal';
import { RequestPhotoPermissionModal } from './components/RequestPhotoPermissionModal';
import { ProfileDetailsPage } from './components/ProfileDetailsPage';
import { ReportModal } from './components/ReportModal';
import { BlockModal } from './components/BlockModal';
import { ActiveExploreView } from './components/FilterBar';
import { MarriagePreferences, PageLayoutSettings } from './types';
import { AdminPageItem, INITIAL_PAGES_LIST } from './data/adminSettingsData';
import { SitePageViewModal } from './components/SitePageViewModal';
import { DEFAULT_SECURITY_SETTINGS } from './data/defaultSecurityData';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.hash === '#/admin')) {
      return 'admin';
    }
    return 'home';
  });
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/admin' || window.location.hash === '#/admin';
    }
    return false;
  });

  // Handle browser back/forward and direct /admin navigation
  useEffect(() => {
    const handlePopState = () => {
      const isAtAdmin = window.location.pathname === '/admin' || window.location.hash === '#/admin';
      setIsAdminRoute(isAtAdmin);
      if (isAtAdmin) {
        setCurrentTab('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [initialSettingsCategory, setInitialSettingsCategory] = useState<SettingsCategoryTab>('privacy');

  const handleTabChange = (tab: NavigationTab) => {
    if (tab !== 'profile-details') {
      setViewedProfile(null);
    }
    if (tab === 'favorites') {
      setActiveExploreView('favorites');
      setCurrentTab('explore');
      return;
    }
    if (tab === 'messages') {
      setCurrentTab('activity');
      return;
    }
    if (tab === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
      setIsAdminRoute(true);
      setCurrentTab('admin');
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
      setIsAdminRoute(false);
      setCurrentTab(tab);
    }
  };

  const handleOpenSettingsCategory = (category: 'privacy' | 'security' | 'account' | 'wali') => {
    if (category === 'wali') {
      setCurrentTab('wali');
    } else {
      setInitialSettingsCategory(category as SettingsCategoryTab);
      setCurrentTab('settings');
    }
  };
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [celebrations, setCelebrations] = useState<CelebrationInvitation[]>(mockCelebrations);
  
  // Active identity / user session for live testing
  const [currentSession, setCurrentSession] = useState<UserSession>(availableSessions[0]);

  // Modals for interactive Sharia workflow
  const [activeChatProposal, setActiveChatProposal] = useState<Proposal | null>(null);
  const [activeMeetingProposal, setActiveMeetingProposal] = useState<Proposal | null>(null);
  const [activeNikahProposal, setActiveNikahProposal] = useState<Proposal | null>(null);

  // Proposals list
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "prop-101",
      suitorId: "prof-1",
      suitorName: "عبدالله بن فهد الشمري",
      suitorAge: 29,
      suitorCity: "الرياض",
      targetProfileId: "prof-2",
      targetProfileName: "سارة بنت أحمد الخالدي",
      waliName: "أحمد بن إبراهيم الخالدي (الوالد)",
      waliPhone: "+966 50 123 4567",
      waliStatus: "verified",
      status: "approved_by_wali",
      stage: "تمت موافقة الولي - جارٍ ترتيب الرؤية الشرعية",
      note: "السلام عليكم ورحمة الله، يشرفني التقدم لخطبة ابنتكم المصونة على كتاب الله وسنة رسوله ﷺ، ومستعد لزيارتكم في مجلسكم العامر.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      mahramSupervised: true
    },
    {
      id: "prop-102",
      suitorId: "prof-3",
      suitorName: "طارق بن عمر المنصوري",
      suitorAge: 32,
      suitorCity: "دبي",
      targetProfileId: "prof-4",
      targetProfileName: "مريم بنت سعيد الغامدي",
      waliName: "سعيد بن راشد الغامدي (الوكيل)",
      waliPhone: "+966 55 987 6543",
      waliStatus: "verified",
      status: "pending_wali_review",
      stage: "بانتظار مراجعة الولي والتحقق",
      note: "طلب خطوبة شرعي جاد، نرجو التكرم بالاطلاع على ملفي والتواصل لبدء المحادثة الشرعية.",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      mahramSupervised: true
    }
  ]);

  // Profile and user modals
  const [selectedProfileForModal, setSelectedProfileForModal] = useState<Profile | null>(null);
  const [viewedProfile, setViewedProfile] = useState<Profile | null>(null);
  const [previousTab, setPreviousTab] = useState<NavigationTab>('explore');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateBioModalOpen, setIsCreateBioModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalDefaultTab, setLoginModalDefaultTab] = useState<'login' | 'register'>('login');

  // Filter state
  const [activeExploreView, setActiveExploreView] = useState<ActiveExploreView>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | Gender>('all');
  const [selectedCountryId, setSelectedCountryId] = useState('all');
  const [selectedCityId, setSelectedCityId] = useState('all');
  const [selectedEducationId, setSelectedEducationId] = useState('all');
  const [selectedJobCategoryId, setSelectedJobCategoryId] = useState('all');
  const [selectedDistanceKm, setSelectedDistanceKm] = useState('all');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(65);
  const [sortOption, setSortOption] = useState<string>('compatibility');
  const [selectedPrayer, setSelectedPrayer] = useState<'all' | PrayerHabit>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | MaritalStatus>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Social & Moderation state
  const [favorites, setFavorites] = useState<string[]>(['prof-2', 'prof-4']);
  const [hiddenProfileIds, setHiddenProfileIds] = useState<string[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [marriageRequestProfile, setMarriageRequestProfile] = useState<Profile | null>(null);
  const [reportModalProfile, setReportModalProfile] = useState<Profile | null>(null);
  const [blockModalProfile, setBlockModalProfile] = useState<Profile | null>(null);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<MarriagePreferences | null>(null);

  // Photo Permission Requests State (طلبات كشف الصور والرؤية الشرعية)
  const [photoRequests, setPhotoRequests] = useState<PhotoPermissionRequest[]>([
    {
      id: 'req-demo-1',
      suitorId: 'prof-1',
      suitorName: 'عبدالله بن فهد الشمري',
      suitorAge: 29,
      suitorCity: 'الرياض',
      suitorJob: 'مهندس برمجيات ونظم سحابية',
      targetProfileId: 'prof-2',
      targetProfileName: 'سارة بنت أحمد الخالدي',
      message: 'السلام عليكم ورحمة الله، أود التقدم بطلب الرؤية الشرعية والصورة بإشراف الولي الكريم بعد مراجعة السيرة والتوافق القيمي.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'req-demo-2',
      suitorId: 'prof-3',
      suitorName: 'عمر بن خالد الدوسري',
      suitorAge: 31,
      suitorCity: 'الدمام',
      suitorJob: 'طبيب استشاري باطنية',
      targetProfileId: 'prof-4',
      targetProfileName: 'مريم بنت سعيد الغامدي',
      message: 'طلب استئذان شرعي للاطلاع على صورة الكريمة بعد التواصل مع الولي.',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ]);
  const [photoRequestModalProfile, setPhotoRequestModalProfile] = useState<Profile | null>(null);

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    language: 'ar',
    blurPhotosByDefault: true,
    emailAlerts: true,
    smsAlerts: true,
    waliSupervisionMandatory: true,
    chaperoneMeetingNotification: true,
    privacy: {
      blurPhotosByDefault: true,
      photoDisplayMode: 'blurred',
      requireWaliApprovalForPhotos: true,
      allowTemporaryVisionReveal: true,
      hideFromUnverifiedUsers: false,
      allowDirectWaliContact: true,
      waliContactRequirement: 'after_wali_approval',
      waliContactChannels: {
        allowPhoneCalls: true,
        allowWhatsApp: true,
        allowInAppVoiceMeeting: true
      },
      waliPreferredContactTimes: 'after_asr_to_isha',
      profileVisibility: 'verified_only',
      minMatchScoreToView: 75,
      blockSameTribeOrWorkplace: false,
      blockedFamilyOrWorkKeywords: '',
      showOnlineStatus: true,
      showLastSeen: true,
      allowMessages: 'accepted_requests_only',
      preventScreenshotsNotice: true,
      watermarkPhotos: true
    },
    waliConfig: {
      waliName: 'أحمد بن إبراهيم الخالدي',
      waliRelation: 'الوالد',
      waliPhone: '+966 50 123 4567',
      waliEmail: 'wali.alkhalidi@gmail.com',
      waliVerificationStatus: 'verified',
      autoNotifyWaliOnNewKhitbah: true,
      requireWaliPasscodeForChat: true,
      waliDirectCallAllowed: true,
      dailyWaliSummaryReport: false,
      forwardAllMessagesToWali: true
    },
    notifications: {
      smsOnProposal: true,
      emailOnWaliAction: true,
      weeklyIstikharaReminder: true,
      marketingDigest: false,
      whatsappAlerts: true,
      meetingReminders: true,
      newMatchNotifications: true,
      soundEnabled: true,
      quietHoursEnabled: false,
      quietHoursStart: '23:00',
      quietHoursEnd: '06:00'
    },
    account: {
      displayName: 'سارة بنت أحمد الخالدي',
      email: 'sara.khalidi@example.com',
      phone: '+966 55 987 6543',
      city: 'الرياض',
      country: 'المملكة العربية السعودية',
      twoFactorAuth: true,
      calendarType: 'hijri',
      accountStatus: 'active'
    },
    appearance: {
      fontSize: 'normal',
      highContrast: false,
      reducedMotion: false,
      prayerTimesWidget: true
    },
    security: DEFAULT_SECURITY_SETTINGS
  });

  // Platform Global Settings in Firestore (Live configuration)
  const [globalSettings, setGlobalSettings] = useState<GlobalSiteSettings>(DEFAULT_GLOBAL_SITE_SETTINGS);

  // Localization Config in Firestore (Live Countries, Cities, Languages, Translations)
  const [localizationConfig, setLocalizationConfig] = useState<LocalizationConfig>(DEFAULT_LOCALIZATION_CONFIG);

  // Platform stats (updated real-time from Firestore)
  const [stats, setStats] = useState({
    activeSeekers: 0,
    verifiedWalis: 0,
    successfulNikahs: 0,
    shariaCommitmentRate: "100%"
  });

  // Home FAQ open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Firestore Site Pages & Page Layout Settings
  const [pageSettings, setPageSettings] = useState<PageLayoutSettings>(DEFAULT_PAGE_LAYOUT_SETTINGS);
  const [sitePages, setSitePages] = useState<AdminPageItem[]>(INITIAL_PAGES_LIST);
  const [viewingSitePage, setViewingSitePage] = useState<AdminPageItem | null>(null);

  const handleOpenPage = (slug: string) => {
    const found = sitePages.find(p => p.slug === slug || p.id === slug);
    if (found) {
      setViewingSitePage(found);
    } else {
      setViewingSitePage({
        id: `page_${slug}`,
        title: slug === 'terms-and-conditions' ? 'الشروط والأحكام والضوابط' : (slug === 'privacy-policy' ? 'سياسة الخصوصية وستر البيانات' : (slug === 'about-us' ? 'من نحن - رسالة منصة ميثاق' : 'صفحة رسمية')),
        slug,
        type: 'standard',
        status: 'published',
        author: 'هيئة الرقابة الشرعية',
        lastUpdated: new Date().toISOString().split('T')[0],
        contentAr: 'المحتوى قيد المراجعة والاعتماد.'
      });
    }
  };

  // Keep HTML document direction & lang synchronized
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Load live data from backend API
  const refreshBackendData = async () => {
    try {
      const [propRes, statsRes, celebRes] = await Promise.all([
        fetch('/api/proposals'),
        fetch('/api/stats'),
        fetch('/api/celebrations')
      ]);
      if (propRes.ok) {
        const propData = await propRes.json();
        if (propData.success && Array.isArray(propData.proposals) && propData.proposals.length > 0) {
          setProposals(propData.proposals);
        }
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.stats) {
          setStats(statsData.stats);
        }
      }
      if (celebRes.ok) {
        const celebData = await celebRes.json();
        if (celebData.success && Array.isArray(celebData.celebrations)) {
          setCelebrations(celebData.celebrations);
        }
      }
    } catch (e) {
      // Retain optimistic default state
    }
  };

  useEffect(() => {
    refreshBackendData();

    // 1. Listen to real Firebase Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isUserAdmin = firebaseUser.email === 'admin@meethaq.org' || firebaseUser.email === 'hhhosts@gmail.com';
        const userRole = isUserAdmin ? 'admin' : (currentSession.role === 'guest' ? 'suitor' : currentSession.role);
        
        setCurrentSession(prev => ({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'عضو ميثاق الموثق',
          role: userRole,
          avatar: firebaseUser.photoURL || prev.avatar || '',
          phone: firebaseUser.phoneNumber || prev.phone || ''
        }));

        fetchUserSettingsFromDb(firebaseUser.uid).then(remoteSettings => {
          if (remoteSettings) {
            setSettings(remoteSettings);
            if (remoteSettings.language) setCurrentLang(remoteSettings.language);
          }
        });
      }
    });

    // 2. Real-time Cloud Firestore Subscriptions
    const unsubscribeProfiles = subscribeToProfiles((dbProfiles) => {
      if (dbProfiles && dbProfiles.length > 0) {
        setProfiles(prev => {
          const existingIds = new Set(dbProfiles.map(p => p.id));
          const remaining = prev.filter(p => !existingIds.has(p.id));
          return [...dbProfiles, ...remaining];
        });
      }
    });

    const unsubscribeProposals = subscribeToProposals((dbProposals) => {
      if (dbProposals && dbProposals.length > 0) {
        setProposals(prev => {
          const existingIds = new Set(dbProposals.map(p => p.id));
          const remaining = prev.filter(p => !existingIds.has(p.id));
          return [...dbProposals, ...remaining];
        });
      }
    });

    const unsubscribeCelebrations = subscribeToCelebrations((dbCelebrations) => {
      if (dbCelebrations && dbCelebrations.length > 0) {
        setCelebrations(prev => {
          const existingIds = new Set(dbCelebrations.map(c => c.id));
          const remaining = prev.filter(c => !existingIds.has(c.id));
          return [...dbCelebrations, ...remaining];
        });
      }
    });

    const unsubscribePageSettings = subscribeToPageSettings((remoteSettings) => {
      if (remoteSettings) {
        setPageSettings(remoteSettings);
      }
    });

    const unsubscribeSitePages = subscribeToSitePages((remotePages) => {
      if (remotePages && remotePages.length > 0) {
        setSitePages(remotePages);
      }
    });

    const unsubscribeGlobalSettings = subscribeToGlobalSiteSettings((remoteGlobal) => {
      if (remoteGlobal) {
        setGlobalSettings(remoteGlobal);
      }
    });

    const unsubscribeLocalization = subscribeToLocalizationConfig((remoteLoc) => {
      if (remoteLoc) {
        setLocalizationConfig(remoteLoc);
      }
    });

    const unsubscribeRealStats = subscribeToRealPlatformStats((realStats) => {
      if (realStats) {
        setStats({
          activeSeekers: realStats.activeSeekers,
          verifiedWalis: realStats.verifiedWalis,
          successfulNikahs: realStats.successfulNikahs,
          shariaCommitmentRate: realStats.shariaCommitmentRate
        });
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfiles();
      unsubscribeProposals();
      unsubscribeCelebrations();
      unsubscribePageSettings();
      unsubscribeSitePages();
      unsubscribeGlobalSettings();
      unsubscribeLocalization();
      unsubscribeRealStats();
    };
  }, []);

  // Synchronize document direction and language attribute
  useEffect(() => {
    const activeLangObj = localizationConfig.availableLanguages?.find(l => l.code === currentLang);
    const dir = activeLangObj?.direction || (currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang, localizationConfig]);

  // Fetch profiles from backend API matching engine
  const fetchProfilesFromApi = async () => {
    try {
      const params = new URLSearchParams();
      if (currentSession?.id) params.append('currentUserId', currentSession.id);
      if (selectedGender !== 'all') params.append('gender', selectedGender);
      if (selectedCountryId !== 'all') params.append('countryId', selectedCountryId);
      if (selectedCityId !== 'all') params.append('cityId', selectedCityId);
      if (selectedEducationId !== 'all') params.append('educationLevelId', selectedEducationId);
      if (selectedJobCategoryId !== 'all') params.append('jobCategoryId', selectedJobCategoryId);
      if (selectedDistanceKm !== 'all') params.append('maxDistanceKm', selectedDistanceKm);
      if (minAge > 18) params.append('minAge', minAge.toString());
      if (maxAge < 65) params.append('maxAge', maxAge.toString());
      if (sortOption) params.append('sortBy', sortOption);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedPrayer !== 'all') params.append('prayerHabit', selectedPrayer);
      if (selectedStatus !== 'all') params.append('maritalStatus', selectedStatus);
      if (verifiedOnly) params.append('verifiedOnly', 'true');

      const res = await fetch(`/api/profiles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.profiles)) {
          setProfiles(data.profiles);
        }
      }
    } catch (e) {
      console.warn('Backend API fetch profiles fallback:', e);
    }
  };

  // Load favorites & preferences from backend on session change
  useEffect(() => {
    if (!currentSession?.id) return;
    
    // Fetch favorites
    fetch(`/api/favorites/${currentSession.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        }
      })
      .catch(() => {});

    // Fetch preferences
    fetch(`/api/preferences/${currentSession.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.preferences) {
          setUserPreferences(data.preferences);
        }
      })
      .catch(() => {});

    fetchProfilesFromApi();
  }, [
    currentSession?.id,
    selectedGender,
    selectedCountryId,
    selectedCityId,
    selectedEducationId,
    selectedJobCategoryId,
    selectedDistanceKm,
    minAge,
    maxAge,
    sortOption,
    searchTerm,
    selectedPrayer,
    selectedStatus,
    verifiedOnly
  ]);

  // Filtered and view-aware profiles list
  const filteredProfiles = profiles.filter((p) => {
    // Hide blocked and hidden profiles
    if (hiddenProfileIds.includes(p.id)) return false;
    if (blockedUserIds.includes(p.id)) return false;

    // View tab switching
    if (activeExploreView === 'favorites') {
      return favorites.includes(p.id);
    }
    if (activeExploreView === 'requests') {
      return proposals.some(prop => prop.targetProfileId === p.id && prop.suitorId === currentSession.id);
    }

    if (selectedGender !== 'all' && p.gender !== selectedGender) return false;
    if (selectedCountryId !== 'all' && p.countryId && p.countryId !== selectedCountryId) return false;
    if (selectedCityId !== 'all' && p.cityId && p.cityId !== selectedCityId) return false;
    if (selectedEducationId !== 'all' && p.educationLevelId && p.educationLevelId !== selectedEducationId) return false;
    if (selectedJobCategoryId !== 'all' && p.jobCategoryId && p.jobCategoryId !== selectedJobCategoryId) return false;
    if (selectedPrayer !== 'all' && p.prayerHabit !== selectedPrayer) return false;
    if (selectedStatus !== 'all' && p.maritalStatus !== selectedStatus) return false;
    if (verifiedOnly && !p.isVerified) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = p.fullName.toLowerCase().includes(term);
      const matchCity = p.city.toLowerCase().includes(term);
      const matchCountry = p.country.toLowerCase().includes(term);
      const matchProf = p.profession.toLowerCase().includes(term);
      const matchAbout = p.aboutMe.toLowerCase().includes(term);
      if (!matchName && !matchCity && !matchCountry && !matchProf && !matchAbout) {
        return false;
      }
    }

    return true;
  });

  const handleToggleFavorite = async (profile: Profile) => {
    const isFav = favorites.includes(profile.id);
    const newFavs = isFav ? favorites.filter(id => id !== profile.id) : [...favorites, profile.id];
    setFavorites(newFavs);

    try {
      await fetch(`/api/favorites/${currentSession.id || 'default'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id })
      });
    } catch (e) {
      console.warn('Favorites API sync:', e);
    }
  };

  const handleHideProfile = (profileId: string) => {
    setHiddenProfileIds(prev => [...prev, profileId]);
  };

  const handleBlockSuccess = (blockedUserId: string) => {
    setBlockedUserIds(prev => [...prev, blockedUserId]);
    setHiddenProfileIds(prev => [...prev, blockedUserId]);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedGender('all');
    setSelectedCountryId('all');
    setSelectedCityId('all');
    setSelectedEducationId('all');
    setSelectedJobCategoryId('all');
    setSelectedDistanceKm('all');
    setMinAge(18);
    setMaxAge(65);
    setSortOption('compatibility');
    setSelectedPrayer('all');
    setSelectedStatus('all');
    setVerifiedOnly(false);
  };

  const handleViewProfile = (profile: Profile) => {
    setViewedProfile(profile);
    setSelectedProfileForModal(profile);
    setPreviousTab(currentTab === 'profile-details' ? 'explore' : currentTab);
    setCurrentTab('profile-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProfileDetails = () => {
    setViewedProfile(null);
    setCurrentTab(previousTab || 'explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPhotoRequestModal = (profile: Profile) => {
    if (currentSession.role === 'guest') {
      setLoginModalDefaultTab('login');
      setIsLoginModalOpen(true);
      return;
    }
    setPhotoRequestModalProfile(profile);
  };

  const handleSendPhotoPermissionRequest = (profile: Profile, message: string) => {
    const newReq: PhotoPermissionRequest = {
      id: `req-${Date.now()}`,
      suitorId: currentSession.id || 'prof-1',
      suitorName: currentSession.name || 'خاطب مسجل',
      suitorAge: 29,
      suitorCity: 'الرياض',
      suitorJob: 'مهندس برمجيات ونظم سحابية',
      targetProfileId: profile.id,
      targetProfileName: profile.fullName,
      message: message || 'طلب إذن بالرؤية الشرعية للصورة بإشراف الولي الشرعي',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setPhotoRequests(prev => [newReq, ...prev]);
    setPhotoRequestModalProfile(null);
  };

  const handleUpdatePhotoRequestStatus = (requestId: string, newStatus: 'approved' | 'rejected') => {
    setPhotoRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus, reviewedAt: new Date().toISOString() } : r));
  };

  const handleUpdateMatrimonialProfile = (updatedProfile: Partial<Profile>) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === (updatedProfile.id || currentSession.id)) {
        const merged = { ...p, ...updatedProfile };
        saveProfileToDb(merged);
        return merged;
      }
      return p;
    }));
  };

  const handleKhitbahSubmit = async (
    profile: Profile, 
    note: string,
    suitorDetails?: { name?: string; phone?: string; city?: string; age?: number }
  ) => {
    const suitorName = suitorDetails?.name || (currentSession.role !== 'guest' ? currentSession.name : "عبدالله بن فهد الشمري");
    const suitorCity = suitorDetails?.city || "الرياض";
    const suitorPhone = suitorDetails?.phone || currentSession.phone || "+966 50 123 4567";

    const localProposal: Proposal = {
      id: `prop-${Date.now()}`,
      suitorId: currentSession.id || "prof-1",
      suitorName,
      suitorAge: suitorDetails?.age || 28,
      suitorCity,
      targetProfileId: profile.id,
      targetProfileName: profile.fullName,
      waliName: profile.wali.name,
      waliPhone: profile.wali.phone || "+966 50 123 4567",
      waliStatus: profile.wali.isVerified ? "verified" : "pending_verification",
      status: "pending_wali_review",
      stage: "طلب خطوبة جديد تم إرساله لولي الأمر للمراجعة",
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mahramSupervised: true
    };

    setProposals(prev => [localProposal, ...prev]);

    // Save to Cloud Firestore
    saveProposalToDb(localProposal);

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suitorId: localProposal.suitorId,
          suitorName: localProposal.suitorName,
          suitorAge: localProposal.suitorAge,
          suitorCity: localProposal.suitorCity,
          targetProfileId: localProposal.targetProfileId,
          targetProfileName: localProposal.targetProfileName,
          waliName: localProposal.waliName,
          waliPhone: localProposal.waliPhone,
          note: localProposal.note
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.proposal) {
          setProposals(prev => [data.proposal, ...prev.filter(p => p.id !== localProposal.id)]);
          saveProposalToDb(data.proposal);
        }
      }
    } catch (err) {
      // Retain optimistic local state
    }
  };

  const handleUpdateProposalStatus = async (id: string, newStatus: Proposal['status'], stage: string) => {
    let updatedTargetProp: Proposal | null = null;
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        const updated = {
          ...p,
          status: newStatus,
          stage,
          updatedAt: new Date().toISOString()
        };
        updatedTargetProp = updated;
        return updated;
      }
      return p;
    }));

    if (updatedTargetProp) {
      saveProposalToDb(updatedTargetProp);
    }

    try {
      await fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, stage })
      });
    } catch (err) {
      // Silent error fallback
    }
  };

  const handleProfileCreated = async (newProfile: Profile) => {
    setProfiles([newProfile, ...profiles]);
    setSelectedProfileForModal(newProfile);
    setIsProfileModalOpen(true);

    // Save to Cloud Firestore
    saveProfileToDb(newProfile);

    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
    } catch (e) {
      // Retain optimistic state
    }
  };

  // 0. Dedicated Admin Dashboard Route (/admin)
  if (isAdminRoute || currentTab === 'admin') {
    return (
      <AdminDashboardView
        onReturnToSite={() => {
          window.history.pushState(null, '', '/');
          setIsAdminRoute(false);
          setCurrentTab('home');
        }}
        onRefreshGlobalData={refreshBackendData}
        photoRequests={photoRequests}
        onUpdatePhotoRequestStatus={handleUpdatePhotoRequestStatus}
      />
    );
  }

  // Maintenance Mode Check (locks browsing for visitors if enabled in Settings, allows admin access)
  if (globalSettings.isMaintenance && currentSession.role !== 'admin' && !isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] text-neutral-900 flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#ede5dd] shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center mx-auto text-3xl font-black shadow-xs">
            مِ
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#9b4c2e] uppercase tracking-wider bg-[#fbf1eb] px-3 py-1 rounded-full">
              وضع الصيانة والتحديث
            </span>
            <h1 className="text-2xl font-black text-neutral-900 mt-2">
              {globalSettings.siteName || 'منصة ميثاق للزواج الإسلامي الشرعي'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              تخضع المنصة حالياً لأعمال الصيانة الدورية وتحديث الخوادم لضمان أعلى درجات الخصوصية والأمان الشرعي. سنعود قريباً بإذن الله.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-start space-y-2">
            <div className="flex items-center justify-between text-neutral-600">
              <span>البريد الإداري:</span>
              <span className="font-mono font-bold text-neutral-900">{globalSettings.adminEmail || 'admin@meethaq.org'}</span>
            </div>
            {globalSettings.supportPhone && (
              <div className="flex items-center justify-between text-neutral-600">
                <span>رقم الدعم:</span>
                <span className="font-mono font-bold text-neutral-900">{globalSettings.supportPhone}</span>
              </div>
            )}
            {globalSettings.shariaCommitteeLead && (
              <div className="flex items-center justify-between text-neutral-600 pt-1 border-t border-neutral-200">
                <span>الإشراف الشرعي:</span>
                <span className="font-bold text-neutral-800">{globalSettings.shariaCommitteeLead}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
              }}
              className="text-xs text-[#9b4c2e] hover:underline font-bold"
            >
              دخول الإدارة والمشرفين ↗
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body selection:bg-pink-200 selection:text-black">
      
      {/* 0. Role Switcher for Admin simulation only */}
      {currentSession.role === 'admin' && (
        <RoleSwitcher
          currentSession={currentSession}
          onSelectSession={(session) => {
            setCurrentSession(session);
            if (session.role === 'wali') {
              handleTabChange('wali');
            } else if (session.role === 'admin') {
              handleTabChange('admin');
            }
          }}
        />
      )}

      {/* 1. Top Announcement Banner connected to real Firestore Settings */}
      <AnnouncementBanner 
        lang={currentLang} 
        announcement={globalSettings.headerAnnouncement} 
      />

      {/* 2. Partiful Sticky Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        openCreateBioModal={() => setIsCreateBioModalOpen(true)}
        openLoginModal={(defaultTab) => {
          if (defaultTab === 'register') {
            setCurrentTab('register');
          } else {
            setLoginModalDefaultTab('login');
            setIsLoginModalOpen(true);
          }
        }}
        pendingProposalsCount={proposals.filter(p => p.status === 'pending_wali_review').length}
        currentSession={currentSession}
        onSelectSession={(session) => {
          setCurrentSession(session);
          if (session.role === 'wali' || session.role === 'admin') {
            setCurrentTab('profile');
          }
        }}
        adminAlertsCount={1}
        availableLanguages={localizationConfig.availableLanguages}
        onOpenSettingsCategory={handleOpenSettingsCategory}
        onLogout={async () => {
          try {
            await logoutUser();
          } catch (e) {
            console.warn('Logout error:', e);
          }
          const guestSession = availableSessions.find(s => s.role === 'guest') || {
            id: 'guest',
            name: 'زائر / مستكشف',
            role: 'guest',
            avatar: ''
          };
          setCurrentSession(guestSession);
          setCurrentTab('home');
        }}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {/* 1. Primary Tab: HOME */}
        {currentTab === 'home' && (
          currentSession.role === 'guest' ? (
            <GuestIslamicHome
              lang={currentLang}
              onRegisterClick={() => setCurrentTab('register')}
              onLoginClick={() => {
                setLoginModalDefaultTab('login');
                setIsLoginModalOpen(true);
              }}
              onExploreClick={() => setCurrentTab('explore')}
            />
          ) : (
            <div className="space-y-12">
              {/* Everlane Atelier Hero Section with Islamic Matrimonial Guidance */}
              <HeroSection
              lang={currentLang}
              onExploreClick={() => setCurrentTab('explore')}
              onRegisterClick={() => setCurrentTab('register')}
              onLoginClick={() => setIsLoginModalOpen(true)}
              onApiClick={() => setCurrentTab('api')}
              isAdmin={currentSession.role === 'admin'}
              availableCountries={localizationConfig.availableCountries}
              onWaliClick={() => {
                if (currentSession.role !== 'guest') {
                  setCurrentTab('profile');
                } else {
                  setCurrentTab('register');
                }
              }}
              onSearchSubmit={(filters) => {
                if (filters.gender && filters.gender !== 'all') {
                  setSelectedGender(filters.gender as 'male' | 'female');
                }
                if (filters.country && filters.country !== 'all') {
                  setSelectedCountryId(filters.country);
                }
                if (filters.city && filters.city !== 'all') {
                  setSelectedCityId(filters.city);
                }
                if (filters.ageMin !== undefined) {
                  setMinAge(filters.ageMin);
                }
                if (filters.ageMax !== undefined) {
                  setMaxAge(filters.ageMax);
                }
                setCurrentTab('explore');
              }}
              stats={stats}
            />

            {/* Latest Profiles Section with Terracotta Banner & Profile Cards matching screenshot */}
            <LatestProfilesSection
              profiles={profiles}
              favorites={favorites}
              lang={currentLang}
              onViewProfile={handleViewProfile}
              onToggleFavorite={handleToggleFavorite}
              onExploreAll={() => setCurrentTab('explore')}
              onStartJourney={() => setCurrentTab('register')}
            />

            {/* 4 Sacred Pillars of Sharia Matrimony */}
            <section id="sharia-pillars-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
              <span id="safety-privacy-section" className="absolute -top-24 opacity-0 pointer-events-none" />
              <div className="relative rounded-2xl border border-[#ede5dd] bg-white p-6 sm:p-10 space-y-8 shadow-xs">
                <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
                  <div className="inline-flex items-center gap-2 border border-[#9b4c2e]/20 px-3.5 py-1 bg-[#fdf6f0] text-[#9b4c2e] text-xs font-bold tracking-wide rounded-full">
                    <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
                    <span>أصول وقواعد المصاهرة الراشدة</span>
                    <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-cairo tracking-tight">
                    الأركان الأربعة للزواج المبارك في منصة نكاح
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-cairo">
                    منظومة محكمة مبنية على الكتاب وصحيح السنة لحفظ الأنساب، صيانة كرامة الأخوات، وتحقيق السكن والمودة دون أي ابتذال أو خلوة محرمة.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
                  
                  {/* Pillar 1 */}
                  <div className="bg-[#fcfbfa] p-5 rounded-xl border border-[#ede5dd] space-y-3 text-start hover:border-[#9b4c2e] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-full bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-sm">
                        <span>١</span>
                      </div>
                      <IslamicStar className="w-4 h-4 text-[#9b4c2e]" />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">إشراف الولي الشرعي</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      لا خطوة ولا تعارف يتم إلا بحضور وموافقة الولي، عملاً بالحديث الشريف: «لا نكاح إلا بولي وشاهدي عدل».
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-[#fcfbfa] p-5 rounded-xl border border-[#ede5dd] space-y-3 text-start hover:border-[#9b4c2e] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-full bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-sm">
                        <span>٢</span>
                      </div>
                      <IslamicStar className="w-4 h-4 text-[#9b4c2e]" />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">ستر العورات والحياء</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      صور الأخوات محجوبة تلقائياً؛ لا تُعرض في واجهات عامة، ولا تُتاح الرؤية الشرعية إلا للجاد بعد قبول الولي.
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-[#fcfbfa] p-5 rounded-xl border border-[#ede5dd] space-y-3 text-start hover:border-[#9b4c2e] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-full bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-sm">
                        <span>٣</span>
                      </div>
                      <IslamicStar className="w-4 h-4 text-[#9b4c2e]" />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">الكفاءة والباءة الشرعية</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      التثبت الصارم من صدق المقصد، الاستقامة على الصلاة، توفر المسكن الشرعي، والاستطاعة المالية للنفقة.
                    </p>
                  </div>

                  {/* Pillar 4 */}
                  <div className="bg-[#fcfbfa] p-5 rounded-xl border border-[#ede5dd] space-y-3 text-start hover:border-[#9b4c2e] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-full bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-sm">
                        <span>٤</span>
                      </div>
                      <IslamicStar className="w-4 h-4 text-[#9b4c2e]" />
                    </div>
                    <h3 className="font-bold text-sm text-neutral-900">الميثاق وصك النكاح</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      تنظيم إجراءات الخطبة حتى كتابة صك العقد الشرعي بحضور الشهود والمهر المسمى على هدي النبي ﷺ.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="rounded-2xl border border-[#ede5dd] bg-white p-6 sm:p-10 space-y-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#9b4c2e] font-bold">
                      <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
                      <span>مسار الخطوبة الشرعية</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-cairo mt-1">
                      كيف تبدأ رحلة المصاهرة الشرعية؟
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('register')}
                    className="px-6 py-2.5 rounded-full bg-[#9b4c2e] hover:bg-[#853e24] text-white font-medium text-xs self-start transition flex items-center gap-2"
                  >
                    <span>ابدأ التسجيل الشرعي</span>
                    <IslamicStar className="w-3 h-3 text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl border border-neutral-200 bg-[#fcfbfa] space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#9b4c2e] block">الخطوة الأولى</span>
                      <IslamicStar className="w-3.5 h-3.5 text-[#9b4c2e]/50" />
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900">إنشاء السيرة وتحديد المسار</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      تسجيل البيانات الديموغرافية والسمت الديني، مع إدراج بيانات الولي للأخوات وإقرار الباءة للشباب.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-neutral-200 bg-[#fcfbfa] space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#9b4c2e] block">الخطوة الثانية</span>
                      <IslamicStar className="w-3.5 h-3.5 text-[#9b4c2e]/50" />
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900">التدقيق والاعتماد الشرعي</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      مراجعة الحساب وتوثيقه بواسطة هيئة الإشراف للتأكد من خلوه من العبث وجدية الطرفين.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-neutral-200 bg-[#fcfbfa] space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#9b4c2e] block">الخطوة الثالثة</span>
                      <IslamicStar className="w-3.5 h-3.5 text-[#9b4c2e]/50" />
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900">مجلس الولي وإرسال الطلب</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      تقديم طلب الخطبة مباشرة للولي الشرعي، وتلقيه إشعاراً بكامل بيانات الخاطب للموافقة أو الرفض.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-neutral-200 bg-[#fcfbfa] space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#9b4c2e] block">الخطوة الرابعة</span>
                      <IslamicStar className="w-3.5 h-3.5 text-[#9b4c2e]/50" />
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900">الرؤية الشرعية وعقد النكاح</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      ترتيب مجلس الرؤية بحضور الأهل والمحارم، وإتمام صك النكاح والميثاق الغليظ على كتاب الله وسنة رسوله ﷺ.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Live Platform Stats (إحصائيات المنصة الحية) */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="rounded-2xl bg-[#9b4c2e] text-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
                <div className="relative z-10 text-center space-y-3 max-w-2xl mx-auto mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold">
                    <IslamicStar className="w-3 h-3 text-[#d9e9bb]" filled />
                    <span>أرقام وإنجازات موثقة</span>
                    <IslamicStar className="w-3 h-3 text-[#d9e9bb]" filled />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo">
                    بيوتٌ عامرةٌ تأسست على التقوى والمودة
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    منذ انطلاق المنصة ونحن نعمل بكل أمانة لتيسير الحلال وصيانة كرامة الأخوات وعفاف الشباب.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
                  <div className="bg-white/10 backdrop-blur-xs p-5 rounded-xl border border-white/15 space-y-1">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">١٥,٠٠٠+</div>
                    <div className="text-xs text-white/85 font-medium">عضو وباحث عن الحلال</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-5 rounded-xl border border-white/15 space-y-1">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-[#d9e9bb]">٤,٢٠٠+</div>
                    <div className="text-xs text-white/85 font-medium">عقد وزواج مبارك وموثق</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-5 rounded-xl border border-white/15 space-y-1">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">١٠٠٪</div>
                    <div className="text-xs text-white/85 font-medium">التزام بالضوابط الشرعية</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs p-5 rounded-xl border border-white/15 space-y-1">
                    <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">١٢</div>
                    <div className="text-xs text-white/85 font-medium">دولة عربية وإسلامية</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Success Stories & Real Testimonials (قصص نجاح ومباركات حقيقية) */}
            <section id="marriage-stories-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
              <span id="success-stories-section" className="absolute -top-24 opacity-0 pointer-events-none" />
              <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#9b4c2e] font-bold">
                  <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
                  <span>تجارب حية وموثقة</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-cairo">
                  قصص نجاح ومباركات من واقع المنصة
                </h2>
                <p className="text-sm text-neutral-600 max-w-lg mx-auto">
                  شهادات أزواج وأولياء أمور وفقهم الله لبناء بيوت صالحة عبر منصة نكاح
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Story 1 */}
                <div className="p-6 rounded-2xl border border-[#ede5dd] bg-white space-y-4 hover:shadow-sm transition">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-[11px] text-neutral-400">قبل شهرين</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                    «الحمد لله الذي بنعمته تتم الصالحات، وجدنا في المنصة احتراماً فائقاً للخصوصية والتزاماً بسنة الحبيب ﷺ. تم التواصل مع ولي أمر زوجتي بكل وقار، واليوم نعيش في هناء وسعادة.»
                  </p>
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center font-bold text-xs">
                      ع.س
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">عمر وسارة</h4>
                      <p className="text-[11px] text-neutral-500">عمان - الأردن</p>
                    </div>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="p-6 rounded-2xl border border-[#ede5dd] bg-white space-y-4 hover:shadow-sm transition">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-[11px] text-neutral-400">قبل ٤ أشهر</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                    «بصفتي ولي أمر، أراحتني المنصة كثيراً؛ الولي حاضر في كل خطوة وتصله البيانات كاملة مع أرقام التواصل والتأكد من كفاءة الخاطب. جزى الله القائمين عليها خير الجزاء.»
                  </p>
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center font-bold text-xs">
                      أ.ف
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">أبو فيصل (ولي أمر)</h4>
                      <p className="text-[11px] text-neutral-500">الرياض - السعودية</p>
                    </div>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="p-6 rounded-2xl border border-[#ede5dd] bg-white space-y-4 hover:shadow-sm transition">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span className="text-[11px] text-neutral-400">قبل أسبوعين</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                    «كنت أبحث عن فتاة صالحة تحفظ القرآن وتعينني على ديني. وفقت بفضل الله للأخت مريم، وتمت الرؤية الشرعية بمنزل والدها الكريم وعُقد قراننا على خير وبركة.»
                  </p>
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center font-bold text-xs">
                      أ.م
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">أحمد ومريم</h4>
                      <p className="text-[11px] text-neutral-500">إربد - الأردن</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Frequently Asked Questions (الأسئلة الشائعة) */}
            <section id="faq-section" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
              <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#9b4c2e] font-bold">
                  <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
                  <span>إجابات واضحة</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-cairo">
                  الأسئلة الشائعة حول المنصة
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600">
                  كل ما ترغب بمعرفته حول الضوابط الشرعية، خصوصية البيانات، ودور ولي الأمر
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "هل التسجيل وتصفح الموقع مجاني بالكامل؟",
                    a: "نعم، التسجيل والبحث واستعراض السير المتوافقة مجاني تماماً ابتغاء الأجر وتيسيراً لسبل الحلال والعفاف لشباب وبنات المسلمين."
                  },
                  {
                    q: "كيف يحفظ الموقع خصوصية وستر صور الأخوات؟",
                    a: "صور الأخوات محجوبة ومظللة تلقائياً ولا تُعرض في واجهات عامة، ولا تُتاح الرؤية الشرعية إلا للخاطب الجاد بعد موافقة الولي الشرعي الصريحة وترتيب مجلس رسمي."
                  },
                  {
                    q: "ما هو دور ولي الأمر الشرعي في منصة نكاح؟",
                    a: "عملاً بحديث النبي ﷺ «لا نكاح إلا بولي وشاهدي عدل»، يتلقى ولي الأمر إشعاراً فورياً بأي طلب زواج مع تفاصيل الخاطب، وله الصلاحية الكاملة للقبول أو الرفض وتحديد موعد الرؤية."
                  },
                  {
                    q: "كيف تُرتب الرؤية الشرعية الرسمية؟",
                    a: "عند توافق الطرفين وموافقة الولي، يُرتب لقاء رسمي بحضور الأهل في منزل العائلة، أو عبر جلسة اتصال شرعية بإشراف الولي وفق الآداب الإسلامية."
                  },
                  {
                    q: "هل يتم التحقق من مصداقية وجدية الحسابات المسجلة؟",
                    a: "نعم، تخضع كافة السير لتدقيق صارم من فريق الإدارة الشرعية، مع التحقق من الهوية وأرقام الهواتف وإقرار الباءة والاستقامة، ويتم استبعاد أي حساب غير جاد فوراً."
                  }
                ].map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="border border-[#ede5dd] rounded-xl overflow-hidden bg-white transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 font-bold text-neutral-900 text-sm hover:bg-[#fcfbfa] cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#fbf1eb] text-[#9b4c2e] text-xs flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <span className="text-[#9b4c2e] font-bold text-lg">
                        {openFaq === idx ? '−' : '+'}
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-[#faf8f5]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
          )
        )}

        {/* 2. Primary Tab: EXPLORE (تصفح والبحث عن شريك - متاح للجميع مع خيار تحديد الجنس) */}
        {currentTab === 'explore' && (
          <div>
            {/* Top Gender Selector Banner & Member Welcome */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="bg-[#fcfbfa] border border-[#ede5dd] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                
                {/* Information Header */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9b4c2e]" />
                    <h2 className="font-bold text-neutral-900 text-sm sm:text-base font-cairo">
                      {currentSession.role === 'admin'
                        ? 'لوحة إدارة وتدقيق السير'
                        : currentSession.role === 'guest'
                        ? 'تصفح ملفات الراغبين بالزواج الشرعي'
                        : `البحث عن شريك الحياة (مرحباً ${currentSession.name}):`}
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {currentSession.role === 'guest'
                      ? 'التصفح متاح للجميع • لإرسال طلب التواصل مع الولي يلزم تسجيل الدخول أو إنشاء حساب'
                      : 'استعراض السير المتوافقة مع معاييرك الدينية والاجتماعية بإشراف الولي الشرعي'}
                  </p>
                </div>

                {/* Prominent Quick Gender Selector Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="inline-flex bg-neutral-100 p-1 rounded-full border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setSelectedGender('all')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        selectedGender === 'all'
                          ? 'bg-[#9b4c2e] text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      الكل ({profiles.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender('female')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        selectedGender === 'female'
                          ? 'bg-[#9b4c2e] text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      نساء / مرشحات ({profiles.filter(p => p.gender === 'female').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender('male')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        selectedGender === 'male'
                          ? 'bg-[#9b4c2e] text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      رجال / خاطبون ({profiles.filter(p => p.gender === 'male').length})
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Filter Bar with Islamic Matrimony criteria */}
            <FilterBar
              lang={currentLang}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
              selectedCountryId={selectedCountryId}
              onCountryIdChange={setSelectedCountryId}
              selectedCityId={selectedCityId}
              onCityIdChange={setSelectedCityId}
              selectedEducationId={selectedEducationId}
              onEducationIdChange={setSelectedEducationId}
              selectedJobCategoryId={selectedJobCategoryId}
              onJobCategoryIdChange={setSelectedJobCategoryId}
              selectedPrayer={selectedPrayer}
              onPrayerChange={setSelectedPrayer}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedDistanceKm={selectedDistanceKm}
              onDistanceKmChange={setSelectedDistanceKm}
              minAge={minAge}
              onMinAgeChange={setMinAge}
              maxAge={maxAge}
              onMaxAgeChange={setMaxAge}
              sortOption={sortOption}
              onSortOptionChange={setSortOption}
              verifiedOnly={verifiedOnly}
              onVerifiedChange={setVerifiedOnly}
              onReset={handleResetFilters}
              onOpenPreferences={() => setIsPreferencesModalOpen(true)}
              totalResultsCount={filteredProfiles.length}
              activeView={activeExploreView}
              onViewChange={setActiveExploreView}
              favoritesCount={favorites.length}
              requestsCount={proposals.filter(p => p.suitorId === currentSession.id).length}
              availableCountries={localizationConfig.availableCountries}
            />

            {/* Profiles Showcase Section */}
            <section id="profiles-list-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#ede5dd] mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 font-cairo">
                    {activeExploreView === 'favorites' 
                      ? 'قائمة المفضلة الخاصة بك' 
                      : activeExploreView === 'requests' 
                      ? 'طلبات التواصل المرسلة من طرفك' 
                      : selectedGender === 'female'
                      ? 'الأخوات المرشحات للنكاح الشرعي'
                      : selectedGender === 'male'
                      ? 'الشباب الخاطبون الراغبون في الزواج'
                      : 'جميع ملفات الباحثين عن الزواج الشرعي'}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    خاضعة لتدقيق الإدارة الشرعية وإشراف الأولياء المحارم ({filteredProfiles.length} ملف متاح)
                  </p>
                </div>
              </div>

              {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      lang={currentLang}
                      isFavorite={favorites.includes(profile.id)}
                      canMessage={proposals.some(p => p.targetProfileId === profile.id && p.suitorId === currentSession.id && (p.status === 'approved_by_wali' || p.status === 'meeting_scheduled' || p.status === 'istikhara'))}
                      onViewProfile={handleViewProfile}
                      onToggleFavorite={handleToggleFavorite}
                      onRequestMarriage={(p) => {
                        if (currentSession.role === 'guest') {
                          setIsLoginModalOpen(true);
                        } else {
                          setMarriageRequestProfile(p);
                        }
                      }}
                      onMessage={(p) => {
                        const matchingProp = proposals.find(prop => prop.targetProfileId === p.id && prop.suitorId === currentSession.id);
                        if (matchingProp) setActiveChatProposal(matchingProp);
                      }}
                      onReportProfile={(p) => setReportModalProfile(p)}
                      onBlockUser={(p) => setBlockModalProfile(p)}
                      onHideProfile={handleHideProfile}
                      photoRequests={photoRequests}
                      currentSession={currentSession}
                      onRequestPhotoPermission={handleOpenPhotoRequestModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#ede5dd] rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
                  <div className="text-4xl">🔍</div>
                  <h3 className="font-bold text-sm text-neutral-900">لم يتم العثور على نتائج مطابقة</h3>
                  <p className="text-xs text-neutral-600">
                    جرب تغيير خيارات البحث أو إعادة ضبط الفلاتر للاطلاع على جميع الملفات.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 rounded-full bg-[#9b4c2e] hover:bg-[#853e24] text-white font-medium text-xs transition cursor-pointer"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Dedicated Full Page: Profile Details */}
        {currentTab === 'profile-details' && viewedProfile && (
          <ProfileDetailsPage
            profile={viewedProfile}
            lang={currentLang}
            currentSession={currentSession}
            isFavorite={favorites.includes(viewedProfile.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={handleBackFromProfileDetails}
            onRequestContact={(prof, note, details) => {
              handleKhitbahSubmit(prof, note, details);
            }}
            onRequireLogin={() => setIsLoginModalOpen(true)}
            photoRequests={photoRequests}
            onRequestPhotoPermission={handleOpenPhotoRequestModal}
          />
        )}

        {/* 3. Primary Tab: ACTIVITY (الأنشطة / طلبات الخطوبة) */}
        {(currentTab === 'activity' || currentTab === 'proposals') && (
          <ProposalsView
            lang={currentLang}
            proposals={proposals}
            currentSession={currentSession}
            profiles={profiles}
            onOpenChat={(p) => setActiveChatProposal(p)}
            onOpenMeeting={(p) => setActiveMeetingProposal(p)}
            onOpenNikah={(p) => setActiveNikahProposal(p)}
            onUpdateProposalStatus={handleUpdateProposalStatus}
            onViewProfile={handleViewProfile}
            onSendProposal={(prof) => {
              setMarriageRequestProfile(prof);
            }}
          />
        )}

        {/* 4. Primary Tab: MEMBER PROFILE (بروفيل العضو بعد الدخول - يضم جميع الصفحات الفرعية) */}
        {currentTab === 'profile' && (
          currentSession.role !== 'guest' ? (
            <MemberProfileView
              lang={currentLang}
              currentSession={currentSession}
              onLogout={async () => {
                try {
                  await logoutUser();
                } catch (e) {
                  console.warn('Logout error:', e);
                }
                const guestSession = availableSessions.find(s => s.role === 'guest') || {
                  id: 'guest',
                  name: 'زائر / مستكشف',
                  role: 'guest',
                  avatar: ''
                };
                setCurrentSession(guestSession);
                setCurrentTab('home');
              }}
              proposals={proposals}
              onUpdateProposalStatus={handleUpdateProposalStatus}
              onOpenChat={(p) => setActiveChatProposal(p)}
              onOpenMeeting={(p) => setActiveMeetingProposal(p)}
              onOpenNikah={(p) => setActiveNikahProposal(p)}
              celebrations={celebrations}
              onAddCelebration={(newCelebration) => {
                setCelebrations(prev => [newCelebration, ...prev]);
                saveCelebrationToDb(newCelebration);
              }}
              settings={settings}
              onSaveSettings={(newSettings) => {
                setSettings(newSettings);
                if (currentSession?.id && currentSession.role !== 'guest') {
                  saveUserSettingsToDb(currentSession.id, newSettings);
                }
              }}
              onLangChange={setCurrentLang}
              openCreateBioModal={() => setIsCreateBioModalOpen(true)}
              profiles={profiles}
              initialSettingsCategory={initialSettingsCategory}
              onViewProfile={handleViewProfile}
              photoRequests={photoRequests}
              onUpdatePhotoRequestStatus={handleUpdatePhotoRequestStatus}
              onUpdateProfile={handleUpdateMatrimonialProfile}
            />
          ) : (
            <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-black text-[#d9c58b] flex items-center justify-center text-3xl font-bold mx-auto border-2 border-[#d9c58b]/50 shadow-md">
                مِ
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-black">تسجيل الدخول إلى بروفيل العضو</h2>
                <p className="text-xs sm:text-sm text-[#666666]">
                  يرجى تسجيل الدخول أو إنشاء حساب للاطلاع على سيرتك الذاتية، وبوابة الولي، والمستشار الشرعي، والإعدادات.
                </p>
              </div>
              <LoginModal
                lang={currentLang}
                isOpen={true}
                isPageMode={true}
                defaultTab="login"
                onClose={() => setCurrentTab('home')}
                onSwitchToDedicatedRegister={() => setCurrentTab('register')}
                onSuccess={(role, session) => {
                  if (session) setCurrentSession(session);
                  setCurrentTab('explore');
                }}
              />
            </div>
          )
        )}

        {/* 5. Primary Tab: DEDICATED LOGIN PAGE (صفحة الدخول المستقلة) */}
        {currentTab === 'login' && (
          <div className="py-8">
            <LoginModal
              lang={currentLang}
              isOpen={true}
              isPageMode={true}
              defaultTab="login"
              onClose={() => setCurrentTab('home')}
              onSwitchToDedicatedRegister={() => setCurrentTab('register')}
              onSuccess={(role, session) => {
                if (session) setCurrentSession(session);
                setCurrentTab('explore');
              }}
            />
          </div>
        )}

        {/* 6. Primary Tab: DEDICATED REGISTER PAGE (صفحة التسجيل المستقلة الشرعية) */}
        {currentTab === 'register' && (
          <RegisterPage
            lang={currentLang}
            onGoToHome={() => setCurrentTab('home')}
            onGoToLogin={() => setCurrentTab('login')}
            onSuccess={(role, session) => {
              if (session) setCurrentSession(session);
              setCurrentTab('explore');
            }}
          />
        )}

        {/* 7. Sub-Tabs Fallback (Nested directly inside Member Profile) */}
        {(currentTab === 'wali' || currentTab === 'ai' || currentTab === 'celebrations' || currentTab === 'settings' || currentTab === 'api') && (
          <MemberProfileView
            lang={currentLang}
            currentSession={currentSession}
            initialSubTab={currentTab as any}
            initialSettingsCategory={initialSettingsCategory}
            onLogout={async () => {
              try {
                await logoutUser();
              } catch (e) {
                console.warn('Logout error:', e);
              }
              const guestSession = availableSessions.find(s => s.role === 'guest') || {
                id: 'guest',
                name: 'زائر / مستكشف',
                role: 'guest',
                avatar: ''
              };
              setCurrentSession(guestSession);
              setCurrentTab('home');
            }}
            proposals={proposals}
            onUpdateProposalStatus={handleUpdateProposalStatus}
            onOpenChat={(p) => setActiveChatProposal(p)}
            onOpenMeeting={(p) => setActiveMeetingProposal(p)}
            onOpenNikah={(p) => setActiveNikahProposal(p)}
            celebrations={celebrations}
            onAddCelebration={(newCelebration) => {
              setCelebrations(prev => [newCelebration, ...prev]);
              saveCelebrationToDb(newCelebration);
            }}
            settings={settings}
            onSaveSettings={(newSettings) => {
              setSettings(newSettings);
              if (currentSession?.id && currentSession.role !== 'guest') {
                saveUserSettingsToDb(currentSession.id, newSettings);
              }
            }}
            onLangChange={setCurrentLang}
            openCreateBioModal={() => setIsCreateBioModalOpen(true)}
            profiles={profiles}
            onViewProfile={handleViewProfile}
            photoRequests={photoRequests}
            onUpdatePhotoRequestStatus={handleUpdatePhotoRequestStatus}
            onUpdateProfile={handleUpdateMatrimonialProfile}
          />
        )}
      </main>

      {/* Full Islamic Matrimonial Profile Modal */}
      {isProfileModalOpen && selectedProfileForModal && (
        <ProfileModal
          profile={selectedProfileForModal}
          lang={currentLang}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSubmitProposal={handleKhitbahSubmit}
          currentSession={currentSession}
          onRequireLogin={() => {
            setLoginModalDefaultTab('login');
            setIsLoginModalOpen(true);
          }}
        />
      )}

      {/* Create Profile / Listing Modal */}
      {isCreateBioModalOpen && (
        <CreateProfileModal
          lang={currentLang}
          isOpen={isCreateBioModalOpen}
          onClose={() => setIsCreateBioModalOpen(false)}
          onProfileCreated={handleProfileCreated}
          currentSession={currentSession}
        />
      )}

      {/* Member / Wali SMS Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          lang={currentLang}
          isOpen={isLoginModalOpen}
          defaultTab={loginModalDefaultTab}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToDedicatedRegister={() => {
            setIsLoginModalOpen(false);
            setCurrentTab('register');
          }}
          onSuccess={(role, session) => {
            if (session) {
              setCurrentSession(session);
            } else if (role === 'wali') {
              const waliSession = availableSessions.find(s => s.role === 'wali');
              if (waliSession) setCurrentSession(waliSession);
            } else if (role === 'candidate') {
              const candidateSession = availableSessions.find(s => s.role === 'candidate');
              if (candidateSession) setCurrentSession(candidateSession);
            } else {
              const suitorSession = availableSessions.find(s => s.role === 'suitor');
              if (suitorSession) setCurrentSession(suitorSession);
            }
            setIsLoginModalOpen(false);
            setCurrentTab('explore');
          }}
        />
      )}

      {/* 3-Party Supervised Sharia Chat Modal */}
      {activeChatProposal && (
        <SupervisedChatModal
          isOpen={!!activeChatProposal}
          onClose={() => setActiveChatProposal(null)}
          proposal={activeChatProposal}
          currentSession={currentSession}
          lang={currentLang}
        />
      )}

      {/* Sharia Vision Meeting Scheduler Modal */}
      {activeMeetingProposal && (
        <ScheduleMeetingModal
          isOpen={!!activeMeetingProposal}
          onClose={() => setActiveMeetingProposal(null)}
          proposal={activeMeetingProposal}
          currentSession={currentSession}
          lang={currentLang}
          onMeetingScheduled={(propId, updatedProp) => {
            setProposals(prev => prev.map(p => p.id === propId ? updatedProp : p));
            setActiveMeetingProposal(updatedProp);
            saveProposalToDb(updatedProp);
            refreshBackendData();
          }}
        />
      )}

      {/* Nikah Contract & Istikhara Modal */}
      {activeNikahProposal && (
        <NikahContractModal
          isOpen={!!activeNikahProposal}
          onClose={() => setActiveNikahProposal(null)}
          proposal={activeNikahProposal}
          currentSession={currentSession}
          lang={currentLang}
          onNikahFinalized={(updatedProp, newCelebration) => {
            setProposals(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
            saveProposalToDb(updatedProp);
            if (newCelebration) {
              setCelebrations(prev => [newCelebration, ...prev]);
              saveCelebrationToDb(newCelebration);
            }
            refreshBackendData();
          }}
        />
      )}

      {/* Partner Marriage Preferences & Criteria Modal */}
      {isPreferencesModalOpen && (
        <MarriagePreferencesModal
          userId={currentSession.id || 'prof-1'}
          userGender={currentSession.role === 'candidate' ? 'female' : 'male'}
          lang={currentLang}
          onClose={() => setIsPreferencesModalOpen(false)}
          onPreferencesSaved={(savedPrefs: MarriagePreferences) => {
            setUserPreferences(savedPrefs);
            setIsPreferencesModalOpen(false);
            fetchProfilesFromApi();
          }}
        />
      )}

      {/* Send Official Marriage Request Modal */}
      {marriageRequestProfile && (
        <MarriageRequestModal
          profile={marriageRequestProfile}
          senderId={currentSession.id || 'prof-1'}
          lang={currentLang}
          onClose={() => setMarriageRequestProfile(null)}
          onRequestSent={() => {
            setMarriageRequestProfile(null);
            refreshBackendData();
          }}
        />
      )}

      {/* Sharia Photo Vision Request Permission Modal (طلب الإذن بالرؤية الشرعية للصورة) */}
      {photoRequestModalProfile && (
        <RequestPhotoPermissionModal
          isOpen={!!photoRequestModalProfile}
          onClose={() => setPhotoRequestModalProfile(null)}
          targetProfile={photoRequestModalProfile}
          currentSession={currentSession}
          lang={currentLang}
          onSubmitRequest={(profile, message) => {
            handleSendPhotoPermissionRequest(profile, message);
          }}
        />
      )}

      {/* Report Profile & Violations Modal */}
      {reportModalProfile && (
        <ReportModal
          profile={reportModalProfile}
          currentUserId={currentSession.id || 'prof-1'}
          lang={currentLang}
          onClose={() => setReportModalProfile(null)}
          onReportSubmitted={() => {
            setReportModalProfile(null);
          }}
        />
      )}

      {/* Block & Privacy Protection Modal */}
      {blockModalProfile && (
        <BlockModal
          profile={blockModalProfile}
          currentUserId={currentSession.id || 'prof-1'}
          lang={currentLang}
          onClose={() => setBlockModalProfile(null)}
          onBlockConfirmed={() => {
            if (blockModalProfile) {
              handleBlockSuccess(blockModalProfile.id);
            }
            setBlockModalProfile(null);
          }}
        />
      )}

      {/* Footer with database-backed settings & static pages */}
      <Footer
        lang={currentLang}
        onTabChange={setCurrentTab}
        onLangChange={setCurrentLang}
        isAdmin={currentSession.role === 'admin'}
        copyrightText={pageSettings.footerCopyright}
        onOpenPage={handleOpenPage}
      />

      {/* Dynamic Site Page View Modal (About, Terms, Privacy, Custom) */}
      {viewingSitePage && (
        <SitePageViewModal
          page={viewingSitePage}
          isOpen={!!viewingSitePage}
          onClose={() => setViewingSitePage(null)}
        />
      )}

    </div>
  );
}
