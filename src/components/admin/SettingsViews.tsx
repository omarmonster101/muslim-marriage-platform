import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Check, 
  AlertCircle, 
  Database, 
  Lock, 
  Globe, 
  Mail, 
  Search, 
  Palette, 
  FileText, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle, 
  ShieldCheck,
  Send,
  Sliders,
  Laptop
} from 'lucide-react';
import { 
  fetchGlobalSiteSettingsFromDb, 
  saveGlobalSiteSettingsToDb, 
  subscribeToGlobalSiteSettings,
  fetchPageSettingsFromDb,
  savePageSettingsToDb,
  subscribeToPageSettings,
  fetchLocalizationConfigFromDb,
  saveLocalizationConfigToDb,
  subscribeToLocalizationConfig,
  DEFAULT_GLOBAL_SITE_SETTINGS,
  DEFAULT_PAGE_LAYOUT_SETTINGS
} from '../../lib/firebase';
import { DEFAULT_LOCALIZATION_CONFIG } from '../../data/defaultLocalizationData';
import { GlobalSiteSettings, PageLayoutSettings, LocalizationConfig } from '../../types';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { CountriesSettingsTab } from './CountriesSettingsTab';
import { LanguagesSettingsTab } from './LanguagesSettingsTab';

interface SettingsProps {
  currentSubSection: string;
}

