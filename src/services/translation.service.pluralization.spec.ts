import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from './translation.service';
import { TranslationConfig } from '../interfaces/translation-config.interface';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');
jest.mock('path');

describe('TranslationService - Pluralization', () => {
  let service: TranslationService;
  let mockConfig: TranslationConfig;

  beforeEach(() => {
    mockConfig = {
      serviceName: 'test-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'ar', 'ar-MA', 'he', 'fa'],
      translationsPath: 'src/translations',
      debug: false,
      fallbackStrategy: 'default',
      cache: { enabled: true, ttl: 3600 },
      statistics: { enabled: true, trackKeyUsage: true, trackLocaleUsage: true },
      pluralization: { enabled: true, formatNumbers: true, useDirectionalMarkers: false, validatePluralRules: true }
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Arabic Pluralization - Eastern Arabic (Indic) Numerals', () => {
    beforeEach(() => {
      const mockTranslations = {
        ar: {
          'FILES_COUNT': {
            '0': 'لا توجد ملفات',
            '1': '١ ملف',
            '2': '٢ ملف',
            'few': '${count} ملفات',
            'many': '${count} ملف',
            'other': '${count} ملف'
          },
          'UPLOAD_PROGRESS': {
            '0': 'لم يتم رفع أي ملف',
            '1': 'تم رفع ملف واحد',
            '2': 'تم رفع ملفين',
            'few': 'تم رفع ${count} ملفات',
            'many': 'تم رفع ${count} ملف',
            'other': 'تم رفع ${count} ملف'
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['ar.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.ar));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/ar.json');
      (path.basename as jest.Mock).mockReturnValue('ar');

      service = new TranslationService(mockConfig);
    });

    it('should handle Arabic pluralization with Eastern Arabic numerals', () => {
      const testCases = [
        { count: 0, expected: 'لا توجد ملفات' },
        { count: 1, expected: '١ ملف' },
        { count: 2, expected: '٢ ملف' },
        { count: 3, expected: '٣ ملفات' },
        { count: 10, expected: '١٠ ملفات' },
        { count: 11, expected: '١١ ملف' },
        { count: 99, expected: '٩٩ ملف' },
        { count: 100, expected: '١٠٠ ملف' }
      ];

      testCases.forEach(({ count, expected }) => {
        const result = service.translatePlural('FILES_COUNT', count, 'ar');
        expect(result).toBe(expected);
      });
    });

    it('should handle Arabic pluralization with parameters', () => {
      const result = service.translatePlural('UPLOAD_PROGRESS', 5, 'ar');
      expect(result).toBe('تم رفع ٥ ملفات');
    });

    it('should return detailed pluralization result', () => {
      const result = service.translatePluralWithResult('FILES_COUNT', 3, 'ar');
      
      expect(result.text).toBe('٣ ملفات');
      expect(result.category).toBe('few');
      expect(result.rtl?.isRTL).toBe(true);
      expect(result.rtl?.direction).toBe('rtl');
      expect(result.numberFormat?.numberingSystem).toBe('arab');
      expect(result.numberFormat?.formattedNumber).toBe('٣');
    });
  });

  describe('Arabic Pluralization - Western Arabic (European) Numerals', () => {
    beforeEach(() => {
      const mockTranslations = {
        'ar-MA': {
          'FILES_COUNT': {
            '0': 'لا توجد ملفات',
            '1': '1 ملف',
            '2': '2 ملف',
            'few': '${count} ملفات',
            'many': '${count} ملف',
            'other': '${count} ملف'
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['ar-MA.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations['ar-MA']));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/ar-MA.json');
      (path.basename as jest.Mock).mockReturnValue('ar-MA');

      service = new TranslationService(mockConfig);
    });

    it('should handle Arabic pluralization with Western Arabic numerals (Morocco)', () => {
      const testCases = [
        { count: 0, expected: 'لا توجد ملفات' },
        { count: 1, expected: '1 ملف' },
        { count: 2, expected: '2 ملف' },
        { count: 3, expected: '3 ملفات' },
        { count: 10, expected: '10 ملفات' },
        { count: 11, expected: '11 ملف' },
        { count: 99, expected: '99 ملف' },
        { count: 100, expected: '100 ملف' }
      ];

      testCases.forEach(({ count, expected }) => {
        const result = service.translatePlural('FILES_COUNT', count, 'ar-MA');
        expect(result).toBe(expected);
      });
    });

    it('should return detailed result with Western Arabic numerals', () => {
      const result = service.translatePluralWithResult('FILES_COUNT', 5, 'ar-MA');
      
      expect(result.text).toBe('5 ملفات');
      expect(result.category).toBe('few');
      expect(result.rtl?.isRTL).toBe(true);
      expect(result.rtl?.direction).toBe('rtl');
      expect(result.numberFormat?.numberingSystem).toBe('latn');
      expect(result.numberFormat?.formattedNumber).toBe('5');
    });
  });

  describe('Hebrew Pluralization', () => {
    beforeEach(() => {
      const mockTranslations = {
        he: {
          'FILES_COUNT': {
            'one': 'קובץ אחד',
            'two': 'שני קבצים',
            'few': '${count} קבצים',
            'many': '${count} קבצים',
            'other': '${count} קבצים'
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['he.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.he));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/he.json');
      (path.basename as jest.Mock).mockReturnValue('he');

      service = new TranslationService(mockConfig);
    });

    it('should handle Hebrew pluralization', () => {
      const testCases = [
        { count: 1, expected: 'קובץ אחד' },
        { count: 2, expected: 'שני קבצים' },
        { count: 3, expected: 'ג קבצים' },
        { count: 10, expected: 'י קבצים' },
        { count: 11, expected: 'יא קבצים' }
      ];

      testCases.forEach(({ count, expected }) => {
        const result = service.translatePlural('FILES_COUNT', count, 'he');
        expect(result).toBe(expected);
      });
    });

    it('should return detailed Hebrew pluralization result', () => {
      const result = service.translatePluralWithResult('FILES_COUNT', 3, 'he');
      
      expect(result.text).toBe('ג קבצים');
      expect(result.category).toBe('few');
      expect(result.rtl?.isRTL).toBe(true);
      expect(result.rtl?.direction).toBe('rtl');
      expect(result.numberFormat?.numberingSystem).toBe('hebr');
      expect(result.numberFormat?.formattedNumber).toBe('ג');
    });
  });

  describe('Persian Pluralization', () => {
    beforeEach(() => {
      const mockTranslations = {
        fa: {
          'FILES_COUNT': {
            'one': 'یک فایل',
            'other': '${count} فایل'
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['fa.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.fa));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/fa.json');
      (path.basename as jest.Mock).mockReturnValue('fa');

      service = new TranslationService(mockConfig);
    });

    it('should handle Persian pluralization', () => {
      const testCases = [
        { count: 1, expected: 'یک فایل' },
        { count: 2, expected: '٢ فایل' },
        { count: 5, expected: '٥ فایل' },
        { count: 10, expected: '١٠ فایل' }
      ];

      testCases.forEach(({ count, expected }) => {
        const result = service.translatePlural('FILES_COUNT', count, 'fa');
        expect(result).toBe(expected);
      });
    });
  });

  describe('English Pluralization (Fallback)', () => {
    beforeEach(() => {
      const mockTranslations = {
        en: {
          'FILES_COUNT': {
            'one': '1 file',
            'other': '${count} files'
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);
    });

    it('should handle English pluralization', () => {
      const testCases = [
        { count: 1, expected: '1 file' },
        { count: 2, expected: '2 files' },
        { count: 5, expected: '5 files' },
        { count: 0, expected: '0 files' }
      ];

      testCases.forEach(({ count, expected }) => {
        const result = service.translatePlural('FILES_COUNT', count, 'en');
        expect(result).toBe(expected);
      });
    });
  });

  describe('Pluralization Utilities', () => {
    beforeEach(() => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      service = new TranslationService(mockConfig);
    });

    it('should check if key has plural rules', () => {
      // Mock translations with plural rules
      (service as any).translations = {
        en: {
          'SIMPLE_KEY': 'Simple text',
          'PLURAL_KEY': {
            'one': '1 item',
            'other': '${count} items'
          }
        }
      };

      expect(service.hasPluralRules('SIMPLE_KEY', 'en')).toBe(false);
      expect(service.hasPluralRules('PLURAL_KEY', 'en')).toBe(true);
    });

    it('should get plural categories for locale', () => {
      const categories = service.getPluralCategories('ar');
      expect(categories).toContain('zero');
      expect(categories).toContain('one');
      expect(categories).toContain('two');
      expect(categories).toContain('few');
      expect(categories).toContain('many');
      expect(categories).toContain('other');
    });

    it('should get supported RTL locales', () => {
      const rtlLocales = service.getSupportedRTLLocales();
      expect(rtlLocales).toContain('ar');
      expect(rtlLocales).toContain('ar-MA');
      expect(rtlLocales).toContain('he');
      expect(rtlLocales).toContain('fa');
      expect(rtlLocales).toContain('ur');
    });

    it('should check if locale has complex plural rules', () => {
      expect(service.hasComplexPluralRules('ar')).toBe(true); // 6 categories
      expect(service.hasComplexPluralRules('en')).toBe(false); // 2 categories
    });

    it('should format numbers for locale', () => {
      expect(service.formatNumberForLocale(123, 'ar')).toBe('١٢٣');
      expect(service.formatNumberForLocale(123, 'ar-MA')).toBe('123');
      expect(service.formatNumberForLocale(123, 'he')).toBe('קכג');
      expect(service.formatNumberForLocale(123, 'en')).toBe('123');
    });
  });

  describe('Pluralization Configuration', () => {
    it('should disable pluralization when configured', () => {
      const configWithoutPluralization = {
        ...mockConfig,
        pluralization: { enabled: false }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      service = new TranslationService(configWithoutPluralization);

      const result = service.translatePlural('FILES_COUNT', 5, 'en');
      expect(result).toBe('FILES_COUNT (5)');
    });

    it('should handle invalid plural rule structure', () => {
      const mockTranslations = {
        en: {
          'INVALID_PLURAL': {
            'one': '1 item'
            // Missing 'other' category
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);

      const result = service.translatePlural('INVALID_PLURAL', 5, 'en');
      expect(result).toBe('INVALID_PLURAL (5)');
    });
  });

  describe('Caching with Pluralization', () => {
    beforeEach(() => {
      const mockTranslations = {
        en: {
          'FILES_COUNT': {
            'one': '1 file',
            'other': '${count} files'
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);
    });

    it('should cache pluralization results', () => {
      // First call - should cache
      const result1 = service.translatePlural('FILES_COUNT', 5, 'en');
      expect(result1).toBe('5 files');

      // Second call - should use cache
      const result2 = service.translatePlural('FILES_COUNT', 5, 'en');
      expect(result2).toBe('5 files');

      const stats = service.getStats();
      expect(stats.cacheHits).toBe(1);
    });
  });

  describe('Custom Plural Rules', () => {
    it('should handle custom plural rules', () => {
      const configWithCustomRules = {
        ...mockConfig,
        pluralization: {
          ...mockConfig.pluralization,
          customRules: {
            'ar': (count: number) => {
              // Custom simplified Arabic rule
              if (count === 0) return 'zero';
              if (count === 1) return 'one';
              return 'other';
            }
          }
        }
      };

      const mockTranslations = {
        ar: {
          'FILES_COUNT': {
            'zero': 'لا توجد ملفات',
            'one': '${count} ملف',
            'other': '${count} ملفات'
          }
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['ar.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.ar));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/ar.json');
      (path.basename as jest.Mock).mockReturnValue('ar');

      service = new TranslationService(configWithCustomRules);

      expect(service.translatePlural('FILES_COUNT', 0, 'ar')).toBe('لا توجد ملفات');
      expect(service.translatePlural('FILES_COUNT', 1, 'ar')).toBe('١ ملف');
      expect(service.translatePlural('FILES_COUNT', 5, 'ar')).toBe('٥ ملفات');
    });
  });
});
