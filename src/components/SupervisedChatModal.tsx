import React, { useState, useEffect, useRef } from 'react';
import { Proposal, ShariaChatMessage, Language, UserSession } from '../types';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  MessageSquare,
  Users,
  CheckCheck
} from 'lucide-react';
import { fireKhitbahBlessingConfetti } from '../utils/confetti';
import { 
  saveProposalMessageToDb, 
  subscribeToProposalMessages, 
  saveFlaggedMessageToDb 
} from '../lib/firebase';

interface SupervisedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
  currentSession: UserSession;
  lang: Language;
}

export const SupervisedChatModal: React.FC<SupervisedChatModalProps> = ({
  isOpen,
  onClose,
  proposal,
  currentSession,
  lang
}) => {
  const [messages, setMessages] = useState<ShariaChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [shariaWarning, setShariaWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const shariaPrompts = [
    "ما هي رؤيتكم لإدارة شؤون المنزل والميزانية الأسرية؟",
    "كيف نحافظ معاً على الصلوات وتربية الأبناء على القرآن؟",
    "ما رأيكم في تحديد موعد للرؤية الشرعية بحضور الوالد؟",
    "نسأل الله التوفيق والبركة لما فيه صلاح ديننا ودنيانا."
  ];

  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/chat`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
        setMessages(prev => {
          const ids = new Set(data.messages.map((m: ShariaChatMessage) => m.id));
          const rest = prev.filter(m => !ids.has(m.id) && !m.id.startsWith('temp-'));
          const merged = [...rest, ...data.messages];
          return merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        });
      }
    } catch (e) {
      console.warn("Failed to load chat messages from API:", e);
    }
  };

  useEffect(() => {
    if (isOpen && proposal.id) {
      fetchChat();
      // Subscribe to live Firestore chat messages
      const unsubscribe = subscribeToProposalMessages(proposal.id, (liveMessages) => {
        if (liveMessages && liveMessages.length > 0) {
          setMessages(prev => {
            const liveIds = new Set(liveMessages.map(m => m.id));
            const pendingOptimistic = prev.filter(m => m.id.startsWith('temp-') && !liveMessages.some(lm => lm.content === m.content));
            return [...liveMessages, ...pendingOptimistic];
          });
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isOpen, proposal.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    // Client-side Sharia guard check for raw numbers/phone before formal meeting
    const phonePattern = /(05\d{8}|\+966\d{9}|00966\d{9}|\b\d{10}\b)/;
    const isSuspicious = phonePattern.test(newMessage);
    if (isSuspicious && currentSession.role === 'suitor') {
      setShariaWarning("تنبيه شرعي: يمنع تداول أرقام الهواتف أو الحسابات الخاصة مباشرة. التواصل يتم حصراً بإذن وإشراف الولي الشرعي.");
      setTimeout(() => setShariaWarning(null), 5000);
      saveFlaggedMessageToDb({
        id: `flag-${Date.now()}`,
        proposalId: proposal.id,
        senderName: currentSession.name,
        senderRole: 'suitor',
        content: newMessage.trim(),
        flagReason: "محاولة مشاركة أرقام خاصة في المحادثة قبل موافقة الولي",
        timestamp: new Date().toISOString(),
        reviewed: false
      });
    }

    const msgId = `msg-${Date.now()}`;
    const newMsg: ShariaChatMessage = {
      id: msgId,
      proposalId: proposal.id,
      senderId: currentSession.id,
      senderName: currentSession.name,
      senderRole: currentSession.role === 'wali' ? 'wali' : currentSession.role === 'candidate' ? 'candidate' : 'suitor',
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    const textToSend = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    // Save directly to Firestore for instant multi-user synchronization
    saveProposalMessageToDb(proposal.id, newMsg);

    try {
      await fetch(`/api/proposals/${proposal.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentSession.id,
          senderName: currentSession.name,
          senderRole: newMsg.senderRole,
          content: textToSend
        })
      });
    } catch (err) {
      console.error("Failed to send message via API:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-[20px] border border-black/15 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[90vh] max-h-[720px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-[#31c431]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-black">مجلس المحادثة الشرعية الثلاثية</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  تحت إشراف الولي
                </span>
              </div>
              <p className="text-xs text-[#666666]">
                بين الخاطب <strong className="text-black">{proposal.suitorName}</strong> والمخطوبة <strong className="text-pink-700">{proposal.targetProfileName}</strong> بإشراف <strong className="text-black">{proposal.waliName}</strong>
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

        {/* Sharia Banner */}
        <div className="bg-emerald-50/80 px-4 py-2.5 border-b border-emerald-100 text-xs text-emerald-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>محادثة منضبطة بالهدي النبوي: تصان فيها الأعراض وتمنع الخلوة الإلكترونية.</span>
          </div>
          <span className="text-[11px] font-bold text-black/60 bg-white/70 px-2 py-0.5 rounded-md shrink-0">
            تتحدث كـ: {currentSession.name}
          </span>
        </div>

        {/* Sharia Warning Alert */}
        {shariaWarning && (
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{shariaWarning}</span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fdfdfd]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#888888] space-y-2">
              <MessageSquare className="w-10 h-10 stroke-1 text-black/20" />
              <p className="text-sm font-bold text-black/60">بدء المحادثة الشرعية المباركة</p>
              <p className="text-xs max-w-sm">ألقِ السلام واطرح أسئلتك بوقار وحياء تحت إشراف ولي الأمر الكريم.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSystem = msg.senderRole === 'system';
              const isMe = msg.senderId === currentSession.id;
              const isWali = msg.senderRole === 'wali';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center py-2">
                    <div className="inline-block bg-black/[0.04] border border-black/5 text-[#666666] text-xs px-3.5 py-1.5 rounded-full max-w-md">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-[#666666]">
                      {msg.senderName}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isWali ? 'bg-emerald-100 text-emerald-800' :
                      msg.senderRole === 'candidate' ? 'bg-pink-100 text-pink-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {isWali ? 'الولي المشرف 🛡️' : msg.senderRole === 'candidate' ? 'المخطوبة 🧕' : 'الخاطب 🤵'}
                    </span>
                  </div>

                  <div
                    className={`max-w-[82%] sm:max-w-[75%] p-3.5 rounded-[14px] text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-black text-white rounded-br-xs'
                        : isWali
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/80 rounded-bl-xs'
                        : 'bg-white text-black border border-black/10 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div className={`text-[10px] mt-1 text-end flex items-center justify-end gap-1 ${
                      isMe ? 'text-white/60' : 'text-black/40'
                    }`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span>{new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-[#31c431]" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sharia Suggested Questions */}
        <div className="p-2.5 bg-[#f8f8f8] border-t border-black/5 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[11px] font-bold text-[#888888] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d9c58b]" />
            مقترحات شرعية:
          </span>
          {shariaPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setNewMessage(prompt)}
              className="text-[11px] bg-white hover:bg-black hover:text-white border border-black/10 text-[#444444] px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-black/10 flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`اكتب رسالتك بوقار كـ (${currentSession.name})...`}
            className="flex-1 bg-[#fafafa] border border-black/10 rounded-[10px] px-4 py-2.5 text-xs sm:text-sm text-black focus:outline-none focus:border-black transition"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-black hover:bg-black/85 disabled:opacity-40 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-[10px] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>إرسال</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
