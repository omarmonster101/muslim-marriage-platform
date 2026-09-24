import React, { useState, useEffect, useRef } from 'react';
import { 
  Gender, 
  PrayerHabit, 
  MaritalStatus, 
  MarriageTimeline, 
  Profile, 
  UserSession, 
  ActiveRole,
  Language,
  RegistrationPolicySettings,
  RegistrationStepConfig
} from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  Briefcase, 
  Calendar, 
  Award, 
  BookOpen, 
  Eye, 
  EyeOff,
  Upload,
  Camera,
  RefreshCw,
  Clock,
  ExternalLink,
  Shield,
  Check,
  FileCheck
} from 'lucide-react';
import { registerWithEmail, saveProfileToDb } from '../lib/firebase';
import { fireCelebrationConfetti } from '../utils/confetti';
import { 
  getRegistrationPolicy, 
  recordNewRegistration, 
  DEFAULT_REGISTRATION_STEPS 
} from '../services/registrationService';
import {
  COUNTRIES,
  REGIONS,
  CITIES,
  NATIONALITIES,
  EDUCATION_LEVELS,
  FIELDS_OF_STUDY,
  JOB_CATEGORIES,
  OCCUPATIONS,
  GLOBAL_LANGUAGES,
  MARITAL_STATUSES
} from '../data/referenceData';
import { UserLanguageRecord } from '../types';

