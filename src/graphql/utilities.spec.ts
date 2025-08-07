import { GraphQLTranslationUtils } from './utilities';

describe('GraphQLTranslationUtils', () => {
  describe('extractLocale', () => {
    it('should extract locale from context.locale', () => {
      const context = { locale: 'fr' };
      const result = GraphQLTranslationUtils.extractLocale(context);
      
      expect(result).toBe('fr');
    });

    it('should extract locale from headers', () => {
      const context = { 
        headers: { 'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8' } 
      };
      const result = GraphQLTranslationUtils.extractLocale(context);
      
      expect(result).toBe('fr');
    });

    it('should extract locale from X-Locale header', () => {
      const context = { 
        headers: { 'x-locale': 'es' } 
      };
      const result = GraphQLTranslationUtils.extractLocale(context);
      
      expect(result).toBe('es');
    });

    it('should fallback to default locale', () => {
      const context = {};
      const result = GraphQLTranslationUtils.extractLocale(context);
      
      expect(result).toBe('en');
    });

    it('should use custom default locale', () => {
      const context = {};
      const result = GraphQLTranslationUtils.extractLocale(context, 'fr');
      
      expect(result).toBe('fr');
    });
  });

  describe('extractFromHeaders', () => {
    it('should extract from Accept-Language header', () => {
      const headers = { 'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8' };
      const result = GraphQLTranslationUtils.extractFromHeaders(headers);
      
      expect(result).toBe('fr');
    });

    it('should extract from X-Locale header', () => {
      const headers = { 'x-locale': 'es' };
      const result = GraphQLTranslationUtils.extractFromHeaders(headers);
      
      expect(result).toBe('es');
    });

    it('should return null for missing headers', () => {
      const headers = {};
      const result = GraphQLTranslationUtils.extractFromHeaders(headers);
      
      expect(result).toBeNull();
    });

    it('should return null for null headers', () => {
      const result = GraphQLTranslationUtils.extractFromHeaders(null);
      
      expect(result).toBeNull();
    });
  });

  describe('extractParams', () => {
    it('should extract parameters from args and parent', () => {
      const args = { userId: '123', type: 'admin' };
      const parent = { id: '123', status: 'active' };
      
      const result = GraphQLTranslationUtils.extractParams(args, parent);
      
      expect(result).toEqual({
        userId: '123',
        type: 'admin',
        id: '123',
        status: 'active'
      });
    });

    it('should handle only args', () => {
      const args = { userId: '123' };
      const parent = null;
      
      const result = GraphQLTranslationUtils.extractParams(args, parent);
      
      expect(result).toEqual({ userId: '123' });
    });

    it('should handle only parent', () => {
      const args = null;
      const parent = { id: '123', status: 'active' };
      
      const result = GraphQLTranslationUtils.extractParams(args, parent);
      
      expect(result).toEqual({
        id: '123',
        status: 'active'
      });
    });

    it('should handle empty inputs', () => {
      const result = GraphQLTranslationUtils.extractParams(null, null);
      
      expect(result).toEqual({});
    });
  });

  describe('generateTranslationKey', () => {
    it('should generate translation key from type and field', () => {
      const result = GraphQLTranslationUtils.generateTranslationKey('User', 'name');
      
      expect(result).toBe('USER.NAME');
    });

    it('should handle different cases', () => {
      const result = GraphQLTranslationUtils.generateTranslationKey('product', 'description');
      
      expect(result).toBe('PRODUCT.DESCRIPTION');
    });
  });

  describe('validateLocale', () => {
    it('should validate supported locale', () => {
      const supportedLocales = ['en', 'fr', 'es'];
      
      expect(GraphQLTranslationUtils.validateLocale('en', supportedLocales)).toBe(true);
      expect(GraphQLTranslationUtils.validateLocale('fr', supportedLocales)).toBe(true);
      expect(GraphQLTranslationUtils.validateLocale('es', supportedLocales)).toBe(true);
    });

    it('should reject unsupported locale', () => {
      const supportedLocales = ['en', 'fr', 'es'];
      
      expect(GraphQLTranslationUtils.validateLocale('de', supportedLocales)).toBe(false);
      expect(GraphQLTranslationUtils.validateLocale('ar', supportedLocales)).toBe(false);
    });
  });
}); 