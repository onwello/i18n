import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TranslationService as TranslationServiceClass } from '../services/translation.service';

/**
 * Extract locale from JWT token
 */
function extractLocaleFromJWT(request: any): string | null {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.locale || payload.language || payload.lang || null;
  } catch (error) {
    return null;
  }
}

/**
 * Extract locale from cookies
 */
function extractLocaleFromCookies(request: any): string | null {
  return request.cookies?.locale || 
         request.cookies?.language || 
         request.cookies?.lang || 
         null;
}

/**
 * Extract locale from headers
 */
function extractLocaleFromHeaders(request: any): string | null {
  if (!request.headers) {
    return null;
  }
  return request.headers['accept-language'] || 
         request.headers['x-locale'] || 
         request.headers['accept-locale'] || 
         null;
}

/**
 * Extract locale from query parameters
 */
function extractLocaleFromQuery(request: any): string | null {
  if (!request.query) {
    return null;
  }
  return request.query.locale || 
         request.query.language || 
         request.query.lang || 
         null;
}

/**
 * Extract translation parameters from request
 */
function extractTranslationParams(request: any): Record<string, any> {
  return {
    ...request.params,
    ...request.query,
    ...request.body,
  };
}

/**
 * Extract TranslationService from request
 */
function extractTranslationService(request: any): TranslationServiceClass {
  return request.app.get(TranslationServiceClass);
}

/**
 * Enhanced decorator to inject the current locale from multiple sources
 * Priority order: JWT token > Cookies > Headers > Query params > Default
 * Usage: @Locale() locale: string
 */
export const Locale = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    
    // Try JWT token first
    const jwtLocale = extractLocaleFromJWT(request);
    if (jwtLocale) {
      return jwtLocale;
    }

    // Try cookies
    const cookieLocale = extractLocaleFromCookies(request);
    if (cookieLocale) {
      return cookieLocale;
    }

    // Try headers
    const headerLocale = extractLocaleFromHeaders(request);
    if (headerLocale) {
      return headerLocale;
    }

    // Try query parameters
    const queryLocale = extractLocaleFromQuery(request);
    if (queryLocale) {
      return queryLocale;
    }

    // Default fallback
    return 'en';
  },
);

/**
 * Decorator to extract locale from JWT token only
 * Usage: @LocaleFromJWT() locale: string
 */
export const LocaleFromJWT = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return extractLocaleFromJWT(request);
  },
);

/**
 * Decorator to extract locale from cookies only
 * Usage: @LocaleFromCookies() locale: string
 */
export const LocaleFromCookies = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return extractLocaleFromCookies(request);
  },
);

/**
 * Decorator to extract locale from headers only
 * Usage: @LocaleFromHeaders() locale: string
 */
export const LocaleFromHeaders = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return extractLocaleFromHeaders(request);
  },
);

/**
 * Decorator to extract locale from query parameters only
 * Usage: @LocaleFromQuery() locale: string
 */
export const LocaleFromQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return extractLocaleFromQuery(request);
  },
);

/**
 * Decorator to inject translation parameters from request
 * Usage: @TranslationParams() params: TranslationParams
 */
export const TranslationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Record<string, any> => {
    const request = ctx.switchToHttp().getRequest();
    return extractTranslationParams(request);
  },
);

/**
 * Decorator to inject the TranslationService
 * Usage: @TranslationService() translationService: TranslationService
 */
export const TranslationService = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TranslationServiceClass => {
    const request = ctx.switchToHttp().getRequest();
    return extractTranslationService(request);
  },
);

// Export the logic functions for testing
export {
  extractLocaleFromJWT,
  extractLocaleFromCookies,
  extractLocaleFromHeaders,
  extractLocaleFromQuery,
  extractTranslationParams,
  extractTranslationService
}; 