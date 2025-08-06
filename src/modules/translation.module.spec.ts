import { Test, TestingModule } from '@nestjs/testing';
import { TranslationModule } from './translation.module';
import { TranslationService } from '../services/translation.service';
import { TranslationConfig } from '../interfaces/translation-config.interface';

describe('TranslationModule', () => {
  let module: TestingModule;

  const mockConfig: TranslationConfig = {
    serviceName: 'test-service',
    defaultLocale: 'en',
    supportedLocales: ['en', 'fr'],
    translationsPath: 'src/translations',
    debug: false,
    fallbackStrategy: 'default',
    cache: { enabled: true, ttl: 3600 },
    statistics: { enabled: true, trackKeyUsage: true, trackLocaleUsage: true }
  };

  describe('forRoot', () => {
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [TranslationModule.forRoot(mockConfig)],
      }).compile();
    });

    it('should create the module', () => {
      expect(module).toBeDefined();
    });

    it('should provide TranslationService', () => {
      const service = module.get<TranslationService>(TranslationService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(TranslationService);
    });

    it('should configure TranslationService with provided config', () => {
      const service = module.get<TranslationService>(TranslationService);
      expect(service).toBeDefined();
    });

    it('should export TranslationService', () => {
      const service = module.get<TranslationService>(TranslationService);
      expect(service).toBeDefined();
    });
  });

  describe('forRootAsync', () => {
    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [
          TranslationModule.forRootAsync({
            useFactory: () => mockConfig,
          }),
        ],
      }).compile();
    });

    it('should create the module with async configuration', () => {
      expect(module).toBeDefined();
    });

    it('should provide TranslationService with async config', () => {
      const service = module.get<TranslationService>(TranslationService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(TranslationService);
    });

    it('should export TranslationService with async config', () => {
      const service = module.get<TranslationService>(TranslationService);
      expect(service).toBeDefined();
    });
  });

  describe('forRootAsync with injectable factory', () => {
    it('should create module configuration', () => {
      const moduleConfig = TranslationModule.forRootAsync({
        inject: ['CONFIG'],
        useFactory: (config: TranslationConfig) => config,
      });
      
      expect(moduleConfig).toBeDefined();
      expect(moduleConfig.module).toBe(TranslationModule);
      expect(moduleConfig.providers).toBeDefined();
    });
  });
}); 