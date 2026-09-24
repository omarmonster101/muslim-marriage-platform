import React, { useState } from 'react';
import { Profile, Language, UserSession } from '../types';
import { translations } from '../data/translations';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  BookOpen, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Heart, 
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  LogIn
} from 'lucide-react';
import { fireKhitbahBlessingConfetti } from '../utils/confetti';

interface ProfileModalProps {
  profile: Profile | null;
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposal: (profile: Profile, note: string, suitorDetails?: { name?: string; phone?: string; city?: string; age?: number }) => void;
  currentSession?: UserSession;
  onRequireLogin?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  lang,
  isOpen,
  onClose,
  onSubmitProposal,
  currentSession,
  onRequireLogin
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'faith' | 'family' | 'vision' | 'compatibility'>('faith');
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(profile?.isPhotoBlurredByDefault ?? true);
  const [proposalNote, setProposalNote] = useState('');
  
  // Custom contact details if user wants to specify or if guest
  const [customName, setCustomName] = useState(currentSession && currentSession.role !== 'guest' ? currentSession.name : '');
  const [customPhone, setCustomPhone] = useState(currentSession?.phone || '');
  const [customCity, setCustomCity] = useState('الرياض');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Sync state when profile or session changes
  React.useEffect(() => {
    if (profile) {
      setIsPhotoBlurred(profile.isPhotoBlurredByDefault);
    }
    if (currentSession && currentSession.role !== 'guest') {
      setCustomName(currentSession.name);
      if (currentSession.phone) setCustomPhone(currentSession.phone);
    }
  }, [profile, currentSession]);

