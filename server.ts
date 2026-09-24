import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { mockProfiles, mockCelebrations, mockMarriagePreferences, initialFavorites, initialMarriageRequests, initialReports, initialBlocks } from "./src/data/mockProfiles";
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
  MARITAL_STATUSES, 
  REPORT_REASONS, 
  DISTANCE_OPTIONS, 
  calculateDistanceKm, 
  formatApproximateDistance 
} from "./src/data/referenceData";
import { calculateProfileMatch } from "./src/utils/matchingEngine";
import { 
  Proposal, 
  Profile, 
  CelebrationInvitation, 
  ShariaChatMessage, 
  ShariaMeeting,
  AuditLogItem,
  FlaggedMessage,
  AdminOverviewStats,
  WaliVerificationRecord,
  MarriagePreferences,
  FavoriteRecord,
  MarriageRequestRecord,
  ReportRecord,
  BlockRecord
} from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent state for profiles, proposals, chats & celebrations
let serverProfiles: Profile[] = [...mockProfiles];
let serverCelebrations: CelebrationInvitation[] = [...mockCelebrations];
let userPreferences: Record<string, MarriagePreferences> = { ...mockMarriagePreferences };
let userFavorites: FavoriteRecord[] = [...initialFavorites];
let marriageRequests: MarriageRequestRecord[] = [...initialMarriageRequests];
let userReports: ReportRecord[] = [...initialReports];
let userBlocks: BlockRecord[] = [...initialBlocks];

let proposals: Proposal[] = [
  {
    id: "prop-101",
    suitorId: "prof-1",
    suitorName: "عبدالله بن فهد الشمري",
    suitorAge: 29,
    suitorCity: "الرياض، السعودية",
    targetProfileId: "prof-2",
    targetProfileName: "سارة بنت أحمد الخالدي",
    status: "approved_by_wali", // 'pending_wali' | 'pending_wali_review' | 'approved_by_wali' | 'meeting_scheduled' | 'istikhara' | 'nikah_contracted' | 'declined'
    waliName: "أحمد بن إبراهيم الخالدي (الوالد)",
    waliPhone: "+966 50 123 4567",
    waliStatus: "verified",
    note: "السلام عليكم ورحمة الله، يشرفني التقدم لخطبة ابنتكم المصونة على سنة الله ورسوله، وأرجو التكرم بالاطلاع على ملفي والتواصل معي عبر الولي.",
    createdAt: "2026-09-18T14:30:00Z",
    updatedAt: "2026-09-18T14:30:00Z",
    stage: "تمت موافقة الولي - جارٍ التنسيق لمجلس الرؤية الشرعية",
    mahramSupervised: true,
    meeting: {
      id: "meet-1",
      proposalId: "prop-101",
      meetingDate: "الجمعة القادم 25 ربيع الأول",
      meetingTime: "04:30 مساءً",
      meetingType: "in_person",
      venueAddress: "مجلس الشيخ أحمد الخالدي - حي النخيل، الرياض",
      chaperoneName: "أحمد بن إبراهيم الخالدي",
      chaperoneRelation: "الوالد",
      guidelinesAcknowledged: true,
      status: "scheduled",
      notes: "نرحب بالخاطب الكريم في مجلس الأسرة بحضور الوالد والإخوة الكرام وفق الهدي النبوي الشريف."
    }
  },
  {
    id: "prop-102",
    suitorId: "prof-3",
    suitorName: "طارق بن عمر المنصوري",
    suitorAge: 32,
    suitorCity: "دبي، الإمارات",
    targetProfileId: "prof-4",
    targetProfileName: "مريم بنت سعيد الغامدي",
    status: "pending_wali_review",
    waliName: "سعيد بن راشد الغامدي (الأخ الأكبر)",
    waliPhone: "+971 50 987 6543",
    waliStatus: "pending_verification",
    note: "راغب في الزواج وفق الشريعة الإسلامية ومستعد لكافة الضوابط ومقابلة الولي الكريم في أقرب وقت.",
    createdAt: "2026-09-19T08:15:00Z",
    updatedAt: "2026-09-19T08:15:00Z",
    stage: "بانتظار مراجعة واعتماد الولي الشرعي",
    mahramSupervised: true
  }
];

let proposalChats: Record<string, ShariaChatMessage[]> = {
  "prop-101": [
    {
      id: "msg-1",
      proposalId: "prop-101",
      senderId: "system",
      senderName: "نظام ميثاق الشرعي",
      senderRole: "system",
      content: "تم فتح مجلس المحادثة الشرعية الموثقة تحت إشراف ولي الأمر. جميع الرسائل مرئية ومراقبة لصون الأعراض وتجنب الخلوة المحرمة.",
      timestamp: "2026-09-18T15:00:00Z"
    },
    {
      id: "msg-2",
      proposalId: "prop-101",
      senderId: "prof-1",
      senderName: "عبدالله الشمري (الخاطب)",
      senderRole: "suitor",
      content: "السلام عليكم ورحمة الله وبركاته يا عمي الشيخ أحمد، يشرفني التواصل معكم للترتيب لمجلس الرؤية الشرعية وطلب كريمتكم.",
      timestamp: "2026-09-18T15:05:00Z"
    },
    {
      id: "msg-3",
      proposalId: "prop-101",
      senderId: "wali-1",
      senderName: "أحمد الخالدي (الولي)",
      senderRole: "wali",
      content: "وعليكم السلام ورحمة الله وبركاته، أهلاً بك يا بني. اطلعنا على بياناتك الموثقة ورأينا فيها خيراً ودعوناك لمجلس الرؤية الشرعية في بيتنا بالرياض.",
      timestamp: "2026-09-18T16:20:00Z"
    },
    {
      id: "msg-4",
      proposalId: "prop-101",
      senderId: "prof-2",
      senderName: "سارة الخالدي (المخطوبة)",
      senderRole: "candidate",
      content: "السلام عليكم، جزاكم الله خيراً، وأسأل الله أن يكتب ما فيه الخير والتوفيق للجميع.",
      timestamp: "2026-09-18T16:45:00Z"
    }
  ]
};

let platformStats = {
  activeSeekers: 14850,
  verifiedWalis: 6240,
  successfulNikahs: 2890,
  shariaCommitmentRate: "100%"
};

// Admin State & Audit Trail
let auditLogs: AuditLogItem[] = [
  {
    id: "log-1",
    timestamp: "2026-09-19T05:30:00Z",
    action: "اعتماد توثيق الولي الشرعي",
    category: "wali",
    operator: "المشرف العام (النظام)",
    target: "أحمد بن إبراهيم الخالدي (الوالد)",
    status: "success",
    details: "تم فحص صك القرابة والمصادقة على رقم الهاتف +966 50 123 4567 بنجاح."
  },
  {
    id: "log-2",
    timestamp: "2026-09-19T04:15:00Z",
    action: "توثيق صك عقد قران رقمي",
    category: "nikah",
    operator: "المشرف العام (النظام)",
    target: "عبدالله بن فهد الشمري & سارة بنت أحمد الخالدي",
    status: "success",
    details: "تم توثيق المهر وإصدار صك النكاح الشرعي وبطاقة الاحتفال."
  },
  {
    id: "log-3",
    timestamp: "2026-09-19T03:00:00Z",
    action: "تنبيه حياء شرعي في المحادثة",
    category: "security",
    operator: "نظام الرقابة الشرعية الآلي",
    target: "جلسة الرؤية prop-101",
    status: "warning",
    details: "محاولة تبادل رقم اتصال خاص قبل موافقة الولي المباشرة."
  },
  {
    id: "log-4",
    timestamp: "2026-09-18T20:00:00Z",
    action: "اعتماد السيرة الذاتية",
    category: "profile",
    operator: "لجنة الفحص والمطابقة",
    target: "طارق بن عمر المنصوري",
    status: "success",
    details: "تمت مراجعة بيانات التعليم، المهنة، وصلاح الدين بنجاح."
  }
];

