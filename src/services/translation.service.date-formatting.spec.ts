import { TranslationService } from './translation.service';
import { TranslationConfig } from '../interfaces/translation-config.interface';

describe('TranslationService - Date Formatting', () => {
  let service: TranslationService;
  const testDate = new Date('2024-01-15T10:30:00Z');

  beforeEach(() => {
    const config: TranslationConfig = {
      serviceName: 'test-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'ar', 'he', 'fr'],
      translationsPath: 'src/translations',
      debug: false
    };
    service = new TranslationService(config);
  });

  describe('formatDateForLocale', () => {
    it('should format date for default locale', () => {
      const result = service.formatDateForLocale(testDate);
      expect(result).toMatch(/Jan(uary)? 15,? 2024/);
    });

    it('should format date for specified locale', () => {
      const result = service.formatDateForLocale(testDate, 'fr');
      expect(result).toMatch(/15/);
    });

    it('should format date for Arabic locale with Arabic numerals', () => {
      const result = service.formatDateForLocale(testDate, 'ar');
      expect(result).toMatch(/[٠-٩]/); // Should contain Arabic numerals
    });

    it('should format date for Hebrew locale with Hebrew numerals', () => {
      const result = service.formatDateForLocale(testDate, 'he');
      expect(result).toMatch(/[א-ת]/); // Should contain Hebrew characters
    });

    it('should handle string date input', () => {
      const result = service.formatDateForLocale('2024-01-15');
      expect(result).toMatch(/Jan(uary)? 15,? 2024/);
    });

    it('should handle number date input', () => {
      const result = service.formatDateForLocale(testDate.getTime());
      expect(result).toMatch(/Jan(uary)? 15,? 2024/);
    });

    it('should use custom options when provided', () => {
      const result = service.formatDateForLocale(testDate, 'en', { format: 'short' });
      expect(result).toMatch(/1\/15\/24/);
    });

    it('should fallback to basic formatting on error', () => {
      const result = service.formatDateForLocale(testDate, 'invalid-locale');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateWithCustomFormat', () => {
    it('should format date with custom format for default locale', () => {
      const result = service.formatDateWithCustomFormat(testDate, 'en', 'custom');
      expect(result).toMatch(/January 15, 2024/);
    });

    it('should format date with custom format for specified locale', () => {
      const result = service.formatDateWithCustomFormat(testDate, 'fr', 'custom');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid locale gracefully', () => {
      const result = service.formatDateWithCustomFormat(testDate, 'invalid-locale', 'custom');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateRangeForLocale', () => {
    const startDate = new Date('2024-01-15T10:30:00Z');
    const endDate = new Date('2024-01-20T15:45:00Z');

    it('should format date range for default locale', () => {
      const result = service.formatDateRangeForLocale(startDate, endDate);
      expect(result).toMatch(/Jan(uary)? 15,? 2024.*Jan(uary)? 20,? 2024/);
    });

    it('should format date range for specified locale', () => {
      const result = service.formatDateRangeForLocale(startDate, endDate, 'fr');
      expect(result).toMatch(/15.*20/);
    });

    it('should format date range for Arabic locale', () => {
      const result = service.formatDateRangeForLocale(startDate, endDate, 'ar');
      expect(result).toMatch(/[٠-٩]/); // Should contain Arabic numerals
    });

    it('should handle string date inputs', () => {
      const result = service.formatDateRangeForLocale('2024-01-15', '2024-01-20');
      expect(result).toMatch(/Jan(uary)? 15,? 2024.*Jan(uary)? 20,? 2024/);
    });

    it('should use custom options when provided', () => {
      const result = service.formatDateRangeForLocale(startDate, endDate, 'en', { format: 'short' });
      expect(result).toMatch(/1\/15\/24.*1\/20\/24/);
    });
  });

  describe('formatRelativeDate', () => {
    it('should format relative date for today', () => {
      const today = new Date();
      const result = service.formatRelativeDate(today);
      expect(result).toMatch(/today|now|this hour/);
    });

    it('should format relative date for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = service.formatRelativeDate(yesterday);
      expect(result).toMatch(/yesterday/);
    });

    it('should format relative date for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = service.formatRelativeDate(tomorrow);
      expect(result).toMatch(/tomorrow/);
    });

    it('should format relative date for future days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const result = service.formatRelativeDate(futureDate);
      expect(result).toMatch(/in.*days/);
    });

    it('should format relative date for past days', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const result = service.formatRelativeDate(pastDate);
      expect(result).toMatch(/days ago/);
    });

    it('should format relative date for specified locale', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const result = service.formatRelativeDate(futureDate, 'fr');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('getDateFormatConfig', () => {
    it('should return config for default locale', () => {
      const result = service.getDateFormatConfig();
      expect(result).toEqual({
        locale: 'en',
        format: 'medium'
      });
    });

    it('should return config for specified locale', () => {
      const result = service.getDateFormatConfig('ar');
      expect(result).toEqual({
        locale: 'ar',
        format: 'medium',
        numberingSystem: 'arab',
        calendar: 'gregory'
      });
    });

    it('should merge custom options', () => {
      const result = service.getDateFormatConfig('en', { format: 'short' });
      expect(result).toEqual({
        locale: 'en',
        format: 'short'
      });
    });
  });

  describe('getSupportedDateLocales', () => {
    it('should return array of supported locales', () => {
      const result = service.getSupportedDateLocales();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('en');
      expect(result).toContain('ar');
      expect(result).toContain('he');
      expect(result).toContain('fr');
    });
  });

  describe('isDateLocaleSupported', () => {
    it('should return true for supported locales', () => {
      expect(service.isDateLocaleSupported('en')).toBe(true);
      expect(service.isDateLocaleSupported('ar')).toBe(true);
      expect(service.isDateLocaleSupported('he')).toBe(true);
      expect(service.isDateLocaleSupported('fr')).toBe(true);
    });

    it('should return false for unsupported locales', () => {
      expect(service.isDateLocaleSupported('invalid-locale')).toBe(false);
      expect(service.isDateLocaleSupported('xyz')).toBe(false);
    });
  });

  describe('getDateFormatInfo', () => {
    it('should return format info for default locale', () => {
      const result = service.getDateFormatInfo();
      expect(result).toEqual({
        locale: 'en',
        format: 'medium',
        numberingSystem: 'latn',
        calendar: 'gregory',
        supported: true
      });
    });

    it('should return format info for specified locale', () => {
      const result = service.getDateFormatInfo('ar');
      expect(result).toEqual({
        locale: 'ar',
        format: 'medium',
        numberingSystem: 'arab',
        calendar: 'gregory',
        supported: true
      });
    });

    it('should return format info for unsupported locale', () => {
      const result = service.getDateFormatInfo('invalid-locale');
      expect(result).toEqual({
        locale: 'en',
        format: 'medium',
        numberingSystem: 'latn',
        calendar: 'gregory',
        supported: false
      });
    });
  });

  describe('Integration with existing features', () => {
    it('should work with RTL locales', () => {
      const result = service.formatDateForLocale(testDate, 'ar');
      expect(result).toMatch(/[٠-٩]/);
      
      const rtlInfo = service.getRTLInfo('ar');
      expect(rtlInfo.isRTL).toBe(true);
    });

    it('should work with pluralization context', () => {
      const result = service.formatDateForLocale(testDate, 'ar');
      expect(result).toBeDefined();
      
      const pluralResult = service.translatePlural('TEST_KEY', 1, 'ar');
      expect(pluralResult).toBeDefined();
    });

    it('should maintain service configuration', () => {
      const result = service.formatDateForLocale(testDate, 'en');
      expect(result).toBeDefined();
      
      // Call a method that updates stats
      service.translate('TEST_KEY', 'en');
      
      const stats = service.getStats();
      expect(stats.totalRequests).toBeGreaterThan(0);
    });
  });
});
