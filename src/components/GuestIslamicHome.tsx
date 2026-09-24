import React, { useState } from 'react';
import { Language } from '../types';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Users, 
  Heart, 
  BookOpen, 
  Sun,
  KeyRound,
  ChevronDown
} from 'lucide-react';
import { IslamicStar, IslamicArchOrnament } from './IslamicOrnaments';

interface GuestIslamicHomeProps {
  lang: Language;
  onRegisterClick: () => void;
  onLoginClick: () => void;
  onExploreClick?: () => void;
}

/**
 * Islamic Geometric SVG Pattern - Classical 8-fold Star Tessellation
 */
const IslamicGeometricPattern: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} 
    xmlns="http://www.w3.org/2000/svg" 
    width="100%" 
    height="100%"
  >
    <defs>
      <pattern id="islamic-star-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
        <g stroke="#9b4c2e" strokeWidth="0.75" fill="none" opacity="0.12">
          <rect x="25" y="25" width="30" height="30" />
          <rect x="25" y="25" width="30" height="30" transform="rotate(45 40 40)" />
          <line x1="0" y1="40" x2="25" y2="40" />
          <line x1="55" y1="40" x2="80" y2="40" />
          <line x1="40" y1="0" x2="40" y2="25" />
          <line x1="40" y1="55" x2="40" y2="80" />
          <line x1="0" y1="0" x2="25" y2="25" />
          <line x1="80" y1="0" x2="55" y2="25" />
          <line x1="0" y1="80" x2="25" y2="55" />
          <line x1="80" y1="80" x2="55" y2="55" />
          <circle cx="40" cy="40" r="2.5" fill="#9b4c2e" opacity="0.15" />
        </g>
      </pattern>
      
      <radialGradient id="sacred-glow" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#fbf3ea" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#faf8f5" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f7f3ee" stopOpacity="0.1" />
      </radialGradient>
    </defs>

    <rect width="100%" height="100%" fill="url(#sacred-glow)" />
    <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
  </svg>
);

