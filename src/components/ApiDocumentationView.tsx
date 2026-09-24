import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Code2, Play, CheckCircle2, Copy, ShieldCheck } from 'lucide-react';

interface ApiDocumentationViewProps {
  lang: Language;
}

export const ApiDocumentationView: React.FC<ApiDocumentationViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeEndpoint, setActiveEndpoint] = useState<string>('GET /api/profiles');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/profiles',
      description: 'استرجاع قائمة الباحثين عن الزواج مع فلاتر الدولة والصلاة والستر الشرعي',
      sampleParams: '?gender=female&country=المملكة العربية السعودية',
      sampleBody: null
    },
    {
      method: 'GET',
      path: '/api/proposals',
      description: 'استرجاع طلبات الخطوبة الشرعية المسجلة ومراحل موافقة الولي',
      sampleParams: '',
      sampleBody: null
    },
    {
      method: 'POST',
      path: '/api/proposals',
      description: 'تقديم طلب خطوبة شرعي رسمي وإشعار ولي أمر الأخت فوراً',
      sampleParams: '',
      sampleBody: {
        suitorName: "عبدالله الشمري",
        suitorAge: 29,
        suitorCity: "الرياض",
        targetProfileId: "prof-2",
        targetProfileName: "سارة الخالدي",
        waliName: "أحمد بن إبراهيم الخالدي",
        note: "طلب خطوبة شرعي على كتاب الله وسنة رسوله ﷺ"
      }
    },
    {
      method: 'POST',
      path: '/api/ai/counselor',
      description: 'استشارة المستشار الأسري والشرعي الذكي (مدعوم بنموذج Gemini وعلوم الشريعة)',
      sampleParams: '',
      sampleBody: {
        prompt: "ما هي أهم شروط الرؤية الشرعية وضوابط اللقاء بحضور الولي؟",
        userLanguage: "ar"
      }
    },
    {
      method: 'GET',
      path: '/api/stats',
      description: 'إحصائيات المنصة المباشرة: عدد الباحثين، الأولياء المعتمدين، وعقود القران المباركة',
      sampleParams: '',
      sampleBody: null
    }
  ];

  const currentEp = endpoints.find(e => `${e.method} ${e.path}` === activeEndpoint) || endpoints[0];

  const handleTestApi = async () => {
    setLoading(true);
    setTestResponse(null);
    try {
      let res;
      if (currentEp.method === 'GET') {
        res = await fetch(currentEp.path);
      } else {
        res = await fetch(currentEp.path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentEp.sampleBody || {})
        });
      }
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message, status: "Failed" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8 text-start">
      
      {/* Header */}
      <div className="bg-sky-periwinkle p-8 rounded-[16px] border border-black/10 space-y-3">
        <div className="inline-flex items-center gap-2 bg-black text-[#d9c58b] text-xs font-bold px-3 py-1 rounded-[960px]">
          <Code2 className="w-4 h-4" />
          <span>منظومة واجهة برمجة التطبيقات للمطورين</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-black tracking-tight">
          {t.apiDocTitle}
        </h1>

        <p className="text-sm sm:text-base text-[#555555] max-w-2xl leading-relaxed">
          {t.apiDocSubtitle}
        </p>
      </div>

      {/* Main Grid: Endpoints list & Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Endpoints Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">
            نقاط النهاية المتاحة (Endpoints)
          </h3>
          {endpoints.map((ep) => {
            const key = `${ep.method} ${ep.path}`;
            const isActive = activeEndpoint === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveEndpoint(key);
                  setTestResponse(null);
                }}
                className={`w-full text-start p-3 rounded-[8px] border transition cursor-pointer flex items-center justify-between text-xs ${
                  isActive 
                    ? 'border-black bg-black text-white shadow-sm' 
                    : 'border-black/10 bg-white text-black hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-semibold">{ep.path}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Playground & Details */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-[12px] border border-black/10 p-6 shadow-partiful-sm space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/10">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-black">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  currentEp.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {currentEp.method}
                </span>
                <span>{currentEp.path}</span>
              </div>

              {/* Test Action button */}
              <button
                id="api-execute-test-btn"
                onClick={handleTestApi}
                disabled={loading}
                className="bg-black hover:bg-black/85 text-white text-xs font-bold py-2 px-4 rounded-[8px] transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{loading ? 'جارٍ الاتصال...' : 'تجربة الطلب المباشر (Execute Live)'}</span>
              </button>
            </div>

            <p className="text-xs text-[#555555]">
              {currentEp.description}
            </p>

            {/* Request Body sample if POST */}
            {currentEp.sampleBody && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#888888]">
                  <span>Request Payload (JSON):</span>
                  <button 
                    onClick={() => copyCode(JSON.stringify(currentEp.sampleBody, null, 2))}
                    className="flex items-center gap-1 text-black hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
                <pre className="bg-[#111111] text-emerald-400 p-3.5 rounded-[8px] text-xs font-mono overflow-x-auto">
                  {JSON.stringify(currentEp.sampleBody, null, 2)}
                </pre>
              </div>
            )}

            {/* Live Response Box */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#888888]">
                استجابة السيرفر المباشرة (Live Server Response):
              </div>
              <div className="bg-[#0c0c0c] text-[#f0f0f0] p-4 rounded-[8px] text-xs font-mono min-h-[160px] max-h-[360px] overflow-y-auto border border-black/20">
                {testResponse ? (
                  <pre className="whitespace-pre-wrap">{testResponse}</pre>
                ) : (
                  <div className="text-white/40 h-full flex items-center justify-center py-10">
                    اضغط على زر «تجربة الطلب المباشر» لتشغيل الـ API ورؤية الاستجابة الحقيقية
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
