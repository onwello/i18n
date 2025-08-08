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
} from './rtl';

describe('RTL Utilities', () => {
  describe('isRTL', () => {
    it('should return true for RTL locales', () => {
      expect(isRTL('ar')).toBe(true);
      expect(isRTL('he')).toBe(true);
      expect(isRTL('fa')).toBe(true);
      expect(isRTL('ur')).toBe(true);
      expect(isRTL('ar-SA')).toBe(true);
      expect(isRTL('he-IL')).toBe(true);
    });

    it('should return false for LTR locales', () => {
      expect(isRTL('en')).toBe(false);
      expect(isRTL('fr')).toBe(false);
      expect(isRTL('es')).toBe(false);
      expect(isRTL('de')).toBe(false);
      expect(isRTL('en-US')).toBe(false);
      expect(isRTL('fr-FR')).toBe(false);
    });

    it('should handle invalid locales', () => {
      expect(isRTL('invalid')).toBe(false);
      expect(isRTL('')).toBe(false);
      expect(isRTL(null as any)).toBe(false);
      expect(isRTL(undefined as any)).toBe(false);
    });
  });

  describe('getRTLInfo', () => {
    it('should return RTL info for Arabic', () => {
      const info = getRTLInfo('ar');
      expect(info.isRTL).toBe(true);
      expect(info.direction).toBe('rtl');
      expect(info.script).toBe('Arab');
      expect(info.name).toBe('Arabic');
    });

    it('should return RTL info for Hebrew', () => {
      const info = getRTLInfo('he');
      expect(info.isRTL).toBe(true);
      expect(info.direction).toBe('rtl');
      expect(info.script).toBe('Hebr');
      expect(info.name).toBe('Hebrew');
    });

    it('should return LTR info for English', () => {
      const info = getRTLInfo('en');
      expect(info.isRTL).toBe(false);
      expect(info.direction).toBe('ltr');
    });

    it('should handle invalid locales', () => {
      const info = getRTLInfo('invalid');
      expect(info.isRTL).toBe(false);
      expect(info.direction).toBe('ltr');
    });
  });

  describe('getRTLLocales', () => {
    it('should return array of RTL locales', () => {
      const locales = getRTLLocales();
      expect(Array.isArray(locales)).toBe(true);
      expect(locales.length).toBeGreaterThan(0);
      expect(locales).toContain('ar');
      expect(locales).toContain('he');
      expect(locales).toContain('fa');
      expect(locales).toContain('ur');
    });

    it('should not contain LTR locales', () => {
      const locales = getRTLLocales();
      expect(locales).not.toContain('en');
      expect(locales).not.toContain('fr');
      expect(locales).not.toContain('es');
    });
  });

  describe('getRTLLocalesInfo', () => {
    it('should return detailed info for RTL locales', () => {
      const info = getRTLLocalesInfo();
      expect(typeof info).toBe('object');
      expect(Object.keys(info).length).toBeGreaterThan(0);
      
      const arabicInfo = info['ar'];
      expect(arabicInfo).toBeDefined();
      expect(arabicInfo.direction).toBe('rtl');
      expect(arabicInfo.script).toBe('Arab');
      expect(arabicInfo.name).toBe('Arabic');
    });
  });

  describe('containsRTLText', () => {
    it('should detect RTL text', () => {
      expect(containsRTLText('مرحبا')).toBe(true);
      expect(containsRTLText('שלום')).toBe(true);
      expect(containsRTLText('سلام')).toBe(true);
      expect(containsRTLText('السلام عليكم')).toBe(true);
    });

    it('should detect mixed text', () => {
      expect(containsRTLText('Hello مرحبا')).toBe(true);
      expect(containsRTLText('مرحبا Hello')).toBe(true);
      expect(containsRTLText('123 مرحبا')).toBe(true);
    });

    it('should return false for LTR text', () => {
      expect(containsRTLText('Hello')).toBe(false);
      expect(containsRTLText('123')).toBe(false);
      expect(containsRTLText('Hello World')).toBe(false);
    });

    it('should handle empty and null strings', () => {
      expect(containsRTLText('')).toBe(false);
      expect(containsRTLText(null as any)).toBe(false);
      expect(containsRTLText(undefined as any)).toBe(false);
    });
  });

  describe('getTextDirection', () => {
    it('should return rtl for RTL text', () => {
      expect(getTextDirection('مرحبا')).toBe('rtl');
      expect(getTextDirection('שלום')).toBe('rtl');
      expect(getTextDirection('سلام')).toBe('rtl');
    });

    it('should return ltr for LTR text', () => {
      expect(getTextDirection('Hello')).toBe('ltr');
      expect(getTextDirection('123')).toBe('ltr');
      expect(getTextDirection('Hello World')).toBe('ltr');
    });

    it('should return auto for mixed text', () => {
      expect(getTextDirection('Hello مرحبا')).toBe('auto');
      expect(getTextDirection('مرحبا Hello')).toBe('auto');
      expect(getTextDirection('123 مرحبا')).toBe('rtl'); // Numbers alone are not considered LTR
    });

    it('should handle empty and null strings', () => {
      expect(getTextDirection('')).toBe('ltr');
      expect(getTextDirection(null as any)).toBe('ltr');
      expect(getTextDirection(undefined as any)).toBe('ltr');
    });
  });

  describe('wrapWithDirectionalMarkers', () => {
    it('should wrap RTL text with directional markers', () => {
      const result = wrapWithDirectionalMarkers('مرحبا', 'rtl');
      expect(result).toContain('\u200F'); // Right-to-Left Mark
      expect(result).toContain('مرحبا');
    });

    it('should not wrap LTR text', () => {
      const result = wrapWithDirectionalMarkers('Hello', 'ltr');
      expect(result).toContain('\u200E'); // Left-to-Right Mark
      expect(result).toContain('Hello');
    });

    it('should handle empty text', () => {
      const result = wrapWithDirectionalMarkers('', 'rtl');
      expect(result).toBe('');
    });

    it('should handle auto direction', () => {
      const result = wrapWithDirectionalMarkers('مرحبا', 'auto');
      expect(result).toBe('مرحبا');
    });
  });

  describe('cleanDirectionalMarkers', () => {
    it('should remove directional markers', () => {
      const textWithMarkers = '\u200Fمرحبا\u200E';
      const result = cleanDirectionalMarkers(textWithMarkers);
      expect(result).toBe('مرحبا');
    });

    it('should handle text without markers', () => {
      const text = 'مرحبا';
      const result = cleanDirectionalMarkers(text);
      expect(result).toBe('مرحبا');
    });

    it('should handle empty text', () => {
      const result = cleanDirectionalMarkers('');
      expect(result).toBe('');
    });
  });

  describe('clearRTLCaches', () => {
    it('should not throw error', () => {
      expect(() => clearRTLCaches()).not.toThrow();
    });
  });
});
