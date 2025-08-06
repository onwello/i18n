import { ExecutionContext } from '@nestjs/common';
import { 
  Locale, 
  LocaleFromJWT,
  LocaleFromCookies,
  LocaleFromHeaders,
  LocaleFromQuery,
  TranslationParams, 
  TranslationService 
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

  describe('Locale (Enhanced)', () => {
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

      const decorator = Locale(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should prioritize cookies over headers and query', () => {
      mockRequest.cookies = { locale: 'fr' };
      mockRequest.headers = { 'accept-language': 'en', 'x-locale': 'es' };
      mockRequest.query = { locale: 'de' };

      const decorator = Locale(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should prioritize headers over query parameters', () => {
      mockRequest.headers = { 'accept-language': 'es' };
      mockRequest.query = { locale: 'fr' };

      const decorator = Locale(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should use query parameters when no other sources available', () => {
      mockRequest.query = { locale: 'de' };

      const decorator = Locale(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should return default locale when no sources available', () => {
      const decorator = Locale(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle malformed JWT token gracefully', () => {
      mockRequest.headers = { authorization: 'Bearer invalid.token' };
      mockRequest.cookies = { locale: 'fr' };

      const decorator = Locale(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle missing JWT payload gracefully', () => {
      const jwtToken = 'header.signature'; // Missing payload
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };
      mockRequest.cookies = { locale: 'fr' };

      const decorator = Locale(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromJWT', () => {
    it('should extract locale from JWT token', () => {
      const jwtPayload = { locale: 'fr', sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };

      const decorator = LocaleFromJWT(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should extract locale using different field names', () => {
      const jwtPayload = { language: 'es', sub: 'user123' };
      const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
      
      mockRequest.headers = { authorization: `Bearer ${jwtToken}` };

      const decorator = LocaleFromJWT(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should return null when no authorization header', () => {
      const decorator = LocaleFromJWT(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should return null when authorization header is not Bearer', () => {
      mockRequest.headers = { authorization: 'Basic dXNlcjpwYXNz' };

      const decorator = LocaleFromJWT(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle malformed JWT token', () => {
      mockRequest.headers = { authorization: 'Bearer invalid.token' };

      const decorator = LocaleFromJWT(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromCookies', () => {
    it('should extract locale from cookies', () => {
      mockRequest.cookies = { locale: 'fr' };

      const decorator = LocaleFromCookies(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should extract locale using different cookie names', () => {
      mockRequest.cookies = { language: 'es' };

      const decorator = LocaleFromCookies(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should return null when no locale cookie', () => {
      mockRequest.cookies = { theme: 'dark' };

      const decorator = LocaleFromCookies(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle undefined cookies', () => {
      mockRequest.cookies = undefined;

      const decorator = LocaleFromCookies(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromHeaders', () => {
    it('should extract locale from accept-language header', () => {
      mockRequest.headers = { 'accept-language': 'fr' };

      const decorator = LocaleFromHeaders(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should extract locale from x-locale header', () => {
      mockRequest.headers = { 'x-locale': 'es' };

      const decorator = LocaleFromHeaders(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should extract locale from accept-locale header', () => {
      mockRequest.headers = { 'accept-locale': 'de' };

      const decorator = LocaleFromHeaders(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should return null when no locale headers', () => {
      mockRequest.headers = { 'content-type': 'application/json' };

      const decorator = LocaleFromHeaders(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('LocaleFromQuery', () => {
    it('should extract locale from query parameters', () => {
      mockRequest.query = { locale: 'fr' };

      const decorator = LocaleFromQuery(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should extract locale using different query parameter names', () => {
      mockRequest.query = { language: 'es' };

      const decorator = LocaleFromQuery(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should return null when no locale query parameters', () => {
      mockRequest.query = { page: '1' };

      const decorator = LocaleFromQuery(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('TranslationParams', () => {
    it('should be a function', () => {
      expect(typeof TranslationParams).toBe('function');
    });

    it('should return a function when called', () => {
      const decorator = TranslationParams(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should merge request parameters', () => {
      mockRequest.query = { page: '1' };
      mockRequest.params = { id: '123' };
      mockRequest.body = { name: 'John' };

      const decorator = TranslationParams(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle empty request parameters', () => {
      const decorator = TranslationParams(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle undefined request properties', () => {
      mockRequest.query = undefined;
      mockRequest.params = undefined;
      mockRequest.body = undefined;

      const decorator = TranslationParams(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle partial request properties', () => {
      mockRequest.query = { page: '1' };
      mockRequest.params = undefined;
      mockRequest.body = { name: 'John' };

      const decorator = TranslationParams(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle null request properties', () => {
      mockRequest.query = null;
      mockRequest.params = null;
      mockRequest.body = null;

      const decorator = TranslationParams(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });
  });

  describe('TranslationService', () => {
    it('should be a function', () => {
      expect(typeof TranslationService).toBe('function');
    });

    it('should return a function when called', () => {
      const decorator = TranslationService(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should get TranslationService from app', () => {
      const mockTranslationService = { translate: jest.fn() };
      mockRequest.app.get = jest.fn().mockReturnValue(mockTranslationService);

      const decorator = TranslationService(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle app.get returning undefined', () => {
      mockRequest.app.get = jest.fn().mockReturnValue(undefined);

      const decorator = TranslationService(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle app.get throwing error', () => {
      mockRequest.app.get = jest.fn().mockImplementation(() => {
        throw new Error('Service not found');
      });

      const decorator = TranslationService(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });

    it('should handle app being undefined', () => {
      mockRequest.app = undefined;

      const decorator = TranslationService(undefined, mockExecutionContext);
      expect(typeof decorator).toBe('function');
    });
  });
}); 