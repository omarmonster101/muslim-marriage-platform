import React, { useState, useEffect } from 'react';
import { MarriagePreferences, Language } from '../types';
import { 
  COUNTRIES, 
  CITIES, 
  NATIONALITIES, 
  EDUCATION_LEVELS, 
  FIELDS_OF_STUDY, 
  JOB_CATEGORIES, 
  OCCUPATIONS, 
  GLOBAL_LANGUAGES, 
  MARITAL_STATUSES,
  DISTANCE_OPTIONS 
} from '../data/referenceData';
import { Sliders, X, Check, Save, Sparkles, MapPin, Heart } from 'lucide-react';

interface MarriagePreferencesModalProps {
  userId: string;
  userGender: 'male' | 'female';
  lang: Language;
  onClose: () => void;
  onPreferencesSaved: (preferences: MarriagePreferences) => void;
}

export const MarriagePreferencesModal: React.FC<MarriagePreferencesModalProps> = ({
  userId,
  userGender,
  lang,
  onClose,
  onPreferencesSaved
}) => {
  const targetGender = userGender === 'male' ? 'female' : 'male';

  const [minAge, setMinAge] = useState<number>(userGender === 'male' ? 20 : 25);
  const [maxAge, setMaxAge] = useState<number>(userGender === 'male' ? 28 : 35);
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>(['SA']);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(['SA-RUH']);
  const [distanceOption, setDistanceOption] = useState<any>('same_country');
  const [selectedMaritalStatuses, setSelectedMaritalStatuses] = useState<any[]>(['single']);
  const [selectedEducationIds, setSelectedEducationIds] = useState<string[]>(['bachelor', 'master']);
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [selectedJobCategoryIds, setSelectedJobCategoryIds] = useState<string[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<string[]>(['lang_ar']);
  const [wantsChildren, setWantsChildren] = useState<'yes' | 'no' | 'open'>('yes');
  const [acceptHasChildren, setAcceptHasChildren] = useState<'yes' | 'no' | 'does_not_matter'>('does_not_matter');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load existing preferences from backend
  useEffect(() => {
    fetch(`/api/preferences/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const p = data.data as MarriagePreferences;
          if (p.minAge) setMinAge(p.minAge);
          if (p.maxAge) setMaxAge(p.maxAge);
          if (p.preferredCountryIds) setSelectedCountryIds(p.preferredCountryIds);
          if (p.preferredCityIds) setSelectedCityIds(p.preferredCityIds);
          if (p.maxDistanceOption) setDistanceOption(p.maxDistanceOption);
          if (p.preferredMaritalStatuses) setSelectedMaritalStatuses(p.preferredMaritalStatuses);
          if (p.preferredEducationLevelIds) setSelectedEducationIds(p.preferredEducationLevelIds);
          if (p.preferredFieldOfStudyIds) setSelectedFieldIds(p.preferredFieldOfStudyIds);
          if (p.preferredJobCategoryIds) setSelectedJobCategoryIds(p.preferredJobCategoryIds);
          if (p.preferredLanguageIds) setSelectedLanguageIds(p.preferredLanguageIds);
          if (p.wantsChildren) setWantsChildren(p.wantsChildren);
          if (p.acceptHasChildren) setAcceptHasChildren(p.acceptHasChildren);
        }
      })
      .catch(err => console.error("Could not load preferences", err))
      .finally(() => setIsLoading(false));
  }, [userId]);

  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const payload: MarriagePreferences = {
      userId,
      preferredGender: targetGender,
      minAge,
      maxAge,
      preferredCountryIds: selectedCountryIds,
      preferredCityIds: selectedCityIds,
      maxDistanceOption: distanceOption,
      preferredNationalityIds: [],
      preferredMaritalStatuses: selectedMaritalStatuses,
      preferredEducationLevelIds: selectedEducationIds,
      preferredFieldOfStudyIds: selectedFieldIds,
      preferredJobCategoryIds: selectedJobCategoryIds,
      preferredOccupationIds: [],
      preferredLanguageIds: selectedLanguageIds,
      wantsChildren,
      acceptHasChildren,
      relocationPreference: 'open_to_discussion'
    };

    try {
      const res = await fetch(`/api/preferences/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        onPreferencesSaved(payload);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {lang === 'ar' ? 'تحديد معايير وتفضيلات شريك الحياة' : 'Marriage Partner Criteria'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'تُستخدم هذه المعايير لحساب نسبة التوافق وترتيب نتائج البحث بذكاء' : 'Used for objective compatibility scoring and intelligent search ranking'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isLoading ? (
          <div className="p-12 text-center text-neutral-500 text-sm">
            {lang === 'ar' ? 'جارٍ تحميل معاييرك...' : 'Loading criteria...'}
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* 1. Age Range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-neutral-800 text-sm">
                  {lang === 'ar' ? '1. النطاق العمري المرغوب' : '1. Desired Age Range'}
                </label>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {minAge} - {maxAge} {lang === 'ar' ? 'سنة' : 'yrs'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-500 text-[11px] block mb-1">{lang === 'ar' ? 'الحد الأدنى للعمر:' : 'Min Age:'}</label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-500 text-[11px] block mb-1">{lang === 'ar' ? 'الحد الأقصى للعمر:' : 'Max Age:'}</label>
                  <input
                    type="number"
                    min={minAge}
                    max={75}
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 2. Location & Geographic Scope */}
            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <label className="font-bold text-neutral-800 text-sm block">
                {lang === 'ar' ? '2. النطاق الجغرافي والمسافة' : '2. Geographic Distance & Location'}
              </label>

              {/* Distance Radius */}
              <div>
                <label className="text-neutral-600 block mb-1.5 font-medium">
                  {lang === 'ar' ? 'الحد الأقصى للمسافة الجغرافية:' : 'Maximum Proximity / Distance:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {DISTANCE_OPTIONS.map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setDistanceOption(opt.id)}
                      className={`p-2 rounded-lg text-start transition font-medium border cursor-pointer ${
                        distanceOption === opt.id
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {lang === 'ar' ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div>
                <label className="text-neutral-600 block mb-1.5 font-medium">
                  {lang === 'ar' ? 'الدول المفضلة للإقامة:' : 'Preferred Countries:'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COUNTRIES.map(c => {
                    const isSelected = selectedCountryIds.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleArrayItem(selectedCountryIds, setSelectedCountryIds, c.id)}
                        className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{lang === 'ar' ? c.nameAr : c.nameEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Marital Status */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <label className="font-bold text-neutral-800 text-sm block">
                {lang === 'ar' ? '3. الحالة الاجتماعية المقبولة' : '3. Acceptable Marital Status'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {MARITAL_STATUSES.map(s => {
                  const isSelected = selectedMaritalStatuses.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleArrayItem(selectedMaritalStatuses, setSelectedMaritalStatuses, s.id)}
                      className={`p-2.5 rounded-xl border text-center transition font-medium cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {lang === 'ar' ? s.nameAr : s.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Education Level */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <label className="font-bold text-neutral-800 text-sm block">
                {lang === 'ar' ? '4. المستوى التعليمي المرغوب' : '4. Desired Education Level'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EDUCATION_LEVELS.filter(e => e.id !== 'other').map(e => {
                  const isSelected = selectedEducationIds.includes(e.id);
                  return (
                    <button
                      type="button"
                      key={e.id}
                      onClick={() => toggleArrayItem(selectedEducationIds, setSelectedEducationIds, e.id)}
                      className={`px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {lang === 'ar' ? e.nameAr : e.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Job Category */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <label className="font-bold text-neutral-800 text-sm block">
                {lang === 'ar' ? '5. المجالات المهنية والوظيفية المفضلة' : '5. Preferred Career Fields'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {JOB_CATEGORIES.slice(0, 9).map(j => {
                  const isSelected = selectedJobCategoryIds.includes(j.id);
                  return (
                    <button
                      type="button"
                      key={j.id}
                      onClick={() => toggleArrayItem(selectedJobCategoryIds, setSelectedJobCategoryIds, j.id)}
                      className={`px-3 py-1.5 rounded-lg border transition font-medium flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{j.icon}</span>
                      <span>{lang === 'ar' ? j.nameAr : j.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Children & Family Vision */}
            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <label className="font-bold text-neutral-800 text-sm block">
                {lang === 'ar' ? '6. الرؤية بشأن الأطفال والإنجاب' : '6. Family & Children Perspectives'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-600 block mb-1 font-medium">
                    {lang === 'ar' ? 'الرغبة في الإنجاب مستقبلاً:' : 'Desire to have children:'}
                  </label>
                  <select
                    value={wantsChildren}
                    onChange={(e: any) => setWantsChildren(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl"
                  >
                    <option value="yes">{lang === 'ar' ? 'نعم، أرغب في بناء أسرة وإنجاب أطفال' : 'Yes, want children'}</option>
                    <option value="no">{lang === 'ar' ? 'لا أرغب في الإنجاب' : 'No children'}</option>
                    <option value="open">{lang === 'ar' ? 'مستعد للنقاش والتوافق' : 'Open to discussion'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-600 block mb-1 font-medium">
                    {lang === 'ar' ? 'قبول وجود أطفال من زواج سابق:' : 'Accept children from previous marriage:'}
                  </label>
                  <select
                    value={acceptHasChildren}
                    onChange={(e: any) => setAcceptHasChildren(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl"
                  >
                    <option value="does_not_matter">{lang === 'ar' ? 'لا مانع لدي / الأمر متقبل' : 'Does not matter / Open'}</option>
                    <option value="no">{lang === 'ar' ? 'أفضل من لم يسبق له الإنجاب' : 'Prefer without children'}</option>
                    <option value="yes">{lang === 'ar' ? 'مرحب بوجود أطفال' : 'Welcomes children'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer with Save feedback */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              {saveSuccess ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تم حفظ التفضيلات بنجاح في قاعدة البيانات!' : 'Criteria saved to database!'}</span>
                </span>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ وتطبيق المعايير' : 'Save & Apply Criteria')}</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
