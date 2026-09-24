import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { 
  ShieldAlert, 
  Key, 
  Download, 
  PauseCircle, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Lock,
  User,
  MapPin,
  FileDown
} from 'lucide-react';

interface AccountSecuritySectionProps {
  settings: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
  onExportData: () => void;
  onDeleteAccountRequest: () => void;
  onNavigateToSecurity?: () => void;
}

export const AccountSecuritySection: React.FC<AccountSecuritySectionProps> = ({
  settings,
  onChange,
  onExportData,
  onDeleteAccountRequest,
  onNavigateToSecurity
}) => {
  const account = settings.account || {
    displayName: 'سارة بنت أحمد الخالدي',
    email: 'sara.khalidi@example.com',
    phone: '+966 55 987 6543',
    city: 'الرياض',
    country: 'المملكة العربية السعودية',
    twoFactorAuth: true,
    calendarType: 'hijri',
    accountStatus: 'active'
  };

  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [freezeReason, setFreezeReason] = useState('أنا في مرحلة الاستخارة والتفاوض الشرعي مع خاطب حالياً');

  const updateAccount = (partial: Partial<NonNullable<UserSettings['account']>>) => {
    const updated = { ...account, ...partial };
    onChange({ account: updated });
  };

  const handleToggleFreeze = () => {
    if (account.accountStatus === 'frozen_temporary') {
      updateAccount({
        accountStatus: 'active',
        frozenReason: undefined,
        frozenAt: undefined
      });
    } else {
      updateAccount({
        accountStatus: 'frozen_temporary',
        frozenReason: freezeReason,
        frozenAt: new Date().toISOString()
      });
    }
    setIsFreezeModalOpen(false);
  };

  return (
    <div className="space-y-6" id="account-security-section">
      {/* Account Status Card */}
      {account.accountStatus === 'frozen_temporary' ? (
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-300 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <PauseCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-start flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-950">
                الحساب مجمد مؤقتاً (مرحلة الاستخارة)
              </h3>
              <button
                type="button"
                onClick={handleToggleFreeze}
                className="text-xs font-bold px-3 py-1 bg-white border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-100 transition cursor-pointer"
              >
                إلغاء التجميد وإعادة التنشيط
              </button>
            </div>
            <p className="text-xs text-amber-800">
              سيرتك الذاتية مخفية حالياً عن البحث ولن تتلقى طلبات خطوبة جديدة لحين انتهائك من دراسة الطلب الحالي.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/70 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-start flex-1">
            <h3 className="text-sm font-bold text-neutral-900">
              حساب ميثاق نشط وموثق
            </h3>
            <p className="text-xs text-neutral-600">
              بياناتك محمية بتشفير عالي، ونظام التحقق بخطوتين مفعّل لتأمين خصوصية الأسرة.
            </p>
          </div>
        </div>
      )}

      {/* Basic Profile Credentials */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <User className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            بيانات الحساب والاتصال المسجلة
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              الاسم المعروض في المنصة
            </label>
            <input
              type="text"
              value={account.displayName || ''}
              onChange={(e) => updateAccount({ displayName: e.target.value })}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] bg-white text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              البريد الإلكتروني المعتمد
            </label>
            <input
              type="email"
              dir="ltr"
              value={account.email || ''}
              onChange={(e) => updateAccount({ email: e.target.value })}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] bg-white text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              رقم هاتف العضو
            </label>
            <input
              type="tel"
              dir="ltr"
              value={account.phone || ''}
              onChange={(e) => updateAccount({ phone: e.target.value })}
              className="w-full text-xs font-mono font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] bg-white text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              مدينة الإقامة الحالية
            </label>
            <div className="relative">
              <input
                type="text"
                value={account.city || ''}
                onChange={(e) => updateAccount({ city: e.target.value })}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] bg-white text-neutral-900"
              />
              <MapPin className="w-4 h-4 text-neutral-400 absolute end-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Security & Authentication Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Lock className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            الأمان والتحقق المزدوج (2FA)
          </h4>
        </div>

        <div className="space-y-3">
          {/* Advanced Security Shortcut Card */}
          <div className="p-4 bg-gradient-to-l from-[#fbf1eb] to-neutral-50 rounded-2xl border border-[#f5d9ca] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 text-sm">
                  التحقق بخطوتين عبر تطبيقات المصادقة وإدارة الجلسات
                </span>
                {settings.security?.twoFactorEnabled && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    2FA مفعّل
                  </span>
                )}
              </div>
              <p className="text-neutral-600 text-[11px]">
                استخدم Google Authenticator أو 1Password لتوليد رموز الأمان، وراقب الأجهزة المتصلة بحسابك.
              </p>
            </div>
            {onNavigateToSecurity && (
              <button
                type="button"
                onClick={onNavigateToSecurity}
                className="px-4 py-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl transition cursor-pointer shrink-0 shadow-2xs"
              >
                إدارة الأمان المتقدم والجلسات ←
              </button>
            )}
          </div>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                تفعيل التحقق بخطوتين (Two-Factor Authentication)
              </span>
              <span className="text-neutral-500">
                طلب رمز تأكيد SMS أو تطبيق المصادقة عند كل تسجيل دخول جديد
              </span>
            </div>
            <input
              type="checkbox"
              checked={account.twoFactorAuth || settings.security?.twoFactorEnabled}
              onChange={(e) => {
                updateAccount({ twoFactorAuth: e.target.checked });
                if (settings.security) {
                  onChange({
                    security: {
                      ...settings.security,
                      twoFactorEnabled: e.target.checked
                    }
                  });
                }
              }}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center justify-between">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                التقويم المعتمد للتواريخ والمناسبات
              </span>
              <span className="text-neutral-500">
                عرض تواريخ الخطوبة ومجالس الرؤية بالتقويم الهجري أم الميلادي
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateAccount({ calendarType: 'hijri' })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                  account.calendarType === 'hijri'
                    ? 'bg-[#9b4c2e] text-white border-[#9b4c2e]'
                    : 'bg-white text-neutral-700 border-neutral-200'
                }`}
              >
                الهجري (أم القرى)
              </button>
              <button
                type="button"
                onClick={() => updateAccount({ calendarType: 'gregorian' })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                  account.calendarType === 'gregorian'
                    ? 'bg-[#9b4c2e] text-white border-[#9b4c2e]'
                    : 'bg-white text-neutral-700 border-neutral-200'
                }`}
              >
                الميلادي
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Freezing & Data Export */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Download className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            تجميد الحساب وتصدير البيانات
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-xs text-neutral-900 block flex items-center gap-1.5">
                <PauseCircle className="w-4 h-4 text-amber-600" />
                تجميد الحساب مؤقتاً
              </span>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                يوقف ظهورك في البحث مؤقتاً دون حذف بياناتك، مناسب أثناء فترة الرؤية الشرعية والاستخارة.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFreezeModalOpen(true)}
              className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition cursor-pointer"
            >
              {account.accountStatus === 'frozen_temporary' ? 'إلغاء التجميد' : 'تجميد الحساب الآن'}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-xs text-neutral-900 block flex items-center gap-1.5">
                <FileDown className="w-4 h-4 text-blue-600" />
                تصدير نسخة من بياناتك (JSON)
              </span>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                تحميل ملف يحتوي على كافة بيانات سيرتك الذاتية وتفضيلاتك المحفوظة بأمان.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportData}
              className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل النسخة الاحتياطية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200 shadow-xs space-y-3 text-start">
        <div className="flex items-center gap-2 text-rose-900">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm font-bold">
            منطقة الحذف النهائي (Danger Zone)
          </h4>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          حذف الحساب إجراء نهائي لا يمكن التراجع عنه؛ سيتم حذف سيرتك الذاتية وصورها وسجلات المراسلات نهائياً امتثالاً لسياسة حماية البيانات الشخصية.
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={onDeleteAccountRequest}
            className="inline-flex items-center gap-1.5 py-2 px-4 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>طلب حذف الحساب نهائياً</span>
          </button>
        </div>
      </div>

      {/* Freeze Account Confirmation Modal */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-xl space-y-4 text-start animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-2 text-amber-900 pb-2 border-b border-neutral-100">
              <PauseCircle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold">
                {account.accountStatus === 'frozen_temporary' ? 'إلغاء تجميد الحساب' : 'تجميد الحساب مؤقتاً'}
              </h3>
            </div>

            {account.accountStatus === 'frozen_temporary' ? (
              <p className="text-xs text-neutral-600 leading-relaxed">
                هل ترغب في إعادة تفعيل حسابك واستئناف ظهوره في نتائج البحث وتلقي طلبات الخطوبة الشرعية؟
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  سيتم إخفاء سيرتك الذاتية عن نتائج البحث مع الاحتفاظ بكافة بياناتك ومحادثاتك. يمكنك إلغاء التجميد في أي وقت.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    سبب التجميد المؤقت:
                  </label>
                  <select
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-neutral-200 bg-neutral-50"
                  >
                    <option value="أنا في مرحلة الاستخارة والتفاوض الشرعي مع خاطب حالياً">أنا في مرحلة الاستخارة مع خاطب حالياً</option>
                    <option value="انشغال شخصي مؤقت">انشغال شخصي مؤقت</option>
                    <option value="تحديث بيانات السيرة الذاتية وصك الولاية">تحديث بيانات السيرة وصك الولاية</option>
                    <option value="سبب آخر">سبب آخر</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFreezeModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleToggleFreeze}
                className="px-4 py-2 text-xs font-bold text-white bg-[#9b4c2e] hover:bg-[#853e24] rounded-xl transition cursor-pointer shadow-xs"
              >
                {account.accountStatus === 'frozen_temporary' ? 'تأكيد التنشيط' : 'تأكيد التجميد'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
