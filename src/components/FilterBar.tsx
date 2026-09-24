import React, { useState } from 'react';
import { Language, Gender, PrayerHabit, MaritalStatus, ManagedCountry } from '../types';
import { translations } from '../data/translations';
import { 
  COUNTRIES, 
  CITIES, 
  EDUCATION_LEVELS, 
  JOB_CATEGORIES, 
  MARITAL_STATUSES,
  DISTANCE_OPTIONS 
} from '../data/referenceData';
import { 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  MapPin,
  Heart,
  Send,
  Users
} from 'lucide-react';

export type ActiveExploreView = 'all' | 'favorites' | 'requests';

interface FilterBarProps {
  lang: Language;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGender: 'all' | Gender;
  onGenderChange: (val: 'all' | Gender) => void;
  selectedCountryId: string;
  onCountryIdChange: (val: string) => void;
  selectedCityId: string;
  onCityIdChange: (val: string) => void;
  selectedEducationId: string;
  onEducationIdChange: (val: string) => void;
  selectedJobCategoryId: string;
  onJobCategoryIdChange: (val: string) => void;
  selectedPrayer: 'all' | PrayerHabit;
  onPrayerChange: (val: 'all' | PrayerHabit) => void;
  selectedStatus: 'all' | MaritalStatus;
  onStatusChange: (val: 'all' | MaritalStatus) => void;
  selectedDistanceKm: string;
  onDistanceKmChange: (val: string) => void;
  minAge: number;
  onMinAgeChange: (val: number) => void;
  maxAge: number;
  onMaxAgeChange: (val: number) => void;
  sortOption: string;
  onSortOptionChange: (val: string) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (val: boolean) => void;
  onReset: () => void;
  onOpenPreferences: () => void;
  totalResultsCount: number;
  activeView: ActiveExploreView;
  onViewChange: (view: ActiveExploreView) => void;
  favoritesCount?: number;
  requestsCount?: number;
  availableCountries?: ManagedCountry[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  lang,
  searchTerm,
  onSearchChange,
  selectedGender,
  onGenderChange,
  selectedCountryId,
  onCountryIdChange,
  selectedCityId,
  onCityIdChange,
  selectedEducationId,
  onEducationIdChange,
  selectedJobCategoryId,
  onJobCategoryIdChange,
  selectedPrayer,
  onPrayerChange,
  selectedStatus,
  onStatusChange,
  selectedDistanceKm,
  onDistanceKmChange,
  minAge,
  onMinAgeChange,
  maxAge,
  onMaxAgeChange,
  sortOption,
  onSortOptionChange,
  verifiedOnly,
  onVerifiedChange,
  onReset,
  onOpenPreferences,
  totalResultsCount,
  activeView,
  onViewChange,
  favoritesCount = 0,
  requestsCount = 0,
  availableCountries
}) => {
  const t = translations[lang] || translations['ar'];
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Active countries enabled in settings
  const activeCountriesList = availableCountries && availableCountries.length > 0
    ? availableCountries.filter(c => c.isEnabled)
    : COUNTRIES;

  // Filter available cities dynamically based on selected country
  const selectedManagedCountry = availableCountries?.find(c => c.id === selectedCountryId);
  const availableCities: Array<{ id: string; nameAr: string; nameEn: string }> = 
    selectedCountryId && selectedCountryId !== 'all'
      ? (selectedManagedCountry 
          ? selectedManagedCountry.cities.filter(ct => ct.isEnabled).map(ct => ({
              id: ct.id,
              nameAr: ct.nameAr,
              nameEn: ct.nameEn
            }))
          : CITIES.filter(c => c.countryId === selectedCountryId))
      : (availableCountries && availableCountries.length > 0
          ? availableCountries
              .filter(c => c.isEnabled)
              .flatMap(c => c.cities.filter(ct => ct.isEnabled).map(ct => ({
                id: ct.id,
                nameAr: ct.nameAr,
                nameEn: ct.nameEn
              })))
          : CITIES);

  return (
    <div className="bg-white border-b border-neutral-200 py-5">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 space-y-4">
        
        {/* Top Segment: View Tabs (All, Favorites, Requests) + Preferences Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          
          {/* Main View Tabs */}
          <div className="inline-flex bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => onViewChange('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'استعراض السير' : 'Explore Profiles'}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-neutral-200/70 rounded-full font-mono">{totalResultsCount}</span>
            </button>

            <button
              onClick={() => onViewChange('favorites')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'favorites'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeView === 'favorites' ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{lang === 'ar' ? 'المفضلة' : 'Favorites'}</span>
              {favoritesCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-full font-mono">{favoritesCount}</span>
              )}
            </button>

            <button
              onClick={() => onViewChange('requests')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'requests'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'طلبات الزواج' : 'Marriage Requests'}</span>
              {requestsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-mono">{requestsCount}</span>
              )}
            </button>
          </div>

          {/* Quick Criteria & Matching Configuration Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPreferences}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'ar' ? 'معايير وتفضيلات شريك الحياة' : 'My Partner Preferences'}</span>
            </button>
          </div>

        </div>

        {/* Primary Row: Gender selection + Search Bar + Sort + Advanced Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Gender Filter Buttons */}
          <div className="inline-flex bg-neutral-100 p-1 rounded-xl self-start border border-neutral-200/60">
            <button
              id="filter-gender-all-btn"
              onClick={() => onGenderChange('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedGender === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              id="filter-gender-female-btn"
              onClick={() => onGenderChange('female')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedGender === 'female'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🌸 {t.filterWomen}
            </button>
            <button
              id="filter-gender-male-btn"
              onClick={() => onGenderChange('male')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedGender === 'male'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🌿 {t.filterMen}
            </button>
          </div>

          {/* Search Input Field */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              id="profiles-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث بالاسم، المهنة، التخصص، المدينة، أو الكلمات المفتاحية...' : 'Search by name, occupation, major, city, or bio...'}
              className="w-full bg-neutral-50 border border-neutral-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-xl ps-10 pe-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition"
            />
          </div>

          {/* Sort Selector + Verified Only Toggle + Reset */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <select
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value)}
              className="bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
            >
              <option value="compatibility">✨ {lang === 'ar' ? 'الأعلى توافقاً أولاً' : 'Best Match First'}</option>
              <option value="distance">📍 {lang === 'ar' ? 'الأقرب مسافة' : 'Nearest Distance'}</option>
              <option value="age_asc">👶 {lang === 'ar' ? 'العمر: الأصغر للأكبر' : 'Age: Low to High'}</option>
              <option value="age_desc">🧓 {lang === 'ar' ? 'العمر: الأكبر للأصغر' : 'Age: High to Low'}</option>
            </select>

            <label 
              id="verified-only-toggle"
              className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-300 transition"
            >
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => onVerifiedChange(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-800 focus:ring-emerald-700 accent-emerald-800 cursor-pointer"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.filterVerifiedOnly}</span>
            </label>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
                showAdvanced 
                  ? 'bg-neutral-900 text-white border-neutral-900' 
                  : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
              title={lang === 'ar' ? 'فلاتر دقيقة وموسعة' : 'Advanced Filters'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              id="filter-reset-btn"
              onClick={onReset}
              title={t.filterReset}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl border border-neutral-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Secondary Quick Selects Row: Country, City, Distance, Marital Status */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Country Selector */}
          <select
            id="filter-country-select"
            value={selectedCountryId}
            onChange={(e) => {
              onCountryIdChange(e.target.value);
              onCityIdChange('all');
            }}
            className="bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">🌍 {t.filterCountry}: {t.filterAll}</option>
            {activeCountriesList.map(c => (
              <option key={c.id} value={c.id}>
                {c.flag} {lang === 'ar' ? c.nameAr : c.nameEn}
              </option>
            ))}
          </select>

          {/* City Selector (Dynamic) */}
          <select
            value={selectedCityId}
            onChange={(e) => onCityIdChange(e.target.value)}
            className="bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">📍 {lang === 'ar' ? 'المدينة: الكل' : 'City: All'}</option>
            {availableCities.map(c => (
              <option key={c.id} value={c.id}>
                {lang === 'ar' ? c.nameAr : c.nameEn}
              </option>
            ))}
          </select>

          {/* Proximity / Distance Option */}
          <select
            value={selectedDistanceKm}
            onChange={(e) => onDistanceKmChange(e.target.value)}
            className="bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">🗺️ {lang === 'ar' ? 'المسافة: غير محدد' : 'Distance: Any'}</option>
            <option value="25">≤ 25 {lang === 'ar' ? 'كم (نفس المدينة)' : 'km (Same City)'}</option>
            <option value="50">≤ 50 {lang === 'ar' ? 'كم' : 'km'}</option>
            <option value="100">≤ 100 {lang === 'ar' ? 'كم' : 'km'}</option>
            <option value="300">≤ 300 {lang === 'ar' ? 'كم (نفس المنطقة)' : 'km'}</option>
          </select>

          {/* Marital Status */}
          <select
            id="filter-status-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
          >
            <option value="all">💍 {t.filterStatus}: {t.filterAll}</option>
            {MARITAL_STATUSES.map(s => (
              <option key={s.id} value={s.id}>
                {lang === 'ar' ? s.nameAr : s.nameEn}
              </option>
            ))}
          </select>

          {/* Result counter pill */}
          <div className="ms-auto text-neutral-600 text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-full">
            {totalResultsCount} {lang === 'ar' ? 'ملف مطابق' : 'profiles matched'}
          </div>
        </div>

        {/* Collapsible Advanced Filters (Education, Job Category, Age Range, Prayer) */}
        {showAdvanced && (
          <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            
            {/* Education Level */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-600 block">
                {lang === 'ar' ? 'المستوى التعليمي:' : 'Education Level:'}
              </label>
              <select
                value={selectedEducationId}
                onChange={(e) => onEducationIdChange(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
              >
                <option value="all">{lang === 'ar' ? 'جميع المستويات' : 'All Levels'}</option>
                {EDUCATION_LEVELS.map(e => (
                  <option key={e.id} value={e.id}>
                    {lang === 'ar' ? e.nameAr : e.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-600 block">
                {lang === 'ar' ? 'المجال الوظيفي:' : 'Career Field:'}
              </label>
              <select
                value={selectedJobCategoryId}
                onChange={(e) => onJobCategoryIdChange(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
              >
                <option value="all">{lang === 'ar' ? 'جميع المجالات' : 'All Careers'}</option>
                {JOB_CATEGORIES.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.icon} {lang === 'ar' ? j.nameAr : j.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Prayer Regularity */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-600 block">
                {lang === 'ar' ? 'المحافظة على الصلاة:' : 'Prayer Habit:'}
              </label>
              <select
                id="filter-prayer-select"
                value={selectedPrayer}
                onChange={(e) => onPrayerChange(e.target.value as any)}
                className="w-full bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-700 cursor-pointer"
              >
                <option value="all">🕌 {t.filterPrayer}: {t.filterAll}</option>
                <option value="always_in_mosque">{t.filterPrayerMosque}</option>
                <option value="always_on_time">{t.filterPrayerOnTime}</option>
              </select>
            </div>

            {/* Age Range Slider Inputs */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600">
                <span>{lang === 'ar' ? 'النطاق العمري:' : 'Age Range:'}</span>
                <span className="font-mono text-emerald-800 font-bold">{minAge} - {maxAge}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={18}
                  max={maxAge}
                  value={minAge}
                  onChange={(e) => onMinAgeChange(Number(e.target.value))}
                  className="w-1/2 p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-center"
                />
                <span className="text-neutral-400">-</span>
                <input
                  type="number"
                  min={minAge}
                  max={75}
                  value={maxAge}
                  onChange={(e) => onMaxAgeChange(Number(e.target.value))}
                  className="w-1/2 p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-center"
                />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
