import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Heart, 
  HelpCircle,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface AiCounselorViewProps {
  lang: Language;
}

export const AiCounselorView: React.FC<AiCounselorViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'chat' | 'calculator' | 'istikhara' | 'questions'>('chat');
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; source?: string }[]>([
    {
      sender: 'ai',
      text: 'السلام عليكم ورحمة الله وبركاته، أهلاً بكم في المستشار الشرعي لمنصة ميثاق. يسعدني تقديم النصح والإرشاد الفقهي والأسري للمقبلين على الزواج والخطوبة وفق هدي القرآن والسنة النبوية وتيسير سبل الحلال.'
    }
  ]);

  // Compatibility Calculator states
  const [prayerFreq, setPrayerFreq] = useState<'always_in_mosque' | 'always_on_time'>('always_in_mosque');
  const [quranCommitment, setQuranCommitment] = useState<'hafiz' | 'daily_reader'>('daily_reader');
  const [waliConsentReady, setWaliConsentReady] = useState(true);
  const [mahrPhilosophy, setMahrPhilosophy] = useState<'moderate_blessed' | 'custom'>('moderate_blessed');
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [compatibilityVerdict, setCompatibilityVerdict] = useState<string | null>(null);
  const [compatibilityBreakdown, setCompatibilityBreakdown] = useState<{ title: string; weight: number; score: number; detail: string }[]>([]);
  const [calculatingSynergy, setCalculatingSynergy] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || promptInput;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user' as const, text: query }];
    setMessages(newMessages);
    setPromptInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, userLanguage: lang })
      });
      const data = await response.json();
      if (data.success && data.answer) {
        setMessages([...newMessages, { sender: 'ai', text: data.answer, source: data.source }]);
      } else {
        setMessages([...newMessages, { sender: 'ai', text: 'بارك الله فيكم، حدث عارض في الاتصال بالمستشار، نوصيكم دائماً باستخارة الله تعالى واستشارة أهل العلم والفضل ومشاركة الولي.' }]);
      }
    } catch (e) {
      setMessages([...newMessages, { 
        sender: 'ai', 
        text: 'الزواج ميثاق غليظ وسكن ومودة. معيار الظفر بذات الدين والخلق هو الأساس، والحرص على صلاة الاستخارة واستشارة الولي الشرعي سبيل كل بركة.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSynergy = async () => {
    setCalculatingSynergy(true);
    try {
      const res = await fetch('/api/matches/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prayerFreq,
          quranCommitment,
          waliConsentReady,
          mahrPhilosophy
        })
      });
      const data = await res.json();
      if (data.success) {
        setCalculatedScore(data.overallScore);
        setCompatibilityVerdict(data.verdict);
        setCompatibilityBreakdown(data.breakdown || []);
      } else {
        throw new Error();
      }
    } catch (err) {
      let score = 84;
      if (prayerFreq === 'always_in_mosque') score += 10;
      if (quranCommitment === 'hafiz') score += 6;
      if (waliConsentReady) score += 4;
      setCalculatedScore(Math.min(99, score));
      setCompatibilityVerdict("توافق شرعي مبارك بإذن الله تعالى");
    } finally {
      setCalculatingSynergy(false);
      fireCelebrationConfetti();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8 text-start">
      
      {/* Header Banner */}
      <div className="bg-sky-periwinkle p-8 rounded-[16px] border border-black/10 space-y-3">
        <div className="inline-flex items-center gap-2 bg-black text-[#d9c58b] text-xs font-bold px-3 py-1 rounded-[960px]">
          <Bot className="w-4 h-4" />
          <span>مستشار ميثاق الأسري الذكي</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-black tracking-tight">
          {t.counselorTitle}
        </h1>

        <p className="text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed">
          {t.counselorSubtitle}
        </p>

        {/* Feature Tab Selector */}
        <div className="pt-3">
          <div className="inline-flex bg-black/[0.05] p-1 rounded-[960px] text-xs font-bold flex-wrap gap-1">
            <button
              id="counselor-tab-chat-btn"
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-1.5 rounded-[960px] transition cursor-pointer ${
                activeTab === 'chat' ? 'bg-white text-black shadow-partiful-sm' : 'text-[#666666] hover:text-black'
              }`}
            >
              💬 {t.counselorTabChat}
            </button>
            <button
              id="counselor-tab-calculator-btn"
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-1.5 rounded-[960px] transition cursor-pointer ${
                activeTab === 'calculator' ? 'bg-white text-black shadow-partiful-sm' : 'text-[#666666] hover:text-black'
              }`}
            >
              📊 {t.counselorTabCalculator}
            </button>
            <button
              id="counselor-tab-istikhara-btn"
              onClick={() => setActiveTab('istikhara')}
              className={`px-4 py-1.5 rounded-[960px] transition cursor-pointer ${
                activeTab === 'istikhara' ? 'bg-white text-black shadow-partiful-sm' : 'text-[#666666] hover:text-black'
              }`}
            >
              🤲 {t.counselorTabIstikhara}
            </button>
            <button
              id="counselor-tab-questions-btn"
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-1.5 rounded-[960px] transition cursor-pointer ${
                activeTab === 'questions' ? 'bg-white text-black shadow-partiful-sm' : 'text-[#666666] hover:text-black'
              }`}
            >
              📋 {t.counselorTabQuestions}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Live Counselor Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-[16px] border border-black/10 shadow-partiful-sm overflow-hidden flex flex-col h-[560px]">
          
          {/* Quick Prompts strip */}
          <div className="bg-[#fafafa] border-b border-black/5 p-3 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-bold text-[#888888] shrink-0">أسئلة شائعة:</span>
            <button
              onClick={() => handleSendMessage(t.quickPrompt1)}
              className="bg-white hover:bg-black/5 text-black border border-black/10 px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
            >
              {t.quickPrompt1}
            </button>
            <button
              onClick={() => handleSendMessage(t.quickPrompt2)}
              className="bg-white hover:bg-black/5 text-black border border-black/10 px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
            >
              {t.quickPrompt2}
            </button>
            <button
              onClick={() => handleSendMessage(t.quickPrompt3)}
              className="bg-white hover:bg-black/5 text-black border border-black/10 px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
            >
              {t.quickPrompt3}
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      م
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-[12px] p-4 text-xs sm:text-sm leading-relaxed ${
                      isAi 
                        ? 'bg-[#f8f8f8] text-black border border-black/5' 
                        : 'bg-black text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.source && (
                      <span className="text-[10px] text-[#888888] block mt-1.5">
                        مصدر الاستشارة: {msg.source}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#888888] p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>المستشار الشرعي يراجع الفتوى والأدلة النبوية...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-[#fafafa] border-t border-black/10">
            <div className="flex items-center gap-2">
              <input
                id="counselor-chat-input"
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.askPlaceholder}
                className="flex-1 bg-white border border-black/15 focus:border-black rounded-[8px] px-4 py-2.5 text-xs sm:text-sm text-black focus:outline-none"
              />
              <button
                id="send-counselor-btn"
                onClick={() => handleSendMessage()}
                disabled={loading || !promptInput.trim()}
                className="bg-black text-white hover:bg-black/85 disabled:opacity-50 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-[8px] transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>{t.sendQuestionBtn}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Synergy & Compatibility Calculator */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-8 rounded-[16px] border border-black/10 shadow-partiful-sm space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black">حاسبة التوافق الشرعي والمقاصد الزوجية</h3>
              <p className="text-xs text-[#666666]">احسب نسبة التوافق النظري وفق مقاييس الفقه والسنن</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="font-bold text-black block mb-1">المحافظة على الصلاة:</label>
              <select
                value={prayerFreq}
                onChange={(e) => setPrayerFreq(e.target.value as any)}
                className="w-full p-2.5 bg-[#f8f8f8] border border-black/10 rounded-[8px] font-medium"
              >
                <option value="always_in_mosque">كلا الطرفين يحافظان على الصلاة في وقتها وفي المسجد</option>
                <option value="always_on_time">المحافظة التامة في وقتها</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-black block mb-1">العلاقة مع القرآن الكريم:</label>
              <select
                value={quranCommitment}
                onChange={(e) => setQuranCommitment(e.target.value as any)}
                className="w-full p-2.5 bg-[#f8f8f8] border border-black/10 rounded-[8px] font-medium"
              >
                <option value="hafiz">حفظ أجزاء من القرآن مع إجازة أو مدارسة منتظمة</option>
                <option value="daily_reader">تلاوة وورد قرآني يومي مستمر</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-black block mb-1">جاهزية وتفهم الولي الشرعي:</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={waliConsentReady}
                  onChange={(e) => setWaliConsentReady(e.target.checked)}
                  className="w-4 h-4 rounded text-black accent-black"
                />
                <span className="text-xs text-[#555555]">ولي الأمر الشرعي على علم ومستعد لمجلس الرؤية وتيسير المهر</span>
              </div>
            </div>

            <button
              onClick={handleCalculateSynergy}
              disabled={calculatingSynergy}
              className="w-full bg-black text-white hover:bg-black/85 disabled:opacity-50 font-bold py-3 px-4 rounded-[8px] transition cursor-pointer text-sm"
            >
              {calculatingSynergy ? 'جارٍ تحليل التوافق عبر خوارزمية ميثاق الشرعية...' : 'حساب التوافق الشرعي التقديري 🎊'}
            </button>

            {calculatedScore !== null && (
              <div className="p-6 bg-party-pink rounded-[12px] text-black space-y-4 animate-fadeIn border border-black/10">
                <div className="text-center space-y-1">
                  <div className="text-4xl font-extrabold font-display">{calculatedScore}%</div>
                  <div className="font-bold text-base">{compatibilityVerdict || "توافق شرعي ممتاز ومبارك بإذن الله تعالى"}</div>
                  <p className="text-xs text-[#444444] max-w-md mx-auto">
                    تتوافق الرؤى في أعظم ركنين: المحافظة على دين الله والبركة في المهر بحضور الولي. يستحب لكم صلاة ركعتي الاستخارة.
                  </p>
                </div>

                {compatibilityBreakdown.length > 0 && (
                  <div className="pt-3 border-t border-black/10 space-y-2 text-xs">
                    <div className="font-bold text-black text-start">تفصيل مؤشرات الملاءمة الشرعية:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-start">
                      {compatibilityBreakdown.map((item, i) => (
                        <div key={i} className="bg-white/80 p-2.5 rounded-[8px] border border-black/5">
                          <div className="flex justify-between font-bold text-black">
                            <span>{item.title}</span>
                            <span>{item.score}%</span>
                          </div>
                          <p className="text-[11px] text-[#555555] mt-1">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Istikhara Guide */}
      {activeTab === 'istikhara' && (
        <div className="bg-white p-8 rounded-[16px] border border-black/10 shadow-partiful-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black">{t.istikharaDuaTitle}</h3>
              <p className="text-xs text-[#666666]">سنة نبوية شريفة لكل مقبل على خطبة أو زواج</p>
            </div>
          </div>

          <div className="p-6 bg-[#fafafa] rounded-[12px] border border-black/5 text-center space-y-4">
            <p className="font-display text-base sm:text-lg leading-loose text-black font-semibold">
              «اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ العَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلَّامُ الغُيُوبِ، اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ (تسمي الزواج من فلان/فلانة) خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِي الخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ»
            </p>
            <span className="text-xs text-[#888888] block">رواه البخاري في صحيحه</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#444444]">
            <div className="p-4 bg-black/[0.02] rounded-[8px] border border-black/5">
              <span className="font-bold text-black block mb-1">كيفية صلاة الاستخارة:</span>
              ركعتان من غير الفريضة في أي وقت غير منهي عنه، ثم الدعاء بخشوع ويقين بحكمة الله.
            </div>
            <div className="p-4 bg-black/[0.02] rounded-[8px] border border-black/5">
              <span className="font-bold text-black block mb-1">علامات نتيجة الاستخارة:</span>
              انشراح الصدر وتيسير الأسباب وتوفيق الوليين، ولا يشترط رؤيا منامية كما يظن البعض.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Chaperoned Questions */}
      {activeTab === 'questions' && (
        <div className="bg-white p-8 rounded-[16px] border border-black/10 shadow-partiful-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black">أسئلة الرؤية الشرعية وجلسة التعارف بحضور الولي</h3>
              <p className="text-xs text-[#666666]">أسئلة جوهرية تساعد على فهم الدين والخلق والطباع بالمعروف</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {[
              { q: "ما هو مفهومك لمعنى السكن والمودة والرحمة في الحياة الزوجية؟", tag: "المقصد الأسري" },
              { q: "كيف تدير الخلافات وضغوط الحياة اليومية؟ وما مدى حرصك على الحلم والتغافل؟", tag: "الطباع والأخلاق" },
              { q: "ما هي أهدافك في تربية الأبناء على القرآن والأخلاق النبوية الكريمة؟", tag: "التربية" },
              { q: "ما هي أولوياتك في بر الوالدين وصلة الأرحام بعد الزواج؟", tag: "البر والرحم" },
              { q: "ما هي رؤيتك لإدارة الشؤون المالية والنفقة بالمعروف؟", tag: "المال والنفقة" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-[#fafafa] rounded-[10px] border border-black/5 flex items-center justify-between gap-4">
                <span className="font-medium text-black">
                  {idx + 1}. {item.q}
                </span>
                <span className="bg-black/5 text-black text-[11px] font-bold px-2.5 py-1 rounded-[960px] shrink-0">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
