// Core services
export { TranslationService } from './services/translation.service';

// Exception utilities
export { TranslatedExceptions, T, Ex } from './utils/translated-exceptions';

// Module
export { TranslationModule } from './modules/translation.module';

// Decorators
export { 
  Locale, 
  LocaleFromJWT,
  LocaleFromCookies,
  LocaleFromHeaders,
  LocaleFromQuery,
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

// Re-export NestJS types for convenience
export { HttpStatus } from '@nestjs/common';

// RTL utilities
export { 
  isRTL, 
  getRTLInfo, 
  getRTLLocales, 
  getRTLLocalesInfo, 
  containsRTLText, 
  getTextDirection, 
  wrapWithDirectionalMarkers, 
  cleanDirectionalMarkers 
} from './utils/rtl.utils'; 