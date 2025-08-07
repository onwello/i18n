# @logistically/i18n

Enterprise-grade internationalization (i18n) library for NestJS microservices with RTL support, tree shaking, and performance optimizations.

## 🚀 Features

- **Multi-locale support** - Support for unlimited locales
- **RTL language support** - Full support for Arabic, Hebrew, Persian, Urdu, and other RTL languages
- **Parameter interpolation** - Dynamic content in translations
- **Caching with TTL** - Performance optimization
- **Statistics tracking** - Monitor translation usage
- **Fallback strategies** - Graceful handling of missing translations
- **Debug logging** - Comprehensive logging for troubleshooting
- **Type safety** - Full TypeScript support
- **Dependency injection** - Seamless NestJS integration
- **Elegant exception handling** - Translated exceptions with clean syntax
- **Enhanced decorators** - Multi-source locale extraction (JWT, cookies, headers, query params)

## 📦 Installation

```bash
npm install @logistically/i18n
```

## 🛠️ CLI Tool

This library works seamlessly with the **@logistically/i18n-cli** tool for extracting, generating, and managing translations.

### CLI Installation

```bash
# Install CLI globally
npm install -g @logistically/i18n-cli

# Or install locally
npm install --save-dev @logistically/i18n-cli
```

### Complete Workflow

```bash
# 1. Extract translatable strings from your codebase
i18n extract --patterns "*.ts,*.js" --output translation-keys.json

# 2. Generate translation files for multiple languages
i18n generate --languages en,fr,es,ar --output src/translations

# 3. Replace hardcoded strings with translation keys
i18n replace --dry-run  # Preview changes
i18n replace            # Apply changes

# 4. Use the library in your NestJS services
```

### CLI Features

- 🔍 **Smart Extraction** - Automatically extract translatable strings
- 🏗️ **File Generation** - Generate translation files for multiple languages
- 🔄 **String Replacement** - Replace hardcoded strings with translation keys
- 🛡️ **Security First** - Input validation and output sanitization
- 📊 **Performance Monitoring** - Real-time metrics and progress tracking

### 🚧 Planned CLI Features

- 🔍 **GraphQL Schema Extraction** - Extract translatable fields from GraphQL schemas
- 🏷️ **GraphQL Directive Generation** - Generate `@i18n` directives for GraphQL types
- 📋 **GraphQL Translation Validation** - Validate i18n usage in GraphQL resolvers
- 🔄 **GraphQL Type Integration** - Seamless integration with GraphQL code-first approach

For complete CLI documentation and usage examples, see the CLI tool's README.

## 🌐 Complete Translation Ecosystem

The **@logistically/i18n** library and **@logistically/i18n-cli** tool work together to provide a complete translation solution for enterprise applications.

### 🎯 Ecosystem Benefits

- **End-to-End Workflow** - From extraction to deployment
- **Enterprise Security** - Input validation and output sanitization
- **Performance Optimization** - Concurrent processing and caching
- **RTL Support** - Full support for Arabic, Hebrew, Persian, Urdu
- **Type Safety** - Complete TypeScript support
- **Microservices Ready** - Designed for distributed architectures

### 📋 Complete Workflow Example

```bash
# 1. Extract translatable strings from your microservices
i18n extract --patterns "*.ts,*.js" --output translation-keys.json

# 2. Generate translation files for all supported languages
i18n generate --languages en,fr,es,ar,he,fa,ur --output src/translations

# 3. Preview string replacements
i18n replace --dry-run --verbose

# 4. Apply replacements with backup
i18n replace --backup

# 5. Use the library in your NestJS services
```

### 🔧 Integration Example

```typescript
// Before: Hardcoded strings
export class ProfileService {
  async getProfile(profileId: string) {
    const profile = await this.repository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Profile not found: ' + profileId);
    }
    return profile;
  }
}

// After: Using the ecosystem
import { TranslationService, TranslatedExceptions } from '@logistically/i18n';

export class ProfileService {
  constructor(private translationService: TranslationService) {}

  async getProfile(profileId: string, locale: string = 'en') {
    const profile = await this.repository.findById(profileId);
    if (!profile) {
      throw TranslatedExceptions.notFound('PROFILE.NOT_FOUND', {
        locale,
        params: { profileId }
      });
    }
    return profile;
  }
}
```

### 🚀 Enterprise Features

