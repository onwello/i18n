import * as TranslationLibrary from './index';

describe('Translation Library Exports', () => {
  describe('Core Services', () => {
    it('should export TranslationService', () => {
      expect(TranslationLibrary.TranslationService).toBeDefined();
    });
  });

  describe('Exception Utilities', () => {
    it('should export TranslatedExceptions', () => {
      expect(TranslationLibrary.TranslatedExceptions).toBeDefined();
    });

    it('should export T alias', () => {
      expect(TranslationLibrary.T).toBeDefined();
      expect(TranslationLibrary.T).toBe(TranslationLibrary.TranslatedExceptions);
    });

    it('should export Ex alias', () => {
      expect(TranslationLibrary.Ex).toBeDefined();
      expect(TranslationLibrary.Ex).toBe(TranslationLibrary.TranslatedExceptions);
    });
  });

  describe('Module', () => {
    it('should export TranslationModule', () => {
      expect(TranslationLibrary.TranslationModule).toBeDefined();
    });
  });

  describe('Decorators', () => {
    it('should export Locale decorator', () => {
      expect(TranslationLibrary.Locale).toBeDefined();
    });

    it('should export LocaleFromJWT decorator', () => {
      expect(TranslationLibrary.LocaleFromJWT).toBeDefined();
    });

    it('should export LocaleFromCookies decorator', () => {
      expect(TranslationLibrary.LocaleFromCookies).toBeDefined();
    });

    it('should export LocaleFromHeaders decorator', () => {
      expect(TranslationLibrary.LocaleFromHeaders).toBeDefined();
    });

    it('should export LocaleFromQuery decorator', () => {
      expect(TranslationLibrary.LocaleFromQuery).toBeDefined();
    });

    it('should export TranslationServiceDecorator', () => {
      expect(TranslationLibrary.TranslationServiceDecorator).toBeDefined();
    });
  });

  describe('NestJS Types', () => {
    it('should export HttpStatus', () => {
      expect(TranslationLibrary.HttpStatus).toBeDefined();
    });
  });

  describe('RTL Utilities', () => {
    it('should export isRTL', () => {
      expect(TranslationLibrary.isRTL).toBeDefined();
      expect(typeof TranslationLibrary.isRTL).toBe('function');
    });

    it('should export getRTLInfo', () => {
      expect(TranslationLibrary.getRTLInfo).toBeDefined();
      expect(typeof TranslationLibrary.getRTLInfo).toBe('function');
    });

    it('should export getRTLLocales', () => {
      expect(TranslationLibrary.getRTLLocales).toBeDefined();
      expect(typeof TranslationLibrary.getRTLLocales).toBe('function');
    });

    it('should export getRTLLocalesInfo', () => {
      expect(TranslationLibrary.getRTLLocalesInfo).toBeDefined();
      expect(typeof TranslationLibrary.getRTLLocalesInfo).toBe('function');
    });

    it('should export containsRTLText', () => {
      expect(TranslationLibrary.containsRTLText).toBeDefined();
      expect(typeof TranslationLibrary.containsRTLText).toBe('function');
    });

    it('should export getTextDirection', () => {
      expect(TranslationLibrary.getTextDirection).toBeDefined();
      expect(typeof TranslationLibrary.getTextDirection).toBe('function');
    });

    it('should export wrapWithDirectionalMarkers', () => {
      expect(TranslationLibrary.wrapWithDirectionalMarkers).toBeDefined();
      expect(typeof TranslationLibrary.wrapWithDirectionalMarkers).toBe('function');
    });

    it('should export cleanDirectionalMarkers', () => {
      expect(TranslationLibrary.cleanDirectionalMarkers).toBeDefined();
      expect(typeof TranslationLibrary.cleanDirectionalMarkers).toBe('function');
    });
  });

  describe('RTL Functionality', () => {
    it('should detect RTL locales correctly', () => {
      expect(TranslationLibrary.isRTL('ar')).toBe(true);
      expect(TranslationLibrary.isRTL('he')).toBe(true);
      expect(TranslationLibrary.isRTL('en')).toBe(false);
    });

    it('should get RTL information correctly', () => {
      const info = TranslationLibrary.getRTLInfo('ar');
      expect(info.isRTL).toBe(true);
      expect(info.direction).toBe('rtl');
    });

    it('should detect RTL text correctly', () => {
      expect(TranslationLibrary.containsRTLText('مرحبا')).toBe(true);
      expect(TranslationLibrary.containsRTLText('Hello')).toBe(false);
    });

    it('should get text direction correctly', () => {
      expect(TranslationLibrary.getTextDirection('مرحبا')).toBe('rtl');
      expect(TranslationLibrary.getTextDirection('Hello')).toBe('ltr');
      expect(TranslationLibrary.getTextDirection('Hello مرحبا')).toBe('auto');
    });
  });
}); 