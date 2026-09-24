import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Globe, 
  Layout, 
  Sparkles,
  Sliders,
  Check,
  Save,
  Database,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Lock,
  X
} from 'lucide-react';
import { AdminPageItem, INITIAL_PAGES_LIST } from '../../data/adminSettingsData';
import { PageLayoutSettings } from '../../types';
import { 
  fetchSitePagesFromDb, 
  saveSitePageToDb, 
  deleteSitePageFromDb, 
  subscribeToSitePages,
  fetchPageSettingsFromDb,
  savePageSettingsToDb,
  subscribeToPageSettings,
  DEFAULT_PAGE_LAYOUT_SETTINGS,
  firebaseConfig
} from '../../lib/firebase';

interface PagesProps {
  currentSubSection: string;
}

export const PagesViews: React.FC<PagesProps> = ({ currentSubSection }) => {
  const [pages, setPages] = useState<AdminPageItem[]>(INITIAL_PAGES_LIST);
  const [pageSettings, setPageSettings] = useState<PageLayoutSettings>(DEFAULT_PAGE_LAYOUT_SETTINGS);
  const [editPage, setEditPage] = useState<AdminPageItem | null>(null);
  const [previewPage, setPreviewPage] = useState<AdminPageItem | null>(null);
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // New page form state
  const [newPageForm, setNewPageForm] = useState<Partial<AdminPageItem>>({
    title: '',
    slug: '',
    type: 'standard',
    status: 'published',
    author: 'إدارة المنصة',
    contentAr: ''
  });

  // Real-time Firestore Subscriptions
  useEffect(() => {
    // 1. Subscribe to pages
    const unsubPages = subscribeToSitePages((remotePages) => {
      if (remotePages && remotePages.length > 0) {
        setPages(remotePages);
        setIsDbConnected(true);
      }
    });

    // 2. Subscribe to page layout settings
    const unsubSettings = subscribeToPageSettings((remoteSettings) => {
      if (remoteSettings) {
        setPageSettings(remoteSettings);
      }
    });

    return () => {
      unsubPages();
      unsubSettings();
    };
  }, []);

  const showStatus = (message: string, type: 'success' | 'error' = 'success') => {
    setStatusNotice({ type, message });
    setTimeout(() => setStatusNotice(null), 4000);
  };

  // 1. Save / Update Page in Firestore
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPage) return;
    setIsSaving(true);
    try {
      const success = await saveSitePageToDb(editPage);
      if (success) {
        setPages(prev => prev.map(p => p.id === editPage.id ? editPage : p));
        setEditPage(null);
        showStatus(`تم حفظ وتحديث صفحة "${editPage.title}" في قاعدة البيانات بنجاح!`);
      } else {
        showStatus('تعذر الحفظ في قاعدة البيانات، يرجى المحاولة ثانية', 'error');
      }
    } catch {
      showStatus('حدث خطأ أثناء الاتصال بـ Firestore', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Create New Page in Firestore
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageForm.title || !newPageForm.slug) return;
    setIsSaving(true);
    try {
      const pageId = `page_${newPageForm.slug.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
      const pageItem: AdminPageItem = {
        id: pageId,
        title: newPageForm.title,
        slug: newPageForm.slug.toLowerCase().replace(/\s+/g, '-'),
        type: newPageForm.type || 'standard',
        status: newPageForm.status || 'published',
        lastUpdated: new Date().toISOString().split('T')[0],
        author: newPageForm.author || 'إدارة المنصة',
        contentAr: newPageForm.contentAr || ''
      };

      const success = await saveSitePageToDb(pageItem);
      if (success) {
        setPages(prev => [...prev, pageItem]);
        setIsAddPageModalOpen(false);
        setNewPageForm({
          title: '',
          slug: '',
          type: 'standard',
          status: 'published',
          author: 'إدارة المنصة',
          contentAr: ''
        });
        showStatus(`تم إنشاء الصفحة "${pageItem.title}" وتخزينها في Firestore بنجاح!`);
      } else {
        showStatus('تعذر إنشاء الصفحة في قاعدة البيانات', 'error');
      }
    } catch {
      showStatus('حدث خطأ في قاعدة البيانات', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Delete Page from Firestore
  const handleDeletePage = async (page: AdminPageItem) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف صفحة "${page.title}" نهائياً من قاعدة البيانات؟`)) {
      return;
    }
    setIsSaving(true);
    try {
      const success = await deleteSitePageFromDb(page.id);
      if (success) {
        setPages(prev => prev.filter(p => p.id !== page.id));
        showStatus(`تم حذف صفحة "${page.title}" من قاعدة البيانات.`);
      } else {
        showStatus('تعذر حذف الصفحة من Firestore', 'error');
      }
    } catch {
      showStatus('خطأ أثناء الحذف', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Update Profile Layout Settings in Firestore
  const updateProfileLayout = async (partial: Partial<PageLayoutSettings['profileLayout']>) => {
    const updatedLayout = { ...pageSettings.profileLayout, ...partial };
    const newSettings: PageLayoutSettings = {
      ...pageSettings,
      profileLayout: updatedLayout
    };
    setPageSettings(newSettings);
    setIsSaving(true);
    try {
      const success = await savePageSettingsToDb(newSettings);
      if (success) {
        showStatus('تم حفظ وتحديث إعدادات تخطيط الملف الشخصي في Firestore!');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Toggle Dashboard Widget in Firestore
  const toggleWidget = async (widgetId: string) => {
    const updatedWidgets = pageSettings.dashboardWidgets.map(w => 
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    );
    const newSettings: PageLayoutSettings = {
      ...pageSettings,
      dashboardWidgets: updatedWidgets
    };
    setPageSettings(newSettings);
    setIsSaving(true);
    try {
      const success = await savePageSettingsToDb(newSettings);
      if (success) {
        showStatus('تم تحديث حالة الودجت في قاعدة البيانات بنجاح!');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-cairo" id="admin-pages-views">
      
      {/* Top Firestore Database Status Capsule */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-neutral-900 text-white rounded-2xl border border-neutral-800 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold flex items-center gap-1.5 text-amber-200">
            <Database className="w-4 h-4 text-emerald-400" />
            قاعدة بيانات صفحات المنصة (Firestore: site_pages)
          </span>
          <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
            ID: {firebaseConfig.firestoreDatabaseId || 'default'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
            ✓ متزامن سحابياً ({pages.length} صفحة)
          </span>
          {isSaving && (
            <span className="flex items-center gap-1 text-amber-300 text-xs font-bold animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              جارٍ الحفظ في السحابة...
            </span>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {statusNotice && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 shadow-2xs transition-all ${
          statusNotice.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${statusNotice.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`} />
            <span>{statusNotice.message}</span>
          </div>
          <button onClick={() => setStatusNotice(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MANAGE STATIC PAGES (إدارة الصفحات الثابتة) */}
      {/* ======================================================== */}
      {currentSubSection === 'pages_manage' && (
        <div className="space-y-6 text-start">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                إدارة الصفحات الثابتة والضوابط (Manage Pages)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                تعديل صفحات من نحن، الشروط والأحكام، سياسة الخصوصية، والضوابط الشرعية المربوطة مباشرة بسحابة Firestore.
              </p>
            </div>

            <button
              onClick={() => setIsAddPageModalOpen(true)}
              className="px-4 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-2xs w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة صفحة جديدة</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-3.5 text-start">عنوان الصفحة</th>
                    <th className="p-3.5 text-start">الرابط المرجعي (Slug)</th>
                    <th className="p-3.5 text-start">الجهة المسؤولة</th>
                    <th className="p-3.5 text-start">الحالة</th>
                    <th className="p-3.5 text-start">آخر تعديل بـ Firestore</th>
                    <th className="p-3.5 text-end">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {pages.filter(p => p.type === 'standard').map((page) => (
                    <tr key={page.id} className="hover:bg-neutral-50 transition">
                      <td className="p-3.5 font-bold text-neutral-900">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#9b4c2e]" />
                          <span>{page.title}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-neutral-500">
                        /{page.slug}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-[10px] font-medium">
                          {page.author || 'هيئة الرقابة'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          page.status === 'published' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {page.status === 'published' ? 'منشورة ومعتمدة' : 'مسودة قيد المراجعة'}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-400 font-mono text-[11px]">{page.lastUpdated}</td>
                      <td className="p-3.5 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewPage(page)}
                            title="معاينة الصفحة"
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditPage(page)}
                            title="تحرير الصفحة"
                            className="px-2.5 py-1.5 rounded-lg bg-[#9b4c2e]/10 hover:bg-[#9b4c2e] hover:text-white text-[#9b4c2e] font-bold text-xs transition cursor-pointer flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>تحرير</span>
                          </button>
                          {page.id.startsWith('page_') && !['page_about', 'page_terms', 'page_privacy'].includes(page.id) && (
                            <button
                              onClick={() => handleDeletePage(page)}
                              title="حذف الصفحة"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SPECIAL PATHS & PORTALS (المسارات والصفحات الخاصة) */}
      {/* ======================================================== */}
      {currentSubSection === 'pages_special' && (
        <div className="space-y-6 text-start">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              الصفحات والمسارات الخاصة والشرعية (Special Pages)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              إدارة مسارات بوابة الولي، الرؤية الشرعية، ومنظومة عقود النكاح المعتمدة والمحفوظة في قاعدة البيانات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pages.filter(p => p.type === 'special').map((page) => (
              <div key={page.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                      مسار شرعي وتفاعلي
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">/{page.slug}</span>
                  </div>
                  <h3 className="font-bold text-sm text-neutral-900">{page.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {page.contentAr || 'بوابة متقدمة تخضع لضوابط الشريعة الإسلامية ومصادقة الأولياء الشرعيين.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-[11px]">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    مفعّلة ومتصلة
                  </span>
                  <button
                    onClick={() => setEditPage(page)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#9b4c2e] hover:text-white text-neutral-700 font-bold transition cursor-pointer text-xs"
                  >
                    تعديل الوصف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. USER PROFILE LAYOUT (تخطيط صفحة الملف الشخصي) */}
      {/* ======================================================== */}
      {currentSubSection === 'pages_user_profile' && (
        <div className="space-y-6 text-start">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              تصميم وتخطيط الملف الشخصي للعضو (Profile Page Layout)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              تحديد ترتيب وضوابط الأقسام الظاهرة في صفحة السيرة الذاتية لجميع الباحثين، مع حفظ دائم في Firestore.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
              <div className="space-y-0.5">
                <span className="font-bold text-neutral-900 block text-xs">
                  إبراز بطاقة الولي الشرعي في أعلى الملف
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  تأكيد الجدية الشرعية وإتاحة الاتصال المباشر بمجلس الولي أولاً لصون الحرمات.
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageSettings.profileLayout.showWaliCardOnTop}
                onChange={(e) => updateProfileLayout({ showWaliCardOnTop: e.target.checked })}
                className="w-4 h-4 text-[#9b4c2e] accent-[#9b4c2e] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
              <div className="space-y-0.5">
                <span className="font-bold text-neutral-900 block text-xs">
                  عرض السمات الدينية وحفظ القرآن في مقدمة السيرة
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  تقديم الدين والخلق امتثالاً للتوجيه النبوي الشريف: «فاظفَر بذاتِ الدِّينِ تَربَت يداك».
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageSettings.profileLayout.showReligiousTraitsFirst}
                onChange={(e) => updateProfileLayout({ showReligiousTraitsFirst: e.target.checked })}
                className="w-4 h-4 text-[#9b4c2e] accent-[#9b4c2e] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
              <div className="space-y-0.5">
                <span className="font-bold text-neutral-900 block text-xs">
                  زر التقدم لطلب الخطوبة الشرعية (إرسال للولي)
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  يتطلب تعبئة تعهد الباءة وحفظ الأمانة الشرعية قبل تمكين الخاطب من الإرسال.
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageSettings.profileLayout.allowInstantProposalButton}
                onChange={(e) => updateProfileLayout({ allowInstantProposalButton: e.target.checked })}
                className="w-4 h-4 text-[#9b4c2e] accent-[#9b4c2e] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
              <div className="space-y-0.5">
                <span className="font-bold text-neutral-900 block text-xs">
                  شارة التحقق من عادة المحافظة على الصلاة (Prayer Habit Badge)
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  إبراز مؤشر الالتزام بالصلوات الخمس في جماعة على رأس بطاقة السيرة.
                </span>
              </div>
              <input
                type="checkbox"
                checked={pageSettings.profileLayout.showPrayerHabitBadge}
                onChange={(e) => updateProfileLayout({ showPrayerHabitBadge: e.target.checked })}
                className="w-4 h-4 text-[#9b4c2e] accent-[#9b4c2e] rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
              <span className="text-[11px] text-neutral-400">
                يتم حفظ كافة التغييرات فورياً في مستند `site_settings/pages_config`.
              </span>
              <button
                onClick={() => showStatus('تم تأكيد مزامنة إعدادات الملف الشخصي مع Firestore!')}
                className="px-5 py-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ التخطيط في السحابة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. USER DASHBOARD WIDGETS (تخطيط لوحة تحكم العضو) */}
      {/* ======================================================== */}
      {currentSubSection === 'pages_user_dashboard' && (
        <div className="space-y-6 text-start">
          <div className="border-b border-neutral-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              تخطيط ودجات لوحة تحكم العضو (User Dashboard Widgets)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              تفعيل أو إخفاء الودجات التفاعلية الظاهرة في لوحة تحكم الخاطب أو المرشحة.
            </p>
          </div>

          <div className="space-y-3">
            {pageSettings.dashboardWidgets.map((w) => (
              <div key={w.id} className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${w.enabled ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">{w.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">id: {w.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleWidget(w.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    w.enabled 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${w.enabled ? 'opacity-100' : 'opacity-20'}`} />
                  <span>{w.enabled ? 'مفعّلة وتظهر للعضو' : 'معطلة ومخفية'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW PAGE */}
      {/* ======================================================== */}
      {isAddPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 text-start shadow-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#9b4c2e]" />
                إضافة صفحة جديدة إلى قاعدة البيانات
              </h3>
              <button onClick={() => setIsAddPageModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">عنوان الصفحة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: آداب الرؤية الشرعية والمصاهرة"
                  value={newPageForm.title}
                  onChange={(e) => setNewPageForm({ ...newPageForm, title: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">الرابط الإنجليزي (Slug)</label>
                <input
                  type="text"
                  required
                  placeholder="adab-alruyah"
                  value={newPageForm.slug}
                  onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-neutral-900 text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">نوع الصفحة</label>
                  <select
                    value={newPageForm.type}
                    onChange={(e) => setNewPageForm({ ...newPageForm, type: e.target.value as any })}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900"
                  >
                    <option value="standard">صفحة ثابتة (معلومات / ضوابط)</option>
                    <option value="special">مسار خاص (بوابة / خدمة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">الحالة</label>
                  <select
                    value={newPageForm.status}
                    onChange={(e) => setNewPageForm({ ...newPageForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900"
                  >
                    <option value="published">منشورة</option>
                    <option value="draft">مسودة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">محتوى الصفحة</label>
                <textarea
                  rows={4}
                  placeholder="أدخل النص والمحتوى التوجيهي أو الشرعي لهذه الصفحة..."
                  value={newPageForm.contentAr}
                  onChange={(e) => setNewPageForm({ ...newPageForm, contentAr: e.target.value })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 font-sans leading-relaxed text-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ ونشر في السحابة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT PAGE IN FIRESTORE */}
      {/* ======================================================== */}
      {editPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 text-start shadow-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#9b4c2e]" />
                تحرير الصفحة في Firestore: {editPage.title}
              </h3>
              <button onClick={() => setEditPage(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">عنوان الصفحة</label>
                <input
                  type="text"
                  required
                  value={editPage.title}
                  onChange={(e) => setEditPage({ ...editPage, title: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">الرابط المرجعي (Slug)</label>
                  <input
                    type="text"
                    required
                    value={editPage.slug}
                    onChange={(e) => setEditPage({ ...editPage, slug: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-[11px] text-left"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">حالة النشر</label>
                  <select
                    value={editPage.status}
                    onChange={(e) => setEditPage({ ...editPage, status: e.target.value as any })}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 font-bold"
                  >
                    <option value="published">منشورة ومعتمدة للزوار</option>
                    <option value="draft">مسودة (حجب مؤقت)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">المحتوى الشرعي / النصي للصفحة</label>
                <textarea
                  rows={6}
                  value={editPage.contentAr || ''}
                  onChange={(e) => setEditPage({ ...editPage, contentAr: e.target.value })}
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 font-sans leading-relaxed text-neutral-900"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <span className="text-[10px] text-neutral-400 font-mono">
                  doc: site_pages/{editPage.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditPage(null)}
                    className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'جارٍ الحفظ...' : 'تحديث في Firestore'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PREVIEW PAGE */}
      {/* ======================================================== */}
      {previewPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-start shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  معاينة حية للمحتوى في المنصة
                </span>
                <h2 className="text-xl font-extrabold text-neutral-900 mt-1">{previewPage.title}</h2>
                <span className="text-xs font-mono text-neutral-400">/{previewPage.slug}</span>
              </div>
              <button onClick={() => setPreviewPage(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="prose prose-neutral max-w-none text-xs sm:text-sm leading-relaxed text-neutral-800 bg-neutral-50/60 p-6 rounded-2xl border border-neutral-200">
              <p className="whitespace-pre-line">{previewPage.contentAr || 'لا يوجد محتوى مسجل لهذه الصفحة حالياً.'}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs">
              <span className="text-neutral-400">
                المسؤول: {previewPage.author} • آخر مراجعة: {previewPage.lastUpdated}
              </span>
              <button
                onClick={() => setPreviewPage(null)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold cursor-pointer"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
