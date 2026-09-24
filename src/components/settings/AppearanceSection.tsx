import React from 'react';
import { Language, UserSettings } from '../../types';
import { 
  Globe, 
  Type, 
  Eye, 
  Sparkles, 
  Check, 
  Compass, 
  SunMedium 
} from 'lucide-react';

interface AppearanceSectionProps {
  settings: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
  onLangChange: (newLang: Language) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  settings,
  onChange,
  onLangChange
}) => {
  const appearance = settings.appearance || {
    fontSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    prayerTimesWidget: true
  };

  const updateAppearance = (partial: Partial<NonNullable<UserSettings['appearance']>>) => {
    const updated = { ...appearance, ...partial };
    onChange({ appearance: updated });
  };

  const languages: { code: Language; name: string; native: string; flag: string }[] = [
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
    { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' }
  ];

  return (
    <div className="space-y-6" id="appearance-settings-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50/70 via-stone-50 to-white p-5 rounded-2xl border border-amber-200/60 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <Globe className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-start">
          <h3 className="text-sm font-bold text-neutral-900">
            اللغة وسهولة القراءة للمسلمين حول العالم
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            يدعم ميثاق تعدد اللغات، مع إتاحة خيارات تكبير الخطوط والتباين العالي لراحة كبار السن وأولياء الأمور أثناء تصفح ومراجعة السير الذاتية.
          </p>
        </div>
      </div>

      {/* Language Selection Grid */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Globe className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            لغة واجهة المنصة (Interface Language)
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {languages.map((langItem) => {
            const isSelected = settings.language === langItem.code;
            return (
              <button
                key={langItem.code}
                type="button"
                onClick={() => {
                  onChange({ language: langItem.code });
                  onLangChange(langItem.code);
                }}
                className={`p-3.5 rounded-xl border text-start transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#9b4c2e] bg-amber-50/50 text-neutral-900 ring-1 ring-[#9b4c2e]/40'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/40 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{langItem.flag}</span>
                  <div>
                    <span className="font-bold text-xs block">{langItem.native}</span>
                    <span className="text-[10px] text-neutral-400">{langItem.name}</span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#9b4c2e] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Scaling & Accessibility */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Type className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            حجم الخط وسهولة القراءة (Typography & Accessibility)
          </h4>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'normal', label: 'عادي (قياسي)', sample: 'نص عادي للقراءة' },
            { id: 'large', label: 'كبير (مريح)', sample: 'نص مكبر للقراءة' },
            { id: 'extra_large', label: 'كبير جداً (للأولياء)', sample: 'نص عريض وواضح' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateAppearance({ fontSize: item.id as any })}
              className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                appearance.fontSize === item.id
                  ? 'border-[#9b4c2e] bg-amber-50/50 text-neutral-900 ring-1 ring-[#9b4c2e]/40'
                  : 'border-neutral-200 bg-neutral-50/40 text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <span className="font-bold text-xs block">{item.label}</span>
              <span className="text-[11px] text-neutral-400 mt-1 block">{item.sample}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                نمط التباين العالي (High Contrast)
              </span>
              <span className="text-neutral-500">
                زيادة وضوح النصوص وحواف البطاقات لسهولة الرؤية
              </span>
            </div>
            <input
              type="checkbox"
              checked={appearance.highContrast}
              onChange={(e) => updateAppearance({ highContrast: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                تفعيل شريط أوقات الصلاة والقبلة
              </span>
              <span className="text-neutral-500">
                عرض مواقيت الصلاة لمدينتك للتذكير بأداء الصلوات في أوقاتها
              </span>
            </div>
            <input
              type="checkbox"
              checked={appearance.prayerTimesWidget}
              onChange={(e) => updateAppearance({ prayerTimesWidget: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
