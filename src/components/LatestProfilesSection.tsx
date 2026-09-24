import React from 'react';
import { Profile, Language } from '../types';
import { Heart, MapPin, ArrowLeft } from 'lucide-react';
import { IslamicStar } from './IslamicOrnaments';

interface LatestProfilesSectionProps {
  profiles: Profile[];
  favorites: string[];
  lang: Language;
  onViewProfile: (profile: Profile) => void;
  onToggleFavorite: (profile: Profile) => void;
  onExploreAll: () => void;
  onStartJourney: () => void;
}

export const LatestProfilesSection: React.FC<LatestProfilesSectionProps> = ({
  profiles,
  favorites,
  lang,
  onViewProfile,
  onToggleFavorite,
  onExploreAll,
  onStartJourney
}) => {
  // Take top 4 profiles matching Ali, Sarah, Mohammad, Amal
  const top4Profiles = profiles.slice(0, 4);

  return (
    <section id="latest-profiles-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-cairo">
      
      {/* 1. Section Header matching screenshot: Title on right, "عرض الكل ←" on left */}
      <div className="flex items-center justify-between mb-6 pb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          أحدث الملفات
        </h2>
        <button
          id="view-all-profiles-link"
          onClick={onExploreAll}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:text-[#9b4c2e] transition group cursor-pointer"
        >
          <span>عرض الكل</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>

      {/* 2. Grid Container: Terracotta Banner Card (Right in RTL) + 4 Profile Cards (Left in RTL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* RIGHT COLUMN (In RTL: Terracotta Banner Card) */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="h-full rounded-3xl bg-gradient-to-br from-[#9b4c2e] via-[#8d4023] to-[#78341b] text-white p-6 sm:p-7 shadow-xs border border-[#8a3e23] flex flex-col justify-between relative overflow-hidden">
            
            {/* Subtle Islamic Arch & Lantern Watermark in Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <svg viewBox="0 0 200 300" className="w-full h-full text-white fill-current">
                {/* Horseshoe Arch */}
                <path d="M20,300 L20,120 C20,50 180,50 180,120 L180,300 Z" stroke="white" strokeWidth="2" fill="none" />
                {/* Hanging Lantern */}
                <line x1="100" y1="0" x2="100" y2="70" stroke="white" strokeWidth="2" />
                <polygon points="100,70 85,90 115,90" fill="white" />
                <rect x="88" y="90" width="24" height="30" fill="white" />
                <polygon points="100,135 88,120 112,120" fill="white" />
              </svg>
            </div>

            {/* Banner Content matching screenshot */}
            <div className="relative z-10 space-y-3 text-start">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  الزواج سنة ..
                </h3>
                <h4 className="text-base sm:text-lg font-bold text-white/95">
                  وابحث عن السعادة في الحلال
                </h4>
              </div>

              <p className="text-xs text-white/80 leading-relaxed pt-2">
                نحن هنا لمساعدتك في العثور على شريك حياة مناسب، بثقة وأمان، وبما يرضي الله.
              </p>
            </div>

            {/* Banner Button: ابدأ رحلتك الآن ← */}
            <div className="relative z-10 pt-6">
              <button
                id="banner-start-journey-btn"
                onClick={onStartJourney}
                className="w-full py-3 px-5 rounded-full bg-white hover:bg-white/90 text-[#9b4c2e] font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ابدأ رحلتك الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* LEFT COLUMN (In RTL: 4 Profile Cards Grid matching screenshot) */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {top4Profiles.map((profile) => {
            const isFav = favorites.includes(profile.id);

            return (
              <div
                key={profile.id}
                id={`featured-card-${profile.id}`}
                onClick={() => onViewProfile(profile)}
                className="group bg-white rounded-2xl border border-[#ede5dd] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Card Top: Portrait with Badges */}
                <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top-Right (In RTL): "متصل الآن" status indicator */}
                  <div className="absolute top-2.5 start-2.5 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-neutral-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs border border-black/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{profile.lastActive || 'متصل الآن'}</span>
                    </span>
                  </div>

                  {/* Top-Left (In RTL): Heart Favorite Icon Button */}
                  <div className="absolute top-2.5 end-2.5 z-10">
                    <button
                      id={`featured-fav-btn-${profile.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(profile);
                      }}
                      className={`w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow-xs flex items-center justify-center transition cursor-pointer ${
                        isFav ? 'text-rose-500' : 'text-neutral-400 hover:text-rose-500'
                      }`}
                      title="إضافة للمفضلة"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Bottom Body */}
                <div className="p-3.5 space-y-2 text-start flex-1 flex flex-col justify-between">
                  
                  <div className="space-y-1.5">
                    {/* Name & Age */}
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-base text-neutral-900 group-hover:text-[#9b4c2e] transition-colors">
                        {profile.fullName} {profile.age}
                      </h3>
                    </div>

                    {/* Location: 📍 الأردن - المدينة */}
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span>{profile.country} - {profile.city}</span>
                    </div>

                    {/* Profession & Brief Description */}
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed pt-0.5">
                      {profile.profession || profile.aboutMe}
                    </p>
                  </div>

                  {/* Tags (Soft peach/terracotta pill chips matching screenshot) */}
                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-neutral-100">
                    {(profile.tags && profile.tags.length > 0 
                      ? profile.tags 
                      : ['الاستقرار', 'الأسرة', 'الالتزام']
                    ).slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#f5ece4] text-[#9b4c2e] px-2 py-0.5 rounded-full text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Decorative Islamic Quote Ornament Bar matching screenshot */}
      <div className="mt-12 pt-6 border-t border-[#ede5dd] flex items-center justify-center gap-4 text-center select-none">
        
        {/* Right Flourish Ornament */}
        <svg viewBox="0 0 120 24" className="w-16 sm:w-28 h-6 text-[#9b4c2e]/40 fill-current shrink-0">
          <path d="M0,12 C30,12 50,2 80,12 C95,17 110,12 120,12 C110,12 95,7 80,12 C50,22 30,12 0,12 Z" />
          <circle cx="118" cy="12" r="2.5" />
          <circle cx="95" cy="8" r="1.5" />
          <circle cx="65" cy="15" r="1.5" />
        </svg>

        {/* Centered Verse / Quote */}
        <p className="text-xs sm:text-sm text-[#73432e] font-serif font-bold italic tracking-wide max-w-2xl px-2 leading-relaxed">
          « وَمَا مِن شَيءٍ أَخْفَيتَهُ مِن قَلبِكَ إِلَّا أَظهَرَهُ اللهُ لَكَ فِي وَقتِهِ المُناسِب »
        </p>

        {/* Left Flourish Ornament (Mirrored) */}
        <svg viewBox="0 0 120 24" className="w-16 sm:w-28 h-6 text-[#9b4c2e]/40 fill-current shrink-0 transform scale-x-[-1]">
          <path d="M0,12 C30,12 50,2 80,12 C95,17 110,12 120,12 C110,12 95,7 80,12 C50,22 30,12 0,12 Z" />
          <circle cx="118" cy="12" r="2.5" />
          <circle cx="95" cy="8" r="1.5" />
          <circle cx="65" cy="15" r="1.5" />
        </svg>

      </div>

    </section>
  );
};
