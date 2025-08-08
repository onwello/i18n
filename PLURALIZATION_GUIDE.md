# RTL Pluralization Guide

This guide covers the comprehensive RTL pluralization engine that properly handles Arabic numeral systems, complex plural rules, and all the pitfalls that other i18n libraries fall into.

**📚 Documentation**: [GitHub Repository](https://github.com/onwello/i18n) | [NPM Package](https://www.npmjs.com/package/@logistically/i18n)

## 🔗 **CLDR Compatibility**

This pluralization engine is fully compatible with **Unicode CLDR (Common Locale Data Repository)** plural categories and aligns with JavaScript's `Intl.PluralRules` behavior. The plural categories (`zero`, `one`, `two`, `few`, `many`, `other`) follow the CLDR standard, ensuring consistency with other internationalization libraries and tools.

**Key Compatibility Points:**
- ✅ **CLDR Plural Categories**: All plural categories match CLDR specifications
- ✅ **Intl.PluralRules Alignment**: Engine behavior matches `Intl.PluralRules` output
- ✅ **ICU MessageFormat Compatibility**: While we use a custom DSL with `${count}` interpolation, our plural logic is compatible with ICU plural syntax
- ✅ **Fallback Strategy**: Follows CLDR fallback patterns for missing categories

**ICU MessageFormat Note:**
This engine does not use ICU MessageFormat syntax. Instead, we use a custom DSL with simple `${count}` interpolation. However, our plural logic and category determination are fully compatible with ICU plural syntax, making it easy to migrate from or to ICU-based systems.

## 🎯 **Key Features**

- ✅ **Arabic Numeral System Distinction** - Eastern vs Western Arabic numerals
- ✅ **Complex Plural Rules** - 6 categories for Arabic, 4 for Hebrew
- ✅ **RTL Directional Markers** - Proper handling of mixed LTR/RTL content
- ✅ **Locale-Aware Number Formatting** - Correct numeral systems per locale
- ✅ **Validation & Error Handling** - Robust plural rule validation
- ✅ **Caching & Performance** - Optimized pluralization caching
- ✅ **Comprehensive Testing** - Full test coverage for all scenarios

## 🔢 **Arabic Numeral Systems**

### **Eastern Arabic (Indic) Numerals** (٠١٢٣٤٥٦٧٨٩)
**Used in**: Egypt, Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman, Yemen, Iraq, Syria, Lebanon, Jordan, Palestine, Iran, Pakistan, Afghanistan

```typescript
// Eastern Arabic numerals
"FILES_COUNT": {
  "0": "لا توجد ملفات",
  "1": "${count} ملف",
  "2": "${count} ملف", 
  "few": "${count} ملفات",
  "many": "${count} ملف",
  "other": "${count} ملف"
}
```

### **Western Arabic (European) Numerals** (0123456789)
**Used in**: Morocco, Algeria, Tunisia, Libya, Mauritania

```typescript
// Western Arabic numerals (North African countries)
"FILES_COUNT": {
  "0": "لا توجد ملفات",
  "1": "${count} ملف",
  "2": "${count} ملف",
  "few": "${count} ملفات", 
  "many": "${count} ملف",
  "other": "${count} ملف"
}
```

## 🚀 **Quick Start**

### 1. **Setup with Pluralization**

```typescript
import { Module } from '@nestjs/common';
import { TranslationModule } from '@logistically/i18n';

@Module({
  imports: [
    TranslationModule.forRoot({
      serviceName: 'my-service',
      defaultLocale: 'en',
      supportedLocales: ['en', 'ar', 'ar-MA', 'he', 'fa', 'ur'],
      translationsPath: 'src/translations',
      pluralization: {
        enabled: true,
        formatNumbers: true,
        useDirectionalMarkers: true,
        validatePluralRules: true,
        trackPluralizationStats: true
      }
    })
  ]
})
export class AppModule {}
```

### 2. **Create Translation Files**

```json
// src/translations/ar.json (Eastern Arabic)
{
  "FILES_COUNT": {
    "0": "لا توجد ملفات",
    "1": "${count} ملف",
    "2": "${count} ملف",
    "few": "${count} ملفات",
    "many": "${count} ملف", 
    "other": "${count} ملف"
  },
  "UPLOAD_PROGRESS": {
    "0": "لم يتم رفع أي ملف",
    "1": "تم رفع ${count} ملف",
    "2": "تم رفع ${count} ملف",
    "few": "تم رفع ${count} ملفات",
    "many": "تم رفع ${count} ملف",
    "other": "تم رفع ${count} ملف"
  }
}

// src/translations/ar-MA.json (Western Arabic - Morocco)
{
  "FILES_COUNT": {
    "0": "لا توجد ملفات",
    "1": "${count} ملف",
    "2": "${count} ملف", 
    "few": "${count} ملفات",
    "many": "${count} ملف",
    "other": "${count} ملف"
  }
}

// src/translations/he.json (Hebrew)
{
  "FILES_COUNT": {
    "one": "קובץ אחד",
    "two": "שני קבצים",
    "few": "${count} קבצים",
    "many": "${count} קבצים",
    "other": "${count} קבצים"
  }
}
```

### 3. **Use in Services**

```typescript
import { Injectable } from '@nestjs/common';
import { TranslationService } from '@logistically/i18n';

@Injectable()
export class FileService {
  constructor(private translationService: TranslationService) {}

  getFileCountMessage(count: number, locale: string) {
    return this.translationService.translatePlural('FILES_COUNT', count, locale);
  }

  getUploadProgressMessage(count: number, locale: string) {
    return this.translationService.translatePlural('UPLOAD_PROGRESS', count, locale);
  }

  // Get detailed pluralization result
  getDetailedPluralization(count: number, locale: string) {
    return this.translationService.translatePluralWithResult('FILES_COUNT', count, locale);
  }
}
```

## 📊 **Usage Examples**

### **Basic Pluralization**

```typescript
// Eastern Arabic (Egypt, Saudi Arabia, etc.)
service.translatePlural('FILES_COUNT', 0, 'ar');  // "لا توجد ملفات"
service.translatePlural('FILES_COUNT', 1, 'ar');  // "١ ملف"
service.translatePlural('FILES_COUNT', 2, 'ar');  // "٢ ملف"
service.translatePlural('FILES_COUNT', 3, 'ar');  // "٣ ملفات"
service.translatePlural('FILES_COUNT', 11, 'ar'); // "١١ ملف"
service.translatePlural('FILES_COUNT', 100, 'ar'); // "١٠٠ ملف"

// Western Arabic (Morocco, Algeria, etc.)
service.translatePlural('FILES_COUNT', 0, 'ar-MA');  // "لا توجد ملفات"
service.translatePlural('FILES_COUNT', 1, 'ar-MA');  // "1 ملف"
service.translatePlural('FILES_COUNT', 2, 'ar-MA');  // "2 ملف"
service.translatePlural('FILES_COUNT', 3, 'ar-MA');  // "3 ملفات"
service.translatePlural('FILES_COUNT', 11, 'ar-MA'); // "11 ملف"
service.translatePlural('FILES_COUNT', 100, 'ar-MA'); // "100 ملف"
```

### **Hebrew Pluralization**

```typescript
service.translatePlural('FILES_COUNT', 1, 'he');   // "קובץ אחד"
service.translatePlural('FILES_COUNT', 2, 'he');   // "שני קבצים"
service.translatePlural('FILES_COUNT', 3, 'he');   // "ג קבצים"
service.translatePlural('FILES_COUNT', 10, 'he');  // "י קבצים"
service.translatePlural('FILES_COUNT', 11, 'he');  // "יא קבצים"
```

### **Persian Pluralization**

```typescript
service.translatePlural('FILES_COUNT', 1, 'fa');   // "یک فایل"
service.translatePlural('FILES_COUNT', 2, 'fa');   // "٢ فایل"
service.translatePlural('FILES_COUNT', 5, 'fa');   // "٥ فایل"
service.translatePlural('FILES_COUNT', 10, 'fa');  // "١٠ فایل"
```

## 🔍 **Detailed Results**

```typescript
const result = service.translatePluralWithResult('FILES_COUNT', 3, 'ar');

console.log(result);
// {
//   text: "٣ ملفات",
//   category: "few",
//   rtl: {
//     isRTL: true,
//     direction: "rtl",
//     script: "arab"
//   },
//   numberFormat: {
//     originalNumber: 3,
//     formattedNumber: "٣",
//     numberingSystem: "arab"
//   }
// }
```

## 🛠️ **Advanced Features**

### **Pluralization Utilities**

```typescript
// Check if key has plural rules
service.hasPluralRules('FILES_COUNT', 'ar'); // true
service.hasPluralRules('SIMPLE_KEY', 'ar');  // false

// Get plural categories for locale
service.getPluralCategories('ar'); 
// ['zero', 'one', 'two', 'few', 'many', 'other']

service.getPluralCategories('en');
// ['one', 'other']

// Get supported RTL locales
service.getSupportedRTLLocales();
// ['ar', 'ar-MA', 'he', 'fa', 'ur']

// Check if locale has complex plural rules
service.hasComplexPluralRules('ar'); // true (6 categories)
service.hasComplexPluralRules('en'); // false (2 categories)

// Format numbers for locale
service.formatNumberForLocale(123, 'ar');   // "١٢٣"
service.formatNumberForLocale(123, 'ar-MA'); // "123"
service.formatNumberForLocale(123, 'he');   // "קכג"
service.formatNumberForLocale(123, 'en');   // "123"

// Format decimal numbers
service.formatNumberForLocale(1.5, 'ar');    // "١٫٥"
service.formatNumberForLocale(3.14, 'ar-MA'); // "3.14"
service.formatNumberForLocale(2.5, 'he');     // "ב׳ה"
service.formatNumberForLocale(1.25, 'en');    // "1.25"

// Get pluralization statistics
const stats = service.getStats();
console.log('Pluralization stats:', {
  totalRequests: stats.totalRequests,
  successfulTranslations: stats.successfulTranslations,
  failedTranslations: stats.failedTranslations,
  cacheHits: stats.cacheHits,
  cacheMisses: stats.cacheMisses,
  localeUsage: stats.localeUsage,
  keyUsage: stats.keyUsage
});

### **Configuration Options**

```typescript
TranslationModule.forRoot({
  serviceName: 'my-service',
  pluralization: {
    enabled: true,                    // Enable pluralization
    formatNumbers: true,              // Format numbers according to locale
    useDirectionalMarkers: true,      // Use RTL directional markers
    validatePluralRules: true,        // Validate plural rule structure
    trackPluralizationStats: true,    // Track pluralization statistics
    ordinal: false,                   // Enable ordinal pluralization
    customRules: {                    // Custom plural rule overrides
      'ar': (count: number) => {
        // Custom logic for Arabic dialect
        if (count === 0) return 'zero';
        if (count === 1) return 'one';
        if (count === 2) return 'two';
        if (count >= 3 && count <= 10) return 'few';
        if (count >= 11 && count <= 99) return 'many';
        return 'other';
      }
    }
  }
})
```

### **Fallback Strategy**

The engine implements a comprehensive fallback strategy for missing translations:

1. **Missing Plural Category**: If a specific plural category is missing in the current locale, the engine tries other categories in this order:
   - `other` (always available as fallback)
   - `many` → `few` → `two` → `one` → `zero`

2. **Missing Locale**: If the entire locale is missing:
   - Falls back to `defaultLocale` if configured
   - Falls back to `'en'` as final fallback
   - Returns `"KEY (count)"` format

3. **Missing Translation Key**: If the translation key doesn't exist:
   - Returns `"KEY (count)"` format

```typescript
// Example fallback behavior
service.translatePlural('MISSING_KEY', 5, 'ar');     // "MISSING_KEY (5)"
service.translatePlural('FILES_COUNT', 5, 'xx');     // Falls back to defaultLocale
service.translatePlural('FILES_COUNT', 5, 'ar');     // Uses 'other' category if 'many' missing
```

## 🧪 **Testing**

```typescript
describe('RTL Pluralization', () => {
  it('should handle Arabic pluralization correctly', () => {
    const testCases = [
      { count: 0, expected: 'لا توجد ملفات' },
      { count: 1, expected: '١ ملف' },
      { count: 2, expected: '٢ ملف' },
      { count: 3, expected: '٣ ملفات' },
      { count: 11, expected: '١١ ملف' },
      { count: 100, expected: '١٠٠ ملف' }
    ];
    
    testCases.forEach(({ count, expected }) => {
      const result = service.translatePlural('FILES_COUNT', count, 'ar');
      expect(result).toBe(expected);
    });
  });

  it('should handle Western Arabic numerals (Morocco)', () => {
    const testCases = [
      { count: 0, expected: 'لا توجد ملفات' },
      { count: 1, expected: '1 ملف' },
      { count: 2, expected: '2 ملف' },
      { count: 3, expected: '3 ملفات' },
      { count: 11, expected: '11 ملف' },
      { count: 100, expected: '100 ملف' }
    ];
    
    testCases.forEach(({ count, expected }) => {
      const result = service.translatePlural('FILES_COUNT', count, 'ar-MA');
      expect(result).toBe(expected);
    });
  });
});
```

## 🚨 **Common Pitfalls Avoided**

### 1. **Arabic Numeral System Confusion**

❌ **Wrong**: Using Eastern Arabic numerals for North African countries
```typescript
// ❌ Wrong for Morocco
"FILES_COUNT": {
  "1": "١ ملف"  // Eastern Arabic numerals
}
```

✅ **Correct**: Using Western Arabic numerals for North African countries
```typescript
// ✅ Correct for Morocco
"FILES_COUNT": {
  "1": "1 ملف"  // Western Arabic numerals
}
```

### 2. **Oversimplified Plural Rules**

❌ **Wrong**: Using simple English-style pluralization for Arabic
```typescript
// ❌ Wrong for Arabic
const arabicPlural = (count: number) => {
  return count === 1 ? 'one' : 'other'; // Only 2 categories
};
```

✅ **Correct**: Using proper Arabic plural rules (6 categories)
```typescript
// ✅ Correct for Arabic
const arabicPlural = (count: number) => {
  if (count === 0) return 'zero';
  if (count === 1) return 'one';
  if (count === 2) return 'two';
  if (count >= 3 && count <= 10) return 'few';
  if (count >= 11 && count <= 99) return 'many';
  return 'other';
};
```

### 3. **Missing Directional Markers**

❌ **Wrong**: Not handling mixed LTR/RTL content
```typescript
// ❌ Wrong: Numbers remain LTR in RTL text
"FILES_COUNT": {
  "1": "1 ملف"  // Number stays LTR
}
```

✅ **Correct**: Using directional markers for mixed content
```typescript
// ✅ Correct: Numbers properly embedded in RTL text
// Note: Directional markers (LRE/PDF) are automatically inserted by the engine
// when useDirectionalMarkers: true is set in configuration
"FILES_COUNT": {
  "1": "${count} ملف"  // Engine automatically adds \u202A and \u202C
}
```

**Automatic Directional Marker Insertion:**
- Directional markers (`\u202A`, `\u202B`, `\u202C`) are automatically inserted by the translation engine
- Only applied when `useDirectionalMarkers: true` in configuration
- No need to manually embed markers in translation strings
- Engine detects mixed LTR/RTL content and applies appropriate markers

### 4. **Incorrect Number Formatting**

❌ **Wrong**: Using wrong numeral system
```typescript
// ❌ Wrong: Using Latin numerals for Arabic
service.formatNumberForLocale(123, 'ar'); // "123"
```

✅ **Correct**: Using appropriate numeral system
```typescript
// ✅ Correct: Using Arabic numerals for Arabic
service.formatNumberForLocale(123, 'ar'); // "١٢٣"
```

## 📈 **Performance Features**

### **Caching**

```typescript
// First call - processes pluralization
const result1 = service.translatePlural('FILES_COUNT', 5, 'ar');

// Second call - uses cache
const result2 = service.translatePlural('FILES_COUNT', 5, 'ar');

const stats = service.getStats();
console.log(stats.cacheHits); // 1
```

### **Validation**

```typescript
// Invalid plural rule (missing 'other' category)
const invalidRule = {
  'one': '1 item'
  // Missing 'other' category
};

// Service will log warning and use fallback
service.translatePlural('INVALID_KEY', 5, 'en');
// Returns: "INVALID_KEY (5)"
```

## 🎯 **Best Practices**

### 1. **Always Include 'other' Category**

```typescript
// ✅ Correct
"FILES_COUNT": {
  "one": "1 file",
  "other": "${count} files"  // Required fallback
}
```

### 2. **Use Locale-Specific Number Formatting**

```typescript
// ✅ Correct: Let the service handle number formatting
"FILES_COUNT": {
  "other": "${count} files"  // Service will format count
}
```

### 3. **Test All Plural Categories**

```typescript
// Test all possible plural categories for the locale
const categories = service.getPluralCategories('ar');
categories.forEach(category => {
  // Test with appropriate count for each category
});
```

### 4. **Handle Missing Translations Gracefully**

```typescript
// Service provides fallback for missing plural rules
service.translatePlural('MISSING_KEY', 5, 'en');
// Returns: "MISSING_KEY (5)"
```

## 🔧 **Migration Guide**

### **From Simple Pluralization**

```typescript
// ❌ Old approach
const message = count === 1 ? '1 file' : `${count} files`;

// ✅ New approach
const message = service.translatePlural('FILES_COUNT', count, locale);
```

### **From Manual RTL Handling**

```typescript
// ❌ Old approach
let message = count === 1 ? '1 ملف' : `${count} ملفات`;
if (locale === 'ar') {
  message = '\u202B' + message + '\u202C';
}

// ✅ New approach
const message = service.translatePlural('FILES_COUNT', count, 'ar');
```

## 📚 **Complete Example**

```typescript
import { Injectable } from '@nestjs/common';
import { TranslationService } from '@logistically/i18n';

@Injectable()
export class FileUploadService {
  constructor(private translationService: TranslationService) {}

  async uploadFiles(files: File[], locale: string) {
    const fileCount = files.length;
    
    // Get pluralized message
    const message = this.translationService.translatePlural(
      'UPLOAD_PROGRESS', 
      fileCount, 
      locale
    );

    // Get detailed result for analytics
    const result = this.translationService.translatePluralWithResult(
      'FILES_COUNT', 
      fileCount, 
      locale
    );

    console.log('Pluralization details:', {
      category: result.category,
      isRTL: result.rtl?.isRTL,
      numberingSystem: result.numberFormat?.numberingSystem
    });

    return {
      message,
      fileCount,
      locale
    };
  }
}
```

This comprehensive RTL pluralization engine handles all the complex scenarios that other i18n libraries often miss, providing a truly internationalized experience for RTL language users.