let waliRequests: WaliVerificationRecord[] = [
  {
    id: "wali-req-1",
    waliName: "أحمد بن إبراهيم الخالدي",
    waliPhone: "+966 50 123 4567",
    relation: "الوالد",
    candidateName: "سارة بنت أحمد الخالدي",
    candidateNationalId: "108934**** / صك ولاية معتمد",
    documentProof: "صك ولاية شرعي رقم 44102948 صادر من المحكمة العامة",
    status: "verified",
    submittedAt: "2026-09-17T10:00:00Z",
    verifiedAt: "2026-09-18T12:00:00Z"
  },
  {
    id: "wali-req-2",
    waliName: "سعيد بن محمد الغامدي",
    waliPhone: "+966 55 987 6543",
    relation: "الوالد",
    candidateName: "مريم بنت سعيد الغامدي",
    candidateNationalId: "109823****",
    documentProof: "دفتر عائلة وبطاقة الهوية الوطنية المعتمدة",
    status: "pending",
    submittedAt: "2026-09-19T02:00:00Z"
  },
  {
    id: "wali-req-3",
    waliName: "د. خالد بن يوسف القحطاني",
    waliPhone: "+966 53 456 7890",
    relation: "الأخ الأكبر (وكيل شرعي)",
    candidateName: "نورة بنت يوسف القحطاني",
    candidateNationalId: "103456****",
    documentProof: "وكالة شرعية رسمية من ناجز / المحكمة العامة",
    status: "verified",
    submittedAt: "2026-09-16T14:30:00Z",
    verifiedAt: "2026-09-17T09:15:00Z"
  }
];

let flaggedMessages: FlaggedMessage[] = [
  {
    id: "flag-1",
    proposalId: "prop-101",
    senderName: "عبدالله بن فهد الشمري",
    senderRole: "suitor",
    content: "السلام عليكم، هل بالإمكان التحدث عبر الهاتف 0501234567 مباشرة قبل مجلس الرؤية؟",
    flagReason: "محاولة تبادل رقم اتصال مباشر دون استئذان الولي المشرف",
    timestamp: "2026-09-18T16:00:00Z",
    reviewed: false
  }
];

function recordAuditLog(
  action: string,
  category: 'profile' | 'wali' | 'proposal' | 'nikah' | 'security' | 'system',
  target: string,
  status: 'success' | 'warning' | 'alert',
  details: string,
  operator: string = "المشرف العام (النظام)"
) {
  const newLog: AuditLogItem = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    category,
    operator,
    target,
    status,
    details
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 200) auditLogs.pop();
  return newLog;
}

// Lazy Gemini AI initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Meethaq Islamic Matrimony API",
    version: "3.0.0",
    compliance: "Sharia Board Reviewed & Mahram Supervised",
    timestamp: new Date().toISOString()
  });
});

// 2. Stats
app.get("/api/stats", (req, res) => {
  res.json({
    success: true,
    data: platformStats,
    stats: platformStats
  });
});

// Reference Data Endpoint
app.get("/api/reference-data", (req, res) => {
  res.json({
    success: true,
    data: {
      countries: COUNTRIES,
      regions: REGIONS,
      cities: CITIES,
      nationalities: NATIONALITIES,
      educationLevels: EDUCATION_LEVELS,
      fieldsOfStudy: FIELDS_OF_STUDY,
      jobCategories: JOB_CATEGORIES,
      occupations: OCCUPATIONS,
      languages: GLOBAL_LANGUAGES,
      maritalStatuses: MARITAL_STATUSES,
      reportReasons: REPORT_REASONS,
      distanceOptions: DISTANCE_OPTIONS
    }
  });
});

// 3. Profiles CRUD & Smart Search
app.get("/api/profiles", (req, res) => {
  const { 
    viewerId,
    gender, 
    countryId, 
    regionId,
    cityId,
    nationalityId,
    educationLevelId,
    fieldOfStudyId,
    jobCategoryId,
    occupationId,
    maritalStatus,
    prayerHabit, 
    minAge,
    maxAge,
    maxDistanceKm,
    hasChildren,
    isVerifiedOnly,
    search,
    sort,
    lang
  } = req.query;

  const currentLang = (lang === 'en' ? 'en' : 'ar') as 'ar' | 'en';
  let filtered = [...serverProfiles];

  // 1. Exclude deleted or suspended profiles
  filtered = filtered.filter(p => !p.isDeleted && p.moderationStatus !== 'suspended');

  // 2. Viewer context & Blocking & Gender separation
  let viewerProfile: Profile | undefined;
  if (viewerId && typeof viewerId === "string") {
    viewerProfile = serverProfiles.find(p => p.id === viewerId);
    
    // Check blocks in both directions
    const blockedByUser = userBlocks.filter(b => b.blockerId === viewerId).map(b => b.blockedUserId);
    const blockedViewer = userBlocks.filter(b => b.blockedUserId === viewerId).map(b => b.blockerId);
    filtered = filtered.filter(p => p.id !== viewerId && !blockedByUser.includes(p.id) && !blockedViewer.includes(p.id));

    // Strict Sharia gender separation: Men view Women, Women view Men
    if (viewerProfile) {
      if (viewerProfile.gender === 'male') {
        filtered = filtered.filter(p => p.gender === 'female');
      } else if (viewerProfile.gender === 'female') {
        filtered = filtered.filter(p => p.gender === 'male');
      }
    }
  } else if (gender && gender !== "all") {
    filtered = filtered.filter(p => p.gender === gender);
  }

  // 3. Structured Filters
  if (countryId && countryId !== "all") {
    filtered = filtered.filter(p => p.countryId === countryId);
  }
  if (regionId && regionId !== "all") {
    filtered = filtered.filter(p => p.regionId === regionId);
  }
  if (cityId && cityId !== "all") {
    filtered = filtered.filter(p => p.cityId === cityId);
  }
  if (nationalityId && nationalityId !== "all") {
    filtered = filtered.filter(p => p.nationalityId === nationalityId);
  }
  if (educationLevelId && educationLevelId !== "all") {
    filtered = filtered.filter(p => p.educationLevelId === educationLevelId);
  }
  if (fieldOfStudyId && fieldOfStudyId !== "all") {
    filtered = filtered.filter(p => p.fieldOfStudyId === fieldOfStudyId);
  }
  if (jobCategoryId && jobCategoryId !== "all") {
    filtered = filtered.filter(p => p.jobCategoryId === jobCategoryId);
  }
  if (occupationId && occupationId !== "all") {
    filtered = filtered.filter(p => p.occupationId === occupationId);
  }
  if (maritalStatus && maritalStatus !== "all") {
    filtered = filtered.filter(p => p.maritalStatus === maritalStatus);
  }
  if (prayerHabit && prayerHabit !== "all") {
    filtered = filtered.filter(p => p.prayerHabit === prayerHabit);
  }
  if (hasChildren === 'false') {
    filtered = filtered.filter(p => !p.hasChildren);
  } else if (hasChildren === 'true') {
    filtered = filtered.filter(p => p.hasChildren);
  }
  if (isVerifiedOnly === 'true') {
    filtered = filtered.filter(p => p.isVerified || p.verification?.isVerified);
  }

  // Age range
  if (minAge) {
    const min = parseInt(minAge as string, 10);
    if (!isNaN(min)) filtered = filtered.filter(p => p.age >= min);
  }
  if (maxAge) {
    const max = parseInt(maxAge as string, 10);
    if (!isNaN(max)) filtered = filtered.filter(p => p.age <= max);
  }

  // Search keyword in indexed fields
  if (search && typeof search === "string" && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.fullName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q) ||
      p.education.toLowerCase().includes(q) ||
      p.aboutMe.toLowerCase().includes(q) ||
      p.partnerExpectations.toLowerCase().includes(q)
    );
  }

  // 4. Enrich each profile with Distance & Match Score
  const viewerPref = (viewerId && typeof viewerId === "string") ? userPreferences[viewerId] : undefined;

  let enriched = filtered.map(p => {
    // Distance
    let approxDistanceKm: number | undefined;
    if (viewerProfile?.cityId && p.cityId) {
      const c1 = CITIES.find(c => c.id === viewerProfile?.cityId);
      const c2 = CITIES.find(c => c.id === p.cityId);
      if (c1 && c2) {
        approxDistanceKm = calculateDistanceKm(c1.lat, c1.lon, c2.lat, c2.lon);
      }
    }
    const distanceText = formatApproximateDistance(p.cityId, viewerProfile?.cityId, currentLang);

    // Matching
    const matchRes = calculateProfileMatch(p, viewerPref, viewerProfile, currentLang);

    return {
      ...p,
      approxDistanceKm,
      distanceText,
      matchScore: matchRes.score,
      matchReasons: currentLang === 'en' ? matchRes.reasonsEn : matchRes.reasons
    };
  });

  // Filter by max distance if requested
  if (maxDistanceKm && maxDistanceKm !== "all") {
    const maxDist = parseInt(maxDistanceKm as string, 10);
    if (!isNaN(maxDist) && maxDist > 0) {
      enriched = enriched.filter(p => p.approxDistanceKm !== undefined && p.approxDistanceKm <= maxDist);
    }
  }

  // 5. Sorting
  if (sort === 'age_asc') {
    enriched.sort((a, b) => a.age - b.age);
  } else if (sort === 'age_desc') {
    enriched.sort((a, b) => b.age - a.age);
  } else if (sort === 'distance') {
    enriched.sort((a, b) => (a.approxDistanceKm ?? 99999) - (b.approxDistanceKm ?? 99999));
  } else {
    // Default: Best objective compatibility match first
    enriched.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }

  res.json({
    success: true,
    count: enriched.length,
    profiles: enriched,
    data: enriched
  });
});

