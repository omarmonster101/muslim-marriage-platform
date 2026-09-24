import React, { useState, useMemo } from 'react';
import { UserSettings, PhotoPermissionRequest } from '../../types';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon,
  Check, 
  AlertTriangle,
  Info,
  Phone,
  MessageSquare,
  Video,
  Clock,
  UserCheck,
  Heart,
  Ban,
  Building,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  X,
  RotateCcw
} from 'lucide-react';

interface PrivacySettingsSectionProps {
  settings: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
  avatarUrl?: string;
  isFemale?: boolean;
  candidateProfileId?: string;
  photoRequests?: PhotoPermissionRequest[];
  onUpdatePhotoRequestStatus?: (requestId: string, newStatus: 'approved' | 'rejected') => void;
}

export const PrivacySettingsSection: React.FC<PrivacySettingsSectionProps> = ({
  settings,
  onChange,
  avatarUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  isFemale = true,
  candidateProfileId,
  photoRequests = [],
  onUpdatePhotoRequestStatus
}) => {
  const privacy = settings.privacy || {
    blurPhotosByDefault: settings.blurPhotosByDefault ?? true,
    photoDisplayMode: 'blurred',
    requireWaliApprovalForPhotos: true,
    allowTemporaryVisionReveal: true,
    hideFromUnverifiedUsers: true,
    watermarkPhotos: true,
    preventScreenshotsNotice: true,
    profileVisibility: 'verified_only',
    minMatchScoreToView: 75,
    blockSameTribeOrWorkplace: false,
    blockedFamilyOrWorkKeywords: '',
    allowDirectWaliContact: true,
    waliContactRequirement: 'after_wali_approval',
    waliContactChannels: {
      allowPhoneCalls: true,
      allowWhatsApp: true,
      allowInAppVoiceMeeting: true
    },
    waliPreferredContactTimes: 'after_asr_to_isha',
    showOnlineStatus: true,
    showLastSeen: true,
    allowMessages: 'accepted_requests_only'
  };

  const [previewUnblurred, setPreviewUnblurred] = useState(false);
  const [activeTabSubSection, setActiveTabSubSection] = useState<'profile_visibility' | 'photo_modesty' | 'photo_requests' | 'wali_contact' | 'boundaries'>('photo_modesty');

  // Filter photo requests for this candidate if candidateProfileId provided
  const relevantPhotoRequests = candidateProfileId 
    ? photoRequests.filter(r => r.targetProfileId === candidateProfileId)
    : photoRequests;
  const pendingRequestsCount = relevantPhotoRequests.filter(r => r.status === 'pending').length;

  const updatePrivacy = (partial: Partial<NonNullable<UserSettings['privacy']>>) => {
    const updatedPrivacy = { ...privacy, ...partial };
    // Synchronize blurPhotosByDefault with photoDisplayMode if changed
    if (partial.photoDisplayMode) {
      updatedPrivacy.blurPhotosByDefault = partial.photoDisplayMode !== 'full_visible';
    }
    onChange({
      privacy: updatedPrivacy,
      blurPhotosByDefault: updatedPrivacy.blurPhotosByDefault
    });
  };

  const updateWaliChannels = (partial: Partial<NonNullable<NonNullable<UserSettings['privacy']>['waliContactChannels']>>) => {
    const currentChannels = privacy.waliContactChannels || {
      allowPhoneCalls: true,
      allowWhatsApp: true,
      allowInAppVoiceMeeting: true
    };
    updatePrivacy({
      waliContactChannels: {
        ...currentChannels,
        ...partial
      }
    });
  };

  // Dynamic Islamic Privacy & Modesty Index (حساب مؤشر الستر والخصوصية الشرعية)
  const privacyScore = useMemo(() => {
    let score = 50;
    if (privacy.photoDisplayMode === 'hidden_symbolic') score += 20;
    else if (privacy.photoDisplayMode === 'blurred' || privacy.blurPhotosByDefault) score += 15;
    if (privacy.requireWaliApprovalForPhotos) score += 10;
    if (privacy.watermarkPhotos) score += 5;
    if (privacy.preventScreenshotsNotice) score += 5;
    if (privacy.profileVisibility === 'walis_only' || privacy.profileVisibility === 'hidden') score += 15;
    else if (privacy.profileVisibility === 'verified_only' || privacy.profileVisibility === 'high_match_only') score += 10;
    if (privacy.waliContactRequirement === 'after_wali_approval') score += 10;
    else if (privacy.waliContactRequirement === 'platform_chat_only') score += 15;
    if (privacy.blockSameTribeOrWorkplace) score += 5;
    return Math.min(score, 100);
  }, [privacy]);

  const displayMode = privacy.photoDisplayMode || (privacy.blurPhotosByDefault ? 'blurred' : 'full_visible');

  return (
    <div className="space-y-6" id="privacy-settings-section">
      
      {/* 1. Header Card with Privacy & Modesty Score */}
      <div className="bg-gradient-to-r from-amber-50/80 via-stone-50 to-white p-5 sm:p-6 rounded-2xl border border-amber-200/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 text-start">
            <div className="w-11 h-11 rounded-2xl bg-[#9b4c2e]/10 text-[#9b4c2e] flex items-center justify-center shrink-0 border border-[#9b4c2e]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">
                  مركز التحكم الدقيق بالخصوصية والستر الشرعي
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  ضوابط الحياء والصون
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                تمنحك منصة ميثاق تحكماً استثنائياً في حجب الصور، تحديد من يرى ملفك، وضبط صلاحيات وأوقات تواصل الخاطبين مع مجلس ولي الأمر.
              </p>
            </div>
          </div>

          {/* Privacy Score Metric */}
          <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200 shadow-2xs text-start sm:text-end shrink-0 min-w-[170px]">
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span className="text-xs font-semibold text-neutral-600">مؤشر الحصانة والستر:</span>
              <span className="text-base font-extrabold text-[#9b4c2e] font-mono">{privacyScore}%</span>
            </div>
            <div className="w-full bg-neutral-200/80 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-l from-emerald-500 to-[#9b4c2e] h-full rounded-full transition-all duration-500"
                style={{ width: `${privacyScore}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-emerald-800 font-medium block mt-1">
              {privacyScore >= 90 ? 'درجة صون عالية جداً ومحمية' : privacyScore >= 75 ? 'درجة خصوصية متوازنة ومعتمدة' : 'مستوى خصوصية أساسي'}
            </span>
          </div>
        </div>

        {/* Sub-section Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-amber-200/40">
          {[
            { id: 'photo_modesty', label: 'إخفاء وطمس الصور', icon: <ImageIcon className="w-3.5 h-3.5" /> },
            ...(isFemale ? [{ 
              id: 'photo_requests', 
              label: 'طلبات الإذن برؤية صورتي', 
              icon: <Eye className="w-3.5 h-3.5" />,
              badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
            }] : []),
            { id: 'profile_visibility', label: 'من يرى ملفك الشخصي', icon: <Eye className="w-3.5 h-3.5" /> },
            ...(isFemale ? [{ id: 'wali_contact', label: 'صلاحيات التواصل مع الولي', icon: <Phone className="w-3.5 h-3.5" /> }] : []),
            { id: 'boundaries', label: 'الحرج العائلي والتواجد', icon: <Lock className="w-3.5 h-3.5" /> }
          ].map(pill => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveTabSubSection(pill.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTabSubSection === pill.id
                  ? 'bg-[#9b4c2e] text-white shadow-2xs'
                  : 'bg-white/70 text-neutral-700 hover:bg-white border border-neutral-200'
              }`}
            >
              {pill.icon}
              <span>{pill.label}</span>
              {pill.badge !== undefined && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pill.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB A: PHOTO HIDING & MODESTY CONTROLS (إخفاء وطمس الصور) */}
      {activeTabSubSection === 'photo_modesty' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Section 1: Choose Display Mode */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
            <div className="space-y-1 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#9b4c2e]" />
                <h4 className="text-sm font-bold text-neutral-900">
                  نمط إخفاء وعرض الصورة الشخصية (Photo Visibility Mode)
                </h4>
              </div>
              <p className="text-xs text-neutral-500">
                حدد كيف ترغب في عرض صورتك الشخصية أمام الخاطبين والباحثين في المنصة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'blurred',
                  title: 'طمس وتمويه بحجاب الستر',
                  desc: 'تظهر الصورة مموهة بدرجة ضبابية عالية، ولا تُكشف إلا بعد إذن الولي وموافقة الرؤية.',
                  badge: 'موصى به شرعاً',
                  badgeColor: 'bg-emerald-100 text-emerald-800'
                },
                {
                  id: 'hidden_symbolic',
                  title: 'إخفاء كامل (رمز العفاف)',
                  desc: 'حجب الصورة كلياً واستبدالها بشعار ميثاق المحتشم، دون إمكانية رؤية الصورة الحقيقية نهائياً.',
                  badge: 'أعلى درجات الحياء',
                  badgeColor: 'bg-amber-100 text-amber-900'
                },
                {
                  id: 'full_visible',
                  title: 'إظهار الصورة للموثقين',
                  desc: 'تظهر الصورة بوضوح للأعضاء الذين وثقوا هوياتهم الوطنية وصكوك ولايتهم فقط.',
                  badge: 'مباشر',
                  badgeColor: 'bg-neutral-200 text-neutral-700'
                }
              ].map(mode => {
                const isSelected = displayMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => updatePrivacy({ photoDisplayMode: mode.id as any })}
                    className={`p-4 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#9b4c2e] bg-amber-50/50 ring-1 ring-[#9b4c2e]/40'
                        : 'border-neutral-200 bg-neutral-50/40 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900">{mode.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${mode.badgeColor}`}>
                        {mode.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      {mode.desc}
                    </p>
                    {isSelected && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#9b4c2e]">
                        <Check className="w-3.5 h-3.5" />
                        <span>النمط المفعّل حالياً</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Live Interactive Photo Simulator */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
              <div className="text-start space-y-0.5">
                <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  المعاينة الحية التفاعلية لمظهر صورتك
                </span>
                <p className="text-xs text-neutral-500">
                  عاين بالعين المجردة كيف تظهر صورتك للغرباء وفق النمط المختار
                </p>
              </div>

              {displayMode !== 'full_visible' && (
                <button
                  type="button"
                  onClick={() => setPreviewUnblurred(!previewUnblurred)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    previewUnblurred
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  {previewUnblurred ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>إعادة تفعيل الحجب والستر</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة كشف الصورة بعد اعتماد الولي</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              {/* Photo Preview Container */}
              <div className="relative aspect-square max-h-64 mx-auto w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-inner flex items-center justify-center">
                {displayMode === 'hidden_symbolic' && !previewUnblurred ? (
                  <div className="w-full h-full bg-gradient-to-b from-stone-900 via-neutral-900 to-black text-amber-200/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center shadow-lg">
                      <Lock className="w-8 h-8 text-amber-300" />
                    </div>
                    <span className="text-sm font-bold tracking-wide text-white">
                      محفوظة برمز العفاف والستر
                    </span>
                    <span className="text-xs text-neutral-400 max-w-[200px] leading-relaxed">
                      الصورة الحقيقية محجوبة كلياً ولا تظهر لأي مستخدم وفق رغبة العضو
                    </span>
                  </div>
                ) : (
                  <>
                    <img
                      src={avatarUrl}
                      alt="معاينة الصورة"
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        displayMode === 'blurred' && !previewUnblurred
                          ? 'blur-2xl scale-110 filter brightness-90'
                          : 'blur-0 scale-100'
                      }`}
                    />
                    {displayMode === 'blurred' && !previewUnblurred && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-4 text-center space-y-2 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <Lock className="w-5 h-5 text-amber-300" />
                        </div>
                        <span className="text-xs font-bold tracking-wide">
                          الصورة مطموسة بحجاب الستر
                        </span>
                        <span className="text-[11px] opacity-80 max-w-[200px]">
                          تُفتح للصاحب الجاد فقط بعد قبول الولي لجلسة الرؤية
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Encrypted Watermark */}
                {privacy.watermarkPhotos && (
                  <div className="absolute bottom-2 start-2 bg-black/60 text-white/90 text-[10px] px-2.5 py-1 rounded-md font-mono tracking-wider backdrop-blur-xs pointer-events-none border border-white/10">
                    ميثاق • سري ومحمي بموجب المادة الشرعية
                  </div>
                )}
              </div>

              {/* Modesty Toggles */}
              <div className="space-y-3 text-start">
                <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.requireWaliApprovalForPhotos}
                    onChange={(e) => updatePrivacy({ requireWaliApprovalForPhotos: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-neutral-900 block">
                      اشتراط موافقة الولي الصريحة قبل كشف الصورة لأي خاطب
                    </span>
                    <span className="text-neutral-500 leading-relaxed block">
                      لن يتمكن أي خاطب من رؤية صورتك إلا بعد إشعار الولي وموافقته المعتمدة.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.allowTemporaryVisionReveal ?? true}
                    onChange={(e) => updatePrivacy({ allowTemporaryVisionReveal: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-neutral-900 block">
                      كشف مؤقت لمرة واحدة فقط أثناء جلسة الرؤية الشرعية
                    </span>
                    <span className="text-neutral-500 leading-relaxed block">
                      تُعرض الصورة واضحة فقط خلال وقت جلسة الرؤية المجدولة، وتُعاد للتمويه فور انتهائها.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.watermarkPhotos}
                    onChange={(e) => updatePrivacy({ watermarkPhotos: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-neutral-900 block">
                      تضمين علامة مائية رقمية أمنية على الصور
                    </span>
                    <span className="text-neutral-500 leading-relaxed block">
                      طباعة وسم رقمي مشفر يمنع الاستغلال غير الأخلاقي للصور.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.preventScreenshotsNotice}
                    onChange={(e) => updatePrivacy({ preventScreenshotsNotice: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-neutral-900 block">
                      تفعيل إشعار الأمان المشدد لمنع لقطات الشاشة
                    </span>
                    <span className="text-neutral-500 leading-relaxed block">
                      عرض تحذير شرعي وقانوني صريح يمنع تصوير الشاشة في حال فتح الملف.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 TAB: INCOMING PHOTO REVEAL REQUESTS (طلبات الإذن برؤية صورتي) */}
      {activeTabSubSection === 'photo_requests' && (
        <div className="space-y-6 animate-in fade-in duration-200 text-start" id="tab-incoming-photo-requests">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#9b4c2e]" />
                  <h4 className="text-sm font-bold text-neutral-900">
                    طلبات الاستئذان الشرعي للاطلاع على صورتكِ (Photo Access Requests)
                  </h4>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  قائمة الخاطبين الذين تقدموا بطلب الإذن الشرعي للرؤية. صورتكِ تظل مطموسة ومحجوبة ولا تُكشف إلا لمن تمنحينه الإذن الصريح.
                </p>
              </div>

              <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-[#9b4c2e] border border-amber-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span>الطلبات المعلقة:</span>
                <span className="font-extrabold">{pendingRequestsCount}</span>
              </div>
            </div>

            {/* Requests List */}
            {relevantPhotoRequests.length > 0 ? (
              <div className="space-y-3">
                {relevantPhotoRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      req.status === 'approved' 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : req.status === 'rejected'
                        ? 'bg-neutral-50 border-neutral-200 opacity-75'
                        : 'bg-white border-amber-200/80 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fdf6f0] text-[#9b4c2e] border border-[#f4dfd4] flex items-center justify-center font-bold text-sm shrink-0">
                          {req.suitorAvatar ? (
                            <img src={req.suitorAvatar} alt={req.suitorName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            req.suitorName.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-900">{req.suitorName}</span>
                            {req.suitorAge && (
                              <span className="text-xs text-neutral-500">({req.suitorAge} سنة)</span>
                            )}
                            {req.suitorCity && (
                              <span className="text-xs text-neutral-500">• {req.suitorCity}</span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-700 mt-1 leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                            "{req.note}"
                          </p>
                          <span className="text-[10px] text-neutral-400 mt-1 block font-mono">
                            تاريخ الطلب: {new Date(req.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'approved')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>سماح بالرؤية</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'rejected')}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 border border-rose-200 transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>اعتذار ورفض</span>
                            </button>
                          </>
                        ) : req.status === 'approved' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>مصرح له بالرؤية</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'rejected')}
                              className="px-3 py-1 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 text-neutral-600 text-xs font-bold transition cursor-pointer border border-neutral-200"
                              title="سحب الإذن وإعادة حجب الصورة عن هذا الخاطب"
                            >
                              سحب الإذن
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-700 flex items-center gap-1">
                              <Ban className="w-3.5 h-3.5" />
                              <span>تم الرفض</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'approved')}
                              className="px-3 py-1 rounded-xl bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-600 text-xs font-bold transition cursor-pointer border border-neutral-200"
                            >
                              إعادة السماح
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <EyeOff className="w-8 h-8 text-neutral-400 mx-auto" />
                <h5 className="font-bold text-xs text-neutral-800">لا توجد طلبات جديدة حالياً للاطلاع على صورتكِ</h5>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                  صورتكِ محفوظة ومطموسة بأمان وحشمة تامة. سيظهر هنا أي طلب استئذان يرسله الخاطبون الجادون مع إمكانية اتخاذ القرار بكل حرية وكرامة.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB B: WHO CAN SEE YOUR MATRIMONIAL PROFILE (من يمكنه رؤية الملف) */}
      {activeTabSubSection === 'profile_visibility' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
            <div className="space-y-1 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#9b4c2e]" />
                <h4 className="text-sm font-bold text-neutral-900">
                  تحديد من يمكنه العثور على ملفك واستعراض سيرتك الذاتية
                </h4>
              </div>
              <p className="text-xs text-neutral-500">
                اختر الفئة المؤهلة شرعياً للاطلاع على بيانات سيرتك الذاتية في محرك البحث:
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'verified_only',
                  title: 'الباحثون الموثقون بالهوية وصك الولاية فقط (موصى به)',
                  desc: 'لا يظهر ملفك إلا لمن اجتاز التحقق من هويته الوطنية واعتمد حسابه رسمياً من إدارة ميثاق.',
                  badge: 'أمان وتوثيق عالي',
                  badgeColor: 'bg-emerald-100 text-emerald-800'
                },
                {
                  id: 'high_match_only',
                  title: 'المتوافقون بنسبة مطابقة شرعية وفكرية 75%+ فقط',
                  desc: 'يقتصر ظهور ملفك على الباحثين الذين يطابقون شروطك الدينية، العمرية، والجغرافية بنسبة عالية.',
                  badge: 'ترشيح ذكي دقيق',
                  badgeColor: 'bg-blue-100 text-blue-800'
                },
                {
                  id: 'walis_only',
                  title: 'أولياء الأمور والمحارم المعتمدون فقط',
                  desc: 'الخاطب نفسه لا يمكنه رؤية ملفك مباشرة؛ يجب أن يتصفحه ولي أمره أو محرمه أولاً وتقديم الطلب نيابة عنه.',
                  badge: 'طريق الأبواب والبيوت',
                  badgeColor: 'bg-amber-100 text-amber-900'
                },
                {
                  id: 'public',
                  title: 'جميع الباحثين المسجلين في ميثاق',
                  desc: 'يظهر ملفك في نتائج البحث العامة لكافة الأعضاء المسجلين والجادين في البحث.',
                  badge: 'ظهور واسع',
                  badgeColor: 'bg-neutral-200 text-neutral-700'
                },
                {
                  id: 'hidden',
                  title: 'وضع الاستخارة المغلق (مخفي مؤقتاً عن البحث)',
                  desc: 'إخفاء تام للسيرة الذاتية أثناء فترات دراسة طلب خطوبة حالي أو الاستخارة دون حذف الحساب.',
                  badge: 'إخفاء مؤقت',
                  badgeColor: 'bg-rose-100 text-rose-800'
                }
              ].map(opt => {
                const isSelected = privacy.profileVisibility === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start justify-between p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#9b4c2e] bg-amber-50/50 ring-1 ring-[#9b4c2e]/40'
                        : 'border-neutral-200 bg-neutral-50/40 hover:bg-neutral-100/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => updatePrivacy({ profileVisibility: opt.id as any })}
                        className="w-4 h-4 mt-1 text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-900">{opt.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Minimum Compatibility Threshold Slider if high_match_only is selected */}
            {privacy.profileVisibility === 'high_match_only' && (
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2 mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-950">
                  <span>الحد الأدنى لنسبة التوافق لإتاحة استعراض الملف:</span>
                  <span className="font-mono font-bold text-blue-700">{privacy.minMatchScoreToView || 75}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={privacy.minMatchScoreToView || 75}
                  onChange={(e) => updatePrivacy({ minMatchScoreToView: Number(e.target.value) })}
                  className="w-full accent-[#9b4c2e] cursor-pointer"
                />
                <span className="text-[11px] text-blue-700 block">
                  لن يظهر ملفك إلا لمن يتوافق معك في الالتزام بالصلاة، الرؤية للأبناء، ونمط الحياة بنسبة {privacy.minMatchScoreToView || 75}% فأكثر.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB C: WALI DIRECT CONTACT PERMISSIONS (صلاحيات التواصل مع الولي) */}
      {activeTabSubSection === 'wali_contact' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Requirement Setting */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
            <div className="space-y-1 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#9b4c2e]" />
                <h4 className="text-sm font-bold text-neutral-900">
                  شروط كشف بيانات اتصال الولي الشرعي للخاطبين
                </h4>
              </div>
              <p className="text-xs text-neutral-500">
                حدد متى وبأي آلية يحق للخاطب الوصول إلى رقم هاتف مجلس الولي أو رابط WhatsApp الخاص به:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'after_wali_approval',
                  title: 'بعد قبول الولي المبدئي فقط (موصى به)',
                  desc: 'لا يُكشف رقم الولي إلا بعد أن يطّلع الولي على سيرة الخاطب ويضغط زر (موافقة مبدئية).',
                  badge: 'حماية خصوصية الولي'
                },
                {
                  id: 'platform_chat_only',
                  title: 'حصر التواصل بداخل المنصة فقط',
                  desc: 'يمنع كشف رقم هاتف الولي؛ ويتم كامل التواصل عبر غرفة المراسلة المراقبة في ميثاق.',
                  badge: 'أعلى درجات الرقابة'
                },
                {
                  id: 'immediate',
                  title: 'إتاحة الاتصال المباشر فوراً',
                  desc: 'يظهر رقم مجلس الولي لجميع الخاطبين الموثقين لتمكينهم من الاتصال به هاتفياً مباشرة.',
                  badge: 'تواصل سريع'
                }
              ].map(opt => {
                const isSelected = privacy.waliContactRequirement === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updatePrivacy({ waliContactRequirement: opt.id as any })}
                    className={`p-4 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'border-[#9b4c2e] bg-amber-50/50 ring-1 ring-[#9b4c2e]/40'
                        : 'border-neutral-200 bg-neutral-50/40 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-900">{opt.title}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      {opt.desc}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block w-fit ${
                      isSelected ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {opt.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allowed Contact Channels */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
            <div className="space-y-1 pb-3 border-b border-neutral-100">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#9b4c2e]" />
                قنوات الاتصال المسموح بها مع مجلس الولي
              </h4>
              <p className="text-xs text-neutral-500">
                حدد الوسائل التي يسمح لولي الأمر باستقبال استفسارات الخاطبين من خلالها:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.waliContactChannels?.allowPhoneCalls ?? true}
                  onChange={(e) => updateWaliChannels({ allowPhoneCalls: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-neutral-900 block flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    المكالمات الهاتفية المباشرة
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    إتاحة الاتصال الهاتفي الصوتي برقم الولي المعتمد
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.waliContactChannels?.allowWhatsApp ?? true}
                  onChange={(e) => updateWaliChannels({ allowWhatsApp: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-neutral-900 block flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    رسائل تطبيق WhatsApp
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    إتاحة فتح محادثة WhatsApp مباشرة مع ولي الأمر
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.waliContactChannels?.allowInAppVoiceMeeting ?? true}
                  onChange={(e) => updateWaliChannels({ allowInAppVoiceMeeting: e.target.checked })}
                  className="w-4 h-4 mt-0.5 text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-neutral-900 block flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    جلسات الرؤية المرئية بالمنصة
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    طلب موعد لقاء مرئي بالمنصة بحضور المحرم
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Preferred Times for Contacting Wali */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
            <div className="space-y-1 pb-3 border-b border-neutral-100">
              <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9b4c2e]" />
                الأوقات والآداب المفضلة للاتصال بمجلس الولي
              </h4>
              <p className="text-xs text-neutral-500">
                تظهر هذه الأوقات للخاطب كإرشاد شرعي وأدبي لعدم إزعاج ولي الأمر في أوقات راحته:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'after_asr_to_isha', label: 'بين العصر والعشاء (أنسب أوقات المجالس)', desc: 'من 4:30 عصراً حتى 9:00 مساءً' },
                { id: 'weekends_only', label: 'عطلة نهاية الأسبوع فقط', desc: 'يومي الجمعة والسبت بعد العصر' },
                { id: 'anytime', label: 'في أي وقت ملائم ومناسب', desc: 'خلال ساعات النهار المعتادة' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updatePrivacy({ waliPreferredContactTimes: item.id as any })}
                  className={`p-3.5 rounded-xl border text-start transition cursor-pointer ${
                    privacy.waliPreferredContactTimes === item.id
                      ? 'border-[#9b4c2e] bg-amber-50/50 ring-1 ring-[#9b4c2e]/40 font-bold'
                      : 'border-neutral-200 bg-neutral-50/40 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-xs block text-neutral-900">{item.label}</span>
                  <span className="text-[10px] text-neutral-500 mt-1 block font-normal">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB D: SOCIAL BOUNDARIES & TRIBE/WORKPLACE BLOCKING (تفادي الحرج العائلي) */}
      {activeTabSubSection === 'boundaries' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Family & Workplace Filtering */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Ban className="w-4 h-4 text-rose-600" />
                  <h4 className="text-sm font-bold text-neutral-900">
                    خاصية تفادي الحرج العائلي والوظيفي (Social Privacy Filter)
                  </h4>
                </div>
                <p className="text-xs text-neutral-500">
                  حظر ظهور سيرتك الذاتية تلقائياً لأي باحث ينتمي لنفس عائلتك أو جهة عملك
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.blockSameTribeOrWorkplace}
                  onChange={(e) => updatePrivacy({ blockSameTribeOrWorkplace: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9b4c2e]"></div>
              </label>
            </div>

            {privacy.blockSameTribeOrWorkplace && (
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/70 space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-rose-950">
                    أسماء العوائل أو القبائل أو الشركات المستثناة (مفصولة بفاصلة):
                  </label>
                  <input
                    type="text"
                    value={privacy.blockedFamilyOrWorkKeywords || ''}
                    onChange={(e) => updatePrivacy({ blockedFamilyOrWorkKeywords: e.target.value })}
                    placeholder="مثال: الخالدي، شركة أرامكو، مستشفى التخصصي"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-neutral-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  إذا تطابق لقب الباحث أو مقر عمله المسجل مع هذه الكلمات، فسيتم إخفاء ملفك عنه تماماً في نتائج البحث صوناً للسرية التامة وتفادياً لأي حرج اجتماعي.
                </p>
              </div>
            )}
          </div>

          {/* Online Presence & Messaging boundaries */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Lock className="w-4 h-4 text-[#9b4c2e]" />
              <h4 className="text-sm font-bold text-neutral-900">
                ضوابط التواجد وحظر المراسلات غير المصرح بها
              </h4>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-neutral-900 block">
                    إظهار حالة الاتصال المباشر (Online Status)
                  </span>
                  <span className="text-neutral-500">
                    إعلام الباحثين المعتمدين بتواجدك النشط أثناء تصفحك للمنصة
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showOnlineStatus}
                  onChange={(e) => updatePrivacy({ showOnlineStatus: e.target.checked })}
                  className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-neutral-900 block">
                    إظهار تاريخ آخر ظهور (Last Seen)
                  </span>
                  <span className="text-neutral-500">
                    عرض وقت آخر مرة سجلت فيها دخولك لحسابك في ميثاق
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showLastSeen}
                  onChange={(e) => updatePrivacy({ showLastSeen: e.target.checked })}
                  className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
                />
              </label>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-emerald-950 block">
                    حظر الخلوة الإلكترونية الإلزامي
                  </span>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    لا يمكن لأي عضو إرسال رسائل حرة إليك إلا بعد قبول طلب الخطوبة رسمياً ومصادقة ولي الأمر، وجميع المحادثات تكون مسجلة وتحت إشراف مباشر للطرفين.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
