import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Zap, 
  Bot, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sliders, 
  Save, 
  Play, 
  RefreshCw,
  Plus,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { AuditLogItem, FlaggedMessage } from '../../types';
import { MessageTriggerRule, INITIAL_TRIGGER_RULES } from '../../data/adminSettingsData';

// -------------------------------------------------------------
// 1. CONSOLE LOG VIEW
// -------------------------------------------------------------
interface ConsoleLogProps {
  logs: AuditLogItem[];
  flaggedMessages: FlaggedMessage[];
  onFlagAction: (id: string, action: 'dismissed' | 'warned' | 'blocked') => void;
}

export const ConsoleLogsView: React.FC<ConsoleLogProps> = ({ logs, flaggedMessages, onFlagAction }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'sharia_flags'>('system');
  const [levelFilter, setLevelFilter] = useState<'all' | 'success' | 'warning' | 'alert'>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l => {
    if (levelFilter !== 'all' && l.status !== levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.action.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.operator.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 font-cairo">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            سجل النظام والمراقبة الشرعية (Console Log)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            سجل العمليات التقنية والشرعية اللحظي، تدقيق العمليات الحساسة، ورصد محاولات مخالفة الضوابط.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'system' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
              }`}
            >
              سجل النظام العام ({logs.length})
            </button>
            <button
              onClick={() => setActiveTab('sharia_flags')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sharia_flags' ? 'bg-white text-rose-700 shadow-2xs' : 'text-neutral-500'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>البلاغات الشرعية ({flaggedMessages.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'system' ? (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="تصفية السجل بالإجراء، المشغل، أو التفاصيل..."
                className="w-full text-xs ps-8 pe-3 py-2 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="text-xs px-3 py-2 bg-white rounded-xl border border-neutral-200 focus:outline-none"
            >
              <option value="all">كافة المستويات</option>
              <option value="success">عمليات ناجحة</option>
              <option value="warning">تحذيرات نظام</option>
              <option value="alert">تنبيهات أمنية شرعية</option>
            </select>
          </div>

          {/* Console Code Terminal Look */}
          <div className="bg-[#1e1e24] text-neutral-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto shadow-sm space-y-2 border border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-sans ms-2 text-neutral-400">meethaq-audit.log</span>
              </div>
              <span>معدل التحديث: فوري (WebSocket / Polling)</span>
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pt-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 hover:bg-white/5 p-1 rounded transition">
                  <span className="text-neutral-500 shrink-0 text-[10px]">{log.timestamp.slice(11, 19)}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                    log.status === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    log.status === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-[#e58a69] font-bold shrink-0">[{log.category}]</span>
                  <span className="text-neutral-300 font-sans font-semibold">{log.action}:</span>
                  <span className="text-neutral-400 font-sans">{log.details}</span>
                  <span className="text-neutral-600 text-[10px] ms-auto shrink-0 font-sans">بواسطة: {log.operator}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Sharia Flags tab */
        <div className="space-y-3">
          {flaggedMessages.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-neutral-800 text-sm">لا توجد بلاغات شرعية نشطة حالياً</h3>
              <p className="text-xs text-neutral-500 mt-1">كافة المحادثات بين الخطاب تحت رقابة مستمرة ومطابقة للضوابط الشرعية.</p>
            </div>
          ) : (
            flaggedMessages.map((flag) => (
              <div key={flag.id} className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span className="font-bold text-xs text-neutral-900">{flag.senderName} ({flag.senderRole})</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold font-mono">
                      سبب البلاغ: {flag.flagReason}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">{flag.timestamp}</span>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-800 italic font-sans">
                  "{flag.content}"
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="text-[11px] text-neutral-500">
                    طلب الخطوبة المرتبط: <strong className="font-mono text-neutral-700">{flag.proposalId}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onFlagAction(flag.id, 'dismissed')}
                      className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold cursor-pointer"
                    >
                      تجاهل (سليم شرعاً)
                    </button>
                    <button
                      onClick={() => onFlagAction(flag.id, 'warned')}
                      className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold cursor-pointer"
                    >
                      توجيه إنذار رسمي
                    </button>
                    <button
                      onClick={() => onFlagAction(flag.id, 'blocked')}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                    >
                      حظر العضو فورا
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. MESSAGE TRIGGER RULES VIEW
// -------------------------------------------------------------
export const ConsoleTriggersView: React.FC = () => {
  const [rules, setRules] = useState<MessageTriggerRule[]>(INITIAL_TRIGGER_RULES);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
  };

  return (
    <div className="space-y-6 font-cairo">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          قواعد رسائل التنبيه التلقائية (Message Trigger Rules)
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          أتمتة الرسائل التنبيهية الشرعية عند الأحداث الهامة (وصول طلب خطوبة للولي، تذكير الاستخارة، أو رصد مخالفات).
        </p>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${rule.isEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-400'}`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">{rule.name}</h3>
                  <span className="text-[11px] text-neutral-500 font-mono">الحدث: {rule.triggerEvent}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleRule(rule.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  rule.isEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {rule.isEnabled ? 'مفعلة' : 'معطلة'}
              </button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700">
              <span className="font-bold text-neutral-500 text-[10px] block mb-1">قالب الرسالة:</span>
              <p className="leading-relaxed font-sans">{rule.templateText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. AGENT STATS VIEW
// -------------------------------------------------------------
export const ConsoleAgentStatsView: React.FC = () => {
  return (
    <div className="space-y-6 font-cairo">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          إحصائيات الذكاء الاصطناعي والمستشارين (Agent Stats)
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          مؤشرات الأداء الآلي لوكيل الفتاوى والمستشار الأسري المبني على Google Gemini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs text-neutral-500 font-bold">الاستشارات المنجزة</span>
          <div className="text-2xl font-black text-neutral-900 mt-1">12,480</div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">استشارات توافق واستخارة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs text-neutral-500 font-bold">معدل الدقة الشرعية</span>
          <div className="text-2xl font-black text-neutral-900 mt-1">99.8%</div>
          <span className="text-[11px] text-neutral-400 block mt-1">بإشراف المشايخ المعتمدين</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs text-neutral-500 font-bold">متوسط زمن الاستجابة</span>
          <div className="text-2xl font-black text-neutral-900 mt-1">840ms</div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">سرعة فائقة (Gemini Flash)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-xs text-neutral-500 font-bold">نسبة رضا الأولياء</span>
          <div className="text-2xl font-black text-neutral-900 mt-1">98.4%</div>
          <span className="text-[11px] text-neutral-400 block mt-1">تقييمات إيجابية للمستشار</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. AGENTS VIEW
// -------------------------------------------------------------
export const ConsoleAgentsView: React.FC = () => {
  return (
    <div className="space-y-6 font-cairo">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          إدارة الوكلاء والمستشارين (Agents Management)
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          قائمة الوكلاء الذكيين المخصصين لتوجيه المقبلين على الزواج وتدقيق الصور والنصوص.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              متصل ونشط
            </span>
            <Bot className="w-5 h-5 text-[#9b4c2e]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-neutral-900">الشيخ المستشار الأسري</h3>
            <p className="text-xs text-neutral-500 mt-1">
              مستشار شرعي مبني على الذكاء الاصطناعي للإجابة على تساؤلات الكفاءة، صلاة الاستخارة، وآداب الخطبة في الإسلام.
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-100 pt-2">
            النموذج: <strong className="font-mono text-neutral-700">gemini-2.5-flash</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              متصل ونشط
            </span>
            <Cpu className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-neutral-900">حارس العفاف (Sharia Guard)</h3>
            <p className="text-xs text-neutral-500 mt-1">
              وكيل فوري يراقب غرف المحادثات ويمنع أرقام الهواتف والتواصل غير اللائق قبل حضور الولي الشرعي.
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-100 pt-2">
            الحالة: مراقبة فورية لـ 100% من الرسائل
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              متصل ونشط
            </span>
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-neutral-900">مساعد إدخال السيرة والولي</h3>
            <p className="text-xs text-neutral-500 mt-1">
              يساعد الإخوة والأخوات في كتابة سيرهم الذاتية وتوضيح التطلعات الأسرية بأسلوب وقور ومحتشم.
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-100 pt-2">
            الحالة: نشط في صفحة التسجيل
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. ARTIFICIAL INTELLIGENCE VIEW
// -------------------------------------------------------------
export const ConsoleAiView: React.FC = () => {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.4);
  const [systemPrompt, setSystemPrompt] = useState(
    'أنت الشيخ المستشار الأسري لمنصة ميثاق للزواج الإسلامي الشرعي. تتحدث بلغة عربية فصحى وقورة ومحترمة، وتلتزم بفقه أهل السنة والجماعة، ولا تجيز الخلوة أو التبرج، وتؤكد دائماً على ولاية الولي الشرعي وتيسير المهور والاقتداء بالسنة النبوية الشريفة.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6 font-cairo">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          إعدادات نموذج الذكاء الاصطناعي (Artificial Intelligence)
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          ضبط معلمات نموذج Google Gemini والموجه الشرعي لحماية المنصة وضمان الرصانة.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ معلمات وتوجيهات نموذج الذكاء الاصطناعي بنجاح!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-bold mb-1.5">نموذج الذكاء الاصطناعي الأساسي</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono"
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (الخيار الموصى به - فائق السرعة والكفاءة)</option>
              <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite (خفيف وسريع جداً)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (استنتاج شرعي عميق)</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1.5">
              درجة الانضباط / الحرارة (Temperature: {temperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#9b4c2e] mt-2"
            />
            <span className="text-[10px] text-neutral-400 block mt-1">
              (القيمة 0.4 مثالية للفتاوى والاستشارات الشرعية الدقيقة)
            </span>
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 font-bold mb-1.5">التوجيه الشرعي للنظام (System Instruction)</label>
          <textarea
            rows={5}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 leading-relaxed font-sans"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>حفظ التعديلات وتحديث الوكيل</span>
        </button>
      </form>
    </div>
  );
};
