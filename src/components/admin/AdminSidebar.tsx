import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  HelpCircle, 
  Ban, 
  Mail, 
  Terminal, 
  Zap, 
  Bot, 
  Cpu, 
  Settings, 
  Sliders, 
  FileText, 
  Globe, 
  Send, 
  Search, 
  Palette, 
  Layers, 
  BookOpen, 
  Puzzle, 
  ChevronDown, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type AdminSectionKey = 
  | 'dashboard_main'
  | 'dashboard_finance'
  | 'users_browse'
  | 'users_moderators'
  | 'users_roles'
  | 'users_questions'
  | 'users_restricted'
  | 'users_mailing'
  | 'console_log'
  | 'console_triggers'
  | 'console_agent_stats'
  | 'console_agents'
  | 'console_ai'
  | 'settings_general'
  | 'settings_users'
  | 'settings_content'
  | 'settings_pages'
  | 'settings_countries'
  | 'settings_language'
  | 'settings_smtp'
  | 'settings_seo'
  | 'settings_appearance'
  | 'pages_manage'
  | 'pages_special'
  | 'pages_user_profile'
  | 'pages_user_dashboard'
  | 'plugins_installed'
  | 'plugins_available'
  | 'plugins_add_new';

interface AdminSidebarProps {
  currentSection: AdminSectionKey;
  onSelectSection: (section: AdminSectionKey) => void;
  pendingWalisCount: number;
  pendingProfilesCount: number;
  flaggedChatsCount: number;
  activePluginsCount: number;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    key: AdminSectionKey;
    label: string;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  pendingWalisCount,
  pendingProfilesCount,
  flaggedChatsCount,
  activePluginsCount
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
    dashboard: false,
    users: false,
    console: false,
    settings: false,
    pages: false,
    plugins: false
  });

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const categories: MenuCategory[] = [
    {
      id: 'dashboard',
      title: 'لوحة المؤشرات العامة',
      icon: LayoutDashboard,
      items: [
        { key: 'dashboard_main', label: 'الرئيسية والإحصائيات' },
        { key: 'dashboard_finance', label: 'المالية والمهور' }
      ]
    },
    {
      id: 'users',
      title: 'إدارة الأعضاء والرقابة',
      icon: Users,
      items: [
        { 
          key: 'users_browse', 
          label: 'استعراض وتدقيق الأعضاء',
          badge: pendingProfilesCount > 0 ? pendingProfilesCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { 
          key: 'users_moderators', 
          label: 'الأولياء والمشرفون',
          badge: pendingWalisCount > 0 ? `${pendingWalisCount} ولي` : undefined,
          badgeColor: 'bg-blue-100 text-blue-800'
        },
        { key: 'users_roles', label: 'الأدوار والصلاحيات' },
        { key: 'users_questions', label: 'أسئلة السيرة والخطوبة' },
        { key: 'users_restricted', label: 'الأسماء والكلمات المحظورة' },
        { key: 'users_mailing', label: 'المراسلات والتعاميم' }
      ]
    },
    {
      id: 'console',
      title: 'الرقابة والذكاء الاصطناعي',
      icon: Terminal,
      items: [
        { 
          key: 'console_log', 
          label: 'سجل العمليات والمراقبة الشرعية',
          badge: flaggedChatsCount > 0 ? `${flaggedChatsCount} تنبيه` : undefined,
          badgeColor: 'bg-red-100 text-red-800'
        },
        { key: 'console_ai', label: 'إعدادات الذكاء الاصطناعي' }
      ]
    },
    {
      id: 'settings',
      title: 'إعدادات النظام والمنصة',
      icon: Settings,
      items: [
        { key: 'settings_general', label: 'الإعدادات العامة' },
        { key: 'settings_users', label: 'ضوابط تسجيل الأعضاء' },
        { key: 'settings_content', label: 'ضوابط المحتوى والصور' },
        { key: 'settings_pages', label: 'تخطيط وعناصر الصفحات' },
        { key: 'settings_countries', label: 'البلاد والمدن والمناطق' },
        { key: 'settings_language', label: 'اللغات والترجمة الفورية' },
        { key: 'settings_smtp', label: 'إعدادات خادم البريد (SMTP)' },
        { key: 'settings_seo', label: 'تهيئة محركات البحث (SEO)' },
        { key: 'settings_appearance', label: 'المظهر والثيمات والألوان' }
      ]
    },
    {
      id: 'pages',
      title: 'الصفحات والمحتوى',
      icon: Layers,
      items: [
        { key: 'pages_manage', label: 'إدارة الصفحات الثابتة' },
        { key: 'pages_user_profile', label: 'تخطيط صفحة السيرة' }
      ]
    },
    {
      id: 'plugins',
      title: 'الملحقات والتكاملات',
      icon: Puzzle,
      items: [
        { 
          key: 'plugins_installed', 
          label: 'الإضافات المثبتة',
          badge: activePluginsCount,
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        { key: 'plugins_available', label: 'الإضافات المتاحة للتفعيل' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#1a1c23] text-neutral-300 flex flex-col shrink-0 border-e border-neutral-800 h-full overflow-y-auto select-none font-cairo">
      {/* Sidebar Header Brand */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#9b4c2e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            م
          </div>
          <div>
            <span className="font-bold text-white text-sm block leading-tight">لوحة الإدارة</span>
            <span className="text-[10px] text-neutral-400">إشراف شرعي موثق</span>
          </div>
        </div>
        <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded font-mono">
          v3.8
        </span>
      </div>

      {/* Menu Categories */}
      <div className="p-3 space-y-3 flex-1">
        {categories.map((category) => {
          const isCollapsed = collapsedCategories[category.id];
          const hasActiveChild = category.items.some(it => it.key === currentSection);
          const Icon = category.icon;

          return (
            <div key={category.id} className="space-y-1">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  hasActiveChild ? 'text-white bg-neutral-800/40' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${hasActiveChild ? 'text-[#e58a69]' : 'text-neutral-400'}`} />
                  <span className="font-bold text-[12px]">
                    {category.title}
                  </span>
                </div>
                <span className="text-neutral-500">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>

              {/* Sub items */}
              {!isCollapsed && (
                <div className="ms-3 ps-2 border-s border-neutral-800/90 space-y-1 mt-1">
                  {category.items.map((item) => {
                    const isActive = currentSection === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => onSelectSection(item.key)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer text-start ${
                          isActive
                            ? 'bg-[#9b4c2e] text-white font-bold shadow-xs'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : (item.badgeColor || 'bg-neutral-800 text-neutral-300')
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer info & Sharia pledge badge */}
      <div className="p-3 border-t border-neutral-800 bg-[#15171d] text-[11px] text-neutral-400 space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-neutral-400">الضوابط الشرعية</span>
          <span className="text-emerald-400 font-bold">معتمدة ومفعلة</span>
        </div>
        <p className="text-[10px] text-neutral-500 leading-tight">
          إشراف الولي • صون الحياء • حجب الصور • بلا خلوة
        </p>
      </div>
    </aside>
  );
};