interface RegisterPageProps {
  lang: Language;
  onSuccess: (role: ActiveRole, session: UserSession) => void;
  onGoToLogin: () => void;
  onGoToHome: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  lang,
  onSuccess,
  onGoToLogin,
  onGoToHome
}) => {
  // Load dynamic registration policy set by Admin
  const [policy, setPolicy] = useState<RegistrationPolicySettings>(getRegistrationPolicy());
  
  // Listen for real-time admin changes to registration policy
  useEffect(() => {
    const handlePolicyUpdate = (e: any) => {
      if (e.detail) {
        setPolicy(e.detail);
      }
    };
    window.addEventListener('meethaq_registration_policy_updated', handlePolicyUpdate);
    return () => {
      window.removeEventListener('meethaq_registration_policy_updated', handlePolicyUpdate);
    };
  }, []);

  // Guarantee exactly 5 consecutive pages
  const steps: RegistrationStepConfig[] = (policy.steps && policy.steps.length === 5)
    ? policy.steps
    : DEFAULT_REGISTRATION_STEPS;
  
  // Current active step index (0-based indexing: 0 = Page 1, 4 = Page 5)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const activeStepConfig = steps[currentStepIndex] || steps[0];

  // -------------------------------------------------------------
  // PAGE 1: ACCOUNT & TRACK
  // -------------------------------------------------------------
  const [gender, setGender] = useState<Gender>('male');
  const [role, setRole] = useState<'suitor' | 'candidate' | 'wali'>('suitor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');

  // -------------------------------------------------------------
  // PAGE 2: DEMOGRAPHICS & BACKGROUND
  // -------------------------------------------------------------
  const [age, setAge] = useState<number>(27);
  const [countryId, setCountryId] = useState<string>('SA');
  const [regionId, setRegionId] = useState<string>('SA-01');
  const [cityId, setCityId] = useState<string>('SA-RUH');
  const [nationalityId, setNationalityId] = useState<string>('nat_sa');
  const [educationLevelId, setEducationLevelId] = useState<string>('bachelor');
  const [fieldOfStudyId, setFieldOfStudyId] = useState<string>('fos_cs_ai');
  const [jobCategoryId, setJobCategoryId] = useState<string>('cat_tech');
  const [occupationId, setOccupationId] = useState<string>('occ_swe');
  const [userLanguages, setUserLanguages] = useState<UserLanguageRecord[]>([
    { languageId: 'lang_ar', languageName: 'العربية', proficiency: 'native' },
    { languageId: 'lang_en', languageName: 'الإنجليزية', proficiency: 'fluent' }
  ]);
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [city, setCity] = useState('الرياض');
  const [nationality, setNationality] = useState('سعودي');
  const [education, setEducation] = useState('بكالوريوس هندسة حاسب ونظم');
  const [profession, setProfession] = useState('مهندس برمجيات');
  const [heightCm, setHeightCm] = useState<number>(178);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');

  const isAr = lang === 'ar';

  // Manual entry overrides when an option is not available in reference lists
  const [isCustomNationality, setIsCustomNationality] = useState(false);
  const [customNationality, setCustomNationality] = useState('');

  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [customCountry, setCustomCountry] = useState('');

  const [isCustomRegion, setIsCustomRegion] = useState(false);
  const [customRegion, setCustomRegion] = useState('');

  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCity, setCustomCity] = useState('');

  const [isCustomEducation, setIsCustomEducation] = useState(false);
  const [customEducation, setCustomEducation] = useState('');

  const [isCustomFieldOfStudy, setIsCustomFieldOfStudy] = useState(false);
  const [customFieldOfStudy, setCustomFieldOfStudy] = useState('');

  const [isCustomJobCategory, setIsCustomJobCategory] = useState(false);
  const [customJobCategory, setCustomJobCategory] = useState('');

  const [isCustomOccupation, setIsCustomOccupation] = useState(false);
  const [customOccupation, setCustomOccupation] = useState('');

  const [isCustomWaliRelation, setIsCustomWaliRelation] = useState(false);
  const [customWaliRelation, setCustomWaliRelation] = useState('');

  const [isCustomLanguage, setIsCustomLanguage] = useState(false);
  const [customLanguageName, setCustomLanguageName] = useState('');

  // -------------------------------------------------------------
  // PAGE 3: RELIGIOUS LIFESTYLE & SUNNAH
  // -------------------------------------------------------------
  const [prayerHabit, setPrayerHabit] = useState<PrayerHabit>('always_in_mosque');
  const [quranMemorization, setQuranMemorization] = useState('حفظ 7 أجزاء ومداومة على الورد القرآني اليومي');
  const [religiousAttire, setReligiousAttire] = useState('هيئة وقورة سمت نبوي ولحية خفيفة');
  const [smokingPolicy, setSmokingPolicy] = useState('never');
  const [islamicInterests, setIslamicInterests] = useState<string[]>([
    'حلقات القرآن الكريم', 
    'القراءة في السيرة النبوية', 
    'العمل التطوعي والخيري'
  ]);

  // -------------------------------------------------------------
  // PAGE 4: READINESS, WALI OVERSIGHT & SPOUSE PREFERENCES
  // -------------------------------------------------------------
  // For Female:
  const [waliName, setWaliName] = useState('الشيخ عبد الله بن ناصر القحطاني');
  const [waliRelation, setWaliRelation] = useState('الوالد');
  const [waliPhone, setWaliPhone] = useState('+966 50 123 4567');
  const [waliCouncilCity, setWaliCouncilCity] = useState('الرياض - حي النخيل');
  const [waliConsentReady, setWaliConsentReady] = useState(true);
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(true);
  const [housingPreference, setHousingPreference] = useState('سكن مستقل خاص تماماً');
  const [mahrExpectation, setMahrExpectation] = useState('الميسور المبارك اقتداءً بالسنة النبوية');

  // For Male:
  const [marriageTimeline, setMarriageTimeline] = useState<MarriageTimeline>('within_3_months');
  const [housingType, setHousingType] = useState('شقة مستقلة مؤثثة بالكامل');
  const [monthlyIncomeRange, setMonthlyIncomeRange] = useState('18,000 - 24,000 ريال شهرياً (كسب حلال طيب)');
  const [suitorEmployer, setSuitorEmployer] = useState('قطاع تقنية المعلومات والاتصالات');
  const [pledgeNoKhilwah, setPledgeNoKhilwah] = useState(true);
  const [pledgeWaliCouncil, setPledgeWaliCouncil] = useState(true);

  // Bio & Expectations:
  const [aboutMe, setAboutMe] = useState('');
  const [seekingQualities, setSeekingQualities] = useState('');

  // -------------------------------------------------------------
  // PAGE 5: PHOTO UPLOAD & VERIFICATION (الصفحة الأخيرة)
  // -------------------------------------------------------------
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  const [photoVerificationResult, setPhotoVerificationResult] = useState<{
    faceDetected: boolean;
    isModest: boolean;
    clarityScore: number;
    approved: boolean;
    verificationDate: string;
  }>({
    faceDetected: true,
    isModest: true,
    clarityScore: 98,
    approved: true,
    verificationDate: 'فحص فوري معتمد'
  });
  const [previewUnblurred, setPreviewUnblurred] = useState(false);
  const [photoPledgeConfirmed, setPhotoPledgeConfirmed] = useState(true);
  const [sacredOathConfirmed, setSacredOathConfirmed] = useState(true);

  // General Status & Loading
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registrationSubmittedStatus, setRegistrationSubmittedStatus] = useState<
    'in_progress' | 'pending_admin_approval' | 'activated'
  >('in_progress');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize role and photo when gender changes
  const handleGenderChange = (selectedGender: Gender) => {
    setGender(selectedGender);
    if (selectedGender === 'female') {
      setRole('candidate');
      setReligiousAttire('نقاب شرعي كامل ومحتشمة');
      setPrayerHabit('always_on_time');
      setNationality('سعودية');
      setIsPhotoBlurred(true);
      setUploadedPhotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80');
    } else {
      setRole('suitor');
      setReligiousAttire('هيئة وقورة وسمت نبوي');
      setPrayerHabit('always_in_mosque');
      setNationality('سعودي');
      setIsPhotoBlurred(false);
      setUploadedPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80');
    }
  };

  // Quick Demo Autofill helper
  const handleQuickDemoFill = (preset: 'suitor' | 'candidate' | 'wali') => {
    if (preset === 'suitor') {
      setGender('male');
      setRole('suitor');
      setFullName('المهندس تركي بن خالد المنصور');
      setEmail(`turki.suitor.${Date.now().toString().slice(-4)}@meethaq.sa`);
      setPassword('Meethaq@2026!');
      setConfirmPassword('Meethaq@2026!');
      setPhone('+966 50 882 1199');
      setAge(28);
      setCity('الرياض');
      setEducation('ماجستير هندسة نظم ذكية');
      setProfession('مهندس استشاري أول');
      setHeightCm(180);
      setMaritalStatus('single');
      setPrayerHabit('always_in_mosque');
      setQuranMemorization('حفظ 10 أجزاء من كتاب الله مع التجويد');
      setMarriageTimeline('within_3_months');
      setHousingType('شقة تمليك مستقلة في مجمع سكني راقٍ');
      setMonthlyIncomeRange('22,000 - 30,000 ريال شهرياً');
      setSuitorEmployer('شركة تقنية استشارية كبرى');
      setPledgeNoKhilwah(true);
      setPledgeWaliCouncil(true);
      setAboutMe('شاب مستقيم ومحب لكتاب الله وسنة نبيه ﷺ، أبحث عن بناء أسرة صالحة قائمة على المودة والرحمة والسكن.');
      setSeekingQualities('فتاة صالحة ذات خلق ودين، تصون بيتها وتعين على طاعة الله، واعية ومثقفة.');
      setUploadedPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80');
      setIsPhotoBlurred(false);
    } else if (preset === 'candidate') {
      setGender('female');
      setRole('candidate');
      setFullName('جمانة بنت عبد العزيز الراشد');
      setEmail(`joumana.candidate.${Date.now().toString().slice(-4)}@meethaq.sa`);
      setPassword('Meethaq@2026!');
      setConfirmPassword('Meethaq@2026!');
      setPhone('+966 55 412 8877');
      setAge(24);
      setCity('الرياض');
      setEducation('بكالوريوس لغة عربية ودراسات إسلامية');
      setProfession('معلمة ومعتنية بالتربية القرآنية');
      setHeightCm(165);
      setMaritalStatus('single');
      setPrayerHabit('always_on_time');
      setQuranMemorization('حافظة لكتاب الله كاملاً ومجازة برواية حفص');
      setIsPhotoBlurred(true);
      setReligiousAttire('نقاب ساتر مع حجاب شرعي كامل');
      setWaliName('الشيخ عبد العزيز بن عبد الرحمن الراشد (الوالد)');
      setWaliRelation('الوالد');
      setWaliPhone('+966 50 331 4455');
      setWaliCouncilCity('الرياض - حي حطين');
      setWaliConsentReady(true);
      setHousingPreference('سكن مستقل خاص تماماً');
      setMahrExpectation('الميسور المبارك اقتداءً بالسنة المطهرة');
      setAboutMe('فتاة عفيفة محبة للقرآن وأهله، أعتز بحجابي وقيم ديني، أرجو أن أكون سكناً لزوج صالح يعينني على الجنة.');
      setSeekingQualities('شاب تقي نقي، صاحب خلق وأمانة، محافظ على صلاة الفجر في المسجد، بار بوالديه.');
      setUploadedPhotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80');
    } else {
      setGender('male');
      setRole('wali');
      setFullName('الشيخ صالح بن عبد الله الدوسري');
      setEmail(`wali.saleh.${Date.now().toString().slice(-4)}@meethaq.sa`);
      setPassword('Meethaq@2026!');
      setConfirmPassword('Meethaq@2026!');
      setPhone('+966 50 555 4433');
      setAge(54);
      setCity('الدمام');
      setEducation('ماجستير شريعة وأصول فقه');
      setProfession('مستشار أسري وتربوي');
      setAboutMe('ولي أمر يسعى لترشيح وتزويج كريمته لشاب كفء يتقي الله ويصون الأمانة، والمجلس مفتوح للمتقدمين الجادين.');
      setSeekingQualities('الكفاءة في الدين والخلق، والجدية التامة بالحضور لمجلس العائلة.');
      setUploadedPhotoUrl('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80');
      setIsPhotoBlurred(false);
    }
    setPhotoPledgeConfirmed(true);
    setSacredOathConfirmed(true);
  };

  // Handle Photo File Upload
  const handlePhotoFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    setIsVerifyingPhoto(true);
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedPhotoUrl(result);
      // Simulate real-time Sharia & clarity verification
      setTimeout(() => {
        setIsVerifyingPhoto(false);
        setPhotoVerificationResult({
          faceDetected: true,
          isModest: true,
          clarityScore: 99,
          approved: true,
          verificationDate: 'فحص فوري معتمد'
        });
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Step Validation before progressing
  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);

    // Page 1: Account
    if (currentStepIndex === 0) {
      if (!fullName.trim() || fullName.trim().length < 4) {
        setErrorMsg('يرجى إدخال الاسم الكريم الرباعي بشكل صحيح.');
        return false;
      }
      if (!email || !email.includes('@')) {
        setErrorMsg('يرجى إدخال عنوان بريد إلكتروني صالح.');
        return false;
      }
      if (!password || password.length < 6) {
        setErrorMsg('كلمة المرور يجب ألا تقل عن 6 خانات للأمان.');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMsg('كلمتا المرور غير متطابقتين.');
        return false;
      }
      if (!phone.trim()) {
        setErrorMsg('رقم الجوال مطلوب للتحقق الأمني.');
        return false;
      }
    }

    // Page 2: Demographics
    if (currentStepIndex === 1) {
      if (age < policy.minAge) {
        setErrorMsg(isAr 
          ? `الحد الأدنى لسن التسجيل في المنصة وفق سياسة الإدارة هو ${policy.minAge} سنة.`
          : `Minimum registration age is ${policy.minAge} years.`);
        return false;
      }
      // Check City (either selected or custom entered)
      const effectiveCity = (cityId === '__custom__' || isCustomCity) ? customCity.trim() : city.trim();
      if (!effectiveCity) {
        setErrorMsg(isAr ? 'يرجى كتابة أو اختيار اسم مدينتك.' : 'Please specify or enter your city name.');
        return false;
      }
      // Check Nationality
      const effectiveNat = (nationalityId === '__custom__' || isCustomNationality) ? customNationality.trim() : nationality.trim();
      if (!effectiveNat) {
        setErrorMsg(isAr ? 'يرجى كتابة أو اختيار الجنسية.' : 'Please specify or enter your nationality.');
        return false;
      }
      // Check Country
      const effectiveCountry = (countryId === '__custom__' || isCustomCountry) ? customCountry.trim() : country.trim();
      if (!effectiveCountry) {
        setErrorMsg(isAr ? 'يرجى كتابة أو اختيار بلد الإقامة.' : 'Please specify or enter your country of residence.');
        return false;
      }
    }

    // Page 3: Religious Lifestyle
    if (currentStepIndex === 2) {
      if (!quranMemorization.trim()) {
        setErrorMsg(isAr 
          ? 'يرجى كتابة نبذة عن وردك القرآني ومقدار الحفظ.'
          : 'Please write a brief note on your Quran memorization and daily recitation.');
        return false;
      }
    }

    // Page 4: Readiness & Wali
    if (currentStepIndex === 3) {
      if (gender === 'female' && role === 'candidate' && policy.requireWaliForFemales) {
        if (!waliName.trim() || !waliPhone.trim()) {
          setErrorMsg(isAr 
            ? 'بيانات الولي الشرعي ورقم هاتفه إلزامية شرعاً لمواصلة التسجيل.'
            : 'Guardian name and direct phone number are required.');
          return false;
        }
        if (!waliConsentReady) {
          setErrorMsg(isAr 
            ? 'يشترط علم الولي الشرعي وموافقته على إجراءات النكاح الشرعي.'
            : 'Guardian awareness and consent are required.');
          return false;
        }
      }
      if (gender === 'male' && role === 'suitor' && policy.requireBaahForMales) {
        if (!pledgeNoKhilwah || !pledgeWaliCouncil) {
          setErrorMsg(isAr 
            ? 'التعهد بالزيارة الرسمية لمجلس الولي وعدم طلب خلوة إلزامي لقبول التسجيل.'
            : 'Pledge of formal guardian visit and no seclusion is required.');
          return false;
        }
      }
    }

    // Page 5: Photo Upload & Verification
    if (currentStepIndex === 4) {
      if (!uploadedPhotoUrl) {
        setErrorMsg(isAr ? 'يرجى رفع الصورة الشخصية لإتمام التسجيل واعتماد السيرة.' : 'Please upload a photo to complete registration.');
        return false;
      }
      if (!photoPledgeConfirmed) {
        setErrorMsg(isAr ? 'يجب الإقرار بأن الصورة شخصية وحديثة ومطابقة للضوابط الشرعية.' : 'Please confirm that the photo is recent and modest.');
        return false;
      }
      if (!sacredOathConfirmed) {
        setErrorMsg(isAr ? 'القسم الشرعي وميثاق الأمانة إلزامي لاعتماد الحساب.' : 'The solemn oath is required.');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    if (currentStepIndex < 4) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalSubmissionAndRedirect();
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev + 1 - 2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Registration, Photo Verification and Immediate Redirect to Explore
  const handleFinalSubmissionAndRedirect = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const selCountry = COUNTRIES.find(c => c.id === countryId);
      const selCity = CITIES.find(c => c.id === cityId);
      const selEdu = EDUCATION_LEVELS.find(e => e.id === educationLevelId);
      const selField = FIELDS_OF_STUDY.find(f => f.id === fieldOfStudyId);
      const selOcc = OCCUPATIONS.find(o => o.id === occupationId);
      const selNat = NATIONALITIES.find(n => n.id === nationalityId);

      const resolvedCountryName = (countryId === '__custom__' || isCustomCountry)
        ? (customCountry.trim() || country || (isAr ? 'بلد آخر' : 'Other Country'))
        : (selCountry ? (isAr ? selCountry.nameAr : selCountry.nameEn) : (country || 'المملكة العربية السعودية'));

      const resolvedCityName = (cityId === '__custom__' || isCustomCity)
        ? (customCity.trim() || city || (isAr ? 'مدينة أخرى' : 'Other City'))
        : (selCity ? (isAr ? selCity.nameAr : selCity.nameEn) : (city || 'الرياض'));

      const resolvedNatName = (nationalityId === '__custom__' || isCustomNationality)
        ? (customNationality.trim() || nationality || (isAr ? 'أخرى' : 'Other'))
        : (selNat ? (isAr ? selNat.nameAr : selNat.nameEn) : (nationality || 'سعودي'));

      const resolvedEduName = (educationLevelId === '__custom__' || isCustomEducation)
        ? (customEducation.trim() || education)
        : (selEdu 
            ? `${isAr ? selEdu.nameAr : selEdu.nameEn}${
                (fieldOfStudyId === '__custom__' || isCustomFieldOfStudy)
                  ? (customFieldOfStudy.trim() ? ` - ${customFieldOfStudy.trim()}` : '')
                  : (selField ? ` - ${isAr ? selField.nameAr : selField.nameEn}` : '')
              }` 
            : education);

      const resolvedJobName = (occupationId === '__custom__' || isCustomOccupation)
        ? (customOccupation.trim() || profession)
        : (selOcc ? (isAr ? selOcc.nameAr : selOcc.nameEn) : profession);

      const resolvedWaliRelation = (waliRelation === '__custom__' || isCustomWaliRelation)
        ? (customWaliRelation.trim() || (isAr ? 'صلة قرابة أخرى' : 'Other Guardian'))
        : waliRelation;

      const userProfile: Profile = {
        id: `profile-${Date.now()}`,
        fullName,
        age,
        gender,
        maritalStatus,
        nationality: resolvedNatName,
        country: resolvedCountryName,
        city: resolvedCityName,
        education: resolvedEduName,
        profession: resolvedJobName,
        countryId,
        regionId,
        cityId,
        nationalityId,
        educationLevelId,
        fieldOfStudyId,
        jobCategoryId,
        occupationId,
        userLanguages,
        latitude: selCity?.lat,
        longitude: selCity?.lon,
        avatarUrl: uploadedPhotoUrl,
        isPhotoBlurredByDefault: gender === 'female' ? isPhotoBlurred : false,
        isVerified: true,
        wali: {
          name: gender === 'female' ? waliName : (isAr ? 'غير منطبق (خاطب ذكر)' : 'N/A (Male Suitor)'),
          relation: gender === 'female' ? resolvedWaliRelation : (isAr ? 'نفسه' : 'Self'),
          phone: gender === 'female' ? waliPhone : phone,
          email: `${email.split('@')[0]}.wali@example.com`,
          isVerified: gender === 'female' ? true : false,
          notes: gender === 'female' ? (isAr ? `مجلس الولي في: ${waliCouncilCity}` : `Wali council in: ${waliCouncilCity}`) : (isAr ? 'مستقل شرعاً' : 'Independent')
        },
        prayerHabit,
        quranMemorization,
        religiousAttire,
        islamicInterests,
        smoking: 'never',
        polygynyPreference: 'no',
        marriageTimeline,
        aboutMe: aboutMe.trim() || (gender === 'female' 
          ? 'فتاة عفيفة صالحة على منهج الكتاب والسنة، ترجو رضا الله وبناء بيت تقي.' 
          : 'شاب مستقيم صاحب عمل طيب وكسب حلال، يسعى للزواج على سنة النبي ﷺ.'),
        partnerExpectations: seekingQualities.trim() || 'صاحب دين وخلق عظيم وأمانة في المعاملة والمودة.',
        familyValues: 'التربية الإسلامية، صلة الرحم، والتعاون على البر والتقوى',
        mahrExpectation: gender === 'female' ? mahrExpectation : 'ميسور على هدي السنة',
        relocationFlexibility: gender === 'male' 
          ? `دخل شهري: ${monthlyIncomeRange} - سكن: ${housingType}` 
          : `اشتراط: ${housingPreference}`,
        moderationStatus: 'approved'
      };

      // 1. Firebase Auth Registration
      try {
        const regResult = await registerWithEmail(email, password, fullName, role, gender);
        if (regResult.success && regResult.user) {
          userProfile.id = regResult.user.uid;
          await saveProfileToDb(userProfile);
        }
      } catch (authErr) {
        console.warn('Firebase registration fallback to local state:', authErr);
      }

      // 1.5. Synchronize with backend API server
      try {
        await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userProfile)
        });
      } catch (apiErr) {
        console.warn('API sync profile fallback:', apiErr);
      }

      // 2. Record in Registration Policy Service
      recordNewRegistration({
        email,
        fullName,
        phone,
        gender,
        role,
        activationStatus: 'active',
        waliName: gender === 'female' ? waliName : undefined,
        waliPhone: gender === 'female' ? waliPhone : undefined,
        city,
        country,
        shariaPledgeAccepted: sacredOathConfirmed
      });

      // 3. Fire Celebration Confetti
      fireCelebrationConfetti();
      setRegistrationSubmittedStatus('activated');

      const session: UserSession = {
        id: userProfile.id,
        name: fullName,
        role,
        avatar: uploadedPhotoUrl,
        phone
      };

      // 4. Directly forward to partner search ("وبعد رفع الصورة يتوجه للبحث عن شريك")
      setTimeout(() => {
        onSuccess(role, session);
      }, 700);

    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ بيانات التسجيل، يرجى المحاولة ثانية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-neutral-900 pb-24 font-cairo">
      
      {/* 1. Header Banner */}
      <div className="border-b border-[#ede5dd] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-start">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#9b4c2e] uppercase tracking-wider">
                {isAr ? 'منصة نكاح' : 'Nikah Platform'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9b4c2e]" />
              <span className="text-xs text-neutral-500 font-medium">
                {isAr ? 'بناء بيت الزوجية الشرعي (٥ خطوات سهلة)' : 'Blessed Matrimonial Path (5 Easy Steps)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
              {isAr ? 'إنشاء حساب جديد' : 'Create New Account'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
              {isAr 
                ? 'سجل بياناتك بثقة وأمان وفق الضوابط الشرعية مع حفظ كامل للخصوصية، والتواصل بإشراف ولي الأمر.'
                : 'Register your profile with confidence under Islamic guidelines, complete privacy, and guardian oversight.'}
            </p>
          </div>

          {/* Quick Demo Pre-fill */}
          {policy.enableDemoFill && (
            <div className="flex flex-wrap gap-2 pt-2 border-t md:border-t-0 border-neutral-100">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('suitor')}
                className="text-xs font-medium rounded-full border border-neutral-200 bg-neutral-50 hover:bg-[#9b4c2e] hover:text-white px-3.5 py-1.5 transition cursor-pointer"
                title={isAr ? 'تعبئة سريعة لبيانات خاطب ذكر' : 'Quick demo male profile'}
              >
                {isAr ? '+ نموذج خاطب' : '+ Demo Suitor'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('candidate')}
                className="text-xs font-medium rounded-full border border-neutral-200 bg-neutral-50 hover:bg-[#9b4c2e] hover:text-white px-3.5 py-1.5 transition cursor-pointer"
                title={isAr ? 'تعبئة سريعة لبيانات مخطوبة أنثى' : 'Quick demo female profile'}
              >
                {isAr ? '+ نموذج مخطوبة' : '+ Demo Bride'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('wali')}
                className="text-xs font-medium rounded-full border border-neutral-200 bg-neutral-50 hover:bg-[#9b4c2e] hover:text-white px-3.5 py-1.5 transition cursor-pointer"
                title={isAr ? 'تعبئة سريعة لبيانات ولي أمر' : 'Quick demo guardian profile'}
              >
                {isAr ? '+ نموذج ولي' : '+ Demo Wali'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. 5-Page Step Progression Indicator */}
      <div className="border-b border-[#ede5dd] sticky top-0 bg-white/95 backdrop-blur-xs z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          {/* Progress Bar */}
          <div className="w-full bg-neutral-100 h-1.5 overflow-hidden">
            <div 
              className="bg-[#9b4c2e] h-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / 5) * 100}%`
              }}
            />
          </div>

          {/* Step Breadcrumbs */}
          <div className="py-3 flex items-center justify-between overflow-x-auto gap-4 no-scrollbar">
            <div className="flex items-center gap-3 sm:gap-5">
              {(isAr ? [
                { number: 1, title: '١. الحساب والصفة' },
                { number: 2, title: '٢. البيانات الشخصية' },
                { number: 3, title: '٣. السمت الديني' },
                { number: 4, title: '٤. الجاهزية والولاية' },
                { number: 5, title: '٥. الصورة الشخصية' }
              ] : [
                { number: 1, title: '1. Account & Track' },
                { number: 2, title: '2. Demographics' },
                { number: 3, title: '3. Religious Practice' },
                { number: 4, title: '4. Readiness & Wali' },
                { number: 5, title: '5. Verification' }
              ]).map((stepItem, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (isPassed) setCurrentStepIndex(idx);
                    }}
                    disabled={!isPassed && !isActive}
                    className={`flex items-center gap-2 text-xs font-medium transition whitespace-nowrap ${
                      isActive 
                        ? 'font-bold text-[#9b4c2e] border-b-2 border-[#9b4c2e] pb-1' 
                        : isPassed 
                        ? 'text-neutral-600 hover:text-neutral-900 cursor-pointer' 
                        : 'text-neutral-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-5 h-5 text-[11px] rounded-full flex items-center justify-center font-bold ${
                      isActive ? 'bg-[#9b4c2e] text-white' : isPassed ? 'bg-neutral-200 text-neutral-800' : 'border border-neutral-300 text-neutral-400'
                    }`}>
                      {isPassed ? '✓' : idx + 1}
                    </span>
                    <span>{stepItem.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-medium text-neutral-500 shrink-0">
              {isAr ? (
                <>خطوة <strong className="text-neutral-900">{currentStepIndex + 1}</strong> من 5</>
              ) : (
                <>Step <strong className="text-neutral-900">{currentStepIndex + 1}</strong> of 5</>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Form Content Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10">
        
        {/* Error Alert Display */}
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 text-red-900 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 text-start">
              <strong className="block font-bold mb-0.5">تنبيه في البيانات المدخلة:</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 1: ROLE & BASIC INFO */}
        {/* =============================================================== */}
        {currentStepIndex === 0 && (
          <div className="space-y-6 text-start bg-white p-6 sm:p-8 rounded-2xl border border-[#ede5dd] shadow-xs">
            
            {/* Title requested by user */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                {isAr ? 'حدد صفتك في التسجيل:' : 'Select Your Registration Track:'}
              </h2>

              {/* 3 Roles: ذكر, أنثى, ولي الأمر */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`p-4 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                    role === 'suitor' 
                      ? 'border-[#9b4c2e] bg-[#fbf3ef] text-[#9b4c2e] ring-2 ring-[#9b4c2e]/20 shadow-xs' 
                      : 'border-neutral-200 bg-neutral-50/70 text-neutral-800 hover:border-neutral-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      role === 'suitor' ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      ♂
                    </div>
                    <span className="font-bold text-base text-neutral-900">{isAr ? 'ذكر' : 'Male (Suitor)'}</span>
                  </div>
                  {role === 'suitor' && (
                    <CheckCircle2 className="w-5 h-5 text-[#9b4c2e]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`p-4 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                    role === 'candidate' 
                      ? 'border-[#9b4c2e] bg-[#fbf3ef] text-[#9b4c2e] ring-2 ring-[#9b4c2e]/20 shadow-xs' 
                      : 'border-neutral-200 bg-neutral-50/70 text-neutral-800 hover:border-neutral-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      role === 'candidate' ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      ♀
                    </div>
                    <span className="font-bold text-base text-neutral-900">{isAr ? 'أنثى' : 'Female (Candidate)'}</span>
                  </div>
                  {role === 'candidate' && (
                    <CheckCircle2 className="w-5 h-5 text-[#9b4c2e]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('wali');
                    setGender('male');
                    setReligiousAttire(isAr ? 'سمت وقور وهيئة إسلامية' : 'Dignified Sunnah attire');
                  }}
                  className={`p-4 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                    role === 'wali' 
                      ? 'border-[#9b4c2e] bg-[#fbf3ef] text-[#9b4c2e] ring-2 ring-[#9b4c2e]/20 shadow-xs' 
                      : 'border-neutral-200 bg-neutral-50/70 text-neutral-800 hover:border-neutral-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      role === 'wali' ? 'bg-[#9b4c2e] text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      👑
                    </div>
                    <span className="font-bold text-base text-neutral-900">{isAr ? 'ولي الأمر' : 'Legal Guardian'}</span>
                  </div>
                  {role === 'wali' && (
                    <CheckCircle2 className="w-5 h-5 text-[#9b4c2e]" />
                  )}
                </button>
              </div>
            </div>

            {/* Credential Inputs */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-700 font-semibold">
                  {isAr ? 'الاسم الرباعي الكريم:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isAr ? 'مثال: عبد الله بن فهد بن إبراهيم الخالدي' : 'e.g. Abdullah bin Fahd Al-Khalidi'}
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'البريد الإلكتروني:' : 'Email Address:'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'رقم الجوال (للتوثيق):' : 'Mobile Number:'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'كلمة المرور:' : 'Password:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white transition pe-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 pe-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'تأكيد كلمة المرور:' : 'Confirm Password:'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Wali Registration for Candidate (البنت تسجل ولي الأمر) */}
            {(role === 'candidate' || gender === 'female') && (
              <div className="p-5 rounded-2xl border border-[#ede5dd] bg-[#fbf9f6] space-y-4 mt-4">
                <div className="flex items-center gap-2 text-[#9b4c2e] pb-2 border-b border-[#ede5dd]">
                  <ShieldCheck className="w-5 h-5 text-[#9b4c2e]" />
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">
                      {isAr ? 'تسجيل بيانات ولي الأمر الشرعي' : 'Legal Guardian (Wali) Details'}
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {isAr ? 'وفق الشريعة، يتولى الولي الإشراف والتواصل الرسمي' : 'In accordance with Islamic principles, guardian supervises matchmaking'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">
                      {isAr ? 'اسم ولي الأمر الكريم:' : 'Guardian Name:'}
                    </label>
                    <input
                      type="text"
                      value={waliName}
                      onChange={(e) => setWaliName(e.target.value)}
                      placeholder={isAr ? 'مثال: الشيخ عبد الله بن ناصر (الوالد)' : 'e.g. Abdullah bin Nasser'}
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">
                      {isAr ? 'صلة القرابة:' : 'Relationship:'}
                    </label>
                    <select
                      value={isCustomWaliRelation ? '__custom__' : waliRelation}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__custom__') {
                          setIsCustomWaliRelation(true);
                        } else {
                          setIsCustomWaliRelation(false);
                          setWaliRelation(val);
                        }
                      }}
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                    >
                      <option value="الوالد">{isAr ? 'الوالد (الأب)' : 'Father'}</option>
                      <option value="الأخ">{isAr ? 'الأخ الشقيق' : 'Brother'}</option>
                      <option value="العم">{isAr ? 'العم الشقيق' : 'Paternal Uncle'}</option>
                      <option value="الجد">{isAr ? 'الجد' : 'Grandfather'}</option>
                      <option value="__custom__">✏️ {isAr ? '+ صلة قرابة أخرى (يدوي)...' : '+ Other Relation (Manual)...'}</option>
                    </select>

                    {isCustomWaliRelation && (
                      <div className="mt-1 p-2 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#9b4c2e]">
                            {isAr ? 'اكتب صلة القرابة يدوياً:' : 'Enter relationship manually:'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsCustomWaliRelation(false)}
                            className="text-[10px] text-neutral-500 underline"
                          >
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={customWaliRelation}
                          onChange={(e) => {
                            setCustomWaliRelation(e.target.value);
                            setWaliRelation(e.target.value);
                          }}
                          placeholder={isAr ? 'صلة القرابة...' : 'Relationship...'}
                          className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">
                      {isAr ? 'رقم جوال الولي المباشر (للتواصل والتحقق):' : 'Guardian Direct Mobile Number:'}
                    </label>
                    <input
                      type="tel"
                      value={waliPhone}
                      onChange={(e) => setWaliPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">
                      {isAr ? 'مدينة مجلس الولي للرؤية الشرعية:' : 'Guardian Council City (for Sharia Viewing):'}
                    </label>
                    <input
                      type="text"
                      value={waliCouncilCity}
                      onChange={(e) => setWaliCouncilCity(e.target.value)}
                      placeholder={isAr ? 'الرياض - مجلس العائلة' : 'Riyadh - Family Council'}
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={waliConsentReady}
                    onChange={(e) => setWaliConsentReady(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9b4c2e] focus:ring-[#9b4c2e] border-neutral-300"
                  />
                  <span className="text-xs text-neutral-800 font-medium">
                    {isAr 
                      ? 'أؤكد أن الولي على علم تام وموافقة على تسجيلي بالمنصة واستقبال الخُطّاب.' 
                      : 'I confirm that my guardian is fully aware and agrees to my registration and suitor requests.'}
                  </span>
                </label>
              </div>
            )}

          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 2: DEMOGRAPHICS (الصفحة الثانية: البيانات الشخصية والنشأة) */}
        {/* =============================================================== */}
        {currentStepIndex === 1 && (
          <div className="space-y-6 text-start bg-white p-6 sm:p-8 rounded-2xl border border-[#ede5dd] shadow-xs">
            <div className="border-b border-[#ede5dd] pb-4">
              <span className="text-xs font-bold text-[#9b4c2e] uppercase tracking-wider block mb-1">
                الخطوة الثانية
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                البيانات الشخصية والديموغرافية والنشأة
              </h2>
            </div>

            <div className="space-y-5">
              {/* Row 1: Age, Nationality, Height */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'العمر بالسنين:' : 'Age (Years):'}
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={85}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'الجنسية:' : 'Nationality:'}
                  </label>
                  <select
                    value={isCustomNationality ? '__custom__' : nationalityId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__custom__') {
                        setIsCustomNationality(true);
                      } else {
                        setIsCustomNationality(false);
                        setNationalityId(val);
                        const sel = NATIONALITIES.find(n => n.id === val);
                        if (sel) setNationality(isAr ? sel.nameAr : sel.nameEn);
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {NATIONALITIES.map((n) => (
                      <option key={n.id} value={n.id}>
                        {isAr ? n.nameAr : n.nameEn} ({isAr ? n.nameEn : n.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ جنسية أخرى (كتابة يدوية)...' : '+ Other Nationality (Manual)...'}</option>
                  </select>

                  {!isCustomNationality ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomNationality(true)}
                      className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                    >
                      {isAr ? 'جنسيتك غير موجودة؟ اكتبها يدوياً' : 'Not listed? Enter manually'}
                    </button>
                  ) : (
                    <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9b4c2e]">
                          {isAr ? '✏️ اكتب جنسيتك يدوياً:' : '✏️ Enter nationality:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomNationality(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          {isAr ? 'العودة للقائمة' : 'Back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customNationality}
                        onChange={(e) => {
                          setCustomNationality(e.target.value);
                          setNationality(e.target.value);
                        }}
                        placeholder={isAr ? 'اكتب الجنسية هنا...' : 'Type nationality here...'}
                        className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'الطول (سم):' : 'Height (cm):'}
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value) || 170)}
                    placeholder="175"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Normalized Country, Region, City (All with Manual Fallback) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'بلد الإقامة:' : 'Country of Residence:'}
                  </label>
                  <select
                    value={isCustomCountry ? '__custom__' : countryId}
                    onChange={(e) => {
                      const newCountryId = e.target.value;
                      if (newCountryId === '__custom__') {
                        setIsCustomCountry(true);
                      } else {
                        setIsCustomCountry(false);
                        setCountryId(newCountryId);
                        const matchingRegions = REGIONS.filter(r => r.countryId === newCountryId);
                        const matchingCities = CITIES.filter(c => c.countryId === newCountryId);
                        if (matchingRegions.length > 0) setRegionId(matchingRegions[0].id);
                        if (matchingCities.length > 0) {
                          setCityId(matchingCities[0].id);
                          setCity(isAr ? matchingCities[0].nameAr : matchingCities[0].nameEn);
                        }
                        const selCountry = COUNTRIES.find(c => c.id === newCountryId);
                        if (selCountry) setCountry(isAr ? selCountry.nameAr : selCountry.nameEn);
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {isAr ? c.nameAr : c.nameEn} ({isAr ? c.nameEn : c.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ دولة أخرى (كتابة يدوية)...' : '+ Other Country (Manual)...'}</option>
                  </select>

                  {!isCustomCountry ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomCountry(true)}
                      className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                    >
                      {isAr ? 'دولتك غير موجودة؟ اكتبها يدوياً' : 'Not listed? Enter manually'}
                    </button>
                  ) : (
                    <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9b4c2e]">
                          {isAr ? '✏️ اكتب اسم الدولة يدوياً:' : '✏️ Enter country:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomCountry(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          {isAr ? 'العودة للقائمة' : 'Back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customCountry}
                        onChange={(e) => {
                          setCustomCountry(e.target.value);
                          setCountry(e.target.value);
                        }}
                        placeholder={isAr ? 'اكتب بلد الإقامة هنا...' : 'Type country here...'}
                        className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'المنطقة / المحافظة / الولاية:' : 'Region / Province / State:'}
                  </label>
                  <select
                    value={isCustomRegion ? '__custom__' : regionId}
                    onChange={(e) => {
                      const newRegionId = e.target.value;
                      if (newRegionId === '__custom__') {
                        setIsCustomRegion(true);
                      } else {
                        setIsCustomRegion(false);
                        setRegionId(newRegionId);
                        const matchingCities = CITIES.filter(c => c.regionId === newRegionId);
                        if (matchingCities.length > 0) {
                          setCityId(matchingCities[0].id);
                          setCity(isAr ? matchingCities[0].nameAr : matchingCities[0].nameEn);
                        }
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {REGIONS.filter(r => r.countryId === countryId).map((r) => (
                      <option key={r.id} value={r.id}>
                        {isAr ? r.nameAr : r.nameEn} ({isAr ? r.nameEn : r.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ منطقة / محافظة أخرى (يدوي)...' : '+ Other Region (Manual)...'}</option>
                  </select>

                  {!isCustomRegion ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomRegion(true)}
                      className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                    >
                      {isAr ? 'المنطقة غير موجودة؟ اكتبها يدوياً' : 'Not listed? Enter manually'}
                    </button>
                  ) : (
                    <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9b4c2e]">
                          {isAr ? '✏️ اكتب المنطقة / المحافظة:' : '✏️ Enter region:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomRegion(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          {isAr ? 'العودة للقائمة' : 'Back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customRegion}
                        onChange={(e) => setCustomRegion(e.target.value)}
                        placeholder={isAr ? 'اكتب اسم المنطقة أو المحافظة...' : 'Type region name...'}
                        className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-neutral-700 font-semibold">
                      {isAr ? 'المدينة:' : 'City:'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCity(!isCustomCity)}
                      className="text-[11px] text-[#9b4c2e] hover:underline font-bold cursor-pointer"
                    >
                      {isCustomCity 
                        ? (isAr ? 'العودة للقائمة' : 'Back to list') 
                        : (isAr ? '✏️ كتابة يدوية' : '✏️ Enter manually')}
                    </button>
                  </div>

                  <select
                    value={isCustomCity ? '__custom__' : cityId}
                    onChange={(e) => {
                      const newCityId = e.target.value;
                      if (newCityId === '__custom__') {
                        setIsCustomCity(true);
                      } else {
                        setIsCustomCity(false);
                        setCityId(newCityId);
                        const sel = CITIES.find(c => c.id === newCityId);
                        if (sel) setCity(isAr ? sel.nameAr : sel.nameEn);
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {CITIES.filter(c => c.countryId === countryId && (!regionId || c.regionId === regionId)).map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? c.nameAr : c.nameEn} ({isAr ? c.nameEn : c.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ مدينة أخرى غير متوفرة (كتابة يدوية)...' : '+ Other City (Enter Manually)...'}</option>
                  </select>

                  {!isCustomCity ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomCity(true)}
                      className="text-[11px] text-[#9b4c2e] hover:underline font-medium flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <span>✏️</span>
                      <span>{isAr ? 'مدينتك غير متوفرة بالقائمة؟ اضغط هنا لكتابتها يدوياً' : 'City not in list? Click here to type manually'}</span>
                    </button>
                  ) : (
                    <div className="mt-1.5 p-3 bg-[#fbf3ef] rounded-xl border-2 border-[#9b4c2e]/40 space-y-1.5 animate-in fade-in duration-150 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#9b4c2e] flex items-center gap-1">
                          <span>✏️</span>
                          <span>{isAr ? 'اسم مدينتك (إدخال يدوي):' : 'Your City Name (Manual Entry):'}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCustomCity(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer font-medium"
                        >
                          {isAr ? 'إلغاء والعودة للقائمة' : 'Cancel & back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => {
                          setCustomCity(e.target.value);
                          setCity(e.target.value);
                        }}
                        placeholder={isAr ? 'اكتب اسم مدينتك هنا (مثال: الخرج، عنيزة، طنجة، المحرق، البصرة...)' : 'Type your city name here (e.g., Al-Kharj, Tangier, Istanbul...)'}
                        className="w-full border border-[#9b4c2e] rounded-lg p-2.5 text-xs bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#9b4c2e]"
                        autoFocus
                      />
                      <p className="text-[10px] text-neutral-500">
                        {isAr ? 'سيتم حفظ هذه المدينة في ملفك الشخصي وعرضها للخاطبين.' : 'This city will be saved on your profile and shown to suitors.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Marital Status, Education Level, Field of Study */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'الحالة الاجتماعية:' : 'Marital Status:'}
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {MARITAL_STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isAr ? s.nameAr : (s.id === 'single' ? 'Single' : s.id === 'divorced' ? 'Divorced' : 'Widowed')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'المستوى التعليمي:' : 'Education Level:'}
                  </label>
                  <select
                    value={isCustomEducation ? '__custom__' : educationLevelId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__custom__') {
                        setIsCustomEducation(true);
                      } else {
                        setIsCustomEducation(false);
                        setEducationLevelId(val);
                        const sel = EDUCATION_LEVELS.find(l => l.id === val);
                        if (sel) setEducation(isAr ? sel.nameAr : sel.nameEn);
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {EDUCATION_LEVELS.map((el) => (
                      <option key={el.id} value={el.id}>
                        {isAr ? el.nameAr : el.nameEn} ({isAr ? el.nameEn : el.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ مؤهل تعليمي آخر (يدوي)...' : '+ Other Education Level (Manual)...'}</option>
                  </select>

                  {!isCustomEducation ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomEducation(true)}
                      className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                    >
                      {isAr ? 'مؤهلك غير موجود؟ اكتبه يدوياً' : 'Not listed? Enter manually'}
                    </button>
                  ) : (
                    <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9b4c2e]">
                          {isAr ? '✏️ اكتب المؤهل التعليمي:' : '✏️ Enter education:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomEducation(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          {isAr ? 'العودة للقائمة' : 'Back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customEducation}
                        onChange={(e) => {
                          setCustomEducation(e.target.value);
                          setEducation(e.target.value);
                        }}
                        placeholder={isAr ? 'اكتب المؤهل التعليمي هنا...' : 'Type education level...'}
                        className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'التخصص الدراسي:' : 'Field of Study:'}
                  </label>
                  <select
                    value={isCustomFieldOfStudy ? '__custom__' : fieldOfStudyId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__custom__') {
                        setIsCustomFieldOfStudy(true);
                      } else {
                        setIsCustomFieldOfStudy(false);
                        setFieldOfStudyId(val);
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {FIELDS_OF_STUDY.map((f) => (
                      <option key={f.id} value={f.id}>
                        {isAr ? f.nameAr : f.nameEn} ({isAr ? f.nameEn : f.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ تخصص دراسي آخر (يدوي)...' : '+ Other Field of Study (Manual)...'}</option>
                  </select>

                  {!isCustomFieldOfStudy ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomFieldOfStudy(true)}
                      className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                    >
                      {isAr ? 'تخصصك غير موجود؟ اكتبه يدوياً' : 'Not listed? Enter manually'}
                    </button>
                  ) : (
                    <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9b4c2e]">
                          {isAr ? '✏️ اكتب التخصص الدراسي:' : '✏️ Enter field:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomFieldOfStudy(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          {isAr ? 'العودة للقائمة' : 'Back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customFieldOfStudy}
                        onChange={(e) => setCustomFieldOfStudy(e.target.value)}
                        placeholder={isAr ? 'اكتب التخصص الدراسي هنا...' : 'Type field of study...'}
                        className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4: Job Category & Specific Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'القطاع المهني / الوظيفي:' : 'Job Category / Industry:'}
                  </label>
                  <select
                    value={isCustomJobCategory ? '__custom__' : jobCategoryId}
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      if (newCatId === '__custom__') {
                        setIsCustomJobCategory(true);
                      } else {
                        setIsCustomJobCategory(false);
                        setJobCategoryId(newCatId);
                        const matchingOccs = OCCUPATIONS.filter(o => o.categoryId === newCatId);
                        if (matchingOccs.length > 0) {
                          setOccupationId(matchingOccs[0].id);
                          setProfession(isAr ? matchingOccs[0].nameAr : matchingOccs[0].nameEn);
                        }
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {isAr ? cat.nameAr : cat.nameEn} ({isAr ? cat.nameEn : cat.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ قطاع عمل آخر (يدوي)...' : '+ Other Industry (Manual)...'}</option>
                  </select>

                  {!isCustomJobCategory ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomJobCategory(true)}
                      className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                    >
                      {isAr ? 'قطاعك غير موجود؟ اكتبه يدوياً' : 'Not listed? Enter manually'}
                    </button>
                  ) : (
                    <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9b4c2e]">
                          {isAr ? '✏️ اكتب قطاع العمل:' : '✏️ Enter job sector:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomJobCategory(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          {isAr ? 'العودة للقائمة' : 'Back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customJobCategory}
                        onChange={(e) => setCustomJobCategory(e.target.value)}
                        placeholder={isAr ? 'اكتب قطاع عملك هنا...' : 'Type job sector...'}
                        className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-700 font-semibold">
                    {isAr ? 'المسمى الوظيفي:' : 'Occupation / Job Title:'}
                  </label>
                  <select
                    value={isCustomOccupation ? '__custom__' : occupationId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '__custom__') {
                        setIsCustomOccupation(true);
                      } else {
                        setIsCustomOccupation(false);
                        setOccupationId(val);
                        const sel = OCCUPATIONS.find(o => o.id === val);
                        if (sel) setProfession(isAr ? sel.nameAr : sel.nameEn);
                      }
                    }}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                  >
                    {OCCUPATIONS.filter(o => o.categoryId === jobCategoryId).map((o) => (
                      <option key={o.id} value={o.id}>
                        {isAr ? o.nameAr : o.nameEn} ({isAr ? o.nameEn : o.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ مسمى وظيفي آخر (يدوي)...' : '+ Other Occupation (Manual)...'}</option>
                  </select>

                  {!isCustomOccupation ? (
                    <button
                      type="button"
                      onClick={() => setIsCustomOccupation(true)}
                      className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                    >
                      {isAr ? 'مسماك غير موجود؟ اكتبه يدوياً' : 'Not listed? Enter manually'}
                    </button>
                  ) : (
                    <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#9b4c2e]">
                          {isAr ? '✏️ اكتب المسمى الوظيفي يدوياً:' : '✏️ Enter job title:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsCustomOccupation(false)}
                          className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                        >
                          {isAr ? 'العودة للقائمة' : 'Back to list'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={customOccupation}
                        onChange={(e) => {
                          setCustomOccupation(e.target.value);
                          setProfession(e.target.value);
                        }}
                        placeholder={isAr ? 'اكتب مسماك الوظيفي هنا (مثال: محامي، مدير تسويق...)' : 'Type job title here...'}
                        className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Row 5: Languages Spoken & Proficiencies (With Custom Manual Entry) */}
              <div className="space-y-2 pt-1 border-t border-[#ede5dd]">
                <label className="text-xs text-neutral-700 font-semibold block">
                  {isAr ? 'اللغات التي تجيدها ومستوى الإتقان:' : 'Languages Spoken & Proficiency:'}
                </label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {userLanguages.map((ul) => (
                    <div 
                      key={ul.languageId}
                      className="inline-flex items-center gap-2 bg-[#faf8f5] border border-[#ede5dd] px-3 py-1 text-xs rounded-full"
                    >
                      <span className="font-bold text-neutral-900">{ul.languageName}</span>
                      <span className="text-[10px] text-neutral-600 bg-white px-1.5 py-0.5 rounded border border-[#ede5dd] font-mono">
                        {ul.proficiency === 'native' 
                          ? (isAr ? 'لغة أم' : 'Native') 
                          : ul.proficiency === 'fluent' 
                          ? (isAr ? 'طلاقة' : 'Fluent') 
                          : (isAr ? 'متوسط' : 'Intermediate')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (userLanguages.length > 1) {
                            setUserLanguages(userLanguages.filter(l => l.languageId !== ul.languageId));
                          }
                        }}
                        className="text-neutral-400 hover:text-red-600 text-sm font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    id="add-language-select"
                    defaultValue=""
                    onChange={(e) => {
                      const langId = e.target.value;
                      if (!langId) return;
                      if (langId === '__custom__') {
                        setIsCustomLanguage(true);
                        e.target.value = '';
                        return;
                      }
                      const langObj = GLOBAL_LANGUAGES.find(l => l.id === langId);
                      if (langObj && !userLanguages.some(ul => ul.languageId === langId)) {
                        setUserLanguages([...userLanguages, {
                          languageId: langId,
                          languageName: isAr ? langObj.nameAr : langObj.nameEn,
                          proficiency: 'fluent'
                        }]);
                      }
                      e.target.value = '';
                    }}
                    className="border border-neutral-200 rounded-xl p-2 text-xs bg-white cursor-pointer"
                  >
                    <option value="">{isAr ? '+ إضافة لغة أخرى...' : '+ Add another language...'}</option>
                    {GLOBAL_LANGUAGES.map(l => (
                      <option key={l.id} value={l.id} disabled={userLanguages.some(ul => ul.languageId === l.id)}>
                        {isAr ? l.nameAr : l.nameEn} ({isAr ? l.nameEn : l.nameAr})
                      </option>
                    ))}
                    <option value="__custom__">✏️ {isAr ? '+ لغة أخرى (كتابة يدوية)...' : '+ Other Language (Manual)...'}</option>
                  </select>

                  {isCustomLanguage && (
                    <div className="flex items-center gap-2 p-1.5 bg-amber-50 rounded-xl border border-amber-200 animate-in fade-in">
                      <input
                        type="text"
                        value={customLanguageName}
                        onChange={(e) => setCustomLanguageName(e.target.value)}
                        placeholder={isAr ? 'اكتب اسم اللغة...' : 'Type language name...'}
                        className="border border-neutral-300 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customLanguageName.trim()) {
                            setUserLanguages([
                              ...userLanguages,
                              {
                                languageId: `custom_lang_${Date.now()}`,
                                languageName: customLanguageName.trim(),
                                proficiency: 'fluent'
                              }
                            ]);
                            setCustomLanguageName('');
                            setIsCustomLanguage(false);
                          }
                        }}
                        className="px-2.5 py-1 bg-[#9b4c2e] text-white text-xs rounded-lg font-bold hover:bg-[#853e24] cursor-pointer"
                      >
                        {isAr ? 'إضافة' : 'Add'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomLanguage(false);
                          setCustomLanguageName('');
                        }}
                        className="text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 3: RELIGIOUS LIFESTYLE (الصفحة الثالثة: السمت الديني) */}
        {/* =============================================================== */}
        {currentStepIndex === 2 && (
          <div className="space-y-6 text-start bg-white p-6 sm:p-8 rounded-2xl border border-[#ede5dd] shadow-xs">
            <div className="border-b border-[#ede5dd] pb-4">
              <span className="text-xs font-bold text-[#9b4c2e] uppercase tracking-wider block mb-1">
                الخطوة الثالثة
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                السمت الديني والالتزام بالسنة المطهرة
              </h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-700 font-semibold">
                  المحافظة على الصلوات الخمس:
                </label>
                <select
                  value={prayerHabit}
                  onChange={(e) => setPrayerHabit(e.target.value as PrayerHabit)}
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                >
                  <option value="always_in_mosque">دائماً في المسجد مع الجماعة والتبكير (للرجال)</option>
                  <option value="always_on_time">دائماً في وقتها بخشوع ومحافظة تامة</option>
                  <option value="mostly_on_time">غالباً في وقتها مع الحرص على النوافل</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-700 font-semibold">
                  مقدار حفظ القرآن الكريم والورد اليومي:
                </label>
                <input
                  type="text"
                  value={quranMemorization}
                  onChange={(e) => setQuranMemorization(e.target.value)}
                  placeholder="حافظ لكتاب الله كاملاً / 10 أجزاء مع مداومة الورد اليومي"
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-700 font-semibold">
                  السمت واللباس الشرعي:
                </label>
                <input
                  type="text"
                  value={religiousAttire}
                  onChange={(e) => setReligiousAttire(e.target.value)}
                  placeholder={gender === 'female' ? 'نقاب شرعي ساتر / حجاب كامل' : 'هيئة وقورة سمت نبوي ولحية'}
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                />
              </div>

              <div className="border border-[#ede5dd] rounded-xl p-4 bg-[#faf8f5] flex items-center justify-between">
                <div>
                  <strong className="text-xs text-neutral-900 block mb-0.5 font-bold">
                    شرط عدم التدخين القطعي:
                  </strong>
                  <span className="text-xs text-neutral-600">
                    منصة نكاح تشترط السلامة التامة من التدخين والمشتقات الضارة لصحة الأسرة.
                  </span>
                </div>
                <span className="text-xs font-bold bg-[#9b4c2e] text-white px-3 py-1 rounded-full">
                  غير مدخن تماماً ✓
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 4: READINESS & WALI (الصفحة الرابعة: الجاهزية والولاية) */}
        {/* =============================================================== */}
        {currentStepIndex === 3 && (
          <div className="space-y-6 text-start bg-white p-6 sm:p-8 rounded-2xl border border-[#ede5dd] shadow-xs">
            <div className="border-b border-[#ede5dd] pb-4">
              <span className="text-xs font-bold text-[#9b4c2e] uppercase tracking-wider block mb-1">
                الخطوة الرابعة
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                {gender === 'female'
                  ? (isAr ? 'الجاهزية وإشراف الولي الشرعي ومعايير الشريك' : 'Readiness, Guardian Oversight & Partner Criteria')
                  : (isAr ? 'الجاهزية والباءة والنفقة الشرعية ومعايير الشريك' : 'Readiness, Ba\'ah (Housing/Support) & Partner Criteria')}
              </h2>
            </div>

            {/* Female Specific Wali Fields */}
            {gender === 'female' ? (
              <div className="space-y-4 border border-[#ede5dd] rounded-xl p-5 bg-[#faf8f5]">
                <div className="flex items-center gap-2 border-b border-[#ede5dd] pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#9b4c2e]" />
                  <h3 className="font-bold text-xs text-[#9b4c2e]">
                    بيانات الولي الشرعي الإلزامية (لا نكاح إلا بولي)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">{isAr ? 'اسم الولي الثلاثي:' : 'Guardian Full Name:'}</label>
                    <input
                      type="text"
                      value={waliName}
                      onChange={(e) => setWaliName(e.target.value)}
                      placeholder={isAr ? 'الشيخ عبد الله بن ناصر (الوالد)' : 'e.g. Abdullah Nasser (Father)'}
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">
                      {isAr ? 'صلة القرابة:' : 'Relationship to Candidate:'}
                    </label>
                    <select
                      value={isCustomWaliRelation ? '__custom__' : waliRelation}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__custom__') {
                          setIsCustomWaliRelation(true);
                        } else {
                          setIsCustomWaliRelation(false);
                          setWaliRelation(val);
                        }
                      }}
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white cursor-pointer"
                    >
                      <option value="الوالد">{isAr ? 'الوالد (الأب)' : 'Father'}</option>
                      <option value="الأخ">{isAr ? 'الأخ الشقيق' : 'Brother'}</option>
                      <option value="العم">{isAr ? 'العم الشقيق' : 'Paternal Uncle'}</option>
                      <option value="الجد">{isAr ? 'الجد' : 'Grandfather'}</option>
                      <option value="__custom__">✏️ {isAr ? '+ صلة قرابة أخرى (يدوي)...' : '+ Other Relation (Manual)...'}</option>
                    </select>

                    {!isCustomWaliRelation ? (
                      <button
                        type="button"
                        onClick={() => setIsCustomWaliRelation(true)}
                        className="text-[11px] text-neutral-500 hover:text-[#9b4c2e] underline cursor-pointer block"
                      >
                        {isAr ? 'صلة القرابة غير مدرجة؟ اكتبها يدوياً' : 'Not listed? Enter manually'}
                      </button>
                    ) : (
                      <div className="mt-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#9b4c2e]">
                            {isAr ? '✏️ اكتب صلة القرابة يدوياً:' : '✏️ Enter relationship:'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsCustomWaliRelation(false)}
                            className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                          >
                            {isAr ? 'العودة للقائمة' : 'Back to list'}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={customWaliRelation}
                          onChange={(e) => {
                            setCustomWaliRelation(e.target.value);
                            setWaliRelation(e.target.value);
                          }}
                          placeholder={isAr ? 'اكتب صلة القرابة (مثال: الخال، ابن الأخ، الوكيل الشرعي...)' : 'Enter relation (e.g., Maternal Uncle, Legal Trustee...)'}
                          className="w-full border border-[#9b4c2e]/40 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-[#9b4c2e]"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">رقم هاتف الولي المباشر:</label>
                    <input
                      type="tel"
                      value={waliPhone}
                      onChange={(e) => setWaliPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">مدينة مجلس الولي للرؤية:</label>
                    <input
                      type="text"
                      value={waliCouncilCity}
                      onChange={(e) => setWaliCouncilCity(e.target.value)}
                      placeholder="الرياض - مجلس العائلة"
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={waliConsentReady}
                    onChange={(e) => setWaliConsentReady(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9b4c2e] focus:ring-[#9b4c2e] border-neutral-300 accent-[#9b4c2e]"
                  />
                  <span className="text-xs text-neutral-800 font-semibold">
                    أؤكد أن الولي على علم تام وموافقة على تسجيلي بالمنصة واستقبال الخُطّاب.
                  </span>
                </label>
              </div>
            ) : (
              /* Male Specific Ba'ah Fields */
              <div className="space-y-4 border border-[#ede5dd] rounded-xl p-5 bg-[#faf8f5]">
                <div className="flex items-center gap-2 border-b border-[#ede5dd] pb-2">
                  <ShieldCheck className="w-4 h-4 text-[#9b4c2e]" />
                  <h3 className="font-bold text-xs text-[#9b4c2e]">
                    إقرار الباءة والاستطاعة والنفقة الشرعية
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">طبيعة السكن المستقل:</label>
                    <input
                      type="text"
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value)}
                      placeholder="شقة تمليك / شقة إيجار مستقلة تماماً"
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-700 font-semibold">المدى التقريبي للدخل الشهري:</label>
                    <input
                      type="text"
                      value={monthlyIncomeRange}
                      onChange={(e) => setMonthlyIncomeRange(e.target.value)}
                      placeholder="18,000 - 24,000 ريال شهرياً"
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pledgeNoKhilwah}
                      onChange={(e) => setPledgeNoKhilwah(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#9b4c2e] focus:ring-[#9b4c2e] border-neutral-300 accent-[#9b4c2e]"
                    />
                    <span className="text-xs text-neutral-800">
                      <strong>التعهد بعدم طلب خلوة:</strong> التزم بأن لا يتم أي تواصل إلا بحضور ونظر الولي الشرعي.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pledgeWaliCouncil}
                      onChange={(e) => setPledgeWaliCouncil(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#9b4c2e] focus:ring-[#9b4c2e] border-neutral-300 accent-[#9b4c2e]"
                    />
                    <span className="text-xs text-neutral-800">
                      <strong>الحضور لمجلس الولي:</strong> التزم بالزيارة الرسمية لمجلس الولي بمدينة إقامته للرؤية الشرعية.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Bio & Qualities */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-700 font-semibold">
                  عن نفسك، منهجك، وطموحاتك في بيت الزوجية:
                </label>
                <textarea
                  rows={3}
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  placeholder="تحدث بصدق ووقار عن شخصيتك وتصورك للعلاقة القائمة على المودة والرحمة..."
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-700 font-semibold">
                  المواصفات والسمات المنشودة في شريك العمر:
                </label>
                <textarea
                  rows={3}
                  value={seekingQualities}
                  onChange={(e) => setSeekingQualities(e.target.value)}
                  placeholder="المواصفات الجوهرية (الدين، الخلق، الوعي، صلة الرحم)..."
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#9b4c2e] bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* PAGE 5: PHOTO UPLOAD & VERIFICATION (الصفحة 5 والأخيرة) */}
        {/* =============================================================== */}
        {currentStepIndex === 4 && (
          <div className="space-y-6 text-start bg-white p-6 sm:p-8 rounded-2xl border border-[#ede5dd] shadow-xs">
            <div className="border-b border-[#ede5dd] pb-4">
              <span className="text-xs font-bold text-[#9b4c2e] uppercase tracking-wider block mb-1">
                الخطوة الخامسة والأخيرة
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                رفع الصورة الشخصية وفحص مطابقتها الشرعية
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                الخطوة الختامية: ارفع صورتك الشخصية وتأكد من اعتمادها شرعياً قبل الانتقال الفوري للبحث عن شريك الحياة.
              </p>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePhotoFileSelected(e.target.files[0]);
                }
              }}
            />

            {/* Upload & Verification Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Photo Upload Dropzone (7 Cols) */}
              <div className="md:col-span-7 space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[240px] space-y-3 ${
                    isDragging ? 'border-[#9b4c2e] bg-[#fbf3ef]' : 'border-[#ede5dd] hover:border-[#9b4c2e] bg-[#faf8f5]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#9b4c2e] text-white flex items-center justify-center shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <strong className="text-sm font-bold text-neutral-900 block">
                      اسحب وأفلت الصورة هنا، أو اضغط للاختيار
                    </strong>
                    <span className="text-xs text-neutral-500 block">
                      يدعم ملفات JPG, PNG, WEBP بدقة ووضوح
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 inline mr-1 text-[#9b4c2e]" />
                    <span>تصفح الصور من جهازك</span>
                  </button>
                </div>

                {/* Quick Presets for Demo */}
                <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
                  <span className="text-neutral-500">أو اختر صورة جاهزة للفحص:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80');
                        setIsPhotoBlurred(false);
                      }}
                      className="border border-[#ede5dd] px-3 py-1 text-xs rounded-full bg-white hover:border-[#9b4c2e] hover:text-[#9b4c2e] transition cursor-pointer"
                    >
                      صورة وقورة لشاب
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPhotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80');
                        setIsPhotoBlurred(true);
                      }}
                      className="border border-[#ede5dd] px-3 py-1 text-xs rounded-full bg-white hover:border-[#9b4c2e] hover:text-[#9b4c2e] transition cursor-pointer"
                    >
                      صورة محتشمة لأخت
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Sharia Verification Card (5 Cols) */}
              <div className="md:col-span-5 border border-[#ede5dd] rounded-2xl bg-[#faf8f5] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#ede5dd] pb-2">
                  <span className="text-xs font-semibold text-neutral-600">
                    معاينة وفحص الصورة
                  </span>
                  {photoVerificationResult.approved && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      معتمدة شرعياً
                    </span>
                  )}
                </div>

                {/* Photo Preview Frame */}
                <div className="relative aspect-3/4 max-w-[190px] mx-auto rounded-xl border border-[#ede5dd] overflow-hidden bg-white shadow-xs">
                  <img
                    src={uploadedPhotoUrl}
                    alt="معاينة الصورة الشخصية"
                    className={`w-full h-full object-cover transition duration-300 ${
                      (gender === 'female' && isPhotoBlurred && !previewUnblurred) ? 'blur-xl scale-110' : ''
                    }`}
                  />

                  {/* Modesty Overlay Badge if blurred */}
                  {gender === 'female' && isPhotoBlurred && !previewUnblurred && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-3 text-center text-white space-y-1 backdrop-blur-xs">
                      <ShieldCheck className="w-6 h-6 text-[#fbd5c6]" />
                      <span className="text-xs font-bold">محجوبة بحياء وستر</span>
                      <span className="text-[10px] text-white/90">لا تُكشف إلا للجاد بعد إذن الولي</span>
                    </div>
                  )}

                  {/* Toggle Preview Button for Female candidate */}
                  {gender === 'female' && (
                    <button
                      type="button"
                      onClick={() => setPreviewUnblurred(!previewUnblurred)}
                      className="absolute bottom-2 inset-x-2 bg-black/70 hover:bg-black text-white text-[10px] py-1 px-2 rounded-lg backdrop-blur-sm flex items-center justify-center gap-1 transition"
                    >
                      {previewUnblurred ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{previewUnblurred ? 'تفعيل التمويه' : 'معاينة بدون تمويه'}</span>
                    </button>
                  )}
                </div>

                {/* Verification Report Items */}
                <div className="space-y-2 text-xs border-t border-[#ede5dd] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">وضوح الملامح:</span>
                    <span className="font-bold text-neutral-900">ممتاز (٩٨٪)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">السمت والوقار الشرعي:</span>
                    <span className="font-bold text-emerald-700">مطابق للضوابط ✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">حفظ ستر الأخوات:</span>
                    <span className="text-neutral-900 font-semibold">
                      {gender === 'female' ? 'تمويه تلقائي مفعل' : 'غير مطلوب'}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Pledges & Confirmation */}
            <div className="border border-[#ede5dd] rounded-2xl p-5 bg-[#faf8f5] space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={photoPledgeConfirmed}
                  onChange={(e) => setPhotoPledgeConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#9b4c2e] focus:ring-[#9b4c2e] border-neutral-300 accent-[#9b4c2e]"
                />
                <span className="text-xs text-neutral-800 leading-relaxed">
                  <strong>إقرار الصورة الشخصية:</strong> أقر بأن هذه الصورة خاصة بي وحديثة، خالية من أي تضليل أو فلاتر مبالغ فيها، وموافقة للآداب والضوابط الشرعية.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none border-t border-[#ede5dd] pt-3">
                <input
                  type="checkbox"
                  checked={sacredOathConfirmed}
                  onChange={(e) => setSacredOathConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#9b4c2e] focus:ring-[#9b4c2e] border-neutral-300 accent-[#9b4c2e]"
                />
                <span className="text-xs text-neutral-800 leading-relaxed">
                  <strong>يمين الأمانة وميثاق النكاح:</strong> أقسم بالله العظيم أن بياناتي صادقة وأن غايتي العفاف وبناء أسرة إسلامية على هدي النبوة دون أي لهو أو خديعة.
                </span>
              </label>
            </div>

            {/* Direct Redirect Callout Banner */}
            <div className="rounded-xl border border-[#9b4c2e]/20 bg-[#fdf6f0] text-[#9b4c2e] p-4 text-xs flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9b4c2e]" />
                <span className="text-neutral-800">عند الضغط على الزر، سيتم حفظ حسابك ونقلك فورياً لصفحة <strong>البحث عن شريك الحياة</strong>.</span>
              </div>
              <span className="rounded-full bg-[#9b4c2e] text-white px-3 py-0.5 text-[11px] font-bold">
                جاهز للبحث فوراً
              </span>
            </div>

          </div>
        )}

        {/* =============================================================== */}
        {/* Navigation Actions (Prev / Next / Finish) */}
        {/* =============================================================== */}
        <div className="pt-8 border-t border-[#ede5dd] mt-10 flex items-center justify-between gap-4">
          <div>
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={loading}
                className="px-5 py-2.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <ArrowRight className={`w-3.5 h-3.5 ${!isAr ? 'rotate-180' : ''}`} />
                <span>{isAr ? 'الخطوة السابقة' : 'Previous Step'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoToHome}
                className="text-xs font-medium text-neutral-600 hover:text-[#9b4c2e] transition cursor-pointer"
              >
                {isAr ? 'العودة للرئيسية' : 'Back to Home'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-xs text-neutral-500 hover:text-[#9b4c2e] transition hidden sm:inline cursor-pointer"
            >
              {isAr ? 'لديك حساب؟ سجل دخولك' : 'Have an account? Sign in'}
            </button>

            <button
              type="button"
              id="registration-submit-btn"
              onClick={handleNextStep}
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-[#9b4c2e] hover:bg-[#853e24] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer min-w-[170px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{isAr ? 'جاري الاعتماد والتوجه...' : 'Submitting & Redirecting...'}</span>
                </div>
              ) : currentStepIndex === 4 ? (
                <div className="flex items-center gap-2 font-bold">
                  <span>{isAr ? 'إتمام التسجيل والبحث عن شريك' : 'Complete Registration & Match'}</span>
                  <ArrowLeft className={`w-3.5 h-3.5 ${!isAr ? 'rotate-180' : ''}`} />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{isAr ? `الصفحة التالية (${currentStepIndex + 2}/5)` : `Next Step (${currentStepIndex + 2}/5)`}</span>
                  <ArrowLeft className={`w-3.5 h-3.5 ${!isAr ? 'rotate-180' : ''}`} />
                </div>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
