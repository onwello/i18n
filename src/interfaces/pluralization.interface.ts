/**
 * Pluralization interfaces for enterprise-grade i18n library
 * Handles RTL languages, Arabic numeral systems, and complex plural rules
 */

export interface PluralRule {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string; // Required fallback
}

export interface OrdinalRule {
  one?: string;
  two?: string;
  few?: string;
  other: string; // Required fallback
}

export interface LocalePluralConfig {
  /** Numbering system for this locale */
  numberingSystem: 'arab' | 'latn' | 'hebr' | 'thai' | 'beng' | 'deva';
  
  /** Text direction */
  direction: 'rtl' | 'ltr';
  
  /** Plural function that returns category based on count */
  pluralFunction: (count: number) => string;
  
  /** Ordinal function for ordinal numbers */
  ordinalFunction?: (count: number) => string;
  
  /** Whether to use directional markers for RTL */
  useDirectionalMarkers: boolean;
  
  /** Locale-specific number formatting options */
  numberFormatOptions?: Intl.NumberFormatOptions;
}

export interface PluralizationOptions {
  /** Count for pluralization */
  count: number;
  
  /** Locale for pluralization rules */
  locale: string;
  
  /** Additional parameters for interpolation */
  params?: Record<string, any>;
  
  /** Whether to format numbers according to locale */
  formatNumbers?: boolean;
  
  /** Whether to use directional markers for RTL */
  useDirectionalMarkers?: boolean;
  
  /** Whether to handle ordinal pluralization */
  ordinal?: boolean;
}

export interface PluralizationResult {
  /** The pluralized text */
  text: string;
  
  /** The plural category used */
  category: string;
  
  /** RTL information if applicable */
  rtl?: {
    isRTL: boolean;
    direction: 'ltr' | 'rtl' | 'auto';
    script?: string;
  };
  
  /** Number formatting information */
  numberFormat?: {
    originalNumber: number;
    formattedNumber: string;
    numberingSystem: string;
  };
}

/**
 * Arabic numeral system mapping
 * Distinguishes between Eastern Arabic (Indic) and Western Arabic (European) numerals
 */
export interface ArabicNumeralConfig {
  /** Eastern Arabic (Indic) numerals: ٠١٢٣٤٥٦٧٨٩ */
  eastern: {
    locales: string[];
    numberingSystem: 'arab';
    examples: Record<string, string>;
  };
  
  /** Western Arabic (European) numerals: 0123456789 */
  western: {
    locales: string[];
    numberingSystem: 'latn';
    examples: Record<string, string>;
  };
}

/**
 * RTL pluralization metadata
 */
export interface RTLPluralizationMetadata {
  /** Original translation key */
  key: string;
  
  /** Count used for pluralization */
  count: number;
  
  /** Locale used */
  locale: string;
  
  /** Plural category determined */
  category: string;
  
  /** Whether RTL processing was applied */
  rtlProcessed: boolean;
  
  /** Number formatting applied */
  numberFormatted: boolean;
  
  /** Directional markers applied */
  directionalMarkersApplied: boolean;
  
  /** Timestamp of pluralization */
  timestamp: Date;
}