| Feature | Library | CLI | Combined |
|---------|---------|-----|----------|
| **RTL Support** | ✅ Full support | ✅ Generation | ✅ Complete workflow |
| **Performance** | ✅ Caching, Tree shaking | ✅ Concurrent processing | ✅ Optimized end-to-end |
| **Security** | ✅ Input validation | ✅ Sanitization | ✅ Enterprise-grade |
| **Type Safety** | ✅ TypeScript | ✅ TypeScript | ✅ Complete coverage |
| **Microservices** | ✅ DI, Decorators | ✅ Multi-service | ✅ Distributed ready |

### 📊 Performance Comparison

```bash
# Traditional approach
# ❌ Manual extraction: 2-3 hours
# ❌ Manual generation: 1-2 hours  
# ❌ Manual replacement: 4-6 hours
# ❌ Total: 7-11 hours

# With @logistically ecosystem
# ✅ CLI extraction: 5-10 minutes
# ✅ CLI generation: 2-5 minutes
# ✅ CLI replacement: 10-30 minutes
# ✅ Total: 17-45 minutes (95% faster!)
```

For complete CLI documentation and usage examples, see the CLI tool's README.

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
      cache: { enabled: true, ttl: 3600 }
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
  "VALIDATION.MAX_FILES": "Cannot upload more than ${maxFiles} files"
}

// src/translations/fr.json
{
  "PROFILE.NOT_FOUND": "Profil introuvable: ${profileId}",
  "PROFILE.INVALID_TYPE": "Type de profil invalide: ${profileType}",
  "VALIDATION.MAX_FILES": "Impossible de télécharger plus de ${maxFiles} fichiers"
}

// src/translations/ar.json
{
  "PROFILE.NOT_FOUND": "الملف الشخصي غير موجود: ${profileId}",
  "PROFILE.INVALID_TYPE": "نوع الملف الشخصي غير صحيح: ${profileType}",
  "VALIDATION.MAX_FILES": "لا يمكن رفع أكثر من ${maxFiles} ملف"
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

  // Quick translation
  getWelcomeMessage(locale: string, userName: string) {
    return this.translationService.translate('WELCOME.MESSAGE', locale, {
      userName
    });
  }
}
```

### 4. Use Enhanced Decorators

The library provides powerful decorators for extracting locale from multiple sources:

```typescript
import { Controller, Get, Param } from '@nestjs/common';
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
}
```

#### Locale Sources Priority (for `@Locale()` decorator):

1. **JWT Token** - `Authorization: Bearer <token>` (highest priority)
2. **Cookies** - `locale`, `language`, `lang` cookies
3. **Headers** - `Accept-Language`, `X-Locale`, `Accept-Locale`
4. **Query Parameters** - `?locale=`, `?language=`, `?lang=`
5. **Default** - Falls back to 'en'

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

### Custom Interpolation

```typescript
TranslationModule.forRoot({
  serviceName: 'my-service',
  interpolation: {
    prefix: '{{',
    suffix: '}}'
  }
});

// Usage: "Hello {{name}}!"
```

### Fallback Strategies

```typescript
// Return the key if translation not found
fallbackStrategy: 'key'

// Throw an error if translation not found
fallbackStrategy: 'throw'

// Return key with warning (default)
fallbackStrategy: 'default'
```

### Caching Configuration

```typescript
cache: {
  enabled: true,
  ttl: 3600 // 1 hour
}
```

### Statistics Configuration

```typescript
// Enable all statistics (default)
statistics: {
  enabled: true,
  trackKeyUsage: true,
  trackLocaleUsage: true
}

// Disable all statistics for maximum performance
statistics: {
  enabled: false
}

// Enable only basic statistics
statistics: {
  enabled: true,
  trackKeyUsage: false,
  trackLocaleUsage: false
}
```

### Statistics Tracking

```typescript
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
```

## 🛠️ Exception Handling

### Elegant Exception Syntax

```typescript
import { TranslatedExceptions, T, Ex } from '@logistically/i18n';

// Full syntax
throw TranslatedExceptions.notFound('PROFILE.NOT_FOUND', {
  locale: 'fr',
  params: { profileId: '123' }
});

// Short aliases
throw T.notFound('PROFILE.NOT_FOUND', { locale: 'fr', params: { profileId: '123' } });
throw Ex.badRequest('VALIDATION.ERROR', { locale: 'en', params: { field: 'email' } });

