import React from 'react';
import { UserSettings } from '../../types';
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Sparkles, 
  Calendar, 
  Volume2, 
  Moon, 
  Smartphone,
  Compass
} from 'lucide-react';

interface NotificationSettingsSectionProps {
  settings: UserSettings;
  onChange: (updated: Partial<UserSettings>) => void;
}

export const NotificationSettingsSection: React.FC<NotificationSettingsSectionProps> = ({
  settings,
  onChange
}) => {
  const notifs = settings.notifications || {
    smsOnProposal: settings.smsAlerts ?? true,
    emailOnWaliAction: settings.emailAlerts ?? true,
    weeklyIstikharaReminder: true,
    marketingDigest: false,
    whatsappAlerts: true,
    meetingReminders: true,
    newMatchNotifications: true,
    soundEnabled: true,
    quietHoursEnabled: false,
    quietHoursStart: '23:00',
    quietHoursEnd: '06:00'
  };

  const updateNotifs = (partial: Partial<NonNullable<UserSettings['notifications']>>) => {
    const updated = { ...notifs, ...partial };
    onChange({
      notifications: updated,
      smsAlerts: updated.smsOnProposal,
      emailAlerts: updated.emailOnWaliAction
    });
  };

  return (
    <div className="space-y-6" id="notification-settings-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50/70 via-stone-50 to-white p-5 rounded-2xl border border-blue-200/60 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
          <Bell className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-start">
          <h3 className="text-sm font-bold text-neutral-900">
            منظومة التنبيهات والإشعارات الشرعية
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            خصص القنوات والأوقات التي ترغب باستلام إشعارات خطوات الخطوبة، تذكيرات صلاة الاستخارة، ومواعيد مجالس الرؤية الشرعية من خلالها.
          </p>
        </div>
      </div>

      {/* Immediate Critical Alerts (SMS & WhatsApp) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Smartphone className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            تنبيهات الرسائل العاجلة (SMS & WhatsApp)
          </h4>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                تنبيهات الرسائل النصية القصيرة (SMS Alerts)
              </span>
              <span className="text-neutral-500">
                إشعار فوري عند وصول طلب خطوبة جديد أو اعتماد موافقة الولي
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifs.smsOnProposal}
              onChange={(e) => updateNotifs({ smsOnProposal: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                إشعارات تطبيق WhatsApp المعتمدة
              </span>
              <span className="text-neutral-500">
                تحديثات مسار الخطوبة ومواعيد الرؤية الشرعية عبر رسائل WhatsApp الرسمية
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifs.whatsappAlerts}
              onChange={(e) => updateNotifs({ whatsappAlerts: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                تنبيهات البريد الإلكتروني (Email Alerts)
              </span>
              <span className="text-neutral-500">
                ملخص أسبوعي بالمرشحين المتوافقين وسجلات الإجراءات
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifs.emailOnWaliAction}
              onChange={(e) => updateNotifs({ emailOnWaliAction: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Sharia Reminders & Matrimonial Follow-ups */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Compass className="w-4 h-4 text-[#9b4c2e]" />
          <h4 className="text-sm font-bold text-neutral-900">
            تذكيرات الاستخارة ومجالس الرؤية الشرعية
          </h4>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                تذكير صلاة الاستخارة الأسبوعي وأدعية التوفيق
              </span>
              <span className="text-neutral-500">
                إرسال نص دعاء الاستخارة وتذكير يوم الجمعة المباركة بالدعاء والتأني
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifs.weeklyIstikharaReminder}
              onChange={(e) => updateNotifs({ weeklyIstikharaReminder: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                تنبيهات مواعيد مجالس الرؤية المجدولة
              </span>
              <span className="text-neutral-500">
                تذكير قبل موعد الرؤية الشرعية بـ 24 ساعة وساعتين بحضور المحرم
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifs.meetingReminders}
              onChange={(e) => updateNotifs({ meetingReminders: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/70 hover:bg-neutral-100/60 transition cursor-pointer">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-neutral-900 block">
                إشعارات التوافق والمطابقة الشرعية الذكية
              </span>
              <span className="text-neutral-500">
                إعلامك فور انضمام سيرة ذاتية تحقق شروطك ومعايير تكافؤك بنسبة 90%+
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifs.newMatchNotifications}
              onChange={(e) => updateNotifs({ newMatchNotifications: e.target.checked })}
              className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Quiet Hours Mode */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4 text-start">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-neutral-900">
                وضع ساعات السكينة وعدم الإزعاج (Quiet Hours)
              </h4>
            </div>
            <p className="text-xs text-neutral-500">
              إيقاف التنبيهات الصوتية والرسائل خلال ساعات الليل والراحة
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifs.quietHoursEnabled}
            onChange={(e) => updateNotifs({ quietHoursEnabled: e.target.checked })}
            className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
          />
        </div>

        {notifs.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                بدء ساعات السكينة
              </label>
              <input
                type="time"
                value={notifs.quietHoursStart || '23:00'}
                onChange={(e) => updateNotifs({ quietHoursStart: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-[#9b4c2e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                انتهاء ساعات السكينة
              </label>
              <input
                type="time"
                value={notifs.quietHoursEnd || '06:00'}
                onChange={(e) => updateNotifs({ quietHoursEnd: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-[#9b4c2e]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
