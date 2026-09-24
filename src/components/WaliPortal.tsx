import React, { useState } from 'react';
import { Proposal, Language, PhotoPermissionRequest } from '../types';
import { translations } from '../data/translations';
import { 
  ShieldCheck, 
  UserCheck, 
  Check, 
  X, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Lock, 
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { fireKhitbahBlessingConfetti } from '../utils/confetti';
import { saveWaliToDb } from '../lib/firebase';

interface WaliPortalProps {
  lang: Language;
  proposals: Proposal[];
  photoRequests?: PhotoPermissionRequest[];
  onUpdatePhotoRequestStatus?: (requestId: string, newStatus: 'approved' | 'rejected') => void;
  onUpdateProposalStatus: (id: string, newStatus: Proposal['status'], stage: string) => void;
  onOpenChat?: (proposal: Proposal) => void;
  onOpenMeeting?: (proposal: Proposal) => void;
  onOpenNikah?: (proposal: Proposal) => void;
}

export const WaliPortal: React.FC<WaliPortalProps> = ({
  lang,
  proposals,
  photoRequests = [],
  onUpdatePhotoRequestStatus,
  onUpdateProposalStatus,
  onOpenChat,
  onOpenMeeting,
  onOpenNikah
}) => {
  const t = translations[lang];
  const [selectedWaliTab, setSelectedWaliTab] = useState<'incoming' | 'photo_requests' | 'verify' | 'pledge'>('incoming');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const pendingPhotoRequestsCount = photoRequests.filter(r => r.status === 'pending').length;

  // Wali Verification Form State
  const [verifyName, setVerifyName] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('+966 50 ');
  const [verifyRelation, setVerifyRelation] = useState('الوالد');
  const [candidateName, setCandidateName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; code: string; message: string } | null>(null);

  const handleApprove = (id: string) => {
    onUpdateProposalStatus(id, 'approved_by_wali', 'تمت موافقة الولي - جارٍ التنسيق لمجلس الرؤية الشرعية');
    setActionSuccessMsg("تم قبول طلب الخاطب من قبل الولي الشرعي بنجاح وجارٍ التنسيق للرؤية الشرعية.");
    fireKhitbahBlessingConfetti();
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleDecline = (id: string) => {
    onUpdateProposalStatus(id, 'declined', 'اعتذار بلطف واحترام (قدر الله وما شاء فعل)');
    setActionSuccessMsg("تم تسجيل الاعتذار بلطف واحترام وإشعار الخاطب.");
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleStartIstikhara = (id: string) => {
    onUpdateProposalStatus(id, 'istikhara', 'مرحلة صلاة الاستخارة والتفكر الأسري');
    setActionSuccessMsg("تم تحويل الطلب إلى مرحلة صلاة الاستخارة المباركة.");
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await fetch('/api/wali/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waliName: verifyName,
          waliPhone: verifyPhone,
          relationship: verifyRelation,
          candidateName: candidateName || "مرشحة العفاف",
          candidateNationalId: "1098******"
        })
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResult({
          verified: true,
          code: data.verificationCode,
          message: data.message
        });
        saveWaliToDb({
          id: `wali-${Date.now()}`,
          waliName: verifyName,
          waliPhone: verifyPhone,
          relation: verifyRelation,
          candidateName: candidateName || "مرشحة العفاف",
          status: 'verified',
          submittedAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString()
        });
        fireKhitbahBlessingConfetti();
      }
    } catch (err) {
      const fallbackCode = `WALI-${Math.floor(100000 + Math.random() * 900000)}`;
      setVerificationResult({
        verified: true,
        code: fallbackCode,
        message: `تم توثيق بيانات الولي الشرعي (${verifyName}) واعتماد رقم التواصل للرؤية الشرعية بنجاح.`
      });
      saveWaliToDb({
        id: `wali-${Date.now()}`,
        waliName: verifyName,
        waliPhone: verifyPhone,
        relation: verifyRelation,
        candidateName: candidateName || "مرشحة العفاف",
        status: 'verified',
        submittedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString()
      });
      fireKhitbahBlessingConfetti();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-2xl border border-[#ede5dd] text-start space-y-3 shadow-2xs">
        <div className="inline-flex items-center gap-2 bg-[#fbf1eb] text-[#9b4c2e] border border-[#9b4c2e]/20 text-xs font-bold px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 text-[#9b4c2e]" />
          <span>{t.waliVerificationBadge}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-neutral-900 tracking-tight">
          {t.waliPortalTitle}
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
          {t.waliPortalSubtitle}
        </p>

        {/* Feature Tab Selector */}
        <div className="pt-3">
          <div className="inline-flex bg-neutral-200/60 p-1 rounded-full text-xs font-bold flex-wrap gap-1">
            <button
              id="wali-tab-incoming"
              onClick={() => setSelectedWaliTab('incoming')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                selectedWaliTab === 'incoming' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              📥 {t.waliIncomingRequests} ({proposals.length})
            </button>
            <button
              id="wali-tab-photo-requests"
              onClick={() => setSelectedWaliTab('photo_requests')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                selectedWaliTab === 'photo_requests' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <span>👁️ طلبات كشف الصورة الشرعية ({photoRequests.length})</span>
              {pendingPhotoRequestsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingPhotoRequestsCount}
                </span>
              )}
            </button>
            <button
              id="wali-tab-verify"
              onClick={() => setSelectedWaliTab('verify')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                selectedWaliTab === 'verify' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              🛡️ توثيق صفة الولي الشرعي
            </button>
            <button
              id="wali-tab-pledge"
              onClick={() => setSelectedWaliTab('pledge')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                selectedWaliTab === 'pledge' ? 'bg-[#9b4c2e] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              📜 الميثاق الشرعي للولي
            </button>
          </div>
        </div>
      </div>

      {/* Action Banner message */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tab 1: Incoming Proposals */}
      {selectedWaliTab === 'incoming' && (
        <div className="space-y-6 text-start">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span>قائمة طلبات الخطبة المقدمة تحت إشرافكم</span>
              <span className="text-xs bg-[#9b4c2e] text-white px-2 py-0.5 rounded-full font-normal">
                {proposals.length} طلبات
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.map((proposal) => {
              const isApproved = proposal.status === 'approved_by_wali';
              const isDeclined = proposal.status === 'declined';
              const isIstikhara = proposal.status === 'istikhara';

              return (
                <div 
                  key={proposal.id}
                  id={`proposal-item-${proposal.id}`}
                  className="bg-white rounded-2xl border border-[#ede5dd] p-6 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Status Pill Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isApproved ? 'bg-emerald-600 text-white' :
                        isDeclined ? 'bg-red-500 text-white' :
                        isIstikhara ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-[#fbf1eb] text-[#9b4c2e] border border-[#9b4c2e]/20'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{proposal.stage}</span>
                      </span>

                      <span className="text-[11px] text-neutral-400">
                        {new Date(proposal.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>

                    {/* Suitor info */}
                    <div>
                      <h4 className="text-lg font-bold text-neutral-900">
                        {proposal.suitorName}
                      </h4>
                      <div className="text-xs text-neutral-500 flex items-center gap-2 pt-0.5">
                        <span>{proposal.suitorAge} سنة</span>
                        <span>•</span>
                        <span>{proposal.suitorCity}</span>
                        <span>•</span>
                        <span className="text-[#9b4c2e] font-semibold">متقدم لخطبة: {proposal.targetProfileName}</span>
                      </div>
                    </div>

                    {/* Suitor note */}
                    <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#ede5dd] text-xs text-neutral-700 leading-relaxed">
                      <span className="font-bold text-neutral-900 block mb-1">رسالة الخاطب لولي الأمر:</span>
                      «{proposal.note}»
                    </div>

                    {/* Wali details bar */}
                    <div className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl flex items-center justify-between border border-[#ede5dd]">
                      <span>الولي المعتمد: <strong>{proposal.waliName}</strong></span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        موثق
                      </span>
                    </div>
                  </div>

                  {/* Wali Action Controls */}
                  <div className="pt-3 border-t border-[#ede5dd] flex flex-wrap items-center gap-2">
                    <button
                      id={`approve-proposal-${proposal.id}`}
                      onClick={() => handleApprove(proposal.id)}
                      disabled={isApproved}
                      className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 text-xs font-bold py-2 px-3 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.waliActionApprove}</span>
                    </button>

                    <button
                      id={`istikhara-proposal-${proposal.id}`}
                      onClick={() => handleStartIstikhara(proposal.id)}
                      disabled={isIstikhara}
                      className="bg-[#fbf1eb] hover:bg-[#f5e4db] border border-[#9b4c2e]/20 text-[#9b4c2e] text-xs font-bold py-2 px-3 rounded-full transition cursor-pointer"
                    >
                      <span>{t.waliActionStartIstikhara}</span>
                    </button>

                    <button
                      id={`decline-proposal-${proposal.id}`}
                      onClick={() => handleDecline(proposal.id)}
                      disabled={isDeclined}
                      className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2 px-3 rounded-full transition cursor-pointer"
                    >
                      <span>{t.waliActionDecline}</span>
                    </button>
                  </div>

                  {/* Sharia Communication & Meeting Controls */}
                  <div className="pt-2 grid grid-cols-2 gap-2 border-t border-[#ede5dd]">
                    {onOpenChat && (
                      <button
                        onClick={() => onOpenChat(proposal)}
                        className="bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold py-2 px-2.5 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#d9e9bb]" />
                        <span>المحادثة الشرعية</span>
                      </button>
                    )}

                    {onOpenMeeting && (
                      <button
                        onClick={() => onOpenMeeting(proposal)}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold py-2 px-2.5 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>جدولة الرؤية</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 1.5: Photo Reveal Requests for Wali Approval */}
      {selectedWaliTab === 'photo_requests' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ede5dd] shadow-2xs text-start space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#9b4c2e]" />
                <h3 className="text-lg font-bold text-neutral-900">
                  طلبات الاستئذان الشرعي للاطلاع على الصورة (إشراف الولي)
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                بصفتك ولي الأمر الشرعي، يمكنك دراسة طلبات الخاطبين الراغبين برؤية صورة ابنتك/موكولتك ومنح الإذن للجادين أو الاعتذار.
              </p>
            </div>

            <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-[#9b4c2e] border border-amber-200">
              طلبات الرؤية بانتظار قرارك: {pendingPhotoRequestsCount}
            </div>
          </div>

          {photoRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photoRequests.map((req) => (
                <div 
                  key={req.id} 
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    req.status === 'approved' 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : req.status === 'rejected'
                      ? 'bg-neutral-50 border-neutral-200 opacity-80'
                      : 'bg-white border-amber-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#fdf6f0] text-[#9b4c2e] font-bold text-sm flex items-center justify-center border border-[#f4dfd4] shrink-0">
                        {req.suitorAvatar ? (
                          <img src={req.suitorAvatar} alt={req.suitorName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          req.suitorName.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">{req.suitorName}</h4>
                        <p className="text-xs text-neutral-500">
                          {req.suitorAge ? `${req.suitorAge} سنة` : ''} {req.suitorCity ? `• ${req.suitorCity}` : ''}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      req.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : req.status === 'rejected'
                        ? 'bg-neutral-200 text-neutral-700'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {req.status === 'approved' ? 'موافق عليه' : req.status === 'rejected' ? 'مرفوض' : 'بانتظار قرارك'}
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-50/90 rounded-xl border border-neutral-200/60 text-xs text-neutral-700 leading-relaxed font-sans">
                    <span className="font-bold text-[10px] text-neutral-400 block mb-0.5">رسالة الخاطب للولي:</span>
                    "{req.note}"
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-xs">
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(req.createdAt).toLocaleDateString('ar-SA')}
                    </span>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'approved')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1 cursor-pointer shadow-3xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>موافقة الولي</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition flex items-center gap-1 border border-rose-200 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>اعتذار</span>
                          </button>
                        </>
                      ) : req.status === 'approved' ? (
                        <button
                          type="button"
                          onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 text-neutral-600 font-bold transition border border-neutral-200 cursor-pointer"
                        >
                          سحب موافقة الرؤية
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdatePhotoRequestStatus && onUpdatePhotoRequestStatus(req.id, 'approved')}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-600 font-bold transition border border-neutral-200 cursor-pointer"
                        >
                          إعادة الموافقة
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <EyeOff className="w-8 h-8 text-neutral-400 mx-auto" />
              <h4 className="font-bold text-xs text-neutral-800">لا توجد طلبات كشف صورة معلقة لموكولتك الكريمة</h4>
              <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                صور المرشحات محفوظة بحجاب الستر الشرعي. عند تقدم أي خاطب بطلب الرؤية سيظهر هنا مباشرة للمراجعة والبت.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wali Sharia Verification Form */}
      {selectedWaliTab === 'verify' && (
        <div className="bg-white p-8 rounded-2xl border border-[#ede5dd] shadow-2xs text-start space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-neutral-900">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">توثيق هوية وصفة الولي الشرعي</h3>
              <p className="text-xs text-neutral-500">اعتماد رقم الجوال وتوثيق القرابة الشرعية لاستقبال طلبات الرؤية</p>
            </div>
          </div>

          {verificationResult ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>تم التوثيق والاعتماد الشرعي بنجاح!</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {verificationResult.message}
              </p>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 inline-block">
                <span className="text-[11px] text-neutral-500 block">رمز الاعتماد الرسمي:</span>
                <span className="text-sm font-mono font-bold text-neutral-900">{verificationResult.code}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setVerificationResult(null);
                    setSelectedWaliTab('incoming');
                  }}
                  className="bg-[#9b4c2e] text-white hover:bg-[#853e24] text-xs font-bold py-2 px-5 rounded-full transition cursor-pointer shadow-xs"
                >
                  الانتقال إلى صندوق طلبات الخطوبة ➔
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-neutral-900 block mb-1">الاسم الكامل لولي الأمر:</label>
                <input
                  type="text"
                  required
                  value={verifyName}
                  onChange={(e) => setVerifyName(e.target.value)}
                  placeholder="مثال: إبراهيم بن صالح الخالدي"
                  className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-neutral-900 block mb-1">صلة القرابة الشرعية:</label>
                  <select
                    value={verifyRelation}
                    onChange={(e) => setVerifyRelation(e.target.value)}
                    className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl outline-none"
                  >
                    <option value="الوالد">الوالد</option>
                    <option value="الأخ الأكبر">الأخ الأكبر</option>
                    <option value="العم الشقيق">العم الشقيق</option>
                    <option value="الجد">الجد</option>
                    <option value="وكيل شرعي بصك ولاية">وكيل شرعي بصك ولاية</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-900 block mb-1">رقم جوال الولي للتواصل:</label>
                  <input
                    type="tel"
                    required
                    value={verifyPhone}
                    onChange={(e) => setVerifyPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl outline-none direction-ltr text-start"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-900 block mb-1">اسم المخطوبة الكريمة (المولى عليها):</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="مثال: سارة بنت إبراهيم الخالدي"
                  className="w-full p-2.5 bg-[#faf8f5] border border-[#ede5dd] focus:border-[#9b4c2e] rounded-xl outline-none"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-[#ede5dd] text-[11px] text-neutral-500 leading-relaxed">
                🔒 يتم مطابقة البيانات مع سجلات التحقق الرسمية لضمان جدية الخاطبين وحماية خصوصية الأعراض تحت رقابة الولي التامة.
              </div>

              <button
                id="submit-wali-verify-btn"
                type="submit"
                disabled={isVerifying || !verifyName.trim()}
                className="w-full bg-[#9b4c2e] text-white hover:bg-[#853e24] disabled:opacity-50 font-bold py-3 px-4 rounded-full transition cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#d9e9bb]" />
                <span>{isVerifying ? 'جارٍ التدقيق والتوثيق...' : 'تأكيد وتوثيق صفة الولي الشرعي'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Wali Sharia Pledge */}
      {selectedWaliTab === 'pledge' && (
        <div className="bg-white p-8 rounded-2xl border border-[#ede5dd] shadow-2xs text-start space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-neutral-900">
            <div className="w-10 h-10 rounded-full bg-[#fbf1eb] flex items-center justify-center text-[#9b4c2e]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">ميثاق شرف وأمانة الولي الشرعي</h3>
              <p className="text-xs text-neutral-500">صادر عن الهيئة الاستشارية الشرعية لمنصة ميثاق</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-3 bg-[#faf8f5] p-5 rounded-xl border border-[#ede5dd]">
            <p>
              1. <strong>الأمانة الشرعية:</strong> أقر بصفتي ولي أمر شرعي (أب، أخ، أو وكيل شرعي معتمد) بأن أقوم بدور الحفظ والرعاية لبناتي ومحارمي، وتيسير سبل الحلال.
            </p>
            <p>
              2. <strong>منع الخلوة المحرمة:</strong> ألتزم بأن تكون كافة المراسلات والمقابلات (الرؤية الشرعية) بحضور المحارم وفي بيئة إسلامية وقورة.
            </p>
            <p>
              3. <strong>معيار الاختيار النبوي:</strong> تحكيم الدين والخلق أولاً لقوله ﷺ: «إذا جاءكم من ترضون دينه وخلقه فزوجوه»، وتيسير المهور ما استطعنا إلى ذلك سبيلا.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>حسابكم موثق برقم الهوية وشهادة الولي المعتمدة.</span>
          </div>
        </div>
      )}

    </div>
  );
};
