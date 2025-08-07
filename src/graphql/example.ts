import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloI18nPlugin, i18nSchemaExtensions, I18nSchemaUtils } from './index';
import { TranslationService } from '../services/translation.service';

// Example GraphQL schema with i18n
const exampleSchema = `
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

  type Query {
    user(id: ID!): User
    users: [User!]!
    product(id: ID!): Product
    products: [Product!]!
  }
`;

// Example resolvers
const resolvers = {
  Query: {
    user: (parent: any, args: any) => ({
      id: args.id,
      name: 'John Doe',
      bio: 'Software developer',
      status: 'active'
    }),
    users: () => [
      { id: '1', name: 'John Doe', bio: 'Software developer', status: 'active' },
      { id: '2', name: 'Jane Smith', bio: 'Designer', status: 'inactive' }
    ],
    product: (parent: any, args: any) => ({
      id: args.id,
      name: 'Sample Product',
      description: 'A sample product description',
      status: 'available'
    }),
    products: () => [
      { id: '1', name: 'Product A', description: 'Description A', status: 'available' },
      { id: '2', name: 'Product B', description: 'Description B', status: 'out_of_stock' }
    ]
  }
};

// Create translation service
const translationService = new TranslationService({
  serviceName: 'graphql-example',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr', 'es', 'ar'],
  translationsPath: 'src/translations'
});

// Create i18n resolvers
const i18nResolvers = I18nSchemaUtils.createI18nConfigResolver(
  'en',
  ['en', 'fr', 'es', 'ar'],
  (context) => context.locale || 'en'
);

// Create Apollo server with i18n plugin
const server = new ApolloServer({
  typeDefs: [exampleSchema, i18nSchemaExtensions],
  resolvers: [resolvers, i18nResolvers],
  plugins: [
    new ApolloI18nPlugin({
      translationService,
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr', 'es', 'ar']
    })
  ]
});

// Example usage
export async function startExampleServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => ({
      // Extract locale from headers
      locale: req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en',
      headers: req.headers
    })
  });

  console.log(`🚀 Server ready at ${url}`);
  console.log(`📝 Try this query:`);
  console.log(`
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    bio
    status
  }
}
  `);
  console.log(`🌐 Add header: Accept-Language: fr`);

  return server;
}

// Example client usage
export const exampleQuery = `
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    bio
    status
  }
}
`;

export const exampleVariables = {
  id: '1'
};

export const exampleHeaders = {
  'Accept-Language': 'fr'
}; 