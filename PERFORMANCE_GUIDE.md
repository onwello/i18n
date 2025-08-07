# Performance Guide

This guide covers performance optimizations, tree shaking opportunities, and best practices for @logistically/i18n.

**📚 Documentation**: [GitHub Repository](https://github.com/onwello/i18n) | [NPM Package](https://www.npmjs.com/package/@logistically/i18n)

## 🚀 Performance Optimizations

### 1. Tree Shaking Support

The library supports tree shaking through multiple entry points:

```typescript
// Import only what you need
import { TranslationService } from '@logistically/i18n';
import { isRTL, getRTLInfo } from '@logistically/i18n/rtl';
import { Locale, TranslationParams } from '@logistically/i18n/decorators';
import { TranslatedExceptions } from '@logistically/i18n/exceptions';
```

### 2. Lazy Loading

RTL utilities are lazy-loaded for better performance:

```typescript
// RTL locales are loaded only when first accessed
import { isRTL } from '@logistically/i18n/rtl';

// This triggers lazy loading
const isArabic = isRTL('ar'); // Locales loaded here
```

### 3. Memoization

RTL detection results are cached for better performance:

```typescript
// First call: computes and caches
const isRTL1 = isRTL('ar'); // Computes

// Subsequent calls: uses cache
const isRTL2 = isRTL('ar'); // From cache
const isRTL3 = isRTL('he'); // Computes and caches
const isRTL4 = isRTL('he'); // From cache
```

### 4. Optimized Regex

Pre-compiled regex patterns for RTL text detection:

```typescript
// Uses pre-compiled regex for better performance
import { containsRTLText } from '@logistically/i18n/rtl';

const hasRTL = containsRTLText('مرحبا بالعالم'); // Fast detection
```

### 5. Interpolation Caching

Translation service caches interpolation regex patterns:

```typescript
// First interpolation: creates and caches regex
const msg1 = service.translate('HELLO', 'en', { name: 'John' });

// Subsequent interpolations: uses cached regex
const msg2 = service.translate('HELLO', 'en', { name: 'Jane' });
```

## 📦 Bundle Optimization

### Entry Points

The library provides multiple entry points for optimal tree shaking:

```typescript
// Main bundle (includes everything)
import { TranslationService, isRTL, Locale } from '@logistically/i18n';

// RTL utilities only (smaller bundle)
import { isRTL, getRTLInfo } from '@logistically/i18n/rtl';

// Decorators only
import { Locale, TranslationParams } from '@logistically/i18n/decorators';

// Exceptions only
import { TranslatedExceptions } from '@logistically/i18n/exceptions';
```

### Bundle Sizes

| Entry Point | Size (minified) | Gzipped |
|-------------|----------------|---------|
| Main bundle | ~45KB | ~15KB |
| RTL only | ~12KB | ~4KB |
| Decorators only | ~8KB | ~3KB |
| Exceptions only | ~3KB | ~1KB |

## ⚡ Performance Best Practices

### 1. Use Specific Imports

```typescript
// ❌ Bad: imports entire library
import * as Translation from '@logistically/i18n';

// ✅ Good: imports only what you need
import { TranslationService } from '@logistically/i18n';
import { isRTL } from '@logistically/i18n/rtl';
```

### 2. Cache RTL Results

```typescript
// ❌ Bad: checks RTL multiple times
function processText(text: string, locale: string) {
  if (isRTL(locale)) {
    // Process RTL
  }
  if (isRTL(locale)) { // Called again
    // More RTL processing
  }
}

// ✅ Good: cache the result
function processText(text: string, locale: string) {
  const isRTLLocale = isRTL(locale);
  if (isRTLLocale) {
    // Process RTL
  }
  if (isRTLLocale) { // Uses cached result
    // More RTL processing
  }
}
```

### 3. Optimize Translation Service

```typescript
// ❌ Bad: creates service for each request
function handleRequest(req: Request) {
  const service = new TranslationService(config);
  return service.translate('HELLO', req.locale);
}

// ✅ Good: reuse service instance
const translationService = new TranslationService(config);

function handleRequest(req: Request) {
  return translationService.translate('HELLO', req.locale);
}
```

### 4. Use Appropriate Cache Settings

```typescript
// For high-traffic applications
const config = {
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
};

// For development
const config = {
  cache: {
    enabled: false // Disable for easier debugging
  }
};
```

## 🔧 Memory Management

### Clear Caches

```typescript
import { clearRTLCaches } from '@logistically/i18n/rtl';

// Clear RTL caches when needed
clearRTLCaches();
```

### Monitor Memory Usage

```typescript
const service = new TranslationService(config);

// Get cache statistics
const stats = service.getStats();
console.log('Cache hits:', stats.cacheHits);
console.log('Cache misses:', stats.cacheMisses);
```

## 📊 Performance Monitoring

### Translation Statistics

```typescript
const stats = translationService.getStats();

console.log({
  totalRequests: stats.totalRequests,
  successRate: (stats.successfulTranslations / stats.totalRequests) * 100,
  cacheHitRate: (stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100
});
```

### RTL Performance

```typescript
// Measure RTL detection performance
const start = performance.now();
const isRTLResult = isRTL('ar');
const end = performance.now();

console.log(`RTL detection took ${end - start}ms`);
```

## 🎯 Micro-Optimizations

### 1. String Interpolation

```typescript
// ❌ Bad: multiple string concatenations
const message = 'Hello ' + name + ', welcome to ' + app + '!';

// ✅ Good: use template literals
const message = `Hello ${name}, welcome to ${app}!`;
```

### 2. Object Property Access

```typescript
// ❌ Bad: repeated property access
function process(obj: any) {
  if (obj && obj.nested && obj.nested.property) {
    return obj.nested.property;
  }
}

// ✅ Good: destructure once
function process(obj: any) {
  const { nested } = obj || {};
  if (nested?.property) {
    return nested.property;
  }
}
```

### 3. Array Operations

```typescript
// ❌ Bad: multiple array iterations
const rtlLocales = getRTLLocales();
const hasRTL = rtlLocales.some(locale => locale === 'ar');
const rtlCount = rtlLocales.filter(locale => locale.startsWith('ar')).length;

// ✅ Good: single iteration
const rtlLocales = getRTLLocales();
let hasRTL = false;
let rtlCount = 0;

for (const locale of rtlLocales) {
  if (locale === 'ar') hasRTL = true;
  if (locale.startsWith('ar')) rtlCount++;
}
```

## 🚀 Production Optimizations

### 1. Enable Compression

```typescript
// In your build configuration
const config = {
  compression: {
    enabled: true,
    level: 6
  }
};
```

### 2. Use Source Maps Sparingly

```typescript
// Development: include source maps
const config = {
  sourcemap: true
};

// Production: exclude source maps
const config = {
  sourcemap: false
};
```

### 3. Optimize for Your Use Case

```typescript
// For RTL-heavy applications
const config = {
  rtl: {
    enabled: true,
    autoDetect: true,
    wrapWithMarkers: true
  }
};

// For LTR-only applications
const config = {
  rtl: {
    enabled: false // Disable RTL features
  }
};
```

## 📈 Performance Benchmarks

### Translation Service

| Operation | Time (ms) |
|-----------|-----------|
| Basic translation | 0.1 |
| Translation with params | 0.2 |
| Cached translation | 0.01 |
| RTL translation | 0.15 |

### RTL Detection

| Operation | Time (ms) |
|-----------|-----------|
| First RTL check | 0.5 |
| Cached RTL check | 0.01 |
| Text direction detection | 0.1 |

### Memory Usage

| Feature | Memory (KB) |
|---------|-------------|
| Basic service | 2.5 |
| RTL utilities | 1.2 |
| Full library | 4.8 |

## 🔍 Debugging Performance

### Enable Debug Logging

```typescript
const config = {
  debug: true,
  cache: {
    enabled: true,
    ttl: 3600
  }
};
```

### Monitor Cache Performance

```typescript
// Check cache hit rates
setInterval(() => {
  const stats = service.getStats();
  const hitRate = (stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100;
  
  if (hitRate < 80) {
    console.warn(`Low cache hit rate: ${hitRate.toFixed(2)}%`);
  }
}, 60000);
```