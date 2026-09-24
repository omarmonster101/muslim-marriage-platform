export interface ProfileQuestion {
  id: string;
  category: 'religious' | 'personal' | 'matrimonial' | 'family';
  questionAr: string;
  questionEn: string;
  type: 'text' | 'select' | 'radio' | 'textarea';
  optionsAr?: string[];
  isRequired: boolean;
  order: number;
}

export interface ModeratorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'moderator' | 'sharia_supervisor' | 'support_agent';
  assignedQueue: 'all' | 'walis' | 'profiles' | 'reports';
  status: 'active' | 'suspended';
  lastActive: string;
  actionsCount: number;
}

export interface UserRoleDefinition {
  id: string;
  nameAr: string;
  nameEn: string;
  badgeColor: string;
  descriptionAr: string;
  permissions: string[];
  userCount: number;
}

export interface MessageTriggerRule {
  id: string;
  name: string;
  triggerEvent: 'on_new_khitbah' | 'on_wali_verified' | 'on_istikhara_recorded' | 'on_suspicious_message' | 'on_inactivity_7d';
  actionType: 'send_sms' | 'send_email' | 'system_alert' | 'block_message';
  templateText: string;
  isEnabled: boolean;
}

export interface AdminPageItem {
  id: string;
  title: string;
  slug: string;
  type: 'standard' | 'special';
  status: 'published' | 'draft';
  lastUpdated: string;
  author: string;
  contentAr?: string;
}

export const INITIAL_QUESTIONS: ProfileQuestion[] = [
  {
    id: 'q_prayer',
    category: 'religious',
    questionAr: 'مدى المحافظة على الصلوات الخمس في أوقاتها',
    questionEn: 'Commitment to the five daily prayers on time',
    type: 'select',
    optionsAr: ['دائماً في المسجد مع الجماعة (للرجال)', 'دائماً في أول وقتها', 'غالباً في وقتها مع الحرص', 'أجاهد نفسي وأستغفر الله'],
    isRequired: true,
    order: 1
  },
  {
    id: 'q_quran',
    category: 'religious',
    questionAr: 'الورد اليومي من القرآن الكريم والحفظ',
    questionEn: 'Daily Quran recitation and memorization',
    type: 'select',
    optionsAr: ['خاتم لكتاب الله كاملاً', 'أحفظ أكثر من 15 جزءاً', 'أحفظ بين 5 إلى 15 جزءاً', 'أحفظ جزء عم وأحرص على التلاوة اليومية'],
    isRequired: true,
    order: 2
  },
  {
    id: 'q_hijab_beard',
    category: 'religious',
    questionAr: 'السمت الشرعي والالتزام بالزي والحجاب',
    questionEn: 'Islamic appearance (Hijab / Niqab / Sunnah Beard)',
    type: 'select',
    optionsAr: ['حجاب شرعي كامل ساتر فضفاض', 'نقاب ساتر مع قفازين', 'لحية سنة نبوية متبعة', 'سمت إسلامي معتدل ومحافظ'],
    isRequired: true,
    order: 3
  },
  {
    id: 'q_wali_consent',
    category: 'matrimonial',
    questionAr: 'جاهزية ولي الأمر الشرعي للتواصل ومباشرة الرؤية الشرعية',
    questionEn: 'Guardian readiness for communication and Sharia vision',
    type: 'radio',
    optionsAr: ['نعم، ولي أمري على علم كامل ومستعد للتواصل فوراً', 'تم إبلاغ الولي وسيقوم بالرد عند وصول الطلب الجاد'],
    isRequired: true,
    order: 4
  },
  {
    id: 'q_housing',
    category: 'matrimonial',
    questionAr: 'طبيعة السكن الشرعي المستقل للزوجية',
    questionEn: 'Independent marital accommodation',
    type: 'select',
    optionsAr: ['شقة مستقلة ملك', 'شقة مستقلة إيجار جاهزة', 'جناح مستقل وخاص في منزل العائلة', 'في طور التجهيز بالتشاور'],
    isRequired: true,
    order: 5
  },
  {
    id: 'q_mahr',
    category: 'matrimonial',
    questionAr: 'النظرة للمهر وتيسير مؤونة الزواج',
    questionEn: 'Perspective on Mahr (dowry) and moderation',
    type: 'select',
    optionsAr: ['أعظمهن بركة أيسرهن مؤونة - ميسور وفق السنة', 'مهر معتدل متعارف عليه شرعاً وعرفاً', 'متروك للاتفاق بين الأولياء بالمعروف'],
    isRequired: false,
    order: 6
  }
];

