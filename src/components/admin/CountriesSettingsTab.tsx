import React, { useState } from 'react';
import { LocalizationConfig, ManagedCountry, ManagedCountryCity } from '../../types';
import { ALL_WORLD_COUNTRIES } from '../../data/worldCountriesData';
import { 
  Globe2, 
  Plus, 
  Search, 
  Check, 
  MapPin, 
  Save, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  PhoneCall, 
  Coins, 
  SlidersHorizontal,
  Star
} from 'lucide-react';
import { fireCelebrationConfetti } from '../../utils/confetti';

interface CountriesSettingsTabProps {
  localizationConfig: LocalizationConfig;
  onSave: (updatedConfig: LocalizationConfig) => Promise<boolean>;
}

export const CountriesSettingsTab: React.FC<CountriesSettingsTabProps> = ({
  localizationConfig,
  onSave
}) => {
  const [countries, setCountries] = useState<ManagedCountry[]>(() => {
    const list = localizationConfig.availableCountries || [];
    if (list.length < 50) {
      const existingMap = new Map(list.map(c => [c.id, c]));
      return ALL_WORLD_COUNTRIES.map(wc => {
        const ex = existingMap.get(wc.id);
        if (ex) {
          return {
            ...wc,
            isEnabled: ex.isEnabled,
            isDefault: ex.isDefault ?? wc.isDefault
          };
        }
        return wc;
      });
    }
    return list;
  });
  const [defaultCountryId, setDefaultCountryId] = useState<string>(
    localizationConfig.defaultCountryId || 'SA'
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);

  // Add country modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCountry, setNewCountry] = useState({
    nameAr: '',
    nameEn: '',
    code: '',
    flag: '🌍',
    dialCode: '+',
    currency: '',
    currencyNameAr: '',
    minAge: 18
  });

  // Add city inline state
  const [newCityInputs, setNewCityInputs] = useState<Record<string, { nameAr: string; nameEn: string }>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Toggle Country enabled status
  const handleToggleCountry = (countryId: string) => {
    setCountries(prev => prev.map(c => {
      if (c.id === countryId) {
        // Prevent disabling default country
        if (c.isDefault) {
          showToast('لا يمكن تعطيل الدولة الافتراضية للمنصة', 'error');
          return c;
        }
        return { ...c, isEnabled: !c.isEnabled };
      }
      return c;
    }));
  };

  // Set Default Country
  const handleSetDefault = (countryId: string) => {
    setDefaultCountryId(countryId);
    setCountries(prev => prev.map(c => ({
      ...c,
      isDefault: c.id === countryId,
      isEnabled: c.id === countryId ? true : c.isEnabled
    })));
    showToast('تم تعيين الدولة كدولة افتراضية للمنصة');
  };

  // Toggle City enabled status
  const handleToggleCity = (countryId: string, cityId: string) => {
    setCountries(prev => prev.map(c => {
      if (c.id === countryId) {
        return {
          ...c,
          cities: c.cities.map(ct => ct.id === cityId ? { ...ct, isEnabled: !ct.isEnabled } : ct)
        };
      }
      return c;
    }));
  };

  // Add City to Country
  const handleAddCity = (countryId: string) => {
    const input = newCityInputs[countryId];
    if (!input || !input.nameAr.trim()) {
      showToast('يرجى كتابة اسم المدينة بالعربية', 'error');
      return;
    }

    const newCityObj: ManagedCountryCity = {
      id: `${countryId}-${Date.now().toString(36).toUpperCase()}`,
      nameAr: input.nameAr.trim(),
      nameEn: input.nameEn.trim() || input.nameAr.trim(),
      isEnabled: true
    };

    setCountries(prev => prev.map(c => {
      if (c.id === countryId) {
        return {
          ...c,
          cities: [...c.cities, newCityObj]
        };
      }
      return c;
    }));

    setNewCityInputs(prev => ({
      ...prev,
      [countryId]: { nameAr: '', nameEn: '' }
    }));

    showToast(`تمت إضافة مدينة ${newCityObj.nameAr} بنجاح`);
  };

  // Delete City
  const handleDeleteCity = (countryId: string, cityId: string) => {
    setCountries(prev => prev.map(c => {
      if (c.id === countryId) {
        return {
          ...c,
          cities: c.cities.filter(ct => ct.id !== cityId)
        };
      }
      return c;
    }));
    showToast('تم حذف المدينة من القائمة');
  };

  // Add New Country Submit
  const handleCreateCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry.nameAr.trim() || !newCountry.code.trim()) {
      showToast('يرجى ملء اسم الدولة والرمز الدولي', 'error');
      return;
    }

    const countryCode = newCountry.code.trim().toUpperCase();
    if (countries.some(c => c.code === countryCode || c.id === countryCode)) {
      showToast('هذه الدولة مسجلة بالفعل بالرمز الدولي المحدد', 'error');
      return;
    }

    const createdCountry: ManagedCountry = {
      id: countryCode,
      code: countryCode,
      nameAr: newCountry.nameAr.trim(),
      nameEn: newCountry.nameEn.trim() || newCountry.nameAr.trim(),
      flag: newCountry.flag.trim() || '🌍',
      dialCode: newCountry.dialCode.trim(),
      currency: newCountry.currency.trim().toUpperCase() || 'USD',
      currencyNameAr: newCountry.currencyNameAr.trim() || 'عملة محلية',
      minAge: Number(newCountry.minAge) || 18,
      isEnabled: true,
      isDefault: false,
      order: countries.length + 1,
      cities: []
    };

    setCountries(prev => [...prev, createdCountry]);
    setIsAddModalOpen(false);
    setNewCountry({
      nameAr: '',
      nameEn: '',
      code: '',
      flag: '🌍',
      dialCode: '+',
      currency: '',
      currencyNameAr: '',
      minAge: 18
    });
    setExpandedCountryId(createdCountry.id);
    showToast(`تمت إضافة دولة ${createdCountry.nameAr} بنجاح! يمكنك الآن إضافة مدنها`);
  };

  // Save to Firestore
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedConfig: LocalizationConfig = {
        ...localizationConfig,
        defaultCountryId,
        availableCountries: countries,
        updatedAt: new Date().toISOString(),
        updatedBy: 'الإدارة الشرعية'
      };

      const success = await onSave(updatedConfig);
      if (success) {
        showToast('تم حفظ إعدادات الدول والمدن ومزامنتها بنجاح مع قاعدة البيانات!');
        fireCelebrationConfetti();
      } else {
        showToast('حدث خطأ أثناء حفظ الإعدادات في قاعدة البيانات', 'error');
      }
    } catch (e) {
      showToast('تعذر الحفظ، يرجى المحاولة لاحقاً', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Load / Update all World Countries & Cities
  const handleLoadAllWorldCountries = () => {
    const existingMap = new Map(countries.map(c => [c.id, c]));
    const merged: ManagedCountry[] = ALL_WORLD_COUNTRIES.map(wc => {
      const ex = existingMap.get(wc.id);
      if (ex) {
        // preserve enabled status and custom cities if any
        const existingCityNames = new Set(ex.cities.map(ct => ct.nameAr));
        const combinedCities = [
          ...ex.cities,
          ...wc.cities.filter(ct => !existingCityNames.has(ct.nameAr))
        ];
        return {
          ...wc,
          isEnabled: ex.isEnabled,
          isDefault: ex.isDefault ?? wc.isDefault,
          cities: combinedCities
        };
      }
      return wc;
    });

    const standardIds = new Set(ALL_WORLD_COUNTRIES.map(wc => wc.id));
    const customOnly = countries.filter(c => !standardIds.has(c.id));
    const finalCountries = [...merged, ...customOnly];
    setCountries(finalCountries);
    showToast(`تم تحميل وتحديث كافة دول العالم والمدن بنجاح (${finalCountries.length} دولة و${finalCountries.reduce((a, c) => a + (c.cities?.length || 0), 0)} مدينة)`);
    fireCelebrationConfetti();
  };

  // Filter countries
  const filteredCountries = countries.filter(c => {
    const matchesSearch = 
      c.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dialCode.includes(searchTerm);

    if (!matchesSearch) return false;
    if (statusFilter === 'enabled') return c.isEnabled;
    if (statusFilter === 'disabled') return !c.isEnabled;
    return true;
  });

  const totalCitiesCount = countries.reduce((acc, c) => acc + (c.cities?.length || 0), 0);
  const activeCountriesCount = countries.filter(c => c.isEnabled).length;
  const defaultCountry = countries.find(c => c.id === defaultCountryId) || countries[0];

  return (
    <div className="space-y-6 font-cairo">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              إعدادات البلاد والمدن والمناطق (Countries & Cities)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              مربوط بقاعدة البيانات الحية
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            التحكم الشامل بالدول المسموح التسجيل منها، رموز الاتصال، العملات، وإدارة مدن كل دولة لفلترة البحث الجغرافي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadAllWorldCountries}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="تحميل ومزامنة كافة دول ومدن العالم (93+ دولة)"
          >
            <Globe2 className="w-4 h-4" />
            <span>تحديث كل دول العالم والمدن</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة دولة مخصصة</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="px-5 py-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ ومزامنة في Firestore</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">الدول النشطة / الإجمالية</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-neutral-900">{activeCountriesCount}</span>
            <span className="text-xs text-neutral-400 font-bold">/ {countries.length} دولة</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">متاحة في فلاتر البحث واستمارة التسجيل</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">إجمالي المدن الموثقة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-neutral-900">{totalCitiesCount}</span>
            <span className="text-xs text-neutral-400 font-bold">مدينة ومحافظة</span>
          </div>
          <span className="text-[10px] text-neutral-500 block mt-1">قابلة للإضافة والتعديل الفوري</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">الدولة الافتراضية للمنصة</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl">{defaultCountry?.flag}</span>
            <span className="text-sm font-bold text-neutral-900 truncate">{defaultCountry?.nameAr}</span>
          </div>
          <span className="text-[10px] text-amber-700 font-bold block mt-1">رمز الاتصال: {defaultCountry?.dialCode}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">العملة الافتراضية للمهور</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-neutral-900">{defaultCountry?.currency}</span>
            <span className="text-xs text-neutral-500 font-bold">({defaultCountry?.currencyNameAr})</span>
          </div>
          <span className="text-[10px] text-neutral-400 block mt-1">تستخدم في تفاصيل الصداق والمهور</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو الكود (SA, Egypt, +966)..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl ps-9 pe-3 py-2 text-xs focus:outline-none focus:border-[#9b4c2e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-neutral-500 font-bold">الحالة:</span>
          <div className="inline-flex bg-neutral-100 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
              }`}
            >
              الكل ({countries.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('enabled')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'enabled' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-neutral-600'
              }`}
            >
              المفعّلة ({activeCountriesCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('disabled')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'disabled' ? 'bg-white text-red-800 shadow-2xs' : 'text-neutral-600'
              }`}
            >
              المعطلة ({countries.length - activeCountriesCount})
            </button>
          </div>
        </div>
      </div>

      {/* Countries List */}
      <div className="space-y-3">
        {filteredCountries.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center space-y-2">
            <Globe2 className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-bold text-neutral-600">لم يتم العثور على دول تطابق بحثك</p>
          </div>
        ) : (
          filteredCountries.map((c) => {
            const isExpanded = expandedCountryId === c.id;
            const currentCityInput = newCityInputs[c.id] || { nameAr: '', nameEn: '' };

            return (
              <div 
                key={c.id}
                className={`bg-white rounded-2xl border transition shadow-2xs overflow-hidden ${
                  c.isDefault ? 'border-[#9b4c2e]/40 ring-1 ring-[#9b4c2e]/20' : 'border-neutral-200'
                }`}
              >
                {/* Main Country Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl select-none">{c.flag}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-neutral-900">{c.nameAr}</span>
                        <span className="text-xs text-neutral-400 font-mono">({c.nameEn})</span>
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold rounded-md">
                          {c.code}
                        </span>
                        {c.isDefault && (
                          <span className="px-2.5 py-0.5 bg-[#9b4c2e] text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-2xs">
                            <Star className="w-3 h-3 fill-white" /> الدولة الافتراضية
                          </span>
                        )}
                      </div>

                      {/* Meta Tags */}
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-neutral-400" />
                          <span className="font-mono">{c.dialCode}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-neutral-400" />
                          <span>{c.currency} ({c.currencyNameAr})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-neutral-400" />
                          <span>{c.cities?.length || 0} مدينة مسجلة</span>
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          الحد الأدنى للسن: {c.minAge || 18} سنة
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Toggles */}
                  <div className="flex items-center gap-2 sm:gap-3 justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    {!c.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(c.id)}
                        className="px-2.5 py-1.5 text-[11px] font-bold text-neutral-700 hover:text-[#9b4c2e] border border-neutral-200 hover:border-[#9b4c2e]/40 rounded-xl transition cursor-pointer"
                        title="تعيين كدولة افتراضية للمنصة"
                      >
                        تعيين كافتراضية
                      </button>
                    )}

                    {/* Enable / Disable Toggle Switch */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-xs font-bold text-neutral-700">
                        {c.isEnabled ? 'مفعّلة' : 'معطلة'}
                      </span>
                      <div 
                        onClick={() => handleToggleCountry(c.id)}
                        className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative ${
                          c.isEnabled ? 'bg-emerald-600' : 'bg-neutral-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          c.isEnabled ? 'translate-x-0' : '-translate-x-4'
                        }`} />
                      </div>
                    </label>

                    {/* Expand Cities Accordion Button */}
                    <button
                      type="button"
                      onClick={() => setExpandedCountryId(isExpanded ? null : c.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        isExpanded 
                          ? 'bg-neutral-900 text-white border-neutral-900' 
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>إدارة المدن ({c.cities?.length || 0})</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Cities Management Panel (Expanded) */}
                {isExpanded && (
                  <div className="bg-[#faf8f5] border-t border-neutral-200 p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#9b4c2e]" />
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900">
                          قائمة المدن التابعة لـ {c.nameAr}
                        </h4>
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        المدن المفعّلة تظهر فوراً في قوائم التصفية واختيار مدينة الإقامة
                      </span>
                    </div>

                    {/* Add City Input Row */}
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-2 shadow-2xs">
                      <input
                        type="text"
                        value={currentCityInput.nameAr}
                        onChange={(e) => setNewCityInputs(prev => ({
                          ...prev,
                          [c.id]: { ...currentCityInput, nameAr: e.target.value }
                        }))}
                        placeholder="اسم المدينة بالعربية (مثال: مكة المكرمة)"
                        className="w-full sm:flex-1 p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-[#9b4c2e]"
                      />
                      <input
                        type="text"
                        value={currentCityInput.nameEn}
                        onChange={(e) => setNewCityInputs(prev => ({
                          ...prev,
                          [c.id]: { ...currentCityInput, nameEn: e.target.value }
                        }))}
                        placeholder="Name in English (e.g. Makkah)"
                        className="w-full sm:flex-1 p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-[#9b4c2e]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCity(c.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة المدينة</span>
                      </button>
                    </div>

                    {/* Cities Grid */}
                    {c.cities && c.cities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {c.cities.map((city) => (
                          <div 
                            key={city.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                              city.isEnabled 
                                ? 'bg-white border-neutral-200' 
                                : 'bg-neutral-100 border-neutral-200 opacity-60'
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-neutral-900 block truncate">{city.nameAr}</span>
                              <span className="text-[10px] text-neutral-400 font-mono block truncate">{city.nameEn}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleCity(c.id, city.id)}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer transition ${
                                  city.isEnabled 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-neutral-200 text-neutral-600'
                                }`}
                              >
                                {city.isEnabled ? 'مفعّلة' : 'معطلة'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteCity(c.id, city.id)}
                                className="p-1 text-neutral-400 hover:text-red-600 rounded-md transition cursor-pointer"
                                title="حذف المدينة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-500">
                        لا توجد مدن مسجلة لهذه الدولة حتى الآن، أضف أول مدينة بالأعلى.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add New Country Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 text-xs font-cairo">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#9b4c2e]" />
                <span>إضافة دولة جديدة إلى المنصة</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCountry} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">اسم الدولة بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={newCountry.nameAr}
                    onChange={(e) => setNewCountry({ ...newCountry, nameAr: e.target.value })}
                    placeholder="مثال: فلسطين"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">اسم الدولة بالإنجليزية *</label>
                  <input
                    type="text"
                    required
                    value={newCountry.nameEn}
                    onChange={(e) => setNewCountry({ ...newCountry, nameEn: e.target.value })}
                    placeholder="e.g. Palestine"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">الرمز الدولي (ISO) *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={newCountry.code}
                    onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })}
                    placeholder="PS"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-center focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">العلم (إيموجي)</label>
                  <input
                    type="text"
                    value={newCountry.flag}
                    onChange={(e) => setNewCountry({ ...newCountry, flag: e.target.value })}
                    placeholder="🇵🇸"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-lg focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">كود الاتصال *</label>
                  <input
                    type="text"
                    required
                    value={newCountry.dialCode}
                    onChange={(e) => setNewCountry({ ...newCountry, dialCode: e.target.value })}
                    placeholder="+970"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-center focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">رمز العملة (ISO)</label>
                  <input
                    type="text"
                    value={newCountry.currency}
                    onChange={(e) => setNewCountry({ ...newCountry, currency: e.target.value.toUpperCase() })}
                    placeholder="ILS / JOD"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">اسم العملة بالعربية</label>
                  <input
                    type="text"
                    value={newCountry.currencyNameAr}
                    onChange={(e) => setNewCountry({ ...newCountry, currencyNameAr: e.target.value })}
                    placeholder="دينار / شيكل"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">الحد الأدنى لسن الزواج</label>
                <input
                  type="number"
                  min={16}
                  max={30}
                  value={newCountry.minAge}
                  onChange={(e) => setNewCountry({ ...newCountry, minAge: Number(e.target.value) })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#9b4c2e]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                >
                  حفظ وإضافة الدولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
