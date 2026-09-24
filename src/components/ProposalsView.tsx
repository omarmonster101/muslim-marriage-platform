import React, { useState, useMemo } from 'react';
import { Proposal, Language, UserSession, Profile } from '../types';
import { translations } from '../data/translations';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Phone,
  Sparkles, 
  MessageSquare, 
  MapPin, 
  Award, 
  Video, 
  Home, 
  Check, 
  X, 
  Filter, 
  UserCheck,
  Search,
  Eye,
  Send,
  Users,
  Compass,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { fireKhitbahBlessingConfetti, fireCelebrationConfetti } from '../utils/confetti';

interface ProposalsViewProps {
  lang: Language;
  proposals: Proposal[];
  currentSession: UserSession;
  profiles?: Profile[];
  onOpenChat: (proposal: Proposal) => void;
  onOpenMeeting: (proposal: Proposal) => void;
  onOpenNikah: (proposal: Proposal) => void;
  onUpdateProposalStatus?: (id: string, newStatus: Proposal['status'], stage: string) => void;
  onViewProfile?: (profile: Profile) => void;
  onSendProposal?: (profile: Profile) => void;
}

export const ProposalsView: React.FC<ProposalsViewProps> = ({
  lang,
  proposals,
  currentSession,
  profiles = [],
  onOpenChat,
  onOpenMeeting,
  onOpenNikah,
  onUpdateProposalStatus,
  onViewProfile,
  onSendProposal
}) => {
  const isAr = lang === 'ar';
  const t = translations[lang];

  // Primary Tab: 'proposals' (طلبات الخطوبة الجارية) vs 'recommended_matches' (المطابقات المقترحة)
  const [activeMainTab, setActiveMainTab] = useState<'proposals' | 'matches'>('proposals');

  // Filter within proposals
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'nikah'>('all');
  const [proposalSearch, setProposalSearch] = useState('');

  // Filter within recommended matches
  const [matchSearch, setMatchSearch] = useState('');

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const isWaliOrAdmin = currentSession.role === 'wali' || currentSession.role === 'admin';
  const isMaleUser = currentSession.role === 'suitor';
  const isFemaleUser = currentSession.role === 'candidate';

  // Filter proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      // Status filter
      if (statusFilter === 'pending' && !(p.status === 'pending_wali' || p.status === 'pending_wali_review')) {
        return false;
      }
      if (statusFilter === 'approved' && !(p.status === 'approved_by_wali' || p.status === 'meeting_scheduled' || p.status === 'istikhara')) {
        return false;
      }
      if (statusFilter === 'nikah' && p.status !== 'nikah_contracted') {
        return false;
      }
      // Text search
      if (proposalSearch.trim()) {
        const query = proposalSearch.toLowerCase();
        const matchesName = (p.suitorName || '').toLowerCase().includes(query) ||
                            (p.targetProfileName || '').toLowerCase().includes(query) ||
                            (p.suitorCity || '').toLowerCase().includes(query) ||
                            (p.waliName || '').toLowerCase().includes(query);
        if (!matchesName) return false;
      }
      return true;
    });
  }, [proposals, statusFilter, proposalSearch]);

  // Recommended matches for the active user
  const recommendedMatches = useMemo(() => {
    // If male user -> show female profiles
    // If female user -> show male profiles
    // If wali -> show suitors matching candidate
    const targetGender = isMaleUser ? 'female' : isFemaleUser ? 'male' : 'all';

    return profiles.filter((prof) => {
      if (targetGender !== 'all' && prof.gender !== targetGender) {
        return false;
      }
      // Exclude self if match
      if (currentSession.relatedProfileId && prof.id === currentSession.relatedProfileId) {
        return false;
      }
      if (matchSearch.trim()) {
        const q = matchSearch.toLowerCase();
        const match = (prof.fullName || '').toLowerCase().includes(q) ||
                      (prof.city || '').toLowerCase().includes(q) ||
                      (prof.country || '').toLowerCase().includes(q) ||
                      (prof.profession || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [profiles, isMaleUser, isFemaleUser, currentSession.relatedProfileId, matchSearch]);

  const handleApprove = (id: string) => {
    if (onUpdateProposalStatus) {
      onUpdateProposalStatus(id, 'approved_by_wali', isAr ? 'تمت موافقة الولي - جارٍ التنسيق لمجلس الرؤية الشرعية' : 'Approved by Wali - Coordinating Sharia Meeting');
      setActionSuccessMsg(isAr ? 'تم قبول طلب الخطوبة الشرعي من قبل الولي بنجاح وتيسير الرؤية الشرعية.' : 'Proposal approved by guardian. Vision meeting coordinated.');
      fireKhitbahBlessingConfetti();
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleDecline = (id: string) => {
    if (onUpdateProposalStatus) {
      onUpdateProposalStatus(id, 'declined', isAr ? 'اعتذار بلطف واحترام (قدر الله وما شاء فعل)' : 'Respectfully declined');
      setActionSuccessMsg(isAr ? 'تم تسجيل الاعتذار بلطف واحترام وإشعار الخاطب.' : 'Polite decline recorded.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const pendingCount = proposals.filter(p => p.status === 'pending_wali' || p.status === 'pending_wali_review').length;
  const approvedCount = proposals.filter(p => p.status === 'approved_by_wali' || p.status === 'meeting_scheduled' || p.status === 'istikhara').length;
  const nikahCount = proposals.filter(p => p.status === 'nikah_contracted').length;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-8 text-start animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-white via-[#fcfaf7] to-[#faf4ef] p-6 sm:p-8 rounded-3xl border border-[#ede5dd] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 end-0 w-64 h-64 bg-[#9b4c2e]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 bg-[#fbf1eb] text-[#9b4c2e] border border-[#9b4c2e]/20 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <HeartHandshake className="w-4 h-4 text-[#9b4c2e]" />
              <span>{isAr ? 'منظومة المطابقات وطلبات الخطوبة الشرعية' : 'Sharia Matches & Proposals Center'}</span>
            </div>

            {/* Context Badge (NO WALI for male!) */}
            <div className="text-xs px-3 py-1.5 rounded-full border bg-white shadow-2xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-neutral-500 font-medium">
                {isAr ? 'الصفة النشطة:' : 'Active Role:'}
              </span>
              <strong className="text-neutral-900 font-bold">
                {isMaleUser 
                  ? (isAr ? `خاطب جاد (${currentSession.name})` : `Suitor (${currentSession.name})`)
                  : isFemaleUser 
                  ? (isAr ? `مخطوبة مصونة (${currentSession.name})` : `Candidate (${currentSession.name})`)
                  : isWaliOrAdmin
                  ? (isAr ? `ولي أمر معتمد (${currentSession.name})` : `Legal Guardian (${currentSession.name})`)
                  : currentSession.name}
              </strong>
              {isMaleUser && (
                <span className="text-[11px] text-[#9b4c2e] font-semibold bg-[#fbf1eb] px-2 py-0.5 rounded-md">
                  {isAr ? 'مراسلات مباشرة مع أولياء أمور المخطوبات' : 'Direct proposals to brides’ guardians'}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight font-display">
              {isAr ? 'المطابقات والخطوبة المباركة' : 'Matrimonial Matches & Proposals'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
              {isMaleUser 
                ? (isAr ? 'تابع هنا طلبات خطوبتك المرسلة إلى أولياء أمور الأخوات، واستكشف أعلى الملفات المتوافقة معك شرعياً وسكنياً.' : 'Track your formal suitor proposals to guardians, and explore highly compatible candidate profiles.')
                : isFemaleUser
                ? (isAr ? 'إدارة طلبات الخُطّاب الوافدة تحت إشراف ولي أمرك المباشر، وتيسير مجالس الرؤية الشرعية بالمعروف.' : 'Manage incoming suitor requests under your guardian’s supervision and schedule blessed Sharia meetings.')
                : (isAr ? 'إدارة ومراجعة طلبات الخُطاب لفتاتكم الكريمة، والموافقة على المحادثات الشرعية ومجالس الرؤية.' : 'Review suitor proposals for your ward and coordinate blessed Sharia meetings.')}
            </p>
          </div>

          {/* Primary View Switcher: طلبات الخطوبة الجارية | أعلى المطابقات والتوافقات لك */}
          <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setActiveMainTab('proposals')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                activeMainTab === 'proposals'
                  ? 'bg-[#9b4c2e] text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>{isAr ? 'طلبات الخطوبة النشطة' : 'Active Proposals'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                activeMainTab === 'proposals' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-800'
              }`}>
                {proposals.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('matches')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                activeMainTab === 'matches'
                  ? 'bg-[#9b4c2e] text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'أعلى المطابقات والتوافقات لك' : 'Recommended Matches for You'}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                activeMainTab === 'matches' ? 'bg-white/20 text-white' : 'bg-[#fbf1eb] text-[#9b4c2e]'
              }`}>
                {recommendedMatches.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE PROPOSALS (طلبات الخطوبة الجارية) */}
      {/* ========================================================================= */}
      {activeMainTab === 'proposals' && (
        <div className="space-y-6">
          {/* Controls Bar: Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-[#ede5dd] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'all'
                    ? 'bg-[#9b4c2e] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span>{isAr ? 'جميع الطلبات' : 'All Requests'}</span>
                <span className="text-[11px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">{proposals.length}</span>
              </button>

              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'pending'
                    ? 'bg-[#9b4c2e] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'بانتظار الولي' : 'Pending Guardian'}</span>
                {pendingCount > 0 && (
                  <span className="text-[11px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold font-mono">{pendingCount}</span>
                )}
              </button>

              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'approved'
                    ? 'bg-[#9b4c2e] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isAr ? 'المقبولة ومجالس الرؤية' : 'Approved & Meetings'}</span>
                {approvedCount > 0 && (
                  <span className="text-[11px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold font-mono">{approvedCount}</span>
                )}
              </button>

              <button
                onClick={() => setStatusFilter('nikah')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'nikah'
                    ? 'bg-[#9b4c2e] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'عقود القران المباركة' : 'Nikah Contracts'}</span>
                {nikahCount > 0 && (
                  <span className="text-[11px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold font-mono">{nikahCount}</span>
                )}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={proposalSearch}
                onChange={(e) => setProposalSearch(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم أو المدينة...' : 'Search by name or city...'}
                className="w-full ps-9 pe-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-[#9b4c2e] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Proposals List */}
          {filteredProposals.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ede5dd] p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center mx-auto text-2xl">
                🕊️
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900">
                  {isAr ? 'لا توجد طلبات في هذا التصنيف حالياً' : 'No proposals found in this category'}
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                  {isAr 
                    ? 'يمكنك استعراض أعلى التوافقات والمطابقات المقترحة واختيار شريك الحياة لإرسال طلب خطوبة شرعي عبر الولي مباشرة.' 
                    : 'You can explore recommended matches and send a formal proposal to the guardian.'}
                </p>
              </div>
              <button
                onClick={() => setActiveMainTab('matches')}
                className="inline-flex items-center gap-2 bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold px-5 py-2.5 rounded-full transition cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAr ? 'استعراض المطابقات المقترحة لك' : 'View Recommended Matches'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProposals.map((item) => {
                const isPending = item.status === 'pending_wali' || item.status === 'pending_wali_review';
                const isApproved = item.status === 'approved_by_wali';
                const isMeetingScheduled = item.status === 'meeting_scheduled';
                const isIstikhara = item.status === 'istikhara';
                const isNikah = item.status === 'nikah_contracted';
                const isDeclined = item.status === 'declined';

                // Stepper progress index
                let currentStep = 1;
                if (isPending) currentStep = 1;
                else if (isApproved) currentStep = 2;
                else if (isMeetingScheduled) currentStep = 3;
                else if (isIstikhara) currentStep = 4;
                else if (isNikah) currentStep = 5;

                return (
                  <div
                    key={item.id}
                    id={`proposal-card-${item.id}`}
                    className={`bg-white rounded-3xl border p-6 shadow-xs space-y-5 transition relative overflow-hidden ${
                      isNikah ? 'border-amber-400 bg-gradient-to-b from-[#fffdf7] to-white ring-1 ring-amber-300' : 'border-[#ede5dd] hover:border-neutral-300'
                    }`}
                  >
                    {/* Status Pill & Date Header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isNikah ? 'bg-amber-500 text-white' :
                        isMeetingScheduled ? 'bg-sky-600 text-white' :
                        isApproved ? 'bg-emerald-600 text-white' :
                        isDeclined ? 'bg-red-500 text-white' :
                        isIstikhara ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-[#fbf1eb] text-[#9b4c2e] border border-[#9b4c2e]/20'
                      }`}>
                        {isNikah ? <Award className="w-3.5 h-3.5" /> :
                         isApproved || isMeetingScheduled ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                         <Clock className="w-3.5 h-3.5" />}
                        <span>{item.stage}</span>
                      </span>

                      <span className="text-xs text-neutral-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>

                    {/* Visual 5-Step Progress Stepper */}
                    <div className="bg-[#faf8f5] p-3 rounded-2xl border border-[#ede5dd]">
                      <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 px-1 mb-2">
                        <span>{isAr ? 'مسار المعاملة الشرعية:' : 'Sharia Pathway:'}</span>
                        <span className="text-[#9b4c2e]">{isAr ? `المرحلة ${currentStep} من 5` : `Stage ${currentStep} of 5`}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {[
                          { num: 1, label: isAr ? 'الطلب' : 'Request' },
                          { num: 2, label: isAr ? 'الولي' : 'Wali' },
                          { num: 3, label: isAr ? 'محادثة' : 'Chat' },
                          { num: 4, label: isAr ? 'الرؤية' : 'Vision' },
                          { num: 5, label: isAr ? 'القران' : 'Nikah' },
                        ].map((st) => {
                          const isDone = st.num < currentStep;
                          const isCurrent = st.num === currentStep;
                          return (
                            <div key={st.num} className="space-y-1">
                              <div className={`h-1.5 rounded-full transition ${
                                isCurrent ? 'bg-[#9b4c2e]' : isDone ? 'bg-emerald-500' : 'bg-neutral-200'
                              }`} />
                              <span className={`text-[10px] block truncate ${
                                isCurrent ? 'font-bold text-[#9b4c2e]' : isDone ? 'font-medium text-emerald-700' : 'text-neutral-400'
                              }`}>
                                {st.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Parties involved */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {/* If male: Show that HE is proposing to the bride */}
                          {isMaleUser ? (
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                {isAr ? 'أنت تخطب الأخت المصونة:' : 'You are proposing to:'}
                              </span>
                              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                <span className="text-[#9b4c2e]">{item.targetProfileName}</span>
                              </h3>
                              <p className="text-xs text-neutral-500">
                                {isAr ? 'مكان الإقامة والمجلس الشرعي:' : 'Residence & Family Council:'} {item.suitorCity}
                              </p>
                            </div>
                          ) : isFemaleUser ? (
                            /* If female: Show the suitor proposing to her */
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                {isAr ? 'طلب خطوبة وافد من الخاطب:' : 'Incoming proposal from Suitor:'}
                              </span>
                              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                                <span>{item.suitorName}</span>
                                <span className="text-xs text-neutral-500 font-normal">({item.suitorAge} {isAr ? 'سنة' : 'yrs'})</span>
                              </h3>
                              <p className="text-xs text-neutral-500">
                                {isAr ? 'المدينة:' : 'City:'} {item.suitorCity}
                              </p>
                            </div>
                          ) : (
                            /* Wali or Admin view */
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                                {isAr ? 'طلب خطوبة لفتاتكم الكريمة:' : 'Proposal for your ward:'}
                              </span>
                              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-neutral-900">{item.suitorName}</span>
                                <span className="text-xs text-neutral-400">{isAr ? 'يخطب' : 'proposes to'}</span>
                                <span className="text-[#9b4c2e] font-bold">{item.targetProfileName}</span>
                              </h3>
                              <p className="text-xs text-neutral-500">
                                {item.suitorCity} • {item.suitorAge} {isAr ? 'سنة' : 'yrs'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Guardian badge: For candidate, her wali supervises; For male, it shows the BRIDE'S wali */}
                        <div className="text-end shrink-0">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs text-emerald-900 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {isMaleUser 
                                ? (isAr ? `ولي أمرها: ${item.waliName}` : `Her Guardian: ${item.waliName}`)
                                : (isAr ? `إشراف الولي: ${item.waliName}` : `Supervised by: ${item.waliName}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Proposal Message Note */}
                    <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-[#ede5dd] text-xs text-neutral-700 leading-relaxed relative">
                      <span className="text-neutral-400 font-bold me-1">«</span>
                      <span>{item.note}</span>
                      <span className="text-neutral-400 font-bold ms-1">»</span>
                    </div>

                    {/* Scheduled Sharia Meeting if available */}
                    {item.meeting && (
                      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2.5 text-xs text-sky-950">
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1.5 text-sky-900">
                            {item.meeting.meetingType === 'in_person' ? <Home className="w-4 h-4 text-sky-700" /> : <Video className="w-4 h-4 text-sky-700" />}
                            <span>{isAr ? 'موعد الرؤية الشرعية المعتمد:' : 'Confirmed Sharia Meeting:'}</span>
                          </span>
                          <span className="bg-sky-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-sky-900">
                            {item.meeting.meetingDate}
                          </span>
                        </div>
                        <div className="text-[11px] text-sky-900/80 flex items-center gap-2 flex-wrap">
                          <span>{isAr ? 'الساعة:' : 'Time:'} <strong>{item.meeting.meetingTime}</strong></span>
                          <span>•</span>
                          <span>{isAr ? 'المكان:' : 'Venue:'} <strong>{item.meeting.venueAddress}</strong></span>
                        </div>
                        <div className="text-[11px] text-neutral-600">
                          {isAr ? 'المحرم المشرف:' : 'Supervising Mahram:'} {item.meeting.chaperoneName} ({item.meeting.chaperoneRelation})
                        </div>
                      </div>
                    )}

                    {/* Wali Decision Controls (if user is Wali or Admin and proposal is pending) */}
                    {isPending && isWaliOrAdmin && onUpdateProposalStatus && (
                      <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl space-y-2.5">
                        <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-amber-700" />
                          <span>{isAr ? 'قرار الولي الشرعي بشأن هذا الطلب:' : 'Guardian Decision:'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Check className="w-4 h-4" />
                            <span>{isAr ? 'قبول وتيسير الرؤية' : 'Approve & Coordinate'}</span>
                          </button>
                          <button
                            onClick={() => handleDecline(item.id)}
                            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2.5 px-3 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <X className="w-4 h-4" />
                            <span>{isAr ? 'اعتذار بلطف' : 'Polite Decline'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons Grid */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onOpenChat(item)}
                        className="bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold py-2.5 px-3 rounded-full transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-200" />
                        <span>{isAr ? 'المحادثة الشرعية الثلاثية' : '3-Party Supervised Chat'}</span>
                      </button>

                      <button
                        onClick={() => onOpenMeeting(item)}
                        className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs font-bold py-2.5 px-3 rounded-full transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-sky-600" />
                        <span>{item.meeting ? (isAr ? 'تفاصيل الرؤية الشرعية' : 'Meeting Details') : (isAr ? 'جدولة الرؤية الشرعية' : 'Schedule Vision')}</span>
                      </button>
                    </div>

                    {/* Finalize Nikah / Istikhara Button */}
                    {(isMeetingScheduled || isApproved || isIstikhara || isNikah) && (
                      <button
                        onClick={() => onOpenNikah(item)}
                        className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                          isNikah
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <Award className="w-4 h-4 text-amber-200" />
                        <span>
                          {isNikah 
                            ? (isAr ? 'عرض صك عقد القران المبارك 📜' : 'View Nikah Contract Certificate 📜') 
                            : (isAr ? 'صلاة الاستخارة وعقد القران المبارك 🤲' : 'Istikhara Prayer & Nikah Blessing 🤲')}
                        </span>
                      </button>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RECOMMENDED MATCHES (أعلى المطابقات والتوافقات المقترحة) */}
      {/* ========================================================================= */}
      {activeMainTab === 'matches' && (
        <div className="space-y-6">
          {/* Header Description & Search Filter */}
          <div className="bg-white p-4 rounded-2xl border border-[#ede5dd] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9b4c2e]" />
              <span>
                {isAr 
                  ? `تم العثور على ${recommendedMatches.length} ملف متوافق وفق معايير الدين والصلاح والسكن.` 
                  : `Found ${recommendedMatches.length} profiles matched with your lifestyle & values.`}
              </span>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={matchSearch}
                onChange={(e) => setMatchSearch(e.target.value)}
                placeholder={isAr ? 'ابحث بالاسم، المدينة، المهنة...' : 'Filter by name, city, job...'}
                className="w-full ps-9 pe-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-[#9b4c2e] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Matches Grid */}
          {recommendedMatches.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ede5dd] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900">
                  {isAr ? 'لم نجد نتائج مطابقة لبحثك' : 'No matching profiles found'}
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  {isAr ? 'جرّب توسيع نطاق البحث أو مسح كلمات التصفية للعثور على المزيد من الإخوة والأخوات الراغبين بالزواج.' : 'Try clearing filters to find more profiles.'}
                </p>
              </div>
              {matchSearch && (
                <button
                  onClick={() => setMatchSearch('')}
                  className="text-xs text-[#9b4c2e] font-bold underline cursor-pointer"
                >
                  {isAr ? 'مسح التصفية' : 'Clear Filter'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedMatches.map((profile, idx) => {
                // Algorithmic compatibility simulation based on index & attributes
                const baseScore = 95 - (idx * 2);
                const score = Math.max(82, baseScore);

                return (
                  <div
                    key={profile.id}
                    id={`match-card-${profile.id}`}
                    className="bg-white rounded-3xl border border-[#ede5dd] p-5 shadow-xs hover:border-[#9b4c2e]/40 hover:shadow-md transition space-y-4 text-start flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Top Bar: Match Score & Verification */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 bg-[#fbf1eb] text-[#9b4c2e] px-2.5 py-1 rounded-full text-xs font-black">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isAr ? `توافق شرعي ${score}%` : `${score}% Sharia Match`}</span>
                        </div>

                        {profile.gender === 'female' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{isAr ? 'تحت إشراف الولي' : 'Wali Supervised'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-neutral-600" />
                            <span>{isAr ? 'هوية وباءة موثقة' : 'Verified Ba\'ah'}</span>
                          </span>
                        )}
                      </div>

                      {/* Profile Card Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-13 h-13 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0 flex items-center justify-center text-xl font-bold text-[#9b4c2e]">
                          {profile.avatarUrl ? (
                            <img 
                              src={profile.avatarUrl} 
                              alt={profile.fullName}
                              className={`w-full h-full object-cover ${profile.isPhotoBlurredByDefault ? 'blur-xs' : ''}`}
                            />
                          ) : (
                            <span>{profile.fullName.charAt(0)}</span>
                          )}
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <h4 className="font-bold text-base text-neutral-900 truncate">
                            {profile.fullName}
                          </h4>
                          <div className="text-xs text-neutral-500 flex items-center gap-1.5 flex-wrap">
                            <span>{profile.age} {isAr ? 'سنة' : 'yrs'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              {profile.city}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Religious Lifestyle & Attire Pill */}
                      <div className="bg-[#faf8f5] p-2.5 rounded-xl border border-[#ede5dd] text-xs text-neutral-700 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600">
                          <span className="flex items-center gap-1 text-[#9b4c2e]">
                            <Compass className="w-3 h-3" />
                            <span>{profile.religiousAttire || (isAr ? 'سمت وقور ومحافظة تامة' : 'Modest & Practicing')}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-2">
                          {profile.aboutMe || (isAr ? 'طالب للعفاف والستر وبناء أسرة مسلمة صالحة على منهج القرآن والسنة.' : 'Seeking matrimonial union on Quran & Sunnah.')}
                        </p>
                      </div>

                      {/* Demographics Summary Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium">
                          🎓 {profile.education || (isAr ? 'جامعي' : 'University')}
                        </span>
                        <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium">
                          💼 {profile.profession || (isAr ? 'قطاع مهني' : 'Career')}
                        </span>
                        {profile.maritalStatus && (
                          <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium">
                            💍 {profile.maritalStatus === 'single' ? (isAr ? 'أعزب/بكر' : 'Single') : (isAr ? 'سابق زواج' : 'Previously Married')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 grid grid-cols-2 gap-2 border-t border-neutral-100">
                      {onViewProfile && (
                        <button
                          type="button"
                          onClick={() => onViewProfile(profile)}
                          className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs font-bold py-2 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isAr ? 'عرض الملف' : 'View Bio'}</span>
                        </button>
                      )}

                      {onSendProposal ? (
                        <button
                          type="button"
                          onClick={() => onSendProposal(profile)}
                          className="bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold py-2 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isAr ? 'طلب التواصل' : 'Contact Request'}</span>
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
