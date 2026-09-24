import { 
  RegistrationPolicySettings, 
  RegistrationStepConfig, 
  RegisteredAccountRecord 
} from '../types';

export const DEFAULT_REGISTRATION_STEPS: RegistrationStepConfig[] = [
  {
    id: 'account',
    stepNumber: 1,
    titleAr: 'الصفحة 1: الحساب والمسار الشرعي',
    titleEn: 'Page 1: Account & Identity Track',
    subtitleAr: 'تحديد المسار: خاطب (ذكر)، مخطوبة (أنثى)، أو ولي أمر وتعيين بيانات الدخول',
    subtitleEn: 'Select track: Suitor, Candidate or Wali, and set credentials',
    isEnabled: true,
    isRequired: true,
    descriptionAr: 'الخطوة الأساسية لإنشاء الحساب وتحديد الجنس والصلاحيات'
  },
  {
    id: 'demographics',
    stepNumber: 2,
    titleAr: 'الصفحة 2: البيانات الشخصية والنشأة',
    titleEn: 'Page 2: Demographics & Background',
    subtitleAr: 'العمر، الجنسية، المدينة، الحالة الاجتماعية، المؤهل والوظيفة',
    subtitleEn: 'Age, nationality, city, marital status, education, and profession',
    isEnabled: true,
    isRequired: true,
    descriptionAr: 'جمع المؤشرات الحيوية الضرورية للبحث والمطابقة الدقيقة'
  },
  {
    id: 'religious',
    stepNumber: 3,
    titleAr: 'الصفحة 3: السمت الديني والالتزام بالسنة',
    titleEn: 'Page 3: Religious Lifestyle',
    subtitleAr: 'الصلاة، ورد القرآن، سمت اللباس الشرعي، وعدم التدخين',
    subtitleEn: 'Prayer habits, Quran memorization, and Islamic attire',
    isEnabled: true,
    isRequired: true,
    descriptionAr: 'فحص التوافق الشرعي والمحافظة على أركان الدين وسنة النبي ﷺ'
  },
  {
    id: 'matrimonial_wali',
    stepNumber: 4,
    titleAr: 'الصفحة 4: الجاهزية والولاية ومعايير الشريك',
    titleEn: 'Page 4: Readiness & Guardian Oversight',
    subtitleAr: 'بيانات الولي للأخت / إقرار الباءة والسكن للخاطب ونبذة شريك العمر',
    subtitleEn: 'Guardian details for bride / Ba\'ah and housing for suitor',
    isEnabled: true,
    isRequired: true,
    descriptionAr: 'المحور الشرعي الأهم: إشراف الولي الحصري، أو إقرار الباءة والسكن'
  },
  {
    id: 'photo_verification',
    stepNumber: 5,
    titleAr: 'الصفحة 5: رفع واعتماد الصورة والتحقق منها',
    titleEn: 'Page 5: Photo Upload & Verification',
    subtitleAr: 'رفع الصورة الشخصية وفحص مطابقتها الشرعية قبل التوجه للبحث عن شريك',
    subtitleEn: 'Upload personal photo, verify Islamic modesty, and proceed to match search',
    isEnabled: true,
    isRequired: true,
    descriptionAr: 'رفع الصورة وفحص جودتها واحتشامها مع ميزة التمويه التلقائي للأخوات'
  }
];

export const DEFAULT_REGISTRATION_POLICY: RegistrationPolicySettings = {
  activationMode: 'instant_otp',
  requireWaliForFemales: true,
  requirePhotoBlurForFemales: true,
  requireBaahForMales: true,
  requireShariaPledge: true,
  minAge: 18,
  enableDemoFill: true,
  allowGuestBrowsing: true,
  steps: DEFAULT_REGISTRATION_STEPS
};

const POLICY_STORAGE_KEY = 'meethaq_registration_policy_v2';
const ACCOUNTS_STORAGE_KEY = 'meethaq_registered_accounts_v2';

