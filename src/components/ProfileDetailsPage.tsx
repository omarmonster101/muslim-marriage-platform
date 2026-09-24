import React, { useState, useEffect } from 'react';
import { Profile, Language, UserSession, Proposal, PhotoPermissionRequest } from '../types';
import { translations } from '../data/translations';
import { 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Eye, 
  EyeOff, 
  Share2, 
  Phone, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  Clock, 
  Compass, 
  Lock, 
  Copy, 
  Check, 
  LogIn, 
  Award,
  Building,
  Home,
  MessageCircle,
  AlertCircle,
  Ban
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface ProfileDetailsPageProps {
  profile: Profile;
  lang: Language;
  currentSession: UserSession;
  isFavorite: boolean;
  photoRequests?: PhotoPermissionRequest[];
  onRequestPhotoPermission?: (profile: Profile) => void;
  onToggleFavorite: (profile: Profile) => void;
  onBack: () => void;
  onRequestContact: (profile: Profile, note: string, customDetails?: { name?: string; phone?: string; city?: string }) => void;
  onRequireLogin?: () => void;
}

export const ProfileDetailsPage: React.FC<ProfileDetailsPageProps> = ({
  profile,
  lang,
  currentSession,
  isFavorite,
  photoRequests = [],
  onRequestPhotoPermission,
  onToggleFavorite,
  onBack,
  onRequestContact,
  onRequireLogin
}) => {
  const isAr = lang === 'ar';
  const t = translations[lang] || translations.ar;

  const isFemale = profile.gender === 'female';
  const isSelf = currentSession?.id === profile.id || currentSession?.relatedProfileId === profile.id;
  const isAdmin = currentSession?.role === 'admin';

  // Check photo request status for current session
  const userPhotoRequest = photoRequests.find(
    r => r.suitorId === currentSession?.id && r.targetProfileId === profile.id
  );
  const isApprovedForPhoto = isSelf || isAdmin || userPhotoRequest?.status === 'approved';
  const isPendingPhoto = !isApprovedForPhoto && userPhotoRequest?.status === 'pending';
  const isRejectedPhoto = !isApprovedForPhoto && userPhotoRequest?.status === 'rejected';

  const defaultBlurred = isFemale ? (profile.isPhotoBlurredByDefault ?? true) : false;
  const [isPhotoBlurred, setIsPhotoBlurred] = useState<boolean>(!isApprovedForPhoto && defaultBlurred);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [requestNote, setRequestNote] = useState<string>(
    isAr 
      ? 'السلام عليكم ورحمة الله وبركاته، يشرفني التقدم لطلب التواصل الشرعي الهادف للعفاف والزواج على كتاب الله وسنة رسوله ﷺ، وأرجو الاطلاع على سيرتي والتنسيق بما يرضي الله.'
      : 'Peace be upon you. I would like to request honorable communication for matrimonial purpose according to the Sunnah. Please review my profile.'
  );

  const [senderName, setSenderName] = useState<string>(
    currentSession && currentSession.role !== 'guest' ? currentSession.name : ''
  );
  const [senderPhone, setSenderPhone] = useState<string>(currentSession?.phone || '');
  const [senderCity, setSenderCity] = useState<string>(isAr ? 'الرياض' : 'Riyadh');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync session details
  useEffect(() => {
    if (currentSession && currentSession.role !== 'guest') {
      setSenderName(currentSession.name);
      if (currentSession.phone) setSenderPhone(currentSession.phone);
    }
  }, [currentSession]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleSubmitContactRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSession.role === 'guest' && onRequireLogin && (!senderName.trim() || !senderPhone.trim())) {
      onRequireLogin();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onRequestContact(profile, requestNote, {
        name: senderName.trim() || undefined,
        phone: senderPhone.trim() || undefined,
        city: senderCity.trim() || undefined
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      fireCelebrationConfetti();
    }, 600);
  };

  const scrollToContactForm = () => {
    const el = document.getElementById('contact-request-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const matchPercentage = profile.matchScore || 94;

  return (
    <div className="w-full min-h-screen bg-[#fcfaf7] text-start pb-28 animate-in fade-in duration-300">
      
      {/* Top Sticky Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ede5dd] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Back Button */}
          <button
            id="profile-details-back-btn"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold text-neutral-700 hover:text-neutral-950 hover:bg-[#faf8f5] border border-neutral-200 transition cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة إلى القائمة' : 'Back to Results'}</span>
          </button>

          {/* Breadcrumb Title */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 truncate">
            <span>{isAr ? 'الملفات المتاحة' : 'Profiles'}</span>
            <span>/</span>
            <span className="font-bold text-neutral-900">{profile.fullName}</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
              {isFemale ? (isAr ? 'مرشحة مصونة' : 'Candidate') : (isAr ? 'خاطب جاد' : 'Suitor')}
            </span>
          </div>

          {/* Right Action Icons: Favorite, Share, Primary CTA */}
          <div className="flex items-center gap-2">
            <button
              id="share-profile-btn"
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition cursor-pointer relative"
              title={isAr ? 'مشاركة رابط الملف' : 'Share Profile Link'}
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              {isCopied && (
                <span className="absolute -bottom-8 start-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  {isAr ? 'تم النسخ!' : 'Copied!'}
                </span>
              )}
            </button>

            <button
              id="toggle-favorite-details-btn"
              type="button"
              onClick={() => onToggleFavorite(profile)}
              className={`p-2.5 rounded-full border transition cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'border-neutral-200 text-neutral-600 hover:text-rose-600 hover:bg-neutral-50'
              }`}
              title={isFavorite ? (isAr ? 'إزالة من المفضلة' : 'Remove Favorite') : (isAr ? 'إضافة إلى المفضلة' : 'Add to Favorites')}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Primary Action Button: طلب التواصل */}
            <button
              id="quick-contact-request-btn"
              type="button"
              onClick={scrollToContactForm}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-200" />
              <span>{isAr ? 'طلب التواصل' : 'Contact Request'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Two-Column Grid: Left (Profile Sidebar) + Right (Detailed Info Sections) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================================= */}
          {/* LEFT SIDEBAR: Photo, Quick Identity, Compatibility, Key Badges (4 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Photo Card */}
            <div className="bg-white rounded-3xl border border-[#ede5dd] shadow-xs overflow-hidden">
              
              {/* Photo Frame with Blur & Modesty Controls */}
              <div className="relative w-full aspect-[4/4] bg-neutral-100 overflow-hidden select-none">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    (isFemale && !isApprovedForPhoto) || isPhotoBlurred
                      ? 'filter blur-lg scale-105 opacity-80' 
                      : 'filter-none scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Modesty Blur Notice & Permission Request Action */}
                {isFemale && !isApprovedForPhoto && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/55 backdrop-blur-[3px]">
                    <div className="bg-white/95 text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 mb-2 pointer-events-none">
                      <EyeOff className="w-3.5 h-3.5 text-[#9b4c2e]" />
                      <span>{isAr ? 'الصورة محجوبة صوناً وحياءً' : 'Photo blurred for modesty'}</span>
                    </div>

                    <p className="text-white text-xs max-w-[240px] leading-relaxed drop-shadow-sm font-medium mb-3 pointer-events-none">
                      {isAr 
                        ? 'تُكشف للخاطب الجاد بعد موافقة الأخت الكريمة والولي الشرعي'
                        : 'Revealed to serious suitors upon guardian and candidate approval'}
                    </p>

                    {/* Interactive Request Action Button / Status */}
                    {isPendingPhoto ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/95 text-white text-xs font-bold shadow-lg">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>{isAr ? 'طلب الرؤية قيد مراجعة الولي والأخت' : 'Photo Reveal Request Pending'}</span>
                      </div>
                    ) : isRejectedPhoto ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-900/90 text-white text-xs font-bold shadow-lg">
                        <Ban className="w-4 h-4" />
                        <span>{isAr ? 'تم الاعتذار عن كشف الصورة' : 'Photo Request Declined'}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        id="details-request-photo-btn"
                        onClick={() => {
                          if (onRequestPhotoPermission) {
                            onRequestPhotoPermission(profile);
                          } else {
                            scrollToContactForm();
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-[#9b4c2e] text-xs font-bold shadow-lg transition transform hover:scale-105 cursor-pointer pointer-events-auto border border-[#9b4c2e]/20"
                        title={isAr ? 'طلب الإذن الشرعي للاطلاع على الصورة' : 'Request photo reveal'}
                      >
                        <Eye className="w-4 h-4 text-[#9b4c2e]" />
                        <span>{isAr ? 'طلب السماح برؤية الصورة الشرعية' : 'Request Photo Reveal Permission'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Top Floating Controls */}
                <div className="absolute top-3 start-3 end-3 flex items-center justify-between z-20">
                  {/* Online / Active badge or Approved badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-neutral-800 text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs border border-black/5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{profile.lastActive || (isAr ? 'متصل الآن' : 'Active Now')}</span>
                    </span>

                    {isFemale && isApprovedForPhoto && !isSelf && !isAdmin && (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAr ? 'مصرح بالرؤية' : 'Authorized'}</span>
                      </span>
                    )}
                  </div>

                  {/* Photo Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isFemale && !isApprovedForPhoto) {
                        if (onRequestPhotoPermission) {
                          onRequestPhotoPermission(profile);
                        } else {
                          scrollToContactForm();
                        }
                      } else {
                        setIsPhotoBlurred(!isPhotoBlurred);
                      }
                    }}
                    className={`p-2 rounded-full shadow-sm border transition cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                      isFemale && !isApprovedForPhoto
                        ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                        : 'bg-white/95 hover:bg-white text-neutral-700 border-neutral-200'
                    }`}
                    title={
                      isFemale && !isApprovedForPhoto
                        ? (isAr ? 'طلب السماح برؤية الصورة' : 'Request photo reveal')
                        : isPhotoBlurred 
                        ? (isAr ? 'إظهار الصورة' : 'Reveal photo') 
                        : (isAr ? 'حجب الصورة' : 'Blur photo')
                    }
                  >
                    {isFemale && !isApprovedForPhoto ? (
                      <Lock className="w-4 h-4 text-[#9b4c2e]" />
                    ) : isPhotoBlurred ? (
                      <Eye className="w-4 h-4 text-[#9b4c2e]" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-neutral-600" />
                    )}
                    <span className="hidden sm:inline">
                      {isFemale && !isApprovedForPhoto
                        ? (isAr ? 'استئذان' : 'Request')
                        : isPhotoBlurred 
                        ? (isAr ? 'إظهار' : 'Reveal') 
                        : (isAr ? 'طمس' : 'Blur')}
                    </span>
                  </button>
                </div>

                {/* Bottom Overlay Location */}
                <div className="absolute bottom-3 start-3 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-xs text-white shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#f7c297]" />
                    <span>{profile.city}، {profile.country}</span>
                  </span>
                </div>
              </div>

              {/* Identity & Basic Details */}
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                      {profile.fullName}
                    </h1>
                    <span className="text-sm font-bold text-neutral-500">
                      {profile.age} {isAr ? 'سنة' : 'yrs'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1.5">
                    <span>{profile.profession || (isAr ? 'غير محدد' : 'Not specified')}</span>
                    <span>•</span>
                    <span>{profile.nationality || (isAr ? 'سعودي' : 'Saudi')}</span>
                  </p>
                </div>

                {/* Sharia Verification Badges */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 p-2.5 rounded-xl font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isAr ? 'هوية وطنية موثقة عبر النفاذ المعتمد' : 'Verified National ID'}</span>
                  </div>

                  {isFemale ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 p-2.5 rounded-xl font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{isAr ? `إشراف الولي الشرعي: ${profile.wali?.name} (${profile.wali?.relation})` : `Guardian: ${profile.wali?.name}`}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-amber-950 bg-amber-50/90 border border-amber-200/80 p-2.5 rounded-xl font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#9b4c2e] shrink-0" />
                      <span>{isAr ? 'إقرار الباءة والاستطاعة والمسكن المستقل' : 'Ba\'ah & Financial Readiness Verified'}</span>
                    </div>
                  )}
                </div>

                {/* Compatibility Score */}
                <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#ede5dd] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                    <span className="flex items-center gap-1 text-[#9b4c2e]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isAr ? 'مؤشر التوافق الشرعي معك' : 'Sharia Match Score'}</span>
                    </span>
                    <span className="font-mono text-sm text-[#9b4c2e]">{matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-[#9b4c2e] rounded-full transition-all duration-500" 
                      style={{ width: `${matchPercentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-snug">
                    {isAr ? 'توافق ممتاز في الالتزام الديني، السكن، والتطلعات الأسرية.' : 'High compatibility in faith, residence & marital values.'}
                  </p>
                </div>

                {/* Action CTA inside Sidebar */}
                <button
                  type="button"
                  onClick={scrollToContactForm}
                  className="w-full py-3 px-4 rounded-full bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-200" />
                  <span>{isAr ? 'طلب التواصل الشرعي' : 'Request Contact'}</span>
                </button>
              </div>
            </div>

            {/* Safety & Sharia Pledge Card */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 space-y-2 text-xs text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{isAr ? 'ميثاق الأمان والعفاف' : 'Sharia Safety Pledge'}</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                {isAr 
                  ? 'تتم جميع طلبات التواصل وفق ضوابط الشريعة الإسلامية، بإشراف الأولياء والمحارم وصون تام للخصوصية دون أي تواصل غير منضبط.'
                  : 'All communications adhere strictly to Islamic principles under parental supervision.'}
              </p>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT CONTENT: Detailed Sections with full bio info (8 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. SECTION: Personal & Demographics (البيانات الشخصية والاجتماعية) */}
            <section className="bg-white rounded-3xl border border-[#ede5dd] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <UserCheck className="w-5 h-5 text-[#9b4c2e]" />
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                  {isAr ? 'البيانات الشخصية والاجتماعية' : 'Personal & Social Details'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5dd]">
                  <span className="text-neutral-500 block mb-1">{isAr ? 'الحالة الاجتماعية' : 'Marital Status'}</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {profile.maritalStatus === 'single' ? (isAr ? (isFemale ? 'بكر / لم يسبق لها الزواج' : 'أعزب / لم يسبق له الزواج') : 'Single') :
                     profile.maritalStatus === 'divorced' ? (isAr ? 'مطلق / مطلقة' : 'Divorced') :
                     (isAr ? 'أرمل / أرملة' : 'Widowed')}
                  </span>
                </div>

                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5dd]">
                  <span className="text-neutral-500 block mb-1">{isAr ? 'الطول والقامة' : 'Height'}</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {profile.heightCm ? `${profile.heightCm} ${isAr ? 'سم' : 'cm'}` : (isAr ? 'متوسط القامة' : 'Average')}
                  </span>
                </div>

                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5dd]">
                  <span className="text-neutral-500 block mb-1">{isAr ? 'الأطفال' : 'Children'}</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {profile.hasChildren 
                      ? (isAr ? `نعم (${profile.childrenCount || 1} أطفال)` : `Yes (${profile.childrenCount || 1})`) 
                      : (isAr ? 'لا يوجد أطفال' : 'No children')}
                  </span>
                </div>

                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5dd]">
                  <span className="text-neutral-500 block mb-1">{isAr ? 'الرغبة في الإنجاب' : 'Wants Children'}</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {profile.wantsChildren === 'yes' ? (isAr ? 'راغب في الإنجاب بإذن الله' : 'Yes, wants children') :
                     profile.wantsChildren === 'no' ? (isAr ? 'لا يرغب حالياً' : 'No') :
                     (isAr ? 'أمر ميسر ومتروك للنصيب' : 'Open / Flexible')}
                  </span>
                </div>

                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5dd]">
                  <span className="text-neutral-500 block mb-1">{isAr ? 'الإقامة الحالية' : 'Current Residence'}</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {profile.city}، {profile.country}
                  </span>
                </div>

                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede5dd]">
                  <span className="text-neutral-500 block mb-1">{isAr ? 'الوقت المفضل للزواج' : 'Marriage Timeline'}</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {profile.marriageTimeline === 'immediate' ? (isAr ? 'عاجل خلال 1-3 أشهر' : 'Within 1-3 months') :
                     profile.marriageTimeline === 'within_3_months' ? (isAr ? 'خلال 3 إلى 6 أشهر' : 'Within 3-6 months') :
                     (isAr ? 'ميسر خلال سنة' : 'Within a year')}
                  </span>
                </div>
              </div>

              {/* Relocation Flexibility */}
              {profile.relocationFlexibility && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                  <span className="font-bold text-neutral-800 me-2">{isAr ? 'القدرة على الانتقال وتغيير السكن:' : 'Relocation Flexibility:'}</span>
                  <span className="text-neutral-600">{profile.relocationFlexibility}</span>
                </div>
              )}
            </section>

            {/* 2. SECTION: Faith & Sharia Lifestyle (الالتزام الديني والسمت الصالح) */}
            <section className="bg-white rounded-3xl border border-[#ede5dd] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <Compass className="w-5 h-5 text-[#9b4c2e]" />
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                  {isAr ? 'الالتزام الديني والسمت الصالح' : 'Faith & Islamic Lifestyle'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#faf8f5] rounded-xl border border-[#ede5dd] space-y-1">
                  <span className="text-neutral-500 block">{isAr ? 'المحافظة على الصلاة' : 'Prayer Habit'}</span>
                  <p className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {profile.prayerHabit === 'always_in_mosque' ? (isAr ? 'محافظ في المسجد مع الجماعة دائماً' : 'Always in mosque with Jama’ah') :
                       profile.prayerHabit === 'always_on_time' ? (isAr ? 'محافظ في وقتها دائماً' : 'Always on time') :
                       (isAr ? 'محافظ غالباً في وقتها' : 'Mostly on time')}
                    </span>
                  </p>
                </div>

                <div className="p-3.5 bg-[#faf8f5] rounded-xl border border-[#ede5dd] space-y-1">
                  <span className="text-neutral-500 block">{isAr ? 'حفظ القرآن الكريم' : 'Quran Memorization'}</span>
                  <p className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{profile.quranMemorization || (isAr ? 'يحفظ قصار السور وأجزاء متفرقة' : 'Short Surahs & parts')}</span>
                  </p>
                </div>

                <div className="p-3.5 bg-[#faf8f5] rounded-xl border border-[#ede5dd] space-y-1">
                  <span className="text-neutral-500 block">{isAr ? 'المظهر والسمت الشرعي' : 'Religious Attire & Appearance'}</span>
                  <p className="font-bold text-neutral-900 text-sm">
                    {profile.religiousAttire || (isAr ? (isFemale ? 'حجاب شرعي ساتر ومحتشم' : 'سمت وقور ومحافظ') : 'Modest Islamic Attire')}
                  </p>
                </div>

                <div className="p-3.5 bg-[#faf8f5] rounded-xl border border-[#ede5dd] space-y-1">
                  <span className="text-neutral-500 block">{isAr ? 'التدخين والمعسلات' : 'Smoking'}</span>
                  <p className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isAr ? 'لا يدخن إطلاقاً بفضل الله' : 'Non-smoker (Never)'}</span>
                  </p>
                </div>
              </div>

              {/* Islamic Interests Tags */}
              {profile.islamicInterests && profile.islamicInterests.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-neutral-700 block">
                    {isAr ? 'الاهتمامات والعلوم الشرعية:' : 'Islamic Interests & Focus:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profile.islamicInterests.map((interest, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
                        🌿 {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 3. SECTION: Education & Profession (التعليم والمسار المهني) */}
            <section className="bg-white rounded-3xl border border-[#ede5dd] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <GraduationCap className="w-5 h-5 text-[#9b4c2e]" />
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                  {isAr ? 'التعليم والمسار المهني' : 'Education & Career'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#faf8f5] rounded-xl border border-[#ede5dd] space-y-1">
                  <span className="text-neutral-500 block flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{isAr ? 'المؤهل العلمي' : 'Education Level'}</span>
                  </span>
                  <p className="font-bold text-neutral-900 text-sm">
                    {profile.education || (isAr ? 'جامعي / بكالوريوس' : 'Bachelor Degree')}
                  </p>
                  {profile.fieldOfStudyName && (
                    <p className="text-xs text-neutral-600">{profile.fieldOfStudyName}</p>
                  )}
                </div>

                <div className="p-3.5 bg-[#faf8f5] rounded-xl border border-[#ede5dd] space-y-1">
                  <span className="text-neutral-500 block flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{isAr ? 'المهنة والقطاع' : 'Profession & Sector'}</span>
                  </span>
                  <p className="font-bold text-neutral-900 text-sm">
                    {profile.profession || (isAr ? 'موظف في قطاع مهني' : 'Professional')}
                  </p>
                  {profile.jobCategoryName && (
                    <p className="text-xs text-neutral-600">{profile.jobCategoryName}</p>
                  )}
                </div>
              </div>
            </section>

            {/* 4. SECTION: Bio & Partner Expectations (نبذة عن النفس ومواصفات الشريك) */}
            <section className="bg-white rounded-3xl border border-[#ede5dd] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <Heart className="w-5 h-5 text-[#9b4c2e]" />
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                  {isAr ? 'نبذة عن النفس ومواصفات الشريك المنشود' : 'About Me & Partner Expectations'}
                </h2>
              </div>

              {/* About Me */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-neutral-900">
                  {isAr ? 'نبذة عن النفس والنشأة والهدف من الزواج:' : 'About Me & Matrimonial Objective:'}
                </h3>
                <p className="p-4 bg-[#faf8f5] rounded-2xl border border-[#ede5dd] text-xs sm:text-sm text-neutral-800 leading-relaxed">
                  {profile.aboutMe || (isAr ? 'طالب للعفاف والستر وبناء بيت مسلم هادئ على كتاب الله وسنة رسوله ﷺ.' : 'Seeking matrimonial blessing on Quran & Sunnah.')}
                </p>
              </div>

              {/* Partner Expectations */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-xs font-bold text-neutral-900">
                  {isAr ? 'مواصفات الشريك المنشود وتطلعات الأسرة:' : 'Partner Expectations & Marriage Aspirations:'}
                </h3>
                <p className="p-4 bg-[#faf8f5] rounded-2xl border border-[#ede5dd] text-xs sm:text-sm text-neutral-800 leading-relaxed">
                  {profile.partnerExpectations || (isAr ? 'ذات دين وخلق، محافظة على الصلاة، تبتغي مرضاة الله وبناء أسرة صالحة متفاهمة.' : 'A practicing, pious partner committed to family harmony.')}
                </p>
              </div>

              {/* Family Values & Mahr */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                {profile.familyValues && (
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                    <span className="font-bold text-neutral-900 block">{isAr ? 'القيم الأسرية والبيئة:' : 'Family Values:'}</span>
                    <p className="text-neutral-700 leading-relaxed">{profile.familyValues}</p>
                  </div>
                )}
                {profile.mahrExpectation && (
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                    <span className="font-bold text-neutral-900 block">{isAr ? 'المهر وتيسير الزواج:' : 'Mahr & Ease:'}</span>
                    <p className="text-neutral-700 leading-relaxed">{profile.mahrExpectation}</p>
                  </div>
                )}
              </div>
            </section>

            {/* 5. SECTION: Sharia Contact & Guardianship Details (بيانات التواصل الشرعي) */}
            <section className="bg-white rounded-3xl border border-[#ede5dd] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#9b4c2e]" />
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                    {isFemale 
                      ? (isAr ? 'قناة التواصل عبر الولي الشرعي المعتمد' : 'Guardian Communication Channel')
                      : (isAr ? 'بيانات الباءة والاستطاعة والنفقة (للخاطب)' : 'Ba\'ah & Readiness Guarantee')}
                  </h2>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-3 py-0.5 rounded-full">
                  {isAr ? 'موثق رسمياً ✓' : 'Verified ✓'}
                </span>
              </div>

              {/* If Candidate: Guardian Details */}
              {isFemale ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50/80 border border-emerald-200 p-4 sm:p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-xs text-emerald-700 font-semibold block">{isAr ? 'ولي الأمر المسؤول:' : 'Legal Guardian:'}</span>
                        <h4 className="text-base font-bold text-emerald-950">
                          {profile.wali?.name} ({profile.wali?.relation})
                        </h4>
                      </div>
                      <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {isAr ? 'تم التحقق من صلة القرابة ✓' : 'Guardian Relation Verified ✓'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-mono" dir="ltr">{profile.wali?.phone || '+966 5X XXX XXXX'}</span>
                        <span className="text-[10px] text-neutral-400">({isAr ? 'مخصص للرؤية الشرعية' : 'For Vision Council'})</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{profile.wali?.email || 'wali@meethaq.sa'}</span>
                      </div>
                    </div>

                    {profile.wali?.notes && (
                      <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/60 text-xs text-neutral-700">
                        <span className="font-bold text-emerald-950 me-1">{isAr ? 'توجيهات وملاحظات الولي:' : 'Guardian Guidance:'}</span>
                        «{profile.wali.notes}»
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* If Male Suitor: Ba'ah & Readiness (NO WALI FOR MALE!) */
                <div className="space-y-4">
                  <div className="bg-amber-50/80 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-xs text-amber-800 font-semibold block">{isAr ? 'إقرار الجاهزية الشرعية:' : 'Sharia Readiness Statement:'}</span>
                        <h4 className="text-base font-bold text-neutral-900">
                          {isAr ? 'جاهزية الباءة والنفقة والسكن المستقل التام' : 'Fully Prepared for Independent Home & Maintenance'}
                        </h4>
                      </div>
                      <span className="bg-[#9b4c2e] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {isAr ? 'باءة موثقة ✓' : 'Ba\'ah Verified ✓'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 bg-white rounded-xl border border-amber-200/60 space-y-0.5">
                        <span className="text-neutral-500 block">{isAr ? 'السكن الزوجي المهيأ:' : 'Marital Housing:'}</span>
                        <span className="font-bold text-neutral-900">{isAr ? 'سكن مستقل بالكامل مهيأ للزواج' : 'Independent furnished housing'}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-amber-200/60 space-y-0.5">
                        <span className="text-neutral-500 block">{isAr ? 'التقدم لمجلس الولي:' : 'Guardian Council:'}</span>
                        <span className="font-bold text-neutral-900">{isAr ? 'جاهز لزيارة مجلس ولي الأمر فور القبول' : 'Ready for formal family visit'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 6. SECTION: Send Contact Request Form (قسم إرسال طلب التواصل) */}
            <section id="contact-request-section" className="bg-white rounded-3xl border-2 border-[#9b4c2e]/40 p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf1eb] text-[#9b4c2e] text-xs font-bold">
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'بوابة الخطوة الشرعية الأولى' : 'First Sharia Step'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                    {isAr ? 'إرسال طلب التواصل' : 'Send Contact Request'}
                  </h2>
                </div>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-emerald-950">
                    {isAr ? 'تم إرسال طلب التواصل بنجاح!' : 'Contact Request Sent Successfully!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-700 max-w-md mx-auto leading-relaxed">
                    {isAr
                      ? `تم إشعار المعنيين بالطلب، وستصلك رسالة وإشعار فوري فور مراجعة الطلب وترتيب مجلس الرؤية الشرعية المباركة بإذن الله.`
                      : 'The party has been notified. You will receive an immediate update once reviewed.'}
                  </p>
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 bg-[#9b4c2e] text-white text-xs font-bold px-6 py-2.5 rounded-full transition cursor-pointer"
                  >
                    <span>{isAr ? 'العودة للمطابقات واستعراض المزيد' : 'Back to Matches'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitContactRequest} className="space-y-4 text-xs">
                  
                  {/* Guest Alert if not logged in */}
                  {currentSession.role === 'guest' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-700" />
                          <span>{isAr ? 'تنبيه: أنت تتصفح حالياً كزائر' : 'Notice: Browsing as Guest'}</span>
                        </span>
                        {onRequireLogin && (
                          <button
                            type="button"
                            onClick={onRequireLogin}
                            className="bg-[#9b4c2e] text-white px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                          </button>
                        )}
                      </div>
                      <p className="text-neutral-700 leading-relaxed">
                        {isAr 
                          ? 'يمكنك ملء بياناتك أدناه للتواصل مباشرة، أو تسجيل الدخول لحفظ المعاملة ومتابعة مسار الخطوبة في حسابك.'
                          : 'Enter your details below to request contact, or sign in to track progress.'}
                      </p>
                    </div>
                  )}

                  {/* Sender Contact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        {isAr ? 'الاسم الكريم:' : 'Your Full Name:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder={isAr ? 'مثال: عبدالمحسن الشمري' : 'e.g. John Doe'}
                        className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl text-xs text-neutral-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        {isAr ? 'رقم الهاتف للتواصل الشرعي:' : 'Phone Number:'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl text-xs text-neutral-900 outline-none direction-ltr"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        {isAr ? 'المدينة الحالية:' : 'Your City:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={senderCity}
                        onChange={(e) => setSenderCity(e.target.value)}
                        placeholder={isAr ? 'مثال: الرياض' : 'Riyadh'}
                        className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl text-xs text-neutral-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Note / Introduction Message */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-neutral-800">
                      {isAr ? 'رسالة طلب التواصل والتعريف بالهدف الشرعي:' : 'Introduction Note:'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      placeholder={isAr ? 'اكتب رسالة راقية وموجزة توضح فيها جديتك وهدفك من التواصل بالحلال...' : 'Write an introduction note...'}
                      className="w-full p-3.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
                    <p className="text-[11px] text-neutral-500">
                      🔒 {isAr ? 'يتم التعامل مع الطلب بسرية تامة تحت إشراف المحارم والأولياء.' : 'Handled with strict confidentiality & Sharia oversight.'}
                    </p>
                    <button
                      id="submit-contact-request-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs sm:text-sm font-bold py-3 px-8 rounded-full transition shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-amber-200" />
                      <span>{isSubmitting ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : (isAr ? 'إرسال طلب التواصل' : 'Send Contact Request')}</span>
                    </button>
                  </div>

                </form>
              )}
            </section>

          </div>

        </div>

      </main>

      {/* Sticky Bottom Floating Bar on Mobile & Desktop */}
      <div className="fixed bottom-0 start-0 end-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ede5dd] p-3 sm:p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 shrink-0">
              <img 
                src={profile.avatarUrl} 
                alt={profile.fullName} 
                className={`w-full h-full object-cover ${isPhotoBlurred ? 'blur-xs' : ''}`}
              />
            </div>
            <div className="hidden sm:block">
              <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">
                {profile.fullName}، {profile.age}
              </h4>
              <p className="text-[11px] text-neutral-500">
                {profile.city} • {isFemale ? (isAr ? 'تحت إشراف الولي' : 'Wali Supervised') : (isAr ? 'باءة موثقة' : 'Verified')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(profile)}
              className={`p-2.5 rounded-full border transition cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'border-neutral-200 text-neutral-600 hover:text-rose-600 hover:bg-neutral-50'
              }`}
              title={isFavorite ? (isAr ? 'في المفضلة' : 'Favorited') : (isAr ? 'إضافة للمفضلة' : 'Favorite')}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              id="sticky-bottom-contact-btn"
              type="button"
              onClick={scrollToContactForm}
              className="bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full transition shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-amber-200" />
              <span>{isAr ? 'طلب التواصل' : 'Contact Request'}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
