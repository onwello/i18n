// Decorators - separate entry point for tree shaking
export { 
  Locale, 
  LocaleFromJWT,
  LocaleFromCookies,
  LocaleFromHeaders,
  LocaleFromQuery,
  TranslationParams,
  TranslationService as TranslationServiceDecorator 
} from './decorators/translated.decorator'; 