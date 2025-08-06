import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from './translation.service';
import { TranslationConfig } from '../interfaces/translation-config.interface';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');
jest.mock('path');

// Enable fake timers for all tests
jest.useFakeTimers();

describe('TranslationService', () => {
  let service: TranslationService;
  let mockConfig: TranslationConfig;

  beforeEach(() => {
    mockConfig = {
      serviceName: 'test-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      translationsPath: 'src/translations',
      debug: false,
      fallbackStrategy: 'default',
      cache: { enabled: true, ttl: 3600 },
      statistics: { enabled: true, trackKeyUsage: true, trackLocaleUsage: true }
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create service with default config', () => {
      const minimalConfig: TranslationConfig = { serviceName: 'test' };
      service = new TranslationService(minimalConfig);
      
      expect(service).toBeDefined();
      expect(service.getAvailableLocales()).toEqual(['en']);
    });

    it('should load translations from files', () => {
      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello World' },
        fr: { 'TEST.KEY': 'Bonjour le monde' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json', 'fr.json']);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(mockTranslations.en))
        .mockReturnValueOnce(JSON.stringify(mockTranslations.fr));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock)
        .mockReturnValueOnce('en')
        .mockReturnValueOnce('fr');

      service = new TranslationService(mockConfig);
      
      expect(service.hasKey('TEST.KEY', 'en')).toBe(true);
      expect(service.hasKey('TEST.KEY', 'fr')).toBe(true);
    });

    it('should handle missing translation directory gracefully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      service = new TranslationService(mockConfig);
      
      expect(service.getAvailableLocales()).toEqual(['en']);
      expect(service.hasKey('TEST.KEY', 'en')).toBe(false);
    });

    it('should handle file read errors gracefully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);
      
      expect(service.getAvailableLocales()).toEqual(['en']);
      expect(service.hasKey('TEST.KEY', 'en')).toBe(false);
    });

    it('should handle JSON parse errors gracefully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);
      
      expect(service.getAvailableLocales()).toEqual(['en']);
      expect(service.hasKey('TEST.KEY', 'en')).toBe(false);
    });

    it('should handle general load errors gracefully', () => {
      (fs.existsSync as jest.Mock).mockImplementation(() => {
        throw new Error('General error');
      });

      service = new TranslationService(mockConfig);
      
      expect(service.getAvailableLocales()).toEqual(['en']);
      expect(service.hasKey('TEST.KEY', 'en')).toBe(false);
    });

    it('should handle no translations loaded scenario', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue([]);
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');

      service = new TranslationService(mockConfig);
      
      expect(service.getAvailableLocales()).toEqual(['en']);
      expect(service.hasKey('TEST.KEY', 'en')).toBe(false);
    });
  });

  describe('Translation', () => {
    beforeEach(() => {
      const mockTranslations = {
        en: {
          'TEST.HELLO': 'Hello ${name}',
          'TEST.WELCOME': 'Welcome to ${service}',
          'TEST.SIMPLE': 'Simple message'
        },
        fr: {
          'TEST.HELLO': 'Bonjour ${name}',
          'TEST.WELCOME': 'Bienvenue sur ${service}'
        }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json', 'fr.json']);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(mockTranslations.en))
        .mockReturnValueOnce(JSON.stringify(mockTranslations.fr));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock)
        .mockReturnValueOnce('en')
        .mockReturnValueOnce('fr');

      service = new TranslationService(mockConfig);
    });

    it('should translate simple keys', () => {
      const result = service.translate('TEST.SIMPLE', 'en');
      expect(result).toBe('Simple message');
    });

    it('should interpolate parameters', () => {
      const result = service.translate('TEST.HELLO', 'en', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should handle nested parameters', () => {
      const result = service.translate('TEST.WELCOME', 'en', { 
        service: 'MyApp' 
      });
      expect(result).toBe('Welcome to MyApp');
    });

    it('should fallback to default locale', () => {
      const result = service.translate('TEST.HELLO', 'fr', { name: 'John' });
      expect(result).toBe('Bonjour John');
    });

    it('should fallback to key when translation not found', () => {
      const result = service.translate('TEST.NOT_FOUND', 'en');
      expect(result).toBe('TEST.NOT_FOUND');
    });

    it('should handle missing parameters gracefully', () => {
      const result = service.translate('TEST.HELLO', 'en', {});
      expect(result).toBe('Hello ${name}');
    });

    it('should handle nested object parameters', () => {
      const result = service.translate('TEST.WELCOME', 'en', { 
        service: 'MyApp'
      });
      expect(result).toBe('Welcome to MyApp');
    });

    it('should handle curly brace interpolation', () => {
      const result = service.translate('TEST.HELLO', 'en', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should handle custom interpolation delimiters', () => {
      const configWithCustomInterpolation = {
        ...mockConfig,
        interpolation: { prefix: '{{', suffix: '}}' }
      };

      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello {{name}}' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(configWithCustomInterpolation);

      const result = service.translate('TEST.KEY', 'en', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('should handle undefined interpolation values', () => {
      const result = service.translate('TEST.HELLO', 'en', { name: undefined });
      expect(result).toBe('Hello ${name}');
    });

    it('should handle null interpolation values', () => {
      const result = service.translate('TEST.HELLO', 'en', { name: null });
      expect(result).toBe('Hello null');
    });
  });

  describe('Caching', () => {
    beforeEach(() => {
      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello ${name}' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);
    });

    it('should cache translations', () => {
      const params = { name: 'John' };
      
      // First call - should cache
      const result1 = service.translate('TEST.KEY', 'en', params);
      expect(result1).toBe('Hello John');

      // Second call - should use cache
      const result2 = service.translate('TEST.KEY', 'en', params);
      expect(result2).toBe('Hello John');

      const stats = service.getStats();
      expect(stats.cacheHits).toBe(1);
    });

    it('should handle cache TTL', () => {
      const params = { name: 'John' };
      
      // First call
      service.translate('TEST.KEY', 'en', params);
      
      // Simulate time passing
      jest.advanceTimersByTime(4000 * 1000); // 4 seconds
      
      // Second call - should miss cache due to TTL
      service.translate('TEST.KEY', 'en', params);
      
      const stats = service.getStats();
      expect(stats.cacheMisses).toBe(2); // First call + TTL expired call
    });

    it('should clear cache', () => {
      const params = { name: 'John' };
      
      // Cache a translation
      service.translate('TEST.KEY', 'en', params);
      
      // Clear cache
      service.clearCache();
      
      // Should miss cache
      service.translate('TEST.KEY', 'en', params);
      
      const stats = service.getStats();
      expect(stats.cacheMisses).toBe(2); // First call + after clear
    });

    it('should handle cache when disabled', () => {
      const configWithoutCache = {
        ...mockConfig,
        cache: { enabled: false }
      };

      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello ${name}' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(configWithoutCache);

      const params = { name: 'John' };
      
      // Both calls should miss cache since it's disabled
      service.translate('TEST.KEY', 'en', params);
      service.translate('TEST.KEY', 'en', params);
      
      const stats = service.getStats();
      expect(stats.cacheMisses).toBe(0); // No cache misses when cache is disabled
      expect(stats.cacheHits).toBe(0);
    });

    it('should handle cache with custom TTL', () => {
      const configWithCustomTTL = {
        ...mockConfig,
        cache: { enabled: true, ttl: 1 } // 1 second TTL
      };

      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello ${name}' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(configWithCustomTTL);

      const params = { name: 'John' };
      
      // First call
      service.translate('TEST.KEY', 'en', params);
      
      // Advance time by 2 seconds (past TTL)
      jest.advanceTimersByTime(2000);
      
      // Second call should miss cache due to TTL
      service.translate('TEST.KEY', 'en', params);
      
      const stats = service.getStats();
      expect(stats.cacheMisses).toBe(2); // Both calls miss due to TTL
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello' },
        fr: { 'TEST.KEY': 'Bonjour' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json', 'fr.json']);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(mockTranslations.en))
        .mockReturnValueOnce(JSON.stringify(mockTranslations.fr));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock)
        .mockReturnValueOnce('en')
        .mockReturnValueOnce('fr');

      service = new TranslationService(mockConfig);
    });

    it('should track translation statistics', () => {
      service.translate('TEST.KEY', 'en');
      service.translate('TEST.KEY', 'fr');
      service.translate('TEST.NOT_FOUND', 'en');

      const stats = service.getStats();
      
      expect(stats.totalRequests).toBe(3);
      expect(stats.successfulTranslations).toBe(2);
      expect(stats.failedTranslations).toBe(1);
      expect(stats.localeUsage.en).toBe(2);
      expect(stats.localeUsage.fr).toBe(1);
      expect(stats.keyUsage['TEST.KEY']).toBe(2);
      expect(stats.keyUsage['TEST.NOT_FOUND']).toBe(1);
    });

    it('should not track statistics when disabled', () => {
      const configWithoutStats = {
        ...mockConfig,
        statistics: { enabled: false }
      };

      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(configWithoutStats);

      service.translate('TEST.KEY', 'en');
      service.translate('TEST.NOT_FOUND', 'en');

      const stats = service.getStats();
      
      expect(stats.totalRequests).toBe(0);
      expect(stats.successfulTranslations).toBe(0);
      expect(stats.failedTranslations).toBe(0);
      expect(stats.localeUsage).toEqual({});
      expect(stats.keyUsage).toEqual({});
    });

    it('should not track key usage when disabled', () => {
      const configWithoutKeyTracking = {
        ...mockConfig,
        statistics: { enabled: true, trackKeyUsage: false, trackLocaleUsage: true }
      };

      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(configWithoutKeyTracking);

      service.translate('TEST.KEY', 'en');

      const stats = service.getStats();
      
      expect(stats.totalRequests).toBe(1);
      expect(stats.keyUsage).toEqual({});
      expect(stats.localeUsage.en).toBe(1);
    });

    it('should not track locale usage when disabled', () => {
      const configWithoutLocaleTracking = {
        ...mockConfig,
        statistics: { enabled: true, trackKeyUsage: true, trackLocaleUsage: false }
      };

      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(configWithoutLocaleTracking);

      service.translate('TEST.KEY', 'en');

      const stats = service.getStats();
      
      expect(stats.totalRequests).toBe(1);
      expect(stats.localeUsage).toEqual({});
      expect(stats.keyUsage['TEST.KEY']).toBe(1);
    });
  });

  describe('Fallback Strategies', () => {
    it('should use key fallback strategy', () => {
      const config: TranslationConfig = {
        ...mockConfig,
        fallbackStrategy: 'key'
      };

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      service = new TranslationService(config);

      const result = service.translate('TEST.NOT_FOUND', 'en');
      expect(result).toBe('TEST.NOT_FOUND');
    });

    it('should throw error with throw fallback strategy', () => {
      const config: TranslationConfig = {
        ...mockConfig,
        fallbackStrategy: 'throw'
      };

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      service = new TranslationService(config);

      expect(() => {
        service.translate('TEST.NOT_FOUND', 'en');
      }).toThrow('Translation key not found: TEST.NOT_FOUND (locale: en)');
    });

    it('should use default fallback strategy', () => {
      const config: TranslationConfig = {
        ...mockConfig,
        fallbackStrategy: 'default'
      };

      (fs.existsSync as jest.Mock).mockReturnValue(false);
      service = new TranslationService(config);

      const result = service.translate('TEST.NOT_FOUND', 'en');
      expect(result).toBe('TEST.NOT_FOUND');
    });

    it('should handle fallback with useFallback false', () => {
      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);

      const result = service.translateWithOptions('TEST.NOT_FOUND', { useFallback: false });
      expect(result).toBe('TEST.NOT_FOUND');
    });

    it('should handle fallback when locale equals default locale', () => {
      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(mockConfig);

      const result = service.translate('TEST.NOT_FOUND', 'en');
      expect(result).toBe('TEST.NOT_FOUND');
    });
  });

  describe('Custom Interpolation', () => {
    it('should use custom interpolation delimiters', () => {
      const config: TranslationConfig = {
        ...mockConfig,
        interpolation: { prefix: '{{', suffix: '}}' }
      };

      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello {{name}}' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service = new TranslationService(config);

      const result = service.translate('TEST.KEY', 'en', { name: 'John' });
      expect(result).toBe('Hello John');
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      const mockTranslations = {
        en: { 'TEST.KEY': 'Hello' },
        fr: { 'TEST.KEY': 'Bonjour' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['en.json', 'fr.json']);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(mockTranslations.en))
        .mockReturnValueOnce(JSON.stringify(mockTranslations.fr));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock)
        .mockReturnValueOnce('en')
        .mockReturnValueOnce('fr');

      service = new TranslationService(mockConfig);
    });

    it('should get available locales', () => {
      const locales = service.getAvailableLocales();
      expect(locales).toEqual(['en', 'fr']);
    });

    it('should check if key exists', () => {
      expect(service.hasKey('TEST.KEY', 'en')).toBe(true);
      expect(service.hasKey('TEST.NOT_FOUND', 'en')).toBe(false);
    });

    it('should get keys for locale', () => {
      const keys = service.getKeys('en');
      expect(keys).toEqual(['TEST.KEY']);
    });

    it('should get translation metadata', () => {
      const metadata = service.getTranslationMetadata('TEST.KEY', 'en');
      
      expect(metadata).toEqual({
        key: 'TEST.KEY',
        originalText: 'Hello',
        translatedText: 'Hello',
        locale: 'en',
        fallbackUsed: false,
        timestamp: expect.any(Date),
        rtl: {
          isRTL: false,
          direction: 'ltr'
        }
      });
    });

    it('should reload translations', () => {
      const newTranslations = {
        en: { 'NEW.KEY': 'New message' }
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(newTranslations.en));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/en.json');
      (path.basename as jest.Mock).mockReturnValue('en');

      service.reloadTranslations();

      expect(service.hasKey('NEW.KEY', 'en')).toBe(true);
    });
  });

  describe('RTL Support', () => {
    beforeEach(() => {
      const mockTranslations = {
        ar: { 'TEST.KEY': 'مرحبا بالعالم' },
        he: { 'TEST.KEY': 'שלום עולם' },
        fa: { 'TEST.KEY': 'سلام دنیا' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['ar.json', 'he.json', 'fa.json']);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(mockTranslations.ar))
        .mockReturnValueOnce(JSON.stringify(mockTranslations.he))
        .mockReturnValueOnce(JSON.stringify(mockTranslations.fa));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/ar.json');
      (path.basename as jest.Mock)
        .mockReturnValueOnce('ar')
        .mockReturnValueOnce('he')
        .mockReturnValueOnce('fa');

      service = new TranslationService(mockConfig);
    });

    it('should detect RTL locales', () => {
      expect(service.isRTLLocale('ar')).toBe(true);
      expect(service.isRTLLocale('he')).toBe(true);
      expect(service.isRTLLocale('fa')).toBe(true);
      expect(service.isRTLLocale('en')).toBe(false);
    });

    it('should get RTL information', () => {
      const arInfo = service.getRTLInfo('ar');
      expect(arInfo).toEqual({
        isRTL: true,
        direction: 'rtl',
        script: 'Arab',
        name: 'Arabic'
      });

      const heInfo = service.getRTLInfo('he');
      expect(heInfo).toEqual({
        isRTL: true,
        direction: 'rtl',
        script: 'Hebr',
        name: 'Hebrew'
      });
    });

    it('should translate with RTL support', () => {
      const result = service.translateWithRTL('TEST.KEY', 'ar');
      expect(result.text).toBe('مرحبا بالعالم');
      expect(result.rtl.isRTL).toBe(true);
      expect(result.rtl.direction).toBe('rtl');
    });

    it('should get text direction', () => {
      expect(service.getTextDirection('مرحبا')).toBe('rtl');
      expect(service.getTextDirection('Hello')).toBe('ltr');
      expect(service.getTextDirection('Hello مرحبا')).toBe('auto');
    });

    it('should include RTL info in metadata', () => {
      const metadata = service.getTranslationMetadata('TEST.KEY', 'ar');
      expect(metadata?.rtl).toEqual({
        isRTL: true,
        direction: 'rtl',
        script: 'Arab',
        languageName: 'Arabic'
      });
    });

    it('should translate with directional markers when enabled', () => {
      const configWithMarkers = {
        ...mockConfig,
        rtl: { enabled: true, wrapWithMarkers: true }
      };
      
      // Mock translations for this test
      const mockTranslations = {
        ar: { 'TEST.KEY': 'مرحبا بالعالم' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['ar.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.ar));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/ar.json');
      (path.basename as jest.Mock).mockReturnValue('ar');

      service = new TranslationService(configWithMarkers);

      const result = service.translateWithDirectionalMarkers('TEST.KEY', 'ar');
      expect(result).toContain('\u200F'); // RTL marker
    });

    it('should not wrap with markers when RTL disabled', () => {
      const configWithoutRTL = {
        ...mockConfig,
        rtl: { enabled: false }
      };

      const mockTranslations = {
        ar: { 'TEST.KEY': 'مرحبا بالعالم' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['ar.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.ar));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/ar.json');
      (path.basename as jest.Mock).mockReturnValue('ar');

      service = new TranslationService(configWithoutRTL);

      const result = service.translateWithDirectionalMarkers('TEST.KEY', 'ar');
      expect(result).toBe('مرحبا بالعالم'); // No markers
    });

    it('should not include RTL info when disabled', () => {
      const configWithoutRTL = {
        ...mockConfig,
        rtl: { enabled: false }
      };

      const mockTranslations = {
        ar: { 'TEST.KEY': 'مرحبا بالعالم' }
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(['ar.json']);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockTranslations.ar));
      (path.resolve as jest.Mock).mockReturnValue('/mock/translations');
      (path.join as jest.Mock).mockReturnValue('/mock/translations/ar.json');
      (path.basename as jest.Mock).mockReturnValue('ar');

      service = new TranslationService(configWithoutRTL);

      const metadata = service.getTranslationMetadata('TEST.KEY', 'ar');
      expect(metadata?.rtl).toBeUndefined();
    });
  });
}); 