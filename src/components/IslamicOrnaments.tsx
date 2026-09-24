import React from 'react';

interface IslamicOrnamentProps {
  className?: string;
  size?: number;
}

/**
 * Classical 8-Point Islamic Star (Rub el Hizb / النجمة الثمانية الإسلامية)
 */
export const IslamicStar: React.FC<IslamicOrnamentProps & { filled?: boolean }> = ({ 
  className = "w-5 h-5 text-black", 
  filled = false 
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Outer Two Overlapping Squares Rotated 45 degrees */}
      <rect x="20" y="20" width="60" height="60" transform="rotate(0 50 50)" fill={filled ? "currentColor" : "none"} />
      <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" fill={filled ? "currentColor" : "none"} />
      {/* Central Rosette Circle */}
      <circle cx="50" cy="50" r="14" fill={filled ? "#ffffff" : "none"} stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
};

/**
 * Classical Islamic Calligraphic Horizontal Divider (فاصل زخرفي إسلامي مورق)
 */
export const IslamicDivider: React.FC<{ className?: string }> = ({ className = "my-4" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 text-black/60 select-none ${className}`}>
      {/* Left Floral Tendril Line */}
      <div className="flex-1 flex items-center justify-end">
        <div className="h-[1px] w-full max-w-[140px] bg-gradient-to-r from-transparent to-black/30" />
        <svg viewBox="0 0 50 20" className="w-10 h-4 text-black/40">
          <path 
            d="M50,10 C40,10 35,4 25,4 C15,4 12,14 0,10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
          />
          <circle cx="25" cy="4" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Center 8-Fold Rosette Medallion */}
      <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 border border-black/20 bg-[#faf8f5]">
        <span className="text-black/50 text-xs font-serif">✦</span>
        <IslamicStar className="w-4 h-4 text-black" filled={false} />
        <span className="text-black/50 text-xs font-serif">✦</span>
      </div>

      {/* Right Floral Tendril Line */}
      <div className="flex-1 flex items-center justify-start">
        <svg viewBox="0 0 50 20" className="w-10 h-4 text-black/40 transform scale-x-[-1]">
          <path 
            d="M50,10 C40,10 35,4 25,4 C15,4 12,14 0,10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
          />
          <circle cx="25" cy="4" r="2" fill="currentColor" />
        </svg>
        <div className="h-[1px] w-full max-w-[140px] bg-gradient-to-l from-transparent to-black/30" />
      </div>
    </div>
  );
};

/**
 * Islamic Architectural Mihrab Arch Header Ornament
 */
export const IslamicArchOrnament: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full flex justify-center items-center pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 300 40" className="w-64 h-8 text-black/30" fill="none">
        {/* Cusped Ottoman/Mamluk Arch Motif */}
        <path 
          d="M10,38 C60,38 90,36 120,24 C135,18 145,5 150,2 C155,5 165,18 180,24 C210,36 240,38 290,38" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none" 
        />
        <path 
          d="M30,38 C70,38 100,34 125,22 C138,16 146,8 150,5 C154,8 162,16 175,22 C200,34 230,38 270,38" 
          stroke="currentColor" 
          strokeWidth="0.8" 
          strokeDasharray="3 3"
          fill="none" 
        />
        <circle cx="150" cy="2" r="2.5" fill="currentColor" />
      </svg>
    </div>
  );
};

/**
 * Islamic Manuscript Corner Rosette
 */
export const IslamicCorner: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; className?: string }> = ({ 
  position, 
  className = "w-6 h-6 text-black/30" 
}) => {
  const rotation = {
    tl: '',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90'
  }[position];

  return (
    <div className={`absolute pointer-events-none select-none ${rotation} ${className}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        <path d="M0,0 L35,0 C25,0 15,10 15,20 C15,25 10,35 0,35 Z" fill="currentColor" opacity="0.12" />
        <path d="M2,2 L30,2 C22,2 12,10 12,18 C12,24 8,30 2,30" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};

/**
 * Ornamental Ribbon Banner Header for Section Titles
 */
export const IslamicSectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}> = ({ title, subtitle, badge, className = "" }) => {
  return (
    <div className={`text-center space-y-2.5 max-w-2xl mx-auto ${className}`}>
      <IslamicArchOrnament />
      
      {badge && (
        <div className="inline-flex items-center gap-2 border border-black/25 px-3.5 py-1 bg-white shadow-xs text-[11px] font-bold tracking-widest uppercase">
          <IslamicStar className="w-3 h-3 text-black" filled />
          <span>{badge}</span>
          <IslamicStar className="w-3 h-3 text-black" filled />
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-cairo tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs sm:text-sm text-[#4c4c4c] font-cairo leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
      )}

      <IslamicDivider className="max-w-md mx-auto pt-1" />
    </div>
  );
};
