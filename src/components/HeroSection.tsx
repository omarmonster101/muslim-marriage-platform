import React, { useState, useRef, useEffect } from 'react';
import { Language, ManagedCountry } from '../types';
import { translations } from '../data/translations';
import { 
  Search, 
  ShieldCheck, 
  Lock, 
  Heart, 
  MapPin, 
  User, 
  ChevronDown, 
  Star, 
  FileCheck2, 
  ShieldAlert,
  ArrowLeft,
  Camera,
  Upload,
  RotateCcw
} from 'lucide-react';
import { IslamicStar } from './IslamicOrnaments';

interface HeroSectionProps {
  lang: Language;
  onExploreClick: () => void;
  onWaliClick: () => void;
  onRegisterClick?: () => void;
  onLoginClick?: () => void;
  onApiClick?: () => void;
  isAdmin?: boolean;
  stats: {
    activeSeekers: number;
    verifiedWalis: number;
    successfulNikahs: number;
    shariaCommitmentRate: string;
  };
  onSearchSubmit?: (filters: {
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    country?: string;
    city?: string;
  }) => void;
  availableCountries?: ManagedCountry[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExploreClick,
  onWaliClick,
  onRegisterClick,
  onLoginClick,
  onApiClick,
  isAdmin = false,
  stats,
  onSearchSubmit,
  availableCountries
}) => {
  const t = translations[lang] || translations.ar;

  // Search states matching the screenshot form
  const [seekingGender, setSeekingGender] = useState<string>('female'); // "زوجة" or "زوج"
  const [ageFrom, setAgeFrom] = useState<number>(25);
  const [ageTo, setAgeTo] = useState<number>(35);
  const [country, setCountry] = useState<string>('JO');

  // Custom hero image state with localStorage support and automatic asset detection
  const [customHeroImage, setCustomHeroImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('nikah_custom_hero_image') || null;
    } catch {
      return null;
    }
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user uploaded a hero image file into public/
  useEffect(() => {
    if (!customHeroImage) {
      const candidates = ['/hero.png', '/image.png', '/hero-couple.png', '/assets/hero.png'];
      let found = false;

      const tryNext = (index: number) => {
        if (index >= candidates.length || found) return;
        const img = new Image();
        img.src = candidates[index];
        img.onload = () => {
          if (!found) {
            found = true;
            setCustomHeroImage(candidates[index]);
          }
        };
        img.onerror = () => {
          tryNext(index + 1);
        };
      };

      tryNext(0);
    }
  }, [customHeroImage]);

  const handleImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setCustomHeroImage(result);
          try {
            localStorage.setItem('nikah_custom_hero_image', result);
          } catch (err) {
            console.warn('Unable to persist hero image to localStorage:', err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleResetHeroImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomHeroImage(null);
    try {
      localStorage.removeItem('nikah_custom_hero_image');
    } catch {
      // ignore
    }
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit({
        gender: seekingGender,
        ageMin: ageFrom,
        ageMax: ageTo,
        country: country
      });
    } else {
      onExploreClick();
    }
  };

  return (
    <div className="w-full font-cairo select-none">
      {/* 1. Split Hero Section with Background Photography & Couple Visual */}
      <section className="relative w-full overflow-hidden bg-[#faf8f5] border-b border-[#ede5dd]">
        
        {/* Background Panoramic Skyline & Atmospheric Warm Sunset Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Panoramic sunset city image */}
          <img 
            src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1800&auto=format&fit=crop&q=85" 
            alt="Islamic City at Sunset" 
            className="w-full h-full object-cover object-center opacity-35 filter saturate-[1.1] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle warm gradient wash matching the screenshot */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#faf8f5] via-[#faf8f5]/90 to-[#faf8f5]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-transparent to-transparent" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* RIGHT COLUMN (In RTL: Text, Headline, Search Card, Trust Badges) */}
            <div className="lg:col-span-7 space-y-6 text-start z-10">
              
              {/* Main Headline matching the screenshot */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-neutral-900 leading-[1.2] tracking-tight">
                  لنجد شريك حياتك
                </h1>
                <div className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold">
                  <span className="text-neutral-900">في طريق </span>
                  <span className="text-[#9b4c2e] font-serif italic text-4xl sm:text-6xl font-black inline-block px-1">
                    الحلال
                  </span>
                </div>
              </div>

              {/* Subtitle matching screenshot */}
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-xl">
                منصة إسلامية آمنة تجمع بين القلوب الطيبة،<br className="hidden sm:inline" />
                لتبدأ رحلة الحياة الزوجية على أسس من الإيمان والاحترام.
              </p>

              {/* Floating Search Bar (Card with 5 inline fields matching screenshot) */}
              <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-[#ede5dd] max-w-2xl">
                <form onSubmit={handleSearchClick}>
                  <div className="grid grid-cols-2 sm:grid-cols-12 gap-3 items-center">
                    
                    {/* Field 1: أبحث عن (زوجة / زوج) */}
                    <div className="col-span-2 sm:col-span-3 space-y-1 text-start">
                      <label className="text-[11px] font-semibold text-neutral-500 block px-1">
                        أبحث عن
                      </label>
                      <div className="relative">
                        <select
                          value={seekingGender}
                          onChange={(e) => setSeekingGender(e.target.value)}
                          className="w-full h-11 px-3 ps-8 rounded-2xl border border-neutral-200 bg-neutral-50/70 text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#9b4c2e] focus:bg-white transition appearance-none cursor-pointer"
                        >
                          <option value="female">زوجة</option>
                          <option value="male">زوج</option>
                        </select>
                        <User className="w-3.5 h-3.5 text-neutral-400 absolute start-2.5 top-3.5 pointer-events-none" />
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute end-2.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Field 2: العمر من */}
                    <div className="col-span-1 sm:col-span-2 space-y-1 text-start">
                      <label className="text-[11px] font-semibold text-neutral-500 block px-1">
                        العمر من
                      </label>
                      <div className="relative">
                        <select
                          value={ageFrom}
                          onChange={(e) => setAgeFrom(Number(e.target.value))}
                          className="w-full h-11 px-2.5 pe-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#9b4c2e] focus:bg-white transition appearance-none cursor-pointer text-center"
                        >
                          {[18, 20, 22, 25, 28, 30, 35, 40].map((age) => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-neutral-400 absolute end-2 top-4 pointer-events-none" />
                      </div>
                    </div>

                    {/* Field 3: إلى */}
                    <div className="col-span-1 sm:col-span-2 space-y-1 text-start">
                      <label className="text-[11px] font-semibold text-neutral-500 block px-1">
                        إلى
                      </label>
                      <div className="relative">
                        <select
                          value={ageTo}
                          onChange={(e) => setAgeTo(Number(e.target.value))}
                          className="w-full h-11 px-2.5 pe-6 rounded-2xl border border-neutral-200 bg-neutral-50/70 text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#9b4c2e] focus:bg-white transition appearance-none cursor-pointer text-center"
                        >
                          {[25, 28, 30, 32, 35, 38, 40, 45, 50].map((age) => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-neutral-400 absolute end-2 top-4 pointer-events-none" />
                      </div>
                    </div>

                    {/* Field 4: البلد */}
                    <div className="col-span-2 sm:col-span-3 space-y-1 text-start">
                      <label className="text-[11px] font-semibold text-neutral-500 block px-1">
                        البلد
                      </label>
                      <div className="relative">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full h-11 px-3 ps-8 rounded-2xl border border-neutral-200 bg-neutral-50/70 text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#9b4c2e] focus:bg-white transition appearance-none cursor-pointer"
                        >
                          <option value="all">كل الدول</option>
                          {availableCountries && availableCountries.length > 0 ? (
                            availableCountries.filter(c => c.isEnabled).map(c => (
                              <option key={c.id} value={c.id}>
                                {c.flag} {lang === 'ar' ? c.nameAr : c.nameEn}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="SA">🇸🇦 السعودية</option>
                              <option value="JO">🇯🇴 الأردن</option>
                              <option value="EG">🇪🇬 مصر</option>
                              <option value="AE">🇦🇪 الإمارات</option>
                              <option value="QA">🇶🇦 قطر</option>
                              <option value="KW">🇰🇼 الكويت</option>
                              <option value="OM">🇴🇲 عُمان</option>
                            </>
                          )}
                        </select>
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute start-2.5 top-3.5 pointer-events-none" />
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute end-2.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Field 5: زر ابحث الآن */}
                    <div className="col-span-2 sm:col-span-2 pt-2 sm:pt-4">
                      <button
                        type="submit"
                        id="hero-search-btn"
                        className="w-full h-11 rounded-2xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                      >
                        <Search className="w-4 h-4" />
                        <span>ابحث الآن</span>
                      </button>
                    </div>

                  </div>
                </form>
              </div>

              {/* 3 Reassurance Badges below Search Card */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2 text-xs sm:text-sm font-medium text-neutral-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9b4c2e]" />
                  <span>مؤكد ومدقق</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#9b4c2e]" />
                  <span>خصوصية تامة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#9b4c2e]" />
                  <span>توافق مبني على القيم</span>
                </div>
              </div>

            </div>

            {/* LEFT COLUMN (In RTL: Couple Sitting on Terrace Overlooking Minarets + Quranic Calligraphy) */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px]">
              
              {/* Hidden File Input for uploading custom hero image */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden" 
                id="hero-image-file-input"
              />

              {/* Couple and Sunset View Composition matching uploaded image */}
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`group relative w-full h-[360px] sm:h-[430px] rounded-3xl overflow-hidden shadow-lg border transition-all duration-300 ${
                  isDragging 
                    ? 'border-[#9b4c2e] ring-4 ring-[#9b4c2e]/20 scale-[1.01]' 
                    : 'border-[#ede5dd] hover:border-[#9b4c2e]/40'
                }`}
              >
                {/* Upload & Reset Controls Overlay (visible on hover or mobile tap) */}
                <div className="absolute top-3 end-3 z-30 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="تغيير الصورة أو رفع صورتك الخاصة"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold shadow-md transition cursor-pointer border border-white/20"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>تغيير الصورة</span>
                  </button>

                  {customHeroImage && (
                    <button
                      type="button"
                      onClick={handleResetHeroImage}
                      title="استعادة المظهر التلقائي"
                      className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white shadow-md transition cursor-pointer border border-white/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Drag & Drop Indicator when dragging over */}
                {isDragging && (
                  <div className="absolute inset-0 z-40 bg-[#9b4c2e]/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                    <Upload className="w-12 h-12 mb-2 animate-bounce" />
                    <p className="text-base font-bold">أفلت صورتك هنا ليتم وضعها مباشرة</p>
                    <p className="text-xs text-white/80 mt-1">يدعم PNG و JPG و WebP</p>
                  </div>
                )}

                {/* CASE 1: User uploaded or selected a custom image */}
                {customHeroImage ? (
                  <div className="relative w-full h-full bg-[#3a1d12]">
                    <img 
                      src={customHeroImage} 
                      alt="وخلقناكم أزواجا - نكاح" 
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  /* CASE 2: High-fidelity default visual recreating the exact uploaded image composition */
                  <div className="relative w-full h-full bg-[#f4ebe1] overflow-hidden">
                    
                    {/* 1. Real Mediterranean Ancient City Skyline & Sunset Sky Background */}
                    <img 
                      src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&auto=format&fit=crop&q=85" 
                      alt="Panoramic Old City at Sunset"
                      className="absolute inset-0 w-full h-full object-cover object-[center_35%] filter saturate-[1.25] brightness-[1.03] contrast-[1.05]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Warm Sunset Atmospheric Haze & Golden Hour Sun Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6a2d17]/80 via-amber-900/20 to-amber-50/40 pointer-events-none" />
                    <div className="absolute top-0 start-0 w-full h-full bg-radial from-amber-100/70 via-transparent to-transparent opacity-85 pointer-events-none" />

                    {/* 2. Top-Left Quranic Calligraphy Plaque directly over the sunset sky matching image.png */}
                    <div className="absolute top-5 start-5 z-20 select-none text-start pointer-events-none">
                      <div className="font-amiri text-2xl sm:text-3xl font-extrabold tracking-wide leading-tight text-[#4e2213] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                        وَخَلَقْنَاكُم
                      </div>
                      <div className="font-amiri text-3xl sm:text-4xl font-black tracking-wide leading-tight text-[#4e2213] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                        أَزْوَاجًا
                      </div>
                      
                      {/* Diamond flourish matching the uploaded design */}
                      <div className="flex items-center gap-2 my-1.5 opacity-90">
                        <div className="w-7 sm:w-9 h-[1.5px] bg-[#6e3720]" />
                        <div className="w-2 h-2 rotate-45 border border-[#6e3720] bg-amber-100" />
                        <div className="w-7 sm:w-9 h-[1.5px] bg-[#6e3720]" />
                      </div>

                      <div className="text-[11px] sm:text-xs font-semibold text-[#5c2b18] tracking-normal font-cairo drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                        سورة النحل - الآية 72
                      </div>
                    </div>

                    {/* 3. Weathered Ancient Sandstone Parapet Wall */}
                    <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-[#8f5539] to-[#6e361f] border-t-3 border-[#ab6847] shadow-2xl">
                      {/* Stone texture joint lines */}
                      <div className="absolute inset-x-0 top-0 h-3 bg-[#a86546]/40" />
                      <div className="absolute start-1/4 top-3 bottom-0 w-[1.5px] bg-[#532615] opacity-50" />
                      <div className="absolute end-1/3 top-3 bottom-0 w-[1.5px] bg-[#532615] opacity-50" />
                    </div>

                    {/* 4. Muslim Couple Sitting Side-by-Side Seen From Behind */}
                    <div className="absolute bottom-4 inset-x-0 flex items-end justify-center gap-2 sm:gap-3 z-10 pointer-events-none">
                      
                      {/* The Groom / Man (Left) */}
                      <div className="flex flex-col items-center">
                        {/* Authentic Knitted White Islamic Kufi (Taqiyah) with Geometric Pattern */}
                        <div className="w-16 h-10 bg-white rounded-t-full border border-neutral-300 shadow-md relative overflow-hidden">
                          {/* Knitted stitch texture */}
                          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#9b4c2e_1px,transparent_1px)] [background-size:4px_4px]" />
                          <div className="absolute inset-x-1 bottom-1.5 h-1 border-b border-dashed border-neutral-400 opacity-60" />
                        </div>
                        {/* Head & Neck */}
                        <div className="w-13 h-7 bg-[#cba17e] rounded-b-md shadow-inner" />
                        {/* Beige Linen Shirt with Collar & Natural Shoulder Seams */}
                        <div className="w-36 sm:w-40 h-36 bg-[#f3ece0] rounded-t-[2.5rem] border border-[#d9ccba] shadow-lg relative overflow-hidden">
                          {/* Center back seam & subtle fabric folds */}
                          <div className="absolute inset-x-0 top-3 flex justify-center">
                            <div className="w-[1.5px] h-24 bg-neutral-300/80" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/30" />
                        </div>
                      </div>

                      {/* The Bride / Woman (Right) - Leaning Lovingly Towards the Man */}
                      <div className="flex flex-col items-center -ms-5">
                        {/* Terracotta Rust Hijab Head Wrap */}
                        <div className="w-18 h-15 bg-[#9c4b2c] rounded-t-full shadow-lg relative overflow-hidden">
                          {/* Soft 3D lighting gradient over the hijab */}
                          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-amber-200/25" />
                          <div className="absolute bottom-1 inset-x-2 h-2 border-b border-[#7d391f] opacity-50" />
                        </div>
                        {/* Gracefully Draped Abaya & Hijab Folds */}
                        <div className="w-40 sm:w-44 h-40 bg-[#8c3f24] rounded-t-[3rem] shadow-xl relative overflow-hidden">
                          {/* Fabric fold shadows in terracotta */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#5a2412] via-transparent to-white/10" />
                          <div className="absolute inset-y-0 start-8 w-5 bg-[#6e2f18] opacity-50 transform -rotate-8" />
                          <div className="absolute inset-y-0 end-9 w-6 bg-[#6e2f18] opacity-50 transform rotate-8" />
                        </div>
                      </div>

                    </div>

                    {/* Overall sunset warm illumination highlight */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-amber-100/15 pointer-events-none" />

                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. Four Feature Value Columns (Directly beneath Hero with vertical dividing lines) */}
      <section className="w-full bg-[#faf8f5] border-b border-[#ede5dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#ede5dd]">
            
            {/* Column 1: مجتمع ملتزم (Star Icon) */}
            <div className="px-4 py-4 sm:py-2 flex items-start gap-3.5 text-start">
              <div className="w-11 h-11 rounded-2xl bg-[#f5ece4] text-[#9b4c2e] flex items-center justify-center shrink-0 border border-[#ede5dd]">
                <Star className="w-5 h-5 text-[#9b4c2e] fill-[#9b4c2e]/20" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                  مجتمع ملتزم
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  بيئة إسلامية تحترم القيم والآداب الإسلامية
                </p>
              </div>
            </div>

            {/* Column 2: ملفات موثوقة (Document Check Icon) */}
            <div className="px-4 py-4 sm:py-2 flex items-start gap-3.5 text-start">
              <div className="w-11 h-11 rounded-2xl bg-[#f5ece4] text-[#9b4c2e] flex items-center justify-center shrink-0 border border-[#ede5dd]">
                <FileCheck2 className="w-5 h-5 text-[#9b4c2e]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                  ملفات موثوقة
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  جميع الملفات تمر بعملية تحقق دقيقة
                </p>
              </div>
            </div>

            {/* Column 3: توافق حقيقي (Heart Icon) */}
            <div className="px-4 py-4 sm:py-2 flex items-start gap-3.5 text-start">
              <div className="w-11 h-11 rounded-2xl bg-[#f5ece4] text-[#9b4c2e] flex items-center justify-center shrink-0 border border-[#ede5dd]">
                <Heart className="w-5 h-5 text-[#9b4c2e] fill-[#9b4c2e]/20" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                  توافق حقيقي
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  خوارزمية ذكية تقترح لك من يشاركك القيم والأهداف
                </p>
              </div>
            </div>

            {/* Column 4: أمان وخصوصية (Shield Icon) */}
            <div className="px-4 py-4 sm:py-2 flex items-start gap-3.5 text-start">
              <div className="w-11 h-11 rounded-2xl bg-[#f5ece4] text-[#9b4c2e] flex items-center justify-center shrink-0 border border-[#ede5dd]">
                <ShieldCheck className="w-5 h-5 text-[#9b4c2e]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-neutral-900">
                  أمان وخصوصية
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  بياناتك محمية ولا تظهر إلا للشخص المناسب
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
