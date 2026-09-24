import React, { useState } from 'react';
import { Profile, Language } from '../../types';
import { computeProfileAchievements } from '../../utils/achievements';
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  HeartHandshake, 
  Users, 
  Compass, 
  Edit3, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Award,
  Crown,
  Medal
} from 'lucide-react';

interface ProfileCompletionProgressProps {
  profile?: Profile | null;
  lang?: Language;
  onEditProfile: () => void;
  onViewAchievements?: () => void;
  className?: string;
}

interface SectionItem {
  id: string;
  labelAr: string;
  labelEn: string;
  isComplete: boolean;
  hintAr: string;
}

interface ProfileSection {
  id: 'family' | 'religious' | 'marriage';
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  icon: React.ReactNode;
  color: string;
  items: SectionItem[];
}

export const ProfileCompletionProgress: React.FC<ProfileCompletionProgressProps> = ({
  profile,
  lang = 'ar',
  onEditProfile,
  onViewAchievements,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<'all' | 'family' | 'religious' | 'marriage'>('all');

  const isAr = lang === 'ar';
  const { badges, unlockedCount, totalCount } = computeProfileAchievements(profile);

  // Evaluate sections completeness
  const sections: ProfileSection[] = [
    {
      id: 'family',
      titleAr: 'الخلفية الأسرية ورعاية الولي',
      titleEn: 'Family Background & Wali',
      subtitleAr: 'بيانات العائلة، الولي الشرعي، ونمط الحياة الأسري',
      subtitleEn: 'Family values, legal guardian (Wali), and lifestyle',
      icon: <Users className="w-5 h-5 text-amber-700" />,
      color: 'amber',
      items: [
        {
          id: 'family_values',
          labelAr: 'القيم الأسرية وطبيعة البيت',
          labelEn: 'Family values & upbringing',
          isComplete: Boolean(profile?.familyValues && profile.familyValues.trim().length > 10),
          hintAr: 'اذكر طبيعة أسرتك وتنشئتك وترابطك الأسري'
        },
        ...(profile?.gender === 'female' ? [{
          id: 'wali_info',
          labelAr: 'بيانات الولي الشرعي وصلة القرابة',
          labelEn: 'Wali details and relation',
          isComplete: Boolean(profile?.wali?.name && profile.wali.relation && profile.wali.phone),
          hintAr: 'اسم ورقم وصلة قرابة الولي للتواصل الشرعي'
        }] : []),
        {
          id: 'location',
          labelAr: 'الإقامة وبلد النشأة والنسب',
          labelEn: 'Country, city, and nationality',
          isComplete: Boolean(profile?.city && profile?.country && profile?.nationality),
          hintAr: 'تحديد المدينة والدولة بدقة'
        },
        {
          id: 'children_preference',
          labelAr: 'الموقف من الإنجاب والأطفال',
          labelEn: 'Views on having children',
          isComplete: Boolean(profile?.wantsChildren || profile?.hasChildren !== undefined),
          hintAr: 'تحديد الرغبة في الأبناء ورعاية الذرية'
        }
      ]
    },
    {
      id: 'religious',
      titleAr: 'الالتزام الديني والسمت الشرعي',
      titleEn: 'Religious Practices & Conduct',
      subtitleAr: 'المحافظة على الصلاة، القرآن، والهيئة الشرعية',
      subtitleEn: 'Prayer habits, Quran memorization, and Islamic attire',
      icon: <Compass className="w-5 h-5 text-emerald-700" />,
      color: 'emerald',
      items: [
        {
          id: 'prayer',
          labelAr: 'المحافظة على الصلاة في وقتها/المسجد',
          labelEn: 'Prayer consistency',
          isComplete: Boolean(profile?.prayerHabit),
          hintAr: 'المحافظة التامة في المسجد أو في وقتها'
        },
        {
          id: 'quran',
          labelAr: 'حفظ القرآن الكريم وتلاوته',
          labelEn: 'Quran memorization & study',
          isComplete: Boolean(profile?.quranMemorization && profile.quranMemorization.trim().length > 2),
          hintAr: 'مقدار الحفظ والورد القرآني اليومي'
        },
        {
          id: 'attire',
          labelAr: 'السمت والهيئة الشرعية (الحجاب/اللحية)',
          labelEn: 'Modest attire & Islamic appearance',
          isComplete: Boolean(profile?.religiousAttire && profile.religiousAttire.trim().length > 2),
          hintAr: 'اللباس الشرعي والوقار النبوي'
        },
        {
          id: 'interests',
          labelAr: 'الاهتمامات والأنشطة الإسلامية',
          labelEn: 'Islamic interests & pursuits',
          isComplete: Boolean(profile?.islamicInterests && profile.islamicInterests.length > 0),
          hintAr: 'حضور مجالس العلم والعمل الخيري'
        }
      ]
    },
    {
      id: 'marriage',
      titleAr: 'شروط ومتطلبات الزواج الشرعي',
      titleEn: 'Marriage Requirements & Vision',
      subtitleAr: 'شروط شريك الحياة، تيسير المهر، والإطار الزمني',
      subtitleEn: 'Partner expectations, mahr views, and timeline',
      icon: <HeartHandshake className="w-5 h-5 text-[#9b4c2e]" />,
      color: 'rose',
      items: [
        {
          id: 'partner_expectations',
          labelAr: 'مواصفات وشروط شريك الحياة المنشود',
          labelEn: 'Partner criteria and expectations',
          isComplete: Boolean(profile?.partnerExpectations && profile.partnerExpectations.trim().length > 15),
          hintAr: 'الصفات الدينية والخلقية المشترطة في الطرف الآخر'
        },
        {
          id: 'about_me',
          labelAr: 'النبذة التعريفية الشخصية الصادقة',
          labelEn: 'Personal biography and values',
          isComplete: Boolean(profile?.aboutMe && profile.aboutMe.trim().length > 20),
          hintAr: 'تعريف وافٍ عن شخصيتك وأولوياتك'
        },
        {
          id: 'mahr_expectation',
          labelAr: 'رؤية وتيسير المهر الشرعي',
          labelEn: 'Mahr (dowry) perspective',
          isComplete: Boolean(profile?.mahrExpectation && profile.mahrExpectation.trim().length > 2),
          hintAr: 'تيسير المهر اقتداءً بالسنة النبوية'
        },
        {
          id: 'timeline',
          labelAr: 'الإطار الزمني المرغوب للزواج',
          labelEn: 'Desired marriage timeline',
          isComplete: Boolean(profile?.marriageTimeline),
          hintAr: 'خلال 3 أشهر أو 6 أشهر أو عاجل'
        }
      ]
    }
  ];

  // Calculate totals
  const allItems = sections.flatMap(s => s.items);
  const completedItems = allItems.filter(i => i.isComplete);
  const completionPercentage = Math.round((completedItems.length / allItems.length) * 100);

  // Section specific percentages
  const getSectionStats = (section: ProfileSection) => {
    const total = section.items.length;
    const completed = section.items.filter(i => i.isComplete).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  const getBadgeInfo = () => {
    if (completionPercentage >= 90) {
      return {
        label: isAr ? 'سيرة متكاملة ومباركة ✨' : 'Complete & Verified Profile ✨',
        desc: isAr ? 'ملفك يحظى بأعلى أولوية في التوافق الشرعي وبرعاية كاملة' : 'Your profile has highest priority in Islamic matchmaking',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        barColor: 'from-emerald-600 to-teal-500'
      };
    }
    if (completionPercentage >= 60) {
      return {
        label: isAr ? 'سيرة جيدة وقيد الاكتمال 🌿' : 'Good Profile - Almost Ready 🌿',
        desc: isAr ? 'استكمل باقي الأقسام الشرعية لرفع ثقة أولياء الأمور' : 'Complete remaining sections to increase Wali and candidate trust',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        barColor: 'from-amber-500 to-[#9b4c2e]'
      };
    }
    return {
      label: isAr ? 'بحاجة لاستكمال البيانات ⏳' : 'Incomplete Profile ⏳',
      desc: isAr ? 'اكتمال السيرة شرط أساسي لإرسال واستقبال طلبات الخطوبة' : 'Completing your profile is required for Khitbah proposals',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      barColor: 'from-rose-500 to-[#9b4c2e]'
    };
  };

  const badge = getBadgeInfo();
  const missingCount = allItems.length - completedItems.length;

  return (
    <div className={`bg-white rounded-2xl border border-[#ede5dd] shadow-2xs overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#faf7f3] via-white to-[#f5eee7] border-b border-[#ede5dd]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 text-start">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[#9b4c2e] font-bold text-xs">
                <TrendingUp className="w-4 h-4" />
                {isAr ? 'مؤشر اكتمال السيرة الشرعية' : 'Profile Completion Progress'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.badgeBg}`}>
                {badge.label}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-display text-neutral-900">
              {isAr ? 'نسبة اكتمال ملفك الشرعي:' : 'Your Profile Completeness:'}
              <span className="ms-2 text-[#9b4c2e] font-extrabold">{completionPercentage}%</span>
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
              {badge.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onEditProfile}
              className="flex items-center gap-1.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isAr ? 'استكمال وتحديث البيانات' : 'Update Profile'}</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              title={isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
            >
              <span>{isExpanded ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'عرض التفاصيل' : 'Details')}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="w-full bg-neutral-200/80 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${badge.barColor} transition-all duration-700 ease-out`}
              style={{ width: `${Math.max(completionPercentage, 5)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 px-1">
            <span>{isAr ? `المكتمل: ${completedItems.length} من أصل ${allItems.length} بنداً شرعياً` : `${completedItems.length} of ${allItems.length} items complete`}</span>
            {missingCount > 0 ? (
              <span className="text-[#9b4c2e] font-bold">
                {isAr ? `متبقٍ ${missingCount} متطلبات لتصل إلى 100%` : `${missingCount} requirements remaining`}
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isAr ? 'مبارك! سيرتك مكتملة بالكامل' : 'Profile 100% complete'}
              </span>
            )}
          </div>
        </div>

        {/* 3 Core Section Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {sections.map((section) => {
            const stats = getSectionStats(section);
            const isFinished = stats.completed === stats.total;

            return (
              <div 
                key={section.id}
                onClick={() => {
                  setActiveSectionId(activeSectionId === section.id ? 'all' : section.id);
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-start ${
                  activeSectionId === section.id
                    ? 'border-[#9b4c2e] bg-white ring-1 ring-[#9b4c2e] shadow-xs'
                    : 'border-[#ede5dd] bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-neutral-50 border border-neutral-100">
                      {section.icon}
                    </div>
                    <span className="font-bold text-xs text-neutral-900 line-clamp-1">
                      {isAr ? section.titleAr : section.titleEn}
                    </span>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    isFinished 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {stats.percentage}%
                  </span>
                </div>

                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFinished ? 'bg-emerald-600' : 'bg-[#9b4c2e]'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1.5 font-medium">
                  <span>{stats.completed}/{stats.total} {isAr ? 'مكتمل' : 'done'}</span>
                  <span className="text-[#9b4c2e] hover:underline font-bold">
                    {isAr ? 'التفاصيل ←' : 'Details →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Digital Badges & Achievements Ribbon */}
        <div className="mt-4 p-3.5 rounded-xl bg-white border border-[#ede5dd] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-neutral-900">
                  {isAr ? 'الأوسمة الرقمية المكتسبة:' : 'Profile Achievements:'}
                </span>
                <span className="text-xs font-black text-[#9b4c2e]">
                  {unlockedCount} {isAr ? `من أصل ${totalCount}` : `of ${totalCount}`}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 block">
                {isAr ? 'تعزز مصداقية ملفك وتزيد ثقة أولياء الأمور والراغبين في الحلال' : 'Boosts your profile credibility and Wali confidence'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Unlocked Badges Icons */}
            <div className="flex items-center -space-x-1.5 space-x-reverse overflow-hidden">
              {badges.filter(b => b.isUnlocked).slice(0, 4).map(b => (
                <div
                  key={b.id}
                  style={{ backgroundColor: b.highlightColor }}
                  title={isAr ? b.nameAr : b.nameEn}
                  className="w-6 h-6 rounded-full text-white text-[10px] flex items-center justify-center border-2 border-white shadow-2xs font-bold"
                >
                  ✓
                </div>
              ))}
            </div>

            {onViewAchievements && (
              <button
                type="button"
                onClick={onViewAchievements}
                className="px-3 py-1.5 rounded-lg bg-[#9b4c2e]/10 hover:bg-[#9b4c2e]/20 text-[#9b4c2e] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isAr ? 'استعراض كافة الأوسمة ←' : 'View all badges →'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {isExpanded && (
        <div className="p-5 sm:p-6 bg-white space-y-6 border-t border-[#ede5dd] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div>
              <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9b4c2e]" />
                {isAr ? 'تفصيل البنود والمتطلبات الشرعية' : 'Detailed Islamic Profile Checklist'}
              </h4>
              <p className="text-xs text-neutral-500">
                {isAr 
                  ? 'اضغط على أي بند ناقص لاستكماله مباشرة وزيادة فرص التوافق الصادق'
                  : 'Click on any missing item to complete it immediately'}
              </p>
            </div>

            {/* Filter tabs inside drawer */}
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveSectionId('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeSectionId === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {isAr ? 'جميع الأقسام' : 'All Sections'}
              </button>
              <button
                onClick={() => setActiveSectionId('family')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeSectionId === 'family' ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {isAr ? 'الخلفية الأسرية' : 'Family'}
              </button>
              <button
                onClick={() => setActiveSectionId('religious')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeSectionId === 'religious' ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {isAr ? 'الالتزام الديني' : 'Religious'}
              </button>
              <button
                onClick={() => setActiveSectionId('marriage')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeSectionId === 'marriage' ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {isAr ? 'شروط الزواج' : 'Marriage'}
              </button>
            </div>
          </div>

          {/* Section Items Listing */}
          <div className="space-y-6">
            {sections
              .filter(s => activeSectionId === 'all' || s.id === activeSectionId)
              .map(section => {
                const stats = getSectionStats(section);

                return (
                  <div key={section.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-neutral-100">
                          {section.icon}
                        </div>
                        <h5 className="font-bold text-sm text-neutral-900">
                          {isAr ? section.titleAr : section.titleEn}
                        </h5>
                      </div>
                      <span className="text-xs text-neutral-500 font-semibold">
                        {stats.completed} / {stats.total} {isAr ? 'مكتمل' : 'completed'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.items.map(item => (
                        <div
                          key={item.id}
                          onClick={onEditProfile}
                          className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition cursor-pointer ${
                            item.isComplete
                              ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50'
                              : 'bg-amber-50/30 border-amber-200 hover:bg-amber-50/60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 text-start">
                            {item.isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className={`block font-bold text-xs ${
                                item.isComplete ? 'text-emerald-950' : 'text-neutral-900'
                              }`}>
                                {isAr ? item.labelAr : item.labelEn}
                              </span>
                              <span className="text-[11px] text-neutral-500 block mt-0.5">
                                {item.hintAr}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 pt-0.5">
                            {item.isComplete ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                {isAr ? 'مكتمل' : 'Done'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-[#9b4c2e] bg-[#9b4c2e]/10 px-2 py-0.5 rounded-full hover:bg-[#9b4c2e]/20">
                                {isAr ? 'إكمال الآن' : 'Fill now'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Prophetic guidance card on profile honesty */}
          <div className="p-4 rounded-xl bg-[#fbf6f0] border border-[#ede5dd] flex items-start gap-3 text-start">
            <ShieldCheck className="w-5 h-5 text-[#9b4c2e] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs text-neutral-900 block">
                {isAr ? 'الضابط الشرعي والأمانة في بيانات السيرة:' : 'Islamic Guidelines for Matrimonial Profiles:'}
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {isAr 
                  ? '«الْبَيِّعَانِ بِالْخِيَارِ مَا لَمْ يَتَفَرَّقَا، فَإِنْ صَدَقَا وَبَيَّنَا بُورِكَ لَهُمَا فِي بَيْعِهِمَا، وَإِنْ كَتَمَا وَكَذَبَا مُحِقَتْ بَرَكَةُ بَيْعِهِمَا» — النكاح ميثاق غليظ والصدق في بيانات الأهل والتدين والشروط أساس البركة والمودة الدائمة.'
                  : 'Honesty and transparency in family, religious practice, and expectations are the bedrock of a blessed Islamic marriage.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
