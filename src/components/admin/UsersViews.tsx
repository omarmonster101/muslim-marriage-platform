import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Plus, 
  Edit, 
  Mail, 
  Send, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Ban, 
  Sparkles,
  Phone,
  Check,
  X
} from 'lucide-react';
import { Profile, WaliVerificationRecord, PhotoPermissionRequest } from '../../types';
import { 
  ProfileQuestion, 
  ModeratorUser, 
  UserRoleDefinition, 
  INITIAL_QUESTIONS, 
  INITIAL_MODERATORS, 
  INITIAL_ROLES, 
  INITIAL_RESTRICTED_WORDS 
} from '../../data/adminSettingsData';
import { UserRolesView } from './UserRolesView';
export { UserRolesView };

// -------------------------------------------------------------
// 1. BROWSE USERS VIEW
// -------------------------------------------------------------
interface BrowseUsersProps {
  profiles: Profile[];
  onUpdateStatus: (id: string, status: 'approved' | 'suspended' | 'pending_review', isVerified?: boolean) => void;
  onDeleteProfile: (id: string, name: string) => void;
  onViewProfileDetails: (profile: Profile) => void;
  onTogglePhotoBlur?: (profileId: string, isBlurred: boolean) => void;
  photoRequests?: PhotoPermissionRequest[];
  onUpdatePhotoRequestStatus?: (requestId: string, newStatus: 'approved' | 'rejected') => void;
}

