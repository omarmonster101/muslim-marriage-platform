import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  AdminOverviewStats, 
  Profile, 
  Proposal, 
  WaliVerificationRecord, 
  FlaggedMessage, 
  AuditLogItem,
  PhotoPermissionRequest
} from '../types';
import { 
  subscribeToFirestoreLiveMetrics, 
  FirestoreLiveMetrics, 
  testFirestoreConnection,
  firebaseConfig,
  saveProfileToDb
} from '../lib/firebase';

import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar, AdminSectionKey } from './admin/AdminSidebar';
import { DashboardMainView, DashboardFinanceView } from './admin/DashboardViews';
import { 
  UsersBrowseView, 
  UsersModeratorsView, 
  UsersRolesView, 
  UserRolesView,
  UsersQuestionsView, 
  UsersRestrictedView, 
  UsersMailingView 
} from './admin/UsersViews';
import { 
  ConsoleLogsView, 
  ConsoleTriggersView, 
  ConsoleAgentStatsView, 
  ConsoleAgentsView, 
  ConsoleAiView 
} from './admin/ConsoleViews';
import { SettingsViews } from './admin/SettingsViews';
import { PagesViews } from './admin/PagesViews';
import { PluginsViews } from './admin/PluginsViews';
import { INITIAL_PLUGINS_LIST } from '../data/adminPluginsData';
import { Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  onReturnToSite: () => void;
  onRefreshGlobalData?: () => void;
  photoRequests?: PhotoPermissionRequest[];
  onUpdatePhotoRequestStatus?: (requestId: string, newStatus: 'approved' | 'rejected') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({
  onReturnToSite,
  onRefreshGlobalData,
  photoRequests: initialPhotoRequests,
  onUpdatePhotoRequestStatus: propUpdatePhotoRequestStatus
}) => {
  // Navigation State
  const [currentSection, setCurrentSection] = useState<AdminSectionKey>('dashboard_main');

  // Backend Data State
  const [stats, setStats] = useState<AdminOverviewStats>({
    totalUsers: 14850,
    activeProposals: 412,
    verifiedWalisCount: 6240,
    pendingWaliVerifications: 3,
    pendingProfileReviews: 2,
    concludedNikahs: 2890,
    flaggedChatsCount: 0,
    systemHealth: '100% Sharia Certified'
  });

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [walis, setWalis] = useState<WaliVerificationRecord[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Photo Requests Management State for Admin
  const [localPhotoRequests, setLocalPhotoRequests] = useState<PhotoPermissionRequest[]>(() => {
    if (initialPhotoRequests && initialPhotoRequests.length > 0) return initialPhotoRequests;
    return [
      {
        id: 'req-demo-1',
        suitorId: 'prof-1',
        suitorName: 'عبدالله بن فهد الشمري',
        suitorAge: 29,
        suitorCity: 'الرياض',
        suitorJob: 'مهندس برمجيات ونظم سحابية',
        targetProfileId: 'prof-2',
        targetProfileName: 'سارة بنت أحمد الخالدي',
        message: 'السلام عليكم ورحمة الله، أود التقدم بطلب الرؤية الشرعية والصورة بإشراف الولي الكريم بعد مراجعة السيرة والتوافق القيمي.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'req-demo-2',
        suitorId: 'prof-3',
        suitorName: 'عمر بن خالد الدوسري',
        suitorAge: 31,
        suitorCity: 'الدمام',
        suitorJob: 'طبيب استشاري باطنية',
        targetProfileId: 'prof-4',
        targetProfileName: 'مريم بنت سعيد الغامدي',
        message: 'طلب استئذان شرعي للاطلاع على صورة الكريمة بعد التواصل مع الولي.',
        status: 'approved',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
  });

  // Keep synchronized if prop updates
  useEffect(() => {
    if (initialPhotoRequests) {
      setLocalPhotoRequests(initialPhotoRequests);
    }
  }, [initialPhotoRequests]);

  // Live Firestore State
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(true);
  const [firestoreMetrics, setFirestoreMetrics] = useState<FirestoreLiveMetrics>({
    totalNewUsers: 34,
    newUsersToday: 6,
    newUsersThisWeek: 34,
    newUsersGrowthRate: '+18.4%',
    newUsersMale: 18,
    newUsersFemale: 16,
    pendingRequestsTotal: 5,
    pendingProposalsCount: 2,
    pendingWalisCount: 2,
    pendingProfilesCount: 1,
    dailyActivityRate: 84.6,
    activeUsers24h: 380,
    dailyInteractionsCount: 42,
    activityLevel: 'exceptional',
    isLive: true,
    lastSyncTimestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    databaseId: firebaseConfig.firestoreDatabaseId
  });

  // Selected Profile for detailed view modal
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [adminForceUnblurPreview, setAdminForceUnblurPreview] = useState(false);

  // Confetti helper
  const fireCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4500);
  };

  // Fetch all admin data from backend
  const fetchAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [
        overviewRes,
        profilesRes,
        walisRes,
        proposalsRes,
        flagsRes,
        auditRes
      ] = await Promise.all([
        fetch('/api/admin/overview-stats').catch(() => null),
        fetch('/api/admin/profiles').catch(() => null),
        fetch('/api/admin/walis').catch(() => null),
        fetch('/api/admin/proposals').catch(() => null),
        fetch('/api/admin/flagged-messages').catch(() => null),
        fetch('/api/admin/audit-logs').catch(() => null)
      ]);

      if (overviewRes && overviewRes.ok) {
        const d = await overviewRes.json();
        if (d.success && d.stats) setStats(d.stats);
      }
      if (profilesRes && profilesRes.ok) {
        const d = await profilesRes.json();
        if (d.success && Array.isArray(d.profiles)) setProfiles(d.profiles);
      }
      if (walisRes && walisRes.ok) {
        const d = await walisRes.json();
        if (d.success && Array.isArray(d.walis)) setWalis(d.walis);
      }
      if (proposalsRes && proposalsRes.ok) {
        const d = await proposalsRes.json();
        if (d.success && Array.isArray(d.proposals)) setProposals(d.proposals);
      }
      if (flagsRes && flagsRes.ok) {
        const d = await flagsRes.json();
        if (d.success && Array.isArray(d.flags)) setFlaggedMessages(d.flags);
      }
      if (auditRes && auditRes.ok) {
        const d = await auditRes.json();
        if (d.success && Array.isArray(d.logs)) setAuditLogs(d.logs);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();

    // Check Firestore connection status
    testFirestoreConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });

    // Subscribe to live Firestore metrics (real-time onSnapshot)
    const unsubscribeLiveMetrics = subscribeToFirestoreLiveMetrics((metrics) => {
      setFirestoreMetrics(metrics);
      setIsFirestoreConnected(true);
    });

    return () => {
      unsubscribeLiveMetrics();
    };
  }, []);

  // Profile Actions
  const handleUpdateProfileStatus = async (
    profileId: string, 
    moderationStatus: 'approved' | 'suspended' | 'pending_review',
    isVerified?: boolean
  ) => {
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moderationStatus, isVerified })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, moderationStatus, ...(isVerified !== undefined ? { isVerified } : {}) } : p));
        fetchAllAdminData();
        if (onRefreshGlobalData) onRefreshGlobalData();
      }
    } catch (e) {
      showToast('تعذر تحديث حالة السيرة الذاتية', 'error');
    }
  };

  const handleDeleteProfile = async (profileId: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف السيرة الذاتية لـ (${name}) نهائياً؟`)) return;
    try {
      const res = await fetch(`/api/admin/profiles/${profileId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setProfiles(prev => prev.filter(p => p.id !== profileId));
        fetchAllAdminData();
        if (onRefreshGlobalData) onRefreshGlobalData();
      }
    } catch (e) {
      showToast('تعذر حذف السيرة الذاتية', 'error');
    }
  };

  // Toggle Photo Blur Modesty Controls (Admin level control)
  const handleTogglePhotoBlur = async (profileId: string, isBlurred: boolean) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        const updated: Profile = {
          ...p,
          isPhotoBlurredByDefault: isBlurred,
          privacySettings: {
            profileVisibility: p.privacySettings?.profileVisibility || 'verified_only',
            showOnlineStatus: p.privacySettings?.showOnlineStatus ?? true,
            showLastSeen: p.privacySettings?.showLastSeen ?? true,
            allowMessages: p.privacySettings?.allowMessages || 'accepted_requests_only',
            allowMarriageRequests: p.privacySettings?.allowMarriageRequests || 'verified_only',
            searchVisibility: p.privacySettings?.searchVisibility ?? true,
            blurPhotosByDefault: isBlurred
          }
        };
        saveProfileToDb(updated);
        return updated;
      }
      return p;
    }));

    if (viewingProfile && viewingProfile.id === profileId) {
      setViewingProfile(prev => prev ? {
        ...prev,
        isPhotoBlurredByDefault: isBlurred,
        privacySettings: {
          profileVisibility: prev.privacySettings?.profileVisibility || 'verified_only',
          showOnlineStatus: prev.privacySettings?.showOnlineStatus ?? true,
          showLastSeen: prev.privacySettings?.showLastSeen ?? true,
          allowMessages: prev.privacySettings?.allowMessages || 'accepted_requests_only',
          allowMarriageRequests: prev.privacySettings?.allowMarriageRequests || 'verified_only',
          searchVisibility: prev.privacySettings?.searchVisibility ?? true,
          blurPhotosByDefault: isBlurred
        }
      } : null);
    }

    showToast(isBlurred ? 'تم تفعيل طمس وستر الصورة بنجاح' : 'تم إلغاء طمس الصورة بنجاح');
    if (onRefreshGlobalData) onRefreshGlobalData();
  };

  // Update Photo Permission Request Status (Admin oversight)
  const handleUpdatePhotoRequestStatus = (requestId: string, newStatus: 'approved' | 'rejected') => {
    setLocalPhotoRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus, reviewedAt: new Date().toISOString() } : r));
    if (propUpdatePhotoRequestStatus) {
      propUpdatePhotoRequestStatus(requestId, newStatus);
    }
    showToast(newStatus === 'approved' ? 'تمت الموافقة على طلب كشف الصورة الشرعية بنجاح' : 'تم رفض طلب كشف الصورة');
  };

  // Wali Actions
  const handleVerifyWali = async (reqId: string, status: 'verified' | 'rejected', reason?: string) => {
    try {
      const res = await fetch(`/api/admin/walis/${reqId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        if (status === 'verified') fireCelebrationConfetti();
        fetchAllAdminData();
        if (onRefreshGlobalData) onRefreshGlobalData();
      }
    } catch (e) {
      showToast('تعذر إتمام الإجراء على الولي الشرعي', 'error');
    }
  };

  // Flagged Chat Actions
  const handleFlagAction = async (flagId: string, action: 'dismissed' | 'warned' | 'blocked') => {
    try {
      const res = await fetch(`/api/admin/flagged-messages/${flagId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('تعذر معالجة البلاغ الشرعي', 'error');
    }
  };

  // Run System Audit
  const handleRunSystemAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/system/audit-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fireCelebrationConfetti();
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('فشل تشغيل فحص النزاهة', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Export JSON Report
  const handleExportReport = () => {
    const reportData = {
      exportTimestamp: new Date().toISOString(),
      platform: 'منصة ميثاق للزواج الإسلامي الشرعي',
      stats,
      profilesCount: profiles.length,
      walisCount: walis.length,
      proposalsCount: proposals.length,
      flaggedMessages,
      recentAuditLogs: auditLogs.slice(0, 30)
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meethaq-admin-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('تم تصدير تقرير المنصة بنجاح!');
  };

  // Human readable title of active section
  const sectionTitles: Record<AdminSectionKey, string> = {
    dashboard_main: 'لوحة المؤشرات العامة والإحصائيات الحية',
    dashboard_finance: 'المالية وتفاصيل المهور والصداق',
    users_browse: 'استعراض وتدقيق حسابات الأعضاء',
    users_moderators: 'إدارة وتوثيق الأولياء والمشرفين',
    users_roles: 'أدوار وصلاحيات الأعضاء والإدارة',
    users_questions: 'أسئلة السيرة والخطوبة الشرعية',
    users_restricted: 'الأسماء والكلمات المحظورة',
    users_mailing: 'المراسلات والتعاميم الجماعية',
    console_log: 'سجل العمليات والمراقبة الشرعية للمحادثات',
    console_triggers: 'قواعد رسائل التنبيه',
    console_agent_stats: 'إحصائيات الذكاء الاصطناعي',
    console_agents: 'الوكلاء والمستشارون',
    console_ai: 'إعدادات وتوجيهات الذكاء الاصطناعي',
    settings_general: 'الإعدادات العامة للمنصة',
    settings_users: 'ضوابط تسجيل الأعضاء وحساباتهم',
    settings_content: 'ضوابط المحتوى والحشمة وصور الحسابات',
    settings_pages: 'تخطيط وعناصر الصفحات',
    settings_countries: 'البلاد والمدن والمناطق الجغرافية',
    settings_language: 'إدارة اللغات والترجمة الفورية',
    settings_smtp: 'إعدادات خادم البريد (SMTP)',
    settings_seo: 'تهيئة محركات البحث (SEO)',
    settings_appearance: 'المظهر والثيمات وتخصيص الألوان',
    pages_manage: 'إدارة الصفحات الثابتة والمحتوى',
    pages_special: 'الصفحات الخاصة',
    pages_user_profile: 'تخطيط صفحة السيرة الذاتية',
    pages_user_dashboard: 'تخطيط لوحة تحكم العضو',
    plugins_installed: 'الإضافات والملحقات المثبتة',
    plugins_available: 'الإضافات المتاحة للتفعيل',
    plugins_add_new: 'تثبيت إضافة جديدة'
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-neutral-900 overflow-hidden font-cairo" dir="rtl">
      {/* 1. Sidebar */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        pendingWalisCount={walis.filter(w => w.status === 'pending').length}
        pendingProfilesCount={profiles.filter(p => p.moderationStatus === 'pending_review').length}
        flaggedChatsCount={flaggedMessages.length}
        activePluginsCount={INITIAL_PLUGINS_LIST.filter(p => p.status === 'active').length}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          onReturnToSite={onReturnToSite}
          onRefreshData={fetchAllAdminData}
          isLoading={isLoading}
          activeItemTitle={sectionTitles[currentSection] || currentSection}
          pendingWalisCount={walis.filter(w => w.status === 'pending').length}
          flaggedChatsCount={flaggedMessages.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className={`mx-6 mt-4 p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between shadow-2xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="font-mono text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Scrollable Main Views Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard section */}
            {currentSection === 'dashboard_main' && (
              <DashboardMainView
                stats={stats}
                profiles={profiles}
                walis={walis}
                proposals={proposals}
                firestoreMetrics={firestoreMetrics}
                isFirestoreConnected={isFirestoreConnected}
                onRefreshFirestore={() => {
                  fetchAllAdminData();
                  showToast('تمت إعادة مزامنة بيانات Firestore الحية بنجاح');
                }}
                onRunAudit={handleRunSystemAudit}
                onExportReport={handleExportReport}
                isLoading={isLoading}
                onNavigateToSection={(sec) => setCurrentSection(sec)}
              />
            )}

            {currentSection === 'dashboard_finance' && (
              <DashboardFinanceView />
            )}

            {/* Users section */}
            {currentSection === 'users_browse' && (
              <UsersBrowseView
                profiles={profiles}
                onUpdateStatus={handleUpdateProfileStatus}
                onDeleteProfile={handleDeleteProfile}
                onViewProfileDetails={(p) => {
                  setViewingProfile(p);
                  setAdminForceUnblurPreview(false);
                }}
                onTogglePhotoBlur={handleTogglePhotoBlur}
                photoRequests={localPhotoRequests}
                onUpdatePhotoRequestStatus={handleUpdatePhotoRequestStatus}
              />
            )}

            {currentSection === 'users_moderators' && (
              <UsersModeratorsView
                walis={walis}
                onVerifyWali={handleVerifyWali}
              />
            )}

            {currentSection === 'users_roles' && (
              <UserRolesView 
                onRoleChanged={(user, oldRole, newRole) => {
                  showToast(`تم تحديث دور ${user.name} بنجاح`);
                  if (onRefreshGlobalData) onRefreshGlobalData();
                }}
              />
            )}

            {currentSection === 'users_questions' && (
              <UsersQuestionsView />
            )}

            {currentSection === 'users_restricted' && (
              <UsersRestrictedView />
            )}

            {currentSection === 'users_mailing' && (
              <UsersMailingView />
            )}

            {/* Console section */}
            {currentSection === 'console_log' && (
              <ConsoleLogsView
                logs={auditLogs}
                flaggedMessages={flaggedMessages}
                onFlagAction={handleFlagAction}
              />
            )}

            {currentSection === 'console_triggers' && (
              <ConsoleTriggersView />
            )}

            {currentSection === 'console_agent_stats' && (
              <ConsoleAgentStatsView />
            )}

            {currentSection === 'console_agents' && (
              <ConsoleAgentsView />
            )}

            {currentSection === 'console_ai' && (
              <ConsoleAiView />
            )}

            {/* Settings section */}
            {(currentSection.startsWith('settings_')) && (
              <SettingsViews currentSubSection={currentSection} />
            )}

            {/* Pages section */}
            {(currentSection.startsWith('pages_')) && (
              <PagesViews currentSubSection={currentSection} />
            )}

            {/* Plugins section */}
            {(currentSection.startsWith('plugins_')) && (
              <PluginsViews currentSubSection={currentSection} />
            )}
          </div>
        </main>
      </div>

      {/* Profile Details Modal for Admin Inspection */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={viewingProfile.avatarUrl}
                  alt={viewingProfile.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-neutral-900">{viewingProfile.fullName}</h3>
                  <p className="text-xs text-neutral-500">
                    {viewingProfile.gender === 'female' ? 'مرشحة' : 'خاطب'} • {viewingProfile.age} سنة • {viewingProfile.city}, {viewingProfile.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingProfile(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Photo & Modesty Admin Controls */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-[#9b4c2e] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#9b4c2e]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      ضوابط الحشمة وستر الصورة الشرعية (إشراف الإدارة)
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      {viewingProfile.gender === 'female' ? 'حساب أخت مصونة' : 'حساب خاطب مسجل'} • {viewingProfile.isPhotoBlurredByDefault ? 'الصورة مطموسة افتراضياً' : 'الصورة واضحة غير مطموسة'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminForceUnblurPreview(!adminForceUnblurPreview)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-[11px] font-bold text-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {adminForceUnblurPreview ? <EyeOff className="w-3.5 h-3.5 text-neutral-600" /> : <Eye className="w-3.5 h-3.5 text-[#9b4c2e]" />}
                    <span>{adminForceUnblurPreview ? 'إعادة التمويه' : 'معاينة إدارية بدون طمس'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePhotoBlur(viewingProfile.id, !viewingProfile.isPhotoBlurredByDefault)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      viewingProfile.isPhotoBlurredByDefault
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#9b4c2e] hover:bg-[#853e24] text-white'
                    }`}
                  >
                    {viewingProfile.isPhotoBlurredByDefault ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>إلغاء طمس الصورة</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>طمس الصورة إجبارياً للحشمة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Photo Preview Canvas */}
              <div className="relative w-full max-w-xs mx-auto aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-300 bg-neutral-100 shadow-inner">
                <img
                  src={viewingProfile.avatarUrl}
                  alt={viewingProfile.fullName}
                  className={`w-full h-full object-cover transition duration-300 ${
                    viewingProfile.isPhotoBlurredByDefault && !adminForceUnblurPreview ? 'filter blur-xl scale-110' : 'filter-none'
                  }`}
                />
                {viewingProfile.isPhotoBlurredByDefault && !adminForceUnblurPreview && (
                  <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center text-white space-y-1">
                    <EyeOff className="w-6 h-6 text-white/90" />
                    <span className="text-xs font-bold font-cairo">الصورة مطموسة التزاماً بالحشمة</span>
                    <span className="text-[10px] text-white/80">تتطلب إذناً شرعياً أو موافقة الولي</span>
                  </div>
                )}
                {adminForceUnblurPreview && (
                  <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>معاينة إدارية مباشرة</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <span className="font-bold text-neutral-400 block text-[10px]">الالتزام الديني والسمت:</span>
                <p className="font-bold text-neutral-800">الصلاة: {viewingProfile.prayerHabit}</p>
                <p className="text-neutral-600">القرآن: {viewingProfile.quranMemorization}</p>
                <p className="text-neutral-600">المظهر: {viewingProfile.religiousAttire}</p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                <span className="font-bold text-neutral-400 block text-[10px]">بيانات الولي الشرعي:</span>
                {viewingProfile.wali ? (
                  <>
                    <p className="font-bold text-neutral-800">{viewingProfile.wali.name} ({viewingProfile.wali.relation})</p>
                    <p className="text-neutral-600 font-mono">الهاتف: {viewingProfile.wali.phone}</p>
                    <p className="text-[11px] text-emerald-700 font-bold">الحالة: {viewingProfile.wali.isVerified ? 'موثق' : 'بانتظار التحقق'}</p>
                  </>
                ) : (
                  <p className="text-neutral-400 italic">لا توجد بيانات ولي مسجلة</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2">
              <span className="font-bold text-neutral-400 block text-[10px]">نبذة عن النفس والتطلعات:</span>
              <p className="text-neutral-800 leading-relaxed font-sans">{viewingProfile.aboutMe}</p>
              <div className="pt-2 border-t border-neutral-200/60 text-neutral-700">
                <strong className="text-neutral-900">المواصفات المطلوبة: </strong>
                {viewingProfile.partnerExpectations}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                viewingProfile.moderationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                الحالة: {viewingProfile.moderationStatus === 'approved' ? 'معتمدة ومنشورة' : 'قيد المراجعة'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleUpdateProfileStatus(viewingProfile.id, 'approved', true);
                    setViewingProfile(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  اعتماد وتوثيق فوري
                </button>
                <button
                  onClick={() => setViewingProfile(null)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
