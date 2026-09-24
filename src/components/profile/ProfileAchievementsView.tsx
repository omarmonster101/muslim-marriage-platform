import React, { useState } from 'react';
import { Profile, UserSession, Language, AchievementBadge } from '../../types';
import { computeProfileAchievements } from '../../utils/achievements';
import { BadgeDetailsModal } from './BadgeDetailsModal';
import { 
  Award, 
  ShieldCheck, 
  Compass, 
  HeartHandshake, 
  Users, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Info, 
  ChevronRight,
  Filter,
  Medal,
  Crown,
  Eye,
  TrendingUp,
  Flame
} from 'lucide-react';
import { fireCelebrationConfetti } from '../../utils/confetti';

interface ProfileAchievementsViewProps {
  profile?: Profile | null;
  currentSession: UserSession;
  lang?: Language;
  onEditProfile: () => void;
  onViewPublicProfile?: () => void;
}

export const ProfileAchievementsView: React.FC<ProfileAchievementsViewProps> = ({
  profile,
  currentSession,
  lang = 'ar',
  onEditProfile,
  onViewPublicProfile
}) => {
  const isAr = lang === 'ar';
  const { badges, unlockedCount, totalCount, score, highestLevel } = computeProfileAchievements(profile, currentSession);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', labelAr: `كافة الأوسمة (${totalCount})`, labelEn: `All Badges (${totalCount})` },
    { id: 'verification', labelAr: 'التوثيق والأمان', labelEn: 'Verification' },
    { id: 'religious', labelAr: 'الالتزام الديني', labelEn: 'Religious Dedication' },
    { id: 'conduct', labelAr: 'حُسن الخلق والسمت', labelEn: 'Conduct & Etiquette' },
    { id: 'family', labelAr: 'رعاية الأهل والولي', labelEn: 'Family & Guardian' },
    { id: 'marriage', labelAr: 'شروط ومقاصد الزواج', labelEn: 'Marriage Goals' }
  ];

  const filteredBadges = badges.filter(b => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Award': 
      default: return <Award className="w-6 h-6" />;
    }
  };

  const getTierDetails = (level: 'bronze' | 'silver' | 'gold' | 'diamond') => {
    switch (level) {
      case 'diamond':
        return {
          title: isAr ? 'رتبة الوفاق الألماسي 💎' : 'Diamond Compatibility 💎',
          subtitle: isAr ? 'أعلى درجات الموثوقية والكمال في منظومة ميثاق' : 'Highest trust tier on Meethaq',
          gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
          badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300'
        };
      case 'gold':
        return {
          title: isAr ? 'رتبة الميثاق الذهبي 👑' : 'Golden Meethaq Tier 👑',
          subtitle: isAr ? 'سيرة مباركة مكتملة تحظى بتقدير أولياء الأمور' : 'Distinguished profile highly trusted by Walis',
          gradient: 'from-amber-500 via-yellow-600 to-orange-600',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'silver':
        return {
          title: isAr ? 'رتبة الصدق الفضيّة 🥈' : 'Silver Sincerity Tier 🥈',
          subtitle: isAr ? 'سيرة متقدمة في طريق استكمال الأوسمة الشرعية' : 'Strong progress towards full Sharia honors',
          gradient: 'from-slate-500 via-stone-600 to-zinc-700',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300'
        };
      default:
        return {
          title: isAr ? 'رتبة البداية المباركة 🥉' : 'Blessed Beginning 🥉',
          subtitle: isAr ? 'استكمل باقي بيانات السيرة لاكتساب الأوسمة العليا' : 'Complete profile sections to unlock higher badges',
          gradient: 'from-[#9b4c2e] via-[#853e24] to-[#672c18]',
          badgeBg: 'bg-stone-100 text-stone-800 border-stone-300'
        };
    }
  };

  const currentTier = getTierDetails(highestLevel);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-cairo text-start">
      
      {/* 1. Hero Achievement Header Card */}
      <div className="bg-white rounded-3xl border border-[#ede5dd] shadow-2xs overflow-hidden">
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${currentTier.gradient} text-white relative overflow-hidden`}>
          {/* Subtle background arabesque watermark */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/30">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  {currentTier.title}
                </span>
                <span className="bg-black/25 text-white/90 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {score}% {isAr ? 'معدل الإنجاز' : 'Completion Rate'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                {isAr ? 'نظام الأوسمة والإنجازات الشرعية' : 'Profile Achievements & Digital Badges'}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                {isAr 
                  ? 'أوسمة رقمية توثق صدق النية، حسن الخلق، والالتزام بالسنة النبوية. كل وسام تكتسبه يرفع ثقة الطرف الآخر والولي الشرعي ويمنح ملفك صدارة التوافق.'
                  : 'Digital badges reflecting moral integrity, religious commitment, and guardian respect on Meethaq.'}
              </p>
            </div>

            {/* Quick Badges Showcase Ring */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center text-center min-w-[200px] shrink-0">
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-3xl sm:text-4xl font-black font-display">{unlockedCount}</span>
                <span className="text-sm font-bold text-white/70">/ {totalCount}</span>
              </div>
              <span className="text-xs font-bold text-white/95 mt-1">
                {isAr ? 'أوسمة مكتسبة بنجاح' : 'Badges Earned'}
              </span>

              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="h-full bg-white transition-all duration-700 rounded-full"
                  style={{ width: `${Math.max(score, 5)}%` }}
                />
              </div>

              <button
                onClick={() => {
                  fireCelebrationConfetti();
                }}
                className="mt-3 text-[11px] font-bold text-white hover:text-amber-200 transition flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isAr ? 'الاحتفاء بإنجازاتي ✨' : 'Celebrate ✨'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mini Guidance Strip */}
        <div className="p-4 bg-[#faf7f3] border-b border-[#ede5dd] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#9b4c2e] shrink-0" />
            <span>
              {isAr 
                ? 'تظهر الأوسمة المكتسبة تلقائياً على بطاقة خطوبتك العلنية، وتمنحك أولوية في الترشيح الشرعي.'
                : 'Unlocked badges are displayed on your public profile card, enhancing your matchmaking priority.'}
            </span>
          </div>

          <button
            onClick={onEditProfile}
            className="text-[#9b4c2e] hover:text-[#853e24] font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>{isAr ? 'استكمال الأقسام الناقصة' : 'Complete missing sections'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#9b4c2e] text-white shadow-xs'
                  : 'bg-white border border-[#ede5dd] text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* 3. Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.isUnlocked;

          return (
            <div
              key={badge.id}
              onClick={() => {
                setSelectedBadge(badge);
                setIsModalOpen(true);
              }}
              className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                isUnlocked
                  ? 'bg-white border-emerald-200/80 hover:border-emerald-400 hover:shadow-md'
                  : 'bg-neutral-50/60 border-neutral-200 hover:border-neutral-300 hover:bg-white'
              }`}
            >
              {/* Top Row: Medal Icon & Status Pill */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div 
                    style={{ 
                      backgroundColor: isUnlocked ? badge.highlightColor : '#a8a29e' 
                    }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
                      isUnlocked ? 'ring-4 ring-emerald-50' : 'opacity-70'
                    }`}
                  >
                    {getBadgeIcon(badge.icon)}
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مكتسب' : 'Earned'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-neutral-200/80 text-neutral-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{badge.progressPercentage}%</span>
                    </span>
                  )}
                </div>

                {/* Badge Titles & Description */}
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 group-hover:text-[#9b4c2e] transition">
                    {isAr ? badge.nameAr : badge.nameEn}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-1">
                    {badge.titleAr}
                  </p>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                  {isAr ? badge.descriptionAr : badge.descriptionEn}
                </p>
              </div>

              {/* Bottom Progress or Reward */}
              <div className="pt-4 mt-4 border-t border-neutral-100 space-y-2">
                {!isUnlocked && (
                  <div className="space-y-1">
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-[#9b4c2e] rounded-full"
                        style={{ width: `${Math.max(badge.progressPercentage, 5)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 block font-medium">
                      {isAr ? 'اضغط لمعرفة معايير الاستحقاق' : 'Click to see requirements'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#9b4c2e] font-bold flex items-center gap-1 group-hover:underline">
                    <span>{isAr ? 'تفاصيل الوسام' : 'View Details'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>

                  {isUnlocked && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isAr ? 'مفعّل في ملفك' : 'Active on profile'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Public Profile Card Integration Notice */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#faf7f3] via-white to-[#f5ede4] border border-[#ede5dd] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-black text-base text-neutral-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#9b4c2e]" />
              {isAr ? 'كيف يشاهد الراغبون في الزواج أوسمتك؟' : 'How Suitors & Walis View Your Badges'}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
              {isAr 
                ? 'تعرض منصة ميثاق شارات الأوسمة المكتسبة على بطاقتك الشخصية في صفحة استعراض الملفات، مما يمنح الطرف الآخر طمأنينة شرعية كاملة قبل إرسال طلب الرؤية.'
                : 'Earned badges are prominently displayed on your matrimonial profile card, offering complete peace of mind to suitors and guardians.'}
            </p>
          </div>

          {onViewPublicProfile && (
            <button
              onClick={onViewPublicProfile}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              <Eye className="w-4 h-4" />
              <span>{isAr ? 'معاينة ملفي العام' : 'Preview Public Card'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Detailed Badge Modal */}
      <BadgeDetailsModal
        badge={selectedBadge}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBadge(null);
        }}
        lang={lang}
        onGoToProfileEdit={onEditProfile}
      />
    </div>
  );
};
