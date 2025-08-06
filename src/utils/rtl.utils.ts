/**
 * RTL (Right-to-Left) language support utilities
 * Supports Arabic, Hebrew, Persian, Urdu, and other RTL languages
 */

// Memoization cache for RTL detection
const rtlCache = new Map<string, boolean>();
const rtlInfoCache = new Map<string, any>();

// Lazy-loaded RTL locales for better performance
let RTL_LOCALES: Record<string, { name: string; direction: 'rtl'; script: string }> | null = null;

/**
 * Get RTL locales (lazy loaded)
 */
function getRTLLocalesData(): Record<string, { name: string; direction: 'rtl'; script: string }> {
  if (!RTL_LOCALES) {
    RTL_LOCALES = {
      // Arabic
      ar: { name: 'Arabic', direction: 'rtl', script: 'Arab' },
      'ar-SA': { name: 'Arabic (Saudi Arabia)', direction: 'rtl', script: 'Arab' },
      'ar-EG': { name: 'Arabic (Egypt)', direction: 'rtl', script: 'Arab' },
      'ar-AE': { name: 'Arabic (UAE)', direction: 'rtl', script: 'Arab' },
      'ar-LB': { name: 'Arabic (Lebanon)', direction: 'rtl', script: 'Arab' },
      'ar-JO': { name: 'Arabic (Jordan)', direction: 'rtl', script: 'Arab' },
      'ar-SY': { name: 'Arabic (Syria)', direction: 'rtl', script: 'Arab' },
      'ar-IQ': { name: 'Arabic (Iraq)', direction: 'rtl', script: 'Arab' },
      'ar-KW': { name: 'Arabic (Kuwait)', direction: 'rtl', script: 'Arab' },
      'ar-BH': { name: 'Arabic (Bahrain)', direction: 'rtl', script: 'Arab' },
      'ar-QA': { name: 'Arabic (Qatar)', direction: 'rtl', script: 'Arab' },
      'ar-OM': { name: 'Arabic (Oman)', direction: 'rtl', script: 'Arab' },
      'ar-YE': { name: 'Arabic (Yemen)', direction: 'rtl', script: 'Arab' },
      'ar-LY': { name: 'Arabic (Libya)', direction: 'rtl', script: 'Arab' },
      'ar-DZ': { name: 'Arabic (Algeria)', direction: 'rtl', script: 'Arab' },
      'ar-MA': { name: 'Arabic (Morocco)', direction: 'rtl', script: 'Arab' },
      'ar-TN': { name: 'Arabic (Tunisia)', direction: 'rtl', script: 'Arab' },
      'ar-MR': { name: 'Arabic (Mauritania)', direction: 'rtl', script: 'Arab' },
      'ar-SD': { name: 'Arabic (Sudan)', direction: 'rtl', script: 'Arab' },
      'ar-TD': { name: 'Arabic (Chad)', direction: 'rtl', script: 'Arab' },
      'ar-KM': { name: 'Arabic (Comoros)', direction: 'rtl', script: 'Arab' },
      'ar-DJ': { name: 'Arabic (Djibouti)', direction: 'rtl', script: 'Arab' },
      'ar-SO': { name: 'Arabic (Somalia)', direction: 'rtl', script: 'Arab' },
      'ar-ER': { name: 'Arabic (Eritrea)', direction: 'rtl', script: 'Arab' },
      'ar-IL': { name: 'Arabic (Israel)', direction: 'rtl', script: 'Arab' },
      'ar-PS': { name: 'Arabic (Palestine)', direction: 'rtl', script: 'Arab' },
      
      // Hebrew
      he: { name: 'Hebrew', direction: 'rtl', script: 'Hebr' },
      'he-IL': { name: 'Hebrew (Israel)', direction: 'rtl', script: 'Hebr' },
      
      // Persian/Farsi
      fa: { name: 'Persian', direction: 'rtl', script: 'Arab' },
      'fa-IR': { name: 'Persian (Iran)', direction: 'rtl', script: 'Arab' },
      'fa-AF': { name: 'Persian (Afghanistan)', direction: 'rtl', script: 'Arab' },
      
      // Urdu
      ur: { name: 'Urdu', direction: 'rtl', script: 'Arab' },
      'ur-PK': { name: 'Urdu (Pakistan)', direction: 'rtl', script: 'Arab' },
      'ur-IN': { name: 'Urdu (India)', direction: 'rtl', script: 'Arab' },
      
      // Kurdish
      ku: { name: 'Kurdish', direction: 'rtl', script: 'Arab' },
      'ku-IQ': { name: 'Kurdish (Iraq)', direction: 'rtl', script: 'Arab' },
      'ku-IR': { name: 'Kurdish (Iran)', direction: 'rtl', script: 'Arab' },
      
      // Pashto
      ps: { name: 'Pashto', direction: 'rtl', script: 'Arab' },
      'ps-AF': { name: 'Pashto (Afghanistan)', direction: 'rtl', script: 'Arab' },
      'ps-PK': { name: 'Pashto (Pakistan)', direction: 'rtl', script: 'Arab' },
      
      // Sindhi
      sd: { name: 'Sindhi', direction: 'rtl', script: 'Arab' },
      'sd-PK': { name: 'Sindhi (Pakistan)', direction: 'rtl', script: 'Arab' },
      'sd-IN': { name: 'Sindhi (India)', direction: 'rtl', script: 'Arab' },
      
      // Uyghur
      ug: { name: 'Uyghur', direction: 'rtl', script: 'Arab' },
      'ug-CN': { name: 'Uyghur (China)', direction: 'rtl', script: 'Arab' },
      
      // Yiddish
      yi: { name: 'Yiddish', direction: 'rtl', script: 'Hebr' },
      'yi-US': { name: 'Yiddish (United States)', direction: 'rtl', script: 'Hebr' },
      'yi-IL': { name: 'Yiddish (Israel)', direction: 'rtl', script: 'Hebr' },
      
      // Azerbaijani (Arabic script)
      'az-Arab': { name: 'Azerbaijani (Arabic)', direction: 'rtl', script: 'Arab' },
      'az-Arab-IR': { name: 'Azerbaijani (Iran, Arabic)', direction: 'rtl', script: 'Arab' },
      
      // Kashmiri
      ks: { name: 'Kashmiri', direction: 'rtl', script: 'Arab' },
      'ks-IN': { name: 'Kashmiri (India)', direction: 'rtl', script: 'Arab' },
      'ks-PK': { name: 'Kashmiri (Pakistan)', direction: 'rtl', script: 'Arab' },
      
      // Balochi
      bal: { name: 'Balochi', direction: 'rtl', script: 'Arab' },
      'bal-PK': { name: 'Balochi (Pakistan)', direction: 'rtl', script: 'Arab' },
      'bal-IR': { name: 'Balochi (Iran)', direction: 'rtl', script: 'Arab' },
      'bal-AF': { name: 'Balochi (Afghanistan)', direction: 'rtl', script: 'Arab' }
    };
  }
  return RTL_LOCALES;
}

