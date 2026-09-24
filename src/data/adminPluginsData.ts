export interface AdminPluginItem {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'moderation' | 'themes' | 'billing' | 'social' | 'analytics' | 'media' | 'utility';
  status: 'active' | 'inactive';
  version: string;
  author: string;
  configurable: boolean;
  settings?: Record<string, any>;
}

export const INITIAL_PLUGINS_LIST: AdminPluginItem[] = [
  {
    id: 'activity_notifications',
    name: 'Activity notifications',
    description: 'Real-time and email notifications about site activity and matchmaking alerts.',
    category: 'social',
    status: 'active',
    version: '2.4.1',
    author: 'SkaDate / Meethaq',
    configurable: true
  },
  {
    id: 'advanced_moderation',
    name: 'Advanced Moderation',
    description: 'Plugin allows for advanced moderation, image checks, and Sharia compliance flags.',
    category: 'moderation',
    status: 'active',
    version: '3.1.0',
    author: 'Sharia Tech Team',
    configurable: true
  },
  {
    id: 'aurora_theme',
    name: 'Aurora theme settings',
    description: 'Aurora theme configuration with soft gradient palettes and modern cards.',
    category: 'themes',
    status: 'inactive',
    version: '1.2.0',
    author: 'SkaDate Themes',
    configurable: true
  },
  {
    id: 'blogs',
    name: 'Blogs',
    description: 'User blogs with archives, tags, comments and matrimonial advice articles.',
    category: 'social',
    status: 'active',
    version: '2.0.4',
    author: 'Community Hub',
    configurable: true
  },
  {
    id: 'bookmarks',
    name: 'Bookmarks',
    description: 'Allow users to bookmark profiles for further contact. Help them never miss their match.',
    category: 'core',
    status: 'active',
    version: '1.8.2',
    author: 'SkaDate Core',
    configurable: false
  },
  {
    id: 'ccbill_billing_flex',
    name: 'CCBill Billing FLex',
    description: 'Accept payments from users with CCBill payment provider (Flex Form Version).',
    category: 'billing',
    status: 'inactive',
    version: '2.1.1',
    author: 'CCBill Gateway',
    configurable: true
  },
  {
    id: 'contact_importer',
    name: 'Contact Importer',
    description: 'Import Google contacts for community invitations and guardian references.',
    category: 'utility',
    status: 'inactive',
    version: '1.5.0',
    author: 'SkaDate Utility',
    configurable: true
  },
  {
    id: 'contact_us',
    name: 'Contact Us',
    description: '"Contact us" page with the ability to choose departments (email addresses, Sharia fatwa inquiry).',
    category: 'utility',
    status: 'active',
    version: '1.3.2',
    author: 'Core Support',
    configurable: true
  },
  {
    id: 'custom_index',
    name: 'Custom index',
    description: 'Plugin adds customized index page with tailored banners and hero sections.',
    category: 'themes',
    status: 'active',
    version: '2.0.0',
    author: 'Atelier Devs',
    configurable: true
  },
  {
    id: 'daily_like_limit',
    name: 'Daily Like Limit',
    description: 'The plugin limits the number of likes or proposals a user can make per day to prevent spam.',
    category: 'moderation',
    status: 'active',
    version: '1.4.2',
    author: 'Safety Ops',
    configurable: true
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Create public and private events within your community, let people RSVP and discuss.',
    category: 'social',
    status: 'active',
    version: '2.3.0',
    author: 'Events Group',
    configurable: true
  },
  {
    id: 'fake_users_moderators',
    name: 'Fake users and Moderators',
    description: 'Manage simulated users for platform seeding and assign moderator accounts.',
    category: 'moderation',
    status: 'active',
    version: '2.5.1',
    author: 'Dev Testing Tools',
    configurable: true
  },
  {
    id: 'fakes_console',
    name: "Fake's console",
    description: "Console for managing simulated user interactions and test scenarios.",
    category: 'utility',
    status: 'active',
    version: '2.0.0',
    author: 'Internal QA',
    configurable: true
  },
  {
    id: 'fakes_console_ai',
    name: "Fake's console's AI",
    description: "AI-assisted test conversation generator to verify supervision rules.",
    category: 'utility',
    status: 'active',
    version: '1.9.0',
    author: 'Gemini Labs',
    configurable: true
  },
  {
    id: 'firebase_auth',
    name: 'Firebase auth',
    description: 'Site logins using Google, Facebook, Phone OTP, and Firebase Authentication.',
    category: 'core',
    status: 'active',
    version: '3.0.0',
    author: 'Google Cloud Integration',
    configurable: true
  },
  {
    id: 'forum',
    name: 'Forum',
    description: 'Simple discussion boards for users and family life discussions.',
    category: 'social',
    status: 'active',
    version: '2.2.0',
    author: 'Community Hub',
    configurable: true
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    description: 'The General Data Protection Regulation module gives end user visibility to the data stored about themself and aims to help site admins follow the guidelines and legislation set by the EU.',
    category: 'moderation',
    status: 'active',
    version: '1.7.0',
    author: 'Compliance Legal',
    configurable: true
  },
  {
    id: 'geolocation_ips_database',
    name: 'Geolocation IPs database',
    description: 'Installs IPs of countries from around the world for automated location mapping.',
    category: 'utility',
    status: 'active',
    version: '4.2.1',
    author: 'GeoData Services',
    configurable: true
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    description: 'Track your site visitor statistics with Google Analytics GA4 integration.',
    category: 'analytics',
    status: 'active',
    version: '2.1.0',
    author: 'Google Cloud',
    configurable: true
  },
  {
    id: 'groups',
    name: 'Groups',
    description: 'Simple groups within one site for specific interests or cultural communities.',
    category: 'social',
    status: 'active',
    version: '1.9.5',
    author: 'Community Hub',
    configurable: true
  },
  {
    id: 'hot_list',
    name: 'Hot List',
    description: 'Allows users to buy a place in the hot list with credits. This plugin must only to be used on licensed SkaDate websites.',
    category: 'core',
    status: 'active',
    version: '2.0.2',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'image_slideshow',
    name: 'Image Slideshow',
    description: 'Interactive image slideshow for home banners and approved profile albums.',
    category: 'media',
    status: 'active',
    version: '1.4.0',
    author: 'Media Team',
    configurable: true
  },
  {
    id: 'incognito_mode',
    name: 'Incognito Mode',
    description: 'Hides users from general public lists while allowing them to send private requests.',
    category: 'core',
    status: 'active',
    version: '1.6.0',
    author: 'Privacy Ops',
    configurable: true
  },
  {
    id: 'location_maps',
    name: 'Location Maps',
    description: 'This plugin allows users to add their Google Maps or Bing Maps location in profile details. Plugin compatible with Oxwall 1.7.3 and upper.',
    category: 'utility',
    status: 'active',
    version: '2.2.0',
    author: 'Mapping Solutions',
    configurable: true
  },
  {
    id: 'matchmaking',
    name: 'Matchmaking',
    description: 'Allows to calculate compatibility score between users based on profile information. You can modify the rules to change the matching algorithm. This plugin must only be used on licensed SkaDate websites.',
    category: 'core',
    status: 'active',
    version: '3.5.0',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'messages',
    name: 'Messages',
    description: 'Unified messaging plugin for private on-site communication with Wali supervision.',
    category: 'core',
    status: 'active',
    version: '4.0.1',
    author: 'Communication Core',
    configurable: true
  },
  {
    id: 'midnight_theme',
    name: 'Midnight theme settings',
    description: 'Midnight theme configuration for ultra sleek dark-mode experience.',
    category: 'themes',
    status: 'inactive',
    version: '1.1.0',
    author: 'SkaDate Themes',
    configurable: true
  },
  {
    id: 'miniature_theme',
    name: 'Miniature theme settings',
    description: 'Miniature theme configuration with compact cards and high density layout.',
    category: 'themes',
    status: 'inactive',
    version: '1.0.8',
    author: 'SkaDate Themes',
    configurable: true
  },
  {
    id: 'mixpanel_integration',
    name: 'Mixpanel Integration',
    description: 'This plugin facilitates the integration of Mixpanel analytics into the Skadate software ecosystem. It is designed to enhance the capabilities of Skadate by allowing users to leverage Mixpanel\'s advanced analytics tools. This integration can provide valuable insights into user behavior and engagement within the Skadate platform.',
    category: 'analytics',
    status: 'active',
    version: '2.0.0',
    author: 'Mixpanel Analytics',
    configurable: true
  },
  {
    id: 'my_interests',
    name: 'My Interests',
    description: 'The plugin enhances user experience by offering a menu with pages for managing interactions and customizing feature accessibility in the admin panel.',
    category: 'core',
    status: 'active',
    version: '1.7.4',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'newsfeed',
    name: 'Newsfeed',
    description: 'Newsfeed with likes and comments, Facebook-style community updates.',
    category: 'social',
    status: 'active',
    version: '3.2.0',
    author: 'Social Core',
    configurable: true
  },
  {
    id: 'paid_membership',
    name: 'Paid Membership',
    description: 'Customizable paid membership levels for accepting membership subscriptions and premium perks.',
    category: 'billing',
    status: 'active',
    version: '3.1.2',
    author: 'SkaDate Billing',
    configurable: true
  },
  {
    id: 'paypal_billing',
    name: 'PayPal Billing',
    description: 'Accept payments from users with PayPal payment provider and Express Checkout.',
    category: 'billing',
    status: 'active',
    version: '2.9.0',
    author: 'PayPal Inc.',
    configurable: true
  },
  {
    id: 'photo',
    name: 'Photo',
    description: 'Allow users to upload photos with tags, rates, and comments, with Sharia modesty blur.',
    category: 'media',
    status: 'active',
    version: '2.6.0',
    author: 'Media Core',
    configurable: true
  },
  {
    id: 'premoderation',
    name: 'Premoderation',
    description: 'Moderation tools requiring admin inspection before profiles and photos appear publicly.',
    category: 'moderation',
    status: 'active',
    version: '2.0.1',
    author: 'Safety Ops',
    configurable: true
  },
  {
    id: 'privacy',
    name: 'Privacy',
    description: 'Privacy settings for users to manage who sees their profiles, photos, and contact info.',
    category: 'core',
    status: 'active',
    version: '2.5.0',
    author: 'Security Core',
    configurable: true
  },
  {
    id: 'private_photo_albums',
    name: 'Private photo albums',
    description: 'The plugin allows site users to lock their photo albums, making them private and available only to approved suitors with Wali consent.',
    category: 'media',
    status: 'active',
    version: '1.9.3',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'profile_cover_gallery',
    name: 'Profile Cover Gallery',
    description: 'Shows a beautiful photo gallery on user profile. This plugin must only be used on licensed SkaDate websites.',
    category: 'themes',
    status: 'active',
    version: '2.1.0',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'rewind_card',
    name: 'Rewind card',
    description: 'Rewind card on Tinder page allowing users to bring back passed candidates.',
    category: 'core',
    status: 'active',
    version: '1.2.0',
    author: 'Card Match Engine',
    configurable: false
  },
  {
    id: 'skadate_mobile_app',
    name: 'SkaDate Mobile Application',
    description: 'iOS and Android App Settings, push notifications, and API endpoints config.',
    category: 'utility',
    status: 'active',
    version: '3.0.0',
    author: 'SkaDate Mobile',
    configurable: true
  },
  {
    id: 'skadate_premium_templates',
    name: 'SkaDate Premium Templates',
    description: 'Activates additional functions built within SkaDate premium templates, allowing their use on the site.',
    category: 'themes',
    status: 'active',
    version: '2.8.0',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'skadate_system_tools',
    name: 'SkaDate System Tools',
    description: 'This is the backend service plugin for SkaDate. Do not deactivate or uninstall. This plugin must only be used for licensed SkaDate websites.',
    category: 'core',
    status: 'active',
    version: '4.5.2',
    author: 'SkaDate Core Architecture',
    configurable: true
  },
  {
    id: 'stripe_billing',
    name: 'Stripe Billing',
    description: 'Accept payments from users with Stripe payment provider, Apple Pay, and credit cards.',
    category: 'billing',
    status: 'active',
    version: '3.4.0',
    author: 'Stripe Gateway',
    configurable: true
  },
  {
    id: 'superlikes',
    name: 'Superlikes',
    description: 'Plugin added ability to super like user profile with priority notice.',
    category: 'core',
    status: 'active',
    version: '1.5.0',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'tinder_mode_desktop',
    name: 'Tinder Mode for Desktop',
    description: 'Rate and match with users using interactive card swiping interface.',
    category: 'core',
    status: 'active',
    version: '2.1.2',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'twenty_years_dark_theme',
    name: 'Twenty Years Dark theme settings',
    description: 'Twenty Years Dark theme configuration with high contrast luxury palette.',
    category: 'themes',
    status: 'inactive',
    version: '1.0.0',
    author: 'SkaDate Themes',
    configurable: true
  },
  {
    id: 'twenty_years_light_theme',
    name: 'Twenty Years Light theme settings',
    description: 'Twenty Years Light theme configuration with refined classical typography.',
    category: 'themes',
    status: 'active',
    version: '1.0.0',
    author: 'SkaDate Themes',
    configurable: true
  },
  {
    id: 'user_credits',
    name: 'User Credits',
    description: 'Allow users to earn, purchase and spend user credits on premium features and gifts.',
    category: 'billing',
    status: 'active',
    version: '2.7.0',
    author: 'SkaDate Billing',
    configurable: true
  },
  {
    id: 'user_search',
    name: 'User Search',
    description: 'Implements quick and advanced search interfaces for dating sites. This plugin must only be used on licensed SkaDate websites.',
    category: 'core',
    status: 'active',
    version: '3.1.0',
    author: 'SkaDate Search Engine',
    configurable: true
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Allow users to embed videos with comments, rates, and tags under Sharia supervision.',
    category: 'media',
    status: 'active',
    version: '2.3.0',
    author: 'Media Team',
    configurable: true
  },
  {
    id: 'video_instant_messenger',
    name: 'Video Instant Messenger',
    description: 'Standalone video chat module to enable private video conversations between two users, based on WebRTC technology (Wali presence enabled).',
    category: 'media',
    status: 'active',
    version: '2.8.4',
    author: 'WebRTC Communications',
    configurable: true
  },
  {
    id: 'view_guests',
    name: 'View Guests',
    description: 'The plugin blurs users who viewed your profile until unlocked.',
    category: 'core',
    status: 'active',
    version: '1.6.0',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'virtual_gifts',
    name: 'Virtual Gifts',
    description: 'Allow users to send private and public virtual gifts (Bouquets, Islamic books, dates).',
    category: 'social',
    status: 'active',
    version: '2.2.0',
    author: 'Social Core',
    configurable: true
  },
  {
    id: 'who_liked_me',
    name: 'Who Liked Me',
    description: 'The plugin blurs users who liked your profile to encourage premium upgrade.',
    category: 'core',
    status: 'active',
    version: '1.7.0',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'who_viewed_me',
    name: 'Who Viewed Me',
    description: 'Displays guests who visited your user profile with timestamps.',
    category: 'core',
    status: 'active',
    version: '2.0.1',
    author: 'SkaDate Official',
    configurable: true
  },
  {
    id: 'winks',
    name: 'Winks',
    description: 'Allow users to wink at each other to increase the number of contacts for monetization.',
    category: 'social',
    status: 'active',
    version: '1.8.0',
    author: 'Social Core',
    configurable: true
  },
  // Inactive Plugins as indicated by user
  {
    id: 'advertisement',
    name: 'Advertisement',
    description: 'Simple banner ad management with geo-targeting and campaign scheduling.',
    category: 'utility',
    status: 'inactive',
    version: '1.9.0',
    author: 'Ad Services',
    configurable: true
  },
  {
    id: 'friends',
    name: 'Friends',
    description: 'Friending functionality to be used across multiple features and mutual networks.',
    category: 'social',
    status: 'inactive',
    version: '2.4.0',
    author: 'Community Hub',
    configurable: true
  },
  {
    id: 'social_media_sharing',
    name: 'Social media sharing',
    description: 'Share any content from your site on Facebook, Twitter, WhatsApp, Pinterest, etc...',
    category: 'social',
    status: 'inactive',
    version: '1.6.0',
    author: 'Social Connect',
    configurable: true
  }
];
