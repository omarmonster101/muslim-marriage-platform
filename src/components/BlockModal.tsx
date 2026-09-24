import React, { useState } from 'react';
import { Profile, Language } from '../types';
import { Ban, X, CheckCircle2, ShieldOff } from 'lucide-react';

interface BlockModalProps {
  profile: Profile;
  currentUserId?: string;
  lang: Language;
  onClose: () => void;
  onBlockConfirmed: () => void;
}

export const BlockModal: React.FC<BlockModalProps> = ({
  profile,
  currentUserId = 'guest-user',
  lang,
  onClose,
  onBlockConfirmed
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleBlock = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockerId: currentUserId,
          blockedUserId: profile.id,
          reason: 'حظر باختيار المستخدم'
        })
      });
      const data = await res.json();
      if (data.success) {
        setBlocked(true);
        setTimeout(() => {
          onBlockConfirmed();
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء إجراء الحظر');
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
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-700 shrink-0">
              <Ban className="w-5 h-5 text-neutral-800" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {lang === 'ar' ? 'حظر هذا المستخدم' : 'Block this User'}
              </h3>
              <p className="text-xs text-neutral-500">
                {profile.fullName}
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
        {blocked ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-neutral-800" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">
              {lang === 'ar' ? 'تم الحظر بنجاح' : 'User Blocked'}
            </h4>
            <p className="text-xs text-neutral-600">
              {lang === 'ar'
                ? 'لن يظهر هذا الحساب لك في البحث ولن يتمكن من إرسال أي طلبات لك مستقبلاً.'
                : 'This user will no longer appear in your searches and cannot send you requests.'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-3.5 bg-neutral-100/70 rounded-xl text-xs text-neutral-700 space-y-2">
              <p className="font-semibold text-neutral-900">
                {lang === 'ar' ? 'عند حظر هذا الحساب:' : 'When you block this user:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>{lang === 'ar' ? 'لن يظهر ملفه في نتائج البحث والاستكشاف لديك.' : 'Their profile will be hidden from your search results.'}</li>
                <li>{lang === 'ar' ? 'لن يتمكن من إرسال أي طلبات زواج أو رسائل إليك.' : 'They will not be able to send you marriage requests or messages.'}</li>
                <li>{lang === 'ar' ? 'يمكنك إلغاء الحظر لاحقاً من قائمة الإعدادات.' : 'You can unblock them anytime from your settings.'}</li>
              </ul>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                {lang === 'ar' ? 'تراجع' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleBlock}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldOff className="w-4 h-4" />
                <span>{isSubmitting ? (lang === 'ar' ? 'جارٍ الحظر...' : 'Blocking...') : (lang === 'ar' ? 'تأكيد الحظر' : 'Confirm Block')}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