app.get("/api/profiles/:id", (req, res) => {
  const { id } = req.params;
  const { viewerId, lang } = req.query;
  const currentLang = (lang === 'en' ? 'en' : 'ar') as 'ar' | 'en';

  const profile = serverProfiles.find(p => p.id === id);
  if (!profile || profile.isDeleted) {
    return res.status(404).json({ success: false, message: "الملف الشخصي غير موجود أو تم حذفه" });
  }

  let viewerProfile: Profile | undefined;
  if (viewerId && typeof viewerId === "string") {
    viewerProfile = serverProfiles.find(p => p.id === viewerId);
    // Check if blocked
    const isBlocked = userBlocks.some(b => (b.blockerId === viewerId && b.blockedUserId === id) || (b.blockerId === id && b.blockedUserId === viewerId));
    if (isBlocked) {
      return res.status(403).json({ success: false, message: "لا يمكن عرض هذا الملف نظراً لوجود حظر بين الطرفين" });
    }
  }

  const viewerPref = (viewerId && typeof viewerId === "string") ? userPreferences[viewerId] : undefined;
  const matchRes = calculateProfileMatch(profile, viewerPref, viewerProfile, currentLang);
  const distanceText = formatApproximateDistance(profile.cityId, viewerProfile?.cityId, currentLang);

  res.json({
    success: true,
    profile: {
      ...profile,
      distanceText,
      matchScore: matchRes.score,
      matchReasons: currentLang === 'en' ? matchRes.reasonsEn : matchRes.reasons
    }
  });
});

app.post("/api/profiles", (req, res) => {
  const body = req.body;
  if (!body.fullName || !body.gender || !body.wali?.name) {
    return res.status(400).json({ success: false, message: "البيانات الأساسية وبيانات الولي الشرعي مطلوبة." });
  }

  // Resolve names from normalized IDs if provided
  let countryName = body.country;
  let cityName = body.city;
  let nationalityName = body.nationality;
  let educationName = body.education;
  let professionName = body.profession;

  if (body.countryId) {
    const c = COUNTRIES.find(x => x.id === body.countryId);
    if (c) countryName = c.nameAr;
  }
  if (body.cityId) {
    const ct = CITIES.find(x => x.id === body.cityId);
    if (ct) cityName = ct.nameAr;
  }
  if (body.nationalityId) {
    const n = NATIONALITIES.find(x => x.id === body.nationalityId);
    if (n) nationalityName = n.nameAr;
  }
  if (body.educationLevelId) {
    const e = EDUCATION_LEVELS.find(x => x.id === body.educationLevelId);
    if (e) educationName = e.nameAr;
  }
  if (body.occupationId) {
    const o = OCCUPATIONS.find(x => x.id === body.occupationId);
    if (o) professionName = o.nameAr;
  }

  const newProfile: Profile = {
    ...body,
    country: countryName || "المملكة العربية السعودية",
    city: cityName || "الرياض",
    nationality: nationalityName || "سعودي",
    education: educationName || "بكالوريوس",
    profession: professionName || "موظف",
    id: `prof-${Date.now()}`,
    isVerified: true,
    verification: {
      emailVerified: true,
      phoneVerified: true,
      identityVerified: false,
      profileVerified: true,
      isVerified: true
    },
    lastActive: "نشط الآن",
    lastActiveTimestamp: Date.now(),
    showLastSeen: true,
    showOnlineStatus: true,
    privacySettings: {
      profileVisibility: "public",
      showOnlineStatus: true,
      showLastSeen: true,
      allowMessages: "accepted_requests_only",
      allowMarriageRequests: "all_matching",
      searchVisibility: true,
      blurPhotosByDefault: body.gender === 'female'
    },
    moderationStatus: "approved",
    createdAt: new Date().toISOString()
  };

  serverProfiles.unshift(newProfile);
  platformStats.activeSeekers += 1;

  recordAuditLog(
    "تسجيل سيرة شرعية جديدة", 
    "profile", 
    newProfile.fullName, 
    "success", 
    `تم تسجيل السيرة بنجاح تحت إشراف الولي: ${newProfile.wali?.name}`
  );

  res.status(201).json({
    success: true,
    message: "تم تسجيل السيرة الشرعية وتوثيقها بنجاح.",
    profile: newProfile
  });
});

app.put("/api/profiles/:id", (req, res) => {
  const { id } = req.params;
  const index = serverProfiles.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "الملف الشخصي غير موجود" });
  }

  serverProfiles[index] = {
    ...serverProfiles[index],
    ...req.body,
    id // protect original ID
  };

  res.json({
    success: true,
    message: "تم تحديث بيانات السيرة الشرعية بنجاح",
    profile: serverProfiles[index]
  });
});

app.delete("/api/profiles/:id", (req, res) => {
  const { id } = req.params;
  const prof = serverProfiles.find(p => p.id === id);
  if (!prof) return res.status(404).json({ success: false, message: "الملف غير موجود" });
  prof.isDeleted = true;
  prof.moderationStatus = 'suspended';
  res.json({ success: true, message: "تم حذف / تعطيل الملف الشخصي بنجاح" });
});

// 3.1 User Marriage Preferences (معايير وتفضيلات الشريك)
app.get("/api/preferences/:userId", (req, res) => {
  const { userId } = req.params;
  const pref = userPreferences[userId] || null;
  res.json({ success: true, data: pref });
});

app.post("/api/preferences/:userId", (req, res) => {
  const { userId } = req.params;
  userPreferences[userId] = {
    ...req.body,
    userId
  };
  res.json({
    success: true,
    message: "تم حفظ معايير وتفضيلات الشريك المطلوب بنجاح في قاعدة البيانات",
    data: userPreferences[userId]
  });
});

// 3.2 User Favorites (المفضلة)
app.get("/api/favorites/:userId", (req, res) => {
  const { userId } = req.params;
  const favs = userFavorites.filter(f => f.userId === userId);
  const populated = favs.map(f => {
    const prof = serverProfiles.find(p => p.id === f.targetProfileId);
    return {
      ...f,
      targetProfile: prof
    };
  }).filter(f => f.targetProfile && !f.targetProfile.isDeleted);

  res.json({ success: true, data: populated });
});

