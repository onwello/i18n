import {
  formatDateForLocale,
  formatDateWithCustomFormat,
  formatDateRangeForLocale,
  formatRelativeDate,
  getDateFormatConfig,
  getSupportedDateLocales,
  isDateLocaleSupported,
  getDateFormatInfo,
  DATE_FORMAT_CONFIGS
} from './date-formatting.utils';

describe('Date Formatting Utils', () => {
  const testDate = new Date('2024-01-15T10:30:00Z');

  describe('formatDateForLocale', () => {
    it('should format date for English locale', () => {
      const result = formatDateForLocale(testDate, 'en');
      expect(result).toMatch(/Jan(uary)? 15,? 2024/);
    });

    it('should format date for Arabic locale with Arabic numerals', () => {
      const result = formatDateForLocale(testDate, 'ar');
      expect(result).toMatch(/[٠-٩]/); // Should contain Arabic numerals
    });

    it('should format date for Hebrew locale with Hebrew numerals', () => {
      const result = formatDateForLocale(testDate, 'he');
      expect(result).toMatch(/[א-ת]/); // Should contain Hebrew characters
    });

    it('should format date for French locale', () => {
      const result = formatDateForLocale(testDate, 'fr');
      expect(result).toMatch(/15/);
    });

    it('should handle string date input', () => {
      const result = formatDateForLocale('2024-01-15', 'en');
      expect(result).toMatch(/Jan(uary)? 15,? 2024/);
    });

    it('should handle number date input', () => {
      const result = formatDateForLocale(testDate.getTime(), 'en');
      expect(result).toMatch(/Jan(uary)? 15,? 2024/);
    });

    it('should use custom options when provided', () => {
      const result = formatDateForLocale(testDate, 'en', { format: 'short' });
      expect(result).toMatch(/1\/15\/24/);
    });

    it('should fallback to basic formatting on error', () => {
      const result = formatDateForLocale(testDate, 'invalid-locale');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateWithCustomFormat', () => {
    it('should format date with custom format', () => {
      const result = formatDateWithCustomFormat(testDate, 'en', 'custom');
      expect(result).toMatch(/January 15, 2024/);
    });

    it('should handle invalid locale gracefully', () => {
      const result = formatDateWithCustomFormat(testDate, 'invalid-locale', 'custom');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateRangeForLocale', () => {
    const startDate = new Date('2024-01-15T10:30:00Z');
    const endDate = new Date('2024-01-20T15:45:00Z');

    it('should format date range for English locale', () => {
      const result = formatDateRangeForLocale(startDate, endDate, 'en');
      expect(result).toMatch(/Jan(uary)? 15,? 2024.*Jan(uary)? 20,? 2024/);
    });

    it('should format date range for Arabic locale', () => {
      const result = formatDateRangeForLocale(startDate, endDate, 'ar');
      expect(result).toMatch(/[٠-٩]/); // Should contain Arabic numerals
    });

    it('should handle string date inputs', () => {
      const result = formatDateRangeForLocale('2024-01-15', '2024-01-20', 'en');
      expect(result).toMatch(/Jan(uary)? 15,? 2024.*Jan(uary)? 20,? 2024/);
    });

    it('should use custom options when provided', () => {
      const result = formatDateRangeForLocale(startDate, endDate, 'en', { format: 'short' });
      expect(result).toMatch(/1\/15\/24.*1\/20\/24/);
    });
  });

  describe('formatRelativeDate', () => {
    it('should format relative date for today', () => {
      const today = new Date();
      const result = formatRelativeDate(today, 'en');
      expect(result).toMatch(/today|now|this hour/);
    });

    it('should format relative date for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatRelativeDate(yesterday, 'en');
      expect(result).toMatch(/yesterday/);
    });

    it('should format relative date for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = formatRelativeDate(tomorrow, 'en');
      expect(result).toMatch(/tomorrow/);
    });

    it('should format relative date for future days', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const result = formatRelativeDate(futureDate, 'en');
      expect(result).toMatch(/in.*days/);
    });

    it('should format relative date for past days', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      const result = formatRelativeDate(pastDate, 'en');
      expect(result).toMatch(/days ago/);
    });

    it('should handle invalid locale gracefully', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const result = formatRelativeDate(futureDate, 'invalid-locale');
      expect(result).toMatch(/in.*days/);
    });
  });

  describe('getDateFormatConfig', () => {
    it('should return config for supported locale', () => {
      const result = getDateFormatConfig('en');
      expect(result).toEqual({
        locale: 'en',
        format: 'medium'
      });
    });

    it('should return config for Arabic locale', () => {
      const result = getDateFormatConfig('ar');
      expect(result).toEqual({
        locale: 'ar',
        format: 'medium',
        numberingSystem: 'arab',
        calendar: 'gregory'
      });
    });

    it('should return config for Hebrew locale', () => {
      const result = getDateFormatConfig('he');
      expect(result).toEqual({
        locale: 'he',
        format: 'medium',
        numberingSystem: 'hebr',
        calendar: 'gregory'
      });
    });

    it('should fallback to English for unsupported locale', () => {
      const result = getDateFormatConfig('invalid-locale');
      expect(result).toEqual({
        locale: 'en',
        format: 'medium'
      });
    });

    it('should merge custom options', () => {
      const result = getDateFormatConfig('en', { format: 'short' });
      expect(result).toEqual({
        locale: 'en',
        format: 'short'
      });
    });
  });

  describe('getSupportedDateLocales', () => {
    it('should return array of supported locales', () => {
      const result = getSupportedDateLocales();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('en');
      expect(result).toContain('ar');
      expect(result).toContain('he');
      expect(result).toContain('fr');
    });

    it('should include all configured locales', () => {
      const result = getSupportedDateLocales();
      const expectedLocales = Object.keys(DATE_FORMAT_CONFIGS);
      expect(result).toEqual(expectedLocales);
    });
  });

  describe('isDateLocaleSupported', () => {
    it('should return true for supported locales', () => {
      expect(isDateLocaleSupported('en')).toBe(true);
      expect(isDateLocaleSupported('ar')).toBe(true);
      expect(isDateLocaleSupported('he')).toBe(true);
      expect(isDateLocaleSupported('fr')).toBe(true);
    });

    it('should return false for unsupported locales', () => {
      expect(isDateLocaleSupported('invalid-locale')).toBe(false);
      expect(isDateLocaleSupported('xyz')).toBe(false);
    });
  });

  describe('getDateFormatInfo', () => {
    it('should return format info for English locale', () => {
      const result = getDateFormatInfo('en');
      expect(result).toEqual({
        locale: 'en',
        format: 'medium',
        numberingSystem: 'latn',
        calendar: 'gregory',
        supported: true
      });
    });

    it('should return format info for Arabic locale', () => {
      const result = getDateFormatInfo('ar');
      expect(result).toEqual({
        locale: 'ar',
        format: 'medium',
        numberingSystem: 'arab',
        calendar: 'gregory',
        supported: true
      });
    });

    it('should return format info for Hebrew locale', () => {
      const result = getDateFormatInfo('he');
      expect(result).toEqual({
        locale: 'he',
        format: 'medium',
        numberingSystem: 'hebr',
        calendar: 'gregory',
        supported: true
      });
    });

    it('should return format info for unsupported locale', () => {
      const result = getDateFormatInfo('invalid-locale');
      expect(result).toEqual({
        locale: 'en',
        format: 'medium',
        numberingSystem: 'latn',
        calendar: 'gregory',
        supported: false
      });
    });
  });

  describe('DATE_FORMAT_CONFIGS', () => {
    it('should contain configurations for major locales', () => {
      expect(DATE_FORMAT_CONFIGS).toHaveProperty('en');
      expect(DATE_FORMAT_CONFIGS).toHaveProperty('ar');
      expect(DATE_FORMAT_CONFIGS).toHaveProperty('he');
      expect(DATE_FORMAT_CONFIGS).toHaveProperty('fr');
      expect(DATE_FORMAT_CONFIGS).toHaveProperty('es');
      expect(DATE_FORMAT_CONFIGS).toHaveProperty('de');
    });

    it('should have correct structure for each locale', () => {
      Object.values(DATE_FORMAT_CONFIGS).forEach(config => {
        expect(config).toHaveProperty('locale');
        expect(config).toHaveProperty('format');
        expect(typeof config.locale).toBe('string');
        expect(['short', 'medium', 'long', 'full', 'custom']).toContain(config.format);
      });
    });

    it('should have Arabic numerals for Arabic locales', () => {
      expect(DATE_FORMAT_CONFIGS['ar'].numberingSystem).toBe('arab');
      expect(DATE_FORMAT_CONFIGS['ar-SA'].numberingSystem).toBe('arab');
    });

    it('should have Latin numerals for North African Arabic', () => {
      expect(DATE_FORMAT_CONFIGS['ar-MA'].numberingSystem).toBe('latn');
    });

    it('should have Hebrew numerals for Hebrew locales', () => {
      expect(DATE_FORMAT_CONFIGS['he'].numberingSystem).toBe('hebr');
      expect(DATE_FORMAT_CONFIGS['he-IL'].numberingSystem).toBe('hebr');
    });

    it('should have Persian calendar for Persian locales', () => {
      expect(DATE_FORMAT_CONFIGS['fa'].calendar).toBe('persian');
      expect(DATE_FORMAT_CONFIGS['fa-IR'].calendar).toBe('persian');
    });
  });
});
