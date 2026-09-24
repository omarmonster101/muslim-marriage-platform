import React, { useState } from 'react';
import { Proposal, Language, UserSession } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Video, 
  Home, 
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
  currentSession: UserSession;
  lang: Language;
  onMeetingScheduled: (proposalId: string, updatedProposal: Proposal) => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  proposal,
  currentSession,
  lang,
  onMeetingScheduled
}) => {
  const [meetingDate, setMeetingDate] = useState('الجمعة القادمة بعد صلاة العصر');
  const [meetingTime, setMeetingTime] = useState('04:30 مساءً');
  const [meetingType, setMeetingType] = useState<'in_person' | 'supervised_video'>('in_person');
  const [venueAddress, setVenueAddress] = useState(proposal ? `مجلس ${proposal.waliName} - حي النخيل، الرياض` : '');
  const [chaperoneName, setChaperoneName] = useState(proposal?.waliName || '');
  const [notes, setNotes] = useState('جلسة مباركة وفق هدي النبي ﷺ، بحضور الولي والمحارم الكرام.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/proposals/${proposal.id}/meeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingDate,
          meetingTime,
          meetingType,
          venueAddress,
          chaperoneName,
          notes
        })
      });
      const data = await res.json();
      if (data.success && data.proposal) {
        setSuccess(true);
        fireCelebrationConfetti();
        onMeetingScheduled(proposal.id, data.proposal);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error("Failed to schedule meeting:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-[20px] border border-black/15 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-black/10 bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">جدولة مجلس الرؤية الشرعية</h3>
              <p className="text-xs text-[#666666]">
                للخاطب <strong className="text-black">{proposal.suitorName}</strong> والمخطوبة <strong className="text-pink-700">{proposal.targetProfileName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition cursor-pointer text-[#888888] hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sharia Guideline Box */}
        <div className="bg-emerald-50 p-4 border-b border-emerald-100 text-xs text-emerald-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-emerald-950">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>الهدي النبوي الشريف في الرؤية الشرعية:</span>
          </div>
          <p className="leading-relaxed text-[#333333]">
            قال رسول الله ﷺ للمغيرة بن شعبة حين خطب امرأة: «انْظُرْ إِلَيْهَا؛ فَإِنَّهُ أَحْرَى أَنْ يُؤْدَمَ بَيْنَكُمَا». وتكون الرؤية بحضور الولي الشرعي أو أحد المحارم دون خلوة محرمة.
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-black">تم اعتماد موعد الرؤية الشرعية بنجاح!</h4>
            <p className="text-xs text-[#666666] max-w-sm mx-auto">
              تم إشعار الخاطب والولي برسائل رسمية وتحديث مسار الخطبة في المنصة. نسأل الله أن يكتب التوفيق والبركة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-start">
            
            {/* Meeting Type Selection */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                نوع مجلس الرؤية الشرعية
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMeetingType('in_person')}
                  className={`p-3 rounded-[10px] border text-start transition cursor-pointer flex items-center gap-2.5 ${
                    meetingType === 'in_person' ? 'bg-black text-white border-black font-bold' : 'bg-white border-black/15 text-[#555555]'
                  }`}
                >
                  <Home className="w-4 h-4 text-amber-300" />
                  <div>
                    <div className="text-xs">مجلس حضوري في بيت الولي</div>
                    <div className="text-[10px] opacity-70">الأصل النبوي والمستحب</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('supervised_video')}
                  className={`p-3 rounded-[10px] border text-start transition cursor-pointer flex items-center gap-2.5 ${
                    meetingType === 'supervised_video' ? 'bg-black text-white border-black font-bold' : 'bg-white border-black/15 text-[#555555]'
                  }`}
                >
                  <Video className="w-4 h-4 text-cyan-300" />
                  <div>
                    <div className="text-xs">اتصال مرئي مشفر بحضور المحرم</div>
                    <div className="text-[10px] opacity-70">للمسافات والمغتربين</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  تاريخ وموعد الرؤية (هجري/ميلادي)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-black/40" />
                  <input
                    type="text"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  التوقيت المقترح
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-3 text-black/40" />
                  <input
                    type="text"
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Address / Link */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                {meetingType === 'in_person' ? 'عنوان المجلس / موقع بيت الأسرة' : 'رابط الجلسة المرئية المشفرة'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-black/40" />
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Chaperone Name */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                المحرم / الولي الحاضر للمجلس
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-[#31c431]" />
                <input
                  type="text"
                  required
                  value={chaperoneName}
                  onChange={(e) => setChaperoneName(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Notes to Suitor */}
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                توجيهات أو رسالة ترحيبية للخاطب الكريم
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] p-2.5 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-black/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#666666] hover:bg-black/5 rounded-[8px] transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-black/85 disabled:opacity-50 text-white px-5 py-2.5 rounded-[8px] text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-partiful-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d9c58b]" />
                <span>{isSubmitting ? 'جارٍ الاعتماد...' : 'اعتماد موعد مجلس الرؤية الشرعية'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
