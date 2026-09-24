import { ManagedCountry } from '../types';

export const ALL_WORLD_COUNTRIES: ManagedCountry[] = [
  // ========================================================
  // 1. ARAB COUNTRIES (الدول العربية والإسلامية)
  // ========================================================
  {
    id: 'SA',
    code: 'SA',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    dialCode: '+966',
    currency: 'SAR',
    currencyNameAr: 'ريال سعودي',
    isEnabled: true,
    isDefault: true,
    order: 1,
    minAge: 18,
    cities: [
      { id: 'SA-RUH', nameAr: 'الرياض', nameEn: 'Riyadh', isEnabled: true },
      { id: 'SA-JED', nameAr: 'جدة', nameEn: 'Jeddah', isEnabled: true },
      { id: 'SA-MAK', nameAr: 'مكة المكرمة', nameEn: 'Makkah', isEnabled: true },
      { id: 'SA-MED', nameAr: 'المدينة المنورة', nameEn: 'Madinah', isEnabled: true },
      { id: 'SA-DAM', nameAr: 'الدمام', nameEn: 'Dammam', isEnabled: true },
      { id: 'SA-KHO', nameAr: 'الخبر', nameEn: 'Khobar', isEnabled: true },
      { id: 'SA-TAI', nameAr: 'الطائف', nameEn: 'Taif', isEnabled: true },
      { id: 'SA-BUR', nameAr: 'بريدة', nameEn: 'Buraidah', isEnabled: true },
      { id: 'SA-ABH', nameAr: 'أبها', nameEn: 'Abha', isEnabled: true },
      { id: 'SA-TAB', nameAr: 'تبوك', nameEn: 'Tabuk', isEnabled: true },
      { id: 'SA-HAI', nameAr: 'حائل', nameEn: 'Hail', isEnabled: true },
      { id: 'SA-NAJ', nameAr: 'نجران', nameEn: 'Najran', isEnabled: true },
      { id: 'SA-JAZ', nameAr: 'جازان', nameEn: 'Jazan', isEnabled: true },
      { id: 'SA-YAN', nameAr: 'ينبع', nameEn: 'Yanbu', isEnabled: true },
      { id: 'SA-AHS', nameAr: 'الأحساء', nameEn: 'Al-Ahsa', isEnabled: true },
      { id: 'SA-JUB', nameAr: 'الجبيل', nameEn: 'Al-Jubail', isEnabled: true }
    ]
  },
  {
    id: 'AE',
    code: 'AE',
    nameAr: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates',
    flag: '🇦🇪',
    dialCode: '+971',
    currency: 'AED',
    currencyNameAr: 'درهم إماراتي',
    isEnabled: true,
    isDefault: false,
    order: 2,
    minAge: 18,
    cities: [
      { id: 'AE-DXB', nameAr: 'دبي', nameEn: 'Dubai', isEnabled: true },
      { id: 'AE-AUH', nameAr: 'أبوظبي', nameEn: 'Abu Dhabi', isEnabled: true },
      { id: 'AE-SHJ', nameAr: 'الشارقة', nameEn: 'Sharjah', isEnabled: true },
      { id: 'AE-AJM', nameAr: 'عجمان', nameEn: 'Ajman', isEnabled: true },
      { id: 'AE-RAK', nameAr: 'رأس الخيمة', nameEn: 'Ras Al Khaimah', isEnabled: true },
      { id: 'AE-FUJ', nameAr: 'الفجيرة', nameEn: 'Fujairah', isEnabled: true },
      { id: 'AE-UAQ', nameAr: 'أم القيوين', nameEn: 'Umm Al Quwain', isEnabled: true },
      { id: 'AE-ALN', nameAr: 'العين', nameEn: 'Al Ain', isEnabled: true }
    ]
  },
  {
    id: 'KW',
    code: 'KW',
    nameAr: 'الكويت',
    nameEn: 'Kuwait',
    flag: '🇰🇼',
    dialCode: '+965',
    currency: 'KWD',
    currencyNameAr: 'دينار كويتي',
    isEnabled: true,
    isDefault: false,
    order: 3,
    minAge: 18,
    cities: [
      { id: 'KW-KWT', nameAr: 'مدينة الكويت', nameEn: 'Kuwait City', isEnabled: true },
      { id: 'KW-HAW', nameAr: 'حولي', nameEn: 'Hawalli', isEnabled: true },
      { id: 'KW-SAL', nameAr: 'السالمية', nameEn: 'Salmiya', isEnabled: true },
      { id: 'KW-FAH', nameAr: 'الفحيحيل', nameEn: 'Fahaheel', isEnabled: true },
      { id: 'KW-JAH', nameAr: 'الجهراء', nameEn: 'Al Jahra', isEnabled: true },
      { id: 'KW-AHM', nameAr: 'الأحمدي', nameEn: 'Al Ahmadi', isEnabled: true },
      { id: 'KW-FAR', nameAr: 'الفروانية', nameEn: 'Al Farwaniyah', isEnabled: true }
    ]
  },
  {
    id: 'QA',
    code: 'QA',
    nameAr: 'قطر',
    nameEn: 'Qatar',
    flag: '🇶🇦',
    dialCode: '+974',
    currency: 'QAR',
    currencyNameAr: 'ريال قطري',
    isEnabled: true,
    isDefault: false,
    order: 4,
    minAge: 18,
    cities: [
      { id: 'QA-DOH', nameAr: 'الدوحة', nameEn: 'Doha', isEnabled: true },
      { id: 'QA-RAY', nameAr: 'الريان', nameEn: 'Al Rayyan', isEnabled: true },
      { id: 'QA-WAK', nameAr: 'الوكرة', nameEn: 'Al Wakrah', isEnabled: true },
      { id: 'QA-KHO', nameAr: 'الخور', nameEn: 'Al Khor', isEnabled: true },
      { id: 'QA-UMS', nameAr: 'أم صلال', nameEn: 'Umm Salal', isEnabled: true },
      { id: 'QA-DAA', nameAr: 'الظعاين', nameEn: 'Al Daayen', isEnabled: true }
    ]
  },
  {
    id: 'BH',
    code: 'BH',
    nameAr: 'البحرين',
    nameEn: 'Bahrain',
    flag: '🇧🇭',
    dialCode: '+973',
    currency: 'BHD',
    currencyNameAr: 'دينار بحريني',
    isEnabled: true,
    isDefault: false,
    order: 5,
    minAge: 18,
    cities: [
      { id: 'BH-MAN', nameAr: 'المنامة', nameEn: 'Manama', isEnabled: true },
      { id: 'BH-MUH', nameAr: 'المحرق', nameEn: 'Muharraq', isEnabled: true },
      { id: 'BH-RIF', nameAr: 'الرفاع', nameEn: 'Riffa', isEnabled: true },
      { id: 'BH-SIT', nameAr: 'سترة', nameEn: 'Sitra', isEnabled: true },
      { id: 'BH-ISA', nameAr: 'مدينة عيسى', nameEn: 'Isa Town', isEnabled: true },
      { id: 'BH-HAM', nameAr: 'مدينة حمد', nameEn: 'Hamad Town', isEnabled: true }
    ]
  },
  {
    id: 'OM',
    code: 'OM',
    nameAr: 'سلطنة عمان',
    nameEn: 'Oman',
    flag: '🇴🇲',
    dialCode: '+968',
    currency: 'OMR',
    currencyNameAr: 'ريال عماني',
    isEnabled: true,
    isDefault: false,
    order: 6,
    minAge: 18,
    cities: [
      { id: 'OM-MCT', nameAr: 'مسقط', nameEn: 'Muscat', isEnabled: true },
      { id: 'OM-SLL', nameAr: 'صلالة', nameEn: 'Salalah', isEnabled: true },
      { id: 'OM-SOH', nameAr: 'صحار', nameEn: 'Sohar', isEnabled: true },
      { id: 'OM-NIZ', nameAr: 'نزوى', nameEn: 'Nizwa', isEnabled: true },
      { id: 'OM-SUR', nameAr: 'صور', nameEn: 'Sur', isEnabled: true },
      { id: 'OM-SEE', nameAr: 'السيب', nameEn: 'Seeb', isEnabled: true },
      { id: 'OM-MAT', nameAr: 'مطرح', nameEn: 'Muttrah', isEnabled: true }
    ]
  },
  {
    id: 'EG',
    code: 'EG',
    nameAr: 'مصر',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    dialCode: '+20',
    currency: 'EGP',
    currencyNameAr: 'جنيه مصري',
    isEnabled: true,
    isDefault: false,
    order: 7,
    minAge: 18,
    cities: [
      { id: 'EG-CAI', nameAr: 'القاهرة', nameEn: 'Cairo', isEnabled: true },
      { id: 'EG-ALX', nameAr: 'الإسكندرية', nameEn: 'Alexandria', isEnabled: true },
      { id: 'EG-GIZ', nameAr: 'الجيزة', nameEn: 'Giza', isEnabled: true },
      { id: 'EG-MAN', nameAr: 'المنصورة', nameEn: 'Mansoura', isEnabled: true },
      { id: 'EG-TAN', nameAr: 'طنطا', nameEn: 'Tanta', isEnabled: true },
      { id: 'EG-PSD', nameAr: 'بورسعيد', nameEn: 'Port Said', isEnabled: true },
      { id: 'EG-SUZ', nameAr: 'السويس', nameEn: 'Suez', isEnabled: true },
      { id: 'EG-ZAG', nameAr: 'الزقازيق', nameEn: 'Zagazig', isEnabled: true },
      { id: 'EG-ASY', nameAr: 'أسيوط', nameEn: 'Asyut', isEnabled: true },
      { id: 'EG-FAY', nameAr: 'الفيوم', nameEn: 'Fayoum', isEnabled: true },
      { id: 'EG-ISM', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', isEnabled: true },
      { id: 'EG-ASW', nameAr: 'أسوان', nameEn: 'Aswan', isEnabled: true },
      { id: 'EG-LUX', nameAr: 'الأقصر', nameEn: 'Luxor', isEnabled: true },
      { id: 'EG-DAM', nameAr: 'دمياط', nameEn: 'Damietta', isEnabled: true },
      { id: 'EG-MIN', nameAr: 'المنيا', nameEn: 'Minya', isEnabled: true },
      { id: 'EG-SOH', nameAr: 'سوهاج', nameEn: 'Sohag', isEnabled: true }
    ]
  },
  {
    id: 'JO',
    code: 'JO',
    nameAr: 'الأردن',
    nameEn: 'Jordan',
    flag: '🇯🇴',
    dialCode: '+962',
    currency: 'JOD',
    currencyNameAr: 'دينار أردني',
    isEnabled: true,
    isDefault: false,
    order: 8,
    minAge: 18,
    cities: [
      { id: 'JO-AMM', nameAr: 'عمّان', nameEn: 'Amman', isEnabled: true },
      { id: 'JO-IRB', nameAr: 'إربد', nameEn: 'Irbid', isEnabled: true },
      { id: 'JO-ZAR', nameAr: 'الزرقاء', nameEn: 'Zarqa', isEnabled: true },
      { id: 'JO-AQB', nameAr: 'العقبة', nameEn: 'Aqaba', isEnabled: true },
      { id: 'JO-SAL', nameAr: 'السلط', nameEn: 'Salt', isEnabled: true },
      { id: 'JO-MAD', nameAr: 'مادبا', nameEn: 'Madaba', isEnabled: true },
      { id: 'JO-JAR', nameAr: 'جرش', nameEn: 'Jerash', isEnabled: true },
      { id: 'JO-KAR', nameAr: 'الكرك', nameEn: 'Karak', isEnabled: true }
    ]
  },
  {
    id: 'PS',
    code: 'PS',
    nameAr: 'فلسطين',
    nameEn: 'Palestine',
    flag: '🇵🇸',
    dialCode: '+970',
    currency: 'ILS',
    currencyNameAr: 'شيكل / دينار',
    isEnabled: true,
    isDefault: false,
    order: 9,
    minAge: 18,
    cities: [
      { id: 'PS-JER', nameAr: 'القدس الشريف', nameEn: 'Jerusalem', isEnabled: true },
      { id: 'PS-GAZ', nameAr: 'غزة', nameEn: 'Gaza', isEnabled: true },
      { id: 'PS-RAM', nameAr: 'رام الله', nameEn: 'Ramallah', isEnabled: true },
      { id: 'PS-NAB', nameAr: 'نابلس', nameEn: 'Nablus', isEnabled: true },
      { id: 'PS-HEB', nameAr: 'الخليل', nameEn: 'Hebron', isEnabled: true },
      { id: 'PS-JEN', nameAr: 'جنين', nameEn: 'Jenin', isEnabled: true },
      { id: 'PS-BET', nameAr: 'بيت لحم', nameEn: 'Bethlehem', isEnabled: true },
      { id: 'PS-RAF', nameAr: 'رفح', nameEn: 'Rafah', isEnabled: true },
      { id: 'PS-KHA', nameAr: 'خان يونس', nameEn: 'Khan Younis', isEnabled: true },
      { id: 'PS-TUL', nameAr: 'طولكرم', nameEn: 'Tulkarm', isEnabled: true },
      { id: 'PS-QAL', nameAr: 'قلقيلية', nameEn: 'Qalqilya', isEnabled: true }
    ]
  },
  {
    id: 'IQ',
    code: 'IQ',
    nameAr: 'العراق',
    nameEn: 'Iraq',
    flag: '🇮🇶',
    dialCode: '+964',
    currency: 'IQD',
    currencyNameAr: 'دينار عراقي',
    isEnabled: true,
    isDefault: false,
    order: 10,
    minAge: 18,
    cities: [
      { id: 'IQ-BGW', nameAr: 'بغداد', nameEn: 'Baghdad', isEnabled: true },
      { id: 'IQ-BSR', nameAr: 'البصرة', nameEn: 'Basra', isEnabled: true },
      { id: 'IQ-EBL', nameAr: 'أربيل', nameEn: 'Erbil', isEnabled: true },
      { id: 'IQ-MOS', nameAr: 'الموصل', nameEn: 'Mosul', isEnabled: true },
      { id: 'IQ-NAJ', nameAr: 'النجف الأشرف', nameEn: 'Najaf', isEnabled: true },
      { id: 'IQ-KRB', nameAr: 'كربلاء', nameEn: 'Karbala', isEnabled: true },
      { id: 'IQ-SUL', nameAr: 'السليمانية', nameEn: 'Sulaymaniyah', isEnabled: true },
      { id: 'IQ-KRK', nameAr: 'كركوك', nameEn: 'Kirkuk', isEnabled: true },
      { id: 'IQ-HIL', nameAr: 'الحلة', nameEn: 'Hillah', isEnabled: true },
      { id: 'IQ-DOH', nameAr: 'دهوك', nameEn: 'Duhok', isEnabled: true }
    ]
  },
  {
    id: 'SY',
    code: 'SY',
    nameAr: 'سوريا',
    nameEn: 'Syria',
    flag: '🇸🇾',
    dialCode: '+963',
    currency: 'SYP',
    currencyNameAr: 'ليرة سورية',
    isEnabled: true,
    isDefault: false,
    order: 11,
    minAge: 18,
    cities: [
      { id: 'SY-DAM', nameAr: 'دمشق', nameEn: 'Damascus', isEnabled: true },
      { id: 'SY-ALP', nameAr: 'حلب', nameEn: 'Aleppo', isEnabled: true },
      { id: 'SY-HMS', nameAr: 'حمص', nameEn: 'Homs', isEnabled: true },
      { id: 'SY-LAT', nameAr: 'اللاذقية', nameEn: 'Latakia', isEnabled: true },
      { id: 'SY-HMA', nameAr: 'حماة', nameEn: 'Hama', isEnabled: true },
      { id: 'SY-TAR', nameAr: 'طرطوس', nameEn: 'Tartus', isEnabled: true },
      { id: 'SY-DAR', nameAr: 'درعا', nameEn: 'Daraa', isEnabled: true },
      { id: 'SY-IDL', nameAr: 'إدلب', nameEn: 'Idlib', isEnabled: true },
      { id: 'SY-DEI', nameAr: 'دير الزور', nameEn: 'Deir ez-Zor', isEnabled: true }
    ]
  },
  {
    id: 'LB',
    code: 'LB',
    nameAr: 'لبنان',
    nameEn: 'Lebanon',
    flag: '🇱🇧',
    dialCode: '+961',
    currency: 'LBP',
    currencyNameAr: 'ليرة لبنانية',
    isEnabled: true,
    isDefault: false,
    order: 12,
    minAge: 18,
    cities: [
      { id: 'LB-BEY', nameAr: 'بيروت', nameEn: 'Beirut', isEnabled: true },
      { id: 'LB-TRI', nameAr: 'طرابلس', nameEn: 'Tripoli', isEnabled: true },
      { id: 'LB-SID', nameAr: 'صيدا', nameEn: 'Sidon', isEnabled: true },
      { id: 'LB-TYR', nameAr: 'صور', nameEn: 'Tyre', isEnabled: true },
      { id: 'LB-BAA', nameAr: 'بعلبك', nameEn: 'Baalbek', isEnabled: true },
      { id: 'LB-ZAH', nameAr: 'زحلة', nameEn: 'Zahle', isEnabled: true },
      { id: 'LB-JBE', nameAr: 'جبيل', nameEn: 'Byblos', isEnabled: true }
    ]
  },
  {
    id: 'YE',
    code: 'YE',
    nameAr: 'اليمن',
    nameEn: 'Yemen',
    flag: '🇾🇪',
    dialCode: '+967',
    currency: 'YER',
    currencyNameAr: 'ريال يمني',
    isEnabled: true,
    isDefault: false,
    order: 13,
    minAge: 18,
    cities: [
      { id: 'YE-SAN', nameAr: 'صنعاء', nameEn: 'Sanaa', isEnabled: true },
      { id: 'YE-ADE', nameAr: 'عدن', nameEn: 'Aden', isEnabled: true },
      { id: 'YE-TAI', nameAr: 'تعز', nameEn: 'Taiz', isEnabled: true },
      { id: 'YE-HUD', nameAr: 'الحديدة', nameEn: 'Hodeidah', isEnabled: true },
      { id: 'YE-MUK', nameAr: 'المكلا', nameEn: 'Mukalla', isEnabled: true },
      { id: 'YE-IBB', nameAr: 'إب', nameEn: 'Ibb', isEnabled: true },
      { id: 'YE-DHA', nameAr: 'ذمار', nameEn: 'Dhamar', isEnabled: true },
      { id: 'YE-MAR', nameAr: 'مأرب', nameEn: 'Marib', isEnabled: true }
    ]
  },
  {
    id: 'MA',
    code: 'MA',
    nameAr: 'المغرب',
    nameEn: 'Morocco',
    flag: '🇲🇦',
    dialCode: '+212',
    currency: 'MAD',
    currencyNameAr: 'درهم مغربي',
    isEnabled: true,
    isDefault: false,
    order: 14,
    minAge: 18,
    cities: [
      { id: 'MA-RBA', nameAr: 'الرباط', nameEn: 'Rabat', isEnabled: true },
      { id: 'MA-CAS', nameAr: 'الدار البيضاء', nameEn: 'Casablanca', isEnabled: true },
      { id: 'MA-RAK', nameAr: 'مراكش', nameEn: 'Marrakech', isEnabled: true },
      { id: 'MA-FES', nameAr: 'فاس', nameEn: 'Fes', isEnabled: true },
      { id: 'MA-TNG', nameAr: 'طنجة', nameEn: 'Tangier', isEnabled: true },
      { id: 'MA-AGA', nameAr: 'أغادير', nameEn: 'Agadir', isEnabled: true },
      { id: 'MA-MEK', nameAr: 'مكناس', nameEn: 'Meknes', isEnabled: true },
      { id: 'MA-OUJ', nameAr: 'وجدة', nameEn: 'Oujda', isEnabled: true },
      { id: 'MA-TET', nameAr: 'تطوان', nameEn: 'Tetouan', isEnabled: true },
      { id: 'MA-KEN', nameAr: 'القنيطرة', nameEn: 'Kenitra', isEnabled: true }
    ]
  },
  {
    id: 'DZ',
    code: 'DZ',
    nameAr: 'الجزائر',
    nameEn: 'Algeria',
    flag: '🇩🇿',
    dialCode: '+213',
    currency: 'DZD',
    currencyNameAr: 'دينار جزائري',
    isEnabled: true,
    isDefault: false,
    order: 15,
    minAge: 18,
    cities: [
      { id: 'DZ-ALG', nameAr: 'الجزائر العاصمة', nameEn: 'Algiers', isEnabled: true },
      { id: 'DZ-ORN', nameAr: 'وهران', nameEn: 'Oran', isEnabled: true },
      { id: 'DZ-CST', nameAr: 'قسنطينة', nameEn: 'Constantine', isEnabled: true },
      { id: 'DZ-ANN', nameAr: 'عنابة', nameEn: 'Annaba', isEnabled: true },
      { id: 'DZ-SET', nameAr: 'سطيف', nameEn: 'Setif', isEnabled: true },
      { id: 'DZ-BAT', nameAr: 'باتنة', nameEn: 'Batna', isEnabled: true },
      { id: 'DZ-TLE', nameAr: 'تلمسان', nameEn: 'Tlemcen', isEnabled: true },
      { id: 'DZ-BEJ', nameAr: 'بجاية', nameEn: 'Bejaia', isEnabled: true },
      { id: 'DZ-BIS', nameAr: 'بسكرة', nameEn: 'Biskra', isEnabled: true }
    ]
  },
  {
    id: 'TN',
    code: 'TN',
    nameAr: 'تونس',
    nameEn: 'Tunisia',
    flag: '🇹🇳',
    dialCode: '+216',
    currency: 'TND',
    currencyNameAr: 'دينار تونسي',
    isEnabled: true,
    isDefault: false,
    order: 16,
    minAge: 18,
    cities: [
      { id: 'TN-TUN', nameAr: 'تونس العاصمة', nameEn: 'Tunis', isEnabled: true },
      { id: 'TN-SFA', nameAr: 'صفاقس', nameEn: 'Sfax', isEnabled: true },
      { id: 'TN-SOU', nameAr: 'سوسة', nameEn: 'Sousse', isEnabled: true },
      { id: 'TN-KAI', nameAr: 'القيروان', nameEn: 'Kairouan', isEnabled: true },
      { id: 'TN-BIZ', nameAr: 'بنزرت', nameEn: 'Bizerte', isEnabled: true },
      { id: 'TN-GAB', nameAr: 'قابس', nameEn: 'Gabes', isEnabled: true },
      { id: 'TN-MON', nameAr: 'المنستير', nameEn: 'Monastir', isEnabled: true }
    ]
  },
  {
    id: 'LY',
    code: 'LY',
    nameAr: 'ليبيا',
    nameEn: 'Libya',
    flag: '🇱🇾',
    dialCode: '+218',
    currency: 'LYD',
    currencyNameAr: 'دينار ليبي',
    isEnabled: true,
    isDefault: false,
    order: 17,
    minAge: 18,
    cities: [
      { id: 'LY-TIP', nameAr: 'طرابلس', nameEn: 'Tripoli', isEnabled: true },
      { id: 'LY-BEN', nameAr: 'بنغازي', nameEn: 'Benghazi', isEnabled: true },
      { id: 'LY-MIS', nameAr: 'مصراتة', nameEn: 'Misrata', isEnabled: true },
      { id: 'LY-BAY', nameAr: 'البيضاء', nameEn: 'Bayda', isEnabled: true },
      { id: 'LY-ZAW', nameAr: 'الزاوية', nameEn: 'Zawiya', isEnabled: true },
      { id: 'LY-TOB', nameAr: 'طبرق', nameEn: 'Tobruk', isEnabled: true },
      { id: 'LY-SEB', nameAr: 'سبها', nameEn: 'Sabha', isEnabled: true }
    ]
  },
  {
    id: 'SD',
    code: 'SD',
    nameAr: 'السودان',
    nameEn: 'Sudan',
    flag: '🇸🇩',
    dialCode: '+249',
    currency: 'SDG',
    currencyNameAr: 'جنيه سوداني',
    isEnabled: true,
    isDefault: false,
    order: 18,
    minAge: 18,
    cities: [
      { id: 'SD-KRT', nameAr: 'الخرطوم', nameEn: 'Khartoum', isEnabled: true },
      { id: 'SD-OMD', nameAr: 'أم درمان', nameEn: 'Omdurman', isEnabled: true },
      { id: 'SD-PTS', nameAr: 'بورتسودان', nameEn: 'Port Sudan', isEnabled: true },
      { id: 'SD-KAS', nameAr: 'كسلا', nameEn: 'Kassala', isEnabled: true },
      { id: 'SD-OBE', nameAr: 'الأبيض', nameEn: 'El Obeid', isEnabled: true },
      { id: 'SD-WAD', nameAr: 'واد مدني', nameEn: 'Wad Madani', isEnabled: true }
    ]
  },
  {
    id: 'MR',
    code: 'MR',
    nameAr: 'موريتانيا',
    nameEn: 'Mauritania',
    flag: '🇲🇷',
    dialCode: '+222',
    currency: 'MRU',
    currencyNameAr: 'أوقية موريتانية',
    isEnabled: true,
    isDefault: false,
    order: 19,
    minAge: 18,
    cities: [
      { id: 'MR-NKC', nameAr: 'نواكشوط', nameEn: 'Nouakchott', isEnabled: true },
      { id: 'MR-NDB', nameAr: 'نواذيبو', nameEn: 'Nouadhibou', isEnabled: true },
      { id: 'MR-KED', nameAr: 'كيهيدي', nameEn: 'Kaedi', isEnabled: true },
      { id: 'MR-ROS', nameAr: 'روصو', nameEn: 'Rosso', isEnabled: true }
    ]
  },
  {
    id: 'SO',
    code: 'SO',
    nameAr: 'الصومال',
    nameEn: 'Somalia',
    flag: '🇸🇴',
    dialCode: '+252',
    currency: 'SOS',
    currencyNameAr: 'شلن صومالي',
    isEnabled: true,
    isDefault: false,
    order: 20,
    minAge: 18,
    cities: [
      { id: 'SO-MGQ', nameAr: 'مقديشو', nameEn: 'Mogadishu', isEnabled: true },
      { id: 'SO-HGA', nameAr: 'هرجيسا', nameEn: 'Hargeisa', isEnabled: true },
      { id: 'SO-BSA', nameAr: 'بوساسو', nameEn: 'Bosaso', isEnabled: true },
      { id: 'SO-KIS', nameAr: 'كسمايو', nameEn: 'Kismayo', isEnabled: true }
    ]
  },
  {
    id: 'DJ',
    code: 'DJ',
    nameAr: 'جيبوتي',
    nameEn: 'Djibouti',
    flag: '🇩🇯',
    dialCode: '+253',
    currency: 'DJF',
    currencyNameAr: 'فرنك جيبوتي',
    isEnabled: true,
    isDefault: false,
    order: 21,
    minAge: 18,
    cities: [
      { id: 'DJ-JIB', nameAr: 'جيبوتي العاصمة', nameEn: 'Djibouti City', isEnabled: true },
      { id: 'DJ-ALI', nameAr: 'علي صبيح', nameEn: 'Ali Sabieh', isEnabled: true },
      { id: 'DJ-TAJ', nameAr: 'تاجورة', nameEn: 'Tadjoura', isEnabled: true }
    ]
  },
  {
    id: 'KM',
    code: 'KM',
    nameAr: 'جزر القمر',
    nameEn: 'Comoros',
    flag: '🇰🇲',
    dialCode: '+269',
    currency: 'KMF',
    currencyNameAr: 'فرنك قمري',
    isEnabled: true,
    isDefault: false,
    order: 22,
    minAge: 18,
    cities: [
      { id: 'KM-HAH', nameAr: 'موروني', nameEn: 'Moroni', isEnabled: true },
      { id: 'KM-MUT', nameAr: 'موتسامودو', nameEn: 'Mutsamudu', isEnabled: true },
      { id: 'KM-FOM', nameAr: 'فومبوني', nameEn: 'Fomboni', isEnabled: true }
    ]
  },

  // ========================================================
  // 2. ISLAMIC & MIDDLE EASTERN NATIONS (العالم الإسلامي)
  // ========================================================
  {
    id: 'TR',
    code: 'TR',
    nameAr: 'تركيا',
    nameEn: 'Turkey',
    flag: '🇹🇷',
    dialCode: '+90',
    currency: 'TRY',
    currencyNameAr: 'ليرة تركية',
    isEnabled: true,
    isDefault: false,
    order: 23,
    minAge: 18,
    cities: [
      { id: 'TR-IST', nameAr: 'إسطنبول', nameEn: 'Istanbul', isEnabled: true },
      { id: 'TR-ANK', nameAr: 'أنقرة', nameEn: 'Ankara', isEnabled: true },
      { id: 'TR-IZM', nameAr: 'إزمير', nameEn: 'Izmir', isEnabled: true },
      { id: 'TR-BUR', nameAr: 'بورصة', nameEn: 'Bursa', isEnabled: true },
      { id: 'TR-ANT', nameAr: 'أنطاليا', nameEn: 'Antalya', isEnabled: true },
      { id: 'TR-GAZ', nameAr: 'غازي عنتاب', nameEn: 'Gaziantep', isEnabled: true },
      { id: 'TR-KON', nameAr: 'قونية', nameEn: 'Konya', isEnabled: true },
      { id: 'TR-ADA', nameAr: 'أضنة', nameEn: 'Adana', isEnabled: true }
    ]
  },
  {
    id: 'MY',
    code: 'MY',
    nameAr: 'ماليزيا',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    dialCode: '+60',
    currency: 'MYR',
    currencyNameAr: 'رينغيت ماليزي',
    isEnabled: true,
    isDefault: false,
    order: 24,
    minAge: 18,
    cities: [
      { id: 'MY-KUL', nameAr: 'كوالالمبور', nameEn: 'Kuala Lumpur', isEnabled: true },
      { id: 'MY-PEN', nameAr: 'جورج تاون (بينانج)', nameEn: 'George Town', isEnabled: true },
      { id: 'MY-JHB', nameAr: 'جوهور باهرو', nameEn: 'Johor Bahru', isEnabled: true },
      { id: 'MY-BKI', nameAr: 'كوتا كينابالو', nameEn: 'Kota Kinabalu', isEnabled: true },
      { id: 'MY-SHA', nameAr: 'شاه علم', nameEn: 'Shah Alam', isEnabled: true },
      { id: 'MY-MLK', nameAr: 'ملقا', nameEn: 'Malacca', isEnabled: true }
    ]
  },
  {
    id: 'ID',
    code: 'ID',
    nameAr: 'إندونيسيا',
    nameEn: 'Indonesia',
    flag: '🇮🇩',
    dialCode: '+62',
    currency: 'IDR',
    currencyNameAr: 'روبية إندونيسية',
    isEnabled: true,
    isDefault: false,
    order: 25,
    minAge: 18,
    cities: [
      { id: 'ID-JKT', nameAr: 'جاكرتا', nameEn: 'Jakarta', isEnabled: true },
      { id: 'ID-SUB', nameAr: 'سورابايا', nameEn: 'Surabaya', isEnabled: true },
      { id: 'ID-BDO', nameAr: 'باندونغ', nameEn: 'Bandung', isEnabled: true },
      { id: 'ID-MES', nameAr: 'ميدان', nameEn: 'Medan', isEnabled: true },
      { id: 'ID-SMG', nameAr: 'سمارانغ', nameEn: 'Semarang', isEnabled: true },
      { id: 'ID-UPG', nameAr: 'ماكاسار', nameEn: 'Makassar', isEnabled: true },
      { id: 'ID-YOG', nameAr: 'يوجياكارتا', nameEn: 'Yogyakarta', isEnabled: true }
    ]
  },
  {
    id: 'PK',
    code: 'PK',
    nameAr: 'باكستان',
    nameEn: 'Pakistan',
    flag: '🇵🇰',
    dialCode: '+92',
    currency: 'PKR',
    currencyNameAr: 'روبية باكستانية',
    isEnabled: true,
    isDefault: false,
    order: 26,
    minAge: 18,
    cities: [
      { id: 'PK-ISB', nameAr: 'إسلام آباد', nameEn: 'Islamabad', isEnabled: true },
      { id: 'PK-KHI', nameAr: 'كراتشي', nameEn: 'Karachi', isEnabled: true },
      { id: 'PK-LHE', nameAr: 'لاهور', nameEn: 'Lahore', isEnabled: true },
      { id: 'PK-RAW', nameAr: 'راولبندي', nameEn: 'Rawalpindi', isEnabled: true },
      { id: 'PK-FSD', nameAr: 'فيصل آباد', nameEn: 'Faisalabad', isEnabled: true },
      { id: 'PK-PEW', nameAr: 'بيشاور', nameEn: 'Peshawar', isEnabled: true },
      { id: 'PK-MUX', nameAr: 'ملتان', nameEn: 'Multan', isEnabled: true }
    ]
  },
  {
    id: 'BD',
    code: 'BD',
    nameAr: 'بنغلاديش',
    nameEn: 'Bangladesh',
    flag: '🇧🇩',
    dialCode: '+880',
    currency: 'BDT',
    currencyNameAr: 'تاكا بنغلاديشية',
    isEnabled: true,
    isDefault: false,
    order: 27,
    minAge: 18,
    cities: [
      { id: 'BD-DAC', nameAr: 'دكا', nameEn: 'Dhaka', isEnabled: true },
      { id: 'BD-CGP', nameAr: 'تشيتاغونغ', nameEn: 'Chittagong', isEnabled: true },
      { id: 'BD-KHL', nameAr: 'خولنا', nameEn: 'Khulna', isEnabled: true },
      { id: 'BD-SYL', nameAr: 'سيلهيت', nameEn: 'Sylhet', isEnabled: true }
    ]
  },
  {
    id: 'IR',
    code: 'IR',
    nameAr: 'إيران',
    nameEn: 'Iran',
    flag: '🇮🇷',
    dialCode: '+98',
    currency: 'IRR',
    currencyNameAr: 'ريال إيراني',
    isEnabled: true,
    isDefault: false,
    order: 28,
    minAge: 18,
    cities: [
      { id: 'IR-THR', nameAr: 'طهران', nameEn: 'Tehran', isEnabled: true },
      { id: 'IR-MHD', nameAr: 'مشهد', nameEn: 'Mashhad', isEnabled: true },
      { id: 'IR-ISF', nameAr: 'أصفهان', nameEn: 'Isfahan', isEnabled: true },
      { id: 'IR-TBZ', nameAr: 'تبريز', nameEn: 'Tabriz', isEnabled: true },
      { id: 'IR-SYZ', nameAr: 'شيراز', nameEn: 'Shiraz', isEnabled: true },
      { id: 'IR-QOM', nameAr: 'قم', nameEn: 'Qom', isEnabled: true }
    ]
  },
  {
    id: 'AF',
    code: 'AF',
    nameAr: 'أفغانستان',
    nameEn: 'Afghanistan',
    flag: '🇦🇫',
    dialCode: '+93',
    currency: 'AFN',
    currencyNameAr: 'أفغاني',
    isEnabled: true,
    isDefault: false,
    order: 29,
    minAge: 18,
    cities: [
      { id: 'AF-KBL', nameAr: 'كابل', nameEn: 'Kabul', isEnabled: true },
      { id: 'AF-KDR', nameAr: 'قندهار', nameEn: 'Kandahar', isEnabled: true },
      { id: 'AF-HRT', nameAr: 'هرات', nameEn: 'Herat', isEnabled: true },
      { id: 'AF-MZR', nameAr: 'مزار شريف', nameEn: 'Mazar-i-Sharif', isEnabled: true }
    ]
  },
  {
    id: 'AZ',
    code: 'AZ',
    nameAr: 'أذربيجان',
    nameEn: 'Azerbaijan',
    flag: '🇦🇿',
    dialCode: '+994',
    currency: 'AZN',
    currencyNameAr: 'مانات أذربيجاني',
    isEnabled: true,
    isDefault: false,
    order: 30,
    minAge: 18,
    cities: [
      { id: 'AZ-BAK', nameAr: 'باكو', nameEn: 'Baku', isEnabled: true },
      { id: 'AZ-GAN', nameAr: 'كنجة', nameEn: 'Ganja', isEnabled: true },
      { id: 'AZ-SUM', nameAr: 'سومقاييت', nameEn: 'Sumqayit', isEnabled: true }
    ]
  },
  {
    id: 'UZ',
    code: 'UZ',
    nameAr: 'أوزبكستان',
    nameEn: 'Uzbekistan',
    flag: '🇺🇿',
    dialCode: '+998',
    currency: 'UZS',
    currencyNameAr: 'سوم أوزبكي',
    isEnabled: true,
    isDefault: false,
    order: 31,
    minAge: 18,
    cities: [
      { id: 'UZ-TAS', nameAr: 'طشقند', nameEn: 'Tashkent', isEnabled: true },
      { id: 'UZ-SKD', nameAr: 'سمرقند', nameEn: 'Samarkand', isEnabled: true },
      { id: 'UZ-BHK', nameAr: 'بخارى', nameEn: 'Bukhara', isEnabled: true },
      { id: 'UZ-NAM', nameAr: 'نامنغان', nameEn: 'Namangan', isEnabled: true }
    ]
  },
  {
    id: 'KZ',
    code: 'KZ',
    nameAr: 'كازاخستان',
    nameEn: 'Kazakhstan',
    flag: '🇰🇿',
    dialCode: '+7',
    currency: 'KZT',
    currencyNameAr: 'تينغ كازاخستاني',
    isEnabled: true,
    isDefault: false,
    order: 32,
    minAge: 18,
    cities: [
      { id: 'KZ-AST', nameAr: 'أستانا', nameEn: 'Astana', isEnabled: true },
      { id: 'KZ-ALA', nameAr: 'ألماتي', nameEn: 'Almaty', isEnabled: true },
      { id: 'KZ-SHY', nameAr: 'شيمكنت', nameEn: 'Shymkent', isEnabled: true }
    ]
  },
  {
    id: 'TM',
    code: 'TM',
    nameAr: 'تركمانستان',
    nameEn: 'Turkmenistan',
    flag: '🇹🇲',
    dialCode: '+993',
    currency: 'TMT',
    currencyNameAr: 'مانات تركماني',
    isEnabled: true,
    isDefault: false,
    order: 33,
    minAge: 18,
    cities: [
      { id: 'TM-ASB', nameAr: 'عشق آباد', nameEn: 'Ashgabat', isEnabled: true },
      { id: 'TM-KRW', nameAr: 'تركمنباشي', nameEn: 'Turkmenbashi', isEnabled: true }
    ]
  },
  {
    id: 'KG',
    code: 'KG',
    nameAr: 'قيرغيزستان',
    nameEn: 'Kyrgyzstan',
    flag: '🇰🇬',
    dialCode: '+996',
    currency: 'KGS',
    currencyNameAr: 'سوم قيرغيزي',
    isEnabled: true,
    isDefault: false,
    order: 34,
    minAge: 18,
    cities: [
      { id: 'KG-FRU', nameAr: 'بيشكك', nameEn: 'Bishkek', isEnabled: true },
      { id: 'KG-OSS', nameAr: 'أوش', nameEn: 'Osh', isEnabled: true }
    ]
  },
  {
    id: 'TJ',
    code: 'TJ',
    nameAr: 'طاجيكستان',
    nameEn: 'Tajikistan',
    flag: '🇹🇯',
    dialCode: '+992',
    currency: 'TJS',
    currencyNameAr: 'ساماني طاجيكي',
    isEnabled: true,
    isDefault: false,
    order: 35,
    minAge: 18,
    cities: [
      { id: 'TJ-DYU', nameAr: 'دوشانبي', nameEn: 'Dushanbe', isEnabled: true },
      { id: 'TJ-LBD', nameAr: 'خجند', nameEn: 'Khujand', isEnabled: true }
    ]
  },
  {
    id: 'BN',
    code: 'BN',
    nameAr: 'بروناي دار السلام',
    nameEn: 'Brunei',
    flag: '🇧🇳',
    dialCode: '+673',
    currency: 'BND',
    currencyNameAr: 'دولار بروني',
    isEnabled: true,
    isDefault: false,
    order: 36,
    minAge: 18,
    cities: [
      { id: 'BN-BWN', nameAr: 'بندر سري بكاوان', nameEn: 'Bandar Seri Begawan', isEnabled: true },
      { id: 'BN-KBA', nameAr: 'كوالا بلايت', nameEn: 'Kuala Belait', isEnabled: true }
    ]
  },
  {
    id: 'MV',
    code: 'MV',
    nameAr: 'المالديف',
    nameEn: 'Maldives',
    flag: '🇲🇻',
    dialCode: '+960',
    currency: 'MVR',
    currencyNameAr: 'روفية مالديفية',
    isEnabled: true,
    isDefault: false,
    order: 37,
    minAge: 18,
    cities: [
      { id: 'MV-MLE', nameAr: 'ماليه', nameEn: 'Male', isEnabled: true },
      { id: 'MV-HUL', nameAr: 'هولهوماليه', nameEn: 'Hulhumale', isEnabled: true }
    ]
  },

  // ========================================================
  // 3. EUROPE (أوروبا والجاليات الإسلامية)
  // ========================================================
  {
    id: 'GB',
    code: 'GB',
    nameAr: 'المملكة المتحدة (بريطانيا)',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    currency: 'GBP',
    currencyNameAr: 'جنيه إسترليني',
    isEnabled: true,
    isDefault: false,
    order: 38,
    minAge: 18,
    cities: [
      { id: 'GB-LON', nameAr: 'لندن', nameEn: 'London', isEnabled: true },
      { id: 'GB-MAN', nameAr: 'مانشستر', nameEn: 'Manchester', isEnabled: true },
      { id: 'GB-BIR', nameAr: 'برمنغهام', nameEn: 'Birmingham', isEnabled: true },
      { id: 'GB-LEE', nameAr: 'ليدز', nameEn: 'Leeds', isEnabled: true },
      { id: 'GB-GLA', nameAr: 'غلاسكو', nameEn: 'Glasgow', isEnabled: true },
      { id: 'GB-LIV', nameAr: 'ليفربول', nameEn: 'Liverpool', isEnabled: true },
      { id: 'GB-EDI', nameAr: 'إدنبرة', nameEn: 'Edinburgh', isEnabled: true }
    ]
  },
  {
    id: 'DE',
    code: 'DE',
    nameAr: 'ألمانيا',
    nameEn: 'Germany',
    flag: '🇩🇪',
    dialCode: '+49',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 39,
    minAge: 18,
    cities: [
      { id: 'DE-BER', nameAr: 'برلين', nameEn: 'Berlin', isEnabled: true },
      { id: 'DE-MUN', nameAr: 'ميونخ', nameEn: 'Munich', isEnabled: true },
      { id: 'DE-FRA', nameAr: 'فرانكفورت', nameEn: 'Frankfurt', isEnabled: true },
      { id: 'DE-HAM', nameAr: 'هامبورغ', nameEn: 'Hamburg', isEnabled: true },
      { id: 'DE-CGN', nameAr: 'كولونيا', nameEn: 'Cologne', isEnabled: true },
      { id: 'DE-STU', nameAr: 'شتوتغارت', nameEn: 'Stuttgart', isEnabled: true },
      { id: 'DE-DUS', nameAr: 'دوسلدورف', nameEn: 'Dusseldorf', isEnabled: true }
    ]
  },
  {
    id: 'FR',
    code: 'FR',
    nameAr: 'فرنسا',
    nameEn: 'France',
    flag: '🇫🇷',
    dialCode: '+33',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 40,
    minAge: 18,
    cities: [
      { id: 'FR-PAR', nameAr: 'باريس', nameEn: 'Paris', isEnabled: true },
      { id: 'FR-MRS', nameAr: 'مارسيليا', nameEn: 'Marseille', isEnabled: true },
      { id: 'FR-LYO', nameAr: 'ليون', nameEn: 'Lyon', isEnabled: true },
      { id: 'FR-TLS', nameAr: 'تولوز', nameEn: 'Toulouse', isEnabled: true },
      { id: 'FR-NCE', nameAr: 'نيس', nameEn: 'Nice', isEnabled: true },
      { id: 'FR-STR', nameAr: 'ستراسبورغ', nameEn: 'Strasbourg', isEnabled: true }
    ]
  },
  {
    id: 'IT',
    code: 'IT',
    nameAr: 'إيطاليا',
    nameEn: 'Italy',
    flag: '🇮🇹',
    dialCode: '+39',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 41,
    minAge: 18,
    cities: [
      { id: 'IT-ROM', nameAr: 'روما', nameEn: 'Rome', isEnabled: true },
      { id: 'IT-MIL', nameAr: 'ميلانو', nameEn: 'Milan', isEnabled: true },
      { id: 'IT-NAP', nameAr: 'نابولي', nameEn: 'Naples', isEnabled: true },
      { id: 'IT-TUR', nameAr: 'تورينو', nameEn: 'Turin', isEnabled: true },
      { id: 'IT-FLO', nameAr: 'فلورنسا', nameEn: 'Florence', isEnabled: true },
      { id: 'IT-VEN', nameAr: 'البندقية', nameEn: 'Venice', isEnabled: true }
    ]
  },
  {
    id: 'ES',
    code: 'ES',
    nameAr: 'إسبانيا',
    nameEn: 'Spain',
    flag: '🇪🇸',
    dialCode: '+34',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 42,
    minAge: 18,
    cities: [
      { id: 'ES-MAD', nameAr: 'مدريد', nameEn: 'Madrid', isEnabled: true },
      { id: 'ES-BCN', nameAr: 'برشلونة', nameEn: 'Barcelona', isEnabled: true },
      { id: 'ES-VAL', nameAr: 'فالنسيا', nameEn: 'Valencia', isEnabled: true },
      { id: 'ES-SEV', nameAr: 'إشبيلية', nameEn: 'Seville', isEnabled: true },
      { id: 'ES-GRA', nameAr: 'غرناطة', nameEn: 'Granada', isEnabled: true },
      { id: 'ES-COR', nameAr: 'قرطبة', nameEn: 'Cordoba', isEnabled: true }
    ]
  },
  {
    id: 'NL',
    code: 'NL',
    nameAr: 'هولندا',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    dialCode: '+31',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 43,
    minAge: 18,
    cities: [
      { id: 'NL-AMS', nameAr: 'أمستردام', nameEn: 'Amsterdam', isEnabled: true },
      { id: 'NL-ROT', nameAr: 'روتردام', nameEn: 'Rotterdam', isEnabled: true },
      { id: 'NL-HAG', nameAr: 'لاهاي', nameEn: 'The Hague', isEnabled: true },
      { id: 'NL-UTR', nameAr: 'أوتريخت', nameEn: 'Utrecht', isEnabled: true }
    ]
  },
  {
    id: 'BE',
    code: 'BE',
    nameAr: 'بلجيكا',
    nameEn: 'Belgium',
    flag: '🇧🇪',
    dialCode: '+32',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 44,
    minAge: 18,
    cities: [
      { id: 'BE-BRU', nameAr: 'بروكسل', nameEn: 'Brussels', isEnabled: true },
      { id: 'BE-ANT', nameAr: 'أنتويرب', nameEn: 'Antwerp', isEnabled: true },
      { id: 'BE-GNT', nameAr: 'غنت', nameEn: 'Ghent', isEnabled: true },
      { id: 'BE-LIE', nameAr: 'لييج', nameEn: 'Liege', isEnabled: true }
    ]
  },
  {
    id: 'CH',
    code: 'CH',
    nameAr: 'سويسرا',
    nameEn: 'Switzerland',
    flag: '🇨🇭',
    dialCode: '+41',
    currency: 'CHF',
    currencyNameAr: 'فرنك سويسري',
    isEnabled: true,
    isDefault: false,
    order: 45,
    minAge: 18,
    cities: [
      { id: 'CH-ZRH', nameAr: 'زيورخ', nameEn: 'Zurich', isEnabled: true },
      { id: 'CH-GVA', nameAr: 'جنيف', nameEn: 'Geneva', isEnabled: true },
      { id: 'CH-BSL', nameAr: 'بازل', nameEn: 'Basel', isEnabled: true },
      { id: 'CH-BRN', nameAr: 'برن', nameEn: 'Bern', isEnabled: true }
    ]
  },
  {
    id: 'AT',
    code: 'AT',
    nameAr: 'النمسا',
    nameEn: 'Austria',
    flag: '🇦🇹',
    dialCode: '+43',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 46,
    minAge: 18,
    cities: [
      { id: 'AT-VIE', nameAr: 'فيينا', nameEn: 'Vienna', isEnabled: true },
      { id: 'AT-GRZ', nameAr: 'غراتس', nameEn: 'Graz', isEnabled: true },
      { id: 'AT-SZG', nameAr: 'سالزبورغ', nameEn: 'Salzburg', isEnabled: true },
      { id: 'AT-LNZ', nameAr: 'لينتس', nameEn: 'Linz', isEnabled: true }
    ]
  },
  {
    id: 'SE',
    code: 'SE',
    nameAr: 'السويد',
    nameEn: 'Sweden',
    flag: '🇸🇪',
    dialCode: '+46',
    currency: 'SEK',
    currencyNameAr: 'كرونة سويدية',
    isEnabled: true,
    isDefault: false,
    order: 47,
    minAge: 18,
    cities: [
      { id: 'SE-STO', nameAr: 'ستوكهولم', nameEn: 'Stockholm', isEnabled: true },
      { id: 'SE-GOT', nameAr: 'غوتنبرغ', nameEn: 'Gothenburg', isEnabled: true },
      { id: 'SE-MAL', nameAr: 'مالمو', nameEn: 'Malmo', isEnabled: true }
    ]
  },
  {
    id: 'NO',
    code: 'NO',
    nameAr: 'النرويج',
    nameEn: 'Norway',
    flag: '🇳🇴',
    dialCode: '+47',
    currency: 'NOK',
    currencyNameAr: 'كرونة نرويجية',
    isEnabled: true,
    isDefault: false,
    order: 48,
    minAge: 18,
    cities: [
      { id: 'NO-OSL', nameAr: 'أوسلو', nameEn: 'Oslo', isEnabled: true },
      { id: 'NO-BGO', nameAr: 'بيرغن', nameEn: 'Bergen', isEnabled: true },
      { id: 'NO-TRD', nameAr: 'تروندهايم', nameEn: 'Trondheim', isEnabled: true }
    ]
  },
  {
    id: 'DK',
    code: 'DK',
    nameAr: 'الدنمارك',
    nameEn: 'Denmark',
    flag: '🇩🇰',
    dialCode: '+45',
    currency: 'DKK',
    currencyNameAr: 'كرونة دنماركية',
    isEnabled: true,
    isDefault: false,
    order: 49,
    minAge: 18,
    cities: [
      { id: 'DK-CPH', nameAr: 'كوبنهاغن', nameEn: 'Copenhagen', isEnabled: true },
      { id: 'DK-AAR', nameAr: 'آرهوس', nameEn: 'Aarhus', isEnabled: true },
      { id: 'DK-ODE', nameAr: 'أودنسه', nameEn: 'Odense', isEnabled: true }
    ]
  },
  {
    id: 'FI',
    code: 'FI',
    nameAr: 'فنلندا',
    nameEn: 'Finland',
    flag: '🇫🇮',
    dialCode: '+358',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 50,
    minAge: 18,
    cities: [
      { id: 'FI-HEL', nameAr: 'هلسنكي', nameEn: 'Helsinki', isEnabled: true },
      { id: 'FI-ESP', nameAr: 'إسبو', nameEn: 'Espoo', isEnabled: true },
      { id: 'FI-TAM', nameAr: 'تامبيري', nameEn: 'Tampere', isEnabled: true }
    ]
  },
  {
    id: 'IE',
    code: 'IE',
    nameAr: 'أيرلندا',
    nameEn: 'Ireland',
    flag: '🇮🇪',
    dialCode: '+353',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 51,
    minAge: 18,
    cities: [
      { id: 'IE-DUB', nameAr: 'دبلن', nameEn: 'Dublin', isEnabled: true },
      { id: 'IE-ORK', nameAr: 'كورك', nameEn: 'Cork', isEnabled: true },
      { id: 'IE-GAL', nameAr: 'غالواي', nameEn: 'Galway', isEnabled: true }
    ]
  },
  {
    id: 'PT',
    code: 'PT',
    nameAr: 'البرتغال',
    nameEn: 'Portugal',
    flag: '🇵🇹',
    dialCode: '+351',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 52,
    minAge: 18,
    cities: [
      { id: 'PT-LIS', nameAr: 'لشبونة', nameEn: 'Lisbon', isEnabled: true },
      { id: 'PT-OPO', nameAr: 'بورتو', nameEn: 'Porto', isEnabled: true },
      { id: 'PT-BRG', nameAr: 'براغا', nameEn: 'Braga', isEnabled: true }
    ]
  },
  {
    id: 'GR',
    code: 'GR',
    nameAr: 'اليونان',
    nameEn: 'Greece',
    flag: '🇬🇷',
    dialCode: '+30',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 53,
    minAge: 18,
    cities: [
      { id: 'GR-ATH', nameAr: 'أثينا', nameEn: 'Athens', isEnabled: true },
      { id: 'GR-SKG', nameAr: 'سالونيك', nameEn: 'Thessaloniki', isEnabled: true }
    ]
  },
  {
    id: 'PL',
    code: 'PL',
    nameAr: 'بولندا',
    nameEn: 'Poland',
    flag: '🇵🇱',
    dialCode: '+48',
    currency: 'PLN',
    currencyNameAr: 'زلوتي بولندي',
    isEnabled: true,
    isDefault: false,
    order: 54,
    minAge: 18,
    cities: [
      { id: 'PL-WAW', nameAr: 'وارسو', nameEn: 'Warsaw', isEnabled: true },
      { id: 'PL-KRK', nameAr: 'كراكوف', nameEn: 'Krakow', isEnabled: true },
      { id: 'PL-WRO', nameAr: 'فروتسواف', nameEn: 'Wroclaw', isEnabled: true }
    ]
  },
  {
    id: 'RU',
    code: 'RU',
    nameAr: 'روسيا الاتحادية',
    nameEn: 'Russia',
    flag: '🇷🇺',
    dialCode: '+7',
    currency: 'RUB',
    currencyNameAr: 'روبل روسي',
    isEnabled: true,
    isDefault: false,
    order: 55,
    minAge: 18,
    cities: [
      { id: 'RU-MOW', nameAr: 'موسكو', nameEn: 'Moscow', isEnabled: true },
      { id: 'RU-LED', nameAr: 'سانت بطرسبرغ', nameEn: 'Saint Petersburg', isEnabled: true },
      { id: 'RU-KZN', nameAr: 'قازان (تتارستان)', nameEn: 'Kazan', isEnabled: true },
      { id: 'RU-UFA', nameAr: 'أوفا (باشكورتوستان)', nameEn: 'Ufa', isEnabled: true },
      { id: 'RU-GRZ', nameAr: 'غروزني (الشيشان)', nameEn: 'Grozny', isEnabled: true },
      { id: 'RU-MCX', nameAr: 'محج قلعة (داغستان)', nameEn: 'Makhachkala', isEnabled: true }
    ]
  },
  {
    id: 'BA',
    code: 'BA',
    nameAr: 'البوسنة والهرسك',
    nameEn: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    dialCode: '+387',
    currency: 'BAM',
    currencyNameAr: 'مارك بوسني',
    isEnabled: true,
    isDefault: false,
    order: 56,
    minAge: 18,
    cities: [
      { id: 'BA-SJJ', nameAr: 'سراييفو', nameEn: 'Sarajevo', isEnabled: true },
      { id: 'BA-BNX', nameAr: 'بانيا لوكا', nameEn: 'Banja Luka', isEnabled: true },
      { id: 'BA-TZL', nameAr: 'توزلا', nameEn: 'Tuzla', isEnabled: true },
      { id: 'BA-MOS', nameAr: 'موستار', nameEn: 'Mostar', isEnabled: true },
      { id: 'BA-ZEN', nameAr: 'زينيتسا', nameEn: 'Zenica', isEnabled: true }
    ]
  },
  {
    id: 'AL',
    code: 'AL',
    nameAr: 'ألبانيا',
    nameEn: 'Albania',
    flag: '🇦🇱',
    dialCode: '+355',
    currency: 'ALL',
    currencyNameAr: 'ليك ألباني',
    isEnabled: true,
    isDefault: false,
    order: 57,
    minAge: 18,
    cities: [
      { id: 'AL-TIA', nameAr: 'تيرانا', nameEn: 'Tirana', isEnabled: true },
      { id: 'AL-DRS', nameAr: 'دوريس', nameEn: 'Durres', isEnabled: true },
      { id: 'AL-VLO', nameAr: 'فلوره', nameEn: 'Vlore', isEnabled: true },
      { id: 'AL-SHK', nameAr: 'شقودرة', nameEn: 'Shkoder', isEnabled: true }
    ]
  },
  {
    id: 'XK',
    code: 'XK',
    nameAr: 'كوسوفو',
    nameEn: 'Kosovo',
    flag: '🇽🇰',
    dialCode: '+383',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 58,
    minAge: 18,
    cities: [
      { id: 'XK-PRN', nameAr: 'بريشتينا', nameEn: 'Pristina', isEnabled: true },
      { id: 'XK-PRI', nameAr: 'بريزرن', nameEn: 'Prizren', isEnabled: true },
      { id: 'XK-PEJ', nameAr: 'بيجا', nameEn: 'Peja', isEnabled: true }
    ]
  },
  {
    id: 'MK',
    code: 'MK',
    nameAr: 'مقدونيا الشمالية',
    nameEn: 'North Macedonia',
    flag: '🇲🇰',
    dialCode: '+389',
    currency: 'MKD',
    currencyNameAr: 'دينار مقدوني',
    isEnabled: true,
    isDefault: false,
    order: 59,
    minAge: 18,
    cities: [
      { id: 'MK-SKP', nameAr: 'سكوبيه', nameEn: 'Skopje', isEnabled: true },
      { id: 'MK-BIT', nameAr: 'بيتولا', nameEn: 'Bitola', isEnabled: true },
      { id: 'MK-TET', nameAr: 'تيتوفو', nameEn: 'Tetovo', isEnabled: true }
    ]
  },
  {
    id: 'RO',
    code: 'RO',
    nameAr: 'رومانيا',
    nameEn: 'Romania',
    flag: '🇷🇴',
    dialCode: '+40',
    currency: 'RON',
    currencyNameAr: 'ليو روماني',
    isEnabled: true,
    isDefault: false,
    order: 60,
    minAge: 18,
    cities: [
      { id: 'RO-OTP', nameAr: 'بوخارست', nameEn: 'Bucharest', isEnabled: true },
      { id: 'RO-CLJ', nameAr: 'كلوج نابوكا', nameEn: 'Cluj-Napoca', isEnabled: true },
      { id: 'RO-TSR', nameAr: 'تيميشوارا', nameEn: 'Timisoara', isEnabled: true }
    ]
  },
  {
    id: 'CZ',
    code: 'CZ',
    nameAr: 'جمهورية التشيك',
    nameEn: 'Czech Republic',
    flag: '🇨🇿',
    dialCode: '+420',
    currency: 'CZK',
    currencyNameAr: 'كرونة تشيكية',
    isEnabled: true,
    isDefault: false,
    order: 61,
    minAge: 18,
    cities: [
      { id: 'CZ-PRG', nameAr: 'براغ', nameEn: 'Prague', isEnabled: true },
      { id: 'CZ-BRQ', nameAr: 'برنو', nameEn: 'Brno', isEnabled: true }
    ]
  },
  {
    id: 'HU',
    code: 'HU',
    nameAr: 'المجر',
    nameEn: 'Hungary',
    flag: '🇭🇺',
    dialCode: '+36',
    currency: 'HUF',
    currencyNameAr: 'فورنت مجري',
    isEnabled: true,
    isDefault: false,
    order: 62,
    minAge: 18,
    cities: [
      { id: 'HU-BUD', nameAr: 'بودابست', nameEn: 'Budapest', isEnabled: true },
      { id: 'HU-DEB', nameAr: 'ديبريسين', nameEn: 'Debrecen', isEnabled: true }
    ]
  },
  {
    id: 'CY',
    code: 'CY',
    nameAr: 'قبرص',
    nameEn: 'Cyprus',
    flag: '🇨🇾',
    dialCode: '+357',
    currency: 'EUR',
    currencyNameAr: 'يورو',
    isEnabled: true,
    isDefault: false,
    order: 63,
    minAge: 18,
    cities: [
      { id: 'CY-NIC', nameAr: 'نيقوسيا', nameEn: 'Nicosia', isEnabled: true },
      { id: 'CY-LIM', nameAr: 'ليماسول', nameEn: 'Limassol', isEnabled: true },
      { id: 'CY-LAR', nameAr: 'لارنكا', nameEn: 'Larnaca', isEnabled: true }
    ]
  },

  // ========================================================
  // 4. AMERICAS (الأمريكتان)
  // ========================================================
  {
    id: 'US',
    code: 'US',
    nameAr: 'الولايات المتحدة الأمريكية',
    nameEn: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    currency: 'USD',
    currencyNameAr: 'دولار أمريكي',
    isEnabled: true,
    isDefault: false,
    order: 64,
    minAge: 18,
    cities: [
      { id: 'US-NYC', nameAr: 'نيويورك', nameEn: 'New York', isEnabled: true },
      { id: 'US-LAX', nameAr: 'لوس أنجلوس', nameEn: 'Los Angeles', isEnabled: true },
      { id: 'US-CHI', nameAr: 'شيكاغو', nameEn: 'Chicago', isEnabled: true },
      { id: 'US-HOU', nameAr: 'هيوستن', nameEn: 'Houston', isEnabled: true },
      { id: 'US-DFW', nameAr: 'دالاس', nameEn: 'Dallas', isEnabled: true },
      { id: 'US-WAS', nameAr: 'واشنطن العاصمة', nameEn: 'Washington D.C.', isEnabled: true },
      { id: 'US-MIA', nameAr: 'ميامي', nameEn: 'Miami', isEnabled: true },
      { id: 'US-SFO', nameAr: 'سان فرانسيسكو', nameEn: 'San Francisco', isEnabled: true },
      { id: 'US-BOS', nameAr: 'بوسطن', nameEn: 'Boston', isEnabled: true },
      { id: 'US-ATL', nameAr: 'أتلانتا', nameEn: 'Atlanta', isEnabled: true },
      { id: 'US-DET', nameAr: 'ديترويت (ديربورن)', nameEn: 'Detroit / Dearborn', isEnabled: true }
    ]
  },
  {
    id: 'CA',
    code: 'CA',
    nameAr: 'كندا',
    nameEn: 'Canada',
    flag: '🇨🇦',
    dialCode: '+1',
    currency: 'CAD',
    currencyNameAr: 'دولار كندي',
    isEnabled: true,
    isDefault: false,
    order: 65,
    minAge: 18,
    cities: [
      { id: 'CA-TOR', nameAr: 'تورونتو', nameEn: 'Toronto', isEnabled: true },
      { id: 'CA-MTL', nameAr: 'مونتريال', nameEn: 'Montreal', isEnabled: true },
      { id: 'CA-VAN', nameAr: 'فانكوفر', nameEn: 'Vancouver', isEnabled: true },
      { id: 'CA-CAL', nameAr: 'كالغاري', nameEn: 'Calgary', isEnabled: true },
      { id: 'CA-OTT', nameAr: 'أوتاوا', nameEn: 'Ottawa', isEnabled: true },
      { id: 'CA-EDM', nameAr: 'إدمونتون', nameEn: 'Edmonton', isEnabled: true },
      { id: 'CA-MIS', nameAr: 'ميسيساغا', nameEn: 'Mississauga', isEnabled: true }
    ]
  },
  {
    id: 'MX',
    code: 'MX',
    nameAr: 'المكسيك',
    nameEn: 'Mexico',
    flag: '🇲🇽',
    dialCode: '+52',
    currency: 'MXN',
    currencyNameAr: 'بيزو مكسيكي',
    isEnabled: true,
    isDefault: false,
    order: 66,
    minAge: 18,
    cities: [
      { id: 'MX-MEX', nameAr: 'مكسيكو سيتي', nameEn: 'Mexico City', isEnabled: true },
      { id: 'MX-GDL', nameAr: 'غوادالاخارا', nameEn: 'Guadalajara', isEnabled: true },
      { id: 'MX-MTY', nameAr: 'مونتيري', nameEn: 'Monterrey', isEnabled: true }
    ]
  },
  {
    id: 'BR',
    code: 'BR',
    nameAr: 'البرازيل',
    nameEn: 'Brazil',
    flag: '🇧🇷',
    dialCode: '+55',
    currency: 'BRL',
    currencyNameAr: 'ريال برازيلي',
    isEnabled: true,
    isDefault: false,
    order: 67,
    minAge: 18,
    cities: [
      { id: 'BR-SAO', nameAr: 'ساو باولو', nameEn: 'Sao Paulo', isEnabled: true },
      { id: 'BR-RIO', nameAr: 'ريو دي جانيرو', nameEn: 'Rio de Janeiro', isEnabled: true },
      { id: 'BR-BSB', nameAr: 'برازيليا', nameEn: 'Brasilia', isEnabled: true },
      { id: 'BR-CUR', nameAr: 'كوريتيبا', nameEn: 'Curitiba', isEnabled: true }
    ]
  },
  {
    id: 'AR',
    code: 'AR',
    nameAr: 'الأرجنتين',
    nameEn: 'Argentina',
    flag: '🇦🇷',
    dialCode: '+54',
    currency: 'ARS',
    currencyNameAr: 'بيزو أرجنتيني',
    isEnabled: true,
    isDefault: false,
    order: 68,
    minAge: 18,
    cities: [
      { id: 'AR-BUE', nameAr: 'بوينس آيرس', nameEn: 'Buenos Aires', isEnabled: true },
      { id: 'AR-COR', nameAr: 'قرطبة', nameEn: 'Cordoba', isEnabled: true },
      { id: 'AR-ROS', nameAr: 'روزاريو', nameEn: 'Rosario', isEnabled: true }
    ]
  },
  {
    id: 'CO',
    code: 'CO',
    nameAr: 'كولومبيا',
    nameEn: 'Colombia',
    flag: '🇨🇴',
    dialCode: '+57',
    currency: 'COP',
    currencyNameAr: 'بيزو كولومبي',
    isEnabled: true,
    isDefault: false,
    order: 69,
    minAge: 18,
    cities: [
      { id: 'CO-BOG', nameAr: 'بوغوتا', nameEn: 'Bogota', isEnabled: true },
      { id: 'CO-MDE', nameAr: 'ميديلين', nameEn: 'Medellin', isEnabled: true },
      { id: 'CO-CAL', nameAr: 'كالي', nameEn: 'Cali', isEnabled: true }
    ]
  },
  {
    id: 'CL',
    code: 'CL',
    nameAr: 'تشيلي',
    nameEn: 'Chile',
    flag: '🇨🇱',
    dialCode: '+56',
    currency: 'CLP',
    currencyNameAr: 'بيزو تشيلي',
    isEnabled: true,
    isDefault: false,
    order: 70,
    minAge: 18,
    cities: [
      { id: 'CL-SCL', nameAr: 'سانتياغو', nameEn: 'Santiago', isEnabled: true },
      { id: 'CL-VAL', nameAr: 'فالبارايسو', nameEn: 'Valparaiso', isEnabled: true }
    ]
  },

  // ========================================================
  // 5. ASIA & OCEANIA (آسيا وأوقيانوسيا)
  // ========================================================
  {
    id: 'AU',
    code: 'AU',
    nameAr: 'أستراليا',
    nameEn: 'Australia',
    flag: '🇦🇺',
    dialCode: '+61',
    currency: 'AUD',
    currencyNameAr: 'دولار أسترالي',
    isEnabled: true,
    isDefault: false,
    order: 71,
    minAge: 18,
    cities: [
      { id: 'AU-SYD', nameAr: 'سيدني', nameEn: 'Sydney', isEnabled: true },
      { id: 'AU-MEL', nameAr: 'ملبورن', nameEn: 'Melbourne', isEnabled: true },
      { id: 'AU-BNE', nameAr: 'بريزبان', nameEn: 'Brisbane', isEnabled: true },
      { id: 'AU-PER', nameAr: 'بيرث', nameEn: 'Perth', isEnabled: true },
      { id: 'AU-ADL', nameAr: 'أديليد', nameEn: 'Adelaide', isEnabled: true }
    ]
  },
  {
    id: 'NZ',
    code: 'NZ',
    nameAr: 'نيوزيلندا',
    nameEn: 'New Zealand',
    flag: '🇳🇿',
    dialCode: '+64',
    currency: 'NZD',
    currencyNameAr: 'دولار نيوزيلندي',
    isEnabled: true,
    isDefault: false,
    order: 72,
    minAge: 18,
    cities: [
      { id: 'NZ-AKL', nameAr: 'أوكلاند', nameEn: 'Auckland', isEnabled: true },
      { id: 'NZ-WLG', nameAr: 'ويلينغتون', nameEn: 'Wellington', isEnabled: true },
      { id: 'NZ-CHC', nameAr: 'كرايستشيرش', nameEn: 'Christchurch', isEnabled: true }
    ]
  },
  {
    id: 'SG',
    code: 'SG',
    nameAr: 'سنغافورة',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    dialCode: '+65',
    currency: 'SGD',
    currencyNameAr: 'دولار سنغافوري',
    isEnabled: true,
    isDefault: false,
    order: 73,
    minAge: 18,
    cities: [
      { id: 'SG-SIN', nameAr: 'سنغافورة', nameEn: 'Singapore', isEnabled: true }
    ]
  },
  {
    id: 'IN',
    code: 'IN',
    nameAr: 'الهند',
    nameEn: 'India',
    flag: '🇮🇳',
    dialCode: '+91',
    currency: 'INR',
    currencyNameAr: 'روبية هندية',
    isEnabled: true,
    isDefault: false,
    order: 74,
    minAge: 18,
    cities: [
      { id: 'IN-DEL', nameAr: 'نيودلهي', nameEn: 'New Delhi', isEnabled: true },
      { id: 'IN-BOM', nameAr: 'مومباي', nameEn: 'Mumbai', isEnabled: true },
      { id: 'IN-BLR', nameAr: 'بنغالور', nameEn: 'Bangalore', isEnabled: true },
      { id: 'IN-HYD', nameAr: 'حيدر أباد', nameEn: 'Hyderabad', isEnabled: true },
      { id: 'IN-MAA', nameAr: 'تشيناي', nameEn: 'Chennai', isEnabled: true },
      { id: 'IN-CCU', nameAr: 'كولكاتا', nameEn: 'Kolkata', isEnabled: true }
    ]
  },
  {
    id: 'CN',
    code: 'CN',
    nameAr: 'الصين',
    nameEn: 'China',
    flag: '🇨🇳',
    dialCode: '+86',
    currency: 'CNY',
    currencyNameAr: 'يوان صيني',
    isEnabled: true,
    isDefault: false,
    order: 75,
    minAge: 18,
    cities: [
      { id: 'CN-BJS', nameAr: 'بكين', nameEn: 'Beijing', isEnabled: true },
      { id: 'CN-SHA', nameAr: 'شنغهاي', nameEn: 'Shanghai', isEnabled: true },
      { id: 'CN-CAN', nameAr: 'قوانغتشو', nameEn: 'Guangzhou', isEnabled: true },
      { id: 'CN-SZX', nameAr: 'شنتشن', nameEn: 'Shenzhen', isEnabled: true },
      { id: 'CN-URC', nameAr: 'أورومتشي (تركستان الشرقية)', nameEn: 'Urumqi', isEnabled: true }
    ]
  },
  {
    id: 'JP',
    code: 'JP',
    nameAr: 'اليابان',
    nameEn: 'Japan',
    flag: '🇯🇵',
    dialCode: '+81',
    currency: 'JPY',
    currencyNameAr: 'ين ياباني',
    isEnabled: true,
    isDefault: false,
    order: 76,
    minAge: 18,
    cities: [
      { id: 'JP-TYO', nameAr: 'طوكيو', nameEn: 'Tokyo', isEnabled: true },
      { id: 'JP-OSA', nameAr: 'أوساكا', nameEn: 'Osaka', isEnabled: true },
      { id: 'JP-YOK', nameAr: 'يوكوهاما', nameEn: 'Yokohama', isEnabled: true },
      { id: 'JP-NGO', nameAr: 'ناغويا', nameEn: 'Nagoya', isEnabled: true },
      { id: 'JP-KYO', nameAr: 'كيوتو', nameEn: 'Kyoto', isEnabled: true }
    ]
  },
  {
    id: 'KR',
    code: 'KR',
    nameAr: 'كوريا الجنوبية',
    nameEn: 'South Korea',
    flag: '🇰🇷',
    dialCode: '+82',
    currency: 'KRW',
    currencyNameAr: 'وون كوري',
    isEnabled: true,
    isDefault: false,
    order: 77,
    minAge: 18,
    cities: [
      { id: 'KR-SEL', nameAr: 'سيول', nameEn: 'Seoul', isEnabled: true },
      { id: 'KR-PUS', nameAr: 'بوسان', nameEn: 'Busan', isEnabled: true },
      { id: 'KR-ICN', nameAr: 'إنتشون', nameEn: 'Incheon', isEnabled: true }
    ]
  },
  {
    id: 'TH',
    code: 'TH',
    nameAr: 'تايلاند',
    nameEn: 'Thailand',
    flag: '🇹🇭',
    dialCode: '+66',
    currency: 'THB',
    currencyNameAr: 'بات تايلاندي',
    isEnabled: true,
    isDefault: false,
    order: 78,
    minAge: 18,
    cities: [
      { id: 'TH-BKK', nameAr: 'بانكوك', nameEn: 'Bangkok', isEnabled: true },
      { id: 'TH-CNX', nameAr: 'تشيانغ ماي', nameEn: 'Chiang Mai', isEnabled: true },
      { id: 'TH-HKT', nameAr: 'بوكيت', nameEn: 'Phuket', isEnabled: true },
      { id: 'TH-PAT', nameAr: 'فطاني (الجنوب المسلم)', nameEn: 'Pattani', isEnabled: true }
    ]
  },
  {
    id: 'PH',
    code: 'PH',
    nameAr: 'الفلبين',
    nameEn: 'Philippines',
    flag: '🇵🇭',
    dialCode: '+63',
    currency: 'PHP',
    currencyNameAr: 'بيزو فلبيني',
    isEnabled: true,
    isDefault: false,
    order: 79,
    minAge: 18,
    cities: [
      { id: 'PH-MNL', nameAr: 'مانيلا', nameEn: 'Manila', isEnabled: true },
      { id: 'PH-CEB', nameAr: 'سيبو', nameEn: 'Cebu', isEnabled: true },
      { id: 'PH-DVO', nameAr: 'دافاو', nameEn: 'Davao', isEnabled: true },
      { id: 'PH-ZAM', nameAr: 'زامبوانجا (مندناو)', nameEn: 'Zamboanga', isEnabled: true }
    ]
  },
  {
    id: 'LK',
    code: 'LK',
    nameAr: 'سريلانكا',
    nameEn: 'Sri Lanka',
    flag: '🇱🇰',
    dialCode: '+94',
    currency: 'LKR',
    currencyNameAr: 'روبية سريلانكية',
    isEnabled: true,
    isDefault: false,
    order: 80,
    minAge: 18,
    cities: [
      { id: 'LK-CMB', nameAr: 'كولومبو', nameEn: 'Colombo', isEnabled: true },
      { id: 'LK-KDY', nameAr: 'كاندي', nameEn: 'Kandy', isEnabled: true },
      { id: 'LK-GAL', nameAr: 'غالي', nameEn: 'Galle', isEnabled: true }
    ]
  },

  // ========================================================
  // 6. AFRICA (أفريقيا)
  // ========================================================
  {
    id: 'ZA',
    code: 'ZA',
    nameAr: 'جنوب أفريقيا',
    nameEn: 'South Africa',
    flag: '🇿🇦',
    dialCode: '+27',
    currency: 'ZAR',
    currencyNameAr: 'راند جنوب أفريقي',
    isEnabled: true,
    isDefault: false,
    order: 81,
    minAge: 18,
    cities: [
      { id: 'ZA-JNB', nameAr: 'جوهانسبرغ', nameEn: 'Johannesburg', isEnabled: true },
      { id: 'ZA-CPT', nameAr: 'كيب تاون', nameEn: 'Cape Town', isEnabled: true },
      { id: 'ZA-DUR', nameAr: 'ديربان', nameEn: 'Durban', isEnabled: true },
      { id: 'ZA-PRY', nameAr: 'بريتوريا', nameEn: 'Pretoria', isEnabled: true }
    ]
  },
  {
    id: 'NG',
    code: 'NG',
    nameAr: 'نيجيريا',
    nameEn: 'Nigeria',
    flag: '🇳🇬',
    dialCode: '+234',
    currency: 'NGN',
    currencyNameAr: 'نايرا نيجيرية',
    isEnabled: true,
    isDefault: false,
    order: 82,
    minAge: 18,
    cities: [
      { id: 'NG-ABJ', nameAr: 'أبوجا', nameEn: 'Abuja', isEnabled: true },
      { id: 'NG-LOS', nameAr: 'لاغوس', nameEn: 'Lagos', isEnabled: true },
      { id: 'NG-KAN', nameAr: 'كانو', nameEn: 'Kano', isEnabled: true },
      { id: 'NG-IBA', nameAr: 'إبادان', nameEn: 'Ibadan', isEnabled: true }
    ]
  },
  {
    id: 'KE',
    code: 'KE',
    nameAr: 'كينيا',
    nameEn: 'Kenya',
    flag: '🇰🇪',
    dialCode: '+254',
    currency: 'KES',
    currencyNameAr: 'شلن كيني',
    isEnabled: true,
    isDefault: false,
    order: 83,
    minAge: 18,
    cities: [
      { id: 'KE-NBO', nameAr: 'نيروبي', nameEn: 'Nairobi', isEnabled: true },
      { id: 'KE-MBA', nameAr: 'مومباسا', nameEn: 'Mombasa', isEnabled: true },
      { id: 'KE-KIS', nameAr: 'كيسومو', nameEn: 'Kisumu', isEnabled: true }
    ]
  },
  {
    id: 'ET',
    code: 'ET',
    nameAr: 'إثيوبيا',
    nameEn: 'Ethiopia',
    flag: '🇪🇹',
    dialCode: '+251',
    currency: 'ETB',
    currencyNameAr: 'بير إثيوبي',
    isEnabled: true,
    isDefault: false,
    order: 84,
    minAge: 18,
    cities: [
      { id: 'ET-ADD', nameAr: 'أديس أبابا', nameEn: 'Addis Ababa', isEnabled: true },
      { id: 'ET-DIR', nameAr: 'ديرة داوا', nameEn: 'Dire Dawa', isEnabled: true }
    ]
  },
  {
    id: 'GH',
    code: 'GH',
    nameAr: 'غانا',
    nameEn: 'Ghana',
    flag: '🇬🇭',
    dialCode: '+233',
    currency: 'GHS',
    currencyNameAr: 'سيدي غاني',
    isEnabled: true,
    isDefault: false,
    order: 85,
    minAge: 18,
    cities: [
      { id: 'GH-ACC', nameAr: 'أكرا', nameEn: 'Accra', isEnabled: true },
      { id: 'GH-KMS', nameAr: 'كوماسي', nameEn: 'Kumasi', isEnabled: true }
    ]
  },
  {
    id: 'SN',
    code: 'SN',
    nameAr: 'السنغال',
    nameEn: 'Senegal',
    flag: '🇸🇳',
    dialCode: '+221',
    currency: 'XOF',
    currencyNameAr: 'فرنك غرب أفريقي',
    isEnabled: true,
    isDefault: false,
    order: 86,
    minAge: 18,
    cities: [
      { id: 'SN-DKR', nameAr: 'داكار', nameEn: 'Dakar', isEnabled: true },
      { id: 'SN-TOU', nameAr: 'طوبى', nameEn: 'Touba', isEnabled: true },
      { id: 'SN-THI', nameAr: 'ثيس', nameEn: 'Thies', isEnabled: true }
    ]
  },
  {
    id: 'CI',
    code: 'CI',
    nameAr: 'ساحل العاج (كوت ديفوار)',
    nameEn: 'Ivory Coast',
    flag: '🇨🇮',
    dialCode: '+225',
    currency: 'XOF',
    currencyNameAr: 'فرنك غرب أفريقي',
    isEnabled: true,
    isDefault: false,
    order: 87,
    minAge: 18,
    cities: [
      { id: 'CI-ABJ', nameAr: 'أبيدجان', nameEn: 'Abidjan', isEnabled: true },
      { id: 'CI-YAM', nameAr: 'ياموسوكرو', nameEn: 'Yamoussoukro', isEnabled: true }
    ]
  },
  {
    id: 'TZ',
    code: 'TZ',
    nameAr: 'تنزانيا',
    nameEn: 'Tanzania',
    flag: '🇹🇿',
    dialCode: '+255',
    currency: 'TZS',
    currencyNameAr: 'شلن تنزاني',
    isEnabled: true,
    isDefault: false,
    order: 88,
    minAge: 18,
    cities: [
      { id: 'TZ-DAR', nameAr: 'دار السلام', nameEn: 'Dar es Salaam', isEnabled: true },
      { id: 'TZ-DOD', nameAr: 'دودوما', nameEn: 'Dodoma', isEnabled: true },
      { id: 'TZ-ZNZ', nameAr: 'زنجبار', nameEn: 'Zanzibar City', isEnabled: true }
    ]
  },
  {
    id: 'UG',
    code: 'UG',
    nameAr: 'أوغندا',
    nameEn: 'Uganda',
    flag: '🇺🇬',
    dialCode: '+256',
    currency: 'UGX',
    currencyNameAr: 'شلن أوغندي',
    isEnabled: true,
    isDefault: false,
    order: 89,
    minAge: 18,
    cities: [
      { id: 'UG-EBB', nameAr: 'كمبالا', nameEn: 'Kampala', isEnabled: true },
      { id: 'UG-ENT', nameAr: 'إنتيبي', nameEn: 'Entebbe', isEnabled: true }
    ]
  },
  {
    id: 'ML',
    code: 'ML',
    nameAr: 'مالي',
    nameEn: 'Mali',
    flag: '🇲🇱',
    dialCode: '+223',
    currency: 'XOF',
    currencyNameAr: 'فرنك غرب أفريقي',
    isEnabled: true,
    isDefault: false,
    order: 90,
    minAge: 18,
    cities: [
      { id: 'ML-BKO', nameAr: 'باماكو', nameEn: 'Bamako', isEnabled: true },
      { id: 'ML-TOM', nameAr: 'تمبكتو', nameEn: 'Timbuktu', isEnabled: true }
    ]
  },
  {
    id: 'NE',
    code: 'NE',
    nameAr: 'النيجر',
    nameEn: 'Niger',
    flag: '🇳🇪',
    dialCode: '+227',
    currency: 'XOF',
    currencyNameAr: 'فرنك غرب أفريقي',
    isEnabled: true,
    isDefault: false,
    order: 91,
    minAge: 18,
    cities: [
      { id: 'NE-NIM', nameAr: 'نيامي', nameEn: 'Niamey', isEnabled: true },
      { id: 'NE-ZIN', nameAr: 'زندر', nameEn: 'Zinder', isEnabled: true }
    ]
  },
  {
    id: 'TD',
    code: 'TD',
    nameAr: 'تشاد',
    nameEn: 'Chad',
    flag: '🇹🇩',
    dialCode: '+235',
    currency: 'XAF',
    currencyNameAr: 'فرنك وسط أفريقي',
    isEnabled: true,
    isDefault: false,
    order: 92,
    minAge: 18,
    cities: [
      { id: 'TD-NDJ', nameAr: 'نجامينا', nameEn: 'NDjamena', isEnabled: true },
      { id: 'TD-MOU', nameAr: 'موندو', nameEn: 'Moundou', isEnabled: true }
    ]
  },
  {
    id: 'MU',
    code: 'MU',
    nameAr: 'موريشيوس',
    nameEn: 'Mauritius',
    flag: '🇲🇺',
    dialCode: '+230',
    currency: 'MUR',
    currencyNameAr: 'روبية موريشية',
    isEnabled: true,
    isDefault: false,
    order: 93,
    minAge: 18,
    cities: [
      { id: 'MU-PLU', nameAr: 'بورت لويس', nameEn: 'Port Louis', isEnabled: true },
      { id: 'MU-CUR', nameAr: 'كوريبيب', nameEn: 'Curepipe', isEnabled: true }
    ]
  }
];
