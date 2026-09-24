import React, { useState, useEffect } from 'react';
import { 
  Language, 
  UserSession, 
  Proposal, 
  CelebrationInvitation, 
  UserSettings, 
  Profile,
  PhotoPermissionRequest 
} from '../types';
import { translations } from '../data/translations';
import { 
  User, 
  ShieldCheck, 
  HeartHandshake, 
  PartyPopper, 
  Settings as SettingsIcon, 
  Code2, 
  ShieldAlert, 
  Bot, 
  FileText, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  Sparkles, 
  Edit3, 
  Eye, 
  Lock,
  ChevronRight,
  Award
} from 'lucide-react';
import { WaliPortal } from './WaliPortal';
import { AiCounselorView } from './AiCounselorView';
import { CelebrationsView } from './CelebrationsView';
import { SettingsView, SettingsCategoryTab } from './SettingsView';
import { ApiDocumentationView } from './ApiDocumentationView';
import { ProfileCard } from './ProfileCard';
import { ProfileCompletionProgress } from './profile/ProfileCompletionProgress';
import { ProfileAchievementsView } from './profile/ProfileAchievementsView';
import { computeProfileAchievements } from '../utils/achievements';

export type ProfileSubTab = 
  | 'bio' 
  | 'achievements'
  | 'wali' 
  | 'ai' 
  | 'celebrations' 
  | 'settings' 
  | 'api' 
  | 'admin';

interface MemberProfileViewProps {
  lang: Language;
  currentSession: UserSession;
  onLogout: () => void;
  proposals: Proposal[];
  onUpdateProposalStatus: (id: string, newStatus: Proposal['status'], stage: string) => void;
  onOpenChat: (proposal: Proposal) => void;
  onOpenMeeting: (proposal: Proposal) => void;
  onOpenNikah: (proposal: Proposal) => void;
  celebrations: CelebrationInvitation[];
  onAddCelebration: (celebration: CelebrationInvitation) => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onLangChange: (lang: Language) => void;
  openCreateBioModal: () => void;
  profiles: Profile[];
  initialSubTab?: ProfileSubTab;
  initialSettingsCategory?: SettingsCategoryTab;
  onViewProfile?: (profile: Profile) => void;
  photoRequests?: PhotoPermissionRequest[];
  onUpdatePhotoRequestStatus?: (requestId: string, newStatus: 'approved' | 'rejected') => void;
  onUpdateProfile?: (updatedProfile: Partial<Profile>) => void;
}

