// Using native Intl API instead of external dependency

/**
 * Date formatting configuration for different locales
 */
export interface DateFormatConfig {
  locale: string;
  format: 'short' | 'medium' | 'long' | 'full';
  customFormat?: string;
  numberingSystem?: string;
  calendar?: string;
}

/**
 * Default date formatting configurations for different locales
 */
export const DATE_FORMAT_CONFIGS: Record<string, DateFormatConfig> = {
  'en': {
    locale: 'en',
    format: 'medium'
  },
  'en-US': {
    locale: 'en-US',
    format: 'short'
  },
  'en-GB': {
    locale: 'en-GB',
    format: 'short'
  },
  'ar': {
    locale: 'ar',
    format: 'medium',
    numberingSystem: 'arab',
    calendar: 'gregory'
  },
  'ar-SA': {
    locale: 'ar-SA',
    format: 'medium',
    numberingSystem: 'arab',
    calendar: 'gregory'
  },
  'ar-MA': {
    locale: 'ar-MA',
    format: 'medium',
    numberingSystem: 'latn',
    calendar: 'gregory'
  },
  'he': {
    locale: 'he',
    format: 'medium',
    numberingSystem: 'hebr',
    calendar: 'gregory'
  },
  'he-IL': {
    locale: 'he-IL',
    format: 'medium',
    numberingSystem: 'hebr',
    calendar: 'gregory'
  },
  'fa': {
    locale: 'fa',
    format: 'medium',
    numberingSystem: 'arab',
    calendar: 'persian'
  },
  'fa-IR': {
    locale: 'fa-IR',
    format: 'medium',
    numberingSystem: 'arab',
    calendar: 'persian'
  },
  'ur': {
    locale: 'ur',
    format: 'medium',
    numberingSystem: 'arab',
    calendar: 'gregory'
  },
  'fr': {
    locale: 'fr',
    format: 'medium'
  },
  'fr-FR': {
    locale: 'fr-FR',
    format: 'short'
  },
  'es': {
    locale: 'es',
    format: 'medium'
  },
  'es-ES': {
    locale: 'es-ES',
    format: 'short'
  },
  'de': {
    locale: 'de',
    format: 'medium'
  },
  'de-DE': {
    locale: 'de-DE',
    format: 'short'
  }
};

/**
 * Format a date for a specific locale
 * @param date - The date to format
 * @param locale - The target locale
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDateForLocale(
  date: Date | string | number,
  locale: string,
  options?: Partial<DateFormatConfig>
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const config = getDateFormatConfig(locale, options);
  
  try {
    const formatter = new Intl.DateTimeFormat(config.locale, {
      dateStyle: config.format,
      numberingSystem: config.numberingSystem,
      calendar: config.calendar
    });
    
    return formatter.format(dateObj);
  } catch (error) {
    // Fallback to basic formatting if Intl.DateTimeFormat fails
    return dateObj.toLocaleDateString(locale);
  }
}

/**
 * Format a date with custom format string
 * @param date - The date to format
 * @param locale - The target locale
 * @param format - Custom format string
 * @returns Formatted date string
 */
export function formatDateWithCustomFormat(
  date: Date | string | number,
  locale: string,
  format: string
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    });
    
    return formatter.format(dateObj);
  } catch (error) {
    // Fallback to basic formatting
    return dateObj.toLocaleDateString(locale);
  }
}

/**
 * Format a date range for a specific locale
 * @param startDate - The start date
 * @param endDate - The end date
 * @param locale - The target locale
 * @param options - Formatting options
 * @returns Formatted date range string
 */
export function formatDateRangeForLocale(
  startDate: Date | string | number,
  endDate: Date | string | number,
  locale: string,
  options?: Partial<DateFormatConfig>
): string {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  const config = getDateFormatConfig(locale, options);
  
  try {
    const formatter = new Intl.DateTimeFormat(config.locale, {
      dateStyle: config.format,
      numberingSystem: config.numberingSystem,
      calendar: config.calendar
    });
    
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  } catch (error) {
    // Fallback to basic formatting
    return `${start.toLocaleDateString(locale)} - ${end.toLocaleDateString(locale)}`;
  }
}

/**
 * Format a relative date (e.g., "2 days ago", "next week")
 * @param date - The date to format
 * @param locale - The target locale
 * @returns Relative date string
 */
export function formatRelativeDate(
  date: Date | string | number,
  locale: string
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  try {
    const formatter = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto'
    });
    
    if (Math.abs(diffDays) < 1) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return formatter.format(diffHours, 'hour');
    } else if (Math.abs(diffDays) < 7) {
      return formatter.format(diffDays, 'day');
    } else if (Math.abs(diffDays) < 30) {
      const diffWeeks = Math.ceil(diffDays / 7);
      return formatter.format(diffWeeks, 'week');
    } else if (Math.abs(diffDays) < 365) {
      const diffMonths = Math.ceil(diffDays / 30);
      return formatter.format(diffMonths, 'month');
    } else {
      const diffYears = Math.ceil(diffDays / 365);
      return formatter.format(diffYears, 'year');
    }
  } catch (error) {
    // Fallback to basic relative formatting
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === -1) return 'yesterday';
    if (diffDays > 0) return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  }
}

/**
 * Get date format configuration for a locale
 * @param locale - The target locale
 * @param options - Override options
 * @returns Date format configuration
 */
export function getDateFormatConfig(
  locale: string,
  options?: Partial<DateFormatConfig>
): DateFormatConfig {
  const baseConfig = DATE_FORMAT_CONFIGS[locale] || DATE_FORMAT_CONFIGS['en'];
  
  return {
    ...baseConfig,
    ...options
  };
}

/**
 * Get supported date formatting locales
 * @returns Array of supported locale codes
 */
export function getSupportedDateLocales(): string[] {
  return Object.keys(DATE_FORMAT_CONFIGS);
}

/**
 * Check if a locale supports date formatting
 * @param locale - The locale to check
 * @returns True if the locale is supported
 */
export function isDateLocaleSupported(locale: string): boolean {
  return locale in DATE_FORMAT_CONFIGS;
}

/**
 * Get date formatting information for a locale
 * @param locale - The target locale
 * @returns Date formatting information
 */
export function getDateFormatInfo(locale: string): {
  locale: string;
  format: string;
  numberingSystem: string;
  calendar: string;
  supported: boolean;
} {
  const config = getDateFormatConfig(locale);
  
  return {
    locale: config.locale,
    format: config.format,
    numberingSystem: config.numberingSystem || 'latn',
    calendar: config.calendar || 'gregory',
    supported: isDateLocaleSupported(locale)
  };
}
