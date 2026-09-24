import React, { useState } from 'react';
import { Profile, Language, PhotoPermissionRequest, UserSession } from '../types';
import { translations } from '../data/translations';
import { 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  Briefcase,
  Heart, 
  Send, 
  MessageCircle, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Languages, 
  Clock, 
  Flag, 
  Ban, 
  EyeClosed,
  CheckCircle2,
  Sparkles,
  Lock,
  Check
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { computeProfileAchievements } from '../utils/achievements';

interface ProfileCardProps {
  profile: Profile;
  lang: Language;
  isFavorite?: boolean;
  canMessage?: boolean;
  currentSession?: UserSession;
  photoRequests?: PhotoPermissionRequest[];
  onRequestPhotoPermission?: (profile: Profile) => void;
  onViewProfile: (profile: Profile) => void;
  onToggleFavorite?: (profile: Profile) => void;
  onRequestMarriage: (profile: Profile) => void;
  onMessage?: (profile: Profile) => void;
  onReportProfile: (profile: Profile) => void;
  onBlockUser: (profile: Profile) => void;
  onHideProfile?: (profileId: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  lang,
  isFavorite = false,
  canMessage = false,
  currentSession,
  photoRequests = [],
  onRequestPhotoPermission,
  onViewProfile,
  onToggleFavorite,
  onRequestMarriage,
  onMessage,
  onReportProfile,
  onBlockUser,
  onHideProfile
}) => {
  const t = translations[lang] || translations['ar'];
  const isAr = lang === 'ar';
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

  // State for manual blur toggle (only effective if approved/self/admin or for male)
  const defaultBlurred = isFemale ? (profile.isPhotoBlurredByDefault ?? true) : false;
  const effectiveBlurred = isApprovedForPhoto ? false : defaultBlurred;
  const [isManualUnblurred, setIsManualUnblurred] = useState<boolean>(false);
  const isCurrentlyBlurred = isApprovedForPhoto ? isManualUnblurred : defaultBlurred;

  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [favState, setFavState] = useState<boolean>(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavState(!favState);
    if (onToggleFavorite) {
      onToggleFavorite(profile);
    }
  };

  const handlePhotoRequestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRequestPhotoPermission) {
      onRequestPhotoPermission(profile);
    } else {
      onViewProfile(profile);
    }
  };

  // Marital status text
  const maritalStatusText = {
    single: lang === 'ar' ? 'لم يسبق الزواج (أعزب/بكر)' : 'Never Married',
    divorced: lang === 'ar' ? 'مطلق / مطلقة' : 'Divorced',
    widowed: lang === 'ar' ? 'أرمل / أرملة' : 'Widowed'
  }[profile.maritalStatus] || profile.maritalStatus;

  // Gender label
  const genderText = profile.gender === 'male' 
    ? (lang === 'ar' ? 'خاطب' : 'Suitor')
    : (lang === 'ar' ? 'مخطوبة' : 'Candidate');

  // Education text
  const educationText = profile.fieldOfStudyName 
    ? `${profile.education} • ${profile.fieldOfStudyName}`
    : profile.education;

  // Languages formatted
  const languagesFormatted = profile.userLanguages && profile.userLanguages.length > 0
    ? profile.userLanguages.map(l => l.languageName).join('، ')
    : (lang === 'ar' ? 'العربية' : 'Arabic');

  // Digital Achievements Badges
  const { badges: achievementBadges } = computeProfileAchievements(profile);
  const earnedBadges = achievementBadges.filter(b => b.isUnlocked);

  return (
    <div 
      id={`profile-card-${profile.id}`}
      className="group relative bg-white rounded-2xl border border-[#ede5dd] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Photo Area with Badges */}
      <div 
        onClick={() => onViewProfile(profile)}
        className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer"
        title={lang === 'ar' ? 'انقر لفتح البروفايل بالكامل' : 'Click to view full profile'}
      >
        <img
          src={profile.avatarUrl}
          alt={profile.fullName}
          className={`w-full h-full object-cover transition-all duration-500 ${
            (isFemale && !isApprovedForPhoto) || isCurrentlyBlurred
              ? 'filter blur-lg scale-105 opacity-75' 
              : 'filter-none scale-100 group-hover:scale-105'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Modesty Banner Overlay for Protected Female Photos */}
        {isFemale && !isApprovedForPhoto && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-black/50 backdrop-blur-[3px]">
            <div className="bg-white/95 text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 mb-1.5 pointer-events-none">
              <EyeOff className="w-3.5 h-3.5 text-[#9b4c2e]" />
              <span>{isAr ? 'صورة محفوظة حياءً وستراً' : 'Photo blurred for modesty'}</span>
            </div>

            <p className="text-white text-[11px] max-w-[210px] leading-snug drop-shadow-sm mb-2 pointer-events-none">
              {isAr ? 'تُكشف للخاطب الجاد بإذن الولي الشرعي وموافقة الأخت' : 'Revealed to serious suitors with guardian consent'}
            </p>

            {/* Interactive Request Action Button / Status */}
            {isPendingPhoto ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-bold shadow-md">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{isAr ? 'طلب الرؤية قيد المراجعة' : 'Reveal Request Pending'}</span>
              </div>
            ) : isRejectedPhoto ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-900/90 text-white text-xs font-bold shadow-md">
                <Ban className="w-3.5 h-3.5" />
                <span>{isAr ? 'تم الاعتذار عن كشف الصورة' : 'Photo Request Declined'}</span>
              </div>
            ) : (
              <button
                type="button"
                id={`request-photo-btn-${profile.id}`}
                onClick={handlePhotoRequestClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-[#9b4c2e] text-xs font-bold shadow-lg transition transform hover:scale-105 cursor-pointer pointer-events-auto border border-[#9b4c2e]/20"
                title={isAr ? 'طلب الإذن الشرعي للاطلاع على الصورة' : 'Request permission to view photo'}
              >
                <Eye className="w-3.5 h-3.5 text-[#9b4c2e]" />
                <span>{isAr ? 'طلب السماح برؤية الصورة' : 'Request Photo Reveal'}</span>
              </button>
            )}
          </div>
        )}

        {/* Top Badges: Status (Online Now) & Verified & Blur Toggle */}
        <div className="absolute top-3 start-3 end-3 flex items-center justify-between z-20 pointer-events-auto">
          {/* Status Badge: متصل الآن with green indicator */}
          <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-neutral-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-black/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{profile.lastActive || (lang === 'ar' ? 'متصل الآن' : 'Online now')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Approved Photo Indicator */}
            {isFemale && isApprovedForPhoto && !isSelf && !isAdmin && (
              <span 
                title={isAr ? 'مصرح لك برؤية الصورة الشرعية بموافقة الولي' : 'Authorized for Sharia Vision'}
                className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3 h-3" />
                <span>{isAr ? 'مصرح بالرؤية' : 'Authorized'}</span>
              </span>
            )}

            {/* Verified Check Badge */}
            {(profile.isVerified || profile.verification?.isVerified) && (
              <span 
                title={lang === 'ar' ? 'حساب موثق بالهوية والولي' : 'Verified'} 
                className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}

            {/* Photo Blur Toggle */}
            <button
              id={`toggle-blur-${profile.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isFemale && !isApprovedForPhoto) {
                  handlePhotoRequestClick(e);
                } else {
                  setIsManualUnblurred(!isCurrentlyBlurred);
                }
              }}
              title={
                isFemale && !isApprovedForPhoto
                  ? (isAr ? 'طلب السماح برؤية الصورة' : 'Request photo reveal')
                  : isCurrentlyBlurred 
                  ? (lang === 'ar' ? 'إظهار الصورة' : 'Show Photo') 
                  : (lang === 'ar' ? 'طمس الصورة' : 'Blur Photo')
              }
              className={`w-7 h-7 rounded-full shadow-sm flex items-center justify-center transition cursor-pointer ${
                isFemale && !isApprovedForPhoto 
                  ? 'bg-amber-100/90 text-amber-900 hover:bg-amber-200' 
                  : 'bg-white/90 hover:bg-white text-neutral-700'
              }`}
            >
              {isFemale && !isApprovedForPhoto ? (
                <Lock className="w-3.5 h-3.5 text-[#9b4c2e]" />
              ) : isCurrentlyBlurred ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Location Overlay on Image */}
        <div className="absolute bottom-3 start-3 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-xs text-white shadow-xs">
            <MapPin className="w-3 h-3 text-[#f7c297]" />
            <span>{profile.city}، {profile.country}</span>
          </span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-2">
          {/* Name and Age: e.g. علي، 30 */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 
              onClick={() => onViewProfile(profile)}
              className="text-lg font-bold text-neutral-900 leading-snug hover:text-[#9b4c2e] transition-colors cursor-pointer"
            >
              {profile.fullName}، {profile.age}
            </h3>
            {profile.matchScore && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                توافق {profile.matchScore}%
              </span>
            )}
          </div>

          {/* Profession & Bio summary */}
          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {profile.profession || profile.aboutMe}
          </p>

          {/* Digital Achievement Badges */}
          {earnedBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {earnedBadges.slice(0, 2).map((badge) => (
                <span 
                  key={badge.id}
                  title={lang === 'ar' ? `${badge.nameAr}: ${badge.rewardTextAr}` : `${badge.nameEn}: ${badge.rewardTextEn}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-3xs bg-white select-none"
                  style={{
                    borderColor: `${badge.highlightColor}35`,
                    color: badge.highlightColor
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.highlightColor }} />
                  <span>{lang === 'ar' ? badge.nameAr : badge.nameEn}</span>
                </span>
              ))}
              {earnedBadges.length > 2 && (
                <span 
                  title={lang === 'ar' ? `+${earnedBadges.length - 2} أوسمة إضافية` : `+${earnedBadges.length - 2} more badges`}
                  className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200"
                >
                  +{earnedBadges.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Tags (Soft peach/terracotta pill chips) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(profile.tags && profile.tags.length > 0 
              ? profile.tags 
              : [
                  profile.educationLevelId === 'bachelor' ? 'جامعي' : 'تعليم عالي',
                  maritalStatusText,
                  profile.prayerHabit === 'always_in_mosque' ? 'محافظ على الصلاة' : 'ملتزم'
                ]
            ).map((tag, idx) => (
              <span 
                key={idx} 
                className="bg-[#f5ece4] text-[#9b4c2e] px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Row matching screenshot */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          
          {/* Primary Action Button: طلب التواصل (Contact Request) */}
          <button
            id={`send-marriage-request-btn-${profile.id}`}
            onClick={() => {
              onRequestMarriage(profile);
              fireCelebrationConfetti();
            }}
            className="flex-1 py-2 px-4 rounded-full bg-[#9b4c2e] hover:bg-[#853e24] text-white text-sm font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            title={lang === 'ar' ? 'إرسال طلب التواصل' : 'Send Contact Request'}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'طلب التواصل' : 'Contact Request'}</span>
          </button>

          {/* Secondary Icon Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Favorite Button */}
            <button
              id={`fav-btn-${profile.id}`}
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full border transition flex items-center justify-center cursor-pointer ${
                favState 
                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                  : 'border-neutral-200 text-neutral-500 hover:text-red-500 hover:bg-neutral-50'
              }`}
              title={favState ? (lang === 'ar' ? 'في المفضلة' : 'Favorited') : (lang === 'ar' ? 'إضافة للمفضلة' : 'Add to Favorites')}
            >
              <Heart className={`w-4 h-4 ${favState ? 'fill-rose-500 text-rose-500' : 'currentColor'}`} />
            </button>

            {/* View Profile Icon Button */}
            <button
              id={`view-profile-btn-${profile.id}`}
              onClick={() => onViewProfile(profile)}
              className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition cursor-pointer"
              title={lang === 'ar' ? 'عرض الملف كاملاً' : 'View Full Profile'}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* More Menu Toggle */}
            <div className="relative">
              <button
                id={`more-btn-${profile.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreMenu(!showMoreMenu);
                }}
                className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                title={lang === 'ar' ? 'خيارات إضافية' : 'More Options'}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* More Dropdown Menu */}
              {showMoreMenu && (
                <div 
                  className="absolute bottom-full mb-1.5 end-0 w-44 bg-white rounded-2xl shadow-lg border border-neutral-200 py-1.5 z-30 text-xs animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Hide Profile */}
                  <button
                    id={`hide-profile-opt-${profile.id}`}
                    onClick={() => {
                      setShowMoreMenu(false);
                      if (onHideProfile) onHideProfile(profile.id);
                    }}
                    className="w-full px-3.5 py-2 text-start flex items-center gap-2 hover:bg-neutral-50 text-neutral-700 transition cursor-pointer"
                  >
                    <EyeClosed className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{lang === 'ar' ? 'إخفاء الملف' : 'Hide Profile'}</span>
                  </button>

                  {/* Block User */}
                  <button
                    id={`block-user-opt-${profile.id}`}
                    onClick={() => {
                      setShowMoreMenu(false);
                      onBlockUser(profile);
                    }}
                    className="w-full px-3.5 py-2 text-start flex items-center gap-2 hover:bg-neutral-50 text-neutral-700 transition cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{lang === 'ar' ? 'حظر المستخدم' : 'Block User'}</span>
                  </button>

                  <div className="my-1 border-t border-neutral-100" />

                  {/* Report Profile */}
                  <button
                    id={`report-profile-opt-${profile.id}`}
                    onClick={() => {
                      setShowMoreMenu(false);
                      onReportProfile(profile);
                    }}
                    className="w-full px-3.5 py-2 text-start flex items-center gap-2 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-500" />
                    <span>{lang === 'ar' ? 'إبلاغ عن ملف' : 'Report Profile'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