// Pre-compiled regex for RTL text detection
const RTL_RANGES = [
  /[\u0590-\u05FF]/, // Hebrew
  /[\u0600-\u06FF]/, // Arabic
  /[\u0750-\u077F]/, // Arabic Supplement
  /[\u08A0-\u08FF]/, // Arabic Extended-A
  /[\uFB50-\uFDFF]/, // Arabic Presentation Forms-A
  /[\uFE70-\uFEFF]/, // Arabic Presentation Forms-B
  /[\u200F]/, // Right-to-Left Mark
  /[\u202B]/, // Right-to-Left Embedding
  /[\u202E]/, // Right-to-Left Override
  /[\u2067]/, // Right-to-Left Isolate
  /[\u2068]/, // First Strong Isolate
  /[\u2069]/, // Pop Directional Isolate
];

// Combined regex for better performance
const RTL_REGEX = new RegExp(RTL_RANGES.map(r => r.source).join('|'));

/**
 * Check if a locale is RTL (with memoization)
 */
export function isRTL(locale: string): boolean {
  if (!locale) return false;
  
  const normalizedLocale = locale.toLowerCase();
  
  // Check cache first
  if (rtlCache.has(normalizedLocale)) {
    return rtlCache.get(normalizedLocale)!;
  }
  
  const locales = getRTLLocalesData();
  const result = normalizedLocale in locales || 
         Object.keys(locales).some(key => 
           normalizedLocale.startsWith(key.toLowerCase())
         );
  
  // Cache the result
  rtlCache.set(normalizedLocale, result);
  return result;
}

