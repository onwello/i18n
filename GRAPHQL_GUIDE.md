# GraphQL Integration Guide

This guide shows you how to integrate the @logistically/i18n library with your Apollo GraphQL server.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# In your GraphQL project
npm install @apollo/server graphql graphql-tag
npm install @logistically/i18n
```

### 2. Setup Apollo Server with i18n

```typescript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloI18nPlugin, i18nSchemaExtensions } from '@logistically/i18n/graphql';
import { TranslationService } from '@logistically/i18n';

// Create translation service
const translationService = new TranslationService({
  serviceName: 'graphql-service',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr', 'es', 'ar'],
  translationsPath: 'src/translations'
});

// Create Apollo server with i18n plugin
const server = new ApolloServer({
  typeDefs: [yourSchema, i18nSchemaExtensions],
  resolvers: [yourResolvers],
  plugins: [
    new ApolloI18nPlugin({
      translationService,
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr', 'es', 'ar']
    })
  ]
});
```

### 3. Use @i18n Directive

```graphql
type User {
  id: ID!
  name: String! @i18n(key: "USER.NAME")
  bio: String @i18n(key: "USER.BIO")
  status: String! @i18n(key: "USER.STATUS")
}

type Product {
  id: ID!
  name: String! @i18n(key: "PRODUCT.NAME")
  description: String! @i18n(key: "PRODUCT.DESCRIPTION")
  status: String! @i18n(key: "PRODUCT.STATUS", params: { status: "status" })
}
```

### 4. Query with Locale

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name  # Automatically translated based on Accept-Language header
    bio   # Automatically translated
    status # Automatically translated
  }
}
```

## 📋 Features

### 1. Apollo Plugin
- **Automatic locale detection** from HTTP headers
- **Field-level translation** with @i18n directive
- **Context enhancement** with translation service
- **Parameter interpolation** support

### 2. GraphQL Utilities
- **Locale extraction** from multiple sources
- **Parameter extraction** from GraphQL arguments
- **Translation key generation** utilities
- **Locale validation** functions

### 3. Schema Extensions
- **@i18n directive** for field-level translation
- **i18nConfig and Translation types**
- **Built-in i18n queries**

## 🎯 Usage Examples

### Basic Setup

```typescript
import { ApolloI18nPlugin, GraphQLTranslationUtils } from '@logistically/i18n/graphql';

const server = new ApolloServer({
  typeDefs: [yourSchema],
  resolvers: [yourResolvers],
  plugins: [
    new ApolloI18nPlugin({
      translationService,
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr', 'es', 'ar'],
      localeExtractor: (context) => {
        // Custom locale extraction logic
        return context.user?.locale || 'en';
      }
    })
  ]
});
```

### Custom Resolvers

```typescript
import { TranslatedField } from '@logistically/i18n/graphql';

class UserResolver {
  @TranslatedField('USER.NAME')
  async name(parent: any, args: any, context: any) {
    // Your resolver logic here
    return parent.name;
  }

  @TranslatedField('USER.STATUS')
  async status(parent: any, args: any, context: any) {
    return parent.status;
  }
}
```

### Manual Translation

```typescript
import { GraphQLTranslationUtils } from '@logistically/i18n/graphql';

const resolvers = {
  User: {
    name: (parent: any, args: any, context: any) => {
      const locale = GraphQLTranslationUtils.extractLocale(context);
      const params = GraphQLTranslationUtils.extractParams(args, parent);
      
      return context.translationService.translate('USER.NAME', locale, params);
    }
  }
};
```

## 🔧 Configuration

### Apollo Plugin Configuration

```typescript
interface ApolloI18nConfig {
  translationService: TranslationService;
  defaultLocale?: string;
  supportedLocales?: string[];
  localeExtractor?: (context: any) => string;
}
```

### Locale Detection

The plugin automatically detects locale from:
1. `context.locale` - Direct locale setting
2. `Accept-Language` header - Standard HTTP header
3. `X-Locale` header - Custom header
4. `context.user.locale` - User preferences
5. Default locale - Fallback

### Custom Locale Extraction