export const INITIAL_REGISTERED_ACCOUNTS: RegisteredAccountRecord[] = [
  {
    id: 'acc-1',
    email: 'khalid.eng@example.com',
    fullName: 'م. خالد بن عبد الله القحطاني',
    phone: '+966 50 111 2233',
    gender: 'male',
    role: 'suitor',
    registeredAt: '2026-09-19 14:30',
    activationStatus: 'active',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    shariaPledgeAccepted: true
  },
  {
    id: 'acc-2',
    email: 'sarah.alotaibi@example.com',
    fullName: 'سارة بنت إبراهيم العتيبي',
    phone: '+966 55 444 7788',
    gender: 'female',
    role: 'candidate',
    registeredAt: '2026-09-20 09:15',
    activationStatus: 'active',
    waliName: 'الشيخ إبراهيم بن محمد العتيبي (الوالد)',
    waliPhone: '+966 50 999 8877',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    shariaPledgeAccepted: true
  },
  {
    id: 'acc-3',
    email: 'omar.farooq@example.com',
    fullName: 'عمر بن فاروق الشامي',
    phone: '+966 54 222 6677',
    gender: 'male',
    role: 'suitor',
    registeredAt: '2026-09-20 10:45',
    activationStatus: 'pending_admin_approval',
    city: 'جدة',
    country: 'المملكة العربية السعودية',
    shariaPledgeAccepted: true
  },
  {
    id: 'acc-4',
    email: 'maryam.hassan@example.com',
    fullName: 'مريم بنت حسان الدوسري',
    phone: '+966 56 333 9900',
    gender: 'female',
    role: 'candidate',
    registeredAt: '2026-09-20 11:20',
    activationStatus: 'pending_otp',
    verificationCode: '849201',
    waliName: 'حسان بن سعد الدوسري',
    waliPhone: '+966 50 112 3344',
    city: 'الدمام',
    country: 'المملكة العربية السعودية',
    shariaPledgeAccepted: false
  }
];

export function getRegistrationPolicy(): RegistrationPolicySettings {
  if (typeof window === 'undefined') return DEFAULT_REGISTRATION_POLICY;
  try {
    const raw = localStorage.getItem(POLICY_STORAGE_KEY);
    if (!raw) return DEFAULT_REGISTRATION_POLICY;
    const parsed = JSON.parse(raw);
    // Ensure the steps match the 5-page structure with photo_verification
    if (!parsed.steps || parsed.steps.length !== 5 || !parsed.steps.some((s: any) => s.id === 'photo_verification')) {
      const refreshedPolicy = {
        ...DEFAULT_REGISTRATION_POLICY,
        ...parsed,
        steps: DEFAULT_REGISTRATION_STEPS
      };
      saveRegistrationPolicy(refreshedPolicy);
      return refreshedPolicy;
    }
    return {
      ...DEFAULT_REGISTRATION_POLICY,
      ...parsed,
      steps: Array.isArray(parsed.steps) ? parsed.steps : DEFAULT_REGISTRATION_STEPS
    };
  } catch (e) {
    return DEFAULT_REGISTRATION_POLICY;
  }
}

export function saveRegistrationPolicy(policy: RegistrationPolicySettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(POLICY_STORAGE_KEY, JSON.stringify(policy));
    window.dispatchEvent(new CustomEvent('meethaq_registration_policy_updated', { detail: policy }));
  } catch (e) {
    console.error('Failed to save registration policy', e);
  }
}

export function resetRegistrationPolicy(): RegistrationPolicySettings {
  saveRegistrationPolicy(DEFAULT_REGISTRATION_POLICY);
  return DEFAULT_REGISTRATION_POLICY;
}

export function getRegisteredAccounts(): RegisteredAccountRecord[] {
  if (typeof window === 'undefined') return INITIAL_REGISTERED_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
      return INITIAL_REGISTERED_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REGISTERED_ACCOUNTS;
  }
}

export function saveRegisteredAccounts(accounts: RegisteredAccountRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    window.dispatchEvent(new CustomEvent('meethaq_accounts_updated', { detail: accounts }));
  } catch (e) {
    console.error('Failed to save registered accounts', e);
  }
}

export function recordNewRegistration(account: Omit<RegisteredAccountRecord, 'id' | 'registeredAt'>): RegisteredAccountRecord {
  const current = getRegisteredAccounts();
  const newRecord: RegisteredAccountRecord = {
    ...account,
    id: `acc-${Date.now()}`,
    registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  const updated = [newRecord, ...current];
  saveRegisteredAccounts(updated);
  return newRecord;
}

export function updateAccountActivationStatus(
  accountId: string, 
  newStatus: 'active' | 'pending_otp' | 'pending_admin_approval' | 'suspended'
): void {
  const accounts = getRegisteredAccounts();
  const updated = accounts.map(acc => {
    if (acc.id === accountId) {
      return { ...acc, activationStatus: newStatus };
    }
    return acc;
  });
  saveRegisteredAccounts(updated);
}