  if (!isOpen || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitProposal(
        profile, 
        proposalNote || "طلب خطوبة شرعي مبارك وفق كتاب الله وسنة رسوله ﷺ.",
        {
          name: customName.trim() || undefined,
          phone: customPhone.trim() || undefined,
          city: customCity.trim() || undefined
        }
      );
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      fireKhitbahBlessingConfetti();
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      
      {/* Modal Container */}
      <div 
        id="profile-detail-modal"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#ede5dd] overflow-hidden my-8 flex flex-col max-h-[90vh]"
      >
        
        {/* Header with Photo & Basic Info */}
        <div className="relative bg-gradient-to-r from-[#9b4c2e] to-[#7f391f] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Close button */}
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar with Modesty Toggle */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md">
            <img 
              src={profile.avatarUrl} 
              alt={profile.fullName}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isPhotoBlurred ? 'filter blur-lg scale-110 opacity-75' : 'filter-none scale-100'
              }`}
            />
            <button
              onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
              title={isPhotoBlurred ? t.revealPhoto : t.blurPhoto}
              className="absolute bottom-2 end-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-black transition cursor-pointer"
            >
              {isPhotoBlurred ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-start space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d9e9bb]" />
                <span>
                  {profile.gender === 'female'
                    ? (profile.wali?.isVerified ? t.waliVerified : t.waliPending)
                    : (isAr ? 'هوية وباءة موثقة' : 'Verified ID & Ba\'ah')}
                </span>
              </span>
              <span className="bg-white/15 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                {profile.religiousAttire}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {profile.fullName}
            </h2>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-white/90">
              <span className="font-semibold">{profile.age} {t.ageSuffix}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-white/80" />
                {profile.city}، {profile.country}
              </span>
              <span>•</span>
              <span>{profile.profession}</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-3 bg-[#faf8f5] border-b border-[#ede5dd] overflow-x-auto">
          <div className="inline-flex bg-neutral-200/60 p-1 rounded-full text-xs font-bold">
            <button
              id="modal-tab-faith"
              onClick={() => setActiveTab('faith')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'faith' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              🕌 {t.tabFaith}
            </button>
            <button
              id="modal-tab-family"
              onClick={() => setActiveTab('family')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'family' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              🛡️ {t.tabFamily}
            </button>
            <button
              id="modal-tab-vision"
              onClick={() => setActiveTab('vision')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'vision' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              🌱 {t.tabVision}
            </button>
            <button
              id="modal-tab-compatibility"
              onClick={() => setActiveTab('compatibility')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'compatibility' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              ✨ {t.tabCompatibility}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-black text-start">
          
          {/* TAB 1: Faith & Commitment */}
          {activeTab === 'faith' && (
            <div className="space-y-6">
              
              {/* Grid of religious indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#f9f9f9] p-4 rounded-[12px] border border-black/5">
                  <span className="text-[11px] font-bold text-[#888888] uppercase block mb-1">
                    {t.prayerLabel}
                  </span>
                  <div className="text-sm font-bold text-black flex items-center gap-1.5">
                    <span>🕌</span>
                    <span>{profile.prayerHabit === 'always_in_mosque' ? 'في المسجد دائماً' : 'في وقتها دائماً'}</span>
                  </div>
                </div>

                <div className="bg-[#f9f9f9] p-4 rounded-[12px] border border-black/5">
                  <span className="text-[11px] font-bold text-[#888888] uppercase block mb-1">
                    {t.quranLabel}
                  </span>
                  <div className="text-sm font-bold text-black flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#001666]" />
                    <span className="truncate">{profile.quranMemorization}</span>
                  </div>
                </div>

                <div className="bg-[#f9f9f9] p-4 rounded-[12px] border border-black/5">
                  <span className="text-[11px] font-bold text-[#888888] uppercase block mb-1">
                    {t.filterVeil}
                  </span>
                  <div className="text-sm font-bold text-black">
                    {profile.religiousAttire}
                  </div>
                </div>
              </div>

              {/* Bio & Religious Journey */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">
                  {t.aboutMeLabel}
                </h4>
                <p className="text-sm text-[#444444] leading-relaxed bg-[#fafafa] p-4 rounded-[12px] border border-black/5">
                  {profile.aboutMe}
                </p>
              </div>

              {/* Religious Interests */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">
                  الاهتمامات والأنشطة الإسلامية
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.islamicInterests.map((interest, idx) => (
                    <span key={idx} className="bg-black/5 text-black text-xs font-semibold px-3 py-1 rounded-[960px] border border-black/10">
                      ✓ {interest}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Family & Guardian (Wali) */}
          {activeTab === 'family' && (
            <div className="space-y-6">
              
              {/* Guardian Verification Card - ONLY for female profiles */}
              {profile.gender === 'female' ? (
                <div className="bg-sky-periwinkle p-6 rounded-[12px] border border-black/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-[#31c431]" />
                      <div>
                        <h4 className="text-base font-bold text-black">{t.waliContactCardTitle}</h4>
                        <p className="text-xs text-[#666666]">تطبيقاً لحديث النبي ﷺ: «لا نكاح إلا بولي»</p>
                      </div>
                    </div>
                    <span className="bg-[#31c431] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.waliVerified}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/90 p-4 rounded-[8px] border border-black/5 text-sm">
                    <div>
                      <span className="text-xs text-[#888888] block">{t.waliNameLabel}</span>
                      <span className="font-bold text-black">{profile.wali.name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#888888] block">{t.waliRelationLabel}</span>
                      <span className="font-bold text-black">{profile.wali.relation}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#888888] block">{t.waliPhoneLabel}</span>
                      <span className="font-bold text-black flex items-center gap-1.5 direction-ltr">
                        <Phone className="w-3.5 h-3.5 text-black" />
                        {profile.wali.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#888888] block">البريد الإلكتروني الموثق</span>
                      <span className="font-medium text-[#444444] flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-black" />
                        {profile.wali.email}
                      </span>
                    </div>
                  </div>

                  {profile.wali.notes && (
                    <div className="text-xs text-[#444444] bg-white/70 p-3 rounded-[8px] border border-black/5">
                      <span className="font-bold text-black">{t.waliNoteLabel}: </span>
                      «{profile.wali.notes}»
                    </div>
                  )}
                </div>
              ) : (
                /* Male Ba'ah & Readiness Card (No Wali for male) */
                <div className="bg-[#faf8f5] p-6 rounded-[12px] border border-[#ede5dd] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-[#9b4c2e]" />
                      <div>
                        <h4 className="text-base font-bold text-neutral-900">{isAr ? 'إقرار الباءة والاستطاعة والنفقة' : 'Financial Readiness & Independent Housing'}</h4>
                        <p className="text-xs text-neutral-500">{isAr ? 'التزام الخاطب بالإنفاق الشرعي وتوفير المسكن المناسب' : 'Commitment to Islamic financial support and independent home'}</p>
                      </div>
                    </div>
                    <span className="bg-[#9b4c2e] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {isAr ? 'باءة موثقة' : 'Verified'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-[8px] border border-black/5 text-sm">
                    <div>
                      <span className="text-xs text-[#888888] block">{isAr ? 'طبيعة السكن:' : 'Housing:'}</span>
                      <span className="font-bold text-black">{isAr ? 'سكن مستقل بالكامل مهيأ للزواج' : 'Fully independent home'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#888888] block">{isAr ? 'الجاهزية للزواج:' : 'Marriage Timeline:'}</span>
                      <span className="font-bold text-black">{isAr ? 'جاهز فور إتمام الرؤية الشرعية' : 'Immediate / Within months'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#888888] block">{isAr ? 'التواصل والزيارة:' : 'Family Visit:'}</span>
                      <span className="font-bold text-black">{isAr ? 'زيارة رسمية لمجلس ولي أمر المخطوبة' : 'Formal visit to bride’s guardian council'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#888888] block">{isAr ? 'توثيق الهوية:' : 'National ID:'}</span>
                      <span className="font-medium text-emerald-700 font-bold">{isAr ? 'موثق عبر النفاذ الوطني ✓' : 'Verified via National ID ✓'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Family Values & Background */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">
                  {t.familyValuesLabel}
                </h4>
                <p className="text-sm text-[#444444] leading-relaxed bg-[#fafafa] p-4 rounded-[12px] border border-black/5">
                  {profile.familyValues}
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: Marriage Goals & Expectations */}
          {activeTab === 'vision' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#fafafa] p-4 rounded-[12px] border border-black/5">
                  <span className="text-xs text-[#888888] block mb-1">{t.timelineLabel}</span>
                  <span className="font-bold text-sm text-black">
                    {profile.marriageTimeline === 'immediate' ? 'عاجل وخلال شهرين' : 'خلال 3 إلى 6 أشهر'}
                  </span>
                </div>
                <div className="bg-[#fafafa] p-4 rounded-[12px] border border-black/5">
                  <span className="text-xs text-[#888888] block mb-1">{t.mahrLabel}</span>
                  <span className="font-bold text-sm text-black">{profile.mahrExpectation}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">
                  {t.partnerExpectationsLabel}
                </h4>
                <p className="text-sm text-[#444444] leading-relaxed bg-[#fafafa] p-4 rounded-[12px] border border-black/5">
                  {profile.partnerExpectations}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black">
                  مرونة السكن والانتقال
                </h4>
                <p className="text-sm text-[#555555] bg-[#fafafa] p-3 rounded-[8px] border border-black/5">
                  {profile.relocationFlexibility}
                </p>
              </div>

            </div>
          )}

          {/* TAB 4: Compatibility Breakdown */}
          {activeTab === 'compatibility' && (
            <div className="space-y-6">
              <div className="bg-party-pink p-6 rounded-[12px] text-black space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-black" />
                    <h4 className="font-bold text-base">مؤشر التوافق الشرعي المحسوب</h4>
                  </div>
                  <span className="text-2xl font-extrabold font-display">
                    {profile.compatibilityScore || 95}%
                  </span>
                </div>
                <p className="text-xs text-[#444444] leading-relaxed">
                  تم قياس التوافق استناداً إلى الالتزام بالفرائض، التوافق الأسري، أهداف التربية، ورؤية المهر والسكن وفق هدي السنة النبوية.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-black">تفصيل معايير التوافق</h4>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>الصلوات والقرآن (الأولوية العظمى)</span>
                      <span>98%</span>
                    </div>
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>القيم الأسرية ونمط الحياة</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>جاهزية وتوثيق الولي الشرعي</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#31c431] rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proposal Submission Form */}
          <div className="pt-6 border-t border-[#ede5dd] space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#9b4c2e] fill-[#9b4c2e]" />
              <span>{t.sendProposalModalBtn}</span>
            </h4>

            {submittedSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-sm">تم إرسال طلب التواصل الشرعي بنجاح!</div>
                  <div>سيصلك إشعار فور مراجعة ولي الأمر لطلبك وترتيب مجلس الرؤية الشرعية.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {currentSession?.role === 'guest' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <strong>تنبيه:</strong> أنت تتصفح حالياً كزائر. يفضل تسجيل الدخول لربط طلبك بحسابك الدائم، أو أدخل بياناتك أدناه للتواصل مع الولي.
                    </div>
                    {onRequireLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onRequireLogin();
                        }}
                        className="bg-[#9b4c2e] text-white hover:bg-[#853e24] px-3 py-1 rounded-full text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>تسجيل الدخول</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">اسم الخاطب الكريم:</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="مثال: عمر بن عبدالعزيز"
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl text-xs text-neutral-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">رقم هاتف الخاطب أو والده:</label>
                    <input
                      type="tel"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl text-xs text-neutral-900 dir-ltr text-right outline-none"
                    />
                  </div>
                </div>

                <textarea
                  id="proposal-note-input"
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  placeholder="اكتب رسالة مهذبة ومختصرة لولي الأمر تعرف فيها بنفسك وعملك وهدفك من التقدم بالحلال..."
                  rows={3}
                  className="w-full p-3 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] text-[#666666]">
                    🔒 يتم إرسال هذا الطلب بإشراف محارم الأخت ورقم الولي المعتمد.
                  </p>
                  <button
                    id="submit-proposal-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full transition cursor-pointer shrink-0 disabled:opacity-50 shadow-xs"
                  >
                    {isSubmitting ? 'جارٍ الإرسال للولي...' : t.sendProposalModalBtn}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
