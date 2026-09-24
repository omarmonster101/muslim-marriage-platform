export type TranslationCategory = 
  | "general"
  | "navigation"
  | "hero"
  | "filters"
  | "profile"
  | "wali"
  | "marriage"
  | "counselor"
  | "celebrations"
  | "settings"
  | "registration"
  | "api"
  | "footer";

export interface TranslationKeyDef {
  key: string;
  category: TranslationCategory;
  descriptionAr: string;
  defaultAr: string;
}

export const TRANSLATION_CATEGORIES: { id: "all" | TranslationCategory; label: string }[] = [
  { id: "all", label: "كافة المفاتيح (159)" },
  { id: "general", label: "عام والشعارات" },
  { id: "registration", label: "نظام التسجيل والخطوات" },
  { id: "navigation", label: "شريط التنقل والهيدر" },
  { id: "hero", label: "الواجهة الرئيسية (الهيرو)" },
  { id: "filters", label: "فلاتر البحث والاستعراض" },
  { id: "profile", label: "الملف الشخصي والحشمة" },
  { id: "wali", label: "بوابة الولي الشرعي" },
  { id: "marriage", label: "مسار الخطوبة والتوافق" },
  { id: "counselor", label: "المستشار الشرعي والذكاء" },
  { id: "celebrations", label: "عقود القران والاحتفاء" },
  { id: "settings", label: "إعدادات الحساب والضوابط" },
  { id: "api", label: "واجهة API والمطورين" },
  { id: "footer", label: "التذييل والروابط" }
];

