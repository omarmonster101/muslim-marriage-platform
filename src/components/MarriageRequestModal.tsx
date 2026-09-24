import React, { useState } from 'react';
import { Profile, Language } from '../types';
import { Send, X, Heart, ShieldCheck, CheckCircle2, User, Phone } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface MarriageRequestModalProps {
  profile: Profile;
  senderId?: string;
  lang: Language;
  onClose: () => void;
  onRequestSent: () => void;
}

export const MarriageRequestModal: React.FC<MarriageRequestModalProps> = ({
  profile,
  senderId = 'prof-1',
  lang,
  onClose,
  onRequestSent
}) => {
  const [note, setNote] = useState<string>(
    lang === 'ar' 
      ? 'السلام عليكم ورحمة الله وبركاته، يشرفني التقدم لخطبة ابنتكم الكريمة على كتاب الله وسنة رسوله ﷺ، وأرجو الاطلاع على سيرتي والتنسيق لمجلس الرؤية الشرعية.'
      : 'Peace be upon you. It is an honor to request honorable marriage following the Sunnah of the Prophet ﷺ. Please review my profile and coordinate with the respected guardian.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/marriage-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId,
          targetProfileId: profile.id,
          note
        })
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        fireCelebrationConfetti();
        setTimeout(() => {
          onRequestSent();
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء إرسال الطلب');
      }
    } catch (e) {
      setErrorMsg('فشل الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
              <Heart className="w-5 h-5 fill-emerald-800" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {lang === 'ar' ? 'إرسال طلب التواصل الشرعي' : 'Send Contact Request'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? `المخطوبة الكريمة: ${profile.fullName}` : `Candidate: ${profile.fullName}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {sent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-neutral-900">
              {lang === 'ar' ? 'تم إرسال طلب التواصل الشرعي بنجاح' : 'Contact Request Sent'}
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
              {lang === 'ar'
                ? `تم إشعار ولي أمر المخطوبة (${profile.wali?.name}) بالطلب. ستصلك رسالة حال اعتماد الولي لتحديد موعد مجلس الرؤية الشرعية بإذن الله.`
                : `The guardian (${profile.wali?.name}) has been notified. You will be updated once reviewed.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-4 sm:p-6 space-y-4">
            
            {/* Guardian Info Card */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl space-y-1 text-xs">
              <div className="flex items-center justify-between text-emerald-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'ar' ? 'إشراف الولي الشرعي المباشر:' : 'Direct Wali Oversight:'}</span>
                </span>
                <span className="text-[11px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full">
                  {lang === 'ar' ? 'موثق' : 'Verified'}
                </span>
              </div>
              <div className="text-neutral-700 flex items-center justify-between pt-1">
                <span>{lang === 'ar' ? 'اسم الولي:' : 'Guardian:'} <strong>{profile.wali?.name}</strong> ({profile.wali?.relation})</span>
                <span className="text-neutral-500 font-mono text-[11px]">{profile.city}</span>
              </div>
            </div>

            {/* Note text field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                {lang === 'ar' ? 'رسالة التقديم إلى ولي الأمر والمخطوبة:' : 'Introduction Note to Guardian & Candidate:'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                required
                className="w-full p-3 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden leading-relaxed resize-none"
              />
              <p className="text-[11px] text-neutral-500">
                {lang === 'ar' 
                  ? 'يُنصح بالتحلي بالأدب الإسلامي الرفيع وتوضيح الجدية والاستعداد لمجلس الرؤية بحضور المحارم.'
                  : 'Be respectful, serious, and ready for family-supervised introduction.'}
              </p>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال طلب التواصل' : 'Send Contact Request')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
