import React, { useState, useEffect } from 'react';
import { Profile, Language, Gender, PrayerHabit, MaritalStatus, UserSession } from '../types';
import { translations } from '../data/translations';
import { X, ShieldCheck, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { saveProfileToDb } from '../lib/firebase';

interface CreateProfileModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (newProfile: Profile) => void;
  currentSession?: UserSession;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  lang,
  isOpen,
  onClose,
  onProfileCreated,
  currentSession
}) => {
  const t = translations[lang];

  const [fullName, setFullName] = useState(currentSession && currentSession.role !== 'guest' ? currentSession.name : '');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<Gender>(currentSession?.role === 'candidate' ? 'female' : 'female');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [city, setCity] = useState('الرياض');
  const [profession, setProfession] = useState('معلمة وكاتبة');
  const [education, setEducation] = useState('بكالوريوس تربية ودراسات إسلامية');
  const [prayerHabit, setPrayerHabit] = useState<PrayerHabit>('always_on_time');
  const [quranMemorization, setQuranMemorization] = useState('حفظ 10 أجزاء من القرآن');
  const [religiousAttire, setReligiousAttire] = useState('حجاب شرعي ساتر وعباءة فضفاضة');
  const [aboutMe, setAboutMe] = useState('أمة متمسكة بدينها وعفافها، حريصة على بناء أسرة صالحة تنعم بالسكينة والمودة وبر الوالدين.');
  const [partnerExpectations, setPartnerExpectations] = useState('رجل تقي يخاف الله، محافظ على صلواته، طيب القلب، حليم وكريم.');
  const [familyValues, setFamilyValues] = useState('أسرة محافظة ومتماسكة تحرص على الألفة وصلة الأرحام.');
  const [waliName, setWaliName] = useState('محمد بن صالح (الوالد)');
  const [waliRelation, setWaliRelation] = useState('الوالد');
  const [waliPhone, setWaliPhone] = useState(currentSession?.phone || '+966 50 000 1122');
  const [waliNotes, setWaliNotes] = useState('التواصل مع الوالد مباشرة لترتيب الرؤية الشرعية بالمعروف.');
  const [blurByDefault, setBlurByDefault] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Profile = {
      id: `prof-${Date.now()}`,
      fullName: fullName || (gender === 'female' ? 'باحثة عن العفاف' : 'خاطب مؤمن'),
      age: Number(age),
      gender,
      maritalStatus,
      nationality: country === 'المملكة العربية السعودية' ? 'سعودي/ة' : 'عربي/ة',
      country,
      city,
      education,
      profession,
      avatarUrl: gender === 'female' 
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      isPhotoBlurredByDefault: blurByDefault,
      isVerified: true,
      prayerHabit,
      quranMemorization,
      religiousAttire,
      islamicInterests: ["حلقات القرآن", "العمل الخيري", "السيرة النبوية"],
      smoking: "never",
      polygynyPreference: "no",
      marriageTimeline: "immediate",
      aboutMe,
      partnerExpectations,
      familyValues,
      mahrExpectation: "الميسور المبارك وفق هدي السنة",
      relocationFlexibility: `الإقامة في ${city} أو حسب الاتفاق بالمعروف.`,
      compatibilityScore: 96,
      wali: {
        name: waliName,
        relation: waliRelation,
        phone: waliPhone,
        email: "wali@meethaq-guardian.org",
        isVerified: true,
        notes: waliNotes
      }
    };

    saveProfileToDb(newProfile);
    onProfileCreated(newProfile);
    fireCelebrationConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div 
        id="create-profile-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-[16px] shadow-partiful-lg border border-black/10 overflow-hidden my-8 max-h-[90vh] flex flex-col text-start"
      >
        
        {/* Header */}
        <div className="bg-black text-white p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#d9c58b] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#31c431]" />
              تسجيل استمارة زواج شرعي موثقة بالولي
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              إنشاء السيرة الذاتية الإسلامية
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Gender selection */}
          <div className="space-y-2">
            <label className="font-bold text-black block">جنس المتقدم/ة:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setGender('female');
                  setBlurByDefault(true);
                }}
                className={`p-3 rounded-[8px] border font-bold text-center cursor-pointer transition ${
                  gender === 'female'
                    ? 'border-black bg-black text-white'
                    : 'border-black/10 bg-[#fafafa] text-black hover:border-black/30'
                }`}
              >
                🌸 أخت باحثة عن الزواج (بإشراف الولي)
              </button>
              <button
                type="button"
                onClick={() => {
                  setGender('male');
                  setBlurByDefault(false);
                }}
                className={`p-3 rounded-[8px] border font-bold text-center cursor-pointer transition ${
                  gender === 'male'
                    ? 'border-black bg-black text-white'
                    : 'border-black/10 bg-[#fafafa] text-black hover:border-black/30'
                }`}
              >
                🌿 أخ خاطب باحث عن الحلال
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-black block mb-1">الاسم الكريم الثلاثي:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: سارة بنت أحمد الخالدي"
                className="w-full p-2.5 bg-[#fafafa] border border-black/15 rounded-[8px] focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="font-bold text-black block mb-1">العمر:</label>
              <input
                type="number"
                min={18}
                max={75}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2.5 bg-[#fafafa] border border-black/15 rounded-[8px] focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Location & Profession */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-black block mb-1">الدولة والمدينة:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="الدولة"
                  className="w-1/2 p-2.5 bg-[#fafafa] border border-black/15 rounded-[8px] focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المدينة"
                  className="w-1/2 p-2.5 bg-[#fafafa] border border-black/15 rounded-[8px] focus:outline-none focus:border-black"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-black block mb-1">المهنة والمجال:</label>
              <input
                type="text"
                required
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full p-2.5 bg-[#fafafa] border border-black/15 rounded-[8px] focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Religious details */}
          <div className="bg-[#fafafa] p-4 rounded-[12px] border border-black/10 space-y-4">
            <h4 className="font-bold text-black flex items-center gap-1.5">
              <span>🕌</span>
              <span>الالتزام الديني والسمت الإسلامي</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#666666] block mb-1">المحافظة على الصلاة:</label>
                <select
                  value={prayerHabit}
                  onChange={(e) => setPrayerHabit(e.target.value as any)}
                  className="w-full p-2 bg-white border border-black/15 rounded-[8px]"
                >
                  <option value="always_in_mosque">في المسجد مع الجماعة</option>
                  <option value="always_on_time">في وقتها دائماً</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#666666] block mb-1">القرآن الكريم:</label>
                <input
                  type="text"
                  value={quranMemorization}
                  onChange={(e) => setQuranMemorization(e.target.value)}
                  placeholder="مثال: حفظ 10 أجزاء ومجاز"
                  className="w-full p-2 bg-white border border-black/15 rounded-[8px]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#666666] block mb-1">اللباس الشرعي والسمت:</label>
              <input
                type="text"
                value={religiousAttire}
                onChange={(e) => setReligiousAttire(e.target.value)}
                className="w-full p-2 bg-white border border-black/15 rounded-[8px]"
              />
            </div>
          </div>

          {/* Wali Information (ONLY FOR FEMALE CANDIDATES) */}
          {gender === 'female' && (
            <div className="bg-sky-periwinkle p-4 rounded-[12px] border border-black/10 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#31c431]" />
                <div>
                  <h4 className="font-bold text-black">بيانات الولي الشرعي المعتمد (إلزامي للتوثيق)</h4>
                  <p className="text-[11px] text-[#666666]">لا يتم اعتماد أي ملف بدون ولي أمر مسؤول لمتابعة الخطبة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#666666] block mb-1">اسم الولي الثلاثي:</label>
                  <input
                    type="text"
                    required
                    value={waliName}
                    onChange={(e) => setWaliName(e.target.value)}
                    className="w-full p-2 bg-white border border-black/15 rounded-[8px]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#666666] block mb-1">صلة القرابة:</label>
                  <select
                    value={waliRelation}
                    onChange={(e) => setWaliRelation(e.target.value)}
                    className="w-full p-2 bg-white border border-black/15 rounded-[8px]"
                  >
                    <option value="الوالد">الوالد</option>
                    <option value="الأخ الأكبر">الأخ الأكبر</option>
                    <option value="العم">العم</option>
                    <option value="الخال">الخال</option>
                    <option value="وكيل شرعي">وكيل شرعي معتمد</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#666666] block mb-1">هاتف الولي للتواصل:</label>
                  <input
                    type="tel"
                    required
                    value={waliPhone}
                    onChange={(e) => setWaliPhone(e.target.value)}
                    className="w-full p-2 bg-white border border-black/15 rounded-[8px] direction-ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Me & Expectations */}
          <div>
            <label className="font-bold text-black block mb-1">نبذة عنك وتطلعاتك في الزواج:</label>
            <textarea
              rows={3}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="w-full p-3 bg-[#fafafa] border border-black/15 rounded-[8px] focus:outline-none focus:border-black"
            />
          </div>

          {/* Privacy toggle */}
          <label className="flex items-center gap-2 p-3 bg-black/[0.03] rounded-[8px] cursor-pointer">
            <input
              type="checkbox"
              checked={blurByDefault}
              onChange={(e) => setBlurByDefault(e.target.checked)}
              className="w-4 h-4 rounded text-black accent-black"
            />
            <span className="text-xs font-semibold text-black">
              حجب الصورة الشخصية تلقائياً صوناً للحياء وإظهارها فقط بإذن الولي
            </span>
          </label>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-black/20 text-black rounded-[8px] font-bold text-xs hover:bg-black/5 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              id="submit-new-profile-btn"
              type="submit"
              className="px-6 py-2.5 bg-black text-white hover:bg-black/85 rounded-[8px] font-bold text-xs shadow-md cursor-pointer active:scale-95"
            >
              اعتماد الاستمارة ونشرها في المنصة 🎊
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