/**
 * Get RTL information for a locale (with memoization)
 */
export function getRTLInfo(locale: string): {
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  script?: string;
  name?: string;
} {
  if (!locale) {
    return { isRTL: false, direction: 'ltr' };
  }
  
  const normalizedLocale = locale.toLowerCase();
  
  // Check cache first
  if (rtlInfoCache.has(normalizedLocale)) {
    return rtlInfoCache.get(normalizedLocale)!;
  }
  
  const locales = getRTLLocalesData();
  
  // Check exact match first
  if (normalizedLocale in locales) {
    const info = locales[normalizedLocale];
    const result = {
      isRTL: true,
      direction: 'rtl' as const,
      script: info.script,
      name: info.name
    };
    rtlInfoCache.set(normalizedLocale, result);
    return result;
  }
  
  // Check prefix match
  for (const [key, info] of Object.entries(locales)) {
    if (normalizedLocale.startsWith(key.toLowerCase())) {
      const result = {
        isRTL: true,
        direction: 'rtl' as const,
        script: info.script,
        name: info.name
      };
      rtlInfoCache.set(normalizedLocale, result);
      return result;
    }
  }
  
  const result = {
    isRTL: false,
    direction: 'ltr' as const
  };
  rtlInfoCache.set(normalizedLocale, result);
  return result;
}

/**
 * Get all RTL locales (lazy loaded)
 */
export function getRTLLocales(): string[] {
  return Object.keys(getRTLLocalesData());
}

/**
 * Get all RTL locales with their information (lazy loaded)
 */
export function getRTLLocalesInfo(): Record<string, { name: string; direction: 'rtl'; script: string }> {
  return getRTLLocalesData();
}

/**
 * Check if text contains RTL characters (optimized)
 */
export function containsRTLText(text: string): boolean {
  if (!text) return false;
  return RTL_REGEX.test(text);
}

/**
 * Get text direction for mixed content (optimized)
 */
export function getTextDirection(text: string): 'ltr' | 'rtl' | 'auto' {
  if (!text) return 'ltr';
  
  const hasRTL = RTL_REGEX.test(text);
  const hasLTR = /[a-zA-Z]/.test(text);
  
  if (hasRTL && hasLTR) {
    return 'auto'; // Mixed content
  } else if (hasRTL) {
    return 'rtl';
  } else {
    return 'ltr';
  }
}

/**
 * Wrap text with appropriate directional markers (optimized)
 */
export function wrapWithDirectionalMarkers(text: string, direction: 'ltr' | 'rtl' | 'auto'): string {
  if (direction === 'auto' || !text) {
    return text; // Let the browser handle it
  }
  
  const markers = {
    ltr: '\u200E', // Left-to-Right Mark
    rtl: '\u200F'  // Right-to-Left Mark
  };
  
  return markers[direction] + text;
}

/**
 * Clean directional markers from text (optimized)
 */
export function cleanDirectionalMarkers(text: string): string {
  if (!text) return text;
  return text.replace(/[\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069]/g, '');
}

/**
 * Clear all caches (useful for testing or memory management)
 */
export function clearRTLCaches(): void {
  rtlCache.clear();
  rtlInfoCache.clear();
  RTL_LOCALES = null;
} 