export const ALL_TRANSLATION_KEYS: TranslationKeyDef[] = [
  {
    "key": "appName",
    "category": "general",
    "descriptionAr": "ميثاق",
    "defaultAr": "ميثاق"
  },
  {
    "key": "appSubtitle",
    "category": "general",
    "descriptionAr": "منصة الزواج الإسلامي الشرعي الموثوقة",
    "defaultAr": "منصة الزواج الإسلامي الشرعي الموثوقة"
  },
  {
    "key": "navHome",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: الصفحة الرئيسية",
    "defaultAr": "الصفحة الرئيسية"
  },
  {
    "key": "navExplore",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: تصفح",
    "defaultAr": "تصفح"
  },
  {
    "key": "navActivity",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: الأنشطة",
    "defaultAr": "الأنشطة"
  },
  {
    "key": "navProfile",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: بروفايلي",
    "defaultAr": "بروفايلي"
  },
  {
    "key": "navLogin",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: تسجيل الدخول",
    "defaultAr": "تسجيل الدخول"
  },
  {
    "key": "navRegister",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: إنشاء حساب",
    "defaultAr": "إنشاء حساب"
  },
  {
    "key": "navWali",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: بوابة الولي الشرعي",
    "defaultAr": "بوابة الولي الشرعي"
  },
  {
    "key": "navProposals",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: طلبات الخطوبة",
    "defaultAr": "طلبات الخطوبة"
  },
  {
    "key": "navAi",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: المستشار والتوافق",
    "defaultAr": "المستشار والتوافق"
  },
  {
    "key": "navCelebrations",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: عقود القران ودعوات الفرح",
    "defaultAr": "عقود القران ودعوات الفرح"
  },
  {
    "key": "navSettings",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: الإعدادات",
    "defaultAr": "الإعدادات"
  },
  {
    "key": "navApi",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: واجهة المطورين API",
    "defaultAr": "واجهة المطورين API"
  },
  {
    "key": "navAdmin",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: لوحة تحكم الإدارة",
    "defaultAr": "لوحة تحكم الإدارة"
  },
  {
    "key": "bannerText",
    "category": "general",
    "descriptionAr": "✨ قَالَ رَسُولُ اللَّهِ ﷺ: «إِذَا جَاءَكُمْ مَنْ ت...",
    "defaultAr": "✨ قَالَ رَسُولُ اللَّهِ ﷺ: «إِذَا جَاءَكُمْ مَنْ تَرْضَوْنَ دِينَهُ وَخُلُقَهُ فَزَوِّجُوهُ» — مباركٌ لكل سائلٍ للعفة والستر"
  },
  {
    "key": "createProfileBtn",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: إنشاء ملف خطبة",
    "defaultAr": "إنشاء ملف خطبة"
  },
  {
    "key": "loginBtn",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: دخول الولي / الأعضاء",
    "defaultAr": "دخول الولي / الأعضاء"
  },
  {
    "key": "activeSearchers",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: راغب وراغبة في العفة",
    "defaultAr": "راغب وراغبة في العفة"
  },
  {
    "key": "verifiedWalis",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: ولي أمر موثق",
    "defaultAr": "ولي أمر موثق"
  },
  {
    "key": "successfulNikahs",
    "category": "navigation",
    "descriptionAr": "عنصر التنقل أو الهيدر: عقد قران مبارك",
    "defaultAr": "عقد قران مبارك"
  },
  {
    "key": "heroBadge",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): زواج شرعي 100% بإشراف...",
    "defaultAr": "زواج شرعي 100% بإشراف مباشر للولي"
  },
  {
    "key": "heroTitle",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): ميثاق غليظ وسكنٌ ومود...",
    "defaultAr": "ميثاق غليظ وسكنٌ ومودة على كتاب الله وسنة رسوله"
  },
  {
    "key": "heroDescription",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): أول منصة زواج إسلامي ...",
    "defaultAr": "أول منصة زواج إسلامي تجمع بين الرقي والضوابط الشرعية الصارمة. خصوصية تامة لحرائر المسلمين، توثيق رسمي لأولياء الأمور، ومطابقة مبنية على التقوى والكفاءة."
  },
  {
    "key": "heroCtaExplore",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): تصفح الملفات الشرعية",
    "defaultAr": "تصفح الملفات الشرعية"
  },
  {
    "key": "heroCtaRegisterWali",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): تسجيل ولي أمر",
    "defaultAr": "تسجيل ولي أمر"
  },
  {
    "key": "notificationSuitorAlert",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): طلب خطوبة جديد",
    "defaultAr": "طلب خطوبة جديد"
  },
  {
    "key": "notificationSuitorDesc",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): تقدم أخ موثق لطلب الر...",
    "defaultAr": "تقدم أخ موثق لطلب الرؤية الشرعية لابنتكم المصونة بموافقة الولي."
  },
  {
    "key": "notificationReviewBtn",
    "category": "hero",
    "descriptionAr": "قسم الواجهة الرئيسية (Hero): مراجعة الطلب",
    "defaultAr": "مراجعة الطلب"
  },
  {
    "key": "filterAll",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: الكل",
    "defaultAr": "الكل"
  },
  {
    "key": "filterGender",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: الجنس",
    "defaultAr": "الجنس"
  },
  {
    "key": "filterMen",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: إخوان باحثون",
    "defaultAr": "إخوان باحثون"
  },
  {
    "key": "filterWomen",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: أخوات باحثات",
    "defaultAr": "أخوات باحثات"
  },
  {
    "key": "filterCountry",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: الدولة",
    "defaultAr": "الدولة"
  },
  {
    "key": "filterPrayer",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: المحافظة على الصلاة",
    "defaultAr": "المحافظة على الصلاة"
  },
  {
    "key": "filterPrayerMosque",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: في المسجد دائماً",
    "defaultAr": "في المسجد دائماً"
  },
  {
    "key": "filterPrayerOnTime",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: في وقتها دائماً",
    "defaultAr": "في وقتها دائماً"
  },
  {
    "key": "filterVeil",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: الحجاب والهيئة",
    "defaultAr": "الحجاب والهيئة"
  },
  {
    "key": "filterVeilFull",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: حجاب شرعي كامل",
    "defaultAr": "حجاب شرعي كامل"
  },
  {
    "key": "filterNiqab",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: نقاب شرعي",
    "defaultAr": "نقاب شرعي"
  },
  {
    "key": "filterBeard",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: لحية وهيئة وقورة",
    "defaultAr": "لحية وهيئة وقورة"
  },
  {
    "key": "filterStatus",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: الحالة الاجتماعية",
    "defaultAr": "الحالة الاجتماعية"
  },
  {
    "key": "filterSingle",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: أعزب / عزباء",
    "defaultAr": "أعزب / عزباء"
  },
  {
    "key": "filterDivorced",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: مطلق / مطلقة",
    "defaultAr": "مطلق / مطلقة"
  },
  {
    "key": "filterWidowed",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: أرمل / أرملة",
    "defaultAr": "أرمل / أرملة"
  },
  {
    "key": "filterSearchPlaceholder",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: بحث بالمدينة، التخصص، أو بل...",
    "defaultAr": "بحث بالمدينة، التخصص، أو بلد الإقامة..."
  },
  {
    "key": "filterVerifiedOnly",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: الموثقون فقط",
    "defaultAr": "الموثقون فقط"
  },
  {
    "key": "filterReset",
    "category": "filters",
    "descriptionAr": "فلتر البحث والاستعراض: إعادة ضبط",
    "defaultAr": "إعادة ضبط"
  },
  {
    "key": "ageSuffix",
    "category": "general",
    "descriptionAr": "سنة",
    "defaultAr": "سنة"
  },
  {
    "key": "prayerLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الصلاة",
    "defaultAr": "الصلاة"
  },
  {
    "key": "quranLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: القرآن",
    "defaultAr": "القرآن"
  },
  {
    "key": "waliLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الولي",
    "defaultAr": "الولي"
  },
  {
    "key": "waliVerified",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: ولي موثق",
    "defaultAr": "ولي موثق"
  },
  {
    "key": "waliPending",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: قيد توثيق الولي",
    "defaultAr": "قيد توثيق الولي"
  },
  {
    "key": "shariaBadge",
    "category": "profile",
    "descriptionAr": "ضوابط الحشمة والصور: ضوابط شرعية",
    "defaultAr": "ضوابط شرعية"
  },
  {
    "key": "togglePhotoBlur",
    "category": "profile",
    "descriptionAr": "ضوابط الحشمة والصور: حجب/كشف الصورة احتشاماً",
    "defaultAr": "حجب/كشف الصورة احتشاماً"
  },
  {
    "key": "photoBlurredNotice",
    "category": "profile",
    "descriptionAr": "ضوابط الحشمة والصور: الصورة محجوبة مراعاةً للحياء ...",
    "defaultAr": "الصورة محجوبة مراعاةً للحياء الشرعي (تنكشف للموثقين وبإذن الولي)"
  },
  {
    "key": "revealPhoto",
    "category": "profile",
    "descriptionAr": "ضوابط الحشمة والصور: كشف الصورة",
    "defaultAr": "كشف الصورة"
  },
  {
    "key": "blurPhoto",
    "category": "profile",
    "descriptionAr": "ضوابط الحشمة والصور: حجب الصورة",
    "defaultAr": "حجب الصورة"
  },
  {
    "key": "viewProfileBtn",
    "category": "general",
    "descriptionAr": "عرض الملف الشرعي",
    "defaultAr": "عرض الملف الشرعي"
  },
  {
    "key": "requestKhitbahBtn",
    "category": "marriage",
    "descriptionAr": "طلبات ومسار الخطوبة: طلب خطوبة وتواصل الولي",
    "defaultAr": "طلب خطوبة وتواصل الولي"
  },
  {
    "key": "modalTitle",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الملف التعريفي للخطبة ...",
    "defaultAr": "الملف التعريفي للخطبة الشرعية"
  },
  {
    "key": "tabFaith",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الدين والالتزام",
    "defaultAr": "الدين والالتزام"
  },
  {
    "key": "tabFamily",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الأسرة والولي",
    "defaultAr": "الأسرة والولي"
  },
  {
    "key": "tabVision",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الرؤية وتطلعات الزواج",
    "defaultAr": "الرؤية وتطلعات الزواج"
  },
  {
    "key": "tabCompatibility",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: تحليل التوافق الشرعي",
    "defaultAr": "تحليل التوافق الشرعي"
  },
  {
    "key": "educationLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: المؤهل العلمي",
    "defaultAr": "المؤهل العلمي"
  },
  {
    "key": "professionLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: المهنة / العمل",
    "defaultAr": "المهنة / العمل"
  },
  {
    "key": "residenceLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الإقامة الحالية",
    "defaultAr": "الإقامة الحالية"
  },
  {
    "key": "nationalityLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الجنسية",
    "defaultAr": "الجنسية"
  },
  {
    "key": "maritalStatusLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الحالة الاجتماعية",
    "defaultAr": "الحالة الاجتماعية"
  },
  {
    "key": "timelineLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الوقت المفضل للزواج",
    "defaultAr": "الوقت المفضل للزواج"
  },
  {
    "key": "mahrLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: نظرة في المهر",
    "defaultAr": "نظرة في المهر"
  },
  {
    "key": "aboutMeLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: نبذة شخصية والالتزام ا...",
    "defaultAr": "نبذة شخصية والالتزام الديني"
  },
  {
    "key": "partnerExpectationsLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: شروط وشريك العمر المنش...",
    "defaultAr": "شروط وشريك العمر المنشود"
  },
  {
    "key": "familyValuesLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: القيم الأسرية ونمط الح...",
    "defaultAr": "القيم الأسرية ونمط الحياة"
  },
  {
    "key": "waliContactCardTitle",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: بيانات الولي الشرعي للت...",
    "defaultAr": "بيانات الولي الشرعي للتواصل"
  },
  {
    "key": "waliNameLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: اسم الولي",
    "defaultAr": "اسم الولي"
  },
  {
    "key": "waliRelationLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: صلة القرابة",
    "defaultAr": "صلة القرابة"
  },
  {
    "key": "waliPhoneLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: رقم هاتف الولي",
    "defaultAr": "رقم هاتف الولي"
  },
  {
    "key": "waliNoteLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: توجيه الولي للخطاب",
    "defaultAr": "توجيه الولي للخطاب"
  },
  {
    "key": "closeBtn",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: إغلاق",
    "defaultAr": "إغلاق"
  },
  {
    "key": "sendProposalModalBtn",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: إرسال طلب خطبة رسمي لل...",
    "defaultAr": "إرسال طلب خطبة رسمي للولي"
  },
  {
    "key": "waliPortalTitle",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: بوابة الولي الشرعي ومجل...",
    "defaultAr": "بوابة الولي الشرعي ومجلس الخطوبة"
  },
  {
    "key": "waliPortalSubtitle",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: حفظ كرامة المحارم، توثي...",
    "defaultAr": "حفظ كرامة المحارم، توثيق طلبات الخاطبين، وترتيب مجالس الرؤية الشرعية بما يرضي الله ورسوله."
  },
  {
    "key": "waliIncomingRequests",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: طلبات الخطبة الواردة",
    "defaultAr": "طلبات الخطبة الواردة"
  },
  {
    "key": "waliActionApprove",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: قبول وترتيب الرؤية الشر...",
    "defaultAr": "قبول وترتيب الرؤية الشرعية"
  },
  {
    "key": "waliActionDecline",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: اعتذار بلطف واحترام",
    "defaultAr": "اعتذار بلطف واحترام"
  },
  {
    "key": "waliActionStartIstikhara",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: بدء مرحلة الاستخارة",
    "defaultAr": "بدء مرحلة الاستخارة"
  },
  {
    "key": "waliVerificationBadge",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: حساب ولي معتمد ومحقق",
    "defaultAr": "حساب ولي معتمد ومحقق"
  },
  {
    "key": "waliSecurityPledge",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: تعهد شرعي: أقر بصفتي ول...",
    "defaultAr": "تعهد شرعي: أقر بصفتي ولي أمر شرعي بمسؤوليتي عن مراجعة المتقدمين ومتابعة مسار التعارف بما يوافق أحكام الإسلام وبحضور المحارم."
  },
  {
    "key": "proposalsTitle",
    "category": "marriage",
    "descriptionAr": "طلبات ومسار الخطوبة: متابعة مسار الخطوبة والرؤية ا...",
    "defaultAr": "متابعة مسار الخطوبة والرؤية الشرعية"
  },
  {
    "key": "proposalsSubtitle",
    "category": "marriage",
    "descriptionAr": "طلبات ومسار الخطوبة: خطوات واضحة ومباركة تبدأ من ا...",
    "defaultAr": "خطوات واضحة ومباركة تبدأ من الولي وتنتهي بالميثاق الغليظ."
  },
  {
    "key": "statusPendingWali",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: بانتظار موافقة الولي",
    "defaultAr": "بانتظار موافقة الولي"
  },
  {
    "key": "statusApprovedWali",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: وافق الولي - ترتيب الرؤ...",
    "defaultAr": "وافق الولي - ترتيب الرؤية"
  },
  {
    "key": "statusIstikhara",
    "category": "marriage",
    "descriptionAr": "طلبات ومسار الخطوبة: مرحلة صلاة الاستخارة",
    "defaultAr": "مرحلة صلاة الاستخارة"
  },
  {
    "key": "statusMeetingScheduled",
    "category": "marriage",
    "descriptionAr": "طلبات ومسار الخطوبة: موعد الرؤية الشرعية محدد",
    "defaultAr": "موعد الرؤية الشرعية محدد"
  },
  {
    "key": "statusDeclined",
    "category": "marriage",
    "descriptionAr": "طلبات ومسار الخطوبة: لم يحصل نصيب (قدر الله)",
    "defaultAr": "لم يحصل نصيب (قدر الله)"
  },
  {
    "key": "suitorLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: الخاطب",
    "defaultAr": "الخاطب"
  },
  {
    "key": "candidateLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: المخطوبة",
    "defaultAr": "المخطوبة"
  },
  {
    "key": "stageLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: المرحلة الحالية",
    "defaultAr": "المرحلة الحالية"
  },
  {
    "key": "counselorTitle",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: المستشار الشرعي...",
    "defaultAr": "المستشار الشرعي الذكي ومساعد التوافق"
  },
  {
    "key": "counselorSubtitle",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: استشارات أسرية ...",
    "defaultAr": "استشارات أسرية موثقة مستمدة من الكتاب والسنة، وتوليد نصوص الاستخارة، واختبار التوافق الأسري."
  },
  {
    "key": "counselorTabChat",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: استشارة فورية",
    "defaultAr": "استشارة فورية"
  },
  {
    "key": "counselorTabCalculator",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: حاسبة التوافق ا...",
    "defaultAr": "حاسبة التوافق الشرعي"
  },
  {
    "key": "counselorTabIstikhara",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: دليل ودعاء الاس...",
    "defaultAr": "دليل ودعاء الاستخارة"
  },
  {
    "key": "counselorTabQuestions",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: أسئلة الرؤية ال...",
    "defaultAr": "أسئلة الرؤية الشرعية"
  },
  {
    "key": "askPlaceholder",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: اكتب سؤالك هنا ...",
    "defaultAr": "اكتب سؤالك هنا (مثال: كيف نقيم مجلس الرؤية الشرعية؟ ما هي أفضل أسئلة للتعارف؟)..."
  },
  {
    "key": "sendQuestionBtn",
    "category": "general",
    "descriptionAr": "إرسال للمستشار الشرعي",
    "defaultAr": "إرسال للمستشار الشرعي"
  },
  {
    "key": "quickPrompt1",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: ما هي الأسئلة ا...",
    "defaultAr": "ما هي الأسئلة الأساسية التي يجب طرحها في أول لقاء مع الولي؟"
  },
  {
    "key": "quickPrompt2",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: كيف أعرف أثر صل...",
    "defaultAr": "كيف أعرف أثر صلاة الاستخارة وهل يلزم رؤيا منامية؟"
  },
  {
    "key": "quickPrompt3",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: تيسير المهور في...",
    "defaultAr": "تيسير المهور في الإسلام وأثرها على بركة الزواج"
  },
  {
    "key": "istikharaDuaTitle",
    "category": "counselor",
    "descriptionAr": "المستشار الشرعي والذكاء الاصطناعي: دعاء صلاة الاست...",
    "defaultAr": "دعاء صلاة الاستخارة النبوي الشريف"
  },
  {
    "key": "celebrationsTitle",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: أفراح ميثاق وعقود القران ال...",
    "defaultAr": "أفراح ميثاق وعقود القران المباركة"
  },
  {
    "key": "celebrationsSubtitle",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: نحتفي بزيجات تمت وفق شرع ال...",
    "defaultAr": "نحتفي بزيجات تمت وفق شرع الله. بطاقات دعوة عقد قران تفاعلية مبهجة ومصممة بأناقة."
  },
  {
    "key": "celebrateWithUs",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: أرسل تبريكاتك بالدعاء المأث...",
    "defaultAr": "أرسل تبريكاتك بالدعاء المأثور"
  },
  {
    "key": "barakallahuLakuma",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: «بَارَكَ اللَّهُ لَكَ، وَبَ...",
    "defaultAr": "«بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»"
  },
  {
    "key": "rsvpGoing",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: حاضر بالدعاء والمشاركة",
    "defaultAr": "حاضر بالدعاء والمشاركة"
  },
  {
    "key": "rsvpMaybe",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: سأحاول الحضور",
    "defaultAr": "سأحاول الحضور"
  },
  {
    "key": "rsvpCant",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: أعتذر مع أصدق الدعاء",
    "defaultAr": "أعتذر مع أصدق الدعاء"
  },
  {
    "key": "sendBlessingBtn",
    "category": "celebrations",
    "descriptionAr": "عقود القران والاحتفاء: إطلاق بهجة التبريكات (Confe...",
    "defaultAr": "إطلاق بهجة التبريكات (Confetti) 🎊"
  },
  {
    "key": "settingsTitle",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: إعدادات الحساب والضوابط ...",
    "defaultAr": "إعدادات الحساب والضوابط الشرعية"
  },
  {
    "key": "settingsSubtitle",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: تحكم كامل في الخصوصية، ح...",
    "defaultAr": "تحكم كامل في الخصوصية، حجب الصور، تفعيل إشعارات الولي، والتوثيق الرسمي."
  },
  {
    "key": "settingsTabPrivacy",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: الخصوصية والاحتشام",
    "defaultAr": "الخصوصية والاحتشام"
  },
  {
    "key": "settingsTabWali",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: إشراف الولي",
    "defaultAr": "إشراف الولي"
  },
  {
    "key": "settingsTabNotifications",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: الإشعارات والتنبيهات",
    "defaultAr": "الإشعارات والتنبيهات"
  },
  {
    "key": "settingsTabVerification",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: التوثيق والهوية",
    "defaultAr": "التوثيق والهوية"
  },
  {
    "key": "settingsBlurDefault",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: حجب الصورة الشخصية تلقائ...",
    "defaultAr": "حجب الصورة الشخصية تلقائياً عن الجميع"
  },
  {
    "key": "settingsBlurDefaultDesc",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: لا يتم كشف الصورة إلا بع...",
    "defaultAr": "لا يتم كشف الصورة إلا بعد موافقة الطرفين وإذن الولي الصريح."
  },
  {
    "key": "settingsWaliDirect",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: السماح بالاتصال المباشر...",
    "defaultAr": "السماح بالاتصال المباشر برقم هاتف الولي"
  },
  {
    "key": "settingsWaliDirectDesc",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: يتم إظهار رقم الولي الم...",
    "defaultAr": "يتم إظهار رقم الولي الموثق فقط للخاطب المستوفي للشروط الشرعية."
  },
  {
    "key": "settingsNotifySms",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: إشعار SMS فوري للولي عند...",
    "defaultAr": "إشعار SMS فوري للولي عند وصول أي طلب خطوبة"
  },
  {
    "key": "settingsSaveSuccess",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: تم حفظ الإعدادات بنجاح!",
    "defaultAr": "تم حفظ الإعدادات بنجاح!"
  },
  {
    "key": "saveChangesBtn",
    "category": "settings",
    "descriptionAr": "إعدادات الحساب والخصوصية: حفظ الإعدادات",
    "defaultAr": "حفظ الإعدادات"
  },
  {
    "key": "apiTitle",
    "category": "api",
    "descriptionAr": "واجهة برمجة التطبيقات API: واجهة برمجة التطبيقات ا...",
    "defaultAr": "واجهة برمجة التطبيقات المفتوحة (Meethaq REST API)"
  },
  {
    "key": "apiSubtitle",
    "category": "api",
    "descriptionAr": "واجهة برمجة التطبيقات API: وثائق ومختبر تفاعلي لتج...",
    "defaultAr": "وثائق ومختبر تفاعلي لتجربة واجهات برمجة منصة ميثاق للزواج الإسلامي."
  },
  {
    "key": "apiTestBtn",
    "category": "api",
    "descriptionAr": "واجهة برمجة التطبيقات API: إرسال طلب تجريبي (Execu...",
    "defaultAr": "إرسال طلب تجريبي (Execute)"
  },
  {
    "key": "apiResponseLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: استجابة الخادم (Respon...",
    "defaultAr": "استجابة الخادم (Response 200 OK)"
  },
  {
    "key": "apiCurlLabel",
    "category": "profile",
    "descriptionAr": "تفاصيل الملف الشخصي للخطبة: أمر cURL",
    "defaultAr": "أمر cURL"
  },
  {
    "key": "apiEndpointHealth",
    "category": "api",
    "descriptionAr": "واجهة برمجة التطبيقات API: فحص حالة المنصة والتواف...",
    "defaultAr": "فحص حالة المنصة والتوافق الشرعي"
  },
  {
    "key": "apiEndpointProfiles",
    "category": "api",
    "descriptionAr": "واجهة برمجة التطبيقات API: جلب الملفات مع معايير ا...",
    "defaultAr": "جلب الملفات مع معايير الالتزام الديني"
  },
  {
    "key": "apiEndpointProposals",
    "category": "api",
    "descriptionAr": "واجهة برمجة التطبيقات API: إنشاء واستعلام طلبات ال...",
    "defaultAr": "إنشاء واستعلام طلبات الخطوبة الشرعية"
  },
  {
    "key": "apiEndpointWali",
    "category": "wali",
    "descriptionAr": "بوابة وإشراف الولي الشرعي: توثيق بيانات الولي الشر...",
    "defaultAr": "توثيق بيانات الولي الشرعي"
  },
  {
    "key": "apiEndpointAi",
    "category": "api",
    "descriptionAr": "واجهة برمجة التطبيقات API: المستشار الشرعي والذكاء...",
    "defaultAr": "المستشار الشرعي والذكاء الاصطناعي"
  },
  {
    "key": "footerMotto",
    "category": "footer",
    "descriptionAr": "تذييل المنصة (Footer): منصة إسلامية غير ربحية غايت...",
    "defaultAr": "منصة إسلامية غير ربحية غايتها العفاف وبناء البيوت على تقوى من الله ورضوان."
  },
  {
    "key": "footerAdvisory",
    "category": "footer",
    "descriptionAr": "تذييل المنصة (Footer): تحت إشراف ومراجعة لجنة شرعي...",
    "defaultAr": "تحت إشراف ومراجعة لجنة شرعية متخصصة في فقه الأسرة."
  },
  {
    "key": "footerRights",
    "category": "footer",
    "descriptionAr": "تذييل المنصة (Footer): جميع الحقوق محفوظة لمنصة مي...",
    "defaultAr": "جميع الحقوق محفوظة لمنصة ميثاق للزواج الإسلامي المبارك © 2026"
  },
  {
    "key": "roleMale",
    "category": "registration",
    "descriptionAr": "صفة الحساب: ذكر",
    "defaultAr": "ذكر"
  },
  {
    "key": "roleFemale",
    "category": "registration",
    "descriptionAr": "صفة الحساب: أنثى",
    "defaultAr": "أنثى"
  },
  {
    "key": "roleWali",
    "category": "registration",
    "descriptionAr": "صفة الحساب: ولي الأمر",
    "defaultAr": "ولي الأمر"
  },
  {
    "key": "registerSelectRoleTitle",
    "category": "registration",
    "descriptionAr": "عنوان اختيار صفة التسجيل",
    "defaultAr": "حدد صفتك في التسجيل:"
  },
  {
    "key": "registerStep1Title",
    "category": "registration",
    "descriptionAr": "عنوان الخطوة 1 في التسجيل",
    "defaultAr": "١. الحساب والصفة"
  },
  {
    "key": "registerStep2Title",
    "category": "registration",
    "descriptionAr": "عنوان الخطوة 2 في التسجيل",
    "defaultAr": "٢. البيانات الشخصية"
  },
  {
    "key": "registerStep3Title",
    "category": "registration",
    "descriptionAr": "عنوان الخطوة 3 في التسجيل",
    "defaultAr": "٣. السمت الديني"
  },
  {
    "key": "registerStep4Title",
    "category": "registration",
    "descriptionAr": "عنوان الخطوة 4 في التسجيل",
    "defaultAr": "٤. الجاهزية والولاية"
  },
  {
    "key": "registerStep5Title",
    "category": "registration",
    "descriptionAr": "عنوان الخطوة 5 في التسجيل",
    "defaultAr": "٥. الصورة الشخصية"
  },
  {
    "key": "registerNextBtn",
    "category": "registration",
    "descriptionAr": "زر الانتقال للخطوة التالية",
    "defaultAr": "الصفحة التالية"
  },
  {
    "key": "registerPrevBtn",
    "category": "registration",
    "descriptionAr": "زر الرجوع للخطوة السابقة",
    "defaultAr": "الخطوة السابقة"
  },
  {
    "key": "registerSubmitBtn",
    "category": "registration",
    "descriptionAr": "زر إتمام التسجيل النهائي",
    "defaultAr": "إتمام التسجيل والبحث عن شريك"
  }
];
