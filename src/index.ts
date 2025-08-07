// Main exports
export { TranslationService } from './services/translation.service';
export { TranslationModule } from './modules/translation.module';
export { TranslatedExceptions, T, Ex } from './utils/translated-exceptions';

// Decorators
export { 
  Locale, 
  LocaleFromJWT, 
  LocaleFromCookies, 
  LocaleFromHeaders, 
  LocaleFromQuery,
  TranslationParams,
  TranslationService as TranslationServiceDecorator 
} from './decorators/translated.decorator';

// RTL utilities
export { 
  isRTL, 
  getRTLInfo, 
  getRTLLocales, 
  getRTLLocalesInfo, 
  containsRTLText, 
  getTextDirection, 
  wrapWithDirectionalMarkers, 
  cleanDirectionalMarkers,
  clearRTLCaches 
} from './utils/rtl.utils';

// GraphQL integration (Apollo-specific exports are conditional)
export { GraphQLTranslationUtils } from './graphql/utilities';
export { i18nSchemaExtensions, exampleSchema, I18nSchemaUtils } from './graphql/schema-extensions';
export { TranslatedField } from './graphql/utilities';

// Re-export HttpStatus for convenience
export { HttpStatus } from '@nestjs/common'; 