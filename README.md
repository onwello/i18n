# @logistically/i18n

Enterprise-grade internationalization (i18n) library for NestJS microservices with RTL support, tree shaking, and performance optimizations.

## 🚀 Features

- **Multi-locale support** - Support for unlimited locales
- **RTL language support** - Full support for Arabic, Hebrew, Persian, Urdu, and other RTL languages
- **Parameter interpolation** - Dynamic content in translations
- **Number formatting** - Locale-aware number formatting with proper numeral systems
- **Date formatting** - Comprehensive date formatting with locale-specific numerals and calendars
- **Currency formatting** - Native Intl API integration for currency formatting
- **Caching with TTL** - Performance optimization
- **Statistics tracking** - Monitor translation usage
- **Fallback strategies** - Graceful handling of missing translations
- **Debug logging** - Comprehensive logging for troubleshooting
- **Type safety** - Full TypeScript support
- **Dependency injection** - Seamless NestJS integration
- **Elegant exception handling** - Translated exceptions with clean syntax
- **Enhanced decorators** - Multi-source locale extraction (JWT, cookies, headers, query params)
- **Performance testing** - Comprehensive performance benchmarks
- **Integration testing** - Real NestJS usage validation

## 📦 Installation

```bash
npm install @logistically/i18n
```

## 🎯 Quick Start

### 1. Setup Module

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      serviceName: 'profile-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr', 'es', 'de', 'ar', 'he', 'fa', 'ur'],
      translationsPath: 'src/translations',
      debug: false,
      fallbackStrategy: 'default',
      cache: { enabled: true, ttl: 3600 },
      pluralization: { enabled: true },
      rtl: { enabled: true }
    })
  ]
})
export class AppModule {}
```

### 2. Create Translation Files

```json
// src/translations/en.json
{
  "PROFILE.NOT_FOUND": "Profile not found: ${profileId}",
  "PROFILE.INVALID_TYPE": "Invalid profile type: ${profileType}",
  "VALIDATION.MAX_FILES": "Cannot upload more than ${maxFiles} files",
  "WELCOME.MESSAGE": "Welcome, ${userName}!",
  "ITEMS.COUNT": {
    "one": "1 item",
    "other": "${count} items"
  }
}

// src/translations/fr.json
{
  "PROFILE.NOT_FOUND": "Profil introuvable: ${profileId}",
  "PROFILE.INVALID_TYPE": "Type de profil invalide: ${profileType}",
  "VALIDATION.MAX_FILES": "Impossible de télécharger plus de ${maxFiles} fichiers",
  "WELCOME.MESSAGE": "Bienvenue, ${userName}!",
  "ITEMS.COUNT": {
    "one": "1 élément",
    "other": "${count} éléments"
  }
}

// src/translations/ar.json
{
  "PROFILE.NOT_FOUND": "الملف الشخصي غير موجود: ${profileId}",
  "PROFILE.INVALID_TYPE": "نوع الملف الشخصي غير صحيح: ${profileType}",
  "VALIDATION.MAX_FILES": "لا يمكن رفع أكثر من ${maxFiles} ملف",
  "WELCOME.MESSAGE": "مرحباً، ${userName}!",
  "ITEMS.COUNT": {
    "one": "عنصر واحد",
    "other": "${count} عناصر"
  }
}
```

### 3. Use in Services

```typescript
import { Injectable } from '@nestjs/common';
import { TranslationService, TranslatedExceptions } from '@logistically/i18n';

@Injectable()
export class ProfileService {
  constructor(private translationService: TranslationService) {}

  async getProfile(profileId: string, locale: string = 'en') {
    const profile = await this.profileRepository.findById(profileId);
    
    if (!profile) {
      // 🎯 Elegant translated exception
      throw TranslatedExceptions.notFound('PROFILE.NOT_FOUND', {
        locale,
        params: { profileId }
      });
    }
    
    return profile;
  }

  // Basic translation
  getWelcomeMessage(locale: string, userName: string) {
    return this.translationService.translate('WELCOME.MESSAGE', locale, {
      userName
    });
  }

  // Pluralization
  getItemCount(locale: string, count: number) {
    return this.translationService.translatePlural('ITEMS.COUNT', count, locale, {
      count
    });
  }

