# Translation Decorators Guide

This guide covers the enhanced decorators that support multiple locale sources including JWT tokens, cookies, headers, and query parameters.

## Overview

Onwello/i18n provides several decorators to extract locale information from different sources in your NestJS application. The decorators follow a priority order to ensure consistent locale detection across your application.

## Available Decorators

### 1. `@Locale()` - Multi-Source Locale Extraction

The main decorator that extracts locale from multiple sources in priority order:

1. **JWT Token** (highest priority)
2. **Cookies**
3. **Headers**
4. **Query Parameters**
5. **Default** (fallback to 'en')

```typescript
import { Controller, Get } from '@nestjs/common';
import { Locale } from '@onwello/i18n';

@Controller('api')
export class UserController {
  @Get('profile')
  async getProfile(@Locale() locale: string) {
    // locale will be extracted from JWT token, cookies, headers, or query params
    return { message: 'Profile loaded', locale };
  }
}
```

### 2. `@LocaleFromJWT()` - JWT Token Only

Extracts locale specifically from JWT tokens in the Authorization header.

```typescript
import { Controller, Get } from '@nestjs/common';
import { LocaleFromJWT } from '@onwello/i18n';

@Controller('api')
export class UserController {
  @Get('profile')
  async getProfile(@LocaleFromJWT() locale: string | null) {
    // locale will be null if no JWT token or no locale in token
    return { message: 'Profile loaded', locale };
  }
}
```

### 3. `@LocaleFromCookies()` - Cookies Only

Extracts locale specifically from cookies.

```typescript
import { Controller, Get } from '@nestjs/common';
import { LocaleFromCookies } from '@onwello/i18n';

@Controller('api')
export class UserController {
  @Get('profile')
  async getProfile(@LocaleFromCookies() locale: string | null) {
    // locale will be null if no locale cookie
    return { message: 'Profile loaded', locale };
  }
}
```

### 4. `@LocaleFromHeaders()` - Headers Only

Extracts locale specifically from HTTP headers.

```typescript
import { Controller, Get } from '@nestjs/common';
import { LocaleFromHeaders } from '@onwello/i18n';

@Controller('api')
export class UserController {
  @Get('profile')
  async getProfile(@LocaleFromHeaders() locale: string | null) {
    // locale will be null if no locale headers
    return { message: 'Profile loaded', locale };
  }
}
```

### 5. `@LocaleFromQuery()` - Query Parameters Only

Extracts locale specifically from query parameters.

```typescript
import { Controller, Get } from '@nestjs/common';
import { LocaleFromQuery } from '@onwello/i18n';

@Controller('api')
export class UserController {
  @Get('profile')
  async getProfile(@LocaleFromQuery() locale: string | null) {
    // locale will be null if no locale query parameter
    return { message: 'Profile loaded', locale };
  }
}
```

## JWT Token Format

The JWT token should contain locale information in one of these fields:

```json
{
  "sub": "user123",
  "iat": 1516239022,
  "locale": "fr",        // Preferred field name
  "language": "es",      // Alternative field name
  "lang": "de"          // Alternative field name
}
```

## Cookie Format

Cookies can use any of these names:

```javascript
// Set cookie in your application
res.cookie('locale', 'fr');
res.cookie('language', 'es');
res.cookie('lang', 'de');
```

## Header Format

Supported headers:

```http
Accept-Language: fr
X-Locale: es
Accept-Locale: de
```

## Query Parameter Format

Supported query parameters:

```http
GET /api/profile?locale=fr
GET /api/profile?language=es
GET /api/profile?lang=de
```

## Complete Example

Here's a complete example showing how to use all decorators together:

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { 
  Locale, 
  LocaleFromJWT, 
  LocaleFromCookies, 
  LocaleFromHeaders, 
  LocaleFromQuery,
  TranslationService,
  TranslationParams 
} from '@onwello/i18n';

@Controller('api')
export class UserController {
  constructor(private readonly translationService: TranslationService) {}

  @Get('profile')
  async getProfile(
    @Locale() locale: string,
    @LocaleFromJWT() jwtLocale: string | null,
    @LocaleFromCookies() cookieLocale: string | null,
    @LocaleFromHeaders() headerLocale: string | null,
    @LocaleFromQuery() queryLocale: string | null
  ) {
    const message = this.translationService.translate('PROFILE.LOADED', locale);
    
    return {
      message,
      detectedLocale: locale,
      sources: {
        jwt: jwtLocale,
        cookie: cookieLocale,
        header: headerLocale,
        query: queryLocale
      }
    };
  }

  @Post('update')
  async updateProfile(
    @Locale() locale: string,
    @TranslationParams() params: any
  ) {
    const message = this.translationService.translate('PROFILE.UPDATED', locale, params);
    
    return {
      message,
      locale,
      params
    };
  }
}
```

## Priority Order

The `@Locale()` decorator follows this priority order:

1. **JWT Token** - Highest priority, most secure
2. **Cookies** - Persistent across sessions
3. **Headers** - Standard HTTP headers
4. **Query Parameters** - URL-based
5. **Default** - Falls back to 'en'

## Error Handling

All decorators handle errors gracefully:

- **JWT Token**: Returns `null` for malformed tokens
- **Cookies**: Returns `null` for missing cookies
- **Headers**: Returns `null` for missing headers
- **Query Parameters**: Returns `null` for missing parameters

## Security Considerations

### JWT Token Security

- Always validate JWT tokens before using them
- Consider using a proper JWT library for production
- The decorator only extracts locale, doesn't validate the token

### Cookie Security

- Use `httpOnly` and `secure` flags for sensitive cookies
- Consider using signed cookies for additional security

### Header Security

- Be aware that headers can be easily spoofed by clients
- Use headers for non-sensitive locale information

## Best Practices

1. **Use `@Locale()` for most cases** - It provides the best user experience
2. **Use specific decorators for debugging** - When you need to know the source
3. **Set up proper fallbacks** - Always handle null values
4. **Validate locales** - Ensure the detected locale is supported
5. **Log locale detection** - For debugging and analytics

## Example with Validation

```typescript
import { Controller, Get, BadRequestException } from '@nestjs/common';
import { Locale, TranslationService } from '@onwello/i18n';

@Controller('api')
export class UserController {
  constructor(private readonly translationService: TranslationService) {}

  @Get('profile')
  async getProfile(@Locale() locale: string) {
    // Validate that the locale is supported
    const supportedLocales = this.translationService.getAvailableLocales();
    
    if (!supportedLocales.includes(locale)) {
      throw new BadRequestException(`Unsupported locale: ${locale}`);
    }

    const message = this.translationService.translate('PROFILE.LOADED', locale);
    
    return {
      message,
      locale,
      supportedLocales
    };
  }
}
```

## Testing

When testing your controllers, you can mock the request object:

```typescript
describe('UserController', () => {
  it('should extract locale from JWT token', async () => {
    const jwtPayload = { locale: 'fr', sub: 'user123' };
    const jwtToken = `header.${Buffer.from(JSON.stringify(jwtPayload)).toString('base64')}.signature`;
    
    const request = {
      headers: { authorization: `Bearer ${jwtToken}` },
      cookies: {},
      query: {}
    };

    // Test your controller with this request
  });
});
```
