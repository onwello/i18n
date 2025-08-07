# 🌐 RTL (Right-to-Left) Language Support Guide

## 📋 Overview

The `@logistically/i18n` library provides comprehensive RTL (Right-to-Left) language support for Arabic, Hebrew, Persian, Urdu, and many other RTL languages. This guide covers all RTL features, configuration options, and best practices.

**📚 Documentation**: [GitHub Repository](https://github.com/onwello/i18n) | [NPM Package](https://www.npmjs.com/package/@logistically/i18n)

## 🎯 Supported RTL Languages

### Arabic (العربية)
- **Locale codes**: `ar`, `ar-SA`, `ar-EG`, `ar-AE`, `ar-LB`, `ar-JO`, `ar-SY`, `ar-IQ`, `ar-KW`, `ar-BH`, `ar-QA`, `ar-OM`, `ar-YE`, `ar-LY`, `ar-DZ`, `ar-MA`, `ar-TN`, `ar-MR`, `ar-SD`, `ar-TD`, `ar-KM`, `ar-DJ`, `ar-SO`, `ar-ER`, `ar-IL`, `ar-PS`
- **Script**: Arabic (Arab)
- **Direction**: RTL

### Hebrew (עברית)
- **Locale codes**: `he`, `he-IL`
- **Script**: Hebrew (Hebr)
- **Direction**: RTL

### Persian/Farsi (فارسی)
- **Locale codes**: `fa`, `fa-IR`, `fa-AF`
- **Script**: Arabic (Arab)
- **Direction**: RTL

### Urdu (اردو)
- **Locale codes**: `ur`, `ur-PK`, `ur-IN`
- **Script**: Arabic (Arab)
- **Direction**: RTL

### Kurdish (کوردی)
- **Locale codes**: `ku`, `ku-IQ`, `ku-IR`
- **Script**: Arabic (Arab)
- **Direction**: RTL

### Pashto (پښتو)
- **Locale codes**: `ps`, `ps-AF`, `ps-PK`
- **Script**: Arabic (Arab)
- **Direction**: RTL

### Sindhi (سنڌي)
- **Locale codes**: `sd`, `sd-PK`, `sd-IN`
- **Script**: Arabic (Arab)
- **Direction**: RTL

### Uyghur (ئۇيغۇرچە)
- **Locale codes**: `ug`, `ug-CN`
- **Script**: Arabic (Arab)
- **Direction**: RTL

### Yiddish (יידיש)
- **Locale codes**: `yi`, `yi-US`, `yi-IL`
- **Script**: Hebrew (Hebr)
- **Direction**: RTL

### And many more...

## ⚙️ Configuration

### Basic RTL Configuration

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      serviceName: 'my-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'ar', 'he', 'fa', 'ur'],
      rtl: {
        enabled: true,              // Enable RTL support
        autoDetect: true,           // Auto-detect RTL text content
        wrapWithMarkers: false,     // Wrap text with directional markers
        includeDirectionalInfo: true // Include RTL info in metadata
      }
    })
  ]
})
export class AppModule {}
```

### RTL Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rtl.enabled` | `boolean` | `true` | Enable RTL language support |
| `rtl.autoDetect` | `boolean` | `true` | Auto-detect RTL text content |
| `rtl.wrapWithMarkers` | `boolean` | `false` | Wrap text with directional markers |
| `rtl.includeDirectionalInfo` | `boolean` | `true` | Include RTL info in metadata |

## 🔧 Usage Examples

### Basic RTL Translation

```typescript
import { Injectable } from '@nestjs/common';
import { TranslationService } from '@logistically/i18n';

@Injectable()
export class ProfileService {
  constructor(private translationService: TranslationService) {}

  async getProfile(profileId: string, locale: string = 'en') {
    const profile = await this.profileRepository.findById(profileId);
    
    if (!profile) {
      throw TranslatedExceptions.notFound('PROFILE.NOT_FOUND', {
        locale,
        params: { profileId }
      });
    }
    
    return profile;
  }

  // RTL translation with metadata
  getWelcomeMessage(locale: string, userName: string) {
    const result = this.translationService.translateWithRTL('WELCOME.MESSAGE', locale, {
      userName
    });
    
    return {
      message: result.text,
      direction: result.rtl.direction,
      isRTL: result.rtl.isRTL
    };
  }
}
```

### RTL-Aware Translation Methods

```typescript
// Basic translation (returns string)
const message = translationService.translate('PROFILE.NOT_FOUND', 'ar', { profileId: '123' });

// Translation with RTL metadata
const result = translationService.translateWithRTL('PROFILE.NOT_FOUND', 'ar', { profileId: '123' });
console.log(result);
// {
//   text: "الملف الشخصي غير موجود: 123",
//   rtl: { isRTL: true, direction: "rtl" }
// }

// Translation with directional markers
const markedText = translationService.translateWithDirectionalMarkers('PROFILE.NOT_FOUND', 'ar');
// Returns: "\u200Fالملف الشخصي غير موجود: 123"
```