  // Date formatting
  getFormattedDate(locale: string, date: Date) {
    return this.translationService.formatDateForLocale(date, locale, {
      format: 'full'
    });
  }

  // Number formatting
  getFormattedNumber(locale: string, number: number) {
    return this.translationService.formatNumberForLocale(number, locale);
  }

  // RTL text detection
  getTextDirection(text: string) {
    return this.translationService.getTextDirection(text);
  }
}
```

### 4. Use Enhanced Decorators

The library provides powerful decorators for extracting locale from multiple sources:

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  Locale, 
  LocaleFromJWT, 
  LocaleFromCookies, 
  LocaleFromHeaders, 
  LocaleFromQuery,
  TranslationParams 
} from '@logistically/i18n';

@Controller('profiles')
export class ProfileController {
  @Get(':id')
  async getProfile(
    @Param('id') id: string,
    @Locale() locale: string,                    // Multi-source (JWT > Cookies > Headers > Query)
    @LocaleFromJWT() jwtLocale: string | null,  // JWT token only
    @LocaleFromCookies() cookieLocale: string | null,  // Cookies only
    @LocaleFromHeaders() headerLocale: string | null,  // Headers only
    @LocaleFromQuery() queryLocale: string | null,     // Query params only
    @TranslationParams() params: any
  ) {
    return { 
      message: 'Profile loaded', 
      detectedLocale: locale,
      sources: { jwtLocale, cookieLocale, headerLocale, queryLocale },
      params 
    };
  }

  @Post('upload')
  async uploadFiles(
    @Body() body: any,
    @Locale() locale: string,
    @TranslationParams() params: any
  ) {
    const maxFiles = 10;
    if (body.files.length > maxFiles) {
      throw TranslatedExceptions.badRequest('VALIDATION.MAX_FILES', {
        locale,
        params: { maxFiles }
      });
    }
    return { success: true };
  }
}
```

#### Locale Sources Priority (for `@Locale()` decorator):

1. **JWT Token** - `Authorization: Bearer <token>` (highest priority)
2. **Cookies** - `locale`, `language`, `lang` cookies
3. **Headers** - `Accept-Language`, `X-Locale`, `Accept-Locale`
4. **Query Parameters** - `?locale=`, `?language=`, `?lang=`
5. **Default** - Falls back to configured default locale

#### JWT Token Format:

```json
{
  "sub": "user123",
  "locale": "fr",        // Preferred field name
  "language": "es",      // Alternative field name
  "lang": "de"          // Alternative field name
}
```

## 🎨 Advanced Usage

### Exception Handling

```typescript
import { TranslatedExceptions } from '@logistically/i18n';

// Different exception types
throw TranslatedExceptions.notFound('PROFILE.NOT_FOUND', {
  locale: 'fr',
  params: { profileId: '123' }
});

throw TranslatedExceptions.badRequest('VALIDATION.ERROR', {
  locale: 'en',
  params: { field: 'email' }
});

throw TranslatedExceptions.internalServerError('SYSTEM.ERROR', {
  locale: 'en',
  params: { service: 'database' }
});

// Custom HTTP status
throw TranslatedExceptions.http('CUSTOM.ERROR', 422, {
  locale: 'en',
  params: { reason: 'validation_failed' }
});
```

### RTL Language Support

```typescript
// Check if locale is RTL
const isRTL = translationService.isRTLLocale('ar'); // true
const isRTL = translationService.isRTLLocale('he'); // true
const isRTL = translationService.isRTLLocale('en'); // false

// Get RTL information
const rtlInfo = translationService.getRTLInfo('ar');
// {
//   isRTL: true,
//   direction: "rtl",
//   script: "Arab",
//   name: "Arabic"
// }

// Get text direction for mixed content
const direction = translationService.getTextDirection('Hello مرحبا'); // "auto"
const direction = translationService.getTextDirection('مرحبا'); // "rtl"
const direction = translationService.getTextDirection('Hello'); // "ltr"

// Translation with RTL support
const result = translationService.translateWithRTL('PROFILE.NOT_FOUND', 'ar', { profileId: '123' });
// {
//   text: "الملف الشخصي غير موجود: 123",
//   rtl: { isRTL: true, direction: "rtl" }
// }
```

### Number and Date Formatting

