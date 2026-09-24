export type Language = 'ar' | 'en' | 'zh' | 'id' | 'fr' | 'tr';

export type NavigationTab = 
  | 'home'
  | 'explore' 
  | 'activity' 
  | 'profile'
  | 'profile-details'
  | 'login' 
  | 'register' 
  | 'wali' 
  | 'proposals' 
  | 'ai' 
  | 'celebrations' 
  | 'settings' 
  | 'api'
  | 'admin'
  | 'preferences'
  | 'search'
  | 'favorites'
  | 'requests'
  | 'messages';

export type Gender = 'male' | 'female';

export type PrayerHabit = 'always_in_mosque' | 'always_on_time' | 'mostly_on_time';

export type MaritalStatus = 'single' | 'divorced' | 'widowed';

export type MarriageTimeline = 'immediate' | 'within_3_months' | 'within_6_months' | 'within_1_year';

export interface WaliInfo {
  name: string;
  relation: string; // Father, Brother, Uncle, etc.
  phone: string;
  email: string;
  isVerified: boolean;
  notes?: string;
}

export interface VerificationDetails {
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  profileVerified: boolean;
  isVerified: boolean;
}

export interface ProfilePrivacySettings {
  profileVisibility: 'public' | 'verified_only' | 'hidden';
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowMessages: 'accepted_requests_only' | 'nobody';
  allowMarriageRequests: 'all_matching' | 'verified_only';
  searchVisibility: boolean;
  blurPhotosByDefault: boolean;
}

export interface UserLanguageRecord {
  languageId: string;
  languageName: string;
  level?: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  proficiency?: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
}

export interface Profile {
  id: string;
  fullName: string;
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  
  // Normalized Location & Nationality
  nationalityId?: string;
  nationality: string;
  countryId?: string;
  country: string;
  regionId?: string;
  regionName?: string;
  cityId?: string;
  city: string;
  latitude?: number;
  longitude?: number;

  // Normalized Education
  educationLevelId?: string;
  education: string;
  fieldOfStudyId?: string;
  fieldOfStudyName?: string;

  // Normalized Career
  jobCategoryId?: string;
  jobCategoryName?: string;
  occupationId?: string;
  profession: string;

  // Normalized Languages
  userLanguages?: UserLanguageRecord[];

  // Children & Family
  hasChildren?: boolean;
  childrenCount?: number;
  childrenLivingWithMe?: boolean;
  wantsChildren?: 'yes' | 'no' | 'open';
  heightCm?: number;

  // Visuals & Modesty
  avatarUrl: string;
  isPhotoBlurredByDefault: boolean;
  
  // Verification Multi-Tier
  isVerified: boolean;
  verification?: VerificationDetails;

  // Presence & Activity
  lastActive?: string;
  lastActiveTimestamp?: number;
  showLastSeen?: boolean;
  showOnlineStatus?: boolean;

  // Privacy
  privacySettings?: ProfilePrivacySettings;

  wali: WaliInfo;
  
  // Religious traits
  prayerHabit: PrayerHabit;
  quranMemorization: string;
  religiousAttire: string;
  islamicInterests: string[];
  smoking: 'never';
  polygynyPreference: 'no' | 'open' | 'not_applicable';
  marriageTimeline: MarriageTimeline;

  // Bio & expectations
  aboutMe: string;
  partnerExpectations: string;
  familyValues: string;
  mahrExpectation: string;
  relocationFlexibility: string;
  compatibilityScore?: number;
  tags?: string[];
  moderationStatus?: 'approved' | 'pending_review' | 'suspended';
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Computed display properties
  approxDistanceKm?: number;
  distanceText?: string;
  matchScore?: number;
  matchReasons?: string[];
}

export interface MarriagePreferences {
  userId: string;
  preferredGender: Gender;
  minAge: number;
  maxAge: number;
  preferredCountryIds: string[];
  preferredCityIds: string[];
  maxDistanceOption: 'same_city' | '10' | '25' | '50' | '100' | '250' | 'same_country' | 'anywhere';
  preferredNationalityIds: string[];
  preferredMaritalStatuses: MaritalStatus[];
  preferredEducationLevelIds: string[];
  preferredFieldOfStudyIds: string[];
  preferredJobCategoryIds: string[];
  preferredOccupationIds: string[];
  preferredLanguageIds: string[];
  wantsChildren?: 'yes' | 'no' | 'open';
  acceptHasChildren?: 'yes' | 'no' | 'does_not_matter';
  relocationPreference?: 'can_relocate' | 'cannot_relocate' | 'open_to_discussion';
}

export interface FavoriteRecord {
  id: string;
  userId: string;
  targetProfileId: string;
  createdAt: string;
}

