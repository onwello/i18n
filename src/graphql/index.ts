// GraphQL integration for @logistically/i18n
export { ApolloI18nPlugin } from './apollo-plugin';
export { GraphQLTranslationUtils, TranslatedField } from './utilities';
export { i18nSchemaExtensions, exampleSchema, I18nSchemaUtils } from './schema-extensions';

// Re-export types for convenience
export type { ApolloI18nConfig } from './apollo-plugin';
export type { GraphQLContext } from './utilities'; 