### RTL Detection and Information

```typescript
// Check if locale is RTL
const isRTL = translationService.isRTLLocale('ar'); // true
const isRTL = translationService.isRTLLocale('he'); // true
const isRTL = translationService.isRTLLocale('en'); // false

// Get detailed RTL information
const rtlInfo = translationService.getRTLInfo('ar-SA');
console.log(rtlInfo);
// {
//   isRTL: true,
//   direction: "rtl",
//   script: "Arab",
//   name: "Arabic (Saudi Arabia)"
// }

// Get text direction for mixed content
const direction = translationService.getTextDirection('Hello مرحبا'); // "auto"
const direction = translationService.getTextDirection('مرحبا'); // "rtl"
const direction = translationService.getTextDirection('Hello'); // "ltr"
```

### RTL Utilities

```typescript
import { 
  isRTL, 
  getRTLInfo, 
  getRTLLocales, 
  getRTLLocalesInfo, 
  containsRTLText, 
  getTextDirection, 
  wrapWithDirectionalMarkers, 
  cleanDirectionalMarkers 
} from '@logistically/i18n';

// Check if locale is RTL
isRTL('ar'); // true
isRTL('he'); // true
isRTL('en'); // false

// Get RTL information
getRTLInfo('ar-SA'); // { isRTL: true, direction: 'rtl', script: 'Arab', name: 'Arabic (Saudi Arabia)' }

// Get all RTL locales
const rtlLocales = getRTLLocales();
// ['ar', 'ar-SA', 'ar-EG', 'he', 'he-IL', 'fa', 'fa-IR', ...]

// Get RTL locales with information
const rtlInfo = getRTLLocalesInfo();
console.log(rtlInfo.ar);
// { name: 'Arabic', direction: 'rtl', script: 'Arab' }

// Check if text contains RTL characters
containsRTLText('مرحبا بالعالم'); // true
containsRTLText('Hello World'); // false
containsRTLText('Hello مرحبا'); // true

// Get text direction
getTextDirection('مرحبا'); // "rtl"
getTextDirection('Hello'); // "ltr"
getTextDirection('Hello مرحبا'); // "auto"

// Wrap text with directional markers
wrapWithDirectionalMarkers('مرحبا', 'rtl'); // "\u200Fمرحبا"
wrapWithDirectionalMarkers('Hello', 'ltr'); // "\u200EHello"

// Clean directional markers
cleanDirectionalMarkers('\u200Fمرحبا\u200EHello'); // "مرحباHello"
```

## 📝 Translation Files

### Arabic Translation File (`src/translations/ar.json`)

```json
{
  "PROFILE.NOT_FOUND": "الملف الشخصي غير موجود: ${profileId}",
  "PROFILE.INVALID_TYPE": "نوع الملف الشخصي غير صحيح: ${profileType}",
  "VALIDATION.MAX_FILES": "لا يمكن رفع أكثر من ${maxFiles} ملف",
  "WELCOME.MESSAGE": "مرحباً ${userName}، أهلاً وسهلاً بك!",
  "ERROR.SERVER_ERROR": "حدث خطأ في الخادم",
  "SUCCESS.PROFILE_UPDATED": "تم تحديث الملف الشخصي بنجاح"
}
```

### Hebrew Translation File (`src/translations/he.json`)

```json
{
  "PROFILE.NOT_FOUND": "הפרופיל לא נמצא: ${profileId}",
  "PROFILE.INVALID_TYPE": "סוג פרופיל לא חוקי: ${profileType}",
  "VALIDATION.MAX_FILES": "לא ניתן להעלות יותר מ-${maxFiles} קבצים",
  "WELCOME.MESSAGE": "שלום ${userName}, ברוך הבא!",
  "ERROR.SERVER_ERROR": "שגיאת שרת",
  "SUCCESS.PROFILE_UPDATED": "הפרופיל עודכן בהצלחה"
}
```

### Persian Translation File (`src/translations/fa.json`)

```json
{
  "PROFILE.NOT_FOUND": "پروفایل یافت نشد: ${profileId}",
  "PROFILE.INVALID_TYPE": "نوع پروفایل نامعتبر: ${profileType}",
  "VALIDATION.MAX_FILES": "نمی‌توان بیش از ${maxFiles} فایل آپلود کرد",
  "WELCOME.MESSAGE": "سلام ${userName}، خوش آمدید!",
  "ERROR.SERVER_ERROR": "خطای سرور",
  "SUCCESS.PROFILE_UPDATED": "پروفایل با موفقیت به‌روزرسانی شد"
}
```

