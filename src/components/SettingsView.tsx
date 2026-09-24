import React, { useState, useEffect } from 'react';
import { Language, UserSettings, UserSession, Profile, PhotoPermissionRequest } from '../types';
import { translations } from '../data/translations';
import { 
  Settings, 
  Globe, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Save, 
  CheckCircle2, 
  UserCheck, 
  ShieldAlert, 
  Smartphone, 
  Database,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Loader2,
  Trash2,
  User,
  Heart,
  Eye
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { PrivacySettingsSection } from './settings/PrivacySettingsSection';
import { WaliOversightSection } from './settings/WaliOversightSection';
import { NotificationSettingsSection } from './settings/NotificationSettingsSection';
import { AccountSecuritySection } from './settings/AccountSecuritySection';
import { AppearanceSection } from './settings/AppearanceSection';
import { AdvancedSecuritySettings } from './settings/AdvancedSecuritySettings';

export type SettingsCategoryTab = 
  | 'privacy' 
  | 'security'
  | 'wali' 
  | 'notifications' 
  | 'account' 
  | 'appearance';

interface SettingsViewProps {
  lang: Language;
  onLangChange: (newLang: Language) => void;
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  currentSession?: UserSession;
  userProfile?: Profile;
  onUpdateProfile?: (updatedProfile: Partial<Profile>) => void;
  initialCategory?: SettingsCategoryTab;
  photoRequests?: PhotoPermissionRequest[];
  onUpdatePhotoRequestStatus?: (requestId: string, newStatus: 'approved' | 'rejected') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  onLangChange,
  settings,
  onSaveSettings,
  currentSession,
  userProfile,
  onUpdateProfile,
  initialCategory,
  photoRequests = [],
  onUpdatePhotoRequestStatus
}) => {
  const t = translations[lang] || translations.ar;
  const [activeCategory, setActiveCategory] = useState<SettingsCategoryTab>(initialCategory || 'privacy');
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Sync activeCategory if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Keep localSettings synchronized when prop updates
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleSettingsPartialChange = (partial: Partial<UserSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      ...partial
    }));
    setHasChanges(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(localSettings);
      if (onUpdateProfile) {
        onUpdateProfile({
          isPhotoBlurredByDefault: localSettings.blurPhotosByDefault,
          fullName: localSettings.account?.displayName,
          city: localSettings.account?.city
        });
      }
      if (localSettings.language && localSettings.language !== lang) {
        onLangChange(localSettings.language);
      }
      setSavedSuccess(true);
      setHasChanges(false);
      fireCelebrationConfetti();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  // Export JSON Backup
  const handleExportData = () => {
    const exportPayload = {
      app: 'Meethaq Islamic Matrimonial',
      exportedAt: new Date().toISOString(),
      user: {
        id: currentSession?.id || 'guest',
        name: currentSession?.name || localSettings.account?.displayName || 'عضو ميثاق',
        role: currentSession?.role || 'member'
      },
      settings: localSettings,
      profileSnapshot: userProfile ? {
        fullName: userProfile.fullName,
        age: userProfile.age,
        gender: userProfile.gender,
        city: userProfile.city,
        country: userProfile.country,
        education: userProfile.education,
        profession: userProfile.profession,
        verificationStatus: userProfile.moderationStatus
      } : null
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `meethaq-settings-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccountConfirm = () => {
    if (deleteConfirmationText.trim().toLowerCase() === 'حذف حسابي' || deleteConfirmationText.trim().toLowerCase() === 'delete') {
      alert('تم استلام طلب حذف الحساب وسيتم مسح كافة البيانات بصورة نهائية خلال 24 ساعة وفقاً لسياسة الخصوصية.');
      setIsDeleteModalOpen(false);
      setDeleteConfirmationText('');
    }
  };

  const isFemale = userProfile?.gender === 'female' || currentSession?.role === 'candidate';

  const categoryTabs: {
    id: SettingsCategoryTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'privacy',
      label: 'الخصوصية والستر الشرعي',
      description: 'طمس الصور، إذن الولي، ومستوى الظهور',
      icon: <Lock className="w-4 h-4 text-[#9b4c2e]" />,
      badge: 'أولوية'
    },
    {
      id: 'security',
      label: 'الأمان والتحقق 2FA',
      description: 'تطبيقات المصادقة، إدارة الجلسات، وسجل الدخول',
      icon: <ShieldAlert className="w-4 h-4 text-emerald-600" />,
      badge: 'مهم'
    },
    ...(currentSession?.role !== 'suitor' ? [{
      id: 'wali' as SettingsCategoryTab,
      label: 'إشراف وبوابة الولي',
      description: 'بيانات الولي، صك الولاية، وقنوات الإشعار',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      badge: 'شرعي'
    }] : []),
    {
      id: 'notifications',
      label: 'التنبيهات والإشعارات',
      description: 'SMS، WhatsApp، تذكير الاستخارة، والرؤية',
      icon: <Bell className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'account',
      label: 'الحساب والأمان',
      description: 'الهوية، التحقق المزدوج، والتجميد المؤقت',
      icon: <UserCheck className="w-4 h-4 text-neutral-700" />
    },
    {
      id: 'appearance',
      label: 'اللغة وسهولة الاستخدام',
      description: 'اللغات الست، تكبير الخط، والتباين',
      icon: <Globe className="w-4 h-4 text-amber-600" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 text-start" id="settings-view-container">
      
      {/* 1. Header Card with Firestore Status & User Identity */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-neutral-900 text-[#d9c58b] text-xs font-bold px-3 py-1 rounded-full">
              <Settings className="w-3.5 h-3.5" />
              <span>مركز إعدادات المستخدم والخصوصية الشرعية</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-neutral-900 tracking-tight">
              إعدادات حسابك وضوابط الستر والتواصل
            </h1>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              تحكم بمرونة كاملة في كيفية ظهور سيرتك الذاتية، تفعيل إشراف ولي الأمر المباشر، وتخصيص قنوات التنبيهات مع حفظ دائم في سحابة Firestore.
            </p>
          </div>

          {/* User & Firestore Sync Capsule */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 shrink-0">
            <div className="flex items-center gap-2 text-start">
              <div className="w-8 h-8 rounded-full bg-[#9b4c2e]/10 text-[#9b4c2e] font-bold text-xs flex items-center justify-center border border-[#9b4c2e]/20">
                {currentSession?.name ? currentSession.name.charAt(0) : 'م'}
              </div>
              <div className="text-start">
                <span className="text-xs font-bold text-neutral-900 block truncate max-w-[140px]">
                  {currentSession?.name || localSettings.account?.displayName || 'عضو ميثاق'}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  {currentSession?.role === 'candidate' ? 'مرشحة مصونة' : currentSession?.role === 'wali' ? 'ولي أمر معتمد' : currentSession?.role === 'admin' ? 'مشرف المنصة' : 'خاطب مسجل'}
                </span>
              </div>
            </div>

            {/* Live Firestore DB indicator */}
            <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-800 font-mono font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Firestore متزامن</span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>تم حفظ كافة الإعدادات والضوابط الشرعية في Firestore بنجاح!</span>
            </div>
            <span className="text-xs text-emerald-700 bg-white/60 px-2 py-0.5 rounded-md font-mono">
              تم التحديث الآن
            </span>
          </div>
        )}
      </div>

      {/* 2. Categorized Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-200">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer border-b-2 -mb-px ${
                isActive
                  ? 'border-[#9b4c2e] text-[#9b4c2e] bg-white shadow-2xs'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-[#9b4c2e]/15 text-[#9b4c2e]'
                    : 'bg-neutral-200/80 text-neutral-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content Section */}
      <div className="space-y-6">
        {activeCategory === 'privacy' && (
          <PrivacySettingsSection
            settings={localSettings}
            onChange={handleSettingsPartialChange}
            avatarUrl={userProfile?.avatarUrl || currentSession?.avatar}
            isFemale={isFemale}
            candidateProfileId={userProfile?.id || currentSession?.relatedProfileId || (currentSession?.role === 'candidate' ? currentSession.id : undefined)}
            photoRequests={photoRequests}
            onUpdatePhotoRequestStatus={onUpdatePhotoRequestStatus}
          />
        )}

        {activeCategory === 'security' && (
          <AdvancedSecuritySettings
            settings={localSettings}
            onChange={handleSettingsPartialChange}
            currentUserName={currentSession?.name || localSettings.account?.displayName}
            currentUserRole={currentSession?.role}
          />
        )}

        {activeCategory === 'wali' && currentSession?.role !== 'suitor' && (
          <WaliOversightSection
            settings={localSettings}
            onChange={handleSettingsPartialChange}
            isFemale={isFemale}
          />
        )}

        {activeCategory === 'notifications' && (
          <NotificationSettingsSection
            settings={localSettings}
            onChange={handleSettingsPartialChange}
          />
        )}

        {activeCategory === 'account' && (
          <AccountSecuritySection
            settings={localSettings}
            onChange={handleSettingsPartialChange}
            onExportData={handleExportData}
            onDeleteAccountRequest={() => setIsDeleteModalOpen(true)}
            onNavigateToSecurity={() => setActiveCategory('security')}
          />
        )}

        {activeCategory === 'appearance' && (
          <AppearanceSection
            settings={localSettings}
            onChange={handleSettingsPartialChange}
            onLangChange={onLangChange}
          />
        )}
      </div>

      {/* 4. Bottom Sticky / Floating Save Bar */}
      <div className={`sticky bottom-4 z-30 transition duration-200 ${hasChanges ? 'opacity-100 translate-y-0' : 'opacity-95'}`}>
        <div className="bg-neutral-950/95 backdrop-blur-md text-white p-4 rounded-2xl border border-neutral-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${hasChanges ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></div>
            <span>
              {hasChanges 
                ? 'لديك تعديلات غير محفوظة، اضغط حفظ لتحديثها في Firestore' 
                : 'كافة الإعدادات متطابقة ومتزامنة مع قاعدة البيانات'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {hasChanges && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إلغاء التعديلات</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className={`px-6 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                hasChanges 
                  ? 'bg-[#9b4c2e] hover:bg-[#853e24] text-white ring-2 ring-[#9b4c2e]/40' 
                  : 'bg-white/20 text-neutral-200 hover:bg-white/30'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>جارٍ الحفظ في Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ الإعدادات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Delete Account Safety Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-rose-200 shadow-2xl space-y-4 text-start animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-2 text-rose-900 pb-2 border-b border-neutral-100">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold">
                تأكيد حذف الحساب نهائياً
              </h3>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p className="text-rose-700 font-semibold">
                تحذير: سيتم حذف كافة السجلات، الصور، والمحادثات الموثقة بصورة لا رجعة فيها.
              </p>
              <p>
                لتأكيد رغبتك الصريحة في حذف الحساب، يرجى كتابة العبارة <span className="font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded font-mono">حذف حسابي</span> في الحقل أدناه:
              </p>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="اكتب: حذف حسابي"
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-rose-300 focus:outline-none focus:border-rose-500 bg-rose-50/40 text-neutral-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmationText('');
                }}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition cursor-pointer"
              >
                إلغاء وتراجع
              </button>
              <button
                type="button"
                onClick={handleDeleteAccountConfirm}
                disabled={deleteConfirmationText.trim() !== 'حذف حسابي'}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  deleteConfirmationText.trim() === 'حذف حسابي'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف الحساب نهائياً</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
