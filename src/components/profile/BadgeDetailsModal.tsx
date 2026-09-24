import React from 'react';
import { AchievementBadge, Language } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  HeartHandshake, 
  Users, 
  BookOpen, 
  Award,
  ArrowRight,
  ExternalLink,
  Gift
} from 'lucide-react';
import { fireCelebrationConfetti } from '../../utils/confetti';

interface BadgeDetailsModalProps {
  badge: AchievementBadge | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onGoToProfileEdit?: () => void;
}

export const BadgeDetailsModal: React.FC<BadgeDetailsModalProps> = ({
  badge,
  isOpen,
  onClose,
  lang = 'ar',
  onGoToProfileEdit
}) => {
  if (!isOpen || !badge) return null;

  const isAr = lang === 'ar';

  const getIcon = () => {
    switch (badge.icon) {
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8" />;
      case 'Compass': return <Compass className="w-8 h-8" />;
      case 'HeartHandshake': return <HeartHandshake className="w-8 h-8" />;
      case 'Users': return <Users className="w-8 h-8" />;
      case 'BookOpen': return <BookOpen className="w-8 h-8" />;
      case 'Award': 
      default: return <Award className="w-8 h-8" />;
    }
  };

  const getLevelStyle = () => {
    switch (badge.badgeLevel) {
      case 'diamond':
        return {
          label: isAr ? 'رتبة ألماسيّة' : 'Diamond Tier',
          bg: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border-cyan-400',
          textColor: 'text-cyan-800',
          glow: 'shadow-cyan-500/30 ring-cyan-400/40',
          badgePill: 'bg-cyan-100 text-cyan-800 border-cyan-300'
        };
      case 'gold':
        return {
          label: isAr ? 'رتبة ذهبيّة' : 'Gold Tier',
          bg: 'from-amber-500/20 via-yellow-500/20 to-orange-500/20 border-amber-400',
          textColor: 'text-amber-800',
          glow: 'shadow-amber-500/30 ring-amber-400/40',
          badgePill: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'silver':
        return {
          label: isAr ? 'رتبة فضيّة' : 'Silver Tier',
          bg: 'from-slate-400/20 via-stone-400/20 to-zinc-400/20 border-slate-400',
          textColor: 'text-slate-800',
          glow: 'shadow-slate-500/30 ring-slate-400/40',
          badgePill: 'bg-slate-100 text-slate-800 border-slate-300'
        };
      default:
        return {
          label: isAr ? 'رتبة برونزيّة' : 'Bronze Tier',
          bg: 'from-amber-700/20 via-orange-800/20 to-stone-700/20 border-amber-600',
          textColor: 'text-amber-900',
          glow: 'shadow-amber-700/30 ring-amber-600/40',
          badgePill: 'bg-amber-100 text-amber-900 border-amber-300'
        };
    }
  };

  const levelStyle = getLevelStyle();

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#ede5dd] text-start relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className={`p-6 sm:p-8 bg-gradient-to-br ${levelStyle.bg} relative border-b border-neutral-100 flex flex-col items-center text-center`}>
          <button
            onClick={onClose}
            className="absolute top-4 start-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-600 flex items-center justify-center transition cursor-pointer shadow-xs"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Medal Graphic */}
          <div className="relative mb-3">
            <div 
              style={{ backgroundColor: badge.highlightColor }}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ${levelStyle.glow} transition-transform hover:scale-105`}
            >
              {getIcon()}
            </div>
            {badge.isUnlocked && (
              <div className="absolute -bottom-2 -end-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-md border-2 border-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Level Pill */}
          <span className={`px-3 py-0.5 rounded-full text-xs font-black border mb-2 ${levelStyle.badgePill}`}>
            {levelStyle.label}
          </span>

          <h3 className="text-xl sm:text-2xl font-black font-display text-neutral-900">
            {isAr ? badge.nameAr : badge.nameEn}
          </h3>
          <p className="text-xs text-neutral-600 mt-1 max-w-md">
            {badge.titleAr}
          </p>

          {/* Unlock Badge Status Ribbon */}
          <div className="mt-3 flex items-center gap-2">
            {badge.isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تم اكتساب هذا الوسام بنجاح' : 'Badge Unlocked!'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{isAr ? `قيد الإنجاز: ${badge.progressPercentage}%` : `In Progress: ${badge.progressPercentage}%`}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-neutral-700">
          
          {/* Progress Bar (if not 100%) */}
          {!badge.isUnlocked && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center justify-between text-neutral-800 font-bold">
                <span>{isAr ? 'التقدم نحو اكتساب الوسام:' : 'Progress to Unlock:'}</span>
                <span className="text-[#9b4c2e]">{badge.progressPercentage}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-[#9b4c2e] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(badge.progressPercentage, 5)}%` }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <span className="font-bold text-neutral-900 block text-xs">
              {isAr ? 'عن هذا الوسام الشرعي:' : 'About this Achievement:'}
            </span>
            <p className="text-neutral-600 leading-relaxed text-xs">
              {isAr ? badge.descriptionAr : badge.descriptionEn}
            </p>
          </div>

          {/* Criteria Checklist */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 font-bold">
              <Sparkles className="w-4 h-4 text-[#9b4c2e]" />
              <span>{isAr ? 'معايير وشروط الاستحقاق:' : 'Earning Criteria:'}</span>
            </div>
            <p className="text-neutral-600 text-xs ps-6 leading-relaxed">
              {isAr ? badge.criteriaAr : badge.criteriaEn}
            </p>
          </div>

          {/* Privileges & Rewards */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <Gift className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'الميزات والبركات الممنوحة لملفك:' : 'Privileges & Profile Boost:'}</span>
            </div>
            <p className="text-emerald-900 text-xs ps-6 leading-relaxed font-medium">
              {isAr ? badge.rewardTextAr : badge.rewardTextEn}
            </p>
          </div>

          {/* Prophetic Hadith / Wisdom */}
          {badge.hadithAr && (
            <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#ede5dd] text-neutral-800 space-y-1">
              <span className="text-[10px] font-bold text-[#9b4c2e] uppercase block">
                {isAr ? 'القبس النبوي الشريف:' : 'Prophetic Wisdom:'}
              </span>
              <p className="italic font-display font-medium text-xs leading-relaxed text-neutral-900">
                {badge.hadithAr}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              fireCelebrationConfetti();
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-bold px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? 'الاحتفاء بالوسام ✨' : 'Celebrate ✨'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-200/60 rounded-xl transition cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>

            {!badge.isUnlocked && onGoToProfileEdit && (
              <button
                onClick={() => {
                  onClose();
                  onGoToProfileEdit();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#9b4c2e] hover:bg-[#853e24] rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>{isAr ? 'استكمال الشروط الآن' : 'Complete Requirements'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