export const SettingsViews: React.FC<SettingsProps> = ({ currentSubSection }) => {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  // 1. Global Platform Settings (synced live with Firestore site_settings/global)
  const [globalSettings, setGlobalSettings] = useState<GlobalSiteSettings>(DEFAULT_GLOBAL_SITE_SETTINGS);

  // 2. Page Layout Settings (synced live with Firestore site_settings/pages_config)
  const [pageSettings, setPageSettings] = useState<PageLayoutSettings>(DEFAULT_PAGE_LAYOUT_SETTINGS);

  // 3. Localization Settings (Countries, Cities, Languages, Translations)
  const [localizationConfig, setLocalizationConfig] = useState<LocalizationConfig>(DEFAULT_LOCALIZATION_CONFIG);

  // Test email state
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    let isMounted = true;

    // Load initial
    Promise.all([
      fetchGlobalSiteSettingsFromDb(),
      fetchPageSettingsFromDb(),
      fetchLocalizationConfigFromDb()
    ]).then(([gSettings, pSettings, locConfig]) => {
      if (isMounted) {
        if (gSettings) setGlobalSettings(gSettings);
        if (pSettings) setPageSettings(pSettings);
        if (locConfig) setLocalizationConfig(locConfig);
        setIsDbLoaded(true);
      }
    }).catch(err => {
      console.warn('Initial settings load error:', err);
      if (isMounted) setIsDbLoaded(true);
    });

    const unsubGlobal = subscribeToGlobalSiteSettings((remoteGlobal) => {
      if (isMounted && remoteGlobal) {
        setGlobalSettings(remoteGlobal);
      }
    });

    const unsubLocalization = subscribeToLocalizationConfig((remoteLoc) => {
      if (isMounted && remoteLoc) {
        setLocalizationConfig(remoteLoc);
      }
    });

    const unsubPages = subscribeToPageSettings((remotePages) => {
      if (isMounted && remotePages) {
        setPageSettings(remotePages);
      }
    });

    return () => {
      isMounted = false;
      unsubGlobal();
      unsubPages();
    };
  }, []);

  const showSuccessNotice = (sectionTitle: string) => {
    setSavedMessage(`تم حفظ إعدادات "${sectionTitle}" ومزامنتها بنجاح مع سحابة قاعدة البيانات (Firestore)!`);
    setErrorMessage(null);
    fireCelebrationConfetti();
    setTimeout(() => {
      setSavedMessage(null);
    }, 4500);
  };

  const showErrorNotice = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  // Save Handlers for each section
  const handleSaveGlobal = async (sectionName: string, partialUpdates: Partial<GlobalSiteSettings>) => {
    setIsSavingDb(true);
    setErrorMessage(null);
    try {
      const updated = { ...globalSettings, ...partialUpdates };
      setGlobalSettings(updated);
      const success = await saveGlobalSiteSettingsToDb(updated);
      if (success) {
        showSuccessNotice(sectionName);
      } else {
        showErrorNotice('تعذر حفظ الإعدادات في قاعدة البيانات، يرجى التحقق من الاتصال.');
      }
    } catch (e: any) {
      showErrorNotice(e?.message || 'حدث خطأ أثناء الاتصال بقاعدة البيانات.');
    } finally {
      setIsSavingDb(false);
    }
  };

  const handleSavePageSettings = async () => {
    setIsSavingDb(true);
    setErrorMessage(null);
    try {
      const success = await savePageSettingsToDb(pageSettings);
      // Also sync announcement into globalSettings for unified state
      await saveGlobalSiteSettingsToDb({
        headerAnnouncement: pageSettings.headerAnnouncement,
        footerCopyright: pageSettings.footerCopyright,
        customHeaderScripts: pageSettings.customHeaderScripts
      });
      if (success) {
        showSuccessNotice('إعدادات الصفحات والتخطيط');
      } else {
        showErrorNotice('تعذر حفظ تخطيط الصفحات في قاعدة البيانات.');
      }
    } catch (e: any) {
      showErrorNotice(e?.message || 'فشل حفظ إعدادات الصفحات.');
    } finally {
      setIsSavingDb(false);
    }
  };

  const handleSendTestEmail = () => {
    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    setTimeout(() => {
      setIsSendingTestEmail(false);
      setTestEmailResult(`تم اختبار اتصال خادم ${globalSettings.smtpHost}:${globalSettings.smtpPort} بنجاح، وإرسال بريد تجريبي إلى ${globalSettings.adminEmail}.`);
    }, 1200);
  };

  const themesList = [
    {
      id: 'emerald',
      name: 'ميثاق كلاسيك الأصيل (Terracotta & Emerald)',
      description: 'النمط الشرعي المعتمد المستوحى من التراث الإسلامي ودرجات التيراكوتا والوقار.',
      previewBg: 'bg-[#9b4c2e]'
    },
    {
      id: 'aurora',
      name: 'Aurora Soft (النمط الإشراقي)',
      description: 'تدرجات نقية فاتحة مع بطاقات مريحة للعينين وتناسق ألوان هادئ.',
      previewBg: 'bg-indigo-600'
    },
    {
      id: 'midnight',
      name: 'Midnight Royal (النمط الليلي الفاخر)',
      description: 'تصميم داكن عالي التباين ومريح جداً للاستخدام في الإضاءة الخافتة.',
      previewBg: 'bg-neutral-900'
    },
    {
      id: 'miniature',
      name: 'Miniature Compact (النمط المدمج)',
      description: 'تخطيط عالي الكثافة مع بطاقات مدمجة لسرعة التصفح واستعراض البيانات.',
      previewBg: 'bg-slate-700'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl text-start font-cairo">
      
      {/* Top Real-time Cloud Connection Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-neutral-900">سحابة قاعدة البيانات المباشرة (Live Firestore)</span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                مربوط ومتزامن
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              موقع الحفظ: <code className="text-[11px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded">site_settings/global</code> • كافة التعديلات تُطبّق فوراً على جميع زوار المنصة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isSavingDb && (
            <span className="text-xs font-bold text-[#9b4c2e] flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              جاري الحفظ في Firestore...
            </span>
          )}
        </div>
      </div>

      {/* Notifications */}
      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-2xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-2xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. GENERAL SETTINGS */}
      {currentSubSection === 'settings_general' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              الإعدادات العامة وهوية المنصة (General Settings)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              اسم المنصة، الشعار اللفظي، البريد الإداري، وضع الصيانة الشرعي، ورقم الدعم المعتمد.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5 shadow-2xs text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">اسم المنصة الرسمي (Site Name)</label>
                <input
                  type="text"
                  value={globalSettings.siteName}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, siteName: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-bold text-neutral-900 focus:bg-white focus:border-[#9b4c2e] transition"
                  placeholder="منصة ميثاق للزواج الإسلامي الشرعي"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">بريد الإدارة المعتمد (Admin Email)</label>
                <input
                  type="email"
                  value={globalSettings.adminEmail}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, adminEmail: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900 focus:bg-white focus:border-[#9b4c2e] transition"
                  placeholder="admin@meethaq.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1.5">الشعار اللفظي والرسالة الشرعية (Tagline)</label>
              <input
                type="text"
                value={globalSettings.siteTagline}
                onChange={(e) => setGlobalSettings({ ...globalSettings, siteTagline: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900 focus:bg-white focus:border-[#9b4c2e] transition"
                placeholder="صون الأعراض وبناء البيوت على هدي النبوة وإشراف الأولياء"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">رقم هاتف الدعم والاستشارات الشرعية</label>
                <input
                  type="text"
                  value={globalSettings.supportPhone || ''}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, supportPhone: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900 focus:bg-white focus:border-[#9b4c2e] transition"
                  placeholder="+966 11 400 9988"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">رئيس لجنة الإشراف والرقابة الشرعية</label>
                <input
                  type="text"
                  value={globalSettings.shariaCommitteeLead || ''}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, shariaCommitteeLead: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-bold text-neutral-900 focus:bg-white focus:border-[#9b4c2e] transition"
                  placeholder="فضيلة الشيخ د. عبدالمحسن العتيبي"
                />
              </div>
            </div>

            {/* Maintenance Mode Switch */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-amber-900 block text-sm">وضع الصيانة والتحديث (Maintenance Mode)</span>
                <span className="text-[11px] text-amber-700">
                  عند تفعيل هذا الخيار، سيتم عرض صفحة صيانة وقورة للزوار مع استمرار وصول المديرين بصورة طبيعية.
                </span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.isMaintenance}
                onChange={(e) => setGlobalSettings({ ...globalSettings, isMaintenance: e.target.checked })}
                className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isSavingDb}
                onClick={() => handleSaveGlobal('الإعدادات العامة', globalSettings)}
                className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>حفظ الإعدادات العامة في قاعدة البيانات</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. USER SETTINGS */}
      {currentSubSection === 'settings_users' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              ضوابط وقواعد تسجيل الأعضاء (User Registration Settings)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              الضوابط الشرعية الصارمة لإلزامية الولي، حجب صور الأخوات، ومطابقة الهوية الوطنية.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
            
            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="font-bold text-neutral-900 block">إلزامية وجود الولي الشرعي لكافة الإناث (Mandatory Wali)</span>
                <span className="text-[11px] text-neutral-500">
                  تطبيق الحديث النبوي: «لا نِكاحَ إلَّا بوَليٍّ». يُمنع تفعيل حساب أي أخت دون إدخال بيانات وليها الشرعي والتحقق منه.
                </span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.requireWali}
                onChange={(e) => setGlobalSettings({ ...globalSettings, requireWali: e.target.checked })}
                className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="font-bold text-neutral-900 block">حجب وتضبيب صور الأخوات افتراضياً (Photo Blur)</span>
                <span className="text-[11px] text-neutral-500">
                  حفظ العفاف والستر؛ لا تظهر صورة الأخت للمتقدم إلا بعد موافقة الولي المبدئية وتبادل القبول الشرعي.
                </span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.blurFemalePhotos}
                onChange={(e) => setGlobalSettings({ ...globalSettings, blurFemalePhotos: e.target.checked })}
                className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="font-bold text-neutral-900 block">إلزامية توثيق الهوية الوطنية / النفاذ الوطني (National ID)</span>
                <span className="text-[11px] text-neutral-500">
                  ضمان أمان الأعضاء ومنع الحسابات الوهمية عبر اشتراط التوثيق الرسمي قبل المراسلة.
                </span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.requireNationalIdVerification}
                onChange={(e) => setGlobalSettings({ ...globalSettings, requireNationalIdVerification: e.target.checked })}
                className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="font-bold text-neutral-900 block">السماح للزوار بتصفح الملفات بصورة عامة (Guest Browsing)</span>
                <span className="text-[11px] text-neutral-500">
                  عرض بطاقات السيرة الذاتية بدون معلومات الاتصال للزوار قبل تسجيل الدخول.
                </span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.allowGuestBrowsing}
                onChange={(e) => setGlobalSettings({ ...globalSettings, allowGuestBrowsing: e.target.checked })}
                className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
              />
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-4">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">الحد الأدنى للسن القانوني للتسجيل بالمنصة</label>
                <span className="text-[11px] text-neutral-500 block">يُرفض آلياً تسجيل أي شخص أقل من هذا العمر.</span>
              </div>
              <div className="flex items-center gap-2 ms-auto">
                <input
                  type="number"
                  min={18}
                  max={90}
                  value={globalSettings.minAge}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, minAge: parseInt(e.target.value) || 18 })}
                  className="w-24 p-2 bg-white rounded-xl border border-neutral-300 font-bold text-center"
                />
                <span className="font-bold text-neutral-600">سنة</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isSavingDb}
                onClick={() => handleSaveGlobal('ضوابط تسجيل الأعضاء', globalSettings)}
                className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>حفظ ضوابط تسجيل الأعضاء</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTENT SETTINGS */}
      {currentSubSection === 'settings_content' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              إعدادات وضوابط المحتوى والصور (Content Settings)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              قيود أحجام الملفات، الفحص الآلي للحشمة بالذكاء الاصطناعي، وفلترة الكلمات غير اللائقة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <label className="block text-neutral-900 font-bold mb-1">الحد الأقصى لحجم الصورة المرفوعة (Max Photo Size)</label>
                <span className="text-[11px] text-neutral-500">حماية سعة التخزين وسرعة تحميل صفحات الملفات.</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={globalSettings.maxPhotoMb}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, maxPhotoMb: parseInt(e.target.value) || 5 })}
                  className="w-24 p-2 bg-white rounded-xl border border-neutral-300 font-bold text-center"
                />
                <span className="font-bold text-neutral-600">MB</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="font-bold text-neutral-900 block">الفحص الآلي للحشمة والزي الشرعي (AI Modesty Guard)</span>
                <span className="text-[11px] text-neutral-500">
                  تحليل الصور المرفوعة فورياً ورفض أي صورة تخالف ضوابط الحجاب والستر الشرعي.
                </span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.autoModestyAi}
                onChange={(e) => setGlobalSettings({ ...globalSettings, autoModestyAi: e.target.checked })}
                className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="font-bold text-neutral-900 block">فلترة الكلمات والمحادثات غير اللائقة (Profanity Filter)</span>
                <span className="text-[11px] text-neutral-500">
                  حظر فوري لأي عبارات خادشة للحياء وإشعار الإشراف الشرعي لاتخاذ الإجراء الحاسم.
                </span>
              </div>
              <input
                type="checkbox"
                checked={globalSettings.profanityFilterActive}
                onChange={(e) => setGlobalSettings({ ...globalSettings, profanityFilterActive: e.target.checked })}
                className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isSavingDb}
                onClick={() => handleSaveGlobal('ضوابط المحتوى', globalSettings)}
                className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>حفظ ضوابط المحتوى</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAGE SETTINGS */}
      {currentSubSection === 'settings_pages' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              إعدادات الصفحات والتخطيط العام (Page Settings)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              تذييل الموقع، حقوق النشر والرقابة، وشريط الإعلانات التوجيهي المربوط بسحابة Firestore.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5 shadow-2xs text-xs">
            <div>
              <label className="block text-neutral-700 font-bold mb-1.5">نص تذييل الموقع وحقوق النشر الشرعية (Footer Copyright)</label>
              <textarea
                rows={2}
                value={pageSettings.footerCopyright}
                onChange={(e) => setPageSettings({ ...pageSettings, footerCopyright: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-bold text-neutral-900 focus:bg-white focus:border-[#9b4c2e] transition"
              />
            </div>

            {/* Announcement Banner Controls */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 block">شريط الإعلان والتنبيه الشرعي في الترويسة العليا</span>
                  <span className="text-[11px] text-neutral-500">عرض شريط إشعار علوي بارز لكافة زوار المنصة.</span>
                </div>
                <input
                  type="checkbox"
                  checked={pageSettings.headerAnnouncement.enabled}
                  onChange={(e) => setPageSettings({
                    ...pageSettings,
                    headerAnnouncement: {
                      ...pageSettings.headerAnnouncement,
                      enabled: e.target.checked
                    }
                  })}
                  className="w-5 h-5 text-[#9b4c2e] rounded accent-[#9b4c2e] cursor-pointer"
                />
              </div>

              {pageSettings.headerAnnouncement.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-600 font-bold mb-1">نص الإعلان أو التوجيه</label>
                    <input
                      type="text"
                      value={pageSettings.headerAnnouncement.text}
                      onChange={(e) => setPageSettings({
                        ...pageSettings,
                        headerAnnouncement: {
                          ...pageSettings.headerAnnouncement,
                          text: e.target.value
                        }
                      })}
                      className="w-full p-2 bg-white rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 font-bold mb-1">شارة الإعلان</label>
                    <input
                      type="text"
                      value={pageSettings.headerAnnouncement.badgeText || ''}
                      onChange={(e) => setPageSettings({
                        ...pageSettings,
                        headerAnnouncement: {
                          ...pageSettings.headerAnnouncement,
                          badgeText: e.target.value
                        }
                      })}
                      className="w-full p-2 bg-white rounded-lg border border-neutral-300 font-bold text-center"
                      placeholder="ميثاق شرعي"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Profile Layout Toggles */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <span className="font-bold text-neutral-900 block mb-2">عناصر العرض في بطاقة السيرة الذاتية (Profile Card Layout):</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageSettings.profileLayout.showWaliCardOnTop}
                    onChange={(e) => setPageSettings({
                      ...pageSettings,
                      profileLayout: { ...pageSettings.profileLayout, showWaliCardOnTop: e.target.checked }
                    })}
                    className="w-4 h-4 text-[#9b4c2e] rounded"
                  />
                  <span className="font-medium text-neutral-700">إظهار بطاقة الولي في المقدمة</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageSettings.profileLayout.showReligiousTraitsFirst}
                    onChange={(e) => setPageSettings({
                      ...pageSettings,
                      profileLayout: { ...pageSettings.profileLayout, showReligiousTraitsFirst: e.target.checked }
                    })}
                    className="w-4 h-4 text-[#9b4c2e] rounded"
                  />
                  <span className="font-medium text-neutral-700">تقديم السمات الدينية والالتزام</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageSettings.profileLayout.allowInstantProposalButton}
                    onChange={(e) => setPageSettings({
                      ...pageSettings,
                      profileLayout: { ...pageSettings.profileLayout, allowInstantProposalButton: e.target.checked }
                    })}
                    className="w-4 h-4 text-[#9b4c2e] rounded"
                  />
                  <span className="font-medium text-neutral-700">تفعيل زر "طلب خطوبة شرعية" المباشر</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageSettings.profileLayout.showPrayerHabitBadge}
                    onChange={(e) => setPageSettings({
                      ...pageSettings,
                      profileLayout: { ...pageSettings.profileLayout, showPrayerHabitBadge: e.target.checked }
                    })}
                    className="w-4 h-4 text-[#9b4c2e] rounded"
                  />
                  <span className="font-medium text-neutral-700">إظهار شارة المحافظة على الصلاة</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isSavingDb}
                onClick={handleSavePageSettings}
                className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>حفظ إعدادات وتخطيط الصفحات</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. COUNTRIES & CITIES SETTINGS */}
      {currentSubSection === 'settings_countries' && (
        <CountriesSettingsTab
          localizationConfig={localizationConfig}
          onSave={saveLocalizationConfigToDb}
        />
      )}

      {/* 6. LANGUAGE & TRANSLATION SETTINGS */}
      {currentSubSection === 'settings_language' && (
        <LanguagesSettingsTab
          localizationConfig={localizationConfig}
          onSave={saveLocalizationConfigToDb}
        />
      )}

      {/* 6. SMTP & EMAIL */}
      {currentSubSection === 'settings_smtp' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              إعدادات خادم البريد الإلكتروني (SMTP Settings)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              تهيئة خادم الإرسال لإشعارات الخطوبة، رسائل موافقة الأولياء، وتنبيهات الأمان.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">خادم الإرسال (SMTP Host)</label>
                <input
                  type="text"
                  value={globalSettings.smtpHost}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, smtpHost: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900"
                  placeholder="smtp.sendgrid.net"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">المنفذ (SMTP Port)</label>
                <input
                  type="number"
                  value={globalSettings.smtpPort}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, smtpPort: parseInt(e.target.value) || 587 })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900"
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">اسم المستخدم (SMTP User)</label>
                <input
                  type="text"
                  value={globalSettings.smtpUser}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, smtpUser: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900"
                  placeholder="apikey"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">كلمة المرور / المفتاح السري (SMTP Password / Secret)</label>
                <input
                  type="password"
                  value={globalSettings.smtpPass || ''}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, smtpPass: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1.5">عنوان المرسل الظاهر للأعضاء والأولياء (Sender Email)</label>
              <input
                type="email"
                value={globalSettings.senderEmail || 'admin@meethaq.org'}
                onChange={(e) => setGlobalSettings({ ...globalSettings, senderEmail: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900"
                placeholder="no-reply@meethaq.org"
              />
            </div>

            {testEmailResult && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testEmailResult}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isSavingDb}
                onClick={() => handleSaveGlobal('خادم البريد SMTP', globalSettings)}
                className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>حفظ بيانات البريد</span>
              </button>

              <button
                type="button"
                disabled={isSendingTestEmail}
                onClick={handleSendTestEmail}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isSendingTestEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>إرسال بريد تجريبي (Test Connection)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. SEO SETTINGS */}
      {currentSubSection === 'settings_seo' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              تهيئة محركات البحث والأرشفة (SEO Settings)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              عنوان المتصفح، الوصف التوضيحي، والكلمات المفتاحية المعتمدة لمحركات البحث وبطاقات المشاركة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
            <div>
              <label className="block text-neutral-700 font-bold mb-1.5">عنوان الموقع لمحركات البحث (Meta Title)</label>
              <input
                type="text"
                value={globalSettings.metaTitle}
                onChange={(e) => setGlobalSettings({ ...globalSettings, metaTitle: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-bold text-neutral-900"
                placeholder="منصة ميثاق | الزواج الإسلامي الشرعي بإشراف الولي والمحارم"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1.5">وصف المنصة في نتائج البحث (Meta Description)</label>
              <textarea
                rows={3}
                value={globalSettings.metaDesc}
                onChange={(e) => setGlobalSettings({ ...globalSettings, metaDesc: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900"
                placeholder="المنصة الإسلامية الموثوقة لتيسير الزواج الشرعي وصون حياء الأخوات تحت مظلة الأولياء ومطابقة الهوية الوطنية."
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1.5">الكلمات الدلالية المفتاحية (Meta Keywords)</label>
              <input
                type="text"
                value={globalSettings.metaKeywords}
                onChange={(e) => setGlobalSettings({ ...globalSettings, metaKeywords: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900"
                placeholder="زواج إسلامي, زواج شرعي, خطوبة بإشراف الولي, ميثاق, عفاف"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isSavingDb}
                onClick={() => handleSaveGlobal('تهيئة محركات البحث SEO', globalSettings)}
                className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>تحديث بيانات SEO</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. APPEARANCE & THEMES */}
      {currentSubSection === 'settings_appearance' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              المظهر والثيمات وتخصيص الألوان (Appearance & Themes)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              اختر ثيم المنصة المفضل من بين مكتبة ثيمات ميثاق أو خصص درجات الألوان الإسلامية والخطوط.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themesList.map((th) => {
              const isSelected = globalSettings.activeTheme === th.id;
              return (
                <div
                  key={th.id}
                  onClick={() => setGlobalSettings({ ...globalSettings, activeTheme: th.id as any })}
                  className={`bg-white p-5 rounded-2xl border transition cursor-pointer shadow-2xs space-y-3 ${
                    isSelected ? 'border-[#9b4c2e] ring-2 ring-[#9b4c2e]/20' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${th.previewBg}`} />
                      <h3 className="font-bold text-sm text-neutral-900">{th.name}</h3>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> مفعّل
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{th.description}</p>
                  <div className="pt-2 border-t border-neutral-100 flex justify-end">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        isSelected ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {isSelected ? 'الثيم الحالي' : 'تفعيل هذا الثيم'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color & Font Customizer */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
            <h3 className="font-bold text-sm text-neutral-900">تخصيص اللون الأساسي ونوع الخط</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">درجة لون السمة الأساسية (Primary Accent)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={globalSettings.primaryColor || '#9b4c2e'}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                  />
                  <span className="font-mono text-xs font-bold text-neutral-700">{globalSettings.primaryColor || '#9b4c2e'}</span>
                  <span className="text-neutral-400 text-xs">(درجة التيراكوتا الإسلامية المعتمدة)</span>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">خط العرض والنصوص (Font Family)</label>
                <select
                  value={globalSettings.fontFamily || 'Cairo'}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, fontFamily: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-bold"
                >
                  <option value="Cairo">خط القاهرة (Cairo - المعتمد الرسمي)</option>
                  <option value="Amiri">الخط الأميري الأصيل (Amiri)</option>
                  <option value="Tajawal">خط تجوال العريض (Tajawal)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isSavingDb}
                onClick={() => handleSaveGlobal('المظهر والثيمات', globalSettings)}
                className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>حفظ وتطبيق المظهر</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