export const GuestIslamicHome: React.FC<GuestIslamicHomeProps> = ({
  lang = 'ar',
  onRegisterClick,
  onLoginClick
}) => {
  const isAr = lang === 'ar';

  // Smooth scroll helper for sections
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`relative min-h-screen bg-[#faf8f5] text-neutral-900 overflow-hidden ${isAr ? 'font-cairo' : 'font-sans'} select-none`}
    >
      
      {/* 1. SACRED ISLAMIC BACKGROUND ARTWORK */}
      <IslamicGeometricPattern className="opacity-90" />

      {/* Atmospheric ambient lighting & decorative soft glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#e8d2c4]/30 via-[#edd9cc]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#c59b27]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -left-32 w-96 h-96 bg-[#9b4c2e]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* ======================================================== */}
        {/* 2. MAIN HERO SECTION (صرح الزواج المبارك - نقي وبدون صور)  */}
        {/* ======================================================== */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
          
          {/* Basmalah Inscription */}
          <div className="mb-6 flex flex-col items-center justify-center">
            {isAr ? (
              <span className="text-xl sm:text-2xl font-serif text-[#9b4c2e] tracking-wider leading-relaxed drop-shadow-2xs">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            ) : (
              <span className="text-sm sm:text-base font-serif italic text-[#9b4c2e] tracking-wide">
                In the Name of Allah, the Entirely Merciful, the Especially Merciful
              </span>
            )}
          </div>

          {/* Mihrab Vector Arch Silhouette */}
          <IslamicArchOrnament className="mb-4 text-[#9b4c2e]/40" />

          {/* Golden Quranic Verse (آية السكينة والمودة) */}
          <div className="relative my-6 p-6 sm:p-10 rounded-3xl bg-white/75 backdrop-blur-xs border border-[#ede5dd] shadow-sm max-w-4xl mx-auto">
            {/* Ornamental Corner Stars */}
            <div className="absolute top-3 start-3 text-[#9b4c2e]/40">
              <IslamicStar className="w-4 h-4" filled />
            </div>
            <div className="absolute top-3 end-3 text-[#9b4c2e]/40">
              <IslamicStar className="w-4 h-4" filled />
            </div>
            <div className="absolute bottom-3 start-3 text-[#9b4c2e]/40">
              <IslamicStar className="w-4 h-4" filled />
            </div>
            <div className="absolute bottom-3 end-3 text-[#9b4c2e]/40">
              <IslamicStar className="w-4 h-4" filled />
            </div>

            {isAr ? (
              <>
                <blockquote className="font-serif text-xl sm:text-3xl text-neutral-900 leading-loose sm:leading-loose font-bold tracking-normal px-2">
                  ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ ﴾
                </blockquote>
                <p className="text-xs sm:text-sm font-bold text-[#9b4c2e] mt-3 font-serif">
                  — سورة الروم [ الآية ٢١ ]
                </p>
              </>
            ) : (
              <>
                <blockquote className="font-serif text-lg sm:text-2xl text-neutral-900 leading-relaxed font-semibold px-4 italic">
                  “And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.”
                </blockquote>
                <p className="text-xs sm:text-sm font-bold text-[#9b4c2e] mt-3 font-sans">
                  — Surah Ar-Rum [ Verse 21 ]
                </p>
              </>
            )}
          </div>

          {/* Platform Essence & Sacred Mission */}
          <div className="max-w-3xl mx-auto space-y-4 my-8">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 leading-tight">
              {isAr ? 'بيتٌ يُبنى على تقوى من الله ورضوان' : 'Homes Built Upon Piety and Goodwill'}
            </h1>
            <p className="text-sm sm:text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto font-medium">
              {isAr 
                ? 'المنصة الشرعية الموثوقة لتيسير الزواج الإسلامي على هدي الكتاب والسنّة؛ حفظٌ للعفة وصونٌ لكرامة البيوت، برعاية الولي الشرعي ومباركة الأهل.'
                : 'The trusted Sharia sanctuary facilitating blessed Islamic marriage upon the guidance of the Quran and Sunnah — upholding modesty, family honor, and lawful guardian oversight.'}
            </p>
          </div>

          {/* DIGNIFIED CALL TO ACTION BUTTONS (بدون ابحث وبدون خلط للغات) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            
            {/* إنشاء حساب مبارك (Primary Action) */}
            <button
              id="guest-hero-register-btn"
              onClick={onRegisterClick}
              className="group px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-[#9b4c2e] hover:bg-[#833d23] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer"
            >
              <HeartHandshake className="w-5 h-5 text-amber-200 transition-transform group-hover:scale-110" />
              <span>{isAr ? 'ابدأ خطوتك بالحلال — إنشاء حساب مبارك' : 'Begin with Halal — Create Blessed Account'}</span>
            </button>

            {/* تسجيل الدخول (Secondary Action) */}
            <button
              id="guest-hero-login-btn"
              onClick={onLoginClick}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-[#fcfbfa] text-neutral-800 border border-[#c9b8aa] hover:border-[#9b4c2e] text-sm sm:text-base font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-neutral-500" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>

          </div>

          {/* Gentle link to how it works */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => scrollTo('sacred-pillars-section')}
              className="text-xs sm:text-sm text-neutral-600 hover:text-[#9b4c2e] font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{isAr ? 'تعرّف على أركان وضوابط الزواج الشرعي' : 'Explore the 4 Sacred Pillars & Guidelines'}</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-[#9b4c2e]" />
            </button>
          </div>

        </section>

        {/* ======================================================== */}
        {/* 3. THE 4 SACRED PILLARS OF ISLAMIC MATRIMONY             */}
        {/*    (أركان الميثاق المبارك - نصوص نقية وبدون صور)         */}
        {/* ======================================================== */}
        <section id="sacred-pillars-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
          <span id="sharia-pillars-section" className="absolute -top-24 opacity-0 pointer-events-none" />
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fdf6f0] border border-[#9b4c2e]/20 text-[#9b4c2e] text-xs font-bold">
              <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
              <span>{isAr ? 'أركان المصاهرة الراشدة' : 'The 4 Sacred Pillars'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {isAr ? 'عُقودٌ تُبرم بالصدق، وبيوتٌ تُشاد بالتقوى' : 'Covenants Sealed with Truth, Homes Built Upon Piety'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif italic">
              {isAr 
                ? 'أسس شرعية متينة تضمن السكينة، والكرامة المتبادلة، والقيم الإسلامية الراسخة'
                : 'Noble foundations ensuring tranquility, mutual honor, and enduring Islamic values'}
            </p>
          </div>

          {/* 4 Cards Grid - PURE TYPOGRAPHY & VECTOR ICONS (NO PHOTOS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1: السكينة والمودة */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xs border border-[#ede5dd] shadow-2xs space-y-4 hover:border-[#9b4c2e]/30 transition text-start">
              <div className="w-12 h-12 rounded-2xl bg-[#fdf6f0] text-[#9b4c2e] flex items-center justify-center font-bold shadow-xs">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                  {isAr ? 'السكينة والمودة' : 'Tranquility & Affection'}
                </h3>
                <p className="text-xs text-neutral-500 font-serif italic">
                  {isAr ? '﴿ هُنَّ لِبَاسٌ لَّكُمْ وَأَنتُمْ لِبَاسٌ لَّهُنَّ ﴾' : '“They are clothing for you and you are clothing for them.”'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'سكنٌ للنفس ومأوى للقلب؛ يجمع الزوجين على طاعة الله وحسن العشرة، والتغافل عن الهفوات والتكامل لبناء أسرة صالحة.'
                  : 'Mutual spiritual comfort and sincere affection, bringing husband and wife together in obedience to Allah and harmonious living.'}
              </p>
            </div>

            {/* Pillar 2: الميثاق الغليظ */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xs border border-[#ede5dd] shadow-2xs space-y-4 hover:border-[#9b4c2e]/30 transition text-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                  {isAr ? 'الميثاق الغليظ' : 'The Solemn Covenant'}
                </h3>
                <p className="text-xs text-neutral-500 font-serif italic">
                  {isAr ? '﴿ وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا ﴾' : '“And they have taken from you a solemn covenant.”'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'أمانة دينية كبرى وعهدٌ مقدس يُعقد على كلمة الله واستحلال الفروج بكلمته، أساسه إمساكٌ بمعروف أو تسريحٌ بإحسان.'
                  : 'A profound divine trust contracted in Allah’s name and according to His law; founded upon retaining honorably or releasing with kindness.'}
              </p>
            </div>

            {/* Pillar 3: العفة والستر التام */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xs border border-[#ede5dd] shadow-2xs space-y-4 hover:border-[#9b4c2e]/30 transition text-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                  {isAr ? 'العفة وستر البيوت' : 'Chastity & Discreet Privacy'}
                </h3>
                <p className="text-xs text-neutral-500 font-serif italic">
                  {isAr ? '﴿ قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ ﴾' : '“Tell the believing men to lower their gaze.”'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'صونٌ تام لكرامة الأخوات، وحجبٌ كامل لصور النساء عن التصفح العام؛ الرؤية الشرعية الواضحة حقٌ للخاطب الجاد برضا الولي فقط.'
                  : 'Complete protection of women’s dignity with zero public photo browsing. Lawful Sharia vision is granted only to serious suitors with guardian consent.'}
              </p>
            </div>

            {/* Pillar 4: رعاية الولي الشرعي ومباركة الأهل */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xs border border-[#ede5dd] shadow-2xs space-y-4 hover:border-[#9b4c2e]/30 transition text-start">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center font-bold shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                  {isAr ? 'رعاية الولي ومباركة الأهل' : 'Guardian Oversight & Family Blessing'}
                </h3>
                <p className="text-xs text-neutral-500 font-serif italic">
                  {isAr ? '«لَا نِكَاحَ إِلَّا بِوَلِيٍّ وَشَاهِدَيْ عَدْلٍ»' : '“There is no valid marriage without a Wali and two upright witnesses.”'}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'البيوت تُؤتى من أبوابها؛ حضور الولي الشرعي ركنٌ أساسي يضمن جدية الخاطب، ويوفر الحماية والمشاورة الطيبة للعروسين.'
                  : 'Entering homes through the front door under full guardian guidance, ensuring serious intentions and blessed approval.'}
              </p>
            </div>

          </div>

        </section>

        {/* ======================================================== */}
        {/* 4. PROPHETIC PEARLS & HADITHS (درر من مشكاة النبوة)      */}
        {/* ======================================================== */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#9b4c2e] via-[#853e24] to-[#71311b] text-white shadow-xl relative overflow-hidden text-center">
            
            <div className="absolute -top-10 -end-10 opacity-10 pointer-events-none text-white">
              <IslamicStar className="w-64 h-64" filled />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-bold">
                <Sun className="w-3.5 h-3.5 text-amber-200" />
                <span>{isAr ? 'هدي رسول الله ﷺ في المصاهرة المباركة' : 'The Prophetic Guidance in Blessed Marriage'}</span>
              </div>

              {/* Hadith 1 */}
              <div className="max-w-2xl mx-auto space-y-2">
                <p className="font-serif text-lg sm:text-2xl font-bold leading-relaxed text-amber-100">
                  {isAr 
                    ? '«إِذَا خَطَبَ إِلَيْكُمْ مَنْ تَرْضَوْنَ دِينَهُ وَخُلُقَهُ فَزَوِّجُوهُ، إِلَّا تَفْعَلُوا تَكُنْ فِتْنَةٌ فِي الأَرْضِ وَفَسَادٌ عَرِيضٌ»'
                    : '“When someone whose religion and character you are pleased with proposes to you, then marry him; if you do not, there will be tribulation on earth and immense corruption.”'}
                </p>
                <span className="text-[11px] text-white/70 block font-mono">
                  {isAr ? '— رواه الترمذي' : '— Sunan At-Tirmidhi'}
                </span>
              </div>

              <div className="w-24 h-[1px] bg-white/20 mx-auto" />

              {/* Hadith 2 */}
              <div className="max-w-2xl mx-auto space-y-1">
                <p className="font-serif text-base sm:text-xl font-bold leading-relaxed text-white">
                  {isAr 
                    ? '«أَعْظَمُ النِّكَاحِ بَرَكَةً أَيْسَرُهُ مَؤُونَةً»'
                    : '“The marriage that produces the most blessings is that which involves the least financial burden.”'}
                </p>
                <span className="text-[11px] text-white/70 block font-mono">
                  {isAr ? '— رواه الإمام أحمد' : '— Musnad Ahmad'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. THE 4 CLEAR STEPS (كيف تسير الخطوبة الشرعية)           */}
        {/* ======================================================== */}
        <section id="how-it-works-section" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {isAr ? 'كيف تسير رحلتك نحو الزواج المبارك؟' : 'How Your Journey Toward Blessed Marriage Unfolds'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-serif italic">
              {isAr ? 'أربع مراحل واضحة من صدق النية حتى عقد القران الشرعي' : 'Four structured steps honoring Islamic ethics from proposal to Nikah'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white border border-[#ede5dd] shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-[#fdf6f0] text-[#9b4c2e] font-bold text-xs flex items-center justify-center font-mono">
                01
              </div>
              <h3 className="font-bold text-sm text-neutral-900">
                {isAr ? 'صدق النية وإعداد السيرة' : 'Pure Intention & Profile Setup'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'تسجيل بيانات الاستقامة، الالتزام بالصلوات، والمواصفات المرغوبة بصدق وأمانة.'
                  : 'Register personal values, prayer habits, and righteous preferences with complete honesty.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white border border-[#ede5dd] shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center font-mono">
                02
              </div>
              <h3 className="font-bold text-sm text-neutral-900">
                {isAr ? 'التوافق الديني والخلقي' : 'Religious & Moral Compatibility'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'استعراض السير الموثقة وتحديد الكفاءة الدينية والاجتماعية بمعايير واضحة.'
                  : 'Explore verified profiles with clear criteria for deen, character, and compatibility.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white border border-[#ede5dd] shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center font-mono">
                03
              </div>
              <h3 className="font-bold text-sm text-neutral-900">
                {isAr ? 'إشعار الولي والتواصل المأمون' : 'Guardian Oversight & Direct Proposal'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'إرسال طلب خطوبة رسمي لولي الأمر مع كامل بيانات السيرة للمشاورة والموافقة.'
                  : 'Formal proposal delivered directly to the legal guardian for evaluation and family review.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white border border-[#ede5dd] shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-800 font-bold text-xs flex items-center justify-center font-mono">
                04
              </div>
              <h3 className="font-bold text-sm text-neutral-900">
                {isAr ? 'الرؤية الشرعية والميثاق المبارك' : 'Sharia Vision & Blessed Nikah'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isAr 
                  ? 'ترتيب مجلس الرؤية الشرعية بحضور الأهل تمهيداً لعقد القران المبارك.'
                  : 'Arranging a respectful vision meeting in the presence of family, leading to solemn Nikah.'}
              </p>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. SACRED TESTIMONIALS (قصص وشهادات مباركة - بدون صور)    */}
        {/* ======================================================== */}
        <section id="marriage-stories-section" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#9b4c2e] font-bold">
              <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
              <span>{isAr ? 'بيوتٌ تأسست على التقوى' : 'Families Built on Piety'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {isAr ? 'تجارب ومباركات واقعية' : 'Real Blessings & Experiences'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-serif italic">
              {isAr 
                ? 'شهادات حقيقية من أزواج وأولياء أمور أسسوا بيوتهم عبر منصة نكاح'
                : 'Heartfelt reflections from couples and guardians who built their homes through Nikah'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-start">
            
            {/* Story 1 */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#ede5dd] shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {'★'.repeat(5)}
                </div>
                <blockquote className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                  {isAr 
                    ? '«أعظم ما شدّني هو الاحترام البالغ لستر أختي، فما رأى الخاطب صورتها إلا بعد أن تواصل معنا كأولياء أمور وتحققنا من أمانته وصلاته. تم الزواج بحمد الله وتوفيقه.»'
                    : '“What impressed me most was the profound respect for my sister’s modesty. The suitor never saw her photo until he contacted us as guardians and verified his character. The marriage succeeded by Allah’s grace.”'}
                </blockquote>
              </div>
              <div className="border-t border-neutral-100 pt-3">
                <h4 className="text-xs font-bold text-neutral-900">
                  {isAr ? 'أبو عبد الله (ولي أمر)' : 'Abu Abdullah (Guardian)'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {isAr ? 'الرياض • زواج مبارك في رجب ١٤٤٦ هـ' : 'Riyadh • Blessed Marriage Rajab 1446 AH'}
                </p>
              </div>
            </div>

            {/* Story 2 */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#ede5dd] shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {'★'.repeat(5)}
                </div>
                <blockquote className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                  {isAr 
                    ? '«كنت أبحث عن زوجة حافظة لكتاب الله، متمسكة بالحجاب والهدوء الأسري، ووجدت الشفافية في البيانات والجدية الكاملة من أهلها. رزقنا الله المودة والرحمة.»'
                    : '“I was looking for a practicing wife who cherishes Quran and Islamic modesty. I found complete transparency and serious family engagement. Allah blessed our home with affection.”'}
                </blockquote>
              </div>
              <div className="border-t border-neutral-100 pt-3">
                <h4 className="text-xs font-bold text-neutral-900">
                  {isAr ? 'المهندس أنس والمهندسة ريم' : 'Eng. Anas & Eng. Reem'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {isAr ? 'عَمّان • زواج مبارك في شوال ١٤٤٦ هـ' : 'Amman • Blessed Marriage Shawwal 1446 AH'}
                </p>
              </div>
            </div>

            {/* Story 3 */}
            <div className="p-6 rounded-3xl bg-white/90 border border-[#ede5dd] shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {'★'.repeat(5)}
                </div>
                <blockquote className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                  {isAr 
                    ? '«ميزة التوثيق بالهوية الوطنية والتأكيد على المهر الميسر أزالت كل شكوكنا؛ خطوبة ميسرة وعقد قران شرعي أدخل الفرحة على العائلتين.»'
                    : '“Identity verification and emphasis on a reasonable, easy mahr removed all obstacles. A smooth engagement and blessed wedding brought joy to both families.”'}
                </blockquote>
              </div>
              <div className="border-t border-neutral-100 pt-3">
                <h4 className="text-xs font-bold text-neutral-900">
                  {isAr ? 'د. يوسف والأستاذة مريم' : 'Dr. Youssef & Maryam'}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {isAr ? 'القاهرة • زواج مبارك في ذو القعدة ١٤٤٦ هـ' : 'Cairo • Blessed Marriage Dhu al-Qadah 1446 AH'}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. CONCLUDING SUPPLICATION & FINAL INVITATION             */}
        {/*    (دعاء التوفيق والبدء بالحلال)                         */}
        {/* ======================================================== */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#fdf6f0] border border-[#ede5dd] shadow-sm space-y-5">
            
            <IslamicStar className="w-6 h-6 text-[#9b4c2e] mx-auto" filled />

            <div className="space-y-2">
              {isAr ? (
                <>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 leading-relaxed">
                    ﴿ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا ﴾
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">— سورة الفرقان [ الآية ٧٤ ]</p>
                </>
              ) : (
                <>
                  <p className="font-serif text-lg sm:text-xl font-bold text-neutral-900 leading-relaxed italic">
                    “Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous.”
                  </p>
                  <p className="text-[11px] text-neutral-500 font-sans">— Surah Al-Furqan [ Verse 74 ]</p>
                </>
              )}
            </div>

            <div className="w-20 h-[1px] bg-[#9b4c2e]/20 mx-auto" />

            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                {isAr ? 'انضم الآن لمنصة نكاح وابدأ مسيرتك بالحلال' : 'Join Nikah Today and Begin Your Halal Journey'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                {isAr ? 'تسجيلٌ مجاني وميسر، وخصوصيةٌ مصانة بإذن الله تعالى.' : 'Simple, verified, and completely respectful of your privacy.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onRegisterClick}
                className="px-8 py-3.5 rounded-2xl bg-[#9b4c2e] hover:bg-[#833d23] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
              >
                {isAr ? 'إنشاء حساب جديد' : 'Create New Account'}
              </button>
              <button
                onClick={onLoginClick}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 border border-[#c4b5a5] text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
