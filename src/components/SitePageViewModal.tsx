import React from 'react';
import { X, FileText, Calendar, UserCheck, ShieldCheck, Printer } from 'lucide-react';
import { AdminPageItem } from '../data/adminSettingsData';
import { IslamicStar } from './IslamicOrnaments';

interface SitePageViewModalProps {
  page: AdminPageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SitePageViewModal: React.FC<SitePageViewModalProps> = ({
  page,
  isOpen,
  onClose
}) => {
  if (!isOpen || !page) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 font-cairo">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 space-y-6 text-start shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 border border-[#ede5dd]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#ede5dd]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fbf1eb] text-[#9b4c2e] border border-[#f5d9ca] flex items-center gap-1.5">
                <IslamicStar className="w-3.5 h-3.5 text-[#9b4c2e]" filled />
                وثيقة شرعية ورسمية
              </span>
              <span className="text-xs font-mono text-neutral-400">/{page.slug}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug">
              {page.title}
            </h1>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Metadata info strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 bg-[#fbf9f6] p-3.5 rounded-2xl border border-[#ede5dd]">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800">
            <UserCheck className="w-4 h-4 text-[#9b4c2e]" />
            <span>المصدر: {page.author || 'هيئة الرقابة الشرعية'}</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span>آخر تحديث معتمد: {page.lastUpdated || '2026-09-22'}</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>موثق ومسجل في سحابة ميثاق</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="text-neutral-800 text-sm sm:text-base leading-loose whitespace-pre-line bg-white p-6 sm:p-8 rounded-2xl border border-neutral-100 shadow-2xs font-sans">
          {page.contentAr || 'المحتوى قيد المراجعة والاعتماد من الإدارة.'}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#ede5dd] text-xs">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الوثيقة</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#9b4c2e] hover:bg-[#853e24] text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            إغلاق ومتابعة التصفح
          </button>
        </div>
      </div>
    </div>
  );
};
