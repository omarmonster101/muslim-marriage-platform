import { ManagedUserItem, PlatformRole } from '../types';

export interface RoleInfo {
  role: PlatformRole;
  labelAr: string;
  badgeClass: string;
  dotClass: string;
  description: string;
  permissionsList: string[];
}

export const ROLE_DEFINITIONS: Record<PlatformRole, RoleInfo> = {
  user: {
    role: 'user',
    labelAr: 'مستخدم عادي (باحث/ة)',
    badgeClass: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    dotClass: 'bg-neutral-500',
    description: 'باحث أو مرشحة؛ إنشاء سيرة، البحث، إرسال طلبات الخطوبة الشرعية والتواصل بإشراف الولي.',
    permissionsList: [
      'إنشاء وتحديث السيرة الذاتية',
      'البحث في قوائم المرشحين المتوافقة',
      'إرسال طلبات الخطوبة الرسمية',
      'حضور المحادثات الشرعية المراقبة'
    ]
  },
  wali: {
    role: 'wali',
    labelAr: 'ولي أمر معتمد',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    dotClass: 'bg-amber-600',
    description: 'ولي شرعي موثق بصك القرابة؛ يمتلك حق قبول/رفض طلبات الخطاب، فتح الصور، وتنسيق الرؤية الشرعية.',
    permissionsList: [
      'استقبال طلبات التقدم لابنته/موليته',
      'منح أو منع إذن كشف الصور الشرعية',
      'المشاركة الإلزامية في غرفة المحادثة',
      'تحديد موعد وضوابط الرؤية الشرعية',
      'اعتماد صك الزواج وعقد القران'
    ]
  },
  moderator: {
    role: 'moderator',
    labelAr: 'مشرف ومدقق شرعي',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    dotClass: 'bg-blue-600',
    description: 'عضو هيئة الرقابة أو مدقق محتوى؛ فحص صكوك الأولياء، مراجعة البلاغات، ومراقبة الالتزام بآداب المحادثة.',
    permissionsList: [
      'فحص واعتماد صكوك ولاية الأولياء',
      'مراقبة سجل محادثات الخطاب والتدخل عند اللزوم',
      'مراجعة البلاغات وتوجيه الإنذارات',
      'تدقيق صور الحجاب والستر الشرعي'
    ]
  },
  admin: {
    role: 'admin',
    labelAr: 'مدير نظام كامل الصلاحيات',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    dotClass: 'bg-purple-600',
    description: 'إدارة شاملة للمنصة، تعيين وحذف الأدوار، ضبط قواعد النظام، متابعة التقارير والاشتراكات والمالية.',
    permissionsList: [
      'إدارة وتعيين وتعديل كافة أدوار المستخدمين',
      'التحكم في إعدادات المنصة وقواعد البيانات',
      'إدارة الرسوم والاشتراكات والعمليات المالية',
      'تجميد أو فك حظر الحسابات وحذف السير المخالفة',
      'إصدار التقارير الإدارية وتصدير السجلات'
    ]
  }
};

