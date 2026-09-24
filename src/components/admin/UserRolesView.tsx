import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Lock, 
  Key, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  SlidersHorizontal, 
  Sparkles, 
  Eye, 
  RefreshCw, 
  Download,
  Info
} from 'lucide-react';
import { ManagedUserItem, PlatformRole } from '../../types';
import { INITIAL_MANAGED_USERS, ROLE_DEFINITIONS, RoleInfo } from '../../data/adminUsersData';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, fetchRealUsersFromDb, saveAdminUserRoleToDb } from '../../lib/firebase';

interface UserRolesViewProps {
  onRoleChanged?: (user: ManagedUserItem, oldRole: PlatformRole, newRole: PlatformRole) => void;
}

export const UserRolesView: React.FC<UserRolesViewProps> = ({ onRoleChanged }) => {
  // State: Users list
  const [users, setUsers] = useState<ManagedUserItem[]>(INITIAL_MANAGED_USERS);
  const [isLoadingRealUsers, setIsLoadingRealUsers] = useState(false);

  // Load real users from Cloud Firestore
  const loadRealUsers = async () => {
    setIsLoadingRealUsers(true);
    try {
      const realUsers = await fetchRealUsersFromDb();
      if (realUsers && realUsers.length > 0) {
        // Merge so superadmin hhhosts is guaranteed present
        setUsers(prev => {
          const remoteIds = new Set(realUsers.map(u => u.id));
          const localOnly = prev.filter(u => !remoteIds.has(u.id));
          return [...realUsers, ...localOnly];
        });
      }
    } catch (e) {
      console.warn('Real users load fallback:', e);
    } finally {
      setIsLoadingRealUsers(false);
    }
  };

  useEffect(() => {
    loadRealUsers();
  }, []);

  // State: Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | PlatformRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_verification' | 'suspended' | 'banned'>('all');

  // State: View Tab (Users Table vs Permissions Matrix)
  const [activeTab, setActiveTab] = useState<'users_table' | 'permissions_matrix'>('users_table');

  // State: Change Role Modal
  const [selectedUserForRole, setSelectedUserForRole] = useState<ManagedUserItem | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<PlatformRole>('user');
  const [changeRoleReason, setChangeRoleReason] = useState('');
  const [notifyUserByEmail, setNotifyUserByEmail] = useState(true);
  const [isSavingRole, setIsSavingRole] = useState(false);

  // State: Change Status Modal
  const [selectedUserForStatus, setSelectedUserForStatus] = useState<ManagedUserItem | null>(null);
  const [newStatus, setNewStatus] = useState<'active' | 'pending_verification' | 'suspended' | 'banned'>('active');

  // State: Add New User Modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCity, setNewUserCity] = useState('الرياض');
  const [newUserRole, setNewUserRole] = useState<PlatformRole>('user');
  const [newUserReason, setNewUserReason] = useState('');

  // Toast / Alert banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchPhone = (u.phone || '').toLowerCase().includes(q);
        const matchCity = (u.city || '').toLowerCase().includes(q);
        const matchReason = (u.roleReason || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone || matchCity || matchReason;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = users.length;
    const regulars = users.filter(u => u.role === 'user').length;
    const walis = users.filter(u => u.role === 'wali').length;
    const moderators = users.filter(u => u.role === 'moderator').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const pendingVerifications = users.filter(u => u.status === 'pending_verification').length;
    return { total, regulars, walis, moderators, admins, pendingVerifications };
  }, [users]);

  // Handle Opening Role Change Modal
  const handleOpenRoleModal = (user: ManagedUserItem) => {
    setSelectedUserForRole(user);
    setNewSelectedRole(user.role);
    setChangeRoleReason('');
    setNotifyUserByEmail(true);
  };

  // Submit Role Change
  const handleConfirmRoleChange = async () => {
    if (!selectedUserForRole) return;
    setIsSavingRole(true);

    const oldRole = selectedUserForRole.role;
    const targetUserId = selectedUserForRole.id;
    const targetUid = selectedUserForRole.uid || selectedUserForRole.id;

    try {
      // Save directly to Firestore via helper
      await saveAdminUserRoleToDb(
        targetUid, 
        newSelectedRole, 
        changeRoleReason || 'تعديل إداري من لوحة التحكم', 
        'الإدارة المركزية'
      );

      // Update local state
      const updatedList = users.map((u) => {
        if (u.id === targetUserId) {
          return {
            ...u,
            role: newSelectedRole,
            roleReason: changeRoleReason || u.roleReason || 'تعديل بواسطة الإدارة',
            assignedBy: 'الإدارة (حمزة الهذلي)'
          };
        }
        return u;
      });

      setUsers(updatedList);
      setIsSavingRole(false);
      setSelectedUserForRole(null);

      // Trigger Confetti
      fireCelebrationConfetti();

      const newRoleLabel = ROLE_DEFINITIONS[newSelectedRole].labelAr;
      showToast(`تم تعيين دور "${newRoleLabel}" للمستخدم ${selectedUserForRole.name} بنجاح.`, 'success');

      if (onRoleChanged) {
        const updatedItem = updatedList.find(u => u.id === targetUserId);
        if (updatedItem) onRoleChanged(updatedItem, oldRole, newSelectedRole);
      }
    } catch (e) {
      setIsSavingRole(false);
      showToast('حدث خطأ أثناء حفظ التعديل، تم التحديث محلياً.', 'info');
    }
  };

  // Submit Status Change
  const handleConfirmStatusChange = async () => {
    if (!selectedUserForStatus) return;
    const targetUserId = selectedUserForStatus.id;

    // Update in Firestore
    try {
      const userRef = doc(db, 'users', selectedUserForStatus.uid || targetUserId);
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch {
      // non-blocking
    }

    setUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        return { ...u, status: newStatus };
      }
      return u;
    }));

    setSelectedUserForStatus(null);
    showToast(`تم تعديل حالة المستخدم إلى: ${getStatusLabel(newStatus)}`, 'success');
  };

  // Quick Status Toggle Helper
  const handleQuickToggleStatus = (user: ManagedUserItem) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u => {
      if (u.id === user.id) {
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    showToast(`تم ${nextStatus === 'active' ? 'تنشيط' : 'تعليق'} حساب: ${user.name}`, 'info');
  };

  // Submit Add User
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: ManagedUserItem = {
      id: `user-manual-${Date.now()}`,
      uid: `uid-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+966 50 000 0000',
      city: newUserCity,
      role: newUserRole,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'الآن (جديد)',
      assignedBy: 'الإدارة المباشرة',
      roleReason: newUserReason.trim() || 'إضافة يدوية وتعيين دور مباشر'
    };

    setUsers([newUser, ...users]);
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserReason('');
    fireCelebrationConfetti();
    showToast(`تمت إضافة المستخدم "${newUser.name}" وتعيين دوره كـ ${ROLE_DEFINITIONS[newUserRole].labelAr}`, 'success');
  };

  // Export Users to CSV
  const handleExportUsers = () => {
    const headers = ['المعرف', 'الاسم', 'البريد الإلكتروني', 'رقم الهاتف', 'الدور', 'الحالة', 'المدينة', 'تاريخ التسجيل', 'سبب التعيين'];
    const rows = users.map(u => [
      u.id,
      u.name,
      u.email,
      u.phone || '',
      ROLE_DEFINITIONS[u.role].labelAr,
      getStatusLabel(u.status),
      u.city || '',
      u.createdAt,
      u.roleReason || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.map(item => `"${item}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meethaq-users-roles-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('تم تصدير ملف مستخدمي المنصة وأدوارهم بنجاح!');
  };

  // Status Badge Helper
  const getStatusBadge = (status: ManagedUserItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            نشط ومفعل
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            بانتظار التوثيق
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-200 text-neutral-800 border border-neutral-300">
            <UserX className="w-3 h-3 text-neutral-600" />
            معلق مؤقتاً
          </span>
        );
      case 'banned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            محظور نهائياً
          </span>
        );
    }
  };

  const getStatusLabel = (status: ManagedUserItem['status']) => {
    switch (status) {
      case 'active': return 'نشط ومفعل';
      case 'pending_verification': return 'بانتظار التوثيق';
      case 'suspended': return 'معلق مؤقتاً';
      case 'banned': return 'محظور';
    }
  };

  return (
    <div className="space-y-6 text-start font-cairo" id="user-roles-management-view">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 shadow-sm animate-in fade-in slide-in-from-top-1 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              إدارة وتعيين أدوار المستخدمين (User Roles Management)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fbf1eb] text-[#9b4c2e] font-bold text-xs border border-[#f5d9ca]">
              صلاحيات المدير
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            تعيين وترقية أدوار الأعضاء بدقة (مستخدم عادي، ولي أمر معتمد، مشرف شرعي، مدير نظام)، مع متابعة حالات الحسابات وسجل الصلاحيات الشرعية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportUsers}
            className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>تصدير CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>تعيين مستخدم جديد</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Total Users */}
        <div 
          onClick={() => { setRoleFilter('all'); setStatusFilter('all'); }}
          className="bg-white p-4 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition cursor-pointer shadow-2xs space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">إجمالي الأعضاء</span>
            <Users className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-neutral-900 font-mono">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400">
            كافة المسجلين بالنظام
          </div>
        </div>

        {/* Regular Seekers */}
        <div 
          onClick={() => setRoleFilter('user')}
          className={`bg-white p-4 rounded-2xl border transition cursor-pointer shadow-2xs space-y-1 ${
            roleFilter === 'user' ? 'ring-2 ring-[#9b4c2e] border-transparent' : 'border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">مستخدم عادي</span>
            <UserCheck className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-neutral-800 font-mono">
            {stats.regulars.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400">
            باحثون ومرشحات
          </div>
        </div>

        {/* Walis */}
        <div 
          onClick={() => setRoleFilter('wali')}
          className={`bg-white p-4 rounded-2xl border transition cursor-pointer shadow-2xs space-y-1 ${
            roleFilter === 'wali' ? 'ring-2 ring-amber-600 border-transparent' : 'border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-800 font-medium">أولياء الأمور</span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono">
            {stats.walis.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700/80">
            بصكوك ولاية معتمدة
          </div>
        </div>

        {/* Moderators */}
        <div 
          onClick={() => setRoleFilter('moderator')}
          className={`bg-white p-4 rounded-2xl border transition cursor-pointer shadow-2xs space-y-1 ${
            roleFilter === 'moderator' ? 'ring-2 ring-blue-600 border-transparent' : 'border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-800 font-medium">مشرفون شرعيون</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-900 font-mono">
            {stats.moderators.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-700/80">
            تدقيق صكوك ومحادثات
          </div>
        </div>

        {/* Admins */}
        <div 
          onClick={() => setRoleFilter('admin')}
          className={`bg-white p-4 rounded-2xl border transition cursor-pointer shadow-2xs space-y-1 ${
            roleFilter === 'admin' ? 'ring-2 ring-purple-600 border-transparent' : 'border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-800 font-medium">المديرون</span>
            <Key className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-900 font-mono">
            {stats.admins.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-700/80">
            صلاحيات إدارة كاملة
          </div>
        </div>

      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('users_table')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users_table'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>جدول المستخدمين وتعيين الأدوار ({filteredUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('permissions_matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'permissions_matrix'
              ? 'bg-neutral-900 text-white shadow-2xs'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>مصفوفة الصلاحيات الشرعية للأدوار</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: INTERACTIVE USERS TABLE WITH ROLE ACTIONS */}
      {/* ======================================================== */}
      {activeTab === 'users_table' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم، البريد، الهاتف، المدينة..."
                className="w-full text-xs ps-8 pe-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              
              {/* Role Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 text-[11px]">الدور:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">كافة الأدوار</option>
                  <option value="user">مستخدم عادي (باحث/ة)</option>
                  <option value="wali">ولي أمر معتمد</option>
                  <option value="moderator">مشرف ومدقق شرعي</option>
                  <option value="admin">مدير نظام</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 text-[11px]">الحالة:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="active">نشط ومفعل</option>
                  <option value="pending_verification">بانتظار التوثيق</option>
                  <option value="suspended">معلق مؤقتاً</option>
                  <option value="banned">محظور</option>
                </select>
              </div>

              {(roleFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setRoleFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-[#9b4c2e] hover:underline font-bold text-[11px] px-2 py-1 cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-3.5 text-start">المستخدم</th>
                    <th className="p-3.5 text-start">الدور الحالي</th>
                    <th className="p-3.5 text-start">حالة الحساب</th>
                    <th className="p-3.5 text-start">سبب التعيين / الملاحظة</th>
                    <th className="p-3.5 text-start">تاريخ التسجيل والنشاط</th>
                    <th className="p-3.5 text-end">إجراءات المدير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-400">
                        لا توجد نتائج مطابقة لمعايير البحث الحالية.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleDef = ROLE_DEFINITIONS[user.role];
                      return (
                        <tr key={user.id} className="hover:bg-neutral-50/80 transition">
                          
                          {/* User Profile Cell */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ede5dd] to-[#fbf1eb] flex items-center justify-center font-bold text-[#9b4c2e] shrink-0 border border-[#e5d5c7] shadow-2xs">
                                {user.name.slice(0, 1)}
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {user.gender && (
                                    <span className="text-[10px] text-neutral-400">
                                      ({user.gender === 'male' ? 'ذكر' : 'أنثى'})
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-sans">
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-neutral-400" />
                                    {user.email}
                                  </span>
                                  {user.phone && (
                                    <span className="font-mono text-[10px] text-neutral-400 hidden sm:inline">
                                      {user.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge Cell */}
                          <td className="p-3.5">
                            <div className="space-y-1">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleDef.badgeClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${roleDef.dotClass}`} />
                                {roleDef.labelAr}
                              </span>
                              {user.verifiedWali && (
                                <span className="block text-[10px] text-emerald-700 font-bold">
                                  ✓ صك ولاية مدقق
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Account Status Cell */}
                          <td className="p-3.5">
                            {getStatusBadge(user.status)}
                          </td>

                          {/* Reason / Notes Cell */}
                          <td className="p-3.5 max-w-xs">
                            <div className="text-[11px] text-neutral-600 line-clamp-2">
                              {user.roleReason || 'تسجيل اعتيادي بالمنصة'}
                            </div>
                            {user.assignedBy && (
                              <span className="text-[10px] text-neutral-400 block mt-0.5">
                                بواسطة: {user.assignedBy}
                              </span>
                            )}
                          </td>

                          {/* Timestamps Cell */}
                          <td className="p-3.5 text-neutral-500">
                            <div className="font-mono text-[11px] text-neutral-700">{user.createdAt}</div>
                            <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {user.lastActive}
                            </span>
                          </td>

                          {/* Actions Cell */}
                          <td className="p-3.5 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Change Role Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenRoleModal(user)}
                                className="px-3 py-1.5 rounded-xl bg-[#fbf1eb] hover:bg-[#f5e2d6] text-[#9b4c2e] font-bold text-xs transition cursor-pointer flex items-center gap-1 border border-[#f5d9ca]"
                                title="تعيين أو ترقية الدور"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تغيير الدور</span>
                              </button>

                              {/* Change Status Dropdown / Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUserForStatus(user);
                                  setNewStatus(user.status);
                                }}
                                className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition cursor-pointer"
                                title="تغيير حالة الحساب"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick Toggle Status */}
                              <button
                                type="button"
                                onClick={() => handleQuickToggleStatus(user)}
                                className={`p-1.5 rounded-xl transition cursor-pointer ${
                                  user.status === 'active'
                                    ? 'bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-600'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                }`}
                                title={user.status === 'active' ? 'تعليق مؤقت' : 'تنشيط الحساب'}
                              >
                                {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ROLES & PERMISSIONS MATRIX (مصفوفة الصلاحيات) */}
      {/* ======================================================== */}
      {activeTab === 'permissions_matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(ROLE_DEFINITIONS) as PlatformRole[]).map((roleKey) => {
            const r = ROLE_DEFINITIONS[roleKey];
            const usersCount = users.filter(u => u.role === roleKey).length;
            return (
              <div key={roleKey} className="bg-white p-5 rounded-3xl border border-neutral-200/90 space-y-4 shadow-2xs">
                
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${r.badgeClass}`}>
                      {r.labelAr}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-xl">
                    {usersCount} عضو بهذا الدور
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {r.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <span className="text-xs font-bold text-neutral-800 block">
                    الصلاحيات الشرعية والنظامية الممنوحة:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {r.permissionsList.map((perm, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CHANGE USER ROLE (نافذة تعيين / تغيير الدور) */}
      {/* ======================================================== */}
      {selectedUserForRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 text-start shadow-2xl animate-in fade-in duration-150 border border-neutral-200 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center border border-[#f5d9ca]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-neutral-900">
                    تعيين أو ترقية دور المستخدم
                  </h3>
                  <p className="text-xs text-neutral-500">
                    تعديل صلاحيات الوصول على مستوى منصة ميثاق
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserForRole(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center gap-3 text-xs">
              <div className="w-10 h-10 rounded-xl bg-white text-[#9b4c2e] font-black text-sm flex items-center justify-center border border-neutral-200">
                {selectedUserForRole.name.slice(0, 1)}
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-neutral-900 text-sm">{selectedUserForRole.name}</div>
                <div className="text-neutral-500 font-sans">{selectedUserForRole.email} • {selectedUserForRole.city || 'الرياض'}</div>
              </div>
            </div>

            {/* Role Selection Options */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-neutral-800 block">
                اختر الدور الجديد للمستخدم:
              </label>

              <div className="space-y-2">
                {(Object.keys(ROLE_DEFINITIONS) as PlatformRole[]).map((rKey) => {
                  const roleDef = ROLE_DEFINITIONS[rKey];
                  const isSelected = newSelectedRole === rKey;
                  return (
                    <div
                      key={rKey}
                      onClick={() => setNewSelectedRole(rKey)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected 
                          ? 'bg-[#fbf1eb]/70 border-[#9b4c2e] ring-1 ring-[#9b4c2e]' 
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleDef.badgeClass}`}>
                            {roleDef.labelAr}
                          </span>
                          {selectedUserForRole.role === rKey && (
                            <span className="text-[10px] text-neutral-400 font-semibold">(الدور الحالي)</span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-600 leading-relaxed">
                          {roleDef.description}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'border-[#9b4c2e] bg-[#9b4c2e] text-white' 
                          : 'border-neutral-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reason & Audit Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 block">
                سبب التعيين أو الترقية (يسجل في سجل الأمان الشرعي):
              </label>
              <input
                type="text"
                value={changeRoleReason}
                onChange={(e) => setChangeRoleReason(e.target.value)}
                placeholder="مثال: اعتماد صك ولاية رسمي / ترقية بقرار لجنة الإشراف الشرعي"
                className="w-full text-xs p-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
              />

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'اعتماد صك ولاية شرعي',
                  'ترقية إلى مشرف شرعي',
                  'تكليف إداري وتقني',
                  'إعادة ضبط إلى باحث عادي'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setChangeRoleReason(chip)}
                    className="px-2 py-0.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[10px] font-semibold cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Checkbox */}
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={notifyUserByEmail}
                onChange={(e) => setNotifyUserByEmail(e.target.checked)}
                className="w-4 h-4 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
              />
              <span>إرسال إشعار فوري للمستخدم بالدور الجديد عبر البريد الإلكتروني والرسائل النصية</span>
            </label>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 text-xs">
              <button
                type="button"
                onClick={() => setSelectedUserForRole(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer hover:bg-neutral-200 transition"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={isSavingRole}
                onClick={handleConfirmRoleChange}
                className="px-6 py-2.5 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold cursor-pointer shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSavingRole ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ حفظ الدور...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تأكيد وحفظ الدور الجديد</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CHANGE ACCOUNT STATUS (تعديل حالة الحساب) */}
      {/* ======================================================== */}
      {selectedUserForStatus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-start shadow-2xl animate-in fade-in duration-150 border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">
                تعديل حالة حساب: {selectedUserForStatus.name}
              </h3>
              <button onClick={() => setSelectedUserForStatus(null)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-neutral-700 block">اختر الحالة:</label>
              {[
                { key: 'active', label: 'نشط ومفعل', desc: 'يستطيع تسجيل الدخول واستخدام كافة ميزات المنصة' },
                { key: 'pending_verification', label: 'بانتظار التوثيق', desc: 'معلق لحين مطابقة الهوية أو صك الولي' },
                { key: 'suspended', label: 'معلق مؤقتاً', desc: 'إيقاف مؤقت بسبب بلاغ أو تدقيق احترازي' },
                { key: 'banned', label: 'محظور نهائياً', desc: 'منع كامل من الوصول لمنصة ميثاق' }
              ].map((s) => (
                <div
                  key={s.key}
                  onClick={() => setNewStatus(s.key as any)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    newStatus === s.key ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className={`text-[11px] ${newStatus === s.key ? 'text-neutral-300' : 'text-neutral-500'}`}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 text-xs">
              <button
                type="button"
                onClick={() => setSelectedUserForStatus(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className="px-5 py-2 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold cursor-pointer"
              >
                تطبيق الحالة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / INVITE NEW USER (تعيين مستخدم جديد) */}
      {/* ======================================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 text-start shadow-2xl animate-in fade-in duration-150 border border-neutral-200 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#9b4c2e]" />
                <h3 className="font-bold text-base text-neutral-900">
                  إضافة مستخدم جديد وتعيين دوره
                </h3>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 block">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="مثال: فضيلة الشيخ / أو اسم العضو أو الولي"
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 block">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 block">رقم التواصل الموثق</label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 block">المدينة</label>
                  <input
                    type="text"
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                    placeholder="الرياض"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700 block">الدور المخصص *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e] font-bold text-neutral-800"
                  >
                    <option value="user">مستخدم عادي (باحث/ة)</option>
                    <option value="wali">ولي أمر معتمد</option>
                    <option value="moderator">مشرف ومدقق شرعي</option>
                    <option value="admin">مدير نظام كامل الصلاحيات</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 block">سبب التعيين أو الملاحظة</label>
                <input
                  type="text"
                  value={newUserReason}
                  onChange={(e) => setNewUserReason(e.target.value)}
                  placeholder="مثال: تعيين بقرار مجلس الإدارة / توثيق وكالة إلكترونية"
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#9b4c2e]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold cursor-pointer shadow-xs"
                >
                  إضافة وتعيين المستخدم
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
