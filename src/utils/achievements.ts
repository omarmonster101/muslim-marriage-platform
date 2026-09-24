import { Profile, UserSession, AchievementBadge, AchievementBadgeId } from '../types';

export interface ComputeAchievementsResult {
  badges: AchievementBadge[];
  unlockedCount: number;
  totalCount: number;
  score: number;
  highestLevel: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export function computeProfileAchievements(
  profile?: Profile | null,
  currentSession?: UserSession | null
): ComputeAchievementsResult {
  // 1. Verified Profile
  const isVerified = Boolean(
    profile?.isVerified || 
    profile?.verification?.isVerified || 
    (profile?.wali?.name && profile?.wali?.phone && profile?.wali?.phone.length >= 8)
  );
  const verifiedProgress = isVerified ? 100 : (
    (profile?.wali?.name ? 40 : 0) + (profile?.wali?.phone ? 40 : 0)
  );

  // 2. Deeply Committed (Religious traits)
  let religiousPoints = 0;
  if (profile?.prayerHabit) religiousPoints += 40;
  if (profile?.religiousAttire && profile.religiousAttire.trim().length > 3) religiousPoints += 30;
  if (profile?.islamicInterests && profile.islamicInterests.length > 0) religiousPoints += 30;
  const isDeeplyCommitted = religiousPoints >= 90;

  // 3. Respectful Communicator (Good Standing & respectful dialogue)
  const isSuspended = profile?.moderationStatus === 'suspended';
  const hasGoodStanding = !isSuspended && Boolean(currentSession?.id || profile?.id);
  const respectfulProgress = isSuspended ? 0 : 100;

  // 4. Wali Connected
  let waliPoints = 0;
  if (profile?.wali?.name) waliPoints += 30;
  if (profile?.wali?.phone) waliPoints += 30;
  if (profile?.wali?.relation) waliPoints += 20;
  if (profile?.familyValues && profile.familyValues.trim().length > 10) waliPoints += 20;
  const isWaliConnected = waliPoints >= 90;

  // 5. Moderate Mahr & Sincere Intent
  let mahrPoints = 0;
  if (profile?.mahrExpectation && profile.mahrExpectation.trim().length > 2) mahrPoints += 50;
  if (profile?.partnerExpectations && profile.partnerExpectations.trim().length > 10) mahrPoints += 50;
  const isModerateMahr = mahrPoints >= 90;

  // 6. Complete Sunnah Bio (Overall Completeness)
  const requiredFields = [
    Boolean(profile?.aboutMe && profile.aboutMe.trim().length > 15),
    Boolean(profile?.partnerExpectations && profile.partnerExpectations.trim().length > 15),
    Boolean(profile?.familyValues && profile.familyValues.trim().length > 10),
    Boolean(profile?.prayerHabit),
    Boolean(profile?.religiousAttire),
    Boolean(profile?.quranMemorization),
    Boolean(profile?.wali?.name && profile?.wali?.phone),
    Boolean(profile?.city && profile?.country),
    Boolean(profile?.mahrExpectation),
    Boolean(profile?.marriageTimeline)
  ];
  const completedFieldsCount = requiredFields.filter(Boolean).length;
  const bioCompletionPercentage = Math.round((completedFieldsCount / requiredFields.length) * 100);
  const isCompleteBio = bioCompletionPercentage >= 90;

  // 7. Quran Companion
  const hasQuranMemorization = Boolean(
    profile?.quranMemorization && 
    profile.quranMemorization.trim().length > 2 &&
    !profile.quranMemorization.includes('لا أحفظ')
  );
  const quranProgress = hasQuranMemorization ? 100 : (
    profile?.quranMemorization ? 50 : 0
  );

  // 8. Good Standing & Trust
  const isGoodStandingUnlocked = hasGoodStanding && Boolean(profile?.createdAt || currentSession);

  const badges: AchievementBadge[] = [
    {
      id: 'verified_profile',
      nameAr: 'ملف موثق شرعياً',
      nameEn: 'Verified Profile',
      titleAr: 'وسام التوثيق والتحقق الشرعي',
      descriptionAr: 'تم التحقق من بيانات الهوية ورقم جوال الولي الشرعي لحفظ الأمان والثقة.',
      descriptionEn: 'Identity and guardian contact verified for utmost trust and authenticity.',
      category: 'verification',
      icon: 'ShieldCheck',
      badgeLevel: 'gold',
      isUnlocked: isVerified,
      progressPercentage: verifiedProgress,
      unlockedAt: isVerified ? '2026-09-01' : undefined,
      criteriaAr: 'تأكيد بيانات الولي الشرعي وتوثيق رقم الهاتف والبيانات الشخصية.',
      criteriaEn: 'Confirm Wali phone number and verify personal matrimonial details.',
      rewardTextAr: 'علامة التوثيق الرسمية في بطاقة الخطوبة وأولوية الظهور في نتائج التوافق.',
      rewardTextEn: 'Official verified checkmark on profile card and priority in matches.',
      hadithAr: '«الْمُسْلِمُونَ عَلَى شُرُوطِهِمْ» — إحقاق الصدق وتثبيت الهوية.',
      highlightColor: '#0284c7'
    },
    {
      id: 'deeply_committed',
      nameAr: 'التزام ديني راسخ',
      nameEn: 'Deeply Committed',
      titleAr: 'وسام المحافظة على الشعائر والسمت',
      descriptionAr: 'المحافظة على الصلاة في المسجد/في وقتها، والسمت الشرعي واللباس الحافظ للحياء.',
      descriptionEn: 'Consistent prayer habits, Islamic modesty, and active religious dedication.',
      category: 'religious',
      icon: 'Compass',
      badgeLevel: 'diamond',
      isUnlocked: isDeeplyCommitted,
      progressPercentage: religiousPoints,
      unlockedAt: isDeeplyCommitted ? '2026-09-05' : undefined,
      criteriaAr: 'استكمال قسم الالتزام الديني بالكامل (الصلاة، اللباس، والاهتمامات الإسلامية).',
      criteriaEn: 'Complete all religious practice criteria: prayers, modesty, and Islamic pursuits.',
      rewardTextAr: 'أعلى درجة مطابقة في خوارزمية التوافق مع العائلات الباحثة عن الصلاح.',
      rewardTextEn: 'Maximum compatibility ranking with families seeking devout partners.',
      hadithAr: '«فَاظْفَرْ بِذَاتِ الدِّينِ تَرِبَتْ يَدَاكَ» — وصية رسول الله ﷺ.',
      highlightColor: '#059669'
    },
    {
      id: 'respectful_communicator',
      nameAr: 'حُسن المعاشرة وأدب التواصل',
      nameEn: 'Respectful Communicator',
      titleAr: 'وسام الوقار والاتزان الشرعي',
      descriptionAr: 'الالتزام بأخلاق الإسلام في المراسلات تحت نظر الولي، وخلو السجل من أي مخالفة.',
      descriptionEn: 'Exemplary Islamic etiquette in all communications under guardian supervision.',
      category: 'conduct',
      icon: 'HeartHandshake',
      badgeLevel: 'silver',
      isUnlocked: hasGoodStanding,
      progressPercentage: respectfulProgress,
      unlockedAt: hasGoodStanding ? '2026-09-10' : undefined,
      criteriaAr: 'سجل نظيف خالٍ من أي بلاغات أو مخالفات لضوابط الحشمة والستر.',
      criteriaEn: 'Flawless standing with zero modesty violations or misconduct reports.',
      rewardTextAr: 'شارة الموثوقية الأخلاقية وسرعة قبول طلبات الرؤية من أولياء الأمور.',
      rewardTextEn: 'Moral trust indicator increasing proposal acceptance from Walis.',
      hadithAr: '«إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلَاقًا».',
      highlightColor: '#9b4c2e'
    },
    {
      id: 'wali_connected',
      nameAr: 'رعاية الولي وبرّ الأهل',
      nameEn: 'Wali Connected',
      titleAr: 'وسام الارتباط الأسري الشرعي',
      descriptionAr: 'تسجيل الولي الشرعي وصلة القرابة وتوضيح نمط الأسرة المسلمة وترابطها.',
      descriptionEn: 'Full guardian details provided with deep emphasis on family bond and respect.',
      category: 'family',
      icon: 'Users',
      badgeLevel: 'gold',
      isUnlocked: isWaliConnected,
      progressPercentage: waliPoints,
      unlockedAt: isWaliConnected ? '2026-09-08' : undefined,
      criteriaAr: 'تدوين اسم الولي ورقم جواله وصلة القرابة وطبيعة التنشئة الأسرية.',
      criteriaEn: 'Provide Wali name, verified phone, relationship, and family values.',
      rewardTextAr: 'تسهيل التواصل المباشر مع الولي وفتح مسار الرؤية الشرعية الآمن.',
      rewardTextEn: 'Direct Wali routing enabled for secure Islamic meeting requests.',
      hadithAr: '«لَا نِكَاحَ إِلَّا بِوَلِيٍّ» — بركة البيت المسلم تبدأ برضا الأهل.',
      highlightColor: '#d97706'
    },
    {
      id: 'moderate_mahr',
      nameAr: 'تيسير المهر ووضوح المقصد',
      nameEn: 'Moderate Mahr & Clear Intent',
      titleAr: 'وسام البركة النبوية في تيسير الزواج',
      descriptionAr: 'تيسير متطلبات المهر وتحديد شروط منطقية عادلة لشريك الحياة.',
      descriptionEn: 'Realistic, moderate marriage requirements in harmony with Prophetic simplicity.',
      category: 'marriage',
      icon: 'Sparkles',
      badgeLevel: 'silver',
      isUnlocked: isModerateMahr,
      progressPercentage: mahrPoints,
      unlockedAt: isModerateMahr ? '2026-09-12' : undefined,
      criteriaAr: 'تحديد رؤية واضحة للمهر وتفصيل الشروط والمواصفات للطرف الآخر.',
      criteriaEn: 'Detail clear partner criteria and express flexibility on mahr requirements.',
      rewardTextAr: 'وسام البركة في ملفك لجذب الخاطبين والأخوات الجادات في التيسير.',
      rewardTextEn: 'Prophetic blessing badge attracting sincere, serious candidates.',
      hadithAr: '«أَعْظَمُ النِّسَاءِ بَرَكَةً أَيْسَرُهُنَّ مَئُونَةً».',
      highlightColor: '#e11d48'
    },
    {
      id: 'complete_bio',
      nameAr: 'سيرة متكاملة 100%',
      nameEn: 'Complete Sunnah Bio',
      titleAr: 'وسام الإتقان وكمال السيرة',
      descriptionAr: 'استيفاء كافة بنود السيرة الشرعية (الأسرة، الدين، الشروط، ونبذة الصدق).',
      descriptionEn: '100% completeness across all matrimonial criteria and background sections.',
      category: 'verification',
      icon: 'Award',
      badgeLevel: 'diamond',
      isUnlocked: isCompleteBio,
      progressPercentage: bioCompletionPercentage,
      unlockedAt: isCompleteBio ? '2026-09-15' : undefined,
      criteriaAr: 'الوصول إلى نسبة 90% فما فوق في مؤشر اكتمال السيرة الشرعية.',
      criteriaEn: 'Reach 90%+ completeness score on the profile progress indicator.',
      rewardTextAr: 'تمييز الحساب بإطار ذهبي ورفعه لصدارة استعراض الملفات في ميثاق.',
      rewardTextEn: 'Golden profile border and featured placement on matchmaking browse list.',
      hadithAr: '«إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلاً أَنْ يُتْقِنَهُ».',
      highlightColor: '#8b5cf6'
    },
    {
      id: 'quran_companion',
      nameAr: 'ملازم القرآن الكريم',
      nameEn: 'Quran Companion',
      titleAr: 'وسام أهل القرآن وخاصته',
      descriptionAr: 'العناية بحفظ كتاب الله الكريم وتلاوته وتدبره وبناء البيت على هداه.',
      descriptionEn: 'Dedicated to memorizing, studying, and implementing the Holy Quran in life.',
      category: 'religious',
      icon: 'BookOpen',
      badgeLevel: 'gold',
      isUnlocked: hasQuranMemorization,
      progressPercentage: quranProgress,
      unlockedAt: hasQuranMemorization ? '2026-09-02' : undefined,
      criteriaAr: 'تدوين حفظ القرآن الكريم كاملاً أو أجزاء منه في السيرة الذاتية.',
      criteriaEn: 'Indicate Quran memorization portions and study dedication in bio.',
      rewardTextAr: 'شارة أهل القرآن المضيئة التي تحظى بتقدير ووقار خاص لدى أولياء الأمور.',
      rewardTextEn: 'Special Quranic badge highly respected by Walis and conservative families.',
      hadithAr: '«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ».',
      highlightColor: '#0d9488'
    },
    {
      id: 'good_standing',
      nameAr: 'حُسن السمعة وطيب الأثر',
      nameEn: 'Pillar of Integrity',
      titleAr: 'وسام الأمانة والنزاهة',
      descriptionAr: 'عضوية نشطة وموثوقة تعكس الأمانة وحفظ عهود الميثاق الغليظ.',
      descriptionEn: 'Continuous good standing and exemplary commitment to platform integrity.',
      category: 'conduct',
      icon: 'Award',
      badgeLevel: 'bronze',
      isUnlocked: isGoodStandingUnlocked,
      progressPercentage: isGoodStandingUnlocked ? 100 : 50,
      unlockedAt: isGoodStandingUnlocked ? '2026-09-01' : undefined,
      criteriaAr: 'الالتزام التام بعهد ميثاق الشرعي والحفاظ على نشاط الحساب.',
      criteriaEn: 'Full compliance with Meethaq Sharia pledge and active account engagement.',
      rewardTextAr: 'تقييم ثقة 100% يمنح الأولوية في طلبات الخطوبة والمطابقة.',
      rewardTextEn: '100% integrity score providing trust boost in proposals.',
      hadithAr: '«خِيَارُكُمْ خِيَارُكُمْ لِنِسَائِهِمْ خُلُقًا».',
      highlightColor: '#78716c'
    }
  ];

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalCount = badges.length;
  const score = Math.round((unlockedCount / totalCount) * 100);

  let highestLevel: 'bronze' | 'silver' | 'gold' | 'diamond' = 'bronze';
  if (unlockedCount >= 6) highestLevel = 'diamond';
  else if (unlockedCount >= 4) highestLevel = 'gold';
  else if (unlockedCount >= 2) highestLevel = 'silver';

  return {
    badges,
    unlockedCount,
    totalCount,
    score,
    highestLevel
  };
}
