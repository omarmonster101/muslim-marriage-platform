import React from 'react';
import { UserSession, ActiveRole } from '../types';
import { ShieldCheck, User, Users, HeartHandshake, ShieldAlert, ExternalLink } from 'lucide-react';

export const availableSessions: UserSession[] = [
  {
    id: "admin-root",
    name: "فضيلة المشرف العام (إدارة ميثاق)",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
    phone: "+966 50 999 0000"
  },
  {
    id: "prof-1",
    name: "عبدالله بن فهد الشمري",
    role: "suitor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop",
    phone: "+966 50 111 2233",
    relatedProfileId: "prof-1"
  },
  {
    id: "wali-1",
    name: "الشيخ أحمد الخالدي (الولي)",
    role: "wali",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop",
    phone: "+966 50 123 4567"
  },
  {
    id: "prof-2",
    name: "سارة بنت أحمد الخالدي",
    role: "candidate",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&fit=crop",
    relatedProfileId: "prof-2"
  },
  {
    id: "guest-user",
    name: "زائر / مستكشف",
    role: "guest",
    avatar: ""
  }
];

interface RoleSwitcherProps {
  currentSession: UserSession;
  onSelectSession: (session: UserSession) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentSession,
  onSelectSession
}) => {
  return (
    <div className="bg-[#0e0e0e] text-white px-3 sm:px-6 py-2 border-b border-white/10 text-xs select-none">
      <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Current Perspective Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white/50 tracking-wider">
            المعاينة الحية كـ:
          </span>
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs font-semibold border border-white/10 shadow-2xs">
            {currentSession.role === 'admin' && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
            {currentSession.role === 'wali' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            {currentSession.role === 'suitor' && <User className="w-3.5 h-3.5 text-blue-400" />}
            {currentSession.role === 'candidate' && <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />}
            {currentSession.role === 'guest' && <Users className="w-3.5 h-3.5 text-white/60" />}
            <span className="text-white font-bold">{currentSession.name}</span>
          </div>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {availableSessions.map((session) => {
            const isActive = session.id === currentSession.id;
            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`text-[11px] px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  isActive
                    ? 'bg-[#d9c58b] text-black shadow-xs scale-[1.02]'
                    : 'bg-white/5 text-white/75 hover:bg-white/15 hover:text-white border border-white/5'
                }`}
              >
                <span>
                  {session.role === 'admin' ? '🛡️ المشرف' :
                   session.role === 'suitor' ? '🤵 خاطب' :
                   session.role === 'wali' ? '🛡️ الولي' :
                   session.role === 'candidate' ? '🧕 مخطوبة' : '👤 زائر'}
                </span>
                <span className="hidden sm:inline font-normal">({session.name.split(' ')[0]})</span>
              </button>
            );
          })}

          {/* Direct Open in New Tab Link */}
          <a
            id="role-switcher-new-tab-btn"
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs border border-emerald-400/40"
            title="فتح المنصة في تبويب جديد خارج الاستديو"
          >
            <ExternalLink className="w-3 h-3 text-white" />
            <span>فحص بنافذة جديدة ↗</span>
          </a>

          {/* Quick link to /admin */}
          <button
            onClick={() => {
              window.history.pushState(null, '', '/admin');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-[11px] px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 bg-[#9b4c2e] hover:bg-[#853e24] text-white shadow-xs border border-amber-400/40"
            title="الانتقال الفوري إلى لوحة تحكم المدير"
          >
            <ShieldAlert className="w-3 h-3 text-amber-300" />
            <span>لوحة المدير (/admin)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
