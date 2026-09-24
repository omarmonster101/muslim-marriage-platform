import React, { useState, useEffect } from 'react';
import { Language, UserSession, ActiveRole } from '../types';
import { translations } from '../data/translations';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '../lib/firebase';
import { availableSessions } from './RoleSwitcher';

interface LoginModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: ActiveRole, session?: UserSession) => void;
  defaultTab?: 'login' | 'register';
  isPageMode?: boolean;
  onSwitchToDedicatedRegister?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  lang,
  isOpen,
  onClose,
  onSuccess,
  defaultTab = 'login',
  isPageMode = false,
  onSwitchToDedicatedRegister
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [role, setRole] = useState<'suitor' | 'candidate' | 'wali'>('suitor');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+966 50 ');
  const [shariaPledgeAccepted, setShariaPledgeAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await signInWithGoogle(role);
      const user = res.user;
      
      const session: UserSession = {
        id: user.uid,
        name: user.displayName || 'مستخدم ميثاق',
        role: res.role as ActiveRole,
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop',
        phone: user.phoneNumber || phone
      };

      fireCelebrationConfetti();
      onSuccess(session.role, session);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('تم إغلاق نافذة تسجيل الدخول بجوجل قبل الإكمال.');
      } else {
        setErrorMsg('تعذر تسجيل الدخول عبر Google. يمكنك استخدام البريد الإلكتروني أو إعادة المحاولة.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Direct Administrator Credentials Bypass: admin / admin
    if (
      (cleanEmail === 'admin' || cleanEmail === 'admin@meethaq.sa' || cleanEmail === 'admin@meethaq.com') && 
      cleanPassword === 'admin'
    ) {
      const adminSession: UserSession = {
        id: 'admin-1',
        name: 'المشرف العام (هيئة الرقابة الشرعية)',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop',
        phone: '+966 50 000 0000'
      };
      fireCelebrationConfetti();
      onSuccess('admin', adminSession);
      onClose();
      setIsLoading(false);
      return;
    }

    try {
      const res = await loginWithEmail(email, password);
      const user = res.user;

      const session: UserSession = {
        id: user.uid,
        name: user.displayName || email.split('@')[0],
        role: res.role as ActiveRole,
        avatar: user.photoURL || '',
        phone
      };

      fireCelebrationConfetti();
      onSuccess(session.role, session);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (
        err?.code === 'auth/invalid-credential' || 
        err?.code === 'auth/user-not-found' || 
        err?.code === 'auth/wrong-password' ||
        err?.message?.includes('invalid-credential')
      ) {
        setErrorMsg('بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.');
      } else {
        setErrorMsg(err?.message || 'حدث خطأ أثناء تسجيل الدخول.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('يرجى تعبئة كافة الحقول المطلوبة.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.');
      return;
    }
    if (!shariaPledgeAccepted) {
      setErrorMsg('يرجى الموافقة على ميثاق الالتزام والضوابط الشرعية للمتابعة.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await registerWithEmail(email, password, fullName, role, phone);
      const user = res.user;

      const session: UserSession = {
        id: user.uid,
        name: fullName,
        role: (res.role || role) as ActiveRole,
        avatar: '',
        phone
      };

      fireCelebrationConfetti();
      onSuccess(session.role, session);
      onClose();
    } catch (err: any) {
      console.warn('Registration error:', err);
      const isEmailInUse = 
        err?.code === 'auth/email-already-in-use' || 
        (typeof err?.message === 'string' && err.message.includes('auth/email-already-in-use')) ||
        err?.toString()?.includes('email-already-in-use');

      if (isEmailInUse) {
        // Automatically switch to login tab with prefilled email
        setActiveTab('login');
        setErrorMsg('هذا البريد الإلكتروني مسجل مسبقاً في ميثاق. تم تحويلك لنافذة الدخول، يرجى إدخال كلمة المرور للمتابعة.');
      } else if (err?.code === 'auth/weak-password' || err?.message?.includes('weak-password')) {
        setErrorMsg('كلمة المرور ضعيفة، يرجى اختيار كلمة مرور أكثر تعقيداً.');
      } else if (err?.code === 'auth/invalid-email' || err?.message?.includes('invalid-email')) {
        setErrorMsg('البريد الإلكتروني المدخل غير صالح، يرجى كتابته بالشكل الصحيح.');
      } else {
        setErrorMsg(err?.message || 'حدث خطأ أثناء إنشاء الحساب.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fast Demo Login
  const handleQuickDemoLogin = (targetRole: ActiveRole) => {
    const found = availableSessions.find(s => s.role === targetRole);
    if (found) {
      fireCelebrationConfetti();
      onSuccess(found.role, found);
      onClose();
    }
  };

  if (!isOpen && !isPageMode) return null;

  const formContent = (
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#ede5dd] overflow-hidden text-start mx-auto my-auto animate-in fade-in zoom-in-95 duration-200">
      {/* Header with Nikah Terracotta Aesthetics */}
      <div className="bg-gradient-to-r from-[#9b4c2e] to-[#7f391f] text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-white/90 text-[11px] font-bold mb-1.5 bg-white/15 px-3 py-1 rounded-full border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d9e9bb]" />
              <span>منصة نكاح • زواج شرعي موثق بإشراف الولي</span>
            </div>
            <h3 className="text-2xl font-display font-extrabold text-white">
              {activeTab === 'login' ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب مبارك جديد'}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              {activeTab === 'login' 
                ? 'أهلاً بك مجدداً في منصة نكاح لمتابعة مسار العفاف والخطوبة المباركة' 
                : 'انضم لمنصة نكاح للبحث عن شريك الحياة وفق هدي القرآن والسنة'}
            </p>
          </div>
          {!isPageMode && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Toggle: تسجيل الدخول / إنشاء حساب */}
        <div className="grid grid-cols-2 gap-2 mt-5 p-1.5 bg-black/10 rounded-2xl border border-white/15">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer text-center ${
              activeTab === 'login' 
                ? 'bg-white text-[#9b4c2e] shadow-md' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer text-center ${
              activeTab === 'register' 
                ? 'bg-white text-[#9b4c2e] shadow-md' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 space-y-5">
        
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* One-Click Google Sign In */}
        <div>
          <button
            id="google-auth-button"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-black/15 bg-white hover:bg-black/[0.03] text-black font-bold text-xs sm:text-sm shadow-xs transition active:scale-[0.99] cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {activeTab === 'login' 
                ? 'تسجيل الدخول الفوري بحساب Google' 
                : 'إنشاء حساب موثق فوري بحساب Google'}
            </span>
          </button>

          <div className="flex items-center gap-2 my-4">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-[11px] text-[#888888] font-bold">أو المتابعة بالبريد الإلكتروني</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>
        </div>

        {/* Role Selection for Registration / Login Context */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#444444] block">
            {activeTab === 'register' ? 'حدد صفتك الشرعية لإنشاء الحساب:' : 'تسجيل الدخول بصفتك:'}
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#f8f7f4] p-1.5 rounded-2xl border border-[#ede5dd]">
            <button
              type="button"
              onClick={() => setRole('suitor')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                role === 'suitor' 
                  ? 'bg-[#9b4c2e] text-white shadow-xs' 
                  : 'text-[#666666] hover:text-[#9b4c2e] hover:bg-[#9b4c2e]/5'
              }`}
            >
              ذكر
            </button>
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                role === 'candidate' 
                  ? 'bg-[#9b4c2e] text-white shadow-xs' 
                  : 'text-[#666666] hover:text-[#9b4c2e] hover:bg-[#9b4c2e]/5'
              }`}
            >
              أنثى
            </button>
            <button
              type="button"
              onClick={() => setRole('wali')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
                role === 'wali' 
                  ? 'bg-[#9b4c2e] text-white shadow-xs' 
                  : 'text-[#666666] hover:text-[#9b4c2e] hover:bg-[#9b4c2e]/5'
              }`}
            >
              ولي الأمر
            </button>
          </div>
        </div>

        {/* Form 1: LOGIN */}
        {activeTab === 'login' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-900 block mb-1">
                اسم المستخدم أو البريد الإلكتروني:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type="text"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ps-10 pe-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-900">كلمة المرور:</label>
                <span className="text-[11px] text-[#888888] cursor-pointer hover:underline">نسيت كلمة المرور؟</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ps-10 pe-10 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-stone-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#9b4c2e] text-white hover:bg-[#853e24] py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول إلى حسابي'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#777777]">ليس لديك حساب حتى الآن؟ </span>
              <button
                type="button"
                onClick={() => { 
                  if (onSwitchToDedicatedRegister) {
                    onSwitchToDedicatedRegister();
                  } else {
                    setActiveTab('register'); 
                    setErrorMsg(null); 
                  }
                }}
                className="text-xs font-bold text-[#9b4c2e] underline hover:text-[#853e24] cursor-pointer"
              >
                أنشئ حساباً في صفحة التسجيل المستقلة ↗
              </button>
            </div>
          </form>
        ) : (
          /* Form 2: REGISTER */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-black block mb-1">
                الاسم الكريم بالكامل (ثلاثي أو رباعي):
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#888888] absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type="text"
                  required
                  placeholder="مثال: عبدالله بن فهد الشمري"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full ps-10 pe-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-black/15 focus:border-black rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1">
                البريد الإلكتروني المعتمد:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#888888] absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ps-10 pe-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-black/15 focus:border-black rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1">
                رقم الهاتف المعتمد (لإشعارات الرؤية الشرعية وتوثيق الولي):
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#888888] absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="+966 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full ps-10 pe-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-black/15 focus:border-black rounded-xl outline-none font-mono text-start"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1">
                كلمة المرور (6 أحرف أو أرقام على الأقل):
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#888888] absolute top-1/2 -translate-y-1/2 start-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ps-10 pe-10 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-black/15 focus:border-black rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-stone-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sharia Pledge Agreement */}
            <div className="p-3 bg-[#f8f7f4] rounded-xl border border-black/10 flex items-start gap-2.5">
              <input
                id="sharia-pledge"
                type="checkbox"
                checked={shariaPledgeAccepted}
                onChange={(e) => setShariaPledgeAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded-md border-black/20 text-black focus:ring-0 cursor-pointer"
              />
              <label htmlFor="sharia-pledge" className="text-[11px] text-[#444444] leading-relaxed cursor-pointer select-none">
                <span className="font-bold text-black block mb-0.5">ميثاق الأمانة والضوابط الشرعية:</span>
                أتعهد أمام الله بصدق كافة بياناتي التام، والالتزام بضوابط الخطوبة الشرعية وموافقة الولي وعدم استخدام المنصة إلا في طلب الحلال والعفاف.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !shariaPledgeAccepted}
              className="w-full mt-2 bg-[#9b4c2e] text-white hover:bg-[#853e24] py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              {isLoading ? 'جارٍ تسجيل الحساب...' : 'إنشاء الحساب وبدء المسار الشرعي'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[#777777]">لديك حساب بالفعل؟ </span>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
                className="text-xs font-bold text-[#9b4c2e] underline cursor-pointer hover:text-[#853e24]"
              >
                تسجيل الدخول هنا
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );

  if (isPageMode) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      {formContent}
    </div>
  );
};
