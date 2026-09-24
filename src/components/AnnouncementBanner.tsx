import React from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';
import { fireCelebrationConfetti } from '../utils/confetti';
import { ExternalLink } from 'lucide-react';

interface Props {
  lang: Language;
  announcement?: {
    enabled: boolean;
    text: string;
    badgeText?: string;
    link?: string;
  };
}

export const AnnouncementBanner: React.FC<Props> = ({ lang, announcement }) => {
  const t = translations[lang];

  if (announcement && !announcement.enabled) {
    return null;
  }

  const badgeText = announcement?.badgeText || 'منصة ميثاق الشرعية';
  const mainText = announcement?.text || t.bannerText;

  return (
    <aside
      id="announcement-banner"
      onClick={fireCelebrationConfetti}
      className="w-full min-h-11 py-1.5 bg-[#d9e9bb] text-[#000000] px-4 sm:px-8 text-xs font-normal flex items-center justify-between cursor-pointer select-none border-b border-black/10"
      title="اضغط للاحتفال ببركة الزواج والسنة النبوية 🎉"
    >
      <div className="flex-1 flex items-center justify-center gap-4 sm:gap-6 mx-auto overflow-hidden text-center">
        <span className="font-bold tracking-wider text-[11px] bg-black/10 px-2.5 py-0.5 rounded-full shrink-0">
          {badgeText}
        </span>
        <span className="text-black/30 hidden sm:inline">|</span>
        <span className="truncate text-xs font-medium">
          {mainText}
        </span>
        <span className="text-black/30 hidden md:inline">|</span>
        <span className="hidden md:inline text-[11px] font-medium tracking-wider uppercase underline underline-offset-4 decoration-black/40">
          إشراف الولي الشرعي والمطابقة الوقورة
        </span>
      </div>

      <a
        id="announcement-banner-new-tab-link"
        href={announcement?.link || (typeof window !== 'undefined' ? window.location.href : '#')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-black hover:text-black/70 border-b border-black shrink-0 transition pb-0.5 ms-3"
        title="فتح في نافذة مستقلة خارج الاستديو"
      >
        <span>نافذة مستقلة ↗</span>
      </a>
    </aside>
  );
};

