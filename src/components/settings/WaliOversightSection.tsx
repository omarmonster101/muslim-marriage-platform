import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { 
  ShieldCheck, 
  UserCheck, 
  Phone, 
  Mail, 
  KeyRound, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  FileText,
  AlertCircle,
  Smartphone
} from 'lucide-react';

interface WaliOversightSectionProps {
  settings: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
  isFemale?: boolean;
}

export const WaliOversightSection: React.FC<WaliOversightSectionProps> = ({
  settings,
  onChange,
  isFemale = true
}) => {
  const waliConfig = settings.waliConfig || {
    waliName: 'أحمد بن إبراهيم الخالدي',
    waliRelation: 'الوالد',
    waliPhone: '+966 50 123 4567',
    waliEmail: 'wali.alkhalidi@gmail.com',
    waliVerificationStatus: 'verified',
    autoNotifyWaliOnNewKhitbah: true,
    requireWaliPasscodeForChat: true,
    waliDirectCallAllowed: true,
    dailyWaliSummaryReport: false,
    forwardAllMessagesToWali: true
  };

  const updateWali = (partial: Partial<NonNullable<UserSettings['waliConfig']>>) => {
    const updated = { ...waliConfig, ...partial };
    onChange({
      waliConfig: updated,
      waliSupervisionMandatory: settings.waliSupervisionMandatory
    });
  };

  return (
    <div className="space-y-6" id="wali-oversight-section">
      {/* Wali Banner */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-stone-50 to-white p-5 rounded-2xl border border-emerald-200/70 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900">
              بوابة وإشراف الولي الشرعي والمحرم
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              صك الولاية موثق
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            وفقاً لهدي النبي ﷺ: «لا نِكاحَ إلَّا بوَلِيٍّ»؛ تضمن المنصة مشاركة ولي الأمر في كل خطوة، مع وصول كامل للرسائل والتنبيهات وإدارة الرؤية الشرعية.
          </p>
        </div>
      </div>

      {/* Mandatory Supervision Switch */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-neutral-900">
              الإشراف الإلزامي لولي الأمر على الحساب
            </h4>
            <p className="text-xs text-neutral-500">
              اشتراط موافقة الولي المسبقة قبل فتح أي جلسة حوار شرعي أو رؤية
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.waliSupervisionMandatory}
              onChange={(e) => onChange({ waliSupervisionMandatory: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9b4c2e]"></div>
          </label>
        </div>

        {/* Registered Wali Credentials Form */}
        <div className="space-y-4 pt-2">
          <span className="text-xs font-bold text-neutral-800 block">
            بيانات ولي الأمر المعتمد في السجلات الشرعية:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                اسم ولي الأمر الرباعي
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={waliConfig.waliName || ''}
                  onChange={(e) => updateWali({ waliName: e.target.value })}
                  placeholder="مثال: أحمد بن إبراهيم الخالدي"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] focus:ring-1 focus:ring-[#9b4c2e] bg-white text-neutral-900"
                />
                <UserCheck className="w-4 h-4 text-neutral-400 absolute end-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                صلة القرابة الشرعية
              </label>
              <select
                value={waliConfig.waliRelation || 'الوالد'}
                onChange={(e) => updateWali({ waliRelation: e.target.value })}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] focus:ring-1 focus:ring-[#9b4c2e] bg-white text-neutral-900 cursor-pointer"
              >
                <option value="الوالد">الوالد (الأب)</option>
                <option value="الجد">الجد لأب</option>
                <option value="الأخ الشقيق">الأخ الشقيق</option>
                <option value="الأخ لأب">الأخ لأب</option>
                <option value="العم الشقيق">العم الشقيق</option>
                <option value="الوكيل الشرعي">وكيل شرعي معتمد بصك شرعي</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                رقم هاتف الولي (المستلم للتنبيهات والـ OTP)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  value={waliConfig.waliPhone || ''}
                  onChange={(e) => updateWali({ waliPhone: e.target.value })}
                  placeholder="+966 50 123 4567"
                  className="w-full text-xs font-mono font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] focus:ring-1 focus:ring-[#9b4c2e] bg-white text-neutral-900"
                />
                <Phone className="w-4 h-4 text-neutral-400 absolute end-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                البريد الإلكتروني لولي الأمر (اختياري)
              </label>
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  value={waliConfig.waliEmail || ''}
                  onChange={(e) => updateWali({ waliEmail: e.target.value })}
                  placeholder="wali@example.com"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] focus:ring-1 focus:ring-[#9b4c2e] bg-white text-neutral-900"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute end-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Notification & Supervision Channels */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Smartphone className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            قنوات الإشعار والتواصل مع ولي الأمر
          </h4>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                تنبيه SMS وWhatsApp فوري للولي عند استلام أي طلب خطوبة
              </span>
              <span className="text-neutral-500">
                إرسال ملخص السيرة الذاتية للخاطب إلى هاتف الولي مباشرة لتقييم الطلب
              </span>
            </div>
            <input
              type="checkbox"
              checked={waliConfig.autoNotifyWaliOnNewKhitbah}
              onChange={(e) => updateWali({ autoNotifyWaliOnNewKhitbah: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                إرسال نسخة من كافة المداولات والمحادثات الشرعية إلى هاتف الولي
              </span>
              <span className="text-neutral-500">
                اطلاع الولي التلقائي على جميع الرسائل المتبادلة في غرفة المحادثة المراقبة
              </span>
            </div>
            <input
              type="checkbox"
              checked={waliConfig.forwardAllMessagesToWali}
              onChange={(e) => updateWali({ forwardAllMessagesToWali: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                اشتراط رمز مرور أمان (Passcode) لولي الأمر لفتح جلسة الرؤية
              </span>
              <span className="text-neutral-500">
                لا تبدأ الجلسة المرئية أو الحوار إلا بعد إدخال رمز الأمان السري للولي
              </span>
            </div>
            <input
              type="checkbox"
              checked={waliConfig.requireWaliPasscodeForChat}
              onChange={(e) => updateWali({ requireWaliPasscodeForChat: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                السماح للخاطب المعتمد بطلب الاتصال الهاتفي المباشر بمجلس الولي
              </span>
              <span className="text-neutral-500">
                إظهار رقم مجلس الولي للخاطب فقط بعد قبول الطلب المبدئي
              </span>
            </div>
            <input
              type="checkbox"
              checked={waliConfig.waliDirectCallAllowed}
              onChange={(e) => updateWali({ waliDirectCallAllowed: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
