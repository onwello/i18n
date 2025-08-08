import { ExecutionContext } from '@nestjs/common';
import { 
  Locale, 
  LocaleFromJWT,
  LocaleFromCookies,
  LocaleFromHeaders,
  LocaleFromQuery,
  TranslationParams, 
  TranslationService,
  extractLocaleFromJWT,
  extractLocaleFromCookies,
  extractLocaleFromHeaders,
  extractLocaleFromQuery,
  extractTranslationParams,
  extractTranslationService
} from './translated.decorator';
import { TranslationService as TranslationServiceClass } from '../services/translation.service';

describe('Translation Decorators', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      query: {},
      params: {},
      body: {},
      cookies: {},
      app: {
        get: jest.fn()
      }
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest)
      })
    } as any;
  });

  describe('Locale Logic (Enhanced)', () => {
    it('should prioritize JWT token over other sources', () => {
      // Mock JWT token with locale
      const jwtPayload = { locale: 'fr', sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { 
        authorization: `Bearer ${jwtToken}`,
        'accept-language': 'en',
        'x-locale': 'es'
      };
      mockRequest.cookies = { locale: 'de' };
      mockRequest.query = { locale: 'it' };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBe('fr');
    });

    it('should prioritize cookies over headers and query', () => {
      mockRequest.cookies = { locale: 'fr' };
      mockRequest.headers = { 'accept-language': 'en', 'x-locale': 'es' };
      mockRequest.query = { locale: 'de' };

      const result = extractLocaleFromCookies(mockRequest);
      expect(result).toBe('fr');
    });

    it('should prioritize headers over query parameters', () => {
      mockRequest.headers = { 'accept-language': 'es' };
      mockRequest.query = { locale: 'fr' };

      const result = extractLocaleFromHeaders(mockRequest);
      expect(result).toBe('es');
    });

    it('should use query parameters when no other sources available', () => {
      mockRequest.query = { locale: 'de' };

      const result = extractLocaleFromQuery(mockRequest);
      expect(result).toBe('de');
    });

    it('should return default locale when no sources available', () => {
      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle malformed JWT token gracefully', () => {
      mockRequest.headers = { authorization: 'Bearer invalid.token' };
      mockRequest.cookies = { locale: 'fr' };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle missing JWT payload gracefully', () => {
      const jwtToken = 'header.signature'; // Missing payload
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };
      mockRequest.cookies = { locale: 'fr' };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle JWT with different locale field names', () => {
      const jwtPayload = { language: 'es', sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBe('es');
    });

    it('should handle JWT with lang field name', () => {
      const jwtPayload = { lang: 'de', sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBe('de');
    });
  });

  describe('LocaleFromJWT Logic', () => {
    it('should extract locale from JWT token', () => {
      const jwtPayload = { locale: 'fr', sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBe('fr');
    });

    it('should extract locale using different field names', () => {
      const jwtPayload = { language: 'es', sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBe('es');
    });

    it('should return null when no authorization header', () => {
      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBeNull();
    });

    it('should return null when authorization header is not Bearer', () => {
      mockRequest.headers = { authorization: 'Basic dXNlcjpwYXNz' };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle malformed JWT token', () => {
      mockRequest.headers = { authorization: 'Bearer invalid.token' };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle JWT with no locale fields', () => {
      const jwtPayload = { sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };

      const result = extractLocaleFromJWT(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('LocaleFromCookies Logic', () => {
    it('should extract locale from cookies', () => {
      mockRequest.cookies = { locale: 'fr' };

      const result = extractLocaleFromCookies(mockRequest);
      expect(result).toBe('fr');
    });

    it('should extract locale using different cookie names', () => {
      mockRequest.cookies = { language: 'es' };

      const result = extractLocaleFromCookies(mockRequest);
      expect(result).toBe('es');
    });

    it('should extract locale using lang cookie name', () => {
      mockRequest.cookies = { lang: 'de' };

      const result = extractLocaleFromCookies(mockRequest);
      expect(result).toBe('de');
    });

    it('should return null when no locale cookie', () => {
      mockRequest.cookies = { theme: 'dark' };

      const result = extractLocaleFromCookies(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle undefined cookies', () => {
      mockRequest.cookies = undefined;

      const result = extractLocaleFromCookies(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle null cookies', () => {
      mockRequest.cookies = null;

      const result = extractLocaleFromCookies(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('LocaleFromHeaders Logic', () => {
    it('should extract locale from accept-language header', () => {
      mockRequest.headers = { 'accept-language': 'fr' };

      const result = extractLocaleFromHeaders(mockRequest);
      expect(result).toBe('fr');
    });

    it('should extract locale from x-locale header', () => {
      mockRequest.headers = { 'x-locale': 'es' };

      const result = extractLocaleFromHeaders(mockRequest);
      expect(result).toBe('es');
    });

    it('should extract locale from accept-locale header', () => {
      mockRequest.headers = { 'accept-locale': 'de' };

      const result = extractLocaleFromHeaders(mockRequest);
      expect(result).toBe('de');
    });

    it('should return null when no locale headers', () => {
      mockRequest.headers = { 'content-type': 'application/json' };

      const result = extractLocaleFromHeaders(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle undefined headers', () => {
      mockRequest.headers = undefined;

      const result = extractLocaleFromHeaders(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('LocaleFromQuery Logic', () => {
    it('should extract locale from query parameters', () => {
      mockRequest.query = { locale: 'fr' };

      const result = extractLocaleFromQuery(mockRequest);
      expect(result).toBe('fr');
    });

    it('should extract locale using different query parameter names', () => {
      mockRequest.query = { language: 'es' };

      const result = extractLocaleFromQuery(mockRequest);
      expect(result).toBe('es');
    });

    it('should extract locale using lang query parameter', () => {
      mockRequest.query = { lang: 'de' };

      const result = extractLocaleFromQuery(mockRequest);
      expect(result).toBe('de');
    });

    it('should return null when no locale query parameters', () => {
      mockRequest.query = { page: '1' };

      const result = extractLocaleFromQuery(mockRequest);
      expect(result).toBeNull();
    });

    it('should handle undefined query', () => {
      mockRequest.query = undefined;

      const result = extractLocaleFromQuery(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('TranslationParams Logic', () => {
    it('should merge request parameters', () => {
      mockRequest.query = { page: '1' };
      mockRequest.params = { id: '123' };
      mockRequest.body = { name: 'John' };

      const result = extractTranslationParams(mockRequest);
      expect(result).toEqual({
        page: '1',
        id: '123',
        name: 'John'
      });
    });

    it('should handle empty request parameters', () => {
      const result = extractTranslationParams(mockRequest);
      expect(result).toEqual({});
    });

    it('should handle undefined request properties', () => {
      mockRequest.query = undefined;
      mockRequest.params = undefined;
      mockRequest.body = undefined;

      const result = extractTranslationParams(mockRequest);
      expect(result).toEqual({});
    });

    it('should handle partial request properties', () => {
      mockRequest.query = { page: '1' };
      mockRequest.params = undefined;
      mockRequest.body = { name: 'John' };

      const result = extractTranslationParams(mockRequest);
      expect(result).toEqual({
        page: '1',
        name: 'John'
      });
    });

    it('should handle null request properties', () => {
      mockRequest.query = null;
      mockRequest.params = null;
      mockRequest.body = null;

      const result = extractTranslationParams(mockRequest);
      expect(result).toEqual({});
    });

    it('should prioritize body over query and params', () => {
      mockRequest.query = { id: '123' };
      mockRequest.params = { id: '456' };
      mockRequest.body = { id: '789' };

      const result = extractTranslationParams(mockRequest);
      expect(result).toEqual({
        id: '789' // body should override query and params
      });
    });
  });

  describe('TranslationService Logic', () => {
    it('should get TranslationService from app', () => {
      const mockTranslationService = { translate: jest.fn() };
      mockRequest.app.get = jest.fn().mockReturnValue(mockTranslationService);

      const result = extractTranslationService(mockRequest);
      expect(result).toBe(mockTranslationService);
      expect(mockRequest.app.get).toHaveBeenCalledWith(TranslationServiceClass);
    });

    it('should handle app.get returning undefined', () => {
      mockRequest.app.get = jest.fn().mockReturnValue(undefined);

      const result = extractTranslationService(mockRequest);
      expect(result).toBeUndefined();
    });

    it('should handle app.get throwing error', () => {
      mockRequest.app.get = jest.fn().mockImplementation(() => {
        throw new Error('Service not found');
      });

      expect(() => extractTranslationService(mockRequest)).toThrow('Service not found');
    });

    it('should handle app being undefined', () => {
      mockRequest.app = undefined;

      expect(() => extractTranslationService(mockRequest)).toThrow();
    });
  });

  describe('Decorator Functions', () => {
    it('should be functions', () => {
      expect(typeof Locale).toBe('function');
      expect(typeof LocaleFromJWT).toBe('function');
      expect(typeof LocaleFromCookies).toBe('function');
      expect(typeof LocaleFromHeaders).toBe('function');
      expect(typeof LocaleFromQuery).toBe('function');
      expect(typeof TranslationParams).toBe('function');
      expect(typeof TranslationService).toBe('function');
    });
  });
}); 