export interface MarriageRequestRecord {
  id: string;
  senderId: string;
  senderName: string;
  senderGender: Gender;
  senderAge?: number;
  senderCity?: string;
  targetProfileId: string;
  targetProfileName: string;
  targetGender: Gender;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  note: string;
  waliName?: string;
  waliPhone?: string;
  waliApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoPermissionRequest {
  id: string;
  suitorId: string;
  suitorName: string;
  suitorAge?: number;
  suitorCity?: string;
  suitorAvatar?: string;
  suitorJob?: string;
  targetProfileId: string;
  targetProfileName: string;
  targetGender?: Gender;
  message?: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  reviewedBy?: 'candidate' | 'wali' | 'admin';
  reviewedAt?: string;
}

export interface ReportRecord {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedProfileId: string;
  reportedProfileName: string;
  reason: string;
  details?: string;
  status: 'pending_review' | 'investigating' | 'resolved_dismissed' | 'resolved_warned' | 'resolved_suspended';
  createdAt: string;
}

export interface BlockRecord {
  id: string;
  blockerId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ConversationRecord {
  id: string;
  requestId?: string;
  proposalId?: string;
  participants: string[];
  participantDetails: Record<string, ConversationParticipant>;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>;
  isWaliSupervised: boolean;
  waliName?: string;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  readBy: string[];
  flaggedForReview?: boolean;
}

export interface ShariaMeeting {
  id: string;
  proposalId: string;
  meetingDate: string;
  meetingTime: string;
  meetingType: 'in_person' | 'supervised_video';
  venueAddress?: string;
  videoLink?: string;
  chaperoneName: string;
  chaperoneRelation: string;
  guidelinesAcknowledged: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ShariaChatMessage {
  id: string;
  proposalId: string;
  senderId: string;
  senderName: string;
  senderRole: 'suitor' | 'candidate' | 'wali' | 'system';
  content: string;
  timestamp: string;
  isFlaggedByShariaGuard?: boolean;
}

export type ActiveRole = 'suitor' | 'wali' | 'candidate' | 'guest' | 'admin';

export interface UserSession {
  id: string;
  name: string;
  role: ActiveRole;
  avatar: string;
  relatedProfileId?: string;
  phone?: string;
}

export interface Proposal {
  id: string;
  suitorId?: string;
  suitorName: string;
  suitorAge: number;
  suitorCity: string;
  targetProfileId: string;
  targetProfileName: string;
  status: 'pending_wali' | 'pending_wali_review' | 'approved_by_wali' | 'meeting_scheduled' | 'istikhara' | 'nikah_contracted' | 'declined';
  waliName: string;
  waliPhone?: string;
  waliStatus?: 'verified' | 'pending_verification';
  note: string;
  createdAt: string;
  updatedAt?: string;
  stage: string;
  mahramSupervised?: boolean;
  meeting?: ShariaMeeting;
  istikharaResult?: {
    suitorConfirmed?: boolean;
    candidateConfirmed?: boolean;
    suitorNote?: string;
    candidateNote?: string;
    date?: string;
  };
  nikahContract?: {
    certificateId: string;
    mahrAmount: string;
    mahrStatus: string;
    witnesses: string[];
    contractDate: string;
    blessingHadith: string;
  };
}

export interface CelebrationInvitation {
  id: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  hijriDate: string;
  city: string;
  venueName: string;
  quranVerse: string;
  themeStyle: 'pink' | 'periwinkle' | 'spearmint';
  rsvpStatus?: 'going' | 'maybe' | 'cant_go';
  guestsCount: number;
  avatarGroom: string;
  avatarBride: string;
  rotationAngle: number; // for Partiful physical stacked look
}

export interface UserSettings {
  language: Language;
  blurPhotosByDefault: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  waliSupervisionMandatory: boolean;
  chaperoneMeetingNotification: boolean;

  // 1. الخصوصية والستر الشرعي المتقدم (Advanced Islamic Privacy & Modesty)
  privacy?: {
    // ضوابط الصور والتمويه
    blurPhotosByDefault: boolean;
    photoDisplayMode?: 'blurred' | 'hidden_symbolic' | 'full_visible';
    requireWaliApprovalForPhotos: boolean;
    allowTemporaryVisionReveal?: boolean;
    watermarkPhotos?: boolean;
    preventScreenshotsNotice?: boolean;

    // ضوابط ظهور السيرة الذاتية ومن يمكنه الرؤية
    profileVisibility?: 'public' | 'verified_only' | 'high_match_only' | 'walis_only' | 'hidden';
    minMatchScoreToView?: number;
    hideFromUnverifiedUsers: boolean;
    blockSameTribeOrWorkplace?: boolean;
    blockedFamilyOrWorkKeywords?: string;

    // صلاحيات وضوابط التواصل المباشر مع الولي
    allowDirectWaliContact: boolean;
    waliContactRequirement?: 'immediate' | 'after_wali_approval' | 'platform_chat_only';
    waliContactChannels?: {
      allowPhoneCalls: boolean;
      allowWhatsApp: boolean;
      allowInAppVoiceMeeting: boolean;
    };
    waliPreferredContactTimes?: 'anytime' | 'after_asr_to_isha' | 'weekends_only' | 'custom';
    waliCustomContactHours?: string;

    // التواجد والمراسلة
    showOnlineStatus?: boolean;
    showLastSeen?: boolean;
    allowMessages?: 'accepted_requests_only' | 'nobody';
  };

