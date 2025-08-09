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

// Interfaces
export {
  TranslationConfig,
  TranslationParams,
  TranslationOptions,
  TranslationMetadata,
  TranslationStats
} from './interfaces/translation-config.interface';

// Pluralization interfaces
export {
  PluralRule,
  OrdinalRule,
  LocalePluralConfig,
  PluralizationOptions,
  PluralizationResult,
  ArabicNumeralConfig,
  RTLPluralizationMetadata
} from './interfaces/pluralization.interface';

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

// GraphQL integration
export { ApolloI18nPlugin } from './graphql/apollo-plugin';
export { GraphQLTranslationUtils, TranslatedField } from './graphql/utilities';
export { i18nSchemaExtensions, exampleSchema, I18nSchemaUtils } from './graphql/schema-extensions';

// Re-export GraphQL types for convenience
export type { ApolloI18nConfig } from './graphql/apollo-plugin';
export type { GraphQLContext } from './graphql/utilities';

// Re-export NestJS types for convenience
export { HttpStatus } from '@nestjs/common'; 