```typescript
// Number formatting with locale-specific numerals
const formattedNumber = translationService.formatNumberForLocale(1234.56, 'ar');
// Output: "١٬٢٣٤٫٥٦" (Arabic numerals)

const formattedNumber = translationService.formatNumberForLocale(1234.56, 'he');
// Output: "קכד״קנו" (Hebrew numerals)

// Date formatting
const formattedDate = translationService.formatDateForLocale(new Date(), 'ar', {
  format: 'full'
});
// Output: "١٥ يناير ٢٠٢٤" (Arabic numerals)

// Date range formatting
const formattedRange = translationService.formatDateRangeForLocale(
  new Date('2024-01-15'), 
  new Date('2024-01-20'), 
  'he'
);
// Output: "15 ינואר 2024 - 20 ינואר 2024" (Hebrew numerals)

// Relative date formatting
const relativeDate = translationService.formatRelativeDate(new Date(), 'en');
// Output: "today", "yesterday", "in 2 days", etc.
```

### Statistics and Monitoring

```typescript
// Get translation statistics
const stats = translationService.getStats();
console.log(stats);
// {
//   totalRequests: 1000,
//   successfulTranslations: 950,
//   failedTranslations: 50,
//   cacheHits: 800,
//   cacheMisses: 200,
//   localeUsage: { en: 600, fr: 400 },
//   keyUsage: { 'PROFILE.NOT_FOUND': 100 }
// }

// Clear cache
translationService.clearCache();

// Reload translations
translationService.reloadTranslations();
```

### Custom Configuration

```typescript
TranslationModule.forRoot({
  serviceName: 'my-service',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr', 'es', 'ar'],
  translationsPath: 'src/translations',
  
  // Interpolation settings
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  },
  
  // Fallback strategy
  fallbackStrategy: 'key', // 'key' | 'default' | 'throw'
  
  // Caching
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  },
  
  // Statistics
  statistics: {
    enabled: true,
    trackKeyUsage: true,
    trackLocaleUsage: true
  },
  
  // RTL support
  rtl: {
    enabled: true,
    autoDetect: true,
    wrapWithMarkers: false,
    includeDirectionalInfo: true
  },
  
  // Pluralization
  pluralization: {
    enabled: true,
    formatNumbers: true,
    useDirectionalMarkers: true,
    validatePluralRules: true,
    trackPluralizationStats: true,
    ordinal: false,
    customRules: {}
  },
  
  // Debug mode
  debug: false
});
```

## 🧪 Testing

### Unit Testing

```typescript
import { Test } from '@nestjs/testing';
import { TranslationModule } from '@logistically/i18n';

describe('ProfileService', () => {
  let translationService: TranslationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TranslationModule.forRoot({
          serviceName: 'test-service',
          debug: true
        })
      ]
    }).compile();

    translationService = module.get<TranslationService>(TranslationService);
  });

  it('should translate correctly', () => {
    const result = translationService.translate('TEST.KEY', 'en', { name: 'John' });
    expect(result).toBe('Hello John!');
  });

  it('should handle RTL text', () => {
    const isRTL = translationService.isRTLLocale('ar');
    expect(isRTL).toBe(true);
  });
});
```

### Integration Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';
import { TranslationService } from '@logistically/i18n';
import * as request from 'supertest';

