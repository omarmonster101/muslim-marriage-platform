import React from 'react';
import { Language, NavigationTab } from '../types';
import { translations } from '../data/translations';
import { ShieldCheck, Heart, Sparkles, BookOpen, Globe } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { IslamicStar } from './IslamicOrnaments';

interface FooterProps {
  lang: Language;
  onTabChange: (tab: NavigationTab) => void;
  onLangChange: (lang: Language) => void;
  isAdmin?: boolean;
  copyrightText?: string;
  onOpenPage?: (pageSlug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onTabChange,
  onLangChange,
  isAdmin = false,
  copyrightText,
  onOpenPage
}) => {
  const t = translations[lang] || translations.ar;

  return (
    <footer className="w-full bg-[#fbf9f6] border-t border-[#ede5dd] pt-14 pb-10 text-start font-cairo text-neutral-800">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center shadow-xs">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5 text-[#9b4c2e]"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5.5c-.8.8-1.5 1.5-2 2.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-neutral-900 leading-none">
                  نكاح
                </span>
                <span className="text-xs text-neutral-500 font-medium tracking-wide mt-1">
                  موقع زواج إسلامي شرعي
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed">
              منصة آمنة وموثوقة للبحث عن شريك الحياة بما يرضي الله، مع الحفاظ على الخصوصية والكرامة وإشراف الولي الشرعي وتيسير سبل الحلال.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <IslamicStar className="w-3.5 h-3.5 text-[#9b4c2e]" filled />
              <span>مبنية على ضوابط الشريعة الإسلامية وموافقة أولياء الأمور</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              أقسام المنصة
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <button onClick={() => onTabChange('home')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('explore')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  تصفح الملفات والأعضاء
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('register')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  إنشاء حساب جديد
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('activity')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  الطلبات والمجالس
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('wali')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  بوابة ولي الأمر
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    window.history.pushState(null, '', '/admin');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }} 
                  className="hover:text-[#9b4c2e] transition cursor-pointer text-neutral-400 hover:text-neutral-700"
                >
                  لوحة الإدارة (/admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Languages & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              اللغات والضوابط
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button 
                onClick={() => onLangChange('ar')} 
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${lang === 'ar' ? 'bg-[#9b4c2e] text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'}`}
              >
                العربية
              </button>
              <button 
                onClick={() => onLangChange('en')} 
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${lang === 'en' ? 'bg-[#9b4c2e] text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'}`}
              >
                English
              </button>
              <button 
                onClick={() => onLangChange('fr')} 
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${lang === 'fr' ? 'bg-[#9b4c2e] text-white' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'}`}
              >
                Français
              </button>
            </div>

            <div className="pt-2 text-xs text-neutral-500 space-y-1.5">
              <p>✓ ستر تام لصور وبيانات الأخوات</p>
              <p>✓ لا محادثات فردية بدون إشراف الولي</p>
              <p>✓ تدقيق الهويات وتأكيد الجدية</p>
            </div>

            {onOpenPage && (
              <div className="pt-3 border-t border-neutral-200/60 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500 font-medium">
                <button onClick={() => onOpenPage('about-us')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  من نحن
                </button>
                <span>•</span>
                <button onClick={() => onOpenPage('terms-and-conditions')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  الشروط والأحكام
                </button>
                <span>•</span>
                <button onClick={() => onOpenPage('privacy-policy')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  سياسة الخصوصية
                </button>
                <span>•</span>
                <button onClick={() => onOpenPage('contact-us')} className="hover:text-[#9b4c2e] transition cursor-pointer">
                  تواصل معنا
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-[#ede5dd] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 text-center sm:text-start">
            <IslamicStar className="w-3 h-3 text-[#9b4c2e]" filled />
            <span className="font-cairo">قال النبي ﷺ: «إذا خَطَبَ إليكم مَن تَرْضَوْنَ دِينَهُ وخُلُقَهُ فزَوِّجُوهُ»</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-center sm:text-end">{copyrightText || `جميع الحقوق محفوظة © ${new Date().getFullYear()} منصة ميثاق`}</span>
            <button
              onClick={fireCelebrationConfetti}
              title="إطلاق بهجة الأفراح"
              className="hover:scale-125 transition-transform cursor-pointer"
            >
              🎉
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
