import { 
  LocalePluralConfig, 
  PluralizationOptions, 
  PluralizationResult, 
  ArabicNumeralConfig 
} from '../interfaces/pluralization.interface';

/**
 * Arabic numeral system configuration
 * Distinguishes between Eastern Arabic (Indic) and Western Arabic (European) numerals
 */
export const ARABIC_NUMERAL_CONFIG: ArabicNumeralConfig = {
  eastern: {
    locales: [
      'ar', 'ar-SA', 'ar-EG', 'ar-AE', 'ar-QA', 'ar-KW', 'ar-BH', 'ar-OM', 
      'ar-YE', 'ar-IQ', 'ar-SY', 'ar-LB', 'ar-JO', 'ar-PS', 'ar-IL',
      'fa', 'fa-IR', 'fa-AF', 'ur', 'ur-PK', 'ur-IN', 'ps', 'ps-AF', 'ps-PK'
    ],
    numberingSystem: 'arab',
    examples: {
      '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
      '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    }
  },
  western: {
    locales: [
      'ar-MA', 'ar-DZ', 'ar-TN', 'ar-LY', 'ar-MR'
    ],
    numberingSystem: 'latn',
    examples: {
      '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
      '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
    }
  }
};

/**
 * RTL pluralization configuration for different locales
 */
export const RTL_PLURAL_CONFIGS: Record<string, LocalePluralConfig> = {
  // Arabic (Eastern Arabic numerals)
  ar: {
    numberingSystem: 'arab',
    direction: 'rtl',
    useDirectionalMarkers: true,
    pluralFunction: (count: number): string => {
      if (count === 0) return 'zero';
      if (count === 1) return 'one';
      if (count === 2) return 'two';
      if (count >= 3 && count <= 10) return 'few';
      if (count >= 11 && count <= 99) return 'many';
      return 'other';
    },
    ordinalFunction: (count: number): string => {
      if (count === 1) return 'one';
      if (count === 2) return 'two';
      if (count >= 3 && count <= 10) return 'few';
      return 'other';
    },
    numberFormatOptions: {
      numberingSystem: 'arab',
      useGrouping: true
    }
  },

  // Arabic (Western Arabic numerals) - North African countries
  'ar-MA': {
    numberingSystem: 'latn',
    direction: 'rtl',
    useDirectionalMarkers: true,
    pluralFunction: (count: number): string => {
      if (count === 0) return 'zero';
      if (count === 1) return 'one';
      if (count === 2) return 'two';
      if (count >= 3 && count <= 10) return 'few';
      if (count >= 11 && count <= 99) return 'many';
      return 'other';
    },
    ordinalFunction: (count: number): string => {
      if (count === 1) return 'one';
      if (count === 2) return 'two';
      if (count >= 3 && count <= 10) return 'few';
      return 'other';
    },
    numberFormatOptions: {
      numberingSystem: 'latn',
      useGrouping: true
    }
  },

  // Hebrew
  he: {
    numberingSystem: 'hebr',
    direction: 'rtl',
    useDirectionalMarkers: true,
    pluralFunction: (count: number): string => {
      if (count === 1) return 'one';
      if (count === 2) return 'two';
      if (count >= 3 && count <= 10) return 'few';
      if (count >= 11) return 'many';
      return 'other';
    },
    ordinalFunction: (count: number): string => {
      if (count === 1) return 'one';
      if (count === 2) return 'two';
      if (count >= 3 && count <= 10) return 'few';
      return 'other';
    },
    numberFormatOptions: {
      numberingSystem: 'hebr',
      useGrouping: true
    }
  },

  // Persian/Farsi
  fa: {
    numberingSystem: 'arab',
    direction: 'rtl',
    useDirectionalMarkers: true,
    pluralFunction: (count: number): string => {
      if (count === 1) return 'one';
      return 'other';
    },
    ordinalFunction: (count: number): string => {
      if (count === 1) return 'one';
      return 'other';
    },
    numberFormatOptions: {
      numberingSystem: 'arab',
      useGrouping: true
    }
  },

  // Urdu
  ur: {
    numberingSystem: 'arab',
    direction: 'rtl',
    useDirectionalMarkers: true,
    pluralFunction: (count: number): string => {
      if (count === 1) return 'one';
      return 'other';
    },
    ordinalFunction: (count: number): string => {
      if (count === 1) return 'one';
      return 'other';
    },
    numberFormatOptions: {
      numberingSystem: 'arab',
      useGrouping: true
    }
  }
};

/**
 * Get the appropriate plural configuration for a locale
 */
export function getPluralConfig(locale: string): LocalePluralConfig {
  // Check for specific locale first
  if (RTL_PLURAL_CONFIGS[locale]) {
    return RTL_PLURAL_CONFIGS[locale];
  }

  // Check for base locale (e.g., 'ar' for 'ar-SA')
  const baseLocale = locale.split('-')[0];
  if (RTL_PLURAL_CONFIGS[baseLocale]) {
    return RTL_PLURAL_CONFIGS[baseLocale];
  }

  // Default to English
  return {
    numberingSystem: 'latn',
    direction: 'ltr',
    useDirectionalMarkers: false,
    pluralFunction: (count: number): string => {
      return count === 1 ? 'one' : 'other';
    }
  };
}

/**
 * Get the numbering system for a locale
 */
export function getNumberingSystem(locale: string): string {
  const config = getPluralConfig(locale);
  return config.numberingSystem;
}

/**
 * Check if a locale uses Eastern Arabic (Indic) numerals
 */
export function usesEasternArabicNumerals(locale: string): boolean {
  return ARABIC_NUMERAL_CONFIG.eastern.locales.includes(locale);
}

/**
 * Check if a locale uses Western Arabic (European) numerals
 */
export function usesWesternArabicNumerals(locale: string): boolean {
  return ARABIC_NUMERAL_CONFIG.western.locales.includes(locale);
}

/**
 * Hebrew number formatter
 */
function formatHebrewNumber(num: number): string {
  const hebrewNumerals = {
    0: '', 1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
    10: 'י', 11: 'יא', 12: 'יב', 13: 'יג', 14: 'יד', 15: 'טו', 16: 'טז', 17: 'יז', 18: 'יח', 19: 'יט',
    20: 'כ', 21: 'כא', 22: 'כב', 23: 'כג', 24: 'כד', 25: 'כה', 26: 'כו', 27: 'כז', 28: 'כח', 29: 'כט',
    30: 'ל', 31: 'לא', 32: 'לב', 33: 'לג', 34: 'לד', 35: 'לה', 36: 'לו', 37: 'לז', 38: 'לח', 39: 'לט',
    40: 'מ', 41: 'מא', 42: 'מב', 43: 'מג', 44: 'מד', 45: 'מה', 46: 'מו', 47: 'מז', 48: 'מח', 49: 'מט',
    50: 'נ', 51: 'נא', 52: 'נב', 53: 'נג', 54: 'נד', 55: 'נה', 56: 'נו', 57: 'נז', 58: 'נח', 59: 'נט',
    60: 'ס', 61: 'סא', 62: 'סב', 63: 'סג', 64: 'סד', 65: 'סה', 66: 'סו', 67: 'סז', 68: 'סח', 69: 'סט',
    70: 'ע', 71: 'עא', 72: 'עב', 73: 'עג', 74: 'עד', 75: 'עה', 76: 'עו', 77: 'עז', 78: 'עח', 79: 'עט',
    80: 'פ', 81: 'פא', 82: 'פב', 83: 'פג', 84: 'פד', 85: 'פה', 86: 'פו', 87: 'פז', 88: 'פח', 89: 'פט',
    90: 'צ', 91: 'צא', 92: 'צב', 93: 'צג', 94: 'צד', 95: 'צה', 96: 'צו', 97: 'צז', 98: 'צח', 99: 'צט',
    100: 'ק', 200: 'ר', 300: 'ש', 400: 'ת'
  };

  if (num === 0) return '0';
  if (num <= 99) return hebrewNumerals[num as keyof typeof hebrewNumerals] || num.toString();
  
  // For numbers > 99, compose from hundreds, tens, and ones
  if (num <= 999) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    
    let result = '';
    if (hundreds > 0) {
      result += hebrewNumerals[hundreds * 100 as keyof typeof hebrewNumerals] || '';
    }
    if (remainder > 0) {
      result += hebrewNumerals[remainder as keyof typeof hebrewNumerals] || '';
    }
    return result || num.toString();
  }
  
  // For numbers > 999, use a simple fallback
  return num.toString();
}