export const MemberProfileView: React.FC<MemberProfileViewProps> = ({
  lang,
  currentSession,
  onLogout,
  proposals,
  onUpdateProposalStatus,
  onOpenChat,
  onOpenMeeting,
  onOpenNikah,
  celebrations,
  onAddCelebration,
  settings,
  onSaveSettings,
  onLangChange,
  openCreateBioModal,
  profiles,
  initialSubTab = 'bio',
  initialSettingsCategory,
  onViewProfile,
  photoRequests = [],
  onUpdatePhotoRequestStatus,
  onUpdateProfile
}) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const isAdmin = currentSession.role === 'admin';

  // Find user's matrimonial profile if any
  const userMatrimonialProfile = profiles.find(p => 
    p.id === currentSession.id || 
    p.fullName.toLowerCase() === currentSession.name.toLowerCase() ||
    (currentSession.role === 'candidate' && p.gender === 'female') ||
    (currentSession.role === 'suitor' && p.gender === 'male')
  );

  const achievements = computeProfileAchievements(userMatrimonialProfile, currentSession);

  const pendingWaliCount = proposals.filter(p => p.stage === 'wali_pending' || p.status === 'pending_wali').length;
  const activeProposalsCount = proposals.length;

  const showWaliTab = currentSession.role === 'candidate' || currentSession.role === 'wali' || currentSession.role === 'admin';

  const tabs: {
    id: ProfileSubTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
    hidden?: boolean;
  }[] = [
    {
      id: 'bio',
      label: 'سيرتي الذاتية',
      description: 'بيانات الخطوبة والمطابقة والستر',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'achievements',
      label: 'الأوسمة والإنجازات',
      description: 'أوسمة التوثيق والالتزام وحسن المعاشرة',
      icon: <Award className="w-4 h-4 text-amber-600" />,
      badge: achievements.unlockedCount > 0 ? achievements.unlockedCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    ...(showWaliTab ? [{
      id: 'wali' as ProfileSubTab,
      label: 'بوابة الولي الشرعي',
      description: 'إشراف وتوثيق الولي وموافقة الرؤية',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      badge: pendingWaliCount > 0 ? pendingWaliCount : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    }] : []),
    {
      id: 'ai',
      label: 'المستشار والتوافق الشرعي',
      description: 'استشارات الأسرة وصلاة الاستخارة',
      icon: <Bot className="w-4 h-4 text-blue-500" />
    },
    {
      id: 'celebrations',
      label: 'أفراح ومناسبات ميثاق',
      description: 'دعوات عقد القران وبطاقات المباركة',
      icon: <PartyPopper className="w-4 h-4 text-pink-500" />
    },
    {
      id: 'settings',
      label: 'إعدادات الحساب والخصوصية',
      description: 'حجب الصور والتنبيهات واللغة',
      icon: <SettingsIcon className="w-4 h-4 text-slate-600" />
    },
    {
      id: 'api',
      label: 'التوثيق البرمجي (API)',
      description: 'بوابات الربط والتحقق الشرعي للمطورين',
      icon: <Code2 className="w-4 h-4 text-purple-600" />
    },
    {
      id: 'admin',
      label: 'لوحة الإدارة الشرعية',
      description: 'التدقيق الشامل والمخالفات والأمان',
      icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
      hidden: !isAdmin
    }
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Member Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-[#ede5dd] shadow-2xs overflow-hidden">
        {/* Cover Band */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-[#9b4c2e] via-[#853e24] to-[#672c18] relative flex items-end p-4 sm:p-6">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-white/20 border border-white/30 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d9e9bb]" />
              عضوية ميثاق الموثقة بالهوية والولي
            </span>
          </div>
        </div>

        {/* Member Profile Meta & Actions */}
        <div className="p-4 sm:p-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 border-b border-[#ede5dd]">
          <div className="flex items-end gap-4">
            {/* Avatar / Seal */}
            <div className="relative">
              {currentSession.avatar ? (
                <img 
                  src={currentSession.avatar} 
                  alt={currentSession.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-stone-100"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-3xl sm:text-4xl border-4 border-white shadow-md">
                  {currentSession.name.charAt(0) || 'م'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]" title="موثق شرعياً">
                ✓
              </div>
            </div>

            {/* Name & Role */}
            <div className="space-y-1 pb-1 text-start">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-neutral-900">
                  {currentSession.name}
                </h1>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  currentSession.role === 'wali'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : currentSession.role === 'candidate'
                    ? 'bg-[#fbf1eb] text-[#9b4c2e] border-[#9b4c2e]/30'
                    : currentSession.role === 'admin'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                }`}>
                  {currentSession.role === 'wali' ? '👑 ولي أمر معتمد' :
                   currentSession.role === 'candidate' ? '🌸 أخت مرشحة للعفاف' :
                   currentSession.role === 'admin' ? '⚡ مشرف النظام والإدارة' :
                   '💍 خاطب باحث عن العفاف'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
                {currentSession.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span dir="ltr">{currentSession.phone}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  حساب نشط ومفعل
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={openCreateBioModal}
              className="flex items-center gap-1.5 bg-[#9b4c2e] text-white hover:bg-[#853e24] px-4 py-2 rounded-full font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-white/90" />
              <span>تحديث السيرة الذاتية</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3.5 py-2 rounded-full font-bold text-xs transition cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#ede5dd] bg-[#faf8f5]">
          <div className="p-4 text-center">
            <span className="block text-xs text-neutral-500">طلبات الخطوبة والأنشطة</span>
            <span className="text-xl font-extrabold text-neutral-900 font-display">{activeProposalsCount}</span>
          </div>
          <div 
            onClick={() => setActiveSubTab('achievements')}
            className="p-4 text-center cursor-pointer hover:bg-amber-50/70 transition group select-none"
            title="انقر لعرض الأوسمة والإنجازات"
          >
            <span className="block text-xs text-neutral-500 group-hover:text-amber-800">الأوسمة الرقمية</span>
            <span className="text-xl font-extrabold text-amber-600 font-display flex items-center justify-center gap-1.5">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{achievements.unlockedCount} / {achievements.totalCount}</span>
            </span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-xs text-neutral-500">إشراف الولي الشرعي</span>
            <span className="text-xl font-extrabold text-emerald-600 font-display">معتمد وموثق</span>
          </div>
          <div className="p-4 text-center">
            <span className="block text-xs text-neutral-500">حالة الخصوصية والستر</span>
            <span className="text-xl font-extrabold text-neutral-800 font-display">
              {settings.blurPhotosByDefault ? 'حجب الصور مفعّل' : 'عرض مباشر'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Completion Progress Indicator */}
      {!isAdmin && (
        <ProfileCompletionProgress
          profile={userMatrimonialProfile}
          lang={lang}
          onEditProfile={openCreateBioModal}
          onViewAchievements={() => setActiveSubTab('achievements')}
        />
      )}

      {/* 2. Sub-Tabs Bar: The Core Hub Navigation */}
      <div className="bg-white rounded-2xl border border-[#ede5dd] p-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.filter(tab => !tab.hidden).map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#9b4c2e] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${tab.badgeColor || 'bg-white text-[#9b4c2e]'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub-Tab Active View Content */}
      <div className="min-h-[400px]">
        {/* Tab A: My Bio & Matrimonial Profile */}
        {activeSubTab === 'bio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 font-display">ملفي وسيرتي الذاتية للخطوبة</h2>
                <p className="text-xs text-neutral-500">
                  هذه السيرة المعروضة للراغبين في الحلال وفق ضوابط الستر وبرعاية الولي
                </p>
              </div>
              <button
                onClick={openCreateBioModal}
                className="bg-[#9b4c2e] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#853e24] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-white/90" />
                <span>تعديل السيرة الذاتية</span>
              </button>
            </div>

            {userMatrimonialProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="sticky top-24">
                    <span className="block text-xs font-bold text-neutral-500 mb-2">معاينة بطاقة سيرتك:</span>
                    <ProfileCard
                      profile={userMatrimonialProfile}
                      lang={lang}
                      onViewProfile={onViewProfile || (() => {})}
                      onRequestMarriage={onViewProfile || (() => {})}
                      onReportProfile={() => {}}
                      onBlockUser={() => {}}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-[#ede5dd] shadow-2xs space-y-4 text-start">
                    <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#9b4c2e]" />
                      تفاصيل السيرة والضوابط الشرعية
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ede5dd]">
                        <span className="text-neutral-500 block mb-1">المحافظة على الصلاة:</span>
                        <span className="font-bold text-neutral-900 text-sm">
                          {userMatrimonialProfile.prayerHabit === 'always_in_mosque' ? 'في المسجد دائماً' :
                           userMatrimonialProfile.prayerHabit === 'always_on_time' ? 'في وقتها دائماً' : 'غالباً في وقتها'}
                        </span>
                      </div>
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ede5dd]">
                        <span className="text-neutral-500 block mb-1">حفظ القرآن الكريم:</span>
                        <span className="font-bold text-neutral-900 text-sm">{userMatrimonialProfile.quranMemorization}</span>
                      </div>
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ede5dd]">
                        <span className="text-neutral-500 block mb-1">الهيئة واللباس الشرعي:</span>
                        <span className="font-bold text-neutral-900 text-sm">{userMatrimonialProfile.religiousAttire}</span>
                      </div>
                      <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#ede5dd]">
                        <span className="text-neutral-500 block mb-1">توقع المهر:</span>
                        <span className="font-bold text-neutral-900 text-sm">{userMatrimonialProfile.mahrExpectation || 'الميسور المبارك'}</span>
                      </div>
                    </div>

                    {/* Guardian Info: ONLY for female candidates or wali accounts! Male suitor has Ba'ah & housing */}
                    {currentSession.role !== 'suitor' && userMatrimonialProfile.gender === 'female' ? (
                      <div className="space-y-2 pt-2 border-t border-[#ede5dd] text-xs">
                        <h4 className="font-bold text-neutral-900">بيانات الولي المعتمد:</h4>
                        <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-emerald-900">{userMatrimonialProfile.wali.name} ({userMatrimonialProfile.wali.relation})</p>
                            <p className="text-emerald-700 text-[11px] mt-0.5">{userMatrimonialProfile.wali.notes || 'التواصل المباشر مع الولي لترتيب الرؤية'}</p>
                          </div>
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                            ولي موثق ✓
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t border-[#ede5dd] text-xs">
                        <h4 className="font-bold text-neutral-900">بيانات الباءة والاستطاعة والنفقة (للخاطب):</h4>
                        <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-amber-950">إقرار القدرة على الباءة والنفقة الشرعية والسكن المستقل</p>
                            <p className="text-amber-800 text-[11px] mt-0.5">جاهز لزيارة مجلس ولي أمر المخطوبة وإتمام العقد بالمعروف</p>
                          </div>
                          <span className="bg-[#9b4c2e] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                            باءة موثقة ✓
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-2 text-xs">
                      <h4 className="font-bold text-neutral-900">نبذة عن النفس والهدف من الزواج:</h4>
                      <p className="bg-[#faf8f5] p-3 rounded-xl border border-[#ede5dd] text-neutral-700 leading-relaxed">
                        {userMatrimonialProfile.aboutMe}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <h4 className="font-bold text-neutral-900">مواصفات الشريك المطلوب:</h4>
                      <p className="bg-[#faf8f5] p-3 rounded-xl border border-[#ede5dd] text-neutral-700 leading-relaxed">
                        {userMatrimonialProfile.partnerExpectations}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-[#ede5dd] shadow-2xs text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#fbf1eb] text-[#9b4c2e] border border-[#9b4c2e]/20 flex items-center justify-center mx-auto text-2xl font-bold">
                  📝
                </div>
                <h3 className="font-bold text-lg text-neutral-900">لم تقم بإنشاء سيرتك الذاتية بعد</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  أنشئ سيرتك الذاتية الإسلامية الآن لتظهر في قائمة الباحثين عن العفاف ولتتمكن من استقبال طلبات الخطوبة الشرعية وإدارتها بإشراف الولي.
                </p>
                <button
                  onClick={openCreateBioModal}
                  className="bg-[#9b4c2e] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#853e24] transition cursor-pointer shadow-xs"
                >
                  إنشاء السيرة الذاتية الآن
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab B: Profile Achievements & Digital Badges */}
        {activeSubTab === 'achievements' && (
          <ProfileAchievementsView
            profile={userMatrimonialProfile}
            currentSession={currentSession}
            lang={lang}
            onEditProfile={openCreateBioModal}
            onViewPublicProfile={userMatrimonialProfile && onViewProfile ? () => onViewProfile(userMatrimonialProfile) : undefined}
          />
        )}

        {/* Tab C: Wali Portal */}
        {activeSubTab === 'wali' && (
          <div className="bg-white rounded-2xl border border-[#ede5dd] shadow-2xs p-2 sm:p-4">
            <WaliPortal
              lang={lang}
              proposals={proposals}
              photoRequests={photoRequests}
              onUpdatePhotoRequestStatus={onUpdatePhotoRequestStatus}
              onUpdateProposalStatus={onUpdateProposalStatus}
              onOpenChat={onOpenChat}
              onOpenMeeting={onOpenMeeting}
              onOpenNikah={onOpenNikah}
            />
          </div>
        )}

        {/* Tab C: AI Sharia Counselor */}
        {activeSubTab === 'ai' && (
          <div className="bg-white rounded-2xl border border-[#ede5dd] shadow-2xs p-2 sm:p-4">
            <AiCounselorView lang={lang} />
          </div>
        )}

        {/* Tab D: Celebrations View */}
        {activeSubTab === 'celebrations' && (
          <div className="bg-white rounded-2xl border border-[#ede5dd] shadow-2xs p-2 sm:p-4">
            <CelebrationsView
              lang={lang}
              celebrations={celebrations}
              onAddCelebration={onAddCelebration}
            />
          </div>
        )}

        {/* Tab E: Settings & Privacy */}
        {activeSubTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#ede5dd] shadow-2xs p-2 sm:p-4">
            <SettingsView
              lang={lang}
              onLangChange={onLangChange}
              settings={settings}
              onSaveSettings={onSaveSettings}
              currentSession={currentSession}
              userProfile={userMatrimonialProfile}
              initialCategory={initialSettingsCategory}
              photoRequests={photoRequests}
              onUpdatePhotoRequestStatus={onUpdatePhotoRequestStatus}
              onUpdateProfile={onUpdateProfile}
            />
          </div>
        )}

        {/* Tab F: API & Developer Documentation */}
        {activeSubTab === 'api' && (
          <div className="bg-white rounded-2xl border border-[#ede5dd] shadow-2xs p-2 sm:p-4">
            <ApiDocumentationView lang={lang} />
          </div>
        )}

        {/* Tab G: Admin Dashboard (For Admin) */}
        {activeSubTab === 'admin' && isAdmin && (
          <div className="bg-white rounded-2xl border border-[#ede5dd] shadow-2xs p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900 font-cairo">
                غرفة عمليات ولوحة تحكم الإدارة المستقلة (/admin)
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                تم فصل لوحة الإدارة في مسار مستقل بالكامل يضم المؤشرات المالية، تدقيق الأولياء، إعدادات الذكاء الاصطناعي، والإضافات المتوافقة.
              </p>
            </div>
            <button
              onClick={() => {
                window.history.pushState(null, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
            >
              فتح لوحة الإدارة الكاملة في /admin ↗
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
