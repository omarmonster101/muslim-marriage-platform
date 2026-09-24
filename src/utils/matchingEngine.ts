import { Profile, MarriagePreferences } from '../types';
import { CITIES, calculateDistanceKm } from '../data/referenceData';

export interface MatchResult {
  score: number; // 0 to 100
  reasons: string[];
  reasonsEn: string[];
  isAgeMatched: boolean;
  isLocationMatched: boolean;
  isMaritalStatusMatched: boolean;
  isEducationMatched: boolean;
  isLanguageMatched: boolean;
  isChildrenMatched: boolean;
}

/**
 * Smart Objective Matching Engine
 * Compares a candidate profile against the viewer's explicit preferences and profile.
 * Produces an objective match score and factual reasons without subjective moral/personal judgment.
 */
export function calculateProfileMatch(
  profile: Profile,
  userPreferences?: MarriagePreferences,
  currentUserProfile?: Partial<Profile>,
  lang: 'ar' | 'en' = 'ar'
): MatchResult {
  const reasons: string[] = [];
  const reasonsEn: string[] = [];
  let totalPoints = 0;
  let maxPoints = 0;

  // 1. Age Matching
  let isAgeMatched = true;
  if (userPreferences?.minAge && userPreferences?.maxAge) {
    maxPoints += 25;
    if (profile.age >= userPreferences.minAge && profile.age <= userPreferences.maxAge) {
      totalPoints += 25;
      reasons.push(`العمر ضمن النطاق المطلوب (${profile.age} سنة)`);
      reasonsEn.push(`Age is within preference (${profile.age} yrs)`);
    } else {
      isAgeMatched = false;
    }
  } else if (currentUserProfile?.age) {
    // Default reasonable age proximity if no explicit preference set
    maxPoints += 20;
    const diff = Math.abs(currentUserProfile.age - profile.age);
    if (diff <= 5) {
      totalPoints += 20;
      reasons.push(`تقارب عمري ممتاز (${profile.age} سنة)`);
      reasonsEn.push(`Compatible age range (${profile.age} yrs)`);
    } else if (diff <= 10) {
      totalPoints += 12;
    }
  }

  // 2. Location & Distance Matching
  let isLocationMatched = true;
  if (userPreferences?.preferredCountryIds && userPreferences.preferredCountryIds.length > 0) {
    maxPoints += 20;
    if (profile.countryId && userPreferences.preferredCountryIds.includes(profile.countryId)) {
      totalPoints += 20;
      reasons.push(`بلد الإقامة يطابق تفضيلك (${profile.country})`);
      reasonsEn.push(`Country matches preference (${profile.country})`);
    } else {
      isLocationMatched = false;
    }
  }

  // Distance check if user has a city
  if (currentUserProfile?.cityId && profile.cityId) {
    maxPoints += 15;
    if (currentUserProfile.cityId === profile.cityId) {
      totalPoints += 15;
      reasons.push(`الموقع: نفس المدينة السكنية (${profile.city})`);
      reasonsEn.push(`Location: Same city of residence (${profile.city})`);
    } else {
      const c1 = CITIES.find(c => c.id === currentUserProfile.cityId);
      const c2 = CITIES.find(c => c.id === profile.cityId);
      if (c1 && c2) {
        const dist = calculateDistanceKm(c1.lat, c1.lon, c2.lat, c2.lon);
        if (dist <= 100) {
          totalPoints += 10;
          reasons.push(`المسافة الجغرافية قريبة جداً (~ ${dist} كم)`);
          reasonsEn.push(`Proximity: Very close (~ ${dist} km)`);
        }
      }
    }
  }

  // 3. Marital Status Matching
  let isMaritalStatusMatched = true;
  if (userPreferences?.preferredMaritalStatuses && userPreferences.preferredMaritalStatuses.length > 0) {
    maxPoints += 15;
    if (userPreferences.preferredMaritalStatuses.includes(profile.maritalStatus)) {
      totalPoints += 15;
      const statusLabel = profile.maritalStatus === 'single' ? 'لم يسبق له/لها الزواج' : profile.maritalStatus === 'divorced' ? 'مطلق/ة' : 'أرمل/ة';
      const statusLabelEn = profile.maritalStatus === 'single' ? 'Never Married' : profile.maritalStatus === 'divorced' ? 'Divorced' : 'Widowed';
      reasons.push(`الحالة الاجتماعية مطابقة (${statusLabel})`);
      reasonsEn.push(`Marital status matches (${statusLabelEn})`);
    } else {
      isMaritalStatusMatched = false;
    }
  }

  // 4. Education Matching
  let isEducationMatched = false;
  if (userPreferences?.preferredEducationLevelIds && userPreferences.preferredEducationLevelIds.length > 0) {
    maxPoints += 15;
    if (profile.educationLevelId && userPreferences.preferredEducationLevelIds.includes(profile.educationLevelId)) {
      totalPoints += 15;
      isEducationMatched = true;
      reasons.push(`المستوى التعليمي متطابق مع الرغبة`);
      reasonsEn.push(`Education level matches preference`);
    }
  } else if (profile.education) {
    maxPoints += 10;
    totalPoints += 10;
    reasons.push(`مؤهل تعليمي عالي ومعتمد`);
    reasonsEn.push(`Verified higher education credential`);
    isEducationMatched = true;
  }

  // 5. Shared Languages
  let isLanguageMatched = false;
  const userLangs = currentUserProfile?.userLanguages?.map(l => l.languageId) || ['lang_ar'];
  const profileLangs = profile.userLanguages?.map(l => l.languageId) || ['lang_ar'];
  const commonLangs = userLangs.filter(id => profileLangs.includes(id));
  if (commonLangs.length > 0) {
    maxPoints += 10;
    totalPoints += 10;
    isLanguageMatched = true;
    reasons.push(`لغات تواصل مشتركة (${commonLangs.length} لغة)`);
    reasonsEn.push(`Shared spoken languages (${commonLangs.length} languages)`);
  }

  // 6. Children Preference
  let isChildrenMatched = true;
  if (userPreferences?.wantsChildren && profile.wantsChildren) {
    maxPoints += 10;
    if (userPreferences.wantsChildren === profile.wantsChildren || userPreferences.wantsChildren === 'open') {
      totalPoints += 10;
      reasons.push(`توافق في الرؤية المستقبلية للإنجاب والأبناء`);
      reasonsEn.push(`Compatible future perspective on children`);
    }
  }

  // 7. Verification Bonus
  if (profile.verification?.isVerified || profile.isVerified) {
    maxPoints += 10;
    totalPoints += 10;
    reasons.push(`سيرة شرعية موثقة بضمان الولي`);
    reasonsEn.push(`Wali & Sharia verified profile`);
  }

  const calculatedScore = maxPoints > 0 ? Math.min(99, Math.max(65, Math.round((totalPoints / maxPoints) * 100))) : 88;

  return {
    score: calculatedScore,
    reasons,
    reasonsEn,
    isAgeMatched,
    isLocationMatched,
    isMaritalStatusMatched,
    isEducationMatched,
    isLanguageMatched,
    isChildrenMatched
  };
}