  // 2. إدارة وإشراف الولي الشرعي (Wali Oversight & Chaperone)
  waliConfig?: {
    waliName?: string;
    waliRelation?: string;
    waliPhone?: string;
    waliEmail?: string;
    waliVerificationStatus?: 'verified' | 'pending' | 'unsubmitted';
    autoNotifyWaliOnNewKhitbah?: boolean;
    requireWaliPasscodeForChat?: boolean;
    waliDirectCallAllowed?: boolean;
    dailyWaliSummaryReport?: boolean;
    forwardAllMessagesToWali?: boolean;
  };

  // 3. التنبيهات والإشعارات المتقدمة (Notifications & Alerts)
  notifications?: {
    smsOnProposal: boolean;
    emailOnWaliAction: boolean;
    weeklyIstikharaReminder: boolean;
    marketingDigest: boolean;
    whatsappAlerts?: boolean;
    meetingReminders?: boolean;
    newMatchNotifications?: boolean;
    soundEnabled?: boolean;
    quietHoursEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  };

  // 4. الحساب والأمان والبيانات (Account, Security & Data)
  account?: {
    displayName?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    twoFactorAuth?: boolean;
    calendarType?: 'hijri' | 'gregorian';
    accountStatus?: 'active' | 'frozen_temporary' | 'pending_verification';
    frozenReason?: string;
    frozenAt?: string;
  };

  // 5. التوثيق والرتبة الشرعية (Verification & Trust Badges)
  verification?: {
    isIdentityVerified: boolean;
    isWaliVerified: boolean;
    shariaPledgeAccepted: boolean;
    tier: 'barakah_verified' | 'standard';
    nationalIdMasked?: string;
    verifiedAt?: string;
  };

  // 6. المظهر والسهولة والقراءة (Appearance & Accessibility)
  appearance?: {
    fontSize?: 'normal' | 'large' | 'extra_large';
    highContrast?: boolean;
    reducedMotion?: boolean;
    prayerTimesWidget?: boolean;
  };