/**
 * Format a number according to the locale's numbering system
 */
export function formatNumberForLocale(num: number, locale: string): string {
  const config = getPluralConfig(locale);
  
  // Special handling for Hebrew
  if (locale.startsWith('he')) {
    return formatHebrewNumber(num);
  }
  
  const options = config.numberFormatOptions || {
    numberingSystem: config.numberingSystem,
    useGrouping: true
  };

  try {
    return new Intl.NumberFormat(locale, options).format(num);
  } catch (error) {
    // Fallback to basic formatting if locale is not supported
    return num.toString();
  }
}

/**
 * Get plural category for a count and locale
 */
export function getPluralCategory(count: number, locale: string): string {
  const config = getPluralConfig(locale);
  return config.pluralFunction(count);
}

/**
 * Get ordinal category for a count and locale
 */
export function getOrdinalCategory(count: number, locale: string): string {
  const config = getPluralConfig(locale);
  return config.ordinalFunction ? config.ordinalFunction(count) : 'other';
}

/**
 * Apply directional markers for RTL text
 */
export function applyDirectionalMarkers(text: string, locale: string): string {
  const config = getPluralConfig(locale);
  
  if (!config.useDirectionalMarkers || config.direction !== 'rtl') {
    return text;
  }

  // RLE (Right-to-Left Embedding) for RTL text
  return `\u202B${text}\u202C`;
}

