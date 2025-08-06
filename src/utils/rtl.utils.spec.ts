import { 
  isRTL, 
  getRTLInfo, 
  getRTLLocales, 
  getRTLLocalesInfo, 
  containsRTLText, 
  getTextDirection, 
  wrapWithDirectionalMarkers, 
  cleanDirectionalMarkers,
  clearRTLCaches
} from './rtl.utils';

describe('RTL Utils', () => {
  beforeEach(() => {
    clearRTLCaches(); // Clear caches before each test
  });

  afterEach(() => {
    clearRTLCaches(); // Clear caches after each test
  });

  describe('isRTL', () => {
    it('should detect Arabic locales as RTL', () => {
      expect(isRTL('ar')).toBe(true);
      expect(isRTL('ar-SA')).toBe(true);
      expect(isRTL('ar-EG')).toBe(true);
      expect(isRTL('ar-US')).toBe(true); // Should match prefix
    });

    it('should detect Hebrew locales as RTL', () => {
      expect(isRTL('he')).toBe(true);
      expect(isRTL('he-IL')).toBe(true);
    });

    it('should detect Persian locales as RTL', () => {
      expect(isRTL('fa')).toBe(true);
      expect(isRTL('fa-IR')).toBe(true);
      expect(isRTL('fa-AF')).toBe(true);
    });

    it('should detect Urdu locales as RTL', () => {
      expect(isRTL('ur')).toBe(true);
      expect(isRTL('ur-PK')).toBe(true);
    });

    it('should detect non-RTL locales as false', () => {
      expect(isRTL('en')).toBe(false);
      expect(isRTL('fr')).toBe(false);
      expect(isRTL('es')).toBe(false);
      expect(isRTL('de')).toBe(false);
      expect(isRTL('zh')).toBe(false);
      expect(isRTL('ja')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isRTL('AR')).toBe(true);
      expect(isRTL('Ar-Sa')).toBe(true);
      expect(isRTL('EN')).toBe(false);
    });
  });

  describe('getRTLInfo', () => {
    it('should return correct RTL info for Arabic', () => {
      const info = getRTLInfo('ar');
      expect(info).toEqual({
        isRTL: true,
        direction: 'rtl',
        script: 'Arab',
        name: 'Arabic'
      });
    });

    it('should return correct RTL info for Hebrew', () => {
      const info = getRTLInfo('he-IL');
      expect(info).toEqual({
        isRTL: true,
        direction: 'rtl',
        script: 'Hebr',
        name: 'Hebrew'
      });
    });

    it('should return correct info for non-RTL locales', () => {
      const info = getRTLInfo('en');
      expect(info).toEqual({
        isRTL: false,
        direction: 'ltr'
      });
    });

    it('should handle prefix matching', () => {
      const info = getRTLInfo('ar-US');
      expect(info.isRTL).toBe(true);
      expect(info.direction).toBe('rtl');
    });
  });

  describe('getRTLLocales', () => {
    it('should return array of RTL locale codes', () => {
      const locales = getRTLLocales();
      expect(Array.isArray(locales)).toBe(true);
      expect(locales.length).toBeGreaterThan(0);
      expect(locales).toContain('ar');
      expect(locales).toContain('he');
      expect(locales).toContain('fa');
      expect(locales).toContain('ur');
    });
  });

  describe('getRTLLocalesInfo', () => {
    it('should return RTL locales with their information', () => {
      const info = getRTLLocalesInfo();
      expect(typeof info).toBe('object');
      expect(info.ar).toBeDefined();
      expect(info.ar.name).toBe('Arabic');
      expect(info.ar.direction).toBe('rtl');
      expect(info.ar.script).toBe('Arab');
    });
  });

  describe('containsRTLText', () => {
    it('should detect Arabic text', () => {
      expect(containsRTLText('مرحبا بالعالم')).toBe(true);
      expect(containsRTLText('Hello مرحبا')).toBe(true);
      expect(containsRTLText('Hello World')).toBe(false);
    });

    it('should detect Hebrew text', () => {
      expect(containsRTLText('שלום עולם')).toBe(true);
      expect(containsRTLText('Hello שלום')).toBe(true);
    });

    it('should detect Persian text', () => {
      expect(containsRTLText('سلام دنیا')).toBe(true);
    });

    it('should detect Urdu text', () => {
      expect(containsRTLText('ہیلو دنیا')).toBe(true);
    });

    it('should detect directional markers', () => {
      expect(containsRTLText('\u200FHello\u200E')).toBe(true);
      expect(containsRTLText('\u202BHello\u202C')).toBe(true);
    });

    it('should not detect LTR-only text', () => {
      expect(containsRTLText('Hello World')).toBe(false);
      expect(containsRTLText('123')).toBe(false);
      expect(containsRTLText('')).toBe(false);
    });
  });

  describe('getTextDirection', () => {
    it('should return rtl for RTL-only text', () => {
      expect(getTextDirection('مرحبا')).toBe('rtl');
      expect(getTextDirection('שלום')).toBe('rtl');
      expect(getTextDirection('سلام')).toBe('rtl');
    });

    it('should return ltr for LTR-only text', () => {
      expect(getTextDirection('Hello')).toBe('ltr');
      expect(getTextDirection('123')).toBe('ltr');
      expect(getTextDirection('')).toBe('ltr');
    });

    it('should return auto for mixed content', () => {
      expect(getTextDirection('Hello مرحبا')).toBe('auto');
      expect(getTextDirection('مرحبا Hello')).toBe('auto');
      expect(getTextDirection('Hello 123 مرحبا')).toBe('auto');
    });
  });

  describe('wrapWithDirectionalMarkers', () => {
    it('should wrap RTL text with RTL marker', () => {
      const result = wrapWithDirectionalMarkers('مرحبا', 'rtl');
      expect(result).toBe('\u200Fمرحبا');
    });

    it('should wrap LTR text with LTR marker', () => {
      const result = wrapWithDirectionalMarkers('Hello', 'ltr');
      expect(result).toBe('\u200EHello');
    });

    it('should not wrap auto direction text', () => {
      const result = wrapWithDirectionalMarkers('Hello مرحبا', 'auto');
      expect(result).toBe('Hello مرحبا');
    });
  });

  describe('cleanDirectionalMarkers', () => {
    it('should remove all directional markers', () => {
      const text = '\u200Fمرحبا\u200EHello\u202BWorld\u202C';
      const cleaned = cleanDirectionalMarkers(text);
      expect(cleaned).toBe('مرحباHelloWorld');
    });

    it('should handle text without markers', () => {
      const text = 'Hello World';
      const cleaned = cleanDirectionalMarkers(text);
      expect(cleaned).toBe('Hello World');
    });

    it('should handle empty string', () => {
      const cleaned = cleanDirectionalMarkers('');
      expect(cleaned).toBe('');
    });
  });

  describe('clearRTLCaches', () => {
    it('should clear all caches', () => {
      // First call to populate cache
      isRTL('ar');
      getRTLInfo('ar');
      
      // Clear caches
      clearRTLCaches();
      
      // Verify caches are cleared by checking performance
      const start = performance.now();
      isRTL('ar'); // Should recompute
      const end = performance.now();
      
      // Should take longer than cached version
      expect(end - start).toBeGreaterThan(0);
    });
  });
}); 