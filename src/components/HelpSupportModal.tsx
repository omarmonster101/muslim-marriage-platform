import React, { useState } from 'react';
import { Language } from '../types';
import { 
  HelpCircle, 
  X, 
  ShieldCheck, 
  HeartHandshake, 
  MessageCircle, 
  FileText, 
  ExternalLink,
  ChevronDown,
  PhoneCall,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onGoToFaq?: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  lang = 'ar',
  onGoToFaq
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const faqs = [
    {
      q: isAr ? 'كيف تضمن المنصة خصوصية وستر صور الأخوات؟' : 'How does the platform ensure privacy for sisters?',
      a: isAr 
        ? 'تُحجب وتُظلل صور الأخوات تلقائياً عن التصفح العام، ولا تُتاح الرؤية الشرعية الواضحة إلا للخاطب الجاد والموثق وبعد موافقة ولي الأمر الصريحة بحضور المحارم.'
        : 'Sisters\' photos are blurred by default and never displayed publicly. Clear vision is only granted to verified suitors after formal Wali consent.'
    },
    {
      q: isAr ? 'ما هو دور الولي الشرعي في متابعة الخطوبة؟' : 'What is the role of the legal guardian (Wali)?',
      a: isAr
        ? 'الولي ركن أساسي ومصان؛ يتلقى إشعاراً فورياً بكل طلب خطبة مع كامل بيانات السيرة والاستقامة، وله الصلاحية الكاملة لقبول أو رفض التواصل وتحديد مجلس الرؤية.'
        : 'The Wali is an essential pillar; he receives immediate notifications of proposals, full suitor background, and has authority to accept, decline, or arrange meetings.'
    },
    {
      q: isAr ? 'كيف يتم التحقق من جدية الخاطب وكفاءته؟' : 'How is suitor credibility and readiness verified?',
      a: isAr
        ? 'تخضع جميع الحسابات لمراجعة وتدقيق هاتفية وتوثيق للهوية الوطنية، مع اشتراط الإقرار بالباءة، الاستقامة على الصلوات، وتوفير المسكن الشرعي.'
        : 'All accounts undergo verification including phone check, national ID audit, and commitment to Islamic duties (prayers, financial readiness, and lodging).'
    },
    {
      q: isAr ? 'ما هي خطوات ترتيب جلسة الرؤية الشرعية؟' : 'What are the steps to arrange the Sharia vision meeting?',
      a: isAr
        ? 'بعد قبول الولي لطلب الخطوبة، يتم التنسيق لعقد مجلس الرؤية إما بحضور رسمي في منزل العائلة أو عبر جلسة اتصال موثقة برعاية الولي.'
        : 'Upon Wali approval, a formal meeting is scheduled at the family home or via a supervised virtual Sharia session with family presence.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ede5dd] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#9b4c2e] to-[#80381e] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>{isAr ? 'الإرشاد والمساعدة الشرعية' : 'Help & Islamic Guidance'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-cairo">
                {isAr ? 'مركز المساعدة والدعم' : 'Help & Support Center'}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                {isAr 
                  ? 'نسعد بمساعدتكم في كل خطوة لبناء بيت مسلم قائم على التقوى والمودة'
                  : 'We are here to assist you in building a blessed Islamic home'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Assistance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ede5dd] flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-[#fbf1eb] text-[#9b4c2e] flex items-center justify-center mb-2 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-neutral-900 mb-1">
                {isAr ? 'حماية وستر البيانات' : 'Privacy & Modesty'}
              </h4>
              <p className="text-[11px] text-neutral-500 leading-tight">
                {isAr ? 'تشفير كامل وضوابط عفة شرعية' : 'End-to-end modesty & privacy'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ede5dd] flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-neutral-900 mb-1">
                {isAr ? 'بوابة ولي الأمر' : 'Wali Oversight'}
              </h4>
              <p className="text-[11px] text-neutral-500 leading-tight">
                {isAr ? 'مشاركة وإشراف عائلي كامل' : 'Direct guardian verification'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ede5dd] flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-neutral-900 mb-1">
                {isAr ? 'مستشار التوافق' : 'Sharia Counselor'}
              </h4>
              <p className="text-[11px] text-neutral-500 leading-tight">
                {isAr ? 'إرشادات الاستخارة والمصاهرة' : 'Istikhara & Compatibility'}
              </p>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#9b4c2e]" />
              <span>{isAr ? 'أهم الأسئلة الشائعة' : 'Top Frequently Asked Questions'}</span>
            </h4>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-[#ede5dd] rounded-xl overflow-hidden bg-white transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-start flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-neutral-900 hover:bg-[#fcfbfa] cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#fbf1eb] text-[#9b4c2e] text-[11px] flex items-center justify-center font-mono shrink-0">
                          {idx + 1}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-[#9b4c2e]' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-[#faf8f5]/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Support Section */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900">
                  {isAr ? 'تحتاج لمساعدة مباشرة أو استشارة؟' : 'Need direct support or guidance?'}
                </h5>
                <p className="text-[11px] text-neutral-600">
                  {isAr 
                    ? 'فريق الدعم الشرعي متواجد يومياً من ٩ ص إلى ٩ م (بتوقيت مكة)'
                    : 'Sharia support team available 9am-9pm Mecca time'}
                </p>
              </div>
            </div>

            <a
              href="mailto:support@nikah-islamic.org"
              className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100/50 transition text-center shrink-0 shadow-2xs"
            >
              {isAr ? 'مراسلة الدعم الشرعي' : 'Contact Support'}
            </a>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#faf8f5] border-t border-[#ede5dd] flex items-center justify-between gap-3">
          {onGoToFaq ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToFaq();
              }}
              className="text-xs font-bold text-[#9b4c2e] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isAr ? 'استعراض كافة الأسئلة الشائعة في الصفحة الرئيسية ←' : 'View all FAQs on Home page →'}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