/**
 * Handle mixed LTR/RTL content in pluralized strings
 */
export function handleMixedContent(text: string, locale: string): string {
  const config = getPluralConfig(locale);
  
  if (config.direction !== 'rtl') {
    return text;
  }

  // Handle numbers in RTL text by wrapping them with LRE/PDF markers
  return text.replace(/(\d+)/g, '\u202A$1\u202C');
}

/**
 * Process pluralization with RTL support
 */
export function processRTLPluralization(
  key: string,
  count: number,
  locale: string,
  pluralRule: Record<string, string>,
  params?: Record<string, any>,
  useDirectionalMarkers: boolean = true,
  customRule?: (count: number) => string
): PluralizationResult {
  const config = getPluralConfig(locale);
  const category = customRule ? customRule(count) : getPluralCategory(count, locale);
  
  // Map category to possible keys (support both numeric and named keys)
  const categoryKeys = {
    'zero': ['0', 'zero'],
    'one': ['1', 'one'],
    'two': ['2', 'two'],
    'few': ['few'],
    'many': ['many'],
    'other': ['other']
  };
  
  // Try to find the template using category keys
  let template = pluralRule.other; // Default fallback
  const keys = categoryKeys[category as keyof typeof categoryKeys] || ['other'];
  
  for (const key of keys) {
    if (pluralRule[key]) {
      template = pluralRule[key];
      break;
    }
  }
  
  // Format numbers according to locale
  const formattedParams: Record<string, any> = { ...params };
  // Always add the count parameter
  formattedParams.count = formatNumberForLocale(count, locale);
  
  // Interpolate parameters
  let result = template;
  if (formattedParams) {
    Object.entries(formattedParams).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
      result = result.replace(regex, String(value));
    });
  }
  
  // Handle mixed content for RTL only if directional markers are enabled
  if (config.direction === 'rtl' && useDirectionalMarkers) {
    result = handleMixedContent(result, locale);
  }
  
  // Apply directional markers if needed
  const finalText = useDirectionalMarkers 
    ? applyDirectionalMarkers(result, locale)
    : result;

  return {
    text: finalText,
    category,
    rtl: {
      isRTL: config.direction === 'rtl',
      direction: config.direction,
      script: config.numberingSystem
    },
    numberFormat: {
      originalNumber: count,
      formattedNumber: formatNumberForLocale(count, locale),
      numberingSystem: config.numberingSystem
    }
  };
}

/**
 * Validate plural rule structure
 */
export function validatePluralRule(pluralRule: Record<string, string>): boolean {
  // Must have 'other' as fallback
  if (!pluralRule.other) {
    return false;
  }
  
  // Check for valid categories (support both numeric keys and category names)
  const validCategories = ['zero', 'one', 'two', 'few', 'many', 'other', '0', '1', '2'];
  const ruleCategories = Object.keys(pluralRule);
  
  return ruleCategories.every(category => validCategories.includes(category));
}

/**
 * Get all supported RTL locales
 */
export function getSupportedRTLLocales(): string[] {
  return Object.keys(RTL_PLURAL_CONFIGS);
}

/**
 * Check if a locale has complex plural rules (more than 2 categories)
 */
export function hasComplexPluralRules(locale: string): boolean {
  const config = getPluralConfig(locale);
  const categories = new Set<string>();
  
  // Test with various numbers to see how many categories are used
  for (let i = 0; i <= 100; i++) {
    categories.add(config.pluralFunction(i));
  }
  
  return categories.size > 2;
}
