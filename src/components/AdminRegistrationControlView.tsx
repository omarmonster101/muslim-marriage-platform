import React, { useState, useEffect } from 'react';
import { 
  RegistrationPolicySettings, 
  RegistrationStepConfig, 
  RegisteredAccountRecord 
} from '../types';
import { 
  getRegistrationPolicy, 
  saveRegistrationPolicy, 
  resetRegistrationPolicy,
  getRegisteredAccounts,
  updateAccountActivationStatus
} from '../services/registrationService';
import { 
  Settings, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  Eye, 
  EyeOff, 
  KeyRound, 
  RotateCcw, 
  Save, 
  Check, 
  Award,
  Clock,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface Props {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

export const AdminRegistrationControlView: React.FC<Props> = ({ onNotify }) => {
  const [policy, setPolicy] = useState<RegistrationPolicySettings>(getRegistrationPolicy());
  const [accounts, setAccounts] = useState<RegisteredAccountRecord[]>(getRegisteredAccounts());
  const [isSaved, setIsSaved] = useState(false);
  const [searchAccountQuery, setSearchAccountQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_otp' | 'pending_admin_approval' | 'suspended'>('all');

  // Listen to accounts updates
  useEffect(() => {
    const handleAccountsUpdate = (e: any) => {
      if (e.detail) setAccounts(e.detail);
    };
    window.addEventListener('meethaq_accounts_updated', handleAccountsUpdate);
    return () => {
      window.removeEventListener('meethaq_accounts_updated', handleAccountsUpdate);
    };
  }, []);

  // Step toggle handler
  const handleToggleStep = (stepId: string) => {
    // Step 1 (account) must always remain enabled
    if (stepId === 'account') {
      onNotify('خطوة إنشاء الحساب الأساسية لا يمكن تعطيلها لسلامة النظام.', 'error');
      return;
    }

    const updatedSteps = policy.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, isEnabled: !step.isEnabled };
      }
      return step;
    });

    const updatedPolicy = { ...policy, steps: updatedSteps };
    setPolicy(updatedPolicy);
    saveRegistrationPolicy(updatedPolicy);
    onNotify('تم تحديث خطوات التسجيل بنجاح');
  };

  // Toggle step required status
  const handleToggleRequired = (stepId: string) => {
    if (stepId === 'account' || stepId === 'activation') {
      onNotify('هذه الخطوة إلزامية لضمان الأمان والتحقق الشرعي.', 'error');
      return;
    }

    const updatedSteps = policy.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, isRequired: !step.isRequired };
      }
      return step;
    });

    const updatedPolicy = { ...policy, steps: updatedSteps };
    setPolicy(updatedPolicy);
    saveRegistrationPolicy(updatedPolicy);
    onNotify('تم تحديث إلزامية الخطوة بنجاح');
  };

  // Policy toggles
  const handleTogglePolicyField = (field: keyof Omit<RegistrationPolicySettings, 'steps' | 'minAge' | 'activationMode'>) => {
    const updatedPolicy = { ...policy, [field]: !policy[field] };
    setPolicy(updatedPolicy);
    saveRegistrationPolicy(updatedPolicy);
    onNotify('تم حفظ السياسة الشرعية الجديدة');
  };

  // Activation mode switcher
  const handleSetActivationMode = (mode: 'instant_otp' | 'manual_admin_review') => {
    const updatedPolicy = { ...policy, activationMode: mode };
    setPolicy(updatedPolicy);
    saveRegistrationPolicy(updatedPolicy);
    onNotify(
      mode === 'instant_otp' 
        ? 'تم تفعيل نمط: التفعيل الفوري برمز التحقق (OTP)' 
        : 'تم تفعيل نمط: المراجعة والاعتماد اليدوي من الإدارة قبل التفعيل'
    );
  };

  // Reset to default
  const handleResetPolicy = () => {
    const def = resetRegistrationPolicy();
    setPolicy(def);
    onNotify('تم استعادة سياسة وخطوات التسجيل الافتراضية');
  };

  // Account Status Update
  const handleUpdateUserStatus = (
    accountId: string, 
    newStatus: 'active' | 'pending_otp' | 'pending_admin_approval' | 'suspended'
  ) => {
    updateAccountActivationStatus(accountId, newStatus);
    setAccounts(getRegisteredAccounts());
    onNotify(
      newStatus === 'active' 
        ? '✓ تم تفعيل الحساب فورياً واعتماده في المنصة' 
        : newStatus === 'suspended'
        ? '⚠️ تم تعليق الحساب مؤقتاً'
        : 'تم تحديث حالة تفعيل الحساب'
    );
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = !searchAccountQuery || 
      acc.fullName.toLowerCase().includes(searchAccountQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchAccountQuery.toLowerCase()) ||
      acc.phone.includes(searchAccountQuery) ||
      acc.city.toLowerCase().includes(searchAccountQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || acc.activationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 text-black">
      {/* 1. Header with Everlane Atelier Styling */}
      <div className="border border-black p-6 bg-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#737373] block mb-1">
              REGISTRATION POLICY & STEP CONTROL ENGINE
            </span>
            <h2 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-black">
              إدارة منظومة التسجيل وتفعيل الحسابات
            </h2>
            <p className="text-xs text-[#4c4c4c] mt-1 max-w-2xl leading-relaxed">
              تحكم ديناميكي كامل في خطوات التسجيل المعروضة للمستخدمين، وتحديد نمط التفعيل (فوري عبر OTP أو مراجعة يدوية من المشرف)، وإدارة حسابات الأعضاء الجدد.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetPolicy}
              className="everlane-btn-secondary"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط للافتراضي</span>
            </button>
          </div>
        </div>

        {/* Global Activation Mode Selector (Highlight Box) */}
        <div className="border border-[#9b9b9b]/40 p-5 bg-[#fafafa] space-y-3">
          <label className="text-xs uppercase tracking-wider font-bold text-black block">
            نمط تفعيل واعتماد الحسابات الجديدة في المنصة:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => handleSetActivationMode('instant_otp')}
              className={`border p-4 cursor-pointer transition ${
                policy.activationMode === 'instant_otp'
                  ? 'border-black bg-black text-white'
                  : 'border-[#9b9b9b]/40 hover:border-black text-black bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  ⚡ تفعيل فوري ومباشر (Instant OTP)
                </span>
                <span className="text-sm">✓</span>
              </div>
              <p className={`text-xs leading-relaxed ${
                policy.activationMode === 'instant_otp' ? 'text-white/80' : 'text-[#737373]'
              }`}>
                يتم تفعيل الحساب والبروفايل فور إدخال رمز التحقق (OTP) بنجاح، مما يتيح التصفح وإرسال الطلبات مباشرة.
              </p>
            </div>

            <div
              onClick={() => handleSetActivationMode('manual_admin_review')}
              className={`border p-4 cursor-pointer transition ${
                policy.activationMode === 'manual_admin_review'
                  ? 'border-black bg-black text-white'
                  : 'border-[#9b9b9b]/40 hover:border-black text-black bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  🛡️ مراجعة واعتماد يدوي من الإدارة (Admin Approval)
                </span>
                <span className="text-sm">🔒</span>
              </div>
              <p className={`text-xs leading-relaxed ${
                policy.activationMode === 'manual_admin_review' ? 'text-white/80' : 'text-[#737373]'
              }`}>
                يدخل الحساب في حالة "بانتظار المراجعة" بعد إدخال البيانات، ولا يُكشف في التصفح حتى يعتمده المشرف يدوياً.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Steps Config Table (التحكم في خطوات التسجيل) */}
      <div className="border border-black p-6 bg-white space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#737373] block mb-1">
            REGISTRATION PAGES SEQUENCE
          </span>
          <h3 className="text-lg font-light uppercase tracking-tight text-black">
            خطوات وصفحات التسجيل المتسلسلة (تفعيل / تعطيل / إلزامية)
          </h3>
          <p className="text-xs text-[#737373]">
            أي خطوة تقوم بتعطيلها هنا ستختفي فوراً وتلقائياً من نموذج التسجيل لدى الزوار الجدد.
          </p>
        </div>

        <div className="border border-black overflow-hidden">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-black bg-[#fafafa] uppercase tracking-wider text-[#4c4c4c]">
                <th className="p-3 text-start font-semibold">ترتيب الصفحة</th>
                <th className="p-3 text-start font-semibold">عنوان الخطوة</th>
                <th className="p-3 text-start font-semibold">الوصف الشرعي والنظامي</th>
                <th className="p-3 text-center font-semibold">الحالة (مفعلة / معطلة)</th>
                <th className="p-3 text-center font-semibold">الإلزامية</th>
                <th className="p-3 text-center font-semibold">إجراء الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {policy.steps.map((step, idx) => (
                <tr 
                  key={step.id} 
                  className={`hover:bg-[#fcfcfc] transition ${
                    !step.isEnabled ? 'opacity-50 bg-black/5' : ''
                  }`}
                >
                  <td className="p-3 font-mono font-bold text-center w-16">
                    0{idx + 1}
                  </td>
                  <td className="p-3 font-bold text-black whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{step.titleAr}</span>
                      {step.id === 'account' && (
                        <span className="text-[10px] bg-black text-white px-1.5 py-0.5">أساسية</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-[#4c4c4c] max-w-xs">
                    {step.subtitleAr}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {step.isEnabled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2.5 py-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        معروضة في النموذج
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#737373] bg-[#f0f0f0] px-2.5 py-1 font-bold">
                        <XCircle className="w-3.5 h-3.5 text-[#9b9b9b]" />
                        معطلة (مخفية)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggleRequired(step.id)}
                      disabled={step.id === 'account' || step.id === 'activation'}
                      className={`border px-2.5 py-1 font-semibold uppercase tracking-wider cursor-pointer ${
                        step.isRequired 
                          ? 'border-black bg-black text-white' 
                          : 'border-[#9b9b9b] bg-white text-black'
                      }`}
                    >
                      {step.isRequired ? 'إلزامية *' : 'اختيارية'}
                    </button>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {step.id === 'account' ? (
                      <span className="text-[11px] text-[#737373]">مفعلة دائماً</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStep(step.id)}
                        className={`border px-3 py-1 text-xs font-semibold cursor-pointer uppercase tracking-wider ${
                          step.isEnabled
                            ? 'border-black bg-white hover:bg-black hover:text-white text-black'
                            : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {step.isEnabled ? 'تعطيل الخطوة' : 'تفعيل الخطوة'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Detailed Sharia Policies Toggles */}
      <div className="border border-black p-6 bg-white space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#737373] block mb-1">
            SHARIA GOVERNANCE RULES
          </span>
          <h3 className="text-lg font-light uppercase tracking-tight text-black">
            ضوابط الخصوصية والولاية الشرعية للتسجيل
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Policy 1: Require Wali */}
          <div className="border border-black p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-black block">
                اشتراط بيانات الولي الشرعي للإناث:
              </span>
              <p className="text-xs text-[#737373] mt-0.5">
                إلزام المخطوبة بإدخال اسم الولي وهاتفه وموافقته المسبقة قبل قبول التسجيل.
              </p>
            </div>
            <button
              onClick={() => handleTogglePolicyField('requireWaliForFemales')}
              className={`border px-3 py-1.5 text-xs font-bold uppercase cursor-pointer ${
                policy.requireWaliForFemales
                  ? 'border-black bg-black text-white'
                  : 'border-[#9b9b9b] bg-white text-black'
              }`}
            >
              {policy.requireWaliForFemales ? 'مفعل ✓' : 'معطل'}
            </button>
          </div>

          {/* Policy 2: Photo Blur Default */}
          <div className="border border-black p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-black block">
                حجب صور الإناث افتراضياً (الستر):
              </span>
              <p className="text-xs text-[#737373] mt-0.5">
                تفعيل الحجب التلقائي لصورة الملف ولا تُكشف إلا بموافقة الولي.
              </p>
            </div>
            <button
              onClick={() => handleTogglePolicyField('requirePhotoBlurForFemales')}
              className={`border px-3 py-1.5 text-xs font-bold uppercase cursor-pointer ${
                policy.requirePhotoBlurForFemales
                  ? 'border-black bg-black text-white'
                  : 'border-[#9b9b9b] bg-white text-black'
              }`}
            >
              {policy.requirePhotoBlurForFemales ? 'مفعل ✓' : 'معطل'}
            </button>
          </div>

          {/* Policy 3: Ba'ah for Males */}
          <div className="border border-black p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-black block">
                اشتراط إقرار الباءة والسكن للخاطب:
              </span>
              <p className="text-xs text-[#737373] mt-0.5">
                إلزام الخاطب بتحديد جاهزية السكن المستقل ونطاق الدخل الحلال وتعهد الزيارة.
              </p>
            </div>
            <button
              onClick={() => handleTogglePolicyField('requireBaahForMales')}
              className={`border px-3 py-1.5 text-xs font-bold uppercase cursor-pointer ${
                policy.requireBaahForMales
                  ? 'border-black bg-black text-white'
                  : 'border-[#9b9b9b] bg-white text-black'
              }`}
            >
              {policy.requireBaahForMales ? 'مفعل ✓' : 'معطل'}
            </button>
          </div>

          {/* Policy 4: Sharia Pledge */}
          <div className="border border-black p-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-black block">
                إلزامية قسم ميثاق الأمانة واليمين الشرعي:
              </span>
              <p className="text-xs text-[#737373] mt-0.5">
                التعهد أمام الله تعالى بحفظ الأمانة وحرمات البيوت وعدم الخلوة.
              </p>
            </div>
            <button
              onClick={() => handleTogglePolicyField('requireShariaPledge')}
              className={`border px-3 py-1.5 text-xs font-bold uppercase cursor-pointer ${
                policy.requireShariaPledge
                  ? 'border-black bg-black text-white'
                  : 'border-[#9b9b9b] bg-white text-black'
              }`}
            >
              {policy.requireShariaPledge ? 'مفعل ✓' : 'معطل'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Registered Accounts & Activation Management Table */}
      <div className="border border-black p-6 bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#737373] block mb-1">
              USER ACCOUNTS & ACTIVATION DESK
            </span>
            <h3 className="text-lg font-light uppercase tracking-tight text-black">
              سجل حسابات الأعضاء الجدد وحالات التفعيل
            </h3>
            <p className="text-xs text-[#737373]">
              مراجعة الحسابات المسجلة حديثاً وتفعيلها أو تعليقها بضغطة زر واحدة.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={searchAccountQuery}
              onChange={(e) => setSearchAccountQuery(e.target.value)}
              className="border border-black px-3 py-1.5 text-xs focus:outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-black px-3 py-1.5 text-xs bg-white focus:outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">مفعل (Active)</option>
              <option value="pending_admin_approval">بانتظار مراجعة الإدارة</option>
              <option value="pending_otp">بانتظار التحقق (OTP)</option>
              <option value="suspended">معلق (Suspended)</option>
            </select>
          </div>
        </div>

        <div className="border border-black overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-black bg-[#fafafa] uppercase tracking-wider text-[#4c4c4c]">
                <th className="p-3 text-start font-semibold">المستخدم والمسار</th>
                <th className="p-3 text-start font-semibold">الاتصال والمدينة</th>
                <th className="p-3 text-start font-semibold">بيانات الولي / الباءة</th>
                <th className="p-3 text-center font-semibold">تاريخ التسجيل</th>
                <th className="p-3 text-center font-semibold">حالة التفعيل</th>
                <th className="p-3 text-center font-semibold">إجراءات المشرف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#737373]">
                    لا توجد حسابات مسجلة تطابق معايير البحث.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-[#fafafa] transition">
                    <td className="p-3 font-semibold text-black whitespace-nowrap">
                      <div>{acc.fullName}</div>
                      <div className="text-[10px] text-[#737373] font-mono">{acc.email}</div>
                      <div className="text-[10px] font-bold text-black">
                        {acc.role === 'suitor' ? 'خاطب (ذكر)' : acc.role === 'candidate' ? 'مخطوبة (أنثى)' : 'ولي أمر'}
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap text-[#4c4c4c]">
                      <div>{acc.phone}</div>
                      <div className="text-[10px] text-[#737373]">{acc.city} - {acc.country}</div>
                    </td>

                    <td className="p-3 max-w-xs text-[#4c4c4c]">
                      {acc.waliName ? (
                        <div>
                          <div className="font-semibold text-black">الولي: {acc.waliName}</div>
                          <div className="text-[10px] text-[#737373]">هاتف: {acc.waliPhone}</div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#737373]">خاطب مستقل بالباءة</span>
                      )}
                    </td>

                    <td className="p-3 text-center font-mono text-[11px] text-[#737373] whitespace-nowrap">
                      {acc.registeredAt}
                    </td>

                    <td className="p-3 text-center whitespace-nowrap">
                      {acc.activationStatus === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 font-bold">
                          ✓ مفعل بالكامل
                        </span>
                      ) : acc.activationStatus === 'pending_admin_approval' ? (
                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 font-bold">
                          ⏳ بانتظار الاعتماد
                        </span>
                      ) : acc.activationStatus === 'pending_otp' ? (
                        <span className="inline-flex items-center gap-1 text-blue-800 bg-blue-100 px-2 py-0.5 font-bold">
                          🔑 بانتظار الرمز
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-800 bg-red-100 px-2 py-0.5 font-bold">
                          ⚠️ معلق
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center whitespace-nowrap space-x-2 space-x-reverse">
                      {acc.activationStatus !== 'active' ? (
                        <button
                          onClick={() => handleUpdateUserStatus(acc.id, 'active')}
                          className="bg-black hover:bg-black/80 text-[#d9e9bb] px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                          title="تفعيل الحساب فورياً"
                        >
                          ✓ تفعيل فوري
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateUserStatus(acc.id, 'suspended')}
                          className="border border-black text-black hover:bg-black hover:text-white px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                          title="تعليق الحساب"
                        >
                          تعليق الحساب
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