  // 7. الأمان المتقدم والتحقق 2FA والجلسات (Advanced Security & 2FA)
  security?: SecuritySettings;
}

export interface ActiveSessionItem {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
  createdAt: string;
}

export interface LoginHistoryItem {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  status: 'success' | 'failed' | 'two_factor_verified';
  authMethod: 'password' | 'google' | 'sms_otp' | 'authenticator_app';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'authenticator_app' | 'sms' | 'both';
  authenticatorAppLinked: boolean;
  authenticatorAppSecret?: string;
  backupCodes: string[];
  backupCodesRemaining: number;
  activeSessions: ActiveSessionItem[];
  loginHistory: LoginHistoryItem[];
  notifyOnNewLogin: boolean;
  autoLogoutInactivityMinutes: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  category: 'profile' | 'wali' | 'proposal' | 'nikah' | 'security' | 'system';
  operator: string;
  target: string;
  status: 'success' | 'warning' | 'alert';
  details: string;
}

export interface FlaggedMessage {
  id: string;
  proposalId: string;
  senderName: string;
  senderRole: string;
  content: string;
  flagReason: string;
  timestamp: string;
  reviewed: boolean;
  actionTaken?: 'dismissed' | 'warned' | 'blocked';
}

export interface AdminOverviewStats {
  totalUsers: number;
  activeProposals: number;
  verifiedWalisCount: number;
  pendingWaliVerifications: number;
  pendingProfileReviews: number;
  concludedNikahs: number;
  flaggedChatsCount: number;
  systemHealth: string;
}

export type PlatformRole = 'user' | 'wali' | 'moderator' | 'admin';

export interface ManagedUserItem {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: PlatformRole;
  status: 'active' | 'pending_verification' | 'suspended' | 'banned';
  gender?: 'male' | 'female';
  city?: string;
  createdAt: string;
  lastActive: string;
  assignedBy?: string;
  roleReason?: string;
  verifiedWali?: boolean;
}

export interface WaliVerificationRecord {
  id: string;
  waliName: string;
  waliPhone: string;
  relation: string;
  candidateName: string;
  candidateNationalId?: string;
  documentProof?: string;
  status: 'verified' | 'pending' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
}

export type RegistrationStepId = 
  | 'account'
  | 'demographics'
  | 'religious'
  | 'matrimonial_wali'
  | 'personality'
  | 'activation'
  | 'photo_verification';

export interface RegistrationStepConfig {
  id: RegistrationStepId;
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  isEnabled: boolean;
  isRequired: boolean;
  descriptionAr: string;
}

export interface RegistrationPolicySettings {
  activationMode: 'instant_otp' | 'manual_admin_review';
  requireWaliForFemales: boolean;
  requirePhotoBlurForFemales: boolean;
  requireBaahForMales: boolean;
  requireShariaPledge: boolean;
  minAge: number;
  enableDemoFill: boolean;
  allowGuestBrowsing: boolean;
  steps: RegistrationStepConfig[];
}

export interface RegisteredAccountRecord {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  gender: Gender;
  role: ActiveRole;
  registeredAt: string;
  activationStatus: 'active' | 'pending_otp' | 'pending_admin_approval' | 'suspended';
  waliName?: string;
  waliPhone?: string;
  city: string;
  country: string;
  verificationCode?: string;
  shariaPledgeAccepted: boolean;
}

export type AchievementBadgeId = 
  | 'verified_profile'
  | 'deeply_committed'
  | 'respectful_communicator'
  | 'wali_connected'
  | 'moderate_mahr'
  | 'complete_bio'
  | 'good_standing'
  | 'quran_companion';

export interface AchievementBadge {
  id: AchievementBadgeId;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  descriptionAr: string;
  descriptionEn: string;
  category: 'verification' | 'religious' | 'conduct' | 'family' | 'marriage';
  icon: string;
  badgeLevel: 'bronze' | 'silver' | 'gold' | 'diamond';
  isUnlocked: boolean;
  progressPercentage: number;
  unlockedAt?: string;
  criteriaAr: string;
  criteriaEn: string;
  rewardTextAr: string;
  rewardTextEn: string;
  hadithAr?: string;
  highlightColor: string;
}

export interface PageLayoutSettings {
  footerCopyright: string;
  customHeaderScripts?: string;
  profileLayout: {
    showWaliCardOnTop: boolean;
    showReligiousTraitsFirst: boolean;
    allowInstantProposalButton: boolean;
    showPrayerHabitBadge: boolean;
  };
  dashboardWidgets: {
    id: string;
    title: string;
    enabled: boolean;
  }[];
  activeNavTabs: {
    home: boolean;
    explore: boolean;
    activity: boolean;
    wali: boolean;
    celebrations: boolean;
    shariaCounselor: boolean;
  };
  headerAnnouncement: {
    enabled: boolean;
    text: string;
    badgeText?: string;
  };
  updatedAt?: string;
}

export interface GlobalSiteSettings {
  // General
  siteName: string;
  siteTagline: string;
  adminEmail: string;
  isMaintenance: boolean;
  supportPhone?: string;
  shariaCommitteeLead?: string;

  // Users & Registration
  requireWali: boolean;
  blurFemalePhotos: boolean;
  minAge: number;
  allowGuestBrowsing: boolean;
  requireNationalIdVerification: boolean;

  // Moderation & Content
  maxPhotoMb: number;
  autoModestyAi: boolean;
  profanityFilterActive: boolean;

  // SMTP & Communications
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass?: string;
  senderEmail: string;

  // SEO & Meta
  metaTitle: string;
  metaDesc: string;
  metaKeywords?: string;

  // Appearance & Theme
  activeTheme: 'emerald' | 'aurora' | 'midnight' | 'miniature' | 'twenty_dark' | 'twenty_light';
  primaryColor: string;
  fontFamily: string;

  // Layout & Announcement
  headerAnnouncement: {
    enabled: boolean;
    text: string;
    badgeText?: string;
    link?: string;
  };
  footerCopyright: string;
  customHeaderScripts?: string;

  updatedAt?: string;
  updatedBy?: string;
}

export interface ManagedCountryCity {
  id: string;
  nameAr: string;
  nameEn: string;
  isEnabled: boolean;
}

export interface ManagedCountry {
  id: string; // e.g. 'SA', 'AE', 'EG', 'TR'
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  dialCode: string;
  currency: string;
  currencyNameAr: string;
  isEnabled: boolean;
  isDefault: boolean;
  order: number;
  minAge?: number;
  cities: ManagedCountryCity[];
}

export interface ManagedLanguage {
  id: string;
  code: Language;
  nameNative: string;
  nameAr: string;
  direction: 'rtl' | 'ltr';
  flag: string;
  isEnabled: boolean;
  isDefault: boolean;
  order: number;
  translatedPercent: number;
}

export interface LocalizationConfig {
  defaultLanguage: Language;
  defaultCountryId: string;
  availableLanguages: ManagedLanguage[];
  availableCountries: ManagedCountry[];
  customTranslations?: Record<string, Record<string, string>>;
  updatedAt?: string;
  updatedBy?: string;
}


