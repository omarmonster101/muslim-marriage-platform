import React, { useState } from 'react';
import { Profile, Language } from '../types';
import { REPORT_REASONS } from '../data/referenceData';
import { Flag, X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  profile: Profile;
  currentUserId?: string;
  lang: Language;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  profile,
  currentUserId = 'guest-user',
  lang,
  onClose,
  onReportSubmitted
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('fake_profile');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId: currentUserId,
          reportedProfileId: profile.id,
          reason: selectedReason,
          details
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          onReportSubmitted();
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء رفع البلاغ');
      }
    } catch (err) {
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
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {lang === 'ar' ? 'إبلاغ عن سيرة أو سلوك مخالف' : 'Report Profile or Behavior'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? `البلاغ يخص: ${profile.fullName}` : `Reporting: ${profile.fullName}`}
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

        {/* Modal Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-neutral-900">
              {lang === 'ar' ? 'تم تسجيل البلاغ بنجاح' : 'Report Submitted'}
            </h4>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              {lang === 'ar' 
                ? 'جزاكم الله خيراً، ستتولى هيئة الرقابة الشرعية مراجعة الحساب والتدقيق في السيرة فوراً لاتخاذ الإجراء الحاسم.'
                : 'Thank you. The moderation team and Sharia board will inspect this profile promptly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            
            {/* Sharia Integrity Warning */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {lang === 'ar' 
                  ? 'تذكير شرعي: البلاغات أمانة أمام الله تعالى. يرجى تحري الصدق التام وتجنب الظن أو الكيد، فالمسلم مرآة أخيه.'
                  : 'Islamic Reminder: Reports are a solemn trust before Allah. Please be entirely truthful and avoid wrongful assumptions.'}
              </p>
            </div>

            {/* Reason Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                {lang === 'ar' ? 'سبب البلاغ المحدد:' : 'Reason for Report:'}
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {lang === 'ar' ? r.nameAr : r.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Details */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                {lang === 'ar' ? 'تفاصيل المخالفة والأدلة (اختياري):' : 'Details or Evidence (Optional):'}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder={lang === 'ar' ? 'وضح ما لاحظته لمساعدة المشرفين في التحقق...' : 'Describe what occurred to assist moderation...'}
                className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}

            {/* Footer Buttons */}
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
                className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isSubmitting ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'رفع البلاغ للإدارة' : 'Submit Report')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
