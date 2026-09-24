import { ManagedCountry, ManagedLanguage, LocalizationConfig } from '../types';
import { ALL_WORLD_COUNTRIES } from './worldCountriesData';

export const DEFAULT_MANAGED_LANGUAGES: ManagedLanguage[] = [
  {
    id: 'ar',
    code: 'ar',
    nameNative: 'العربية',
    nameAr: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
    isEnabled: true,
    isDefault: true,
    order: 1,
    translatedPercent: 100
  },
  {
    id: 'en',
    code: 'en',
    nameNative: 'English',
    nameAr: 'الإنجليزية',
    direction: 'ltr',
    flag: '🇬🇧',
    isEnabled: true,
    isDefault: false,
    order: 2,
    translatedPercent: 98
  },
  {
    id: 'fr',
    code: 'fr',
    nameNative: 'Français',
    nameAr: 'الفرنسية',
    direction: 'ltr',
    flag: '🇫🇷',
    isEnabled: true,
    isDefault: false,
    order: 3,
    translatedPercent: 92
  },
  {
    id: 'tr',
    code: 'tr',
    nameNative: 'Türkçe',
    nameAr: 'التركية',
    direction: 'ltr',
    flag: '🇹🇷',
    isEnabled: true,
    isDefault: false,
    order: 4,
    translatedPercent: 88
  },
  {
    id: 'id',
    code: 'id',
    nameNative: 'Bahasa Indonesia',
    nameAr: 'الإندونيسية',
    direction: 'ltr',
    flag: '🇮🇩',
    isEnabled: true,
    isDefault: false,
    order: 5,
    translatedPercent: 94
  }
];

export const DEFAULT_MANAGED_COUNTRIES: ManagedCountry[] = ALL_WORLD_COUNTRIES;

export const DEFAULT_LOCALIZATION_CONFIG: LocalizationConfig = {
  defaultLanguage: 'ar',
  defaultCountryId: 'SA',
  availableLanguages: DEFAULT_MANAGED_LANGUAGES,
  availableCountries: DEFAULT_MANAGED_COUNTRIES,
  customTranslations: {},
  updatedAt: new Date().toISOString(),
  updatedBy: 'النظام الشرعي المركزي'
};
