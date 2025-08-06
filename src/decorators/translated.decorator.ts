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
    const headerLocale = request.headers['accept-language'] || 
                        request.headers['x-locale'] || 
                        request.headers['accept-locale'];
    if (headerLocale) {
      return headerLocale;
    }

    // Try query parameters
    const queryLocale = request.query.locale || 
                       request.query.language || 
                       request.query.lang;
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
    return request.headers['accept-language'] || 
           request.headers['x-locale'] || 
           request.headers['accept-locale'] || 
           null;
  },
);

/**
 * Decorator to extract locale from query parameters only
 * Usage: @LocaleFromQuery() locale: string
 */
export const LocaleFromQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.query.locale || 
           request.query.language || 
           request.query.lang || 
           null;
  },
);

/**
 * Decorator to inject translation parameters from request
 * Usage: @TranslationParams() params: TranslationParams
 */
export const TranslationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Record<string, any> => {
    const request = ctx.switchToHttp().getRequest();
    return {
      ...request.body,
      ...request.query,
      ...request.params,
    };
  },
);

/**
 * Decorator to inject the TranslationService
 * Usage: @TranslationService() translationService: TranslationService
 */
export const TranslationService = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TranslationServiceClass => {
    const request = ctx.switchToHttp().getRequest();
    return request.app.get(TranslationServiceClass);
  },
); 