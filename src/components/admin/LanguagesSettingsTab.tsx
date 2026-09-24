import React, { useState } from 'react';
import { LocalizationConfig, ManagedLanguage, Language } from '../../types';
import { translations } from '../../data/translations';
import { 
  ALL_TRANSLATION_KEYS, 
  TRANSLATION_CATEGORIES, 
  TranslationCategory, 
  TranslationKeyDef 
} from '../../data/allTranslationKeys';
import { 
  Languages, 
  Plus, 
  Search, 
  Check, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Globe2, 
  SlidersHorizontal,
  Star,
  Edit2,
  Sparkles,
  ChevronRight,
  Filter,
  RotateCcw
} from 'lucide-react';
import { fireCelebrationConfetti } from '../../utils/confetti';

interface LanguagesSettingsTabProps {
  localizationConfig: LocalizationConfig;
  onSave: (updatedConfig: LocalizationConfig) => Promise<boolean>;
}

export const LanguagesSettingsTab: React.FC<LanguagesSettingsTabProps> = ({
  localizationConfig,
  onSave
}) => {
  const [languages, setLanguages] = useState<ManagedLanguage[]>(
    localizationConfig.availableLanguages || []
  );
  const [defaultLanguage, setDefaultLanguage] = useState<Language>(
    localizationConfig.defaultLanguage || 'ar'
  );
  const [customTranslations, setCustomTranslations] = useState<Record<string, Record<string, string>>>(
    localizationConfig.customTranslations || {}
  );

  // Active target language for the dictionary editor
  const [selectedTranslateLang, setSelectedTranslateLang] = useState<Language>('en');
  const [searchKey, setSearchKey] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TranslationCategory>('all');
  const [allDictionaryKeys, setAllDictionaryKeys] = useState<TranslationKeyDef[]>(ALL_TRANSLATION_KEYS);

  // Add Language Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLangForm, setNewLangForm] = useState({
    code: '',
    nameNative: '',
    nameAr: '',
    direction: 'ltr' as 'rtl' | 'ltr',
    flag: '🌐'
  });

  // Add Custom Key Modal
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
  const [newKeyForm, setNewKeyForm] = useState({
    key: '',
    category: 'general' as TranslationCategory,
    descriptionAr: '',
    defaultAr: '',
    translation: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Toggle Language activation
  const handleToggleLanguage = (langCode: string) => {
    if (langCode === defaultLanguage) {
      showToast('لا يمكن تعطيل اللغة الافتراضية للمنصة', 'error');
      return;
    }

    setLanguages(prev => prev.map(l => {
      if (l.code === langCode) {
        return { ...l, isEnabled: !l.isEnabled };
      }
      return l;
    }));
  };

  // Set Default Language
  const handleSetDefault = (langCode: Language) => {
    setDefaultLanguage(langCode);
    setLanguages(prev => prev.map(l => ({
      ...l,
      isDefault: l.code === langCode,
      isEnabled: l.code === langCode ? true : l.isEnabled
    })));
    showToast(`تم تعيين لغة [${langCode}] كلغة افتراضية للمنصة`);
  };

  // Update translation dictionary text
  const handleUpdateTranslation = (lang: Language, key: string, value: string) => {
    setCustomTranslations(prev => ({
      ...prev,
      [lang]: {
        ...(prev[lang] || {}),
        [key]: value
      }
    }));
  };

  // Get current translation for key in selected language
  const getTranslationValue = (lang: Language, key: string, fallbackAr: string): string => {
    // 1. Custom override in state
    if (customTranslations[lang] && customTranslations[lang][key] !== undefined) {
      return customTranslations[lang][key];
    }
    // 2. Built-in translations file
    const builtIn = translations[lang];
    if (builtIn && builtIn[key]) {
      return builtIn[key];
    }
    // 3. Fallback to Arabic original
    return fallbackAr;
  };

  // Add Language submit
  const handleCreateLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newLangForm.code.trim().toLowerCase() as Language;
    if (!code || !newLangForm.nameNative.trim()) {
      showToast('يرجى إدخال رمز اللغة واسمها الأصلي', 'error');
      return;
    }

    if (languages.some(l => l.code === code)) {
      showToast('رمز اللغة مسجل بالفعل', 'error');
      return;
    }

    const created: ManagedLanguage = {
      id: code,
      code,
      nameNative: newLangForm.nameNative.trim(),
      nameAr: newLangForm.nameAr.trim() || newLangForm.nameNative.trim(),
      direction: newLangForm.direction,
      flag: newLangForm.flag.trim() || '🌐',
      isEnabled: true,
      isDefault: false,
      order: languages.length + 1,
      translatedPercent: 85
    };

    setLanguages(prev => [...prev, created]);
    setIsAddModalOpen(false);
    setSelectedTranslateLang(code);
    setNewLangForm({
      code: '',
      nameNative: '',
      nameAr: '',
      direction: 'ltr',
      flag: '🌐'
    });
    showToast(`تمت إضافة لغة [${created.nameNative}] بنجاح! يمكنك الآن ترجمة مفرداتها`);
  };

  // Save to Firestore
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedConfig: LocalizationConfig = {
        ...localizationConfig,
        defaultLanguage,
        availableLanguages: languages,
        customTranslations,
        updatedAt: new Date().toISOString(),
        updatedBy: 'الإدارة الشرعية'
      };

      const success = await onSave(updatedConfig);
      if (success) {
        showToast('تم حفظ إعدادات اللغات والقاموس ومزامنتها بنجاح مع Firestore!');
        fireCelebrationConfetti();
      } else {
        showToast('حدث خطأ أثناء حفظ اللغات في قاعدة البيانات', 'error');
      }
    } catch (e) {
      showToast('تعذر الحفظ، يرجى المحاولة لاحقاً', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset key translation to default
  const handleResetTranslation = (lang: Language, key: string) => {
    setCustomTranslations(prev => {
      const copy = { ...(prev[lang] || {}) };
      delete copy[key];
      return {
        ...prev,
        [lang]: copy
      };
    });
    showToast(`تمت استعادة النص الافتراضي للمفتاح [${key}]`);
  };

  // Create custom key
  const handleCreateCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    const key = newKeyForm.key.trim();
    if (!key) {
      showToast('يرجى إدخال اسم المفتاح الإنجليزي الفريد', 'error');
      return;
    }

    if (allDictionaryKeys.some(k => k.key === key)) {
      showToast('هذا المفتاح موجود بالفعل في القاموس', 'error');
      return;
    }

    const newDef: TranslationKeyDef = {
      key,
      category: newKeyForm.category,
      descriptionAr: newKeyForm.descriptionAr.trim() || key,
      defaultAr: newKeyForm.defaultAr.trim() || key
    };

    setAllDictionaryKeys(prev => [newDef, ...prev]);
    if (newKeyForm.translation.trim()) {
      handleUpdateTranslation(selectedTranslateLang, key, newKeyForm.translation.trim());
    }

    setIsAddKeyModalOpen(false);
    setNewKeyForm({
      key: '',
      category: 'general',
      descriptionAr: '',
      defaultAr: '',
      translation: ''
    });
    showToast(`تمت إضافة المفتاح [${key}] بنجاح إلى القاموس`);
  };

  // Filter dictionary keys
  const filteredKeys = allDictionaryKeys.filter(item => {
    const matchesSearch = 
      item.key.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.descriptionAr.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.defaultAr.toLowerCase().includes(searchKey.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    return true;
  });

  const activeLanguagesCount = languages.filter(l => l.isEnabled).length;
  const currentLangObj = languages.find(l => l.code === selectedTranslateLang) || languages[0];

  return (
    <div className="space-y-6 font-cairo">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              إعدادات اللغات والترجمة (Languages & Translations)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              متعدد اللغات (i18n)
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            إدارة اللغات المتاحة، تفعيل وإلغاء تفعيل اللغات في شريط التنقل، وتعديل نصوص القاموس والترجمة الشرعية فورياً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة لغة جديدة</span>
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

      {/* Languages Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((lang) => {
          const isDefault = lang.code === defaultLanguage;
          const isSelectedForEdit = selectedTranslateLang === lang.code;

          return (
            <div 
              key={lang.id || lang.code}
              className={`bg-white rounded-2xl border p-5 space-y-4 transition shadow-2xs relative ${
                isDefault 
                  ? 'border-[#9b4c2e] ring-2 ring-[#9b4c2e]/10' 
                  : isSelectedForEdit
                  ? 'border-blue-400 bg-blue-50/20'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none">{lang.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-neutral-900">{lang.nameNative}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                        {lang.code.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">{lang.nameAr}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {isDefault ? (
                    <span className="px-2.5 py-0.5 bg-[#9b4c2e] text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-2xs">
                      <Star className="w-3 h-3 fill-white" /> الافتراضية
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(lang.code)}
                      className="text-[10px] text-neutral-500 hover:text-[#9b4c2e] font-bold hover:underline cursor-pointer"
                    >
                      تعيين كافتراضية
                    </button>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lang.direction === 'rtl' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    اتجاه {lang.direction.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Progress & Stats */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-bold">نسبة اكتمال الترجمة:</span>
                  <span className="font-mono font-bold text-neutral-800">{lang.translatedPercent || 95}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${lang.translatedPercent || 95}%` }}
                  />
                </div>
              </div>

              {/* Controls Footer */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-bold text-neutral-700">
                    {lang.isEnabled ? 'مفعّلة' : 'معطلة'}
                  </span>
                  <div 
                    onClick={() => handleToggleLanguage(lang.code)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer relative ${
                      lang.isEnabled ? 'bg-emerald-600' : 'bg-neutral-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      lang.isEnabled ? 'translate-x-0' : '-translate-x-4'
                    }`} />
                  </div>
                </label>

                <button
                  type="button"
                  onClick={() => setSelectedTranslateLang(lang.code)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer ${
                    isSelectedForEdit
                      ? 'bg-[#9b4c2e] text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل القاموس</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Translation Dictionary Editor */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 space-y-5 shadow-2xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="font-black text-base text-neutral-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#9b4c2e]" />
              <span>محرر القاموس ومفاتيح الترجمة المباشرة</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              أنت الآن تقوم بتحرير نصوص لغة: <span className="font-bold text-neutral-900">{currentLangObj?.flag} {currentLangObj?.nameNative} ({currentLangObj?.nameAr})</span>
            </p>
          </div>

          {/* Quick Language Switch Tabs for Editor */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setSelectedTranslateLang(l.code)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedTranslateLang === l.code
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Search Bar for Dictionary */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="بحث بالمفتاح أو النص العربي..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl ps-9 pe-3 py-2 text-xs focus:outline-none focus:border-[#9b4c2e]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => setIsAddKeyModalOpen(true)}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 text-xs shadow-2xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مفتاح جديد</span>
            </button>
            <div className="text-[11px] text-neutral-500 font-semibold hidden md:block">
              إجمالي المفاتيح: <strong className="text-neutral-900 font-bold">{allDictionaryKeys.length}</strong>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar border-b border-neutral-100">
          {TRANSLATION_CATEGORIES.map((cat) => {
            const count = cat.id === 'all' 
              ? allDictionaryKeys.length 
              : allDictionaryKeys.filter(k => k.category === cat.id).length;
            const isSelected = categoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#9b4c2e] text-white shadow-2xs' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200/80 text-neutral-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Translation Keys Table / List */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 text-xs">
          <div className="bg-neutral-100 p-3 grid grid-cols-12 font-bold text-neutral-700 items-center">
            <div className="col-span-12 sm:col-span-4">المفتاح والوصف الشرعي</div>
            <div className="col-span-12 sm:col-span-4">النص الأصلي (العربية)</div>
            <div className="col-span-12 sm:col-span-4">
              الترجمة إلى ({currentLangObj?.nameNative} - {currentLangObj?.direction.toUpperCase()})
            </div>
          </div>

          {filteredKeys.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 font-bold">
              لا توجد مفاتيح تطابق معايير البحث الحالية
            </div>
          ) : (
            filteredKeys.map((item) => {
              const currentValue = getTranslationValue(selectedTranslateLang, item.key, item.defaultAr);
              const isOverridden = Boolean(customTranslations[selectedTranslateLang]?.[item.key]);

              return (
                <div key={item.key} className="p-3.5 grid grid-cols-12 items-center gap-3 hover:bg-neutral-50/70 transition">
                  {/* Key Info */}
                  <div className="col-span-12 sm:col-span-4 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-neutral-900 text-xs">{item.key}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                        {item.category}
                      </span>
                      {isOverridden && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          مخصص
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 block leading-tight">{item.descriptionAr}</span>
                  </div>

                  {/* Original Arabic */}
                  <div className="col-span-12 sm:col-span-4 text-neutral-800 bg-[#fbf8f5] p-2.5 rounded-lg border border-[#ede5dd] font-medium leading-relaxed">
                    {item.defaultAr}
                  </div>

                  {/* Target Translation Input with Reset */}
                  <div className="col-span-12 sm:col-span-4 flex items-center gap-1.5">
                    <input
                      type="text"
                      dir={currentLangObj?.direction || 'ltr'}
                      value={currentValue}
                      onChange={(e) => handleUpdateTranslation(selectedTranslateLang, item.key, e.target.value)}
                      placeholder={`Enter translation in ${currentLangObj?.nameNative}...`}
                      className={`flex-1 p-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#9b4c2e] focus:ring-1 focus:ring-[#9b4c2e] ${
                        currentLangObj?.direction === 'rtl' ? 'text-right' : 'text-left'
                      }`}
                    />
                    {isOverridden && (
                      <button
                        type="button"
                        onClick={() => handleResetTranslation(selectedTranslateLang, item.key)}
                        title="استعادة النص الافتراضي"
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Save Prompt */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-neutral-400">
            * التعديلات تحفظ محلياً في الذاكرة حتى تضغط على زر الحفظ والمزامنة مع Firestore
          </span>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ القاموس في Firestore</span>
          </button>
        </div>

      </div>

      {/* Add New Language Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs font-cairo">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-black text-sm sm:text-base text-neutral-900 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#9b4c2e]" />
                <span>إضافة لغة جديدة إلى النظام</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLanguage} className="space-y-3">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">رمز اللغة الدولي (ISO 639-1) *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={newLangForm.code}
                  onChange={(e) => setNewLangForm({ ...newLangForm, code: e.target.value.toLowerCase() })}
                  placeholder="مثال: ur, de, es, ms"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono focus:outline-none focus:border-[#9b4c2e]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">اسم اللغة بلغتها الأصلية (Native Name) *</label>
                <input
                  type="text"
                  required
                  value={newLangForm.nameNative}
                  onChange={(e) => setNewLangForm({ ...newLangForm, nameNative: e.target.value })}
                  placeholder="مثال: اردو، Deutsch، Español"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#9b4c2e]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">اسم اللغة بالعربية</label>
                <input
                  type="text"
                  value={newLangForm.nameAr}
                  onChange={(e) => setNewLangForm({ ...newLangForm, nameAr: e.target.value })}
                  placeholder="مثال: الأردية، الألمانية، الإسبانية"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#9b4c2e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">علم الدولة/اللغة</label>
                  <input
                    type="text"
                    value={newLangForm.flag}
                    onChange={(e) => setNewLangForm({ ...newLangForm, flag: e.target.value })}
                    placeholder="🇵🇰"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-lg focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">اتجاه الكتابة</label>
                  <select
                    value={newLangForm.direction}
                    onChange={(e) => setNewLangForm({ ...newLangForm, direction: e.target.value as 'rtl' | 'ltr' })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold focus:outline-none focus:border-[#9b4c2e]"
                  >
                    <option value="ltr">من اليسار لليمين (LTR)</option>
                    <option value="rtl">من اليمين لليسار (RTL)</option>
                  </select>
                </div>
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
                  إضافة وتفعيل اللغة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