describe('Translation Integration Tests', () => {
  let app: INestApplication;
  let translationService: TranslationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TranslationModule.forRoot({
        serviceName: 'integration-test',
        translationsPath: './test-translations',
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr', 'es'],
        pluralization: { enabled: true },
        rtl: { enabled: true },
        cache: { enabled: true, ttl: 3600 },
        debug: true
      })],
    }).compile();

    app = moduleFixture.createNestApplication();
    translationService = moduleFixture.get<TranslationService>(TranslationService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle HTTP requests with locale detection', async () => {
    const response = await request(app.getHttpServer())
      .get('/test/translate/test-key')
      .set('accept-language', 'fr')
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
```

### Performance Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TranslationModule } from '@logistically/i18n';

describe('Translation Performance Tests', () => {
  let translationService: TranslationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TranslationModule.forRoot({
        serviceName: 'performance-test',
        translationsPath: './test-translations',
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr', 'es'],
        pluralization: { enabled: true },
        rtl: { enabled: true },
        cache: { enabled: true, ttl: 3600 },
        debug: false
      })],
    }).compile();

    translationService = moduleFixture.get<TranslationService>(TranslationService);
  });

  it('should handle 1000 translations within 100ms', () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      translationService.translate('welcome', 'en', { name: `User${i}` });
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
  });
});
```

## 📊 Performance

The library has been extensively performance tested and optimized:

### Performance Benchmarks

| Operation | Volume | Time | Performance |
|-----------|--------|------|-------------|
| **Mixed Text Detection** | 1,000 | 0.09ms | **12,500,000 ops/sec** |
| **Cache Hits** | 1,000 | 0.26ms | **4,347,826 ops/sec** |
| **Basic Translations** | 10,000 | 3.50ms | **2,857,143 ops/sec** |
| **RTL Text Detection** | 1,000 | 0.26ms | **3,846,154 ops/sec** |
| **Concurrent Translations** | 100 | 0.14ms | **714,286 ops/sec** |

### Production-Ready Features

- ✅ **High load handling** - 4,000 operations in 50ms
- ✅ **Sustained performance** - Consistent under stress
- ✅ **Memory efficient** - 23.5MB for 40k operations
- ✅ **Cache effective** - 1MB cache for 1,000 entries
- ✅ **Zero memory leaks** - Stable memory usage

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serviceName` | `string` | - | Service name for key prefixing |
| `defaultLocale` | `string` | `'en'` | Default locale |
| `supportedLocales` | `string[]` | `['en', 'fr', 'es', 'de', 'ar']` | Supported locales |
| `translationsPath` | `string` | `'src/translations'` | Path to translation files |
| `debug` | `boolean` | `false` | Enable debug logging |
| `interpolation.prefix` | `string` | `'${'` | Interpolation prefix |
| `interpolation.suffix` | `string` | `'}'` | Interpolation suffix |
| `fallbackStrategy` | `'key' \| 'default' \| 'throw'` | `'default'` | Fallback strategy |
| `cache.enabled` | `boolean` | `true` | Enable caching |
| `cache.ttl` | `number` | `3600` | Cache TTL in seconds |
| `statistics.enabled` | `boolean` | `true` | Enable statistics tracking |
| `statistics.trackKeyUsage` | `boolean` | `true` | Track key usage statistics |
| `statistics.trackLocaleUsage` | `boolean` | `true` | Track locale usage statistics |
| `rtl.enabled` | `boolean` | `true` | Enable RTL language support |
| `rtl.autoDetect` | `boolean` | `true` | Auto-detect RTL text content |
| `rtl.wrapWithMarkers` | `boolean` | `false` | Wrap text with directional markers |
| `rtl.includeDirectionalInfo` | `boolean` | `true` | Include RTL info in metadata |
| `pluralization.enabled` | `boolean` | `true` | Enable pluralization |
| `pluralization.formatNumbers` | `boolean` | `true` | Enable number formatting |
| `pluralization.useDirectionalMarkers` | `boolean` | `true` | Use RTL directional markers |
| `pluralization.validatePluralRules` | `boolean` | `true` | Validate plural rule structure |
| `pluralization.trackPluralizationStats` | `boolean` | `true` | Track pluralization statistics |
| `pluralization.ordinal` | `boolean` | `false` | Enable ordinal pluralization |
| `pluralization.customRules` | `Record<string, (count: number) => string>` | `{}` | Custom plural rules |

## 📚 Documentation

- **GitHub Repository**: [https://github.com/onwello/i18n](https://github.com/onwello/i18n)
- **NPM Package**: [@logistically/i18n](https://www.npmjs.com/package/@logistically/i18n)

### 📖 Guides

- [RTL Language Support](RTL_GUIDE.md) - Complete guide for Right-to-Left languages
- [Performance Optimization](PERFORMANCE_GUIDE.md) - Tree shaking, caching, and best practices
- [Enhanced Decorators](DECORATORS_GUIDE.md) - Multi-source locale extraction
- [Performance Summary](PERFORMANCE_SUMMARY.md) - Comprehensive performance benchmarks
- [Testing Summary](FINAL_TESTING_SUMMARY.md) - Complete testing coverage

## 🤝 Contributing

1. Fork the [repository](https://github.com/onwello/i18n)
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details. 