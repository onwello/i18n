import { TranslationService } from '../services/translation.service';

export interface GraphQLContext {
  locale?: string;
  translationService?: TranslationService;
  user?: any;
  headers?: any;
}

export interface GraphQLLocaleExtractor {
  extractLocale(context: GraphQLContext): string;
  extractParams(args: any, parent: any): Record<string, any>;
}

export class GraphQLTranslationUtils {
  /**
   * Extract locale from GraphQL context using multiple strategies
   */
  static extractLocale(context: GraphQLContext, defaultLocale: string = 'en'): string {
    return (
      context.locale ||
      this.extractFromHeaders(context.headers) ||
      context.user?.locale ||
      defaultLocale
    );
  }

  /**
   * Extract locale from HTTP headers
   */
  static extractFromHeaders(headers: any): string | null {
    if (!headers) return null;

    // Try Accept-Language header
    const acceptLanguage = headers['accept-language'];
    if (acceptLanguage) {
      const primary = acceptLanguage.split(',')[0].split('-')[0];
      return primary;
    }

    // Try custom locale headers
    const customHeaders = ['x-locale', 'accept-locale', 'locale'];
    for (const header of customHeaders) {
      if (headers[header]) {
        return headers[header];
      }
    }

    return null;
  }

  /**
   * Extract parameters from GraphQL arguments and parent object
   */
  static extractParams(args: any, parent: any): Record<string, any> {
    const params: Record<string, any> = {};

    // Add arguments
    if (args) {
      Object.assign(params, args);
    }

    // Add parent fields that might be useful for translation
    if (parent) {
      const usefulFields = ['id', 'type', 'status', 'category'];
      for (const field of usefulFields) {
        if (parent[field] !== undefined) {
          params[field] = parent[field];
        }
      }
    }

    return params;
  }

  /**
   * Generate translation key from GraphQL type and field
   */
  static generateTranslationKey(typeName: string, fieldName: string): string {
    return `${typeName.toUpperCase()}.${fieldName.toUpperCase()}`;
  }

  /**
   * Validate if a locale is supported
   */
  static validateLocale(locale: string, supportedLocales: string[]): boolean {
    return supportedLocales.includes(locale);
  }

  /**
   * Create a translated field resolver
   */
  static createTranslatedFieldResolver(
    translationService: TranslationService,
    key: string,
    defaultLocale: string = 'en'
  ) {
    return (parent: any, args: any, context: GraphQLContext) => {
      const locale = this.extractLocale(context, defaultLocale);
      const params = this.extractParams(args, parent);
      
      return translationService.translate(key, locale, params);
    };
  }
}

/**
 * Decorator for GraphQL resolvers that automatically translates fields
 */
export function TranslatedField(key: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (parent: any, args: any, context: GraphQLContext) {
      const result = originalMethod.call(this, parent, args, context);
      
      if (context.translationService) {
        const locale = GraphQLTranslationUtils.extractLocale(context);
        const params = GraphQLTranslationUtils.extractParams(args, parent);
        
        return context.translationService.translate(key, locale, params);
      }
      
      return result;
    };
    
    return descriptor;
  };
} 