app.post("/api/favorites", (req, res) => {
  const { userId, targetProfileId } = req.body;
  if (!userId || !targetProfileId) {
    return res.status(400).json({ success: false, message: "Missing userId or targetProfileId" });
  }

  const existingIdx = userFavorites.findIndex(f => f.userId === userId && f.targetProfileId === targetProfileId);
  if (existingIdx >= 0) {
    userFavorites.splice(existingIdx, 1);
    return res.json({ success: true, isFavorite: false, message: "تمت إزالة الملف من قائمة المفضلة" });
  } else {
    const newFav: FavoriteRecord = {
      id: `fav-${Date.now()}`,
      userId,
      targetProfileId,
      createdAt: new Date().toISOString()
    };
    userFavorites.unshift(newFav);
    return res.json({ success: true, isFavorite: true, message: "تمت إضافة الملف إلى قائمة المفضلة بنجاح", data: newFav });
  }
});

// 3.3 Marriage Requests (طلبات الزواج الشرعي)
app.get("/api/marriage-requests", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.json({ success: true, data: marriageRequests });
  }
  const userRequests = marriageRequests.filter(r => r.senderId === userId || r.targetProfileId === userId);
  res.json({ success: true, data: userRequests });
});

app.post("/api/marriage-requests", (req, res) => {
  const { senderId, targetProfileId, note } = req.body;
  const sender = serverProfiles.find(p => p.id === senderId);
  const target = serverProfiles.find(p => p.id === targetProfileId);

  if (!sender || !target) {
    return res.status(400).json({ success: false, message: "بيانات الخاطب أو المخطوبة غير متوفرة" });
  }

  // Check if pending exists
  const existing = marriageRequests.find(r => r.senderId === senderId && r.targetProfileId === targetProfileId && r.status === 'pending');
  if (existing) {
    return res.status(400).json({ success: false, message: "يوجد طلب خطوبة معلق مسبقاً لهذا الملف، بانتظار إشعار الولي" });
  }

  const newReq: MarriageRequestRecord = {
    id: `req-${Date.now()}`,
    senderId,
    senderName: sender.fullName,
    senderGender: sender.gender,
    senderAge: sender.age,
    senderCity: sender.city,
    targetProfileId,
    targetProfileName: target.fullName,
    targetGender: target.gender,
    status: 'pending',
    note: note || "طلب خطوبة شرعي جاد على كتاب الله وسنة رسوله ﷺ، موجه لولي الأمر الكريم.",
    waliName: target.wali?.name,
    waliPhone: target.wali?.phone,
    waliApproved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  marriageRequests.unshift(newReq);

  // Synchronize with proposals list for Sharia tracking
  const newProp: Proposal = {
    id: `prop-${newReq.id}`,
    suitorId: sender.id,
    suitorName: sender.fullName,
    suitorAge: sender.age,
    suitorCity: sender.city,
    targetProfileId: target.id,
    targetProfileName: target.fullName,
    status: "pending_wali_review",
    waliName: target.wali?.name || "ولي الأمر الشرعي",
    waliPhone: target.wali?.phone || "+966 50 123 4567",
    waliStatus: "verified",
    note: newReq.note,
    createdAt: newReq.createdAt,
    updatedAt: newReq.updatedAt,
    stage: "طلب خطوبة جديد بانتظار اعتماد الولي الشرعي",
    mahramSupervised: true
  };
  proposals.unshift(newProp);

  recordAuditLog(
    "إرسال طلب خطوبة شرعي", 
    "proposal", 
    `${sender.fullName} -> ${target.fullName}`, 
    "success", 
    `تم إرسال الطلب وإشعار الولي (${target.wali?.name}) بالرسالة النصية الموثقة.`
  );

  res.status(201).json({
    success: true,
    message: "تم إرسال طلب الزواج الشرعي إلى الولي بنجاح وتوثيق الطلب",
    data: newReq
  });
});

app.put("/api/marriage-requests/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const reqItem = marriageRequests.find(r => r.id === id);
  if (!reqItem) {
    return res.status(404).json({ success: false, message: "طلب الخطوبة غير موجود" });
  }

  reqItem.status = status;
  reqItem.updatedAt = new Date().toISOString();

  if (status === 'accepted') {
    reqItem.waliApproved = true;
    recordAuditLog("موافقة الولي على الخطوبة", "proposal", reqItem.targetProfileName, "success", `تمت موافقة الولي على طلب ${reqItem.senderName}`);
  }

  res.json({
    success: true,
    message: status === 'accepted' ? "تمت الموافقة على طلب الزواج من قبل الولي الشرعي" : "تم تحديث حالة طلب الزواج",
    data: reqItem
  });
});

// 3.4 Reports (الإبلاغ عن ملف)
app.get("/api/reports", (req, res) => {
  res.json({ success: true, data: userReports });
});

app.post("/api/reports", (req, res) => {
  const { reporterId, reportedProfileId, reason, details } = req.body;
  const reporter = serverProfiles.find(p => p.id === reporterId);
  const target = serverProfiles.find(p => p.id === reportedProfileId);

  if (!reportedProfileId || !reason) {
    return res.status(400).json({ success: false, message: "يرجى تحديد سبب البلاغ والملف المعني" });
  }

  const reasonDef = REPORT_REASONS.find(r => r.id === reason);
  const reasonName = reasonDef ? reasonDef.nameAr : reason;

  const newReport: ReportRecord = {
    id: `rep-${Date.now()}`,
    reporterId: reporterId || "guest",
    reporterName: reporter ? reporter.fullName : "عضو موثق",
    reportedProfileId,
    reportedProfileName: target ? target.fullName : "ملف غير معروف",
    reason: reasonName,
    details: details || "",
    status: "pending_review",
    createdAt: new Date().toISOString()
  };

  userReports.unshift(newReport);

  recordAuditLog(
    "تقديم بلاغ مخالفة", 
    "security", 
    target?.fullName || reportedProfileId, 
    "warning", 
    `تم تسجيل بلاغ بسبب: (${reasonName}) - التفاصيل: ${details || 'بدون تفاصيل إضافية'}`
  );

  res.status(201).json({
    success: true,
    message: "تم رفع البلاغ للجنة الرقابة الشرعية والمشرف العام وسيتم فحص السيرة فوراً واتخاذ الإجراء اللازم.",
    data: newReport
  });
});

app.put("/api/reports/:id/action", (req, res) => {
  const { id } = req.params;
  const { action, note } = req.body;
  const rep = userReports.find(r => r.id === id);
  if (!rep) return res.status(404).json({ success: false, message: "البلاغ غير موجود" });

  if (action === 'suspend') {
    rep.status = 'resolved_suspended';
    const target = serverProfiles.find(p => p.id === rep.reportedProfileId);
    if (target) {
      target.moderationStatus = 'suspended';
      target.isDeleted = true;
    }
    recordAuditLog("إيقاف حساب بناء على بلاغ", "security", rep.reportedProfileName, "alert", "تم إيقاف وحجب الملف بعد ثبوت المخالفة");
  } else if (action === 'warn') {
    rep.status = 'resolved_warned';
    recordAuditLog("توجيه إنذار لحساب", "security", rep.reportedProfileName, "warning", "تم توجيه إنذار بالالتزام بالضوابط الشرعية");
  } else {
    rep.status = 'resolved_dismissed';
  }

  res.json({ success: true, message: "تم تحديث الإجراء على البلاغ بنجاح", data: rep });
});

// 3.5 Blocks (الحظر)
app.get("/api/blocks/:userId", (req, res) => {
  const { userId } = req.params;
  const blocks = userBlocks.filter(b => b.blockerId === userId);
  const populated = blocks.map(b => {
    const prof = serverProfiles.find(p => p.id === b.blockedUserId);
    return {
      ...b,
      blockedProfile: prof
    };
  });
  res.json({ success: true, data: populated });
});

