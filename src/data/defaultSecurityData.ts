import { SecuritySettings } from '../types';

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  twoFactorMethod: 'authenticator_app',
  authenticatorAppLinked: false,
  authenticatorAppSecret: 'MEETHAQ-7X8K-9Y2P-3W4Z-ISLAMIC-2026',
  backupCodes: [
    '8392-1049',
    '4920-8831',
    '9012-7364',
    '6621-3940',
    '1948-2849',
    '5830-1092',
    '7741-9204',
    '3029-4819'
  ],
  backupCodesRemaining: 8,
  notifyOnNewLogin: true,
  autoLogoutInactivityMinutes: 30,
  activeSessions: [
    {
      id: 'sess-current',
      deviceType: 'desktop',
      deviceName: 'جهازك الحالي (Apple MacBook Pro)',
      browser: 'Google Chrome 124.0',
      os: 'macOS Sonoma',
      ipAddress: '185.120.44.18',
      location: 'الرياض، المملكة العربية السعودية',
      isCurrent: true,
      lastActive: 'الآن (نشط حالياً)',
      createdAt: '2026-09-22T08:00:00Z'
    },
    {
      id: 'sess-mobile',
      deviceType: 'mobile',
      deviceName: 'iPhone 15 Pro Max',
      browser: 'Mobile Safari 17.4',
      os: 'iOS 17.5',
      ipAddress: '185.120.44.22',
      location: 'الرياض، المملكة العربية السعودية',
      isCurrent: false,
      lastActive: 'منذ ساعتين و 15 دقيقة',
      createdAt: '2026-09-21T19:30:00Z'
    },
    {
      id: 'sess-tablet',
      deviceType: 'tablet',
      deviceName: 'iPad Air (5th generation)',
      browser: 'Safari Tablet',
      os: 'iPadOS 17.4',
      ipAddress: '94.200.112.5',
      location: 'جدة، المملكة العربية السعودية',
      isCurrent: false,
      lastActive: 'أمس، 10:15 مساءً',
      createdAt: '2026-09-20T15:20:00Z'
    }
  ],
  loginHistory: [
    {
      id: 'log-1',
      timestamp: '2026-09-22 14:15',
      ipAddress: '185.120.44.18',
      location: 'الرياض، المملكة العربية السعودية',
      device: 'MacBook Pro 16"',
      browser: 'Chrome 124',
      status: 'two_factor_verified',
      authMethod: 'authenticator_app'
    },
    {
      id: 'log-2',
      timestamp: '2026-09-21 22:30',
      ipAddress: '185.120.44.22',
      location: 'الرياض، المملكة العربية السعودية',
      device: 'iPhone 15 Pro Max',
      browser: 'Mobile Safari',
      status: 'success',
      authMethod: 'password'
    },
    {
      id: 'log-3',
      timestamp: '2026-09-20 18:45',
      ipAddress: '94.200.112.5',
      location: 'جدة، المملكة العربية السعودية',
      device: 'iPad Air',
      browser: 'Safari',
      status: 'success',
      authMethod: 'google'
    },
    {
      id: 'log-4',
      timestamp: '2026-09-18 11:20',
      ipAddress: '197.35.88.14',
      location: 'الدمام، المملكة العربية السعودية',
      device: 'Windows Desktop',
      browser: 'Firefox 125',
      status: 'failed',
      authMethod: 'password'
    },
    {
      id: 'log-5',
      timestamp: '2026-09-15 09:05',
      ipAddress: '185.120.44.18',
      location: 'الرياض، المملكة العربية السعودية',
      device: 'MacBook Pro 16"',
      browser: 'Chrome 123',
      status: 'two_factor_verified',
      authMethod: 'sms_otp'
    }
  ]
};