```typescript
const customLocaleExtractor = (context: any) => {
  // Your custom logic here
  return context.headers?.['x-custom-locale'] || 'en';
};

new ApolloI18nPlugin({
  translationService,
  localeExtractor: customLocaleExtractor
});
```

## 📊 Performance

### Caching
- Translation service caching is automatically used
- GraphQL field-level caching works with translations
- Apollo cache integration for repeated queries

### Optimization
- Lazy loading of translation files
- Batch translation requests
- Minimal overhead per field

## 🧪 Testing

### Unit Tests

```typescript
import { ApolloI18nPlugin } from '@logistically/i18n/graphql';

describe('ApolloI18nPlugin', () => {
  it('should translate fields with @i18n directive', async () => {
    const plugin = new ApolloI18nPlugin({
      translationService: mockTranslationService,
      defaultLocale: 'en'
    });

    // Test your plugin here
  });
});
```

### Integration Tests

```typescript
import { startStandaloneServer } from '@apollo/server/standalone';

describe('GraphQL i18n Integration', () => {
  it('should return translated user data', async () => {
    const { url } = await startStandaloneServer(server);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'fr'
      },
      body: JSON.stringify({
        query: `
          query GetUser($id: ID!) {
            user(id: $id) {
              id
              name
              status
            }
          }
        `,
        variables: { id: '1' }
      })
    });

    const result = await response.json();
    expect(result.data.user.name).toBe('Nom d\'utilisateur'); // French translation
  });
});
```

## 🚀 Advanced Usage

### RTL Support

```typescript
// RTL languages are automatically detected
const server = new ApolloServer({
  plugins: [
    new ApolloI18nPlugin({
      translationService,
      supportedLocales: ['en', 'fr', 'ar', 'he'] // Includes RTL languages
    })
  ]
});
```

### Custom Directives

```graphql
type Product {
  id: ID!
  name: String! @i18n(key: "PRODUCT.NAME")
  description: String! @i18n(key: "PRODUCT.DESCRIPTION")
  price: Float!
  # Custom directive with parameters
  status: String! @i18n(key: "PRODUCT.STATUS", params: { status: "status", category: "category" })
}
```

### Batch Translation

```graphql
query GetTranslations($locale: String!, $keys: [String!]!) {
  translations(locale: $locale, keys: $keys) {
    key
    text
    locale
    metadata {
      isRTL
      direction
    }
  }
}
```

## 📚 Migration Guide

### From Manual Translation

```typescript
// Before: Manual translation in resolvers
const resolvers = {
  User: {
    name: (parent, args, context) => {
      const locale = context.locale || 'en';
      return translate('USER.NAME', locale, { userId: parent.id });
    }
  }
};

// After: Using @i18n directive
type User {
  id: ID!
  name: String! @i18n(key: "USER.NAME")
}
```

### From REST APIs

```typescript
// Before: REST with manual i18n
const user = await fetch('/api/users/1', {
  headers: { 'Accept-Language': 'fr' }
});

// After: GraphQL with automatic i18n
const user = await client.query({
  query: GET_USER,
  variables: { id: '1' },
  context: { headers: { 'Accept-Language': 'fr' } }
});
```

## 🆘 Troubleshooting

### Common Issues

1. **Translations not working**
   - Check if translation service is properly configured
   - Verify translation files exist
   - Ensure locale is being detected correctly

2. **@i18n directive not recognized**
   - Make sure schema extensions are included
   - Check Apollo Server configuration
   - Verify directive syntax

3. **Performance issues**
   - Enable translation service caching
   - Use Apollo cache effectively
   - Monitor translation file sizes

### Debug Mode

```typescript
const server = new ApolloServer({
  plugins: [
    new ApolloI18nPlugin({
      translationService,
      debug: true // Enable debug logging
    })
  ]
});
```

## 📞 Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/logistically/i18n/issues)
- **Documentation**: [Complete docs](https://docs.logistically.com/i18n/graphql)
- **Examples**: [GitHub examples](https://github.com/logistically/i18n/examples)

---

**GraphQL Integration v1.0.0** - Seamless i18n for Apollo GraphQL servers. 🚀 