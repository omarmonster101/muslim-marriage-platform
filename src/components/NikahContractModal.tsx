import React, { useState } from 'react';
import { Proposal, Language, UserSession } from '../types';
import { 
  X, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Scroll, 
  ShieldCheck, 
  Award,
  Users,
  Feather
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { saveProposalToDb, saveCelebrationToDb } from '../lib/firebase';

interface NikahContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
  currentSession: UserSession;
  lang: Language;
  onNikahFinalized: (updatedProposal: Proposal, celebration: any) => void;
}

export const NikahContractModal: React.FC<NikahContractModalProps> = ({
  isOpen,
  onClose,
  proposal,
  currentSession,
  lang,
  onNikahFinalized
}) => {
  const [activeMode, setActiveMode] = useState<'istikhara' | 'contract'>('contract');
  
  // Istikhara states
  const [istikharaChoice, setIstikharaChoice] = useState<'accept' | 'decline'>('accept');
  const [istikharaNote, setIstikharaNote] = useState('انشراح صدر وتيسير بعد أداء ركعتي الاستخارة المباركة ودعائها المأثور.');
  
  // Contract states
  const [mahrAmount, setMahrAmount] = useState('50,000 ريال سعودي ميسور مبارك');
  const [witness1, setWitness1] = useState('عبدالعزيز بن محمد الدوسري (شاهد عدل أول)');
  const [witness2, setWitness2] = useState('سلمان بن خالد الهاجري (شاهد عدل ثانٍ)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNikah, setSuccessNikah] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleIstikharaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/istikhara`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentSession.role === 'suitor' ? 'suitor' : 'candidate',
          confirmed: istikharaChoice === 'accept',
          note: istikharaNote
        })
      });
      const data = await res.json();
      if (data.success && data.proposal) {
        if (istikharaChoice === 'accept') {
          fireCelebrationConfetti();
          setActiveMode('contract');
        } else {
          onClose();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNikahSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/nikah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mahrAmount,
          witnesses: [witness1, witness2],
          notes: "تم عقد القران الشرعي المبارك بإيجاب وقبول صحيحين ورضا الولي والزوجين."
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessNikah(data.proposal);
        fireCelebrationConfetti();
        if (data.proposal) {
          saveProposalToDb(data.proposal);
        }
        if (data.celebration) {
          saveCelebrationToDb(data.celebration);
        }
        onNikahFinalized(data.proposal, data.celebration);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-[20px] border border-black/15 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-black/10 bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              <Scroll className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">الميثاق الغليظ وعقد القران المبارك</h3>
              <p className="text-xs text-[#666666]">
                بين <strong className="text-black">{proposal.suitorName}</strong> و <strong className="text-pink-700">{proposal.targetProfileName}</strong>
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

        {/* Tab switcher */}
        {!successNikah && (
          <div className="flex border-b border-black/10 bg-white">
            <button
              onClick={() => setActiveMode('contract')}
              className={`flex-1 py-3 text-xs font-bold transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                activeMode === 'contract' ? 'border-black text-black' : 'border-transparent text-[#777777] hover:text-black'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>إصدار صك عقد القران</span>
            </button>
            <button
              onClick={() => setActiveMode('istikhara')}
              className={`flex-1 py-3 text-xs font-bold transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                activeMode === 'istikhara' ? 'border-black text-black' : 'border-transparent text-[#777777] hover:text-black'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>تسجيل صلاة الاستخارة</span>
            </button>
          </div>
        )}

        {/* Success View */}
        {successNikah ? (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 border border-amber-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full">
                وثيقة ميثاق الشرعية المعتمدة
              </span>
              <h3 className="text-2xl font-bold font-display text-black">
                «بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»
              </h3>
              <p className="text-xs text-[#555555]">
                تم توثيق عقد القران برقم اعتماد شرعي: <strong className="font-mono text-black">{successNikah.nikahContract?.certificateId}</strong>
              </p>
            </div>

            {/* Official Digital Certificate Card */}
            <div className="bg-[#fffef7] border-2 border-amber-300 rounded-[14px] p-5 text-start space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
                <span className="text-xs font-extrabold text-amber-950">صك إثبات ميثاق الزوجية الشرعي</span>
                <span className="text-[11px] text-amber-800 font-semibold">{successNikah.nikahContract?.contractDate}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-[#777777] block text-[10px]">الزوج (الخاطب):</span>
                  <span className="font-bold text-black">{successNikah.suitorName}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px]">الزوجة الكريمة:</span>
                  <span className="font-bold text-black">{successNikah.targetProfileName}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px]">الولي الشرعي المزوج:</span>
                  <span className="font-bold text-black">{successNikah.waliName}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px]">المهر المسمى:</span>
                  <span className="font-bold text-emerald-700">{successNikah.nikahContract?.mahrAmount}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-[11px] text-black/70 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم نشر بطاقة احتفال عامة تلقائياً في تبويب «الأفراح والمناسبات» لتهنئة العروسين.</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-black hover:bg-black/85 text-white font-bold py-3 px-4 rounded-[10px] text-xs transition cursor-pointer"
            >
              إغلاق وعرض بطاقة الاحتفال
            </button>
          </div>
        ) : activeMode === 'istikhara' ? (
          <form onSubmit={handleIstikharaSubmit} className="p-6 space-y-4 text-start overflow-y-auto">
            <div className="bg-emerald-50 p-4 rounded-[12px] border border-emerald-100 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block">فضل صلاة الاستخارة:</span>
              <p className="leading-relaxed">
                دعاء الاستخارة تفويض كامل لأمر الزواج إلى علام الغيوب سبحانه: «اللهم إني أستخيرك بعلمك وأستقدرك بقدرتك... فإنك تقدر ولا أقدر وتعلم ولا أعلم».
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-black">
                ما الذي اطمأن إليه قلبك بعد الاستخارة؟
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIstikharaChoice('accept')}
                  className={`p-3 rounded-[10px] border text-start transition cursor-pointer ${
                    istikharaChoice === 'accept' ? 'bg-[#31c431] text-white border-[#31c431] font-bold' : 'bg-white border-black/15 text-[#555555]'
                  }`}
                >
                  <div className="text-xs">راحة وانشراح صدر 🌸</div>
                  <div className="text-[10px] opacity-80">المضي قدماً لعقد القران</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIstikharaChoice('decline')}
                  className={`p-3 rounded-[10px] border text-start transition cursor-pointer ${
                    istikharaChoice === 'decline' ? 'bg-black text-white border-black font-bold' : 'bg-white border-black/15 text-[#555555]'
                  }`}
                >
                  <div className="text-xs">عدم ارتياح واعتذار 🤲</div>
                  <div className="text-[10px] opacity-80">قدر الله وما شاء فعل</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                ملاحظات أو تعقيب شرعي
              </label>
              <textarea
                rows={3}
                value={istikharaNote}
                onChange={(e) => setIstikharaNote(e.target.value)}
                className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] p-2.5 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>

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
                className="bg-black hover:bg-black/85 disabled:opacity-50 text-white px-5 py-2.5 rounded-[8px] text-xs font-bold transition cursor-pointer"
              >
                {isSubmitting ? 'جارٍ الحفظ...' : 'تثبيت نتيجة الاستخارة'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleNikahSubmit} className="p-6 space-y-4 text-start overflow-y-auto">
            <div className="bg-amber-50/70 p-4 rounded-[12px] border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-amber-700" />
                <span>أركان وشروط عقد النكاح الشرعي:</span>
              </span>
              <p className="leading-relaxed text-[#444444]">
                تحقق رضا الزوجين، إذن الولي الشرعي، الشهود العدول، وتسمية المهر بالمعروف.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                المهر المسمى المتفق عليه (الميسور المبارك)
              </label>
              <input
                type="text"
                required
                value={mahrAmount}
                onChange={(e) => setMahrAmount(e.target.value)}
                className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  الشاهد العدل الأول
                </label>
                <input
                  type="text"
                  required
                  value={witness1}
                  onChange={(e) => setWitness1(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  الشاهد العدل الثاني
                </label>
                <input
                  type="text"
                  required
                  value={witness2}
                  onChange={(e) => setWitness2(e.target.value)}
                  className="w-full bg-[#fafafa] border border-black/15 rounded-[8px] px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="p-3 bg-[#fafafa] rounded-[10px] border border-black/10 text-xs text-[#555555] space-y-1">
              <div className="font-bold text-black">تعهد الولي والمأذون:</div>
              <p className="text-[11px] leading-relaxed">
                أقر أنا ({proposal.waliName}) بصفتي ولي أمر المخطوبة الشرعي، بموافقتها الصريحة ورضاها، وبتمام الإيجاب والقبول.
              </p>
            </div>

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
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isSubmitting ? 'جارٍ التوثيق والإشهار...' : 'توثيق عقد القران ونشر بطاقة الفرح 🎉'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
