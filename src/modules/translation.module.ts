import { Module, DynamicModule, Global } from '@nestjs/common';
import { TranslationService } from '../services/translation.service';
import { TranslationConfig } from '../interfaces/translation-config.interface';

/**
 * Translation module for NestJS
 * Provides a globally available translation service
 */
@Global()
@Module({})
export class TranslationModule {
  /**
   * Create a configured translation module
   */
  static forRoot(config: TranslationConfig): DynamicModule {
    return {
      module: TranslationModule,
      providers: [
        {
          provide: TranslationService,
          useFactory: () => new TranslationService(config),
        },
      ],
      exports: [TranslationService],
    };
  }

  /**
   * Create a translation module with async configuration
   */
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<TranslationConfig> | TranslationConfig;
    inject?: any[];
  }): DynamicModule {
    return {
      module: TranslationModule,
      providers: [
        {
          provide: TranslationService,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return new TranslationService(config);
          },
          inject: options.inject || [],
        },
      ],
      exports: [TranslationService],
    };
  }
} 