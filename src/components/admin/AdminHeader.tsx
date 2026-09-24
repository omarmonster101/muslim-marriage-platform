import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Bell, 
  Search, 
  RefreshCw, 
  Sparkles,
  User,
  SlidersHorizontal,
  Activity
} from 'lucide-react';
import { IslamicStar } from '../IslamicOrnaments';

interface AdminHeaderProps {
  onReturnToSite: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
  activeItemTitle: string;
  pendingWalisCount: number;
  flaggedChatsCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onReturnToSite,
  onRefreshData,
  isLoading,
  activeItemTitle,
  pendingWalisCount,
  flaggedChatsCount,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-2xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left side (in RTL: Right side): Logo & System Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9b4c2e] to-[#7a371e] text-white flex items-center justify-center font-bold text-base shadow-xs">
              <IslamicStar className="w-5 h-5 text-[#d9c58b]" filled />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-neutral-900 text-sm tracking-tight font-cairo">
                  ميثاق
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fbf1eb] text-[#9b4c2e] border border-[#9b4c2e]/20">
                  لوحة الإدارة العليا /admin
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-cairo">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>الخادم نشط 100% • الضوابط الشرعية مفعلة</span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-neutral-200 hidden md:block mx-1" />

          {/* Current view indicator breadcrumb */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-50 px-3 py-1 rounded-lg border border-neutral-200 font-cairo">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-neutral-400">القسم:</span>
            <span className="font-bold text-neutral-900">{activeItemTitle}</span>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Global search */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="بحث في الأعضاء، السير، العمليات..."
              className="w-full text-xs ps-8 pe-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-lg border border-neutral-200 focus:border-[#9b4c2e] focus:outline-none transition font-cairo"
            />
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefreshData}
            disabled={isLoading}
            title="تحديث البيانات المباشرة"
            className="p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#9b4c2e]' : ''}`} />
          </button>

          {/* Pending Alerts Badge */}
          <div className="relative">
            <button
              title="تنبيهات الإشراف"
              className="p-2 text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs transition cursor-pointer relative"
            >
              <Bell className="w-3.5 h-3.5" />
              {(pendingWalisCount > 0 || flaggedChatsCount > 0) && (
                <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingWalisCount + flaggedChatsCount}
                </span>
              )}
            </button>
          </div>

          {/* Return to Public Site Button */}
          <button
            onClick={onReturnToSite}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#fbf1eb] text-[#9b4c2e] hover:bg-[#9b4c2e] hover:text-white rounded-lg border border-[#9b4c2e]/30 transition cursor-pointer font-cairo shadow-2xs"
            title="الخروج من لوحة التحكم إلى واجهة الموقع الرئيسية"
          >
            <span>الموقع العام</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Admin User Badge */}
          <div className="flex items-center gap-2 ps-2 border-s border-neutral-200">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
              م
            </div>
            <div className="hidden xl:block text-start leading-tight">
              <span className="block text-xs font-bold text-neutral-900 font-cairo">سليمان بن راشد</span>
              <span className="block text-[10px] text-neutral-500 font-cairo">مدير عام النظام</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