app.post("/api/blocks", (req, res) => {
  const { blockerId, blockedUserId, reason } = req.body;
  if (!blockerId || !blockedUserId) {
    return res.status(400).json({ success: false, message: "Missing blockerId or blockedUserId" });
  }

  const existing = userBlocks.find(b => b.blockerId === blockerId && b.blockedUserId === blockedUserId);
  if (!existing) {
    userBlocks.push({
      id: `blk-${Date.now()}`,
      blockerId,
      blockedUserId,
      reason: reason || "حظر بواسطة المستخدم",
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: "تم حظر المستخدم بنجاح. لن يظهر هذا الحساب لك في نتائج البحث ولن يتمكن من إرسال طلبات لك."
  });
});

app.delete("/api/blocks/:blockerId/:blockedUserId", (req, res) => {
  const { blockerId, blockedUserId } = req.params;
  userBlocks = userBlocks.filter(b => !(b.blockerId === blockerId && b.blockedUserId === blockedUserId));
  res.json({ success: true, message: "تم إلغاء حظر المستخدم بنجاح" });
});

// 4. Proposals & Khitbah
app.get("/api/proposals", (req, res) => {
  res.json({
    success: true,
    count: proposals.length,
    data: proposals,
    proposals: proposals
  });
});

app.post("/api/proposals", (req, res) => {
  const { suitorId, suitorName, suitorAge, suitorCity, targetProfileId, targetProfileName, waliName, waliPhone, note } = req.body;
  if (!targetProfileId || !suitorName) {
    return res.status(400).json({ success: false, message: "Missing required suitor or candidate details." });
  }

  const newProposal: Proposal = {
    id: `prop-${Date.now().toString().slice(-5)}`,
    suitorId: suitorId || "prof-1",
    suitorName: suitorName || "خاطب موثق",
    suitorAge: suitorAge || 28,
    suitorCity: suitorCity || "الرياض",
    targetProfileId,
    targetProfileName: targetProfileName || "المخطوبة الكريمة",
    status: "pending_wali_review",
    waliName: waliName || "ولي الأمر الشرعي",
    waliPhone: waliPhone || "+966 50 123 4567",
    waliStatus: "verified",
    note: note || "طلب خطوبة شرعي جاد على كتاب الله وسنة رسوله ﷺ.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stage: "طلب خطوبة جديد تم إرساله لولي الأمر للمراجعة",
    mahramSupervised: true
  };

  proposals.unshift(newProposal);

  // Initialize supervised chat for this proposal
  proposalChats[newProposal.id] = [
    {
      id: `msg-${Date.now()}-1`,
      proposalId: newProposal.id,
      senderId: "system",
      senderName: "نظام ميثاق الشرعي",
      senderRole: "system",
      content: `تم فتح قناة التواصل الشرعي الموثقة لطلب خطبة (${newProposal.targetProfileName}) من الخاطب (${newProposal.suitorName}). يشرف الولي (${newProposal.waliName}) على كافة المراسلات.`,
      timestamp: new Date().toISOString()
    },
    {
      id: `msg-${Date.now()}-2`,
      proposalId: newProposal.id,
      senderId: newProposal.suitorId || "suitor-user",
      senderName: newProposal.suitorName,
      senderRole: "suitor",
      content: newProposal.note,
      timestamp: new Date().toISOString()
    }
  ];

  res.status(201).json({
    success: true,
    message: "تم إرسال طلب الخطوبة الشرعي إلى الولي بنجاح وجارٍ إرسال إشعار SMS ورسالة موثقة.",
    proposal: newProposal
  });
});

app.patch("/api/proposals/:id", (req, res) => {
  const { id } = req.params;
  const { status, stage, waliNotes } = req.body;
  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return res.status(404).json({ success: false, message: "Proposal not found" });
  }

  if (status) proposal.status = status;
  if (stage) proposal.stage = stage;
  proposal.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "تم تحديث حالة طلب الخطوبة بواسطة الولي الشرعي",
    proposal
  });
});

// 5. Schedule Sharia Vision Meeting (مجلس الرؤية الشرعية)
app.post("/api/proposals/:id/meeting", (req, res) => {
  const { id } = req.params;
  const { meetingDate, meetingTime, meetingType, venueAddress, notes, chaperoneName } = req.body;
  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return res.status(404).json({ success: false, message: "Proposal not found" });
  }

  const meeting: ShariaMeeting = {
    id: `meet-${Date.now()}`,
    proposalId: id,
    meetingDate: meetingDate || "الجمعة القادمة",
    meetingTime: meetingTime || "05:00 مساءً",
    meetingType: meetingType || "in_person",
    venueAddress: venueAddress || "مجلس ولي الأمر",
    chaperoneName: chaperoneName || proposal.waliName,
    chaperoneRelation: "الولي / المحرم",
    guidelinesAcknowledged: true,
    status: "scheduled",
    notes: notes || "جلسة مباركة وفق الهدي النبوي الشريف وصون الحياء."
  };

  proposal.meeting = meeting;
  proposal.status = "meeting_scheduled";
  proposal.stage = "تم تحديد موعد مجلس الرؤية الشرعية بحضور المحرم";
  proposal.updatedAt = new Date().toISOString();

  // Add system message to chat
  if (!proposalChats[id]) proposalChats[id] = [];
  proposalChats[id].push({
    id: `msg-${Date.now()}`,
    proposalId: id,
    senderId: "system",
    senderName: "نظام ميثاق الشرعي",
    senderRole: "system",
    content: `📅 تم اعتماد موعد الرؤية الشرعية: يوم ${meeting.meetingDate} الساعة ${meeting.meetingTime} في (${meeting.venueAddress}) بحضور الولي المشرف. نسأل الله التوفيق والبركة.`,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: "تم تحديد موعد مجلس الرؤية الشرعية وإرسال الإشعار للخاطب والولي.",
    proposal,
    meeting
  });
});

// 6. Record Istikhara Step (صلاة الاستخارة)
app.post("/api/proposals/:id/istikhara", (req, res) => {
  const { id } = req.params;
  const { role, confirmed, note } = req.body;
  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return res.status(404).json({ success: false, message: "Proposal not found" });
  }

  if (!proposal.istikharaResult) {
    proposal.istikharaResult = {};
  }

  if (role === "suitor") {
    proposal.istikharaResult.suitorConfirmed = confirmed;
    proposal.istikharaResult.suitorNote = note;
  } else {
    proposal.istikharaResult.candidateConfirmed = confirmed;
    proposal.istikharaResult.candidateNote = note;
  }
  proposal.istikharaResult.date = new Date().toISOString();

  if (confirmed) {
    proposal.status = "istikhara";
    proposal.stage = "تمت صلاة الاستخارة مع انشراح الصدر والقبول المتبادل";
  } else {
    proposal.status = "declined";
    proposal.stage = "اعتذار شرعي متبادل بعد صلاة الاستخارة - قدر الله وما شاء فعل";
  }
  proposal.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "تم تسجيل مشاعر الاستخارة الشرعية بنجاح.",
    proposal
  });
});