export const INITIAL_MANAGED_USERS: ManagedUserItem[] = [
  {
    id: 'user-admin-1',
    uid: 'uid-admin-1',
    name: 'المهندس حمزة الهذلي',
    email: 'hhhosts@gmail.com',
    phone: '+966 50 111 2233',
    role: 'admin',
    status: 'active',
    gender: 'male',
    city: 'الرياض',
    createdAt: '2026-01-01',
    lastActive: 'الآن (متصل)',
    assignedBy: 'النظام الأساسي',
    roleReason: 'المدير العام ومؤسس المنصة'
  },
  {
    id: 'user-admin-2',
    uid: 'uid-admin-2',
    name: 'سليمان بن راشد الدوسري',
    email: 'admin.support@meethaq.org',
    phone: '+966 54 999 8811',
    role: 'admin',
    status: 'active',
    gender: 'male',
    city: 'الرياض',
    createdAt: '2026-01-15',
    lastActive: 'منذ 8 دقائق',
    assignedBy: 'حمزة الهذلي',
    roleReason: 'مدير العمليات والرقابة التقنية'
  },
  {
    id: 'user-mod-1',
    uid: 'uid-mod-1',
    name: 'الشيخ د. عبدالمحسن العتيبي',
    email: 'mod.sharia@meethaq.org',
    phone: '+966 50 222 3344',
    role: 'moderator',
    status: 'active',
    gender: 'male',
    city: 'مكة المكرمة',
    createdAt: '2026-02-01',
    lastActive: 'منذ 15 دقيقة',
    assignedBy: 'الإدارة الشرعية',
    roleReason: 'عضو هيئة الرقابة الشرعية المعتمد'
  },
  {
    id: 'user-mod-2',
    uid: 'uid-mod-2',
    name: 'د. هند بنت محمد الفهد',
    email: 'mod.females@meethaq.org',
    phone: '+966 55 444 7788',
    role: 'moderator',
    status: 'active',
    gender: 'female',
    city: 'الرياض',
    createdAt: '2026-02-10',
    lastActive: 'منذ 32 دقيقة',
    assignedBy: 'الإدارة الشرعية',
    roleReason: 'مستشارة تدقيق شؤون المرشحات والأولياء'
  },
  {
    id: 'user-wali-1',
    uid: 'uid-wali-1',
    name: 'أحمد بن إبراهيم الخالدي (الوالد)',
    email: 'wali.khalidi@gmail.com',
    phone: '+966 50 123 4567',
    role: 'wali',
    status: 'active',
    gender: 'male',
    city: 'الرياض',
    createdAt: '2026-03-01',
    lastActive: 'اليوم، 11:40 ص',
    assignedBy: 'الشيخ عبدالمحسن العتيبي',
    roleReason: 'تم توثيق صك الولاية الشرعية رقم 44/902',
    verifiedWali: true
  },
  {
    id: 'user-wali-2',
    uid: 'uid-wali-2',
    name: 'سعد بن عبدالله القحطاني (الوالد)',
    email: 'qahtani.wali@gmail.com',
    phone: '+966 50 888 7766',
    role: 'wali',
    status: 'active',
    gender: 'male',
    city: 'جدة',
    createdAt: '2026-03-12',
    lastActive: 'أمس، 09:20 م',
    assignedBy: 'الشيخ عبدالمحسن العتيبي',
    roleReason: 'تم التحقق من صك القرابة والهوية الوطنية',
    verifiedWali: true
  },
  {
    id: 'user-wali-3',
    uid: 'uid-wali-3',
    name: 'خالد بن عبدالرحمن الدوسري (الأخ والوكيل)',
    email: 'khaled.dossary@outlook.com',
    phone: '+966 55 333 4455',
    role: 'wali',
    status: 'pending_verification',
    gender: 'male',
    city: 'الدمام',
    createdAt: '2026-04-05',
    lastActive: 'منذ ساعتين',
    assignedBy: 'تسجيل جديد',
    roleReason: 'بانتظار مطابقة وكالة شرعية إلكترونية',
    verifiedWali: false
  },
  {
    id: 'user-seeker-1',
    uid: 'uid-seeker-1',
    name: 'عبدالله بن فهد الشمري',
    email: 'abdullah.shammari@outlook.com',
    phone: '+966 55 123 9876',
    role: 'user',
    status: 'active',
    gender: 'male',
    city: 'الرياض',
    createdAt: '2026-03-05',
    lastActive: 'الآن (نشط)',
    assignedBy: 'تسجيل ذاتي',
    roleReason: 'خاطب موثق الهوية الوطنية (نفاذ)'
  },
  {
    id: 'user-seeker-2',
    uid: 'uid-seeker-2',
    name: 'سارة بنت أحمد الخالدي',
    email: 'sara.khalidi@example.com',
    phone: '+966 55 987 6543',
    role: 'user',
    status: 'active',
    gender: 'female',
    city: 'الرياض',
    createdAt: '2026-03-08',
    lastActive: 'منذ ساعة',
    assignedBy: 'تسجيل ذاتي تحت إشراف الولي',
    roleReason: 'مرشحة مصونة بإذن وليها'
  },
  {
    id: 'user-seeker-3',
    uid: 'uid-seeker-3',
    name: 'فيصل بن عبدالعزيز التميمي',
    email: 'faisal.tamimi@gmail.com',
    phone: '+966 54 777 2211',
    role: 'user',
    status: 'active',
    gender: 'male',
    city: 'بريدة',
    createdAt: '2026-03-18',
    lastActive: 'منذ يومين',
    assignedBy: 'تسجيل ذاتي',
    roleReason: 'عضو مسجل'
  },
  {
    id: 'user-seeker-4',
    uid: 'uid-seeker-4',
    name: 'نورة بنت سعد القحطاني',
    email: 'noura.qahtani@yahoo.com',
    phone: '+966 56 321 0099',
    role: 'user',
    status: 'active',
    gender: 'female',
    city: 'جدة',
    createdAt: '2026-03-22',
    lastActive: 'منذ 3 ساعات',
    assignedBy: 'تسجيل ذاتي',
    roleReason: 'مرشحة مفعلة'
  },
  {
    id: 'user-seeker-5',
    uid: 'uid-seeker-5',
    name: 'عمر بن طارق الحربي',
    email: 'omar.harbi@gmail.com',
    phone: '+966 50 666 4433',
    role: 'user',
    status: 'suspended',
    gender: 'male',
    city: 'المدينة المنورة',
    createdAt: '2026-02-28',
    lastActive: 'منذ 5 أيام',
    assignedBy: 'د. هند الفهد',
    roleReason: 'تعليق مؤقت بسبب بلاغ عن عدم الالتزام بضوابط الخطوبة'
  }
];