export const UsersBrowseView: React.FC<BrowseUsersProps> = ({
  profiles,
  onUpdateStatus,
  onDeleteProfile,
  onViewProfileDetails,
  onTogglePhotoBlur,
  photoRequests = [],
  onUpdatePhotoRequestStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profiles' | 'photo_requests'>('profiles');
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending_review' | 'suspended'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [photoFilter, setPhotoFilter] = useState<'all' | 'blurred' | 'visible'>('all');

  const filtered = profiles.filter(p => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    if (statusFilter !== 'all' && (p.moderationStatus || 'approved') !== statusFilter) return false;
    if (verifiedFilter === 'verified' && !p.isVerified) return false;
    if (verifiedFilter === 'unverified' && p.isVerified) return false;
    if (photoFilter === 'blurred' && !p.isPhotoBlurredByDefault) return false;
    if (photoFilter === 'visible' && p.isPhotoBlurredByDefault) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.fullName.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchJob = p.profession.toLowerCase().includes(q);
      return matchName || matchCity || matchJob;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-cairo">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            إدارة وتدقيق الأعضاء (Browse Users)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            البحث في السير المسجلة، مراجعة وتدقيق بيانات الراغبين بالزواج، مراقبة حشمة الصور، وإدارة طلبات كشف الصور.
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700">
          إجمالي الأعضاء: {profiles.length} • طلبات الصور: {photoRequests.length}
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('profiles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'profiles'
              ? 'bg-[#9b4c2e] text-white shadow-2xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>استعراض وتدقيق الأعضاء ({profiles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('photo_requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'photo_requests'
              ? 'bg-[#9b4c2e] text-white shadow-2xs'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>إدارة طلبات كشف الصور الشرعية ({photoRequests.length})</span>
          {photoRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {photoRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {activeSubTab === 'profiles' ? (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 space-y-3 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث بالاسم، المدينة، المهنة..."
                  className="w-full text-xs ps-8 pe-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
                />
              </div>

              {/* Gender Filter */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="text-xs px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              >
                <option value="all">الجنس: الكل</option>
                <option value="male">رجال / خاطبون</option>
                <option value="female">نساء / مرشحات</option>
              </select>

              {/* Moderation Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              >
                <option value="all">حالة السيرة: الكل</option>
                <option value="approved">معتمدة ومنشورة</option>
                <option value="pending_review">بانتظار تدقيق الإدارة</option>
                <option value="suspended">موقوفة / معلقة</option>
              </select>

              {/* Verification Badge Filter */}
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value as any)}
                className="text-xs px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              >
                <option value="all">التوثيق: الكل</option>
                <option value="verified">موثق بشرعية رسمية</option>
                <option value="unverified">غير موثق بعد</option>
              </select>

              {/* Photo Modesty Filter */}
              <select
                value={photoFilter}
                onChange={(e) => setPhotoFilter(e.target.value as any)}
                className="text-xs px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              >
                <option value="all">حشمة الصورة: الكل</option>
                <option value="blurred">مطموسة بحجاب الستر</option>
                <option value="visible">صورة واضحة</option>
              </select>
            </div>
          </div>

          {/* Profiles Data Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-3 text-start">العضو / السيرة</th>
                    <th className="p-3 text-start">النوع والعمر</th>
                    <th className="p-3 text-start">المدينة والمهنة</th>
                    <th className="p-3 text-start">حشمة الصورة</th>
                    <th className="p-3 text-start">بيانات الولي</th>
                    <th className="p-3 text-start">حالة السيرة</th>
                    <th className="p-3 text-start">التوثيق</th>
                    <th className="p-3 text-end">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filtered.map((p) => {
                    const isApproved = (p.moderationStatus || 'approved') === 'approved';
                    const isSuspended = p.moderationStatus === 'suspended';

                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/70 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.avatarUrl}
                              alt={p.fullName}
                              className={`w-8 h-8 rounded-full object-cover border border-neutral-200 ${
                                p.isPhotoBlurredByDefault ? 'filter blur-xs' : ''
                              }`}
                            />
                            <div>
                              <span className="font-bold text-neutral-900 block">{p.fullName}</span>
                              <span className="text-[10px] text-neutral-400 font-mono">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.gender === 'female' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {p.gender === 'female' ? 'أنثى' : 'ذكر'} • {p.age} سنة
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="font-medium text-neutral-800 block">{p.city}</span>
                          <span className="text-[11px] text-neutral-400">{p.profession}</span>
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => onTogglePhotoBlur && onTogglePhotoBlur(p.id, !p.isPhotoBlurredByDefault)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                              p.isPhotoBlurredByDefault
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                            title="تبديل طمس الصورة للحشمة"
                          >
                            {p.isPhotoBlurredByDefault ? <EyeOff className="w-3 h-3 text-[#9b4c2e]" /> : <Eye className="w-3 h-3 text-neutral-500" />}
                            <span>{p.isPhotoBlurredByDefault ? 'طمس للحشمة' : 'واضحة'}</span>
                          </button>
                        </td>

                        <td className="p-3">
                          {p.wali ? (
                            <div className="leading-tight">
                              <span className="font-bold text-neutral-800 text-[11px] block">{p.wali.name}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">{p.wali.phone}</span>
                            </div>
                          ) : (
                            <span className="text-neutral-400 italic text-[11px]">غير محدد</span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isSuspended
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isApproved ? 'معتمدة' : isSuspended ? 'موقوفة' : 'قيد المراجعة'}
                          </span>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => onUpdateStatus(p.id, p.moderationStatus || 'approved', !p.isVerified)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                              p.isVerified
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                            }`}
                            title="تبديل شارة التوثيق الرسمي"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>{p.isVerified ? 'موثق' : 'غير موثق'}</span>
                          </button>
                        </td>

                        <td className="p-3 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewProfileDetails(p)}
                              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition cursor-pointer"
                              title="عرض وتعديل الملف كاملاً"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isApproved ? (
                              <button
                                onClick={() => onUpdateStatus(p.id, 'suspended', p.isVerified)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                                title="تعليق السيرة"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateStatus(p.id, 'approved', p.isVerified)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                                title="اعتماد السيرة ونشرها"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteProfile(p.id, p.fullName)}
                              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 text-neutral-400 hover:text-rose-600 transition cursor-pointer"
                              title="حذف نهائي"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Photo Requests Management Table */
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs space-y-4 p-4 text-start">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-sm text-neutral-900">سجل طلبات كشف الصور الشرعية لجميع الأعضاء</h3>
            <p className="text-xs text-neutral-500">إشراف الإدارة على طلبات الرؤية المصرح بها والمعلقة والمرفوضة</p>
          </div>

          {photoRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-3 text-start">الخاطب الطالب</th>
                    <th className="p-3 text-start">المرشحة المطلوبة</th>
                    <th className="p-3 text-start">رسالة الطلب</th>
                    <th className="p-3 text-start">التاريخ</th>
                    <th className="p-3 text-start">الحالة</th>
                    <th className="p-3 text-end">إجراء الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {photoRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-neutral-50/70 transition">
                      <td className="p-3">
                        <span className="font-bold text-neutral-900 block">{req.suitorName}</span>
                        <span className="text-[10px] text-neutral-400">{req.suitorCity || 'غير محدد'}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-neutral-900 block">{req.targetProfileName}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">ID: {req.targetProfileId}</span>
                      </td>
                      <td className="p-3 max-w-xs">
                        <p className="line-clamp-2 text-neutral-600">"{req.note}"</p>
                      </td>
                      <td className="p-3 text-neutral-500 font-mono text-[11px]">
                        {new Date(req.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : req.status === 'rejected'
                            ? 'bg-neutral-200 text-neutral-700'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {req.status === 'approved' ? 'موافق عليه' : req.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                        </span>
                      </td>
                      <td className="p-3 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition cursor-pointer"
                              title="اعتماد كشف الصورة"
                            >
                              موافقة
                            </button>
                          )}
                          {req.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] transition cursor-pointer"
                              title="رفض أو سحب الإذن"
                            >
                              {req.status === 'approved' ? 'سحب الإذن' : 'رفض'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400">
              لا توجد طلبات كشف صور مسجلة حتى الآن
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. MODERATORS VIEW
// -------------------------------------------------------------
interface ModeratorsProps {
  walis: WaliVerificationRecord[];
  onVerifyWali: (reqId: string, status: 'verified' | 'rejected', reason?: string) => void;
}

export const UsersModeratorsView: React.FC<ModeratorsProps> = ({ walis, onVerifyWali }) => {
  const [moderators, setModerators] = useState<ModeratorUser[]>(INITIAL_MODERATORS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModName, setNewModName] = useState('');
  const [newModEmail, setNewModEmail] = useState('');
  const [newModRole, setNewModRole] = useState<ModeratorUser['role']>('sharia_supervisor');

  const handleAddModerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModName || !newModEmail) return;
    const newMod: ModeratorUser = {
      id: `mod_${Date.now()}`,
      name: newModName,
      email: newModEmail,
      phone: '+966 50 000 0000',
      role: newModRole,
      assignedQueue: 'all',
      status: 'active',
      lastActive: 'الآن',
      actionsCount: 0
    };
    setModerators([newMod, ...moderators]);
    setIsAddModalOpen(false);
    setNewModName('');
    setNewModEmail('');
  };

  return (
    <div className="space-y-6 font-cairo">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            فريق المشرفين والمدققين الشرعيين (Moderators)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            إدارة المشرفين المعينين لمراجعة صكوك أولياء الأمور، مراقبة غرف المحادثات الشرعية، وفحص البلاغات.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>تعيين مشرف جديد</span>
        </button>
      </div>

      {/* Active Moderators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moderators.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                m.role === 'sharia_supervisor' ? 'bg-emerald-100 text-emerald-800' :
                m.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {m.role === 'sharia_supervisor' ? 'مشرف شرعي معتمد' :
                 m.role === 'super_admin' ? 'مدير نظام' : 'مدقق محتوى'}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">{m.lastActive}</span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-neutral-900">{m.name}</h3>
              <p className="text-xs text-neutral-500 font-mono">{m.email}</p>
            </div>

            <div className="text-[11px] text-neutral-600 border-t border-neutral-100 pt-2 flex justify-between">
              <span>الإجراءات المنفذة:</span>
              <span className="font-bold text-neutral-900">{m.actionsCount} إجراء</span>
            </div>
          </div>
        ))}
      </div>

      {/* Wali Verification Queue directly handled by Moderators */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs space-y-3">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-neutral-900 text-sm">طابور توثيق صكوك أولياء الأمور (Wali Verification Queue)</h2>
            <p className="text-xs text-neutral-500">يتطلب مطابقة صلة القرابة ورقم الهاتف وتوثيق صك الولاية الشرعية.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#fbf1eb] text-[#9b4c2e] font-bold text-xs">
            {walis.filter(w => w.status === 'pending').length} بانتظار التحقق
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
              <tr>
                <th className="p-3 text-start">اسم الولي</th>
                <th className="p-3 text-start">صلة القرابة</th>
                <th className="p-3 text-start">المرشحة (المخطوبة)</th>
                <th className="p-3 text-start">رقم التواصل الموثق</th>
                <th className="p-3 text-start">الحالة</th>
                <th className="p-3 text-end">قرار المشرف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {walis.map((w) => (
                <tr key={w.id} className="hover:bg-neutral-50 transition">
                  <td className="p-3 font-bold text-neutral-900">{w.waliName}</td>
                  <td className="p-3 font-medium text-neutral-700">{w.relation}</td>
                  <td className="p-3 text-neutral-900 font-medium">{w.candidateName}</td>
                  <td className="p-3 font-mono text-[11px] text-neutral-600">{w.waliPhone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      w.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {w.status === 'verified' ? 'معتمد وموثق' : w.status === 'rejected' ? 'مرفوض' : 'بانتظار الفحص'}
                    </span>
                  </td>
                  <td className="p-3 text-end">
                    {w.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onVerifyWali(w.id, 'verified')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>اعتماد</span>
                        </button>
                        <button
                          onClick={() => onVerifyWali(w.id, 'rejected', 'عدم وضوح صك القرابة')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>رفض</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-neutral-400">تم اتخاذ القرار</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Moderator */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-neutral-900">تعيين مشرف أو مدقق شرعي جديد</h3>
            <form onSubmit={handleAddModerator} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={newModName}
                  onChange={(e) => setNewModName(e.target.value)}
                  placeholder="مثال: فضيلة الشيخ د. عبدالله"
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-bold mb-1">البريد الإلكتروني الرسمي</label>
                <input
                  type="email"
                  required
                  value={newModEmail}
                  onChange={(e) => setNewModEmail(e.target.value)}
                  placeholder="mod@meethaq.org"
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-bold mb-1">الدور والصلاحيات</label>
                <select
                  value={newModRole}
                  onChange={(e) => setNewModRole(e.target.value as any)}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                >
                  <option value="sharia_supervisor">مشرف شرعي معتمد (اعتماد أولياء وخطوبات)</option>
                  <option value="moderator">مدقق محتوى وصور</option>
                  <option value="super_admin">مدير نظام كامل الصلاحيات</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold cursor-pointer"
                >
                  حفظ وتعيين
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 3. USER ROLES VIEW
// -------------------------------------------------------------
export const UsersRolesView: React.FC = () => {
  return <UserRolesView />;
};

// -------------------------------------------------------------
// 4. PROFILE QUESTIONS VIEW
// -------------------------------------------------------------
export const UsersQuestionsView: React.FC = () => {
  const [questions, setQuestions] = useState<ProfileQuestion[]>(INITIAL_QUESTIONS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [qText, setQText] = useState('');
  const [qCategory, setQCategory] = useState<ProfileQuestion['category']>('religious');
  const [qRequired, setQRequired] = useState(true);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;
    const newQ: ProfileQuestion = {
      id: `q_${Date.now()}`,
      category: qCategory,
      questionAr: qText.trim(),
      questionEn: qText.trim(),
      type: 'select',
      isRequired: qRequired,
      order: questions.length + 1
    };
    setQuestions([...questions, newQ]);
    setIsAddOpen(false);
    setQText('');
  };

  const handleDeleteQ = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6 font-cairo">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            أسئلة السيرة والخطوبة (Profile Questions)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            الأسئلة الإلزامية والاختيارية التي يجيب عليها الخاطب والمرشحة لتقييم الكفاءة الدينية والاجتماعية.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة سؤال شرعي جديد</span>
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center font-bold text-xs">
                  {q.order}
                </span>
                <span className="font-bold text-xs text-neutral-900">{q.questionAr}</span>
                {q.isRequired ? (
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">إلزامي</span>
                ) : (
                  <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">اختياري</span>
                )}
              </div>
              {q.optionsAr && (
                <p className="text-[11px] text-neutral-500 ps-7">
                  الخيارات: {q.optionsAr.join(' • ')}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDeleteQ(q.id)}
              className="p-1.5 text-neutral-400 hover:text-rose-600 transition cursor-pointer"
              title="حذف السؤال"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-neutral-900">إضافة سؤال جديد لاستمارة الخطوبة</h3>
            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">نص السؤال بالعربية</label>
                <input
                  type="text"
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="مثال: هل تدخن؟ أو طبيعة عملك؟"
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-bold mb-1">التصنيف</label>
                <select
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
                >
                  <option value="religious">ديني وشرعي</option>
                  <option value="matrimonial">أهداف الزواج والأسرة</option>
                  <option value="personal">سمات شخصية</option>
                  <option value="family">عائلي واجتماعي</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="req_check"
                  checked={qRequired}
                  onChange={(e) => setQRequired(e.target.checked)}
                  className="rounded text-[#9b4c2e]"
                />
                <label htmlFor="req_check" className="text-neutral-800 font-bold">هذا السؤال إلزامي لإكمال التسجيل</label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold cursor-pointer"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 5. RESTRICTED USERNAMES VIEW
// -------------------------------------------------------------
export const UsersRestrictedView: React.FC = () => {
  const [restrictedWords, setRestrictedWords] = useState<string[]>(INITIAL_RESTRICTED_WORDS);
  const [newWord, setNewWord] = useState('');

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    const clean = newWord.trim().toLowerCase();
    if (!restrictedWords.includes(clean)) {
      setRestrictedWords([...restrictedWords, clean]);
    }
    setNewWord('');
  };

  const handleRemoveWord = (word: string) => {
    setRestrictedWords(restrictedWords.filter(w => w !== word));
  };

  return (
    <div className="space-y-6 font-cairo">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          الأسماء والكلمات المحظورة (Restricted Usernames & Words)
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          قائمة الكلمات الممنوع استخدامها كأسماء مستخدمين (مثل الصفات الإدارية، أرقام الهواتف، والتعبيرات غير اللائقة).
        </p>
      </div>

      {/* Add new restricted word form */}
      <form onSubmit={handleAddWord} className="flex gap-2">
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="أدخل كلمة أو اسم مستخدم لحظره..."
          className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>حظر الكلمة</span>
        </button>
      </form>

      {/* List of restricted words pills */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
        <span className="text-xs font-bold text-neutral-500 block">
          الكلمات المحظورة حالياً ({restrictedWords.length}):
        </span>
        <div className="flex flex-wrap gap-2">
          {restrictedWords.map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-medium"
            >
              <span>{word}</span>
              <button
                type="button"
                onClick={() => handleRemoveWord(word)}
                className="hover:text-rose-900 cursor-pointer"
                title="إلغاء الحظر"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. MASS MAILING VIEW
// -------------------------------------------------------------
export const UsersMailingView: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'walis' | 'unverified' | 'active_proposals'>('all');
  const [channel, setChannel] = useState<'email' | 'sms' | 'in_app'>('email');
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
    setSubject('');
    setBody('');
  };

  return (
    <div className="space-y-6 font-cairo">
      <div className="border-b border-neutral-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          المراسلات والتنبيهات الجماعية (Mass Mailing)
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          إرسال رسائل بريدية، رسائل نصية SMS، أو إشعارات عامة لكافة أولياء الأمور أو الأعضاء المسجلين.
        </p>
      </div>

      {isSent && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم جدولة الرسالة الجماعية وإرسالها بنجاح إلى الجمهور المستهدف!</span>
        </div>
      )}

      <form onSubmit={handleSend} className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-2xs text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-bold mb-1.5">الجمهور المستهدف</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
            >
              <option value="all">كافة الأعضاء المسجلين (14,850)</option>
              <option value="walis">أولياء الأمور الموثقون فقط (6,240)</option>
              <option value="unverified">الأعضاء غير المكتملي التوثيق</option>
              <option value="active_proposals">أصحاب طلبات الخطوبة الجارية</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1.5">قناة الإرسال</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
            >
              <option value="email">بريد إلكتروني رسمي (Email)</option>
              <option value="sms">رسالة هاتفية موثقة (SMS)</option>
              <option value="in_app">إشعار فوري داخل المنصة (Push Notice)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 font-bold mb-1.5">عنوان الرسالة / الموضوع</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="مثال: تنبيه هام حول تحديث ضوابط الرؤية الشرعية"
            className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200"
          />
        </div>

        <div>
          <label className="block text-neutral-700 font-bold mb-1.5">محتوى الرسالة</label>
          <textarea
            required
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="اكتب نص الرسالة هنا مع التذكير بالآداب الإسلامية وحفظ الأمانة..."
            className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 leading-relaxed font-sans"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>إرسال الحملة الجماعية الآن</span>
        </button>
      </form>
    </div>
  );
};