// Custom HTTP status
throw TranslatedExceptions.http('CUSTOM.ERROR', 422, {
  locale: 'en',
  params: { reason: 'validation_failed' }
});
```

### Quick Translation Helper

```typescript
// Quick translation without service injection
const message = T.t('PROFILE.NOT_FOUND', 'fr', { profileId: '123' });
```

## 🌐 RTL (Right-to-Left) Language Support

The library provides comprehensive RTL support for Arabic, Hebrew, Persian, Urdu, and other RTL languages.

### RTL Configuration

```typescript
TranslationModule.forRoot({
  serviceName: 'my-service',
  rtl: {
    enabled: true,              // Enable RTL support
    autoDetect: true,           // Auto-detect RTL text
    wrapWithMarkers: false,     // Wrap text with directional markers
    includeDirectionalInfo: true // Include RTL info in metadata
  }
});
```

### RTL Translation Methods

```typescript
// Basic RTL translation
const result = translationService.translateWithRTL('PROFILE.NOT_FOUND', 'ar', { profileId: '123' });
console.log(result);
// {
//   text: "الملف الشخصي غير موجود: 123",
//   rtl: { isRTL: true, direction: "rtl" }
// }

// Translation with directional markers
const markedText = translationService.translateWithDirectionalMarkers('PROFILE.NOT_FOUND', 'ar');
// Returns: "\u200Fالملف الشخصي غير موجود: 123"

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
```

### RTL Utilities

```typescript
import { isRTL, getRTLInfo, getRTLLocales, containsRTLText } from '@logistically/i18n';

// Check if locale is RTL
isRTL('ar'); // true
isRTL('he'); // true
isRTL('en'); // false

// Get RTL information
getRTLInfo('ar-SA'); // { isRTL: true, direction: 'rtl', script: 'Arab', name: 'Arabic (Saudi Arabia)' }

// Get all RTL locales
const rtlLocales = getRTLLocales();
// ['ar', 'ar-SA', 'ar-EG', 'he', 'he-IL', 'fa', 'fa-IR', ...]

// Check if text contains RTL characters
containsRTLText('مرحبا بالعالم'); // true
containsRTLText('Hello World'); // false
containsRTLText('Hello مرحبا'); // true
```

### Supported RTL Languages

- **Arabic** (`ar`, `ar-SA`, `ar-EG`, etc.)
- **Hebrew** (`he`, `he-IL`)
- **Persian/Farsi** (`fa`, `fa-IR`, `fa-AF`)
- **Urdu** (`ur`, `ur-PK`, `ur-IN`)
- **Kurdish** (`ku`, `ku-IQ`, `ku-IR`)
- **Pashto** (`ps`, `ps-AF`, `ps-PK`)
- **Sindhi** (`sd`, `sd-PK`, `sd-IN`)
- **Uyghur** (`ug`, `ug-CN`)
- **Yiddish** (`yi`, `yi-US`, `yi-IL`)
- **And many more...**

### RTL Metadata in Responses

```typescript
const metadata = translationService.getTranslationMetadata('PROFILE.NOT_FOUND', 'ar');
console.log(metadata);
// {
//   key: "PROFILE.NOT_FOUND",
//   originalText: "الملف الشخصي غير موجود: ${profileId}",
//   translatedText: "الملف الشخصي غير موجود: 123",
//   locale: "ar",
//   fallbackUsed: false,
//   timestamp: Date,
//   rtl: {
//     isRTL: true,
//     direction: "rtl",
//     script: "Arab",
//     languageName: "Arabic"
//   }
// }
```

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

## 📊 Performance

- **Caching**: Built-in caching with configurable TTL
- **Lazy Loading**: Translations loaded on-demand
- **Memory Efficient**: No static dependencies
- **Statistics**: Monitor performance and usage (configurable)
- **Zero Overhead**: Statistics can be disabled for maximum performance

## 🧪 Testing

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
});
```

## 📚 Documentation

- **GitHub Repository**: [https://github.com/onwello/i18n](https://github.com/onwello/i18n)
- **NPM Package**: [@logistically/i18n](https://www.npmjs.com/package/@logistically/i18n)
- **CLI Tool**: [@logistically/i18n-cli](https://www.npmjs.com/package/@logistically/i18n-cli)

### 📖 Guides

- [RTL Language Support](RTL_GUIDE.md) - Complete guide for Right-to-Left languages
- [Performance Optimization](PERFORMANCE_GUIDE.md) - Tree shaking, caching, and best practices
- [Enhanced Decorators](DECORATORS_GUIDE.md) - Multi-source locale extraction

## 🤝 Contributing

1. Fork the [repository](https://github.com/onwello/i18n)
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details. 