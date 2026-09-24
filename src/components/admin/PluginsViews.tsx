import React, { useState } from 'react';
import { 
  Puzzle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  Plus, 
  Download, 
  Upload, 
  Sparkles, 
  Check, 
  X,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AdminPluginItem, INITIAL_PLUGINS_LIST } from '../../data/adminPluginsData';

interface PluginsProps {
  currentSubSection: string;
}

export const PluginsViews: React.FC<PluginsProps> = ({ currentSubSection }) => {
  const [plugins, setPlugins] = useState<AdminPluginItem[]>(INITIAL_PLUGINS_LIST);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPlugin, setSelectedPlugin] = useState<AdminPluginItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const togglePluginStatus = (id: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'active' ? 'inactive' : 'active';
        showToast(`تم ${nextStatus === 'active' ? 'تفعيل' : 'تعطيل'} إضافة (${p.name}) بنجاح`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const activePlugins = plugins.filter(p => p.status === 'active');
  const inactivePlugins = plugins.filter(p => p.status === 'inactive');

  const filtered = plugins.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 font-cairo">
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. INSTALLED PLUGINS */}
      {currentSubSection === 'plugins_installed' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                الإضافات المثبتة (Installed Plugins)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                إدارة الإضافات النشطة والتحكم في وظائف المنصة والتكاملات البرمجية.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activePlugins.length} إضافة مفعلة
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-600">
                {inactivePlugins.length} معطلة
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث في الإضافات المثبتة..."
                className="w-full text-xs ps-8 pe-3 py-2 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              />
            </div>
          </div>

          {/* Grid of Installed Plugins */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((plugin) => {
              const isActive = plugin.status === 'active';
              return (
                <div
                  key={plugin.id}
                  className={`bg-white rounded-2xl border p-5 space-y-3 shadow-2xs flex flex-col justify-between transition ${
                    isActive ? 'border-neutral-200 hover:border-[#9b4c2e]' : 'border-neutral-200 opacity-70 bg-neutral-50/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {isActive ? 'مفعلة ونشطة' : 'معطلة'}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">v{plugin.version}</span>
                    </div>

                    <h3 className="font-bold text-sm text-neutral-900 leading-snug">{plugin.name}</h3>
                    <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                      {plugin.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-sans">{plugin.author}</span>
                    <div className="flex items-center gap-1.5">
                      {plugin.configurable && (
                        <button
                          onClick={() => setSelectedPlugin(plugin)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                          title="إعدادات الإضافة"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => togglePluginStatus(plugin.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. AVAILABLE PLUGINS (ALL 57+ FROM USER PROMPT) */}
      {currentSubSection === 'plugins_available' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                متجر ومستودع الإضافات المتاحة (Available Plugins)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                كافة حزم وإضافات SkaDate و Oxwall المتوافقة مع النظام لتوسيع قدرات منصة الزواج.
              </p>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#fbf1eb] text-[#9b4c2e] border border-[#9b4c2e]/20">
              إجمالي الحزم المتاحة: {plugins.length} إضافة
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث في جميع الإضافات المتاحة..."
                className="w-full text-xs ps-8 pe-3 py-2 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-white rounded-xl border border-neutral-200 focus:outline-none"
            >
              <option value="all">كافة التصنيفات (All Categories)</option>
              <option value="core">الأساسية والتعارف (Core & Matchmaking)</option>
              <option value="billing">الدفع والمالية (Billing & Payment)</option>
              <option value="moderation">الرقابة والنزاهة (Moderation & Safety)</option>
              <option value="themes">المظهر والثيمات (Themes & Templates)</option>
              <option value="social">التفاعل المجتمعي (Social & Community)</option>
              <option value="media">الوسائط والمحادثات (Media & Chat)</option>
              <option value="analytics">الإحصائيات (Analytics)</option>
              <option value="utility">أدوات مساعدة (Utility & Integration)</option>
            </select>
          </div>

          {/* Table / List View of Available Plugins */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-3 text-start">اسم الإضافة</th>
                    <th className="p-3 text-start">الوصف الشرعي والوظيفي</th>
                    <th className="p-3 text-start">التصنيف</th>
                    <th className="p-3 text-start">الإصدار</th>
                    <th className="p-3 text-start">الحالة</th>
                    <th className="p-3 text-end">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filtered.map((pl) => {
                    const isActive = pl.status === 'active';
                    return (
                      <tr key={pl.id} className="hover:bg-neutral-50 transition">
                        <td className="p-3">
                          <span className="font-bold text-neutral-900 block">{pl.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{pl.id}</span>
                        </td>
                        <td className="p-3 max-w-md">
                          <p className="text-neutral-600 text-[11px] leading-relaxed line-clamp-2">
                            {pl.description}
                          </p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-medium">
                            {pl.category}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-neutral-500">v{pl.version}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {isActive ? 'مثبتة ومفعلة' : 'متوفرة'}
                          </span>
                        </td>
                        <td className="p-3 text-end">
                          <button
                            onClick={() => togglePluginStatus(pl.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              isActive
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                : 'bg-[#9b4c2e] hover:bg-[#853e24] text-white'
                            }`}
                          >
                            {isActive ? 'إلغاء التفعيل' : 'تثبيت وتفعيل'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADD NEW PLUGIN */}
      {currentSubSection === 'plugins_add_new' && (
        <div className="space-y-6">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              تثبيت إضافة جديدة (Add New Plugin)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              رفع حزمة برمجية مضغوطة (.zip) أو استيراد إضافة متوافقة مع محرك SkaDate / Oxwall.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-[#9b4c2e] transition text-center space-y-3 cursor-pointer shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">انقر هنا لاختيار ملف الإضافة أو اسحبه إلى هنا</h3>
              <p className="text-xs text-neutral-500 mt-1">
                الصيغ المدعومة: حزم الأرشيف ZIP المطابقة لهيكل إضافات SkaDate
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('نظام الفحص الأمني يفحص الحزمة البرمجية... تم اعتمادها')}
              className="px-5 py-2 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold transition cursor-pointer"
            >
              اختيار حزمة الإضافة
            </button>
          </div>
        </div>
      )}

      {/* Plugin Configuration Modal */}
      {selectedPlugin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">إعدادات: {selectedPlugin.name}</h3>
                <span className="text-[10px] text-neutral-400 font-mono">الإصدار {selectedPlugin.version}</span>
              </div>
              <button
                onClick={() => setSelectedPlugin(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-800 block mb-1">وصف الإضافة:</span>
                <p className="text-neutral-600 leading-relaxed">{selectedPlugin.description}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-800">حالة التفعيل:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedPlugin.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {selectedPlugin.status === 'active' ? 'مفعلة' : 'معطلة'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSelectedPlugin(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => {
                  togglePluginStatus(selectedPlugin.id);
                  setSelectedPlugin(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold text-xs cursor-pointer"
              >
                تبديل الحالة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