export const INITIAL_MODERATORS: ModeratorUser[] = [
  {
    id: 'mod_1',
    name: 'الشيخ عبدالمحسن العتيبي',
    email: 'mod.sharia@meethaq.org',
    phone: '+966 50 111 2233',
    role: 'sharia_supervisor',
    assignedQueue: 'all',
    status: 'active',
    lastActive: 'منذ 5 دقائق',
    actionsCount: 428
  },
  {
    id: 'mod_2',
    name: 'د. هند بنت محمد الفهد',
    email: 'mod.females@meethaq.org',
    phone: '+966 55 444 7788',
    role: 'moderator',
    assignedQueue: 'walis',
    status: 'active',
    lastActive: 'منذ 18 دقيقة',
    actionsCount: 312
  },
  {
    id: 'mod_3',
    name: 'سليمان بن راشد الدوسري',
    email: 'admin.support@meethaq.org',
    phone: '+966 54 999 8811',
    role: 'super_admin',
    assignedQueue: 'all',
    status: 'active',
    lastActive: 'الآن (متصل)',
    actionsCount: 1540
  }
];

export const INITIAL_ROLES: UserRoleDefinition[] = [
  {
    id: 'super_admin',
    nameAr: 'مدير عام النظام',
    nameEn: 'Super Administrator',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    descriptionAr: 'صلاحيات كاملة مطلقة على الإعدادات، المستخدمين، المالية، القواعد البرمجية، والتدقيق الشرعي.',
    permissions: ['all_access', 'financial_management', 'system_config', 'delete_records', 'ban_users'],
    userCount: 2
  },
  {
    id: 'sharia_supervisor',
    nameAr: 'مشرف شرعي معتمد',
    nameEn: 'Sharia Supervisor',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    descriptionAr: 'مراجعة طلبات الخطوبة، الإشراف على غرف المحادثات، واعتماد صكوك توثيق أولياء الأمور.',
    permissions: ['view_chats', 'audit_proposals', 'verify_walis', 'review_profiles', 'warn_users'],
    userCount: 5
  },
  {
    id: 'moderator',
    nameAr: 'مدقق ومراقب محتوى',
    nameEn: 'Content Moderator',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    descriptionAr: 'مراجعة صور الأخوات والتأكد من ضبابية الحجاب، فحص النصوص، والتصدي للبلاغات الكاذبة.',
    permissions: ['review_profiles', 'review_photos', 'handle_reports'],
    userCount: 8
  },
  {
    id: 'certified_wali',
    nameAr: 'ولي أمر موثق',
    nameEn: 'Verified Guardian',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    descriptionAr: 'أولياء أمور الفتيات الموثقون رسمياً بصك القرابة ورقم الهاتف لمراجعة وتنسيق الخطوبات.',
    permissions: ['approve_khitbah', 'schedule_meeting', 'attend_supervised_chat'],
    userCount: 6240
  },
  {
    id: 'seeker',
    nameAr: 'عضو باحث عن الحلال',
    nameEn: 'Registered Seeker',
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    descriptionAr: 'المستخدمون العاديون الباحثون عن الزواج الشرعي ببيانات موثقة وتحت مظلة الولي.',
    permissions: ['create_profile', 'search_members', 'send_proposal', 'view_approved_matches'],
    userCount: 14850
  }
];

export const INITIAL_RESTRICTED_WORDS: string[] = [
  'admin',
  'administrator',
  'root',
  'support',
  'meethaq_team',
  'official',
  'moderator',
  'sharia_board',
  'fatwa_council',
  'whatsapp',
  'snapchat',
  'telegram',
  'instagram',
  'dating',
  'hookup',
  'sugar',
  'misyar_covert',
  'phone_number_ad',
  'escort',
  'freelance_chat'
];

