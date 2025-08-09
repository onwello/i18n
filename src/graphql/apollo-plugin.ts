import { ApolloServerPlugin } from '@apollo/server';
import { TranslationService } from '../services/translation.service';
import { GraphQLRequestContext } from '@apollo/server';

export interface ApolloI18nConfig {
  translationService: TranslationService;
  defaultLocale?: string;
  supportedLocales?: string[];
  localeExtractor?: (context: any) => string;
}

export class ApolloI18nPlugin implements ApolloServerPlugin {
  private translationService: TranslationService;
  private defaultLocale: string;
  private supportedLocales: string[];
  private localeExtractor: (context: any) => string;

  constructor(config: ApolloI18nConfig) {
    this.translationService = config.translationService;
    this.defaultLocale = config.defaultLocale || 'en';
    this.supportedLocales = config.supportedLocales || ['en'];
    this.localeExtractor = config.localeExtractor || this.defaultLocaleExtractor;
  }

  requestDidStart(): any {
    return {
      willResolveField: async (requestContext: any) => {
        const { contextValue, info } = requestContext;
        
        // Extract locale from context
        const locale = this.localeExtractor(contextValue);
        
        // Add translation service to context
        contextValue.translationService = this.translationService;
        contextValue.locale = locale;
        
        // Check for @i18n directive
        const i18nDirective = info.fieldNodes[0]?.directives?.find(
          (d: any) => d.name.value === 'i18n'
        );

        if (i18nDirective) {
          const key = this.extractDirectiveArgument(i18nDirective, 'key');
          const params = this.extractDirectiveArgument(i18nDirective, 'params');
          
          if (key) {
            // Replace the field value with translated text
            const translatedText = this.translationService.translate(
              key,
              locale,
              params || {}
            );
            
            // Override the resolver result
            return {
              result: translatedText
            };
          }
        }
      }
    };
  }

  private defaultLocaleExtractor(context: any): string {
    // Try multiple sources for locale
    return (
      context.locale ||
      context.headers?.['accept-language']?.split(',')[0]?.split('-')[0] ||
      context.headers?.['x-locale'] ||
      context.user?.locale ||
      this.defaultLocale
    );
  }

  private extractDirectiveArgument(directive: any, name: string): any {
    const arg = directive.arguments?.find((a: any) => a.name.value === name);
    return arg ? this.parseArgumentValue(arg.value) : null;
  }

  private parseArgumentValue(value: any): any {
    if (value.kind === 'StringValue') {
      return value.value;
    } else if (value.kind === 'ObjectValue') {
      // Parse object arguments (for params)
      const obj: any = {};
      value.fields.forEach((field: any) => {
        obj[field.name.value] = this.parseArgumentValue(field.value);
      });
      return obj;
    }
    return null;
  }
} 