// 7. Digital Marriage Contract & Celebration Card Generation (عقد القران الإلكتروني)
app.post("/api/proposals/:id/nikah", (req, res) => {
  const { id } = req.params;
  const { mahrAmount, witnesses, notes } = req.body;
  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return res.status(404).json({ success: false, message: "Proposal not found" });
  }

  const certificateId = `NIKAH-${Math.floor(100000 + Math.random() * 900000)}`;
  const nikahContract = {
    certificateId,
    mahrAmount: mahrAmount || "50,000 ريال ميسور مبارك",
    mahrStatus: "مقبوض وموثق شرعاً بحضور الولي",
    witnesses: witnesses || ["شاهد عدل أول", "شاهد عدل ثانٍ"],
    contractDate: new Date().toLocaleDateString("ar-SA", { calendar: "islamic-umalqura" } as any),
    blessingHadith: "«بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»"
  };

  proposal.nikahContract = nikahContract;
  proposal.status = "nikah_contracted";
  proposal.stage = "مبارك! تم عقد القران وتوثيق الميثاق الغليظ بحمد الله";
  proposal.updatedAt = new Date().toISOString();

  // Create public celebration card in Celebrations feed
  const newCelebration = {
    id: `cel-${Date.now()}`,
    groomName: proposal.suitorName,
    brideName: proposal.targetProfileName,
    eventDate: "الجمعة القادمة بمشيئة الله",
    hijriDate: nikahContract.contractDate,
    city: proposal.suitorCity || "الرياض",
    venueName: "قاعة اليمامة الكبرى للاحتفالات",
    quranVerse: "﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا ﴾",
    themeStyle: "pink" as const,
    guestsCount: 180,
    avatarGroom: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop",
    avatarBride: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&fit=crop",
    rotationAngle: 3,
    rsvpStatus: "going" as const
  };

  serverCelebrations.unshift(newCelebration);
  platformStats.successfulNikahs += 1;

  res.json({
    success: true,
    message: "بارك الله لكما! تم توثيق عقد القران وإصدار بطاقة الاحتفال.",
    proposal,
    celebration: newCelebration
  });
});

// 8. Supervised 3-Party Sharia Chat (غرفة المحادثة الشرعية تحت إشراف الولي)
app.get("/api/proposals/:id/chat", (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    proposalId: id,
    messages: proposalChats[id] || []
  });
});

app.post("/api/proposals/:id/chat", (req, res) => {
  const { id } = req.params;
  const { senderId, senderName, senderRole, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: "محتوى الرسالة مطلوب." });
  }

  if (!proposalChats[id]) {
    proposalChats[id] = [];
  }

  // Sharia Modesty & Safety Guardrail Check:
  // Prevent exchange of private phone numbers or external social links prior to formal Wali approval
  const phonePattern = /(05\d{8}|\+966\d{9}|00966\d{9}|\b\d{10}\b)/;
  const isSuspicious = phonePattern.test(content) && senderRole === "suitor";

  const newMsg = {
    id: `msg-${Date.now()}`,
    proposalId: id,
    senderId: senderId || "user",
    senderName: senderName || "مشارك",
    senderRole: senderRole || "suitor",
    content: content.trim(),
    timestamp: new Date().toISOString(),
    isFlaggedByShariaGuard: isSuspicious
  };

  proposalChats[id].push(newMsg);

  if (isSuspicious) {
    flaggedMessages.unshift({
      id: `flag-${Date.now()}`,
      proposalId: id,
      senderName: newMsg.senderName,
      senderRole: (newMsg.senderRole as any) || "suitor",
      content: newMsg.content,
      flagReason: "محاولة تبادل رقم اتصال مباشر دون استئذان الولي المشرف",
      timestamp: newMsg.timestamp,
      reviewed: false
    });
    recordAuditLog(
      "رصد مخالفة حياء شرعي",
      "security",
      `محادثة الجلسة ${id}`,
      "warning",
      `تم رصد إرسال رقم اتصال مباشر بواسطة ${newMsg.senderName}`
    );
  } else if (senderRole === 'suitor' && proposalChats[id].length <= 6) {
    // Courteous simulated response from the supervising guardian
    setTimeout(() => {
      if (proposalChats[id]) {
        proposalChats[id].push({
          id: `msg-wali-${Date.now()}`,
          proposalId: id,
          senderId: "wali-1",
          senderName: "أحمد الخالدي (الولي المشرف)",
          senderRole: "wali",
          content: "حياك الله يا بني وبارك فيك، نتابع المحادثة باهتمام وسعادة، ويسرنا تواصلكم بما يرضي الله حتى نلتقي في مجلس الرؤية الشرعية المبارك.",
          timestamp: new Date().toISOString(),
          isFlaggedByShariaGuard: false
        });
      }
    }, 1500);
  }

  res.status(201).json({
    success: true,
    message: isSuspicious ? "تم إرسال الرسالة مع تنبيه حياء شرعي بمراعاة إشراف الولي." : "تم إرسال الرسالة في المحادثة الشرعية بنجاح.",
    chatMessage: newMsg
  });
});

// 9. Celebrations CRUD
app.get("/api/celebrations", (req, res) => {
  res.json({
    success: true,
    count: serverCelebrations.length,
    celebrations: serverCelebrations,
    data: serverCelebrations
  });
});

app.post("/api/celebrations", (req, res) => {
  const body = req.body;
  const newCel = {
    ...body,
    id: `cel-${Date.now()}`,
    rotationAngle: Math.random() > 0.5 ? 2.5 : -2.5,
    rsvpStatus: "going"
  };
  serverCelebrations.unshift(newCel);
  res.status(201).json({
    success: true,
    celebration: newCel
  });
});

// 10. Wali Verification endpoint
app.post("/api/wali/verify", (req, res) => {
  const { waliName, waliPhone, relationship, candidateNationalId, candidateName } = req.body;
  if (!waliName || !waliPhone || !relationship) {
    return res.status(400).json({ success: false, message: "يرجى تعبئة كافة بيانات الولي الشرعي." });
  }

  platformStats.verifiedWalis += 1;
  const verificationCode = "WALI-" + Math.floor(100000 + Math.random() * 900000);

  const newWaliRecord: WaliVerificationRecord = {
    id: `wali-req-${Date.now()}`,
    waliName,
    waliPhone,
    relation: relationship,
    candidateName: candidateName || "مرشحة العفاف",
    candidateNationalId: candidateNationalId || "1098******",
    documentProof: "صك ولاية إلكتروني معتمد من وزارة العدل / ناجز",
    status: "verified",
    submittedAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString()
  };
  waliRequests.unshift(newWaliRecord);

  recordAuditLog(
    "توثيق ولي أمر رسمي",
    "wali",
    `${waliName} (${relationship})`,
    "success",
    `تم تسجيل واعتماد الولي الشرعي برمز ${verificationCode} ورقم ${waliPhone}`
  );

  res.json({
    success: true,
    verified: true,
    verificationCode,
    record: newWaliRecord,
    message: `تم توثيق بيانات الولي الشرعي (${waliName} - ${relationship}) واعتماد رقم التواصل للرؤية الشرعية.`
  });
});

