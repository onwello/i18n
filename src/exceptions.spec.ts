import { TranslatedExceptions, T, Ex } from './exceptions';

describe('Exception Utilities', () => {
  describe('TranslatedExceptions', () => {
    it('should have notFound method', () => {
      expect(typeof TranslatedExceptions.notFound).toBe('function');
    });

    it('should have badRequest method', () => {
      expect(typeof TranslatedExceptions.badRequest).toBe('function');
    });

    it('should have unauthorized method', () => {
      expect(typeof TranslatedExceptions.unauthorized).toBe('function');
    });

    it('should have forbidden method', () => {
      expect(typeof TranslatedExceptions.forbidden).toBe('function');
    });

    it('should have conflict method', () => {
      expect(typeof TranslatedExceptions.conflict).toBe('function');
    });

    it('should have internalServerError method', () => {
      expect(typeof TranslatedExceptions.internalServerError).toBe('function');
    });

    it('should have http method', () => {
      expect(typeof TranslatedExceptions.http).toBe('function');
    });

    it('should throw notFound exception', () => {
      expect(() => {
        TranslatedExceptions.notFound('TEST.NOT_FOUND', {
          locale: 'en',
          params: { id: '123' }
        });
      }).toThrow();
    });

    it('should throw badRequest exception', () => {
      expect(() => {
        TranslatedExceptions.badRequest('TEST.BAD_REQUEST', {
          locale: 'en',
          params: { field: 'email' }
        });
      }).toThrow();
    });

    it('should throw unauthorized exception', () => {
      expect(() => {
        TranslatedExceptions.unauthorized('TEST.UNAUTHORIZED', {
          locale: 'en',
          params: { reason: 'invalid_token' }
        });
      }).toThrow();
    });

    it('should throw forbidden exception', () => {
      expect(() => {
        TranslatedExceptions.forbidden('TEST.FORBIDDEN', {
          locale: 'en',
          params: { resource: 'profile' }
        });
      }).toThrow();
    });

    it('should throw conflict exception', () => {
      expect(() => {
        TranslatedExceptions.conflict('TEST.CONFLICT', {
          locale: 'en',
          params: { resource: 'user' }
        });
      }).toThrow();
    });

    it('should throw internalServerError exception', () => {
      expect(() => {
        TranslatedExceptions.internalServerError('TEST.INTERNAL_ERROR', {
          locale: 'en',
          params: { error: 'database_connection' }
        });
      }).toThrow();
    });

    it('should throw custom http exception', () => {
      expect(() => {
        TranslatedExceptions.http('TEST.CUSTOM_ERROR', 422, {
          locale: 'en',
          params: { reason: 'validation_failed' }
        });
      }).toThrow();
    });
  });

  describe('T (alias for TranslatedExceptions)', () => {
    it('should be an alias for TranslatedExceptions', () => {
      expect(T).toBe(TranslatedExceptions);
    });

    it('should have the same methods', () => {
      expect(typeof T.notFound).toBe('function');
      expect(typeof T.badRequest).toBe('function');
      expect(typeof T.unauthorized).toBe('function');
      expect(typeof T.forbidden).toBe('function');
      expect(typeof T.conflict).toBe('function');
      expect(typeof T.internalServerError).toBe('function');
      expect(typeof T.http).toBe('function');
    });

    it('should throw exception using alias', () => {
      expect(() => {
        T.notFound('TEST.NOT_FOUND', {
          locale: 'en',
          params: { id: '123' }
        });
      }).toThrow();
    });
  });

  describe('Ex (alias for TranslatedExceptions)', () => {
    it('should be an alias for TranslatedExceptions', () => {
      expect(Ex).toBe(TranslatedExceptions);
    });

    it('should have the same methods', () => {
      expect(typeof Ex.notFound).toBe('function');
      expect(typeof Ex.badRequest).toBe('function');
      expect(typeof Ex.unauthorized).toBe('function');
      expect(typeof Ex.forbidden).toBe('function');
      expect(typeof Ex.conflict).toBe('function');
      expect(typeof Ex.internalServerError).toBe('function');
      expect(typeof Ex.http).toBe('function');
    });

    it('should throw exception using alias', () => {
      expect(() => {
        Ex.badRequest('TEST.BAD_REQUEST', {
          locale: 'en',
          params: { field: 'email' }
        });
      }).toThrow();
    });
  });

  describe('Exception with different locales', () => {
    it('should throw exception with French locale', () => {
      expect(() => {
        TranslatedExceptions.notFound('TEST.NOT_FOUND', {
          locale: 'fr',
          params: { id: '123' }
        });
      }).toThrow();
    });

    it('should throw exception with Arabic locale', () => {
      expect(() => {
        TranslatedExceptions.badRequest('TEST.BAD_REQUEST', {
          locale: 'ar',
          params: { field: 'email' }
        });
      }).toThrow();
    });

    it('should throw exception with Hebrew locale', () => {
      expect(() => {
        TranslatedExceptions.unauthorized('TEST.UNAUTHORIZED', {
          locale: 'he',
          params: { reason: 'invalid_token' }
        });
      }).toThrow();
    });
  });

  describe('Exception with parameters', () => {
    it('should throw exception with multiple parameters', () => {
      expect(() => {
        TranslatedExceptions.conflict('TEST.CONFLICT', {
          locale: 'en',
          params: { 
            resource: 'user',
            field: 'email',
            value: 'test@example.com'
          }
        });
      }).toThrow();
    });

    it('should throw exception with empty parameters', () => {
      expect(() => {
        TranslatedExceptions.internalServerError('TEST.INTERNAL_ERROR', {
          locale: 'en',
          params: {}
        });
      }).toThrow();
    });

    it('should throw exception without parameters', () => {
      expect(() => {
        TranslatedExceptions.forbidden('TEST.FORBIDDEN', {
          locale: 'en'
        });
      }).toThrow();
    });
  });

  describe('Custom HTTP status codes', () => {
    it('should throw exception with 422 status', () => {
      expect(() => {
        TranslatedExceptions.http('TEST.UNPROCESSABLE_ENTITY', 422, {
          locale: 'en',
          params: { reason: 'validation_failed' }
        });
      }).toThrow();
    });

    it('should throw exception with 429 status', () => {
      expect(() => {
        TranslatedExceptions.http('TEST.TOO_MANY_REQUESTS', 429, {
          locale: 'en',
          params: { retryAfter: 60 }
        });
      }).toThrow();
    });

    it('should throw exception with 503 status', () => {
      expect(() => {
        TranslatedExceptions.http('TEST.SERVICE_UNAVAILABLE', 503, {
          locale: 'en',
          params: { reason: 'maintenance' }
        });
      }).toThrow();
    });
  });
});
