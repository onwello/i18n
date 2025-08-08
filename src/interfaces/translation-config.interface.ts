/**
 * Configuration interface for the translation library
 */
export interface TranslationConfig {
  /** Service name for translation key prefixing */
  serviceName: string;
  
  /** Default locale to use when translation is not found */
  defaultLocale?: string;
  
  /** Supported locales */
  supportedLocales?: string[];
  
  /** Path to translation files relative to service root */
  translationsPath?: string;
  
  /** Whether to enable debug logging */
  debug?: boolean;
  
  /** Custom interpolation delimiters */
  interpolation?: {
    prefix?: string;
    suffix?: string;
  };
  
  /** Fallback strategy when translation is missing */
  fallbackStrategy?: 'key' | 'default' | 'throw';
  
  /** Cache configuration */
  cache?: {
    enabled?: boolean;
    ttl?: number; // Time to live in seconds
  };

  /** Statistics configuration */
  statistics?: {
    enabled?: boolean;
    trackKeyUsage?: boolean;
    trackLocaleUsage?: boolean;
  };

  /** RTL (Right-to-Left) configuration */
  rtl?: {
    enabled?: boolean;
    autoDetect?: boolean;
    wrapWithMarkers?: boolean;
    includeDirectionalInfo?: boolean;
  };

  /** Pluralization configuration */
  pluralization?: {
    enabled?: boolean;
    formatNumbers?: boolean;
    useDirectionalMarkers?: boolean;
    validatePluralRules?: boolean;
    trackPluralizationStats?: boolean;
    ordinal?: boolean;
    customRules?: Record<string, (count: number) => string>;
  };
}

/**
 * Translation parameters interface
 */
export interface TranslationParams {
  [key: string]: any;
}

/**
 * Translation options interface
 */
export interface TranslationOptions {
  /** Locale to translate to */
  locale?: string;
  
  /** Parameters for interpolation */
  params?: TranslationParams;
  
  /** Whether to use fallback locale if translation not found */
  useFallback?: boolean;
}

/**
 * Translation metadata interface
 */
export interface TranslationMetadata {
  /** Translation key */
  key: string;
  
  /** Original text */
  originalText: string;
  
  /** Translated text */
  translatedText: string;
  
  /** Locale used */
  locale: string;
  
  /** Whether fallback was used */
  fallbackUsed: boolean;
  
  /** Timestamp of translation */
  timestamp: Date;
  
  /** RTL information */
  rtl?: {
    isRTL: boolean;
    direction: 'ltr' | 'rtl' | 'auto';
    script?: string;
    languageName?: string;
  };
}

/**
 * Translation statistics interface
 */
export interface TranslationStats {
  /** Total translations requested */
  totalRequests: number;
  
  /** Successful translations */
  successfulTranslations: number;
  
  /** Failed translations (fallback used) */
  failedTranslations: number;
  
  /** Cache hits */
  cacheHits: number;
  
  /** Cache misses */
  cacheMisses: number;
  
  /** Most used locales */
  localeUsage: Record<string, number>;
  
  /** Most used keys */
  keyUsage: Record<string, number>;
} 