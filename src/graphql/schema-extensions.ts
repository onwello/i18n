// Define GraphQL schema extensions without external dependencies

/**
 * GraphQL schema extensions for i18n functionality
 */
export const i18nSchemaExtensions = `
  # i18n directive for field-level translation
  directive @i18n(
    key: String!
    params: JSON
  ) on FIELD_DEFINITION

  # i18n configuration type
  type I18nConfig {
    defaultLocale: String!
    supportedLocales: [String!]!
    currentLocale: String!
  }

  # Translation type
  type Translation {
    key: String!
    text: String!
    locale: String!
    params: JSON
    metadata: TranslationMetadata
  }

  # Translation metadata
  type TranslationMetadata {
    isRTL: Boolean
    direction: String
    script: String
    languageName: String
  }

  # Extend Query type with i18n queries
  extend type Query {
    # Get translations for specific keys
    translations(locale: String!, keys: [String!]!): [Translation!]!

    # Get i18n configuration
    i18nConfig: I18nConfig!

    # Get supported locales
    supportedLocales: [String!]!
  }
`;

/**
 * Example schema showing how to use @i18n directive
 */
export const exampleSchema = `
  type User {
    id: ID!
    name: String! @i18n(key: "USER.NAME")
    bio: String @i18n(key: "USER.BIO")
    location: String @i18n(key: "USER.LOCATION")
    status: String! @i18n(key: "USER.STATUS")
  }

  type Product {
    id: ID!
    name: String! @i18n(key: "PRODUCT.NAME")
    description: String! @i18n(key: "PRODUCT.DESCRIPTION")
    category: String! @i18n(key: "PRODUCT.CATEGORY")
    status: String! @i18n(key: "PRODUCT.STATUS", params: { status: "status" })
  }

  type Order {
    id: ID!
    status: String! @i18n(key: "ORDER.STATUS")
    message: String! @i18n(key: "ORDER.MESSAGE", params: { status: "status", orderId: "id" })
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    product(id: ID!): Product
    products: [Product!]!
    order(id: ID!): Order
    orders: [Order!]!
  }
`;

/**
 * Utility to create i18n resolvers
 */
export class I18nSchemaUtils {
  /**
   * Create i18n configuration resolver
   */
  static createI18nConfigResolver(
    defaultLocale: string,
    supportedLocales: string[],
    currentLocaleExtractor: (context: any) => string
  ) {
    return {
      Query: {
        i18nConfig: (parent: any, args: any, context: any) => ({
          defaultLocale,
          supportedLocales,
          currentLocale: currentLocaleExtractor(context)
        }),
        
        supportedLocales: () => supportedLocales,
        
        translations: (parent: any, args: any, context: any) => {
          const { locale, keys } = args;
          const { translationService } = context;
          
          if (!translationService) {
            throw new Error('Translation service not available in context');
          }
          
          return keys.map((key: string) => ({
            key,
            text: translationService.translate(key, locale),
            locale,
            params: {},
            metadata: {
              isRTL: false, // You can enhance this with RTL detection
              direction: 'ltr',
              script: 'Latn',
              languageName: 'English'
            }
          }));
        }
      }
    };
  }

  /**
   * Create a simple resolver that uses translation service
   */
  static createTranslatedResolver(
    translationService: any,
    key: string,
    localeExtractor: (context: any) => string = (ctx) => ctx.locale || 'en'
  ) {
    return (parent: any, args: any, context: any) => {
      const locale = localeExtractor(context);
      const params = { ...args, ...parent };
      
      return translationService.translate(key, locale, params);
    };
  }
} 