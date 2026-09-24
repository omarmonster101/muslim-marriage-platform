import React, { useState } from 'react';
import { CelebrationInvitation, Language } from '../types';
import { translations } from '../data/translations';
import { 
  PartyPopper, 
  Heart, 
  MapPin, 
  Calendar, 
  Share2, 
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface CelebrationsViewProps {
  lang: Language;
  celebrations: CelebrationInvitation[];
  onAddCelebration?: (celebration: CelebrationInvitation) => void;
}

export const CelebrationsView: React.FC<CelebrationsViewProps> = ({
  lang,
  celebrations,
  onAddCelebration
}) => {
  const t = translations[lang];
  const [rsvpStates, setRsvpStates] = useState<Record<string, 'going' | 'maybe' | 'cant_go'>>({
    'cel-1': 'going',
    'cel-2': 'maybe',
    'cel-3': 'going'
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroom, setNewGroom] = useState('');
  const [newBride, setNewBride] = useState('');
  const [newDate, setNewDate] = useState('الجمعة، 15 رجب 1448هـ');
  const [newCity, setNewCity] = useState('الرياض');
  const [newVenue, setNewVenue] = useState('قاعة اليمامة للاحتفالات');
  const [newTheme, setNewTheme] = useState<'pink' | 'spearmint' | 'periwinkle'>('pink');

  const handleRsvp = (id: string, status: 'going' | 'maybe' | 'cant_go') => {
    setRsvpStates(prev => ({ ...prev, [id]: status }));
    if (status === 'going') {
      fireCelebrationConfetti();
    }
  };

  const handleCreateCelebration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroom || !newBride) return;
    const item: CelebrationInvitation = {
      id: `cel-${Date.now()}`,
      groomName: newGroom,
      brideName: newBride,
      eventDate: newDate,
      hijriDate: '15 رجب 1448هـ',
      venueName: newVenue,
      city: newCity,
      rotationAngle: Math.random() > 0.5 ? 2.5 : -2.5,
      quranVerse: "﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا ﴾",
      guestsCount: 150,
      avatarGroom: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop",
      avatarBride: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&fit=crop",
      themeStyle: newTheme,
      rsvpStatus: 'going'
    };
    if (onAddCelebration) {
      onAddCelebration(item);
    }
    setIsCreateModalOpen(false);
    fireCelebrationConfetti();
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-12 text-start">
      
      {/* Header Banner */}
      <div className="bg-sky-periwinkle p-8 sm:p-12 rounded-[16px] border border-black/10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-black text-[#d9c58b] text-xs font-bold px-4 py-1.5 rounded-[960px]">
          <PartyPopper className="w-4 h-4" />
          <span>أفراح وعقود قران مباركة</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-black tracking-tight max-w-2xl mx-auto">
          {t.celebrationsTitle}
        </h1>

        <p className="text-sm sm:text-base text-[#555555] max-w-xl mx-auto leading-relaxed">
          {t.celebrationsSubtitle}
        </p>

        {/* Hadith blessing pill */}
        <div className="pt-2">
          <div className="inline-block bg-white p-3 sm:p-4 rounded-[12px] shadow-partiful-sm border border-black/10 max-w-xl text-center">
            <span className="font-display font-bold text-sm sm:text-base text-black block">
              {t.barakallahuLakuma}
            </span>
            <span className="text-[11px] text-[#888888] mt-1 block">دعاء النبي ﷺ للمتزوجين</span>
          </div>
        </div>

        {/* Confetti button */}
        <div className="pt-2">
          <button
            id="fire-celebration-confetti-btn"
            onClick={fireCelebrationConfetti}
            className="bg-black hover:bg-black/85 text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-[8px] transition cursor-pointer inline-flex items-center gap-2 shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#d9c58b]" />
            <span>{t.sendBlessingBtn}</span>
          </button>
        </div>
      </div>

      {/* Scattered Tilted Invitation Cards Showcase (Partiful Signature Feature: Cards scattered at ±10° to 15° rotation) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-display text-black">
              بطاقات دعوة عقد القران التفاعلية (Partiful Styled Invitation Cards)
            </h2>
            <span className="text-xs text-[#666666]">
              اضغط على خيارات الحضور والدعاء لإطلاق بهجة التبريكات 🎊
            </span>
          </div>

          <button
            id="open-create-celebration-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black text-white hover:bg-black/85 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-[8px] transition cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <span>+</span>
            <span>إضافة بطاقة عقد قران مبارك</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {celebrations.map((item, idx) => {
            const currentRsvp = rsvpStates[item.id] || item.rsvpStatus || 'going';

            // Theme background based on Partiful gradient registers
            let bgClass = "bg-party-pink";
            if (item.themeStyle === 'spearmint') bgClass = "bg-spearmint";
            if (item.themeStyle === 'periwinkle') bgClass = "bg-sky-periwinkle";

            return (
              <div
                key={item.id}
                id={`invitation-card-${item.id}`}
                className={`relative rounded-[16px] p-6 text-black border border-black/15 shadow-partiful-elevated transition-transform duration-300 hover:rotate-0 flex flex-col justify-between overflow-hidden ${bgClass}`}
                style={{
                  transform: `rotate(${item.rotationAngle}deg)`,
                }}
              >
                {/* Subtle card noise overlay */}
                <div className="absolute top-0 end-0 p-4 opacity-10 font-serif text-8xl font-black select-none pointer-events-none">
                  عرس
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Quranic Verse */}
                  <div className="bg-white/85 backdrop-blur-sm p-3 rounded-[8px] text-[11px] font-semibold text-center border border-black/5 text-[#333333]">
                    {item.quranVerse}
                  </div>

                  {/* Couple Names */}
                  <div className="text-center py-2 space-y-1">
                    <span className="text-[11px] font-bold text-black/60 uppercase tracking-wider block">
                      عقد قران مبارك
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-black">
                      {item.groomName}
                    </h3>
                    <span className="text-xs font-bold text-pink-700 block">وَ</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-black">
                      {item.brideName}
                    </h3>
                  </div>

                  {/* Event Meta */}
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-[12px] border border-black/10 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-medium text-black">
                      <Calendar className="w-4 h-4 text-black shrink-0" />
                      <span>{item.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#555555]">
                      <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                      <span className="truncate">{item.venueName} • {item.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#555555] pt-1 border-t border-black/5">
                      <Users className="w-4 h-4 text-black shrink-0" />
                      <span>{item.guestsCount} مهنئ ومبارك</span>
                    </div>
                  </div>
                </div>

                {/* Partiful Circular RSVP Response Buttons */}
                <div className="pt-6 relative z-10 space-y-3">
                  <div className="text-[11px] font-bold text-center text-black/70">
                    تسجيل الحضور والمباركة بالدعاء:
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    
                    {/* Going Circle (Partiful spec: ~56px circular shape with shadow and label below) */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleRsvp(item.id, 'going')}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition shadow-partiful-sm cursor-pointer ${
                          currentRsvp === 'going'
                            ? 'bg-[#31c431] text-white ring-2 ring-black scale-110'
                            : 'bg-white text-black hover:scale-105'
                        }`}
                      >
                        🤲
                      </button>
                      <span className="text-[10px] font-bold text-black text-center whitespace-nowrap">
                        {t.rsvpGoing}
                      </span>
                    </div>

                    {/* Maybe Circle */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleRsvp(item.id, 'maybe')}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition shadow-partiful-sm cursor-pointer ${
                          currentRsvp === 'maybe'
                            ? 'bg-[#ffae00] text-black ring-2 ring-black scale-110'
                            : 'bg-white text-black hover:scale-105'
                        }`}
                      >
                        💐
                      </button>
                      <span className="text-[10px] font-bold text-black text-center whitespace-nowrap">
                        {t.rsvpMaybe}
                      </span>
                    </div>

                    {/* Can't Go Circle */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleRsvp(item.id, 'cant_go')}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition shadow-partiful-sm cursor-pointer ${
                          currentRsvp === 'cant_go'
                            ? 'bg-red-500 text-white ring-2 ring-black scale-110'
                            : 'bg-white text-black hover:scale-105'
                        }`}
                      >
                        💌
                      </button>
                      <span className="text-[10px] font-bold text-black text-center whitespace-nowrap">
                        {t.rsvpCant}
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Creating New Wedding Celebration Card */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-[16px] shadow-partiful-lg border border-black/10 overflow-hidden text-start">
            
            {/* Header */}
            <div className="bg-black text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#d9c58b] block mb-1">
                  🎉 مشاركة الفرح والبركة
                </span>
                <h3 className="text-xl font-display font-extrabold text-white">
                  إضافة بطاقة دعوة عقد قران مبارك
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCelebration} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-black block mb-1">اسم العريس:</label>
                  <input
                    type="text"
                    required
                    value={newGroom}
                    onChange={(e) => setNewGroom(e.target.value)}
                    placeholder="مثال: فيصل بن سعد"
                    className="w-full p-2.5 bg-[#fafafa] border border-black/15 focus:border-black rounded-[8px] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">اسم العروس الكريمة:</label>
                  <input
                    type="text"
                    required
                    value={newBride}
                    onChange={(e) => setNewBride(e.target.value)}
                    placeholder="مثال: ريم بنت عبدالعزيز"
                    className="w-full p-2.5 bg-[#fafafa] border border-black/15 focus:border-black rounded-[8px] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-black block mb-1">الموعد والتاريخ:</label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-[#fafafa] border border-black/15 focus:border-black rounded-[8px] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">المدينة:</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 bg-[#fafafa] border border-black/15 focus:border-black rounded-[8px] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-black block mb-1">مكان الحفل / القاعة:</label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full p-2.5 bg-[#fafafa] border border-black/15 focus:border-black rounded-[8px] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">طابع لون البطاقة (Partiful Theme):</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTheme('pink')}
                    className={`p-2 rounded-[8px] border text-center font-bold text-xs cursor-pointer transition ${
                      newTheme === 'pink' ? 'bg-party-pink border-black' : 'bg-white border-black/10'
                    }`}
                  >
                    🌸 Party Pink
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTheme('spearmint')}
                    className={`p-2 rounded-[8px] border text-center font-bold text-xs cursor-pointer transition ${
                      newTheme === 'spearmint' ? 'bg-spearmint border-black' : 'bg-white border-black/10'
                    }`}
                  >
                    🍃 Spearmint
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTheme('periwinkle')}
                    className={`p-2 rounded-[8px] border text-center font-bold text-xs cursor-pointer transition ${
                      newTheme === 'periwinkle' ? 'bg-sky-periwinkle border-black' : 'bg-white border-black/10'
                    }`}
                  >
                    ☁️ Periwinkle
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-black/15 text-black font-bold text-xs rounded-[8px] hover:bg-black/5 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  id="submit-celebration-btn"
                  type="submit"
                  className="px-5 py-2 bg-black text-white hover:bg-black/85 font-bold text-xs rounded-[8px] transition cursor-pointer shadow-md"
                >
                  نشر بطاقة عقد القران 🎊
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