export const INITIAL_TRIGGER_RULES: MessageTriggerRule[] = [
  {
    id: 'rule_1',
    name: 'إشعار الولي فور وصول طلب خطوبة جديد',
    triggerEvent: 'on_new_khitbah',
    actionType: 'send_sms',
    templateText: 'السلام عليكم يا ولي أمر [candidate_name]، تقدم الخاطب [suitor_name] بطلب خطوبة شرعي جاد عبر منصة ميثاق. اضغط الرابط للاطلاع: [link]',
    isEnabled: true
  },
  {
    id: 'rule_2',
    name: 'حظر تلقائي لأرقام الهواتف داخل محادثة التعارف الأولية',
    triggerEvent: 'on_suspicious_message',
    actionType: 'block_message',
    templateText: 'تنبيه شرعي: يُمنع تبادل وسائل التواصل الخاصة خارج إشراف الولي وقبل مجلس الرؤية الشرعية الرسمية صوناً للأعراض.',
    isEnabled: true
  },
  {
    id: 'rule_3',
    name: 'تذكير طرفي الخطبة بصلاة الاستخارة بعد الرؤية الشرعية',
    triggerEvent: 'on_istikhara_recorded',
    actionType: 'send_email',
    templateText: 'عزيزنا [user_name]، نذكركم بسنة صلاة الاستخارة المباركة ودعائها المأثور لسؤال الله عز وجل التوفيق والبركة في هذا الميثاق.',
    isEnabled: true
  },
  {
    id: 'rule_4',
    name: 'إشعار فوري عند مصادقة صك قرابة الولي الشرعي',
    triggerEvent: 'on_wali_verified',
    actionType: 'send_sms',
    templateText: 'مبارك، تم اعتماد وتوثيق صفتكم الشرعية كـ ([relation]) لـ ([candidate_name]). بإمكانكم الآن إدارة طلبات الزواج وتحديد مجالس الرؤية.',
    isEnabled: true
  }
];

export const INITIAL_PAGES_LIST: AdminPageItem[] = [
  {
    id: 'page_about',
    title: 'من نحن - رسالة منصة ميثاق',
    slug: 'about-us',
    type: 'standard',
    status: 'published',
    lastUpdated: '2026-09-15',
    author: 'هيئة التحرير الشرعية',
    contentAr: 'منصة ميثاق منصة إسلامية رائدة تسعى لإحياء سنة النكاح الشرعي وتيسير سبل الحلال وصيانة كرامة وحياء الأخوات تحت مظلة الأولياء الشرعيين.'
  },
  {
    id: 'page_terms',
    title: 'الشروط والأحكام والضوابط الشرعية',
    slug: 'terms-and-conditions',
    type: 'standard',
    status: 'published',
    lastUpdated: '2026-09-18',
    author: 'لجنة الفتوى والمراجعة',
    contentAr: 'يلتزم كل مسجل بالصدق التام، عدم الخلوة المحرمة، الإقرار بالباءة، وإشراك الولي الشرعي في كافة مراحل الخطوبة والمصاهرة.'
  },
  {
    id: 'page_privacy',
    title: 'سياسة الخصوصية وستر البيانات',
    slug: 'privacy-policy',
    type: 'standard',
    status: 'published',
    lastUpdated: '2026-09-20',
    author: 'أمن المعلومات',
    contentAr: 'تُحجب صور الأخوات افتراضياً ولا يُتاح الاطلاع عليها إلا بموافقة صريحة من الولي، وتُشفر جميع سجلات التحقق من الهوية وفق أعلى المعايير.'
  },
  {
    id: 'page_contact',
    title: 'تواصل معنا والاستفسارات الشرعية',
    slug: 'contact-us',
    type: 'standard',
    status: 'published',
    lastUpdated: '2026-09-10',
    author: 'الدعم الفني',
    contentAr: 'قنوات التواصل المباشرة مع فريق الدعم الفني ولجنة الإشراف الشرعي للإجابة عن الفتاوى والاستفسارات.'
  },
  {
    id: 'page_special_landing',
    title: 'واجهة البداية التفاعلية (Landing Page)',
    slug: 'index',
    type: 'special',
    status: 'published',
    lastUpdated: '2026-09-21',
    author: 'إدارة الموقع'
  },
  {
    id: 'page_special_wali',
    title: 'بوابة إشراف الولي الشرعي المباشرة',
    slug: 'wali-portal',
    type: 'special',
    status: 'published',
    lastUpdated: '2026-09-21',
    author: 'إدارة الموقع'
  },
  {
    id: 'page_special_nikah',
    title: 'منظومة صك الزواج وعقد القران الإلكتروني',
    slug: 'nikah-flow',
    type: 'special',
    status: 'published',
    lastUpdated: '2026-09-21',
    author: 'إدارة الموقع'
  }
];