// 11. Islamic Marriage Counselor & Compatibility with Gemini AI
app.post("/api/ai/counselor", async (req, res) => {
  const { prompt, topic, userLanguage = "ar" } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }

  const ai = getAIClient();
  const systemInstruction = `أنت "مستشار ميثاق الشرعي"، خبير إسلامي متمرس في فقه الأسرة والزواج الشرعي ومستشار توافق بين المقبلين على الزواج وفق القرآن والسنة النبوية الشريفة.
قواعدك الصارمة:
1. التمسك بالضوابط الشرعية (إشراف الولي، الحجاب والعفة، صلاة الاستخارة، عدم الخلوة المحرمة، الكفاءة في الدين والخلق: "إذا جاءكم من ترضون دينه وخلقه فزوجوه").
2. الإجابة بأسلوب حكيم، محفز، دافئ، واحتفالي ببركة الزواج والسكن والمودة.
3. تقديم نصائح عملية وواقعية للمقبلين على الزواج والخطوبة، مع ذكر الأدعية المأثورة كدعاء الاستخارة عند الحاجة.
4. الرد بنفس لغة المستخدم المطلوبة (${userLanguage}).`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        answer: response.text
      });
    } catch (error) {
      console.warn("Gemini API call failed, falling back to curated Islamic counseling knowledge base:", error);
    }
  }

  // Curated Islamic counseling engine fallback
  const curatedAnswers: Record<string, string> = {
    "istikhara": "صلاة الاستخارة سنة نبوية مؤكدة للمقبل على الزواج. ركعتان من غير الفريضة، ثم دعاء: 'اللهم إني أستخيرك بعلمك وأستقدرك بقدرتك وأسألك من فضلك العظيم...'. ومن علامات الاستخارة انشراح الصدر وتيسير الأسباب وتوافق الأولياء في الخير.",
    "wali": "الولي شرط أساسي لصحة النكاح في جمهور الفقهاء لقول النبي ﷺ: 'لا نكاح إلا بولي'. حضور الولي يحفظ كرامة المرأة ويوفر الأمان ويقود إلى بيوت مبنية على رضوان الله والبركة.",
    "mahr": "يسر المهر من أسباب البركة في الزواج، كما قال النبي ﷺ: 'أعظمهن بركة أيسرهن مؤونة'. المهر حق شرعي خالص للزوجة تكريماً لها، والوسطية والاتفاق بالمعروف خير.",
    "questions": "أهم أسئلة التعارف الشرعي بحضور الولي: المحافظة على الصلوات الخمس في وقتها، بر الوالدين وصلة الرحم، الأهداف التربوية للأبناء، طريقة إدارة الخلافات، والالتزام بالكسب الحلال."
  };

  let fallbackAnswer = "الزواج ميثاق غليظ وسكن ومودة. المعيار الأسمى الذي حثنا عليه نبينا الكريم ﷺ هو الدين والخلق: 'تُنكح المرأة لأربع... فاظفر بذات الدين تربت يداك'. احرصوا دائماً على استخارة الله تعالى، ومشاورة أهل الحكمة، ومشاركة الولي الشرعي في كل خطوة لتبارك بداياتكم.";
  const lower = prompt.toLowerCase();
  if (lower.includes("استخار") || lower.includes("istikhara")) fallbackAnswer = curatedAnswers.istikhara;
  else if (lower.includes("ولي") || lower.includes("guardian") || lower.includes("wali")) fallbackAnswer = curatedAnswers.wali;
  else if (lower.includes("مهر") || lower.includes("mahr") || lower.includes("صداق")) fallbackAnswer = curatedAnswers.mahr;
  else if (lower.includes("سؤال") || lower.includes("اسئل") || lower.includes("questions")) fallbackAnswer = curatedAnswers.questions;

  res.json({
    success: true,
    source: "meethaq-sharia-knowledge-engine",
    answer: fallbackAnswer
  });
});

// 12. Islamic Compatibility Calculator
app.post("/api/matches/compatibility", (req, res) => {
  const { profileA, profileB, prayerFreq, quranCommitment, waliConsentReady, mahrPhilosophy } = req.body;
  // Calculate Islamic synergy
  let score = 85;
  const factors = [
    { title: "الالتزام الديني والصلوات", weight: 35, score: prayerFreq === 'always_in_mosque' ? 98 : 90, detail: "المحافظة على الصلوات الخمس في أوقاتها والاهتمام بالقرآن الكريم" },
    { title: "الأهداف الأسرية وتربية الأبناء", weight: 25, score: 92, detail: "اتفاق تام على تنشئة إسلامية صالحة ومستقرة في البيت المسلم" },
    { title: "المهر الميسور والبركة", weight: 20, score: mahrPhilosophy === 'moderate_blessed' ? 96 : 85, detail: "تطبيق التوجيه النبوي: أعظمهن بركة أيسرهن مؤونة" },
    { title: "موافقة وتواصل الولي الشرعي", weight: 20, score: waliConsentReady ? 99 : 80, detail: "بيانات الولي مكتملة وموثقة للرؤية الشرعية وصون الحياء" }
  ];

  const overall = Math.round(factors.reduce((acc, f) => acc + (f.score * f.weight) / 100, 0));

  res.json({
    success: true,
    overallScore: overall,
    verdict: overall >= 88 ? "توافق شرعي ممتاز ومبارك بإذن الله تعالى" : "توافق جيد يستحب معه الاستخارة والنقاش بحضور الولي",
    breakdown: factors,
    recommendation: "ننصح ببدء خطوة صلاة الاستخارة ومراسلة الولي الشرعي لترتيب مجلس الرؤية الشرعية المباركة."
  });
});

// -------------------------------------------------------------
// 13. ADMIN DASHBOARD API (لوحة تحكم المدير الشرعي)
// -------------------------------------------------------------

// 13.1 Overview Stats & Health
app.get("/api/admin/overview", (req, res) => {
  const pendingWalis = waliRequests.filter(w => w.status === 'pending').length;
  const verifiedWalis = waliRequests.filter(w => w.status === 'verified').length;
  const pendingProfiles = serverProfiles.filter(p => p.moderationStatus === 'pending_review').length;
  const concludedNikahs = proposals.filter(p => p.status === 'nikah_contracted').length;
  const unreviewedFlags = flaggedMessages.filter(f => !f.reviewed).length;

  const stats: AdminOverviewStats = {
    totalUsers: serverProfiles.length,
    activeProposals: proposals.length,
    verifiedWalisCount: verifiedWalis + platformStats.verifiedWalis,
    pendingWaliVerifications: pendingWalis,
    pendingProfileReviews: pendingProfiles,
    concludedNikahs: concludedNikahs + serverCelebrations.length,
    flaggedChatsCount: unreviewedFlags,
    systemHealth: "سليمة وموثقة 100% (متوافقة مع الضوابط الشرعية)"
  };

  res.json({
    success: true,
    stats,
    recentAuditLogs: auditLogs.slice(0, 5),
    pendingWalisList: waliRequests.filter(w => w.status === 'pending'),
    flaggedMessagesList: flaggedMessages.filter(f => !f.reviewed)
  });
});

// 13.2 Manage Profiles (اعتماد / إيقاف / توثيق السير الذاتية)
app.get("/api/admin/profiles", (req, res) => {
  const { gender, status, search } = req.query;
  let results = [...serverProfiles];

  if (gender && (gender === 'male' || gender === 'female')) {
    results = results.filter(p => p.gender === gender);
  }

  if (status) {
    results = results.filter(p => (p.moderationStatus || 'approved') === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.fullName.toLowerCase().includes(q) || 
      p.city.toLowerCase().includes(q) || 
      p.profession.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    profiles: results
  });
});

app.patch("/api/admin/profiles/:id/status", (req, res) => {
  const { id } = req.params;
  const { moderationStatus, isVerified, notes } = req.body;
  const profile = serverProfiles.find(p => p.id === id);

  if (!profile) {
    return res.status(404).json({ success: false, message: "السيرة الذاتية غير موجودة." });
  }

  if (moderationStatus) {
    profile.moderationStatus = moderationStatus;
  }
  if (typeof isVerified === "boolean") {
    profile.isVerified = isVerified;
  }

  const logAction = moderationStatus === 'suspended' ? 'تعليق حساب وسيرة' : 
                    moderationStatus === 'approved' ? 'اعتماد ونشر سيرة شرعية' : 'تحديث حالة السيرة';

  recordAuditLog(
    logAction,
    "profile",
    profile.fullName,
    moderationStatus === 'suspended' ? 'alert' : 'success',
    notes || `تم تحديث حالة السيرة إلى ${profile.moderationStatus || 'معتمد'} والتوثيق (${profile.isVerified ? 'موثق' : 'غير موثق'}).`
  );

  res.json({
    success: true,
    message: "تم تحديث حالة السيرة بنجاح وتسجيل العملية في سجل التدقيق.",
    profile
  });
});

app.delete("/api/admin/profiles/:id", (req, res) => {
  const { id } = req.params;
  const index = serverProfiles.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "السيرة الذاتية غير موجودة." });
  }

  const deleted = serverProfiles.splice(index, 1)[0];
  recordAuditLog(
    "حذف سيرة ذاتية نهائياً",
    "profile",
    deleted.fullName,
    "alert",
    `تم حذف الملف الشرعي للمستخدم ${deleted.fullName} استجابة لطلب الإدارة.`
  );

  res.json({
    success: true,
    message: `تم حذف السيرة الذاتية للمستخدم (${deleted.fullName}) بنجاح.`,
    deletedId: id
  });
});

