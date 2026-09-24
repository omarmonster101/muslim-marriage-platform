import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Smartphone, 
  Laptop, 
  Tablet, 
  LogOut, 
  History, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  Download, 
  AlertTriangle, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  X, 
  Globe, 
  MapPin, 
  Clock, 
  Shield, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { UserSettings, SecuritySettings, ActiveSessionItem, LoginHistoryItem } from '../../types';
import { DEFAULT_SECURITY_SETTINGS } from '../../data/defaultSecurityData';
import { fireCelebrationConfetti } from '../../utils/confetti';

interface AdvancedSecuritySettingsProps {
  settings: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
  currentUserName?: string;
  currentUserRole?: string;
}

export const AdvancedSecuritySettings: React.FC<AdvancedSecuritySettingsProps> = ({
  settings,
  onChange,
  currentUserName = 'عضو ميثاق',
  currentUserRole = 'suitor'
}) => {
  // Use existing security settings or initialize with realistic default
  const sec: SecuritySettings = settings.security || DEFAULT_SECURITY_SETTINGS;

  // 2FA Modal / Wizard State
  const [is2FaSetupModalOpen, setIs2FaSetupModalOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);
  const [selectedApp, setSelectedApp] = useState<'google' | 'microsoft' | 'apple' | 'other'>('google');

  // Disable 2FA confirmation modal
  const [isDisable2FaModalOpen, setIsDisable2FaModalOpen] = useState(false);

  // Backup codes viewer modal
  const [isBackupCodesModalOpen, setIsBackupCodesModalOpen] = useState(false);

  // Filter for Login History
  const [historyFilter, setHistoryFilter] = useState<'all' | 'success' | 'failed' | 'two_factor'>('all');

  // Terminate Sessions feedback message
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const updateSecurity = (partial: Partial<SecuritySettings>) => {
    const updatedSec: SecuritySettings = {
      ...sec,
      ...partial
    };
    onChange({
      security: updatedSec,
      account: {
        ...settings.account,
        twoFactorAuth: updatedSec.twoFactorEnabled
      }
    });
  };

  // Copy secret key helper
  const handleCopySecret = () => {
    navigator.clipboard.writeText(sec.authenticatorAppSecret || 'MEETHAQ-7X8K-9Y2P-3W4Z');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // Copy backup codes helper
  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(sec.backupCodes.join('\n'));
    setCopiedBackupCodes(true);
    setTimeout(() => setCopiedBackupCodes(false), 2500);
  };

  // Download backup codes as .txt
  const handleDownloadBackupCodes = () => {
    const text = `=== رموز استعادة التحقق بخطوتين - منصة ميثاق ===\nالحساب: ${currentUserName}\nتاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}\n\nاحفظ هذه الرموز في مكان آمن. كل رمز صالح للاستخدام مرة واحدة فقط:\n\n${sec.backupCodes.map((code, idx) => `${idx + 1}. ${code}`).join('\n')}\n\nملاحظة: لا تشارك هذه الرموز مع أي شخص.`;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `meethaq-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Complete Step 2 Verification
  const handleVerify2FaCode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);
    if (verificationCode.trim().length !== 6) {
      setVerificationError('الرجاء إدخال رمز مكون من 6 أرقام');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Advance to Step 3 (Backup codes)
      setSetupStep(3);
    }, 600);
  };

  // Finalize 2FA Activation
  const handleFinish2FaSetup = () => {
    updateSecurity({
      twoFactorEnabled: true,
      twoFactorMethod: 'authenticator_app',
      authenticatorAppLinked: true
    });
    setIs2FaSetupModalOpen(false);
    setSetupStep(1);
    setVerificationCode('');
    fireCelebrationConfetti();
    showNotice('تم تفعيل التحقق بخطوتين (2FA) بنجاح عبر تطبيق المصادقة!');
  };

  // Disable 2FA
  const handleConfirmDisable2Fa = () => {
    updateSecurity({
      twoFactorEnabled: false,
      authenticatorAppLinked: false
    });
    setIsDisable2FaModalOpen(false);
    showNotice('تم تعطيل التحقق بخطوتين.');
  };

  // Terminate Single Session
  const handleTerminateSession = (sessionId: string) => {
    const targetSession = sec.activeSessions.find(s => s.id === sessionId);
    const updatedSessions = sec.activeSessions.filter(s => s.id !== sessionId);
    updateSecurity({ activeSessions: updatedSessions });
    showNotice(`تم تسجيل الخروج بنجاح من جهاز: ${targetSession?.deviceName || 'الجلسة المحددة'}`);
  };

  // Terminate All Other Sessions
  const handleTerminateAllOtherSessions = () => {
    const currentOnly = sec.activeSessions.filter(s => s.isCurrent);
    updateSecurity({ activeSessions: currentOnly });
    showNotice('تم إنهاء كافة الجلسات الأخرى النشطة على الأجهزة المتبقية.');
  };

  // Add Simulated Device Session
  const handleAddMockSession = () => {
    const newSession: ActiveSessionItem = {
      id: `sess-${Date.now()}`,
      deviceType: 'mobile',
      deviceName: 'Samsung Galaxy S24 Ultra',
      browser: 'Chrome Mobile 123',
      os: 'Android 14',
      ipAddress: '176.224.89.45',
      location: 'المدينة المنورة، السعودية',
      isCurrent: false,
      lastActive: 'منذ دقيقة واحدة',
      createdAt: new Date().toISOString()
    };
    updateSecurity({
      activeSessions: [...sec.activeSessions, newSession]
    });
    showNotice('تمت محاكاة جلسة جديدة على جهاز Android.');
  };

  // Filtered login history
  const filteredHistory = sec.loginHistory.filter(item => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'success') return item.status === 'success';
    if (historyFilter === 'two_factor') return item.status === 'two_factor_verified';
    if (historyFilter === 'failed') return item.status === 'failed';
    return true;
  });

  return (
    <div className="space-y-8 text-start font-cairo" id="advanced-security-settings">
      
      {/* Notice Alert */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-2 shadow-2xs animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TWO-FACTOR AUTHENTICATION (2FA) VIA AUTHENTICATOR APP */}
      {/* ======================================================== */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div className="flex items-start gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
              sec.twoFactorEnabled 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-[#9b4c2e]/10 text-[#9b4c2e] border border-[#9b4c2e]/20'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  التحقق بخطوتين (2FA) عبر تطبيقات المصادقة
                </h3>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  sec.twoFactorEnabled 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {sec.twoFactorEnabled ? 'مفعّل ومحمي' : 'غير مفعّل'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
                حماية مضاعفة لحسابك وسيرتك المصونة؛ لن يتمكن أحد من تسجيل الدخول حتى لو امتلك كلمة المرور دون رمز مؤقت متولد من تطبيقك (Google Authenticator أو 1Password).
              </p>
            </div>
          </div>

          <div>
            {sec.twoFactorEnabled ? (
              <button
                type="button"
                onClick={() => setIsDisable2FaModalOpen(true)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>تعطيل التحقق المزدوج</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSetupStep(1);
                  setIs2FaSetupModalOpen(true);
                }}
                className="px-5 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>بدء إعداد تطبيق المصادقة</span>
              </button>
            )}
          </div>
        </div>

        {/* 2FA Active Status Details */}
        {sec.twoFactorEnabled ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#fbf9f6] border border-[#ede5dd] space-y-1.5">
              <span className="text-neutral-500 block">طريقة المصادقة الأساسية</span>
              <span className="font-bold text-neutral-900 flex items-center gap-1.5 text-sm">
                <Smartphone className="w-4 h-4 text-[#9b4c2e]" />
                تطبيق المصادقة (TOTP)
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                Google / Microsoft Authenticator
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f6] border border-[#ede5dd] space-y-1.5">
              <span className="text-neutral-500 block">رموز الاستعادة الاحتياطية</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 text-sm">
                  {sec.backupCodesRemaining || 8} من أصل 8 متوفرة
                </span>
                <button
                  type="button"
                  onClick={() => setIsBackupCodesModalOpen(true)}
                  className="text-[#9b4c2e] hover:underline font-bold text-[11px] cursor-pointer"
                >
                  عرض الرموز
                </button>
              </div>
              <span className="text-[11px] text-neutral-500 block">
                تستخدم في حال فقدان الهاتف أو التطبيق
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f6] border border-[#ede5dd] space-y-1.5">
              <span className="text-neutral-500 block">مستوى حماية الحساب</span>
              <span className="font-bold text-emerald-800 text-sm flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                أمان عالي معتمد شرعياً
              </span>
              <span className="text-[11px] text-neutral-500 block">
                صون الأعراض وسرية بيانات الأولياء
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">يوصى بتفعيل التحقق المزدوج للأهمية القصوى:</span>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                تطبيق ميثاق يضم معلومات عائلية حساسة ومراسلات تحت إشراف الأولياء؛ تفعيل المصادقة يمنع الاختراقات ويضمن عدم وصول أي طرف غير مخول لحسابك.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. ACTIVE SESSIONS MANAGEMENT (إدارة جلسات الدخول النشطة) */}
      {/* ======================================================== */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-[#9b4c2e]" />
              الأجهزة وجلسات الدخول النشطة (Active Sessions)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              الأجهزة المتصلة حالياً بحسابك في ميثاق. يمكنك إنهاء أي جلسة غير مرغوب فيها بنقرة واحدة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddMockSession}
              title="تجربة إضافة جهاز جديد"
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              + إضافة جهاز تجريبي
            </button>
            {sec.activeSessions.filter(s => !s.isCurrent).length > 0 && (
              <button
                type="button"
                onClick={handleTerminateAllOtherSessions}
                className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج من كافة الأجهزة الأخرى</span>
              </button>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {sec.activeSessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                session.isCurrent 
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs' 
                  : 'bg-white border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  session.deviceType === 'desktop' 
                    ? 'bg-neutral-100 text-neutral-700' 
                    : session.deviceType === 'mobile' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-purple-50 text-purple-700'
                }`}>
                  {session.deviceType === 'desktop' && <Laptop className="w-5 h-5" />}
                  {session.deviceType === 'mobile' && <Smartphone className="w-5 h-5" />}
                  {session.deviceType === 'tablet' && <Tablet className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900">
                      {session.deviceName}
                    </span>
                    {session.isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        هذا الجهاز الحالي
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 font-sans">
                    <span>{session.browser} • {session.os}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {session.location}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-neutral-400">IP: {session.ipAddress}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {session.lastActive}
                </span>

                {!session.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleTerminateSession(session.id)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 border border-transparent hover:border-rose-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>إنهاء الجلسة</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. RECENT LOGIN HISTORY (سجل أحدث عمليات تسجيل الدخول) */}
      {/* ======================================================== */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
              <History className="w-5 h-5 text-[#9b4c2e]" />
              سجل أحدث عمليات تسجيل الدخول (Login History)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              متابعة شفافة لجميع محاولات الدخول إلى حسابك، التوقيت، عنوان IP، ونوع التحقق المستخدم.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setHistoryFilter('all')}
              className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition ${
                historyFilter === 'all' 
                  ? 'bg-neutral-900 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              الكل ({sec.loginHistory.length})
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('two_factor')}
              className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition ${
                historyFilter === 'two_factor' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              2FA مؤكد
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('success')}
              className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition ${
                historyFilter === 'success' 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              ناجحة
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('failed')}
              className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition ${
                historyFilter === 'failed' 
                  ? 'bg-rose-700 text-white' 
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              محاولات مرفوضة
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
              <tr>
                <th className="p-3 text-start">التاريخ والوقت</th>
                <th className="p-3 text-start">الحالة</th>
                <th className="p-3 text-start">طريقة الدخول</th>
                <th className="p-3 text-start">الجهاز والمتصفح</th>
                <th className="p-3 text-start">الموقع الجغرافي و IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition">
                  <td className="p-3 font-mono text-[11px] font-medium text-neutral-900">
                    {item.timestamp}
                  </td>
                  <td className="p-3">
                    {item.status === 'two_factor_verified' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        تم التحقق بـ 2FA
                      </span>
                    )}
                    {item.status === 'success' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        دخول ناجح
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] inline-flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-600" />
                        فشل التحقق
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    {item.authMethod === 'authenticator_app' && 'تطبيق المصادقة (TOTP)'}
                    {item.authMethod === 'password' && 'كلمة المرور'}
                    {item.authMethod === 'google' && 'حساب Google'}
                    {item.authMethod === 'sms_otp' && 'رمز SMS'}
                  </td>
                  <td className="p-3 font-medium text-neutral-800">
                    {item.device} • {item.browser}
                  </td>
                  <td className="p-3 text-neutral-500">
                    <div>{item.location}</div>
                    <span className="font-mono text-[10px] text-neutral-400">{item.ipAddress}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: 2FA SETUP WIZARD (خطوات إعداد تطبيق المصادقة) */}
      {/* ======================================================== */}
      {is2FaSetupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-start shadow-2xl animate-in fade-in duration-150 border border-neutral-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#fbf1eb] text-[#9b4c2e]">
                  الخطوة {setupStep} من 3
                </span>
                <h3 className="text-lg font-black text-neutral-900 mt-1">
                  إعداد التحقق بخطوتين عبر تطبيق المصادقة
                </h3>
              </div>
              <button 
                onClick={() => setIs2FaSetupModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: SCAN QR CODE */}
            {setupStep === 1 && (
              <div className="space-y-5 text-xs">
                <p className="text-neutral-600 leading-relaxed">
                  قم بفتح تطبيق المصادقة المفضل لديك (Google Authenticator أو 1Password أو Microsoft Authenticator) وامسح رمز الاستجابة السريعة التالي:
                </p>

                {/* QR Code Canvas Box */}
                <div className="bg-[#fbf9f6] p-6 rounded-2xl border border-[#ede5dd] flex flex-col items-center justify-center space-y-3">
                  {/* High Quality Visual SVG QR Code Mock */}
                  <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-xs border border-neutral-200 flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900">
                      {/* Corner Position Detection Patterns */}
                      <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="11" y="11" width="13" height="13" rx="2" fill="currentColor" />

                      <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="76" y="11" width="13" height="13" rx="2" fill="currentColor" />

                      <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="11" y="76" width="13" height="13" rx="2" fill="currentColor" />

                      {/* Data Pattern Modules */}
                      <rect x="35" y="10" width="6" height="6" fill="currentColor" />
                      <rect x="45" y="10" width="6" height="6" fill="currentColor" />
                      <rect x="55" y="10" width="6" height="6" fill="currentColor" />
                      <rect x="35" y="20" width="6" height="6" fill="currentColor" />
                      <rect x="50" y="25" width="6" height="6" fill="currentColor" />

                      <rect x="10" y="35" width="6" height="6" fill="currentColor" />
                      <rect x="25" y="35" width="6" height="6" fill="currentColor" />
                      <rect x="35" y="35" width="6" height="6" fill="currentColor" />
                      <rect x="45" y="45" width="10" height="10" rx="2" fill="#9b4c2e" />
                      <rect x="60" y="35" width="6" height="6" fill="currentColor" />
                      <rect x="75" y="35" width="6" height="6" fill="currentColor" />
                      <rect x="85" y="35" width="6" height="6" fill="currentColor" />

                      <rect x="10" y="50" width="6" height="6" fill="currentColor" />
                      <rect x="20" y="50" width="6" height="6" fill="currentColor" />
                      <rect x="35" y="50" width="6" height="6" fill="currentColor" />
                      <rect x="60" y="50" width="6" height="6" fill="currentColor" />
                      <rect x="70" y="50" width="6" height="6" fill="currentColor" />
                      <rect x="85" y="50" width="6" height="6" fill="currentColor" />

                      <rect x="35" y="70" width="6" height="6" fill="currentColor" />
                      <rect x="50" y="70" width="6" height="6" fill="currentColor" />
                      <rect x="65" y="70" width="6" height="6" fill="currentColor" />
                      <rect x="80" y="70" width="6" height="6" fill="currentColor" />
                      <rect x="40" y="85" width="6" height="6" fill="currentColor" />
                      <rect x="55" y="85" width="6" height="6" fill="currentColor" />
                      <rect x="70" y="85" width="6" height="6" fill="currentColor" />
                      <rect x="85" y="85" width="6" height="6" fill="currentColor" />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-neutral-200 flex items-center justify-center">
                        <Key className="w-4 h-4 text-[#9b4c2e]" />
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-neutral-500 font-medium">
                    امسح الرمز بكاميرا التطبيق مباشرة
                  </span>
                </div>

                {/* Manual Secret Key Entry */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700 block">
                    أو أدخل المفتاح السري يدوياً في تطبيقك:
                  </label>
                  <div className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="font-mono text-neutral-900 font-bold tracking-wider text-xs flex-1 text-center select-all">
                      {sec.authenticatorAppSecret}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="px-3 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'تم النسخ!' : 'نسخ'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSetupStep(2)}
                    className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    التالي: التحقق من الرمز
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: VERIFY CODE */}
            {setupStep === 2 && (
              <form onSubmit={handleVerify2FaCode} className="space-y-5 text-xs">
                <div className="space-y-1">
                  <p className="text-neutral-600 leading-relaxed">
                    أدخل الرمز المكون من 6 أرقام الظاهر حالياً في تطبيق المصادقة لديك لتأكيد الربط:
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold p-3 bg-neutral-50 rounded-2xl border-2 border-neutral-200 focus:border-[#9b4c2e] focus:outline-none"
                  />
                  {verificationError && (
                    <p className="text-rose-600 font-bold text-center text-xs">
                      {verificationError}
                    </p>
                  )}
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl text-neutral-500 text-[11px] leading-relaxed">
                  💡 الرمز يتجدد تلقائياً كل 30 ثانية في تطبيقك. يمكنك كتابة الرمز الحالي الظاهر لديك.
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSetupStep(1)}
                    className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                  >
                    رجوع
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying || verificationCode.length < 6}
                    className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جارٍ التحقق...</span>
                      </>
                    ) : (
                      <span>تأكيد الرمز</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: BACKUP CODES */}
            {setupStep === 3 && (
              <div className="space-y-5 text-xs">
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>تم تأكيد الرمز بنجاح! احتفظ الآن برموز الاستعادة الاحتياطية.</span>
                </div>

                <p className="text-neutral-600 leading-relaxed">
                  هذه الرموز هي وسيلتك الوحيدة لاسترجاع حسابك في حال تعذر الوصول إلى هاتفك أو تطبيق المصادقة. احفظها في مكان آمن:
                </p>

                {/* Codes Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 font-mono text-center text-xs font-bold text-neutral-800">
                  {sec.backupCodes.map((code, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copiedBackupCodes ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedBackupCodes ? 'تم النسخ!' : 'نسخ جميع الرموز'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadBackupCodes}
                    className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل ملف نصي (.txt)</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleFinish2FaSetup}
                    className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    تم الحفظ وإتمام التفعيل
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: DISABLE 2FA CONFIRMATION */}
      {/* ======================================================== */}
      {isDisable2FaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-start shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-rose-600 pb-2 border-b border-neutral-100">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-base text-neutral-900">
                تأكيد تعطيل التحقق بخطوتين (2FA)
              </h3>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              هل أنت متأكد من رغبتك في تعطيل التحقق بخطوتين؟ سيؤدي هذا إلى خفض أمان حسابك وحرمانه من الحماية الإضافية ضد محاولات الاختراق.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 text-xs">
              <button
                type="button"
                onClick={() => setIsDisable2FaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
              >
                إلغاء التراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDisable2Fa}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                نعم، قم بالتعطيل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: VIEW BACKUP CODES */}
      {/* ======================================================== */}
      {isBackupCodesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 text-start shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-[#9b4c2e]" />
                رموز الاستعادة الاحتياطية
              </h3>
              <button onClick={() => setIsBackupCodesModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 font-mono text-center text-xs font-bold text-neutral-800">
              {sec.backupCodes.map((code, idx) => (
                <div key={idx} className="p-2 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleCopyBackupCodes}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedBackupCodes ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBackupCodes ? 'تم النسخ!' : 'نسخ الرموز'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadBackupCodes}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل .txt</span>
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex justify-end text-xs">
              <button
                type="button"
                onClick={() => setIsBackupCodesModalOpen(false)}
                className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
