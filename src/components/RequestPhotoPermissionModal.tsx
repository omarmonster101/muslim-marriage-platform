import React, { useState } from 'react';
import { Profile, Language, UserSession } from '../types';
import { 
  Eye, 
  ShieldCheck, 
  Lock, 
  Send, 
  X, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface RequestPhotoPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: Profile;
  currentSession: UserSession;
  lang: Language;
  onSubmitRequest: (
    targetProfile: Profile, 
    note: string, 
    suitorDetails?: { name?: string; phone?: string; city?: string }
  ) => void;
  onRequireLogin?: () => void;
}

export const RequestPhotoPermissionModal: React.FC<RequestPhotoPermissionModalProps> = ({
  isOpen,
  onClose,
  targetProfile,
  currentSession,
  lang,
  onSubmitRequest,
  onRequireLogin
}) => {
  const isAr = lang === 'ar';

  const [suitorName, setSuitorName] = useState(
    currentSession && currentSession.role !== 'guest' ? currentSession.name : ''
  );
  const [suitorPhone, setSuitorPhone] = useState(currentSession?.phone || '');
  const [suitorCity, setSuitorCity] = useState(isAr ? 'الرياض' : 'Riyadh');
  const [requestNote, setRequestNote] = useState(
    isAr
      ? `السلام عليكم ورحمة الله وبركاته، يشرفني الاستئذان من الأخت الكريمة ${targetProfile.fullName} وولي أمرها الكريم للاطلاع على الصورة الشخصية بداعي الرؤية الشرعية الجادة والهادفة للزواج على كتاب الله وسنة رسوله ﷺ.`
      : `Peace be upon you. I respectfully request permission from ${targetProfile.fullName} and her esteemed guardian to view the profile photo for serious matrimonial intention according to the Sunnah.`
  );
  const [shariaPledgeAccepted, setShariaPledgeAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSession.role === 'guest' && onRequireLogin && (!suitorName.trim() || !suitorPhone.trim())) {
      onRequireLogin();
      return;
    }

    if (!shariaPledgeAccepted) {
      alert(isAr ? 'يرجى الإقرار بالتعهد الشرعي بحفظ الأمانة وصون الصورة.' : 'Please acknowledge the Sharia privacy pledge.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitRequest(targetProfile, requestNote, {
        name: suitorName.trim() || undefined,
        phone: suitorPhone.trim() || undefined,
        city: suitorCity.trim() || undefined
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      fireCelebrationConfetti();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-[#ede5dd] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#faf7f3] via-amber-50/40 to-white border-b border-[#ede5dd] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#9b4c2e]/10 text-[#9b4c2e] flex items-center justify-center shrink-0 border border-[#9b4c2e]/20">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                {isAr ? 'طلب السماح برؤية الصورة الشرعية' : 'Request Photo Reveal Permission'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isAr ? 'إجراء شرعي لصون العفاف واستئذان الولي' : 'Sharia consent procedure with guardian oversight'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-neutral-900">
                {isAr ? 'تم إرسال طلب الرؤية بنجاح!' : 'Photo Request Submitted!'}
              </h4>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                {isAr 
                  ? `تم إشعار الأخت (${targetProfile.fullName}) ومجلس ولي أمرها الكرام بالطلب. سيصلك إشعار فور مراجعة الطلب والموافقة على كشف الصورة.`
                  : `Guardian and candidate have been notified. You will be alerted upon approval.`}
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-block text-[11px] font-bold text-[#9b4c2e] bg-[#fbf1eb] px-3.5 py-1.5 rounded-full">
                {isAr ? 'جزاكم الله خيراً على حفظ الأمانة' : 'Thank you for honoring Islamic modesty'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-start">
            
            {/* Candidate Card Summary */}
            <div className="p-3.5 rounded-2xl bg-[#faf7f3] border border-[#ede5dd] flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                <img
                  src={targetProfile.avatarUrl}
                  alt={targetProfile.fullName}
                  className="w-full h-full object-cover filter blur-xs"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-amber-300" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-neutral-900 truncate">
                    {targetProfile.fullName}
                  </span>
                  <span className="text-[10px] bg-rose-50 text-[#9b4c2e] px-2 py-0.5 rounded-full font-bold">
                    {targetProfile.age} {isAr ? 'سنة' : 'yrs'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 truncate">
                  {targetProfile.city}، {targetProfile.country} • {targetProfile.profession}
                </p>
                {targetProfile.wali?.name && (
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                    {isAr ? `إشراف الولي: ${targetProfile.wali.name}` : `Guardian: ${targetProfile.wali.name}`}
                  </p>
                )}
              </div>
            </div>

            {/* Hadith Banner */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed">
              <div className="font-bold flex items-center gap-1 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{isAr ? 'الهدي النبوي في الرؤية الشرعية:' : 'Prophetic Guidance on Vision:'}</span>
              </div>
              <p className="italic">
                {isAr
                  ? '«إذا خطَبَ أحدُكم المرأةَ، فإنِ استطاع أن ينظُرَ إلى ما يَدعوه إلى نكاحِها فلْيفعلْ» (رواه أبو داود).'
                  : '“If one of you proposes to a woman, and he is able to look at that which will induce him to marry her, let him do so.”'}
              </p>
            </div>

            {/* Guest Form inputs if not logged in */}
            {currentSession.role === 'guest' && (
              <div className="space-y-3 pt-1 border-t border-neutral-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {isAr ? 'اسمك الكريم' : 'Your Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={suitorName}
                      onChange={(e) => setSuitorName(e.target.value)}
                      placeholder={isAr ? 'مثال: عبدالله الشمري' : 'e.g. Abdullah'}
                      className="w-full text-xs p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-[#9b4c2e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {isAr ? 'رقم هاتفك للتنسيق' : 'Your Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      value={suitorPhone}
                      onChange={(e) => setSuitorPhone(e.target.value)}
                      placeholder="+966 50 ..."
                      className="w-full text-xs p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-[#9b4c2e] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Respectful Note */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isAr ? 'رسالة طلب الاستئذان الموجهة للأخت والولي:' : 'Permission Request Note:'}
              </label>
              <textarea
                rows={3}
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-[#9b4c2e] focus:outline-none leading-relaxed"
                placeholder={isAr ? 'اكتب رسالة محتشمة توضح جديتك...' : 'Enter respectful note...'}
              />
            </div>

            {/* Sharia Pledge Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100/60 transition cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shariaPledgeAccepted}
                onChange={(e) => setShariaPledgeAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#9b4c2e] accent-[#9b4c2e] cursor-pointer"
              />
              <span className="text-[11px] text-neutral-700 leading-snug">
                {isAr 
                  ? 'أتعهد أمام الله تعالى بأن طلبي هذا قاصد للعفاف والنكاح الشرعي، وألتزم التزاماً دينياً وأخلاقياً بستر الصورة وعدم تصويرها أو مشاركتها بأي وجه.'
                  : 'I solemnly pledge before Allah that this request is purely for lawful marriage and I strictly commit to honoring privacy without capturing or sharing photos.'}
              </span>
            </label>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold transition cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !shariaPledgeAccepted}
                className="px-6 py-2.5 rounded-xl bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال طلب الاستئذان' : 'Submit Request')}</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