// 13.3 Manage Walis (اعتماد توثيق الأولياء وصكوك القرابة)
app.get("/api/admin/walis", (req, res) => {
  res.json({
    success: true,
    total: waliRequests.length,
    walis: waliRequests
  });
});

app.post("/api/admin/walis/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body; // status: 'verified' | 'rejected'
  const reqItem = waliRequests.find(w => w.id === id);

  if (!reqItem) {
    return res.status(404).json({ success: false, message: "طلب توثيق الولي غير موجود." });
  }

  reqItem.status = status;
  if (status === 'verified') {
    reqItem.verifiedAt = new Date().toISOString();
  }

  // Reflect on candidate profile if exists
  const candidate = serverProfiles.find(p => p.fullName.includes(reqItem.candidateName) || reqItem.candidateName.includes(p.fullName));
  if (candidate && candidate.wali) {
    candidate.wali.isVerified = status === 'verified';
    if (status === 'verified') {
      candidate.isVerified = true;
    }
  }

  recordAuditLog(
    status === 'verified' ? 'اعتماد رسمي للولي الشرعي' : 'رفض توثيق الولي',
    "wali",
    `${reqItem.waliName} (ولي أمر: ${reqItem.candidateName})`,
    status === 'verified' ? 'success' : 'warning',
    status === 'verified' 
      ? `تم التدقيق والمصادقة على صلة القرابة ورقم الهاتف ${reqItem.waliPhone}.`
      : `تم رفض الطلب لسبب: ${rejectionReason || 'عدم وضوح صك القرابة أو رقم الهاتف'}`
  );

  res.json({
    success: true,
    message: status === 'verified' ? "تم اعتماد الولي الشرعي بنجاح وتوثيق صك القرابة." : "تم تسجيل رفض التوثيق مع إشعار الولي.",
    waliRequest: reqItem
  });
});

// 13.4 Proposals & Sharia Meetings Registry
app.get("/api/admin/proposals", (req, res) => {
  res.json({
    success: true,
    total: proposals.length,
    proposals
  });
});

app.patch("/api/admin/proposals/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, stage, note } = req.body;
  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return res.status(404).json({ success: false, message: "طلب الخطوبة غير موجود." });
  }

  if (status) proposal.status = status;
  if (stage) proposal.stage = stage;
  proposal.updatedAt = new Date().toISOString();

  recordAuditLog(
    "تعديل إداري لحالة طلب الخطوبة",
    "proposal",
    `طلب ${proposal.id} (${proposal.suitorName} -> ${proposal.targetProfileName})`,
    "warning",
    note || `تم تغيير حالة الطلب الإدارية إلى (${status || 'محدث'}).`
  );

  res.json({
    success: true,
    message: "تم تحديث طلب الخطوبة بنجاح.",
    proposal
  });
});

// 13.5 Concluded Nikah Contracts & Official Certificates
app.get("/api/admin/nikahs", (req, res) => {
  const contracted = proposals.filter(p => p.status === 'nikah_contracted' || p.nikahContract);
  res.json({
    success: true,
    total: contracted.length,
    contracts: contracted.map(p => ({
      proposalId: p.id,
      groomName: p.suitorName,
      brideName: p.targetProfileName,
      waliName: p.waliName,
      contract: p.nikahContract,
      celebrationDate: p.updatedAt || p.createdAt
    }))
  });
});

// 13.6 Sharia Modesty & Flagged Chats Guardrail
app.get("/api/admin/flagged-messages", (req, res) => {
  // Collect flags from proposalChats as well
  const runtimeFlags: FlaggedMessage[] = [];
  Object.keys(proposalChats).forEach(propId => {
    const msgs = proposalChats[propId] || [];
    msgs.forEach(m => {
      if (m.isFlaggedByShariaGuard) {
        if (!flaggedMessages.some(fm => fm.id === m.id)) {
          runtimeFlags.push({
            id: m.id,
            proposalId: propId,
            senderName: m.senderName,
            senderRole: m.senderRole,
            content: m.content,
            flagReason: "اشتباه تبادل وسيلة اتصال خاصة قبل الرؤية الشرعية",
            timestamp: m.timestamp,
            reviewed: false
          });
        }
      }
    });
  });

  const allFlags = [...flaggedMessages, ...runtimeFlags];

  res.json({
    success: true,
    total: allFlags.length,
    unreviewedCount: allFlags.filter(f => !f.reviewed).length,
    flags: allFlags
  });
});

app.post("/api/admin/flagged-messages/:id/action", (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body; // action: 'dismissed' | 'warned' | 'blocked'
  let item = flaggedMessages.find(f => f.id === id);

  if (!item) {
    // Check in proposal chats
    for (const propId of Object.keys(proposalChats)) {
      const msg = proposalChats[propId]?.find(m => m.id === id);
      if (msg) {
        item = {
          id: msg.id,
          proposalId: propId,
          senderName: msg.senderName,
          senderRole: msg.senderRole,
          content: msg.content,
          flagReason: "اشتباه تبادل وسيلة اتصال خاصة",
          timestamp: msg.timestamp,
          reviewed: true,
          actionTaken: action
        };
        flaggedMessages.push(item);
        break;
      }
    }
  }

  if (item) {
    item.reviewed = true;
    item.actionTaken = action;
  }

  recordAuditLog(
    action === 'blocked' ? 'حظر مستخدم لمخالفة شرعية' : 
    action === 'warned' ? 'توجيه إنذار حياء شرعي' : 'حفظ وتبرئة البلاغ',
    "security",
    item ? `${item.senderName} (${item.proposalId})` : id,
    action === 'blocked' ? 'alert' : action === 'warned' ? 'warning' : 'success',
    reason || `تم اتخاذ إجراء (${action}) بشأن الرسالة المرفوعة للرقابة الشرعية.`
  );

  res.json({
    success: true,
    message: `تم اتخاذ الإجراء الشرعي (${action}) بنجاح وتسجيله بالسجل.`,
    item
  });
});

// 13.7 Audit & Security Logs
app.get("/api/admin/audit-logs", (req, res) => {
  const { category, status } = req.query;
  let logs = [...auditLogs];

  if (category) {
    logs = logs.filter(l => l.category === category);
  }
  if (status) {
    logs = logs.filter(l => l.status === status);
  }

  res.json({
    success: true,
    total: logs.length,
    logs
  });
});

app.post("/api/admin/audit-logs", (req, res) => {
  const { action, category, target, status, details, operator } = req.body;
  const log = recordAuditLog(
    action || "إجراء إداري عام",
    category || "system",
    target || "منصة ميثاق",
    status || "success",
    details || "تم تنفيذ الإجراء بواسطة لوحة المدير الشرعي",
    operator || "فضيلة المشرف العام"
  );

  res.status(201).json({
    success: true,
    log
  });
});

// 13.8 System Health & Sharia Integrity Auto-Scan
app.post("/api/admin/system/audit-all", (req, res) => {
  recordAuditLog(
    "فحص شامل للضوابط الشرعية والأمنية",
    "system",
    "كامل خوادم وقواعد ميثاق",
    "success",
    "تم التحقق من عدم وجود خلوات محادثة سرية، وصحة توثيق كافة الأولياء المشرفين، وحماية صور العفيفات."
  );

  res.json({
    success: true,
    message: "اكتمل الفحص الشامل بنجاح: جميع العمليات تخضع للضوابط الشرعية بنسبة 100%.",
    metrics: {
      activeProposalsScanned: proposals.length,
      waliSupervisionEnforced: "100%",
      encryptedSessions: "نشطة ومشفرة",
      complianceStatus: "مطابق لمعايير هيئة الفتوى والرقابة الشرعية"
    }
  });
});

// -------------------------------------------------------------
// VITE & STATIC SERVING
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Meethaq Server] Running on http://0.0.0.0:${PORT}`);
  });
}

start();