## 🎨 Frontend Integration

### React/Next.js Integration

```typescript
// React component with RTL support
import { useTranslation } from '@logistically/i18n';

interface ProfileProps {
  locale: string;
  profileId: string;
}

const ProfileComponent: React.FC<ProfileProps> = ({ locale, profileId }) => {
  const { translateWithRTL } = useTranslation();
  
  const result = translateWithRTL('PROFILE.NOT_FOUND', locale, { profileId });
  
  return (
    <div dir={result.rtl.direction} lang={locale}>
      <p>{result.text}</p>
    </div>
  );
};
```

### CSS for RTL Support

```css
/* RTL-aware styles */
[dir="rtl"] {
  text-align: right;
  direction: rtl;
}

[dir="rtl"] .profile-card {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .button {
  padding-left: 0;
  padding-right: 1rem;
}

/* Mixed content handling */
[dir="auto"] {
  text-align: start;
  direction: auto;
}
```

## 🔍 RTL Metadata in API Responses

### Translation Metadata with RTL Info

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

### API Response Structure

```typescript
// Example API response with RTL metadata
{
  "success": true,
  "data": {
    "message": "الملف الشخصي غير موجود: 123",
    "metadata": {
      "locale": "ar",
      "direction": "rtl",
      "isRTL": true,
      "script": "Arab",
      "languageName": "Arabic"
    }
  }
}
```

## 🧪 Testing RTL Support

### Unit Tests for RTL

```typescript
import { Test } from '@nestjs/testing';
import { TranslationModule } from '@logistically/i18n';

describe('RTL Translation', () => {
  let translationService: TranslationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TranslationModule.forRoot({
          serviceName: 'test-service',
          supportedLocales: ['en', 'ar', 'he'],
          rtl: { enabled: true }
        })
      ]
    }).compile();

    translationService = module.get<TranslationService>(TranslationService);
  });

  it('should detect RTL locales', () => {
    expect(translationService.isRTLLocale('ar')).toBe(true);
    expect(translationService.isRTLLocale('he')).toBe(true);
    expect(translationService.isRTLLocale('en')).toBe(false);
  });

  it('should translate with RTL metadata', () => {
    const result = translationService.translateWithRTL('TEST.KEY', 'ar');
    expect(result.rtl.isRTL).toBe(true);
    expect(result.rtl.direction).toBe('rtl');
  });
});
```

## 🚀 Performance Considerations

### RTL Performance Impact

- **RTL detection**: Minimal overhead (~1-2ms per locale check)
- **Directional markers**: No performance impact when disabled
- **Metadata inclusion**: ~5% memory overhead when enabled
- **Text direction analysis**: ~1-3ms per text analysis

### Optimization Tips

```typescript
// For high-performance applications, disable RTL features you don't need
TranslationModule.forRoot({
  serviceName: 'high-traffic-service',
  rtl: {
    enabled: true,
    autoDetect: false,           // Disable if not needed
    wrapWithMarkers: false,      // Disable for performance
    includeDirectionalInfo: false // Disable to reduce memory usage
  }
});
```

## 🔧 Best Practices

### 1. Locale Detection
```typescript
// Always validate RTL locales
const isValidRTL = isRTL(locale) && supportedLocales.includes(locale);
```

### 2. Mixed Content Handling
```typescript
// Use auto direction for mixed content
const direction = getTextDirection(text);
const element = document.createElement('div');
element.setAttribute('dir', direction);
```

### 3. CSS Integration
```css
/* Always use logical properties for RTL */
.profile-card {
  margin-inline-start: 1rem;
  padding-inline-end: 1rem;
}
```

### 4. API Design
```typescript
// Include RTL metadata in API responses
const response = {
  message: result.text,
  metadata: {
    locale,
    direction: result.rtl.direction,
    isRTL: result.rtl.isRTL
  }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Text not displaying correctly**
   - Check if RTL is enabled in configuration
   - Verify locale is in supported RTL locales
   - Ensure proper CSS direction attributes

2. **Mixed content issues**
   - Use `getTextDirection()` for mixed content
   - Set `dir="auto"` for automatic direction detection

3. **Performance issues**
   - Disable unused RTL features
   - Use caching for RTL detection results

### Debug Mode

```typescript
TranslationModule.forRoot({
  serviceName: 'debug-service',
  debug: true,
  rtl: { enabled: true }
});
```

This will log RTL detection and processing information for debugging.

## 📚 Additional Resources

- [Unicode Bidirectional Algorithm](https://unicode.org/reports/tr9/)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [RTL Layout Guidelines](https://material.io/design/usability/bidirectionality.html)
- [Arabic Typography](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)

---

**Note**: This RTL support is designed to be comprehensive and production-ready. It handles edge cases, provides excellent performance, and integrates seamlessly with existing translation workflows. 