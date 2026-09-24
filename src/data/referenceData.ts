// Normalized Reference Database for Meethaq Islamic Matrimonial Platform

export interface Country {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
}

export interface Region {
  id: string;
  countryId: string;
  nameAr: string;
  nameEn: string;
}

export interface City {
  id: string;
  regionId: string;
  countryId: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lon: number;
}

export interface Nationality {
  id: string;
  nameAr: string;
  nameEn: string;
  countryCode: string;
}

export interface EducationLevel {
  id: string;
  nameAr: string;
  nameEn: string;
  rank: number;
}

export interface FieldOfStudy {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
}

export interface JobCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface Occupation {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
}

export interface LanguageItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
}

export type LanguageProficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';

export interface UserLanguage {
  languageId: string;
  languageName: string;
  level: LanguageProficiency;
}

// 1. Countries
export const COUNTRIES: Country[] = [
  { id: 'SA', code: 'SA', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'AE', code: 'AE', nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'KW', code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼' },
  { id: 'QA', code: 'QA', nameAr: 'قطر', nameEn: 'Qatar', flag: '🇶🇦' },
  { id: 'OM', code: 'OM', nameAr: 'سلطنة عمان', nameEn: 'Oman', flag: '🇴🇲' },
  { id: 'BH', code: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭' },
  { id: 'EG', code: 'EG', nameAr: 'مصر', nameEn: 'Egypt', flag: '🇪🇬' },
  { id: 'JO', code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', flag: '🇯🇴' },
  { id: 'MA', code: 'MA', nameAr: 'المغرب', nameEn: 'Morocco', flag: '🇲🇦' },
  { id: 'DZ', code: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria', flag: '🇩🇿' },
  { id: 'TN', code: 'TN', nameAr: 'تونس', nameEn: 'Tunisia', flag: '🇹🇳' },
  { id: 'TR', code: 'TR', nameAr: 'تركيا', nameEn: 'Turkey', flag: '🇹🇷' },
  { id: 'GB', code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { id: 'US', code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States', flag: '🇺🇸' },
  { id: 'CA', code: 'CA', nameAr: 'كندا', nameEn: 'Canada', flag: '🇨🇦' },
  { id: 'FR', code: 'FR', nameAr: 'فرنسا', nameEn: 'France', flag: '🇫🇷' },
  { id: 'DE', code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', flag: '🇩🇪' },
  { id: 'ID', code: 'ID', nameAr: 'إندونيسيا', nameEn: 'Indonesia', flag: '🇮🇩' },
  { id: 'MY', code: 'MY', nameAr: 'ماليزيا', nameEn: 'Malaysia', flag: '🇲🇾' },
  { id: 'PK', code: 'PK', nameAr: 'باكستان', nameEn: 'Pakistan', flag: '🇵🇰' }
];

// 2. Regions
export const REGIONS: Region[] = [
  // Saudi Arabia
  { id: 'SA-RIY', countryId: 'SA', nameAr: 'منطقة الرياض', nameEn: 'Riyadh Region' },
  { id: 'SA-MAK', countryId: 'SA', nameAr: 'منطقة مكة المكرمة', nameEn: 'Makkah Region' },
  { id: 'SA-SHR', countryId: 'SA', nameAr: 'المنطقة الشرقية', nameEn: 'Eastern Province' },
  { id: 'SA-MAD', countryId: 'SA', nameAr: 'منطقة المدينة المنورة', nameEn: 'Madinah Region' },
  { id: 'SA-QAS', countryId: 'SA', nameAr: 'منطقة القصيم', nameEn: 'Qassim Region' },
  { id: 'SA-ASR', countryId: 'SA', nameAr: 'منطقة عسير', nameEn: 'Asir Region' },

  // UAE
  { id: 'AE-DXB', countryId: 'AE', nameAr: 'إمارة دبي', nameEn: 'Dubai' },
  { id: 'AE-AUH', countryId: 'AE', nameAr: 'إمارة أبوظبي', nameEn: 'Abu Dhabi' },
  { id: 'AE-SHJ', countryId: 'AE', nameAr: 'إمارة الشارقة', nameEn: 'Sharjah' },

  // Egypt
  { id: 'EG-CAI', countryId: 'EG', nameAr: 'محافظة القاهرة', nameEn: 'Cairo Governorate' },
  { id: 'EG-ALX', countryId: 'EG', nameAr: 'محافظة الإسكندرية', nameEn: 'Alexandria Governorate' },
  { id: 'EG-GIZ', countryId: 'EG', nameAr: 'محافظة الجيزة', nameEn: 'Giza Governorate' },

  // Jordan
  { id: 'JO-AMM', countryId: 'JO', nameAr: 'محافظة العاصمة', nameEn: 'Amman Governorate' },
  { id: 'JO-IRB', countryId: 'JO', nameAr: 'محافظة إربد', nameEn: 'Irbid Governorate' },

  // Morocco
  { id: 'MA-RAB', countryId: 'MA', nameAr: 'جهة الرباط - سلا - القنيطرة', nameEn: 'Rabat-Sale-Kenitra' },
  { id: 'MA-CAS', countryId: 'MA', nameAr: 'جهة الدار البيضاء - سطات', nameEn: 'Casablanca-Settat' },

  // Turkey
  { id: 'TR-IST', countryId: 'TR', nameAr: 'منطقة إسطنبول', nameEn: 'Istanbul Province' },
  { id: 'TR-ANK', countryId: 'TR', nameAr: 'منطقة أنقرة', nameEn: 'Ankara Province' },

  // UK
  { id: 'GB-LON', countryId: 'GB', nameAr: 'لندن الكبرى', nameEn: 'Greater London' },
  { id: 'GB-MAN', countryId: 'GB', nameAr: 'مانشستر الكبرى', nameEn: 'Greater Manchester' },

  // US
  { id: 'US-TX', countryId: 'US', nameAr: 'ولاية تكساس', nameEn: 'Texas' },
  { id: 'US-CA', countryId: 'US', nameAr: 'ولاية كاليفورنيا', nameEn: 'California' },
  { id: 'US-IL', countryId: 'US', nameAr: 'ولاية إلينوي', nameEn: 'Illinois' },

  // France
  { id: 'FR-IDF', countryId: 'FR', nameAr: 'إيل دو فرانس (باريس)', nameEn: 'Île-de-France' },

  // Indonesia
  { id: 'ID-JKT', countryId: 'ID', nameAr: 'جاكرتا الكبرى', nameEn: 'Jakarta' },
  { id: 'ID-WJA', countryId: 'ID', nameAr: 'جاوة الغربية', nameEn: 'West Java' }
];

// 3. Cities with coordinates for distance matching
export const CITIES: City[] = [
  // Saudi Arabia
  { id: 'SA-RUH', regionId: 'SA-RIY', countryId: 'SA', nameAr: 'الرياض', nameEn: 'Riyadh', lat: 24.7136, lon: 46.6753 },
  { id: 'SA-KHA', regionId: 'SA-RIY', countryId: 'SA', nameAr: 'الخرج', nameEn: 'Al Kharj', lat: 24.1554, lon: 47.3119 },
  { id: 'SA-JED', regionId: 'SA-MAK', countryId: 'SA', nameAr: 'جدة', nameEn: 'Jeddah', lat: 21.5433, lon: 39.1728 },
  { id: 'SA-MAK', regionId: 'SA-MAK', countryId: 'SA', nameAr: 'مكة المكرمة', nameEn: 'Makkah', lat: 21.4225, lon: 39.8262 },
  { id: 'SA-TAI', regionId: 'SA-MAK', countryId: 'SA', nameAr: 'الطائف', nameEn: 'Taif', lat: 21.2854, lon: 40.4222 },
  { id: 'SA-DAM', regionId: 'SA-SHR', countryId: 'SA', nameAr: 'الدمام', nameEn: 'Dammam', lat: 26.4207, lon: 50.0888 },
  { id: 'SA-KHO', regionId: 'SA-SHR', countryId: 'SA', nameAr: 'الخبر', nameEn: 'Khobar', lat: 26.2172, lon: 50.1971 },
  { id: 'SA-MED', regionId: 'SA-MAD', countryId: 'SA', nameAr: 'المدينة المنورة', nameEn: 'Madinah', lat: 24.5247, lon: 39.5692 },
  { id: 'SA-BUR', regionId: 'SA-QAS', countryId: 'SA', nameAr: 'بريدة', nameEn: 'Buraidah', lat: 26.3592, lon: 43.9818 },
  { id: 'SA-ABH', regionId: 'SA-ASR', countryId: 'SA', nameAr: 'أبها', nameEn: 'Abha', lat: 18.2164, lon: 42.5053 },

  // UAE
  { id: 'AE-DXB-C', regionId: 'AE-DXB', countryId: 'AE', nameAr: 'دبي', nameEn: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { id: 'AE-AUH-C', regionId: 'AE-AUH', countryId: 'AE', nameAr: 'أبوظبي', nameEn: 'Abu Dhabi', lat: 24.4539, lon: 54.3773 },
  { id: 'AE-SHJ-C', regionId: 'AE-SHJ', countryId: 'AE', nameAr: 'الشارقة', nameEn: 'Sharjah', lat: 25.3463, lon: 55.4209 },

  // Egypt
  { id: 'EG-CAI-C', regionId: 'EG-CAI', countryId: 'EG', nameAr: 'القاهرة', nameEn: 'Cairo', lat: 30.0444, lon: 31.2357 },
  { id: 'EG-ALX-C', regionId: 'EG-ALX', countryId: 'EG', nameAr: 'الإسكندرية', nameEn: 'Alexandria', lat: 31.2001, lon: 29.9187 },
  { id: 'EG-GIZ-C', regionId: 'EG-GIZ', countryId: 'EG', nameAr: 'الجيزة', nameEn: 'Giza', lat: 30.0131, lon: 31.2089 },

  // Jordan
  { id: 'JO-AMM-C', regionId: 'JO-AMM', countryId: 'JO', nameAr: 'عمان', nameEn: 'Amman', lat: 31.9454, lon: 35.9284 },
  { id: 'JO-IRB-C', regionId: 'JO-IRB', countryId: 'JO', nameAr: 'إربد', nameEn: 'Irbid', lat: 32.5568, lon: 35.8469 },

  // Morocco
  { id: 'MA-RAB-C', regionId: 'MA-RAB', countryId: 'MA', nameAr: 'الرباط', nameEn: 'Rabat', lat: 34.0209, lon: -6.8416 },
  { id: 'MA-CAS-C', regionId: 'MA-CAS', countryId: 'MA', nameAr: 'الدار البيضاء', nameEn: 'Casablanca', lat: 33.5731, lon: -7.5898 },

  // Turkey
  { id: 'TR-IST-C', regionId: 'TR-IST', countryId: 'TR', nameAr: 'إسطنبول', nameEn: 'Istanbul', lat: 41.0082, lon: 28.9784 },
  { id: 'TR-ANK-C', regionId: 'TR-ANK', countryId: 'TR', nameAr: 'أنقرة', nameEn: 'Ankara', lat: 39.9334, lon: 32.8597 },

  // UK
  { id: 'GB-LON-C', regionId: 'GB-LON', countryId: 'GB', nameAr: 'لندن', nameEn: 'London', lat: 51.5074, lon: -0.1278 },
  { id: 'GB-MAN-C', regionId: 'GB-MAN', countryId: 'GB', nameAr: 'مانشستر', nameEn: 'Manchester', lat: 53.4808, lon: -2.2426 },

  // US
  { id: 'US-HOU-C', regionId: 'US-TX', countryId: 'US', nameAr: 'هيوستن', nameEn: 'Houston', lat: 29.7604, lon: -95.3698 },
  { id: 'US-CHI-C', regionId: 'US-IL', countryId: 'US', nameAr: 'شيكاغو', nameEn: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { id: 'US-LAX-C', regionId: 'US-CA', countryId: 'US', nameAr: 'لوس أنجلوس', nameEn: 'Los Angeles', lat: 34.0522, lon: -118.2437 },

  // France
  { id: 'FR-PAR-C', regionId: 'FR-IDF', countryId: 'FR', nameAr: 'باريس', nameEn: 'Paris', lat: 48.8566, lon: 2.3522 },

  // Indonesia
  { id: 'ID-JKT-C', regionId: 'ID-JKT', countryId: 'ID', nameAr: 'جاكرتا', nameEn: 'Jakarta', lat: -6.2088, lon: 106.8456 },
  { id: 'ID-BDG-C', regionId: 'ID-WJA', countryId: 'ID', nameAr: 'باندونغ', nameEn: 'Bandung', lat: -6.9175, lon: 107.6191 }
];

// 4. Nationalities
export const NATIONALITIES: Nationality[] = [
  { id: 'nat_sa', countryCode: 'SA', nameAr: 'سعودي / سعودية', nameEn: 'Saudi' },
  { id: 'nat_ae', countryCode: 'AE', nameAr: 'إماراتي / إماراتية', nameEn: 'Emirati' },
  { id: 'nat_kw', countryCode: 'KW', nameAr: 'كويتي / كويتية', nameEn: 'Kuwaiti' },
  { id: 'nat_qa', countryCode: 'QA', nameAr: 'قطري / قطرية', nameEn: 'Qatari' },
  { id: 'nat_om', countryCode: 'OM', nameAr: 'عماني / عمانية', nameEn: 'Omani' },
  { id: 'nat_bh', countryCode: 'BH', nameAr: 'بحريني / بحرينية', nameEn: 'Bahraini' },
  { id: 'nat_eg', countryCode: 'EG', nameAr: 'مصري / مصرية', nameEn: 'Egyptian' },
  { id: 'nat_jo', countryCode: 'JO', nameAr: 'أردني / أردنية', nameEn: 'Jordanian' },
  { id: 'nat_ma', countryCode: 'MA', nameAr: 'مغربي / مغربية', nameEn: 'Moroccan' },
  { id: 'nat_dz', countryCode: 'DZ', nameAr: 'جزائري / جزائرية', nameEn: 'Algerian' },
  { id: 'nat_tn', countryCode: 'TN', nameAr: 'تونسي / تونسية', nameEn: 'Tunisian' },
  { id: 'nat_sy', countryCode: 'SY', nameAr: 'سوري / سورية', nameEn: 'Syrian' },
  { id: 'nat_lb', countryCode: 'LB', nameAr: 'لبناني / لبنانية', nameEn: 'Lebanese' },
  { id: 'nat_ps', countryCode: 'PS', nameAr: 'فلسطيني / فلسطينية', nameEn: 'Palestinian' },
  { id: 'nat_ye', countryCode: 'YE', nameAr: 'يمني / يمنية', nameEn: 'Yemeni' },
  { id: 'nat_sd', countryCode: 'SD', nameAr: 'سوداني / سودانية', nameEn: 'Sudanese' },
  { id: 'nat_tr', countryCode: 'TR', nameAr: 'تركي / تركية', nameEn: 'Turkish' },
  { id: 'nat_gb', countryCode: 'GB', nameAr: 'بريطاني / بريطانية', nameEn: 'British' },
  { id: 'nat_us', countryCode: 'US', nameAr: 'أمريكي / أمريكية', nameEn: 'American' },
  { id: 'nat_ca', countryCode: 'CA', nameAr: 'كندي / كندية', nameEn: 'Canadian' },
  { id: 'nat_fr', countryCode: 'FR', nameAr: 'فرنسي / فرنسية', nameEn: 'French' },
  { id: 'nat_de', countryCode: 'DE', nameAr: 'ألماني / ألمانية', nameEn: 'German' },
  { id: 'nat_id', countryCode: 'ID', nameAr: 'إندونيسي / إندونيسية', nameEn: 'Indonesian' },
  { id: 'nat_my', countryCode: 'MY', nameAr: 'ماليزي / ماليزية', nameEn: 'Malaysian' },
  { id: 'nat_pk', countryCode: 'PK', nameAr: 'باكستاني / باكستانية', nameEn: 'Pakistani' },
  { id: 'nat_other', countryCode: 'XX', nameAr: 'جنسية أخرى', nameEn: 'Other Nationality' }
];

// 5. Education Levels
export const EDUCATION_LEVELS: EducationLevel[] = [
  { id: 'high_school', nameAr: 'ثانوية عامة', nameEn: 'High School', rank: 1 },
  { id: 'diploma', nameAr: 'دبلوم مهني / تقني', nameEn: 'Diploma', rank: 2 },
  { id: 'associate', nameAr: 'درجة مشارك', nameEn: 'Associate Degree', rank: 3 },
  { id: 'bachelor', nameAr: 'بكالوريوس', nameEn: "Bachelor's Degree", rank: 4 },
  { id: 'master', nameAr: 'ماجستير', nameEn: "Master's Degree", rank: 5 },
  { id: 'doctorate', nameAr: 'دكتوراه', nameEn: 'Doctorate / PhD', rank: 6 },
  { id: 'other', nameAr: 'مستوى تعليمي آخر', nameEn: 'Other', rank: 0 }
];

// 6. Fields of Study
export const FIELDS_OF_STUDY: FieldOfStudy[] = [
  { id: 'comp_sci', nameAr: 'علوم الحاسب والذكاء الاصطناعي', nameEn: 'Computer Science & AI', category: 'Technology' },
  { id: 'infotech', nameAr: 'تقنية المعلومات ونظم المعلومات', nameEn: 'Information Technology', category: 'Technology' },
  { id: 'soft_eng', nameAr: 'هندسة البرمجيات', nameEn: 'Software Engineering', category: 'Technology' },
  { id: 'medicine', nameAr: 'الطب البشري والجراحة', nameEn: 'Medicine & Surgery', category: 'Healthcare' },
  { id: 'dentistry', nameAr: 'طب وجراحة الفم والأسنان', nameEn: 'Dentistry', category: 'Healthcare' },
  { id: 'pharmacy', nameAr: 'الصيدلة الإكلينيكية والدواء', nameEn: 'Pharmacy', category: 'Healthcare' },
  { id: 'nursing', nameAr: 'التمريض والرعاية الصحية', nameEn: 'Nursing', category: 'Healthcare' },
  { id: 'engineering_civil', nameAr: 'الهندسة المدنية والمعمارية', nameEn: 'Civil & Architectural Engineering', category: 'Engineering' },
  { id: 'engineering_elec', nameAr: 'الهندسة الكهربائية والميكانيكية', nameEn: 'Electrical & Mechanical Engineering', category: 'Engineering' },
  { id: 'law_sharia', nameAr: 'الشريعة الإسلامية والأنظمة القانونية', nameEn: 'Sharia & Islamic Law', category: 'Law' },
  { id: 'biz_admin', nameAr: 'إدارة الأعمال والإدارة العامة', nameEn: 'Business Administration', category: 'Business' },
  { id: 'accounting', nameAr: 'المحاسبة والتدقيق المالي', nameEn: 'Accounting & Auditing', category: 'Business' },
  { id: 'finance', nameAr: 'المالية والمصرفية الإسلامية', nameEn: 'Finance & Islamic Banking', category: 'Business' },
  { id: 'marketing', nameAr: 'التسويق الرقمي والتجارة الإلكترونية', nameEn: 'Marketing & Digital Media', category: 'Business' },
  { id: 'education', nameAr: 'التربية والتعليم والمناهج', nameEn: 'Education & Pedagogy', category: 'Education' },
  { id: 'arts_humanities', nameAr: 'اللغة العربية والآداب والعلوم الإنسانية', nameEn: 'Arabic Literature & Humanities', category: 'Humanities' },
  { id: 'natural_sciences', nameAr: 'العلوم الطبيعية (فيزياء، كيمياء، أحياء)', nameEn: 'Natural Sciences', category: 'Science' },
  { id: 'media_comm', nameAr: 'الإعلام والاتصال الجماهيري', nameEn: 'Media & Mass Communication', category: 'Media' },
  { id: 'other_field', nameAr: 'تخصص أكاديمي آخر', nameEn: 'Other Field of Study', category: 'Other' }
];

// 7. Job Categories & Occupations
export const JOB_CATEGORIES: JobCategory[] = [
  { id: 'it_tech', nameAr: 'تقنية المعلومات والبرمجيات', nameEn: 'IT & Software Development', icon: '💻' },
  { id: 'healthcare', nameAr: 'الرعاية الصحية والطب', nameEn: 'Medicine & Healthcare', icon: '🩺' },
  { id: 'engineering', nameAr: 'الهندسة والتطوير العمراني', nameEn: 'Engineering & Construction', icon: '📐' },
  { id: 'education', nameAr: 'التعليم والبحث الأكاديمي', nameEn: 'Education & Academia', icon: '📚' },
  { id: 'business_finance', nameAr: 'المالية والمحاسبة والمصارف', nameEn: 'Finance, Banking & Accounting', icon: '📊' },
  { id: 'management_hr', nameAr: 'الإدارة والموارد البشرية', nameEn: 'Management & Human Resources', icon: '👔' },
  { id: 'legal_sharia', nameAr: 'الشريعة والقانون والاستشارات', nameEn: 'Legal & Sharia Advisory', icon: '⚖️' },
  { id: 'marketing_sales', nameAr: 'التسويق والمبيعات والإعلام', nameEn: 'Marketing, Sales & Media', icon: '📣' },
  { id: 'government', nameAr: 'القطاع الحكومي والخدمة المدنية', nameEn: 'Government & Public Sector', icon: '🏛️' },
  { id: 'entrepreneur', nameAr: 'ريادة الأعمال والأعمال الحرة', nameEn: 'Entrepreneurship & Business Owners', icon: '🚀' },
  { id: 'skilled_trades', nameAr: 'المهن الفنية المتخصصة', nameEn: 'Skilled Trades & Technical', icon: '🛠️' },
  { id: 'student', nameAr: 'طالب جامعي / دراسات عليا', nameEn: 'Student (Undergrad/Postgrad)', icon: '🎓' },
  { id: 'retired', nameAr: 'متقاعد / متفرغ', nameEn: 'Retired', icon: '🌿' },
  { id: 'other_job', nameAr: 'مجال وظيفي آخر', nameEn: 'Other Occupation', icon: '💼' }
];

export const OCCUPATIONS: Occupation[] = [
  // IT & Tech
  { id: 'occ_soft_eng', categoryId: 'it_tech', nameAr: 'مهندس برمجيات / مطور ويب وتطبيقات', nameEn: 'Software Engineer / Developer' },
  { id: 'occ_sys_arch', categoryId: 'it_tech', nameAr: 'مستشار تقني ومعماري حلول سحابية', nameEn: 'Cloud Solutions Architect / Tech Consultant' },
  { id: 'occ_cyber', categoryId: 'it_tech', nameAr: 'أخصائي أمن سيبراني ومعلومات', nameEn: 'Cybersecurity Specialist' },
  { id: 'occ_data', categoryId: 'it_tech', nameAr: 'عالم بيانات وذكاء اصطناعي', nameEn: 'Data Scientist & AI Specialist' },
  { id: 'occ_ui_ux', categoryId: 'it_tech', nameAr: 'مصمم تجربة وواجهات مستخدم (UI/UX)', nameEn: 'UI/UX Product Designer' },
  { id: 'occ_it_support', categoryId: 'it_tech', nameAr: 'أخصائي دعم نظم وشبكات', nameEn: 'Network & IT Support Specialist' },

  // Healthcare
  { id: 'occ_physician', categoryId: 'healthcare', nameAr: 'طبيب بشري مقيم / أخصائي', nameEn: 'Medical Doctor / Resident Physician' },
  { id: 'occ_dentist', categoryId: 'healthcare', nameAr: 'طبيب أسنان', nameEn: 'Dentist' },
  { id: 'occ_pharmacist', categoryId: 'healthcare', nameAr: 'صيدلي إكلينيكي / باحث دوائي', nameEn: 'Clinical Pharmacist / Drug Researcher' },
  { id: 'occ_nurse', categoryId: 'healthcare', nameAr: 'أخصائي تمريض ورعاية صحية', nameEn: 'Nurse Specialist' },
  { id: 'occ_lab', categoryId: 'healthcare', nameAr: 'أخصائي مختبرات وتحاليل طبية', nameEn: 'Medical Laboratory Specialist' },

  // Engineering
  { id: 'occ_civil_eng', categoryId: 'engineering', nameAr: 'مهندس مدني / استشاري إنشاءات', nameEn: 'Civil / Structural Engineer' },
  { id: 'occ_architect', categoryId: 'engineering', nameAr: 'مهندس معماري ومصمم إسلامي', nameEn: 'Architect / Islamic Heritage Designer' },
  { id: 'occ_mech_eng', categoryId: 'engineering', nameAr: 'مهندس ميكانيكي / صناعي', nameEn: 'Mechanical / Industrial Engineer' },
  { id: 'occ_elec_eng', categoryId: 'engineering', nameAr: 'مهندس كهرباء واتصالات', nameEn: 'Electrical & Telecom Engineer' },

  // Education
  { id: 'occ_prof', categoryId: 'education', nameAr: 'أستاذ جامعي / عضو هيئة تدريس', nameEn: 'University Professor / Faculty Member' },
  { id: 'occ_teacher', categoryId: 'education', nameAr: 'معلم متميز في التعليم العام', nameEn: 'School Teacher' },
  { id: 'occ_islamic_ed', categoryId: 'education', nameAr: 'باحث ومحاضر في العلوم الشرعية والقرآن', nameEn: 'Islamic Studies & Quran Educator' },
  { id: 'occ_counselor', categoryId: 'education', nameAr: 'أخصائي توجيه وإرشاد أسري ونفسي', nameEn: 'Family & Educational Counselor' },

  // Business & Finance
  { id: 'occ_fin_analyst', categoryId: 'business_finance', nameAr: 'محلل مالي واستثمار إسلامي', nameEn: 'Financial Analyst / Islamic Investment Manager' },
  { id: 'occ_accountant', categoryId: 'business_finance', nameAr: 'محاسب قانوني ومراجع حسابات', nameEn: 'Certified Public Accountant (CPA)' },
  { id: 'occ_banker', categoryId: 'business_finance', nameAr: 'مصرفي في البنوك الإسلامية', nameEn: 'Islamic Banking Specialist' },

  // Management & HR
  { id: 'occ_hr_mgr', categoryId: 'management_hr', nameAr: 'مدير / أخصائي موارد بشرية', nameEn: 'HR Manager / Specialist' },
  { id: 'occ_proj_mgr', categoryId: 'management_hr', nameAr: 'مدير مشاريع معتمد (PMP)', nameEn: 'Project Manager (PMP)' },
  { id: 'occ_ops_mgr', categoryId: 'management_hr', nameAr: 'مدير عمليات وتشغيل', nameEn: 'Operations Manager' },

  // Legal & Sharia
  { id: 'occ_lawyer', categoryId: 'legal_sharia', nameAr: 'محامٍ ومستشار نظامي معتمد', nameEn: 'Licensed Attorney / Legal Counsel' },
  { id: 'occ_sharia_res', categoryId: 'legal_sharia', nameAr: 'باحث شرعي ومحكم أسري', nameEn: 'Sharia Legal Researcher / Arbitrator' },

  // Marketing & Sales
  { id: 'occ_mkt_spec', categoryId: 'marketing_sales', nameAr: 'أخصائي تسويق وعلاقات عامة', nameEn: 'Marketing & PR Specialist' },
  { id: 'occ_content', categoryId: 'marketing_sales', nameAr: 'كاتب محتوى وإعلامي هادف', nameEn: 'Content Creator / Media Specialist' },

  // Government & Others
  { id: 'occ_gov_officer', categoryId: 'government', nameAr: 'موظف في القطاع الدبلوماسي أو الحكومي', nameEn: 'Public Sector Officer / Diplomat' },
  { id: 'occ_biz_owner', categoryId: 'entrepreneur', nameAr: 'صاحب أعمال ومؤسس مشروع تجاري', nameEn: 'Business Owner & Founder' },
  { id: 'occ_tradesman', categoryId: 'skilled_trades', nameAr: 'فني متخصص ومرخص', nameEn: 'Licensed Specialist / Contractor' },
  { id: 'occ_student_status', categoryId: 'student', nameAr: 'طالب متفرغ في مرحلة البكالوريوس / الدراسات العليا', nameEn: 'Full-time Student' },
  { id: 'occ_ret_status', categoryId: 'retired', nameAr: 'متقاعد عن العمل ومتفرغ للعبادة والأسرة', nameEn: 'Retired / Family Focused' },
  { id: 'occ_general_other', categoryId: 'other_job', nameAr: 'مهنة أخرى شريفة ومستقرة', nameEn: 'Other Honorable Profession' }
];

// 8. Languages
export const GLOBAL_LANGUAGES: LanguageItem[] = [
  { id: 'lang_ar', code: 'ar', nameAr: 'العربية (لغة القرآن)', nameEn: 'Arabic' },
  { id: 'lang_en', code: 'en', nameAr: 'الإنجليزية', nameEn: 'English' },
  { id: 'lang_fr', code: 'fr', nameAr: 'الفرنسية', nameEn: 'French' },
  { id: 'lang_tr', code: 'tr', nameAr: 'التركية', nameEn: 'Turkish' },
  { id: 'lang_ur', code: 'ur', nameAr: 'الأردية', nameEn: 'Urdu' },
  { id: 'lang_id', code: 'id', nameAr: 'الإندونيسية', nameEn: 'Indonesian' },
  { id: 'lang_ms', code: 'ms', nameAr: 'الماليزية', nameEn: 'Malay' },
  { id: 'lang_de', code: 'de', nameAr: 'الألمانية', nameEn: 'German' },
  { id: 'lang_es', code: 'es', nameAr: 'الإسبانية', nameEn: 'Spanish' },
  { id: 'lang_zh', code: 'zh', nameAr: 'الصينية', nameEn: 'Chinese' },
  { id: 'lang_ru', code: 'ru', nameAr: 'الروسية', nameEn: 'Russian' },
  { id: 'lang_fa', code: 'fa', nameAr: 'الفارسية', nameEn: 'Persian' }
];

// 9. Marital Statuses
export interface MaritalStatusDef {
  id: 'single' | 'divorced' | 'widowed';
  nameAr: string;
  nameEn: string;
}

export const MARITAL_STATUSES: MaritalStatusDef[] = [
  { id: 'single', nameAr: 'لم يسبق له/لها الزواج (بكر / أعزب)', nameEn: 'Never Married' },
  { id: 'divorced', nameAr: 'مطلق / مطلقة', nameEn: 'Divorced' },
  { id: 'widowed', nameAr: 'أرمل / أرملة', nameEn: 'Widowed' }
];

// 10. Report Reasons
export interface ReportReasonDef {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
}

export const REPORT_REASONS: ReportReasonDef[] = [
  { id: 'fake_profile', nameAr: 'ملف وهمي أو غير حقيقي', nameEn: 'Fake Profile', descriptionAr: 'معلومات الحساب غير صحيحة أو مستعارة من شخص آخر' },
  { id: 'harassment', nameAr: 'مضايقة أو إلحاح غير لائق', nameEn: 'Harassment', descriptionAr: 'تواصل متكرر بعد الرفض أو سلوك يسبب الحرج' },
  { id: 'inappropriate_content', nameAr: 'محتوى غير لائق شرعاً', nameEn: 'Inappropriate Content', descriptionAr: 'صور أو عبارات تخالف العفة والضوابط الإسلامية' },
  { id: 'scamming', nameAr: 'محاولة احتيال أو طلب أموال', nameEn: 'Scamming / Financial Request', descriptionAr: 'أي طلب لتحويل مالي أو هدايا أو معاملات تجارية' },
  { id: 'impersonation', nameAr: 'انتحال شخصية أو صفة وهمية', nameEn: 'Impersonation', descriptionAr: 'ادعاء هوية شخص معروف أو مؤسسة' },
  { id: 'offensive_language', nameAr: 'ألفاظ مسيئة أو سباب', nameEn: 'Offensive Language', descriptionAr: 'استخدام ألفاظ نابية أو تجريح في الحديث' },
  { id: 'sexual_content', nameAr: 'محتوى مخل بالآداب والحياء', nameEn: 'Indecent / Sexual Content', descriptionAr: 'مراسلات أو إيحاءات تخل بالحياء وتنافي قصد النكاح الشرعي' },
  { id: 'spam', nameAr: 'رسائل مزعجة أو إعلانات', nameEn: 'Spam / Advertising', descriptionAr: 'إرسال روابط تجارية أو رسائل مكررة غير هادفة' },
  { id: 'suspicious_behavior', nameAr: 'سلوك مريب ومخالفة إشراف الولي', nameEn: 'Suspicious Behavior', descriptionAr: 'محاولة التهرب من إشراف الولي الشرعي أو طلب الخلوة' },
  { id: 'other', nameAr: 'سبب آخر', nameEn: 'Other', descriptionAr: 'ملاحظة أخرى تتطلب مراجعة المشرف العام' }
];

// 11. Distance Matching Options
export const DISTANCE_OPTIONS = [
  { id: 'same_city', valueKm: 0, labelAr: 'نفس المدينة فقط', labelEn: 'Same City' },
  { id: '10', valueKm: 10, labelAr: 'في حدود 10 كم', labelEn: 'Within 10 km' },
  { id: '25', valueKm: 25, labelAr: 'في حدود 25 كم', labelEn: 'Within 25 km' },
  { id: '50', valueKm: 50, labelAr: 'في حدود 50 كم', labelEn: 'Within 50 km' },
  { id: '100', valueKm: 100, labelAr: 'في حدود 100 كم', labelEn: 'Within 100 km' },
  { id: '250', valueKm: 250, labelAr: 'في حدود 250 كم', labelEn: 'Within 250 km' },
  { id: 'same_country', valueKm: 99999, labelAr: 'نفس الدولة بالكامل', labelEn: 'Same Country' },
  { id: 'anywhere', valueKm: 999999, labelAr: 'أي مكان في العالم', labelEn: 'Anywhere' }
];

// Helper: Haversine distance calculator between two coordinates in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper to get formatted approximate distance relative to user city
export function formatApproximateDistance(
  targetCityId?: string,
  userCityId?: string,
  lang: 'ar' | 'en' = 'ar'
): string {
  if (!targetCityId || !userCityId) {
    const target = CITIES.find(c => c.id === targetCityId);
    return target ? (lang === 'ar' ? target.nameAr : target.nameEn) : (lang === 'ar' ? 'الموقع محمي' : 'Location Protected');
  }

  if (targetCityId === userCityId) {
    const city = CITIES.find(c => c.id === targetCityId);
    const cityName = city ? (lang === 'ar' ? city.nameAr : city.nameEn) : '';
    return lang === 'ar' ? `نفس المدينة (${cityName})` : `Same City (${cityName})`;
  }

  const c1 = CITIES.find(c => c.id === userCityId);
  const c2 = CITIES.find(c => c.id === targetCityId);
  if (!c1 || !c2) {
    return c2 ? (lang === 'ar' ? c2.nameAr : c2.nameEn) : '';
  }

  const dist = calculateDistanceKm(c1.lat, c1.lon, c2.lat, c2.lon);
  if (dist < 15) {
    return lang === 'ar' ? `قريب جداً (~ ${dist} كم)` : `Very Close (~ ${dist} km)`;
  }
  return lang === 'ar' ? `~ ${dist} كم تقريباً` : `~ ${dist} km approx`;
}
