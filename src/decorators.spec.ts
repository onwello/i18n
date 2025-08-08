import { 
  Locale, 
  LocaleFromJWT,
  LocaleFromCookies,
  LocaleFromHeaders,
  LocaleFromQuery,
  TranslationParams,
  TranslationServiceDecorator 
} from './decorators';

describe('Decorators Utilities', () => {
  describe('Locale', () => {
    it('should be a function', () => {
      expect(typeof Locale).toBe('function');
    });

    it('should be a decorator factory', () => {
      const decorator = Locale(undefined, {} as any);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromJWT', () => {
    it('should be a function', () => {
      expect(typeof LocaleFromJWT).toBe('function');
    });

    it('should be a decorator factory', () => {
      const decorator = LocaleFromJWT(undefined, {} as any);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromCookies', () => {
    it('should be a function', () => {
      expect(typeof LocaleFromCookies).toBe('function');
    });

    it('should be a decorator factory', () => {
      const decorator = LocaleFromCookies(undefined, {} as any);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromHeaders', () => {
    it('should be a function', () => {
      expect(typeof LocaleFromHeaders).toBe('function');
    });

    it('should be a decorator factory', () => {
      const decorator = LocaleFromHeaders(undefined, {} as any);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromQuery', () => {
    it('should be a function', () => {
      expect(typeof LocaleFromQuery).toBe('function');
    });

    it('should be a decorator factory', () => {
      const decorator = LocaleFromQuery(undefined, {} as any);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('TranslationParams', () => {
    it('should be a function', () => {
      expect(typeof TranslationParams).toBe('function');
    });

    it('should be a decorator factory', () => {
      const decorator = TranslationParams(undefined, {} as any);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('TranslationServiceDecorator', () => {
    it('should be a function', () => {
      expect(typeof TranslationServiceDecorator).toBe('function');
    });

    it('should be a decorator factory', () => {
      const decorator = TranslationServiceDecorator(undefined, {} as any);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('Decorator exports', () => {
    it('should export all required decorators', () => {
      expect(Locale).toBeDefined();
      expect(LocaleFromJWT).toBeDefined();
      expect(LocaleFromCookies).toBeDefined();
      expect(LocaleFromHeaders).toBeDefined();
      expect(LocaleFromQuery).toBeDefined();
      expect(TranslationParams).toBeDefined();
      expect(TranslationServiceDecorator).toBeDefined();
    });

    it('should export functions that can be used as decorators', () => {
      const decorators = [
        Locale,
        LocaleFromJWT,
        LocaleFromCookies,
        LocaleFromHeaders,
        LocaleFromQuery,
        TranslationParams,
        TranslationServiceDecorator
      ];

      decorators.forEach(decorator => {
        expect(typeof decorator).toBe('function');
        const result = decorator(undefined, {} as any);
        expect(typeof result).toBe('function');
      });
    });
  });

  describe('Decorator compatibility', () => {
    it('should work with NestJS createParamDecorator pattern', () => {
      // Test that decorators follow the NestJS pattern
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
            query: {},
            cookies: {},
            app: { get: jest.fn() }
          })
        })
      } as any;

      // Test that decorators can be called without throwing
      expect(() => Locale(undefined, mockExecutionContext)).not.toThrow();
      expect(() => LocaleFromJWT(undefined, mockExecutionContext)).not.toThrow();
      expect(() => LocaleFromCookies(undefined, mockExecutionContext)).not.toThrow();
      expect(() => LocaleFromHeaders(undefined, mockExecutionContext)).not.toThrow();
      expect(() => LocaleFromQuery(undefined, mockExecutionContext)).not.toThrow();
      expect(() => TranslationParams(undefined, mockExecutionContext)).not.toThrow();
      expect(() => TranslationServiceDecorator(undefined, mockExecutionContext)).not.toThrow();
    });
  });
});
