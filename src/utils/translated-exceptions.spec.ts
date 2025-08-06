import { Test, TestingModule } from '@nestjs/testing';
import { ModuleRef } from '@nestjs/core';
import { 
  BadRequestException, 
  UnauthorizedException, 
  NotFoundException, 
  ForbiddenException, 
  ConflictException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { TranslatedExceptions, T, Ex } from './translated-exceptions';
import { TranslationService } from '../services/translation.service';
import { TranslationConfig } from '../interfaces/translation-config.interface';

describe('TranslatedExceptions', () => {
  let moduleRef: ModuleRef;
  let translationService: TranslationService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TranslationService,
          useFactory: () => new TranslationService(mockConfig),
        },
      ],
    }).compile();

    moduleRef = module.get<ModuleRef>(ModuleRef);
    translationService = module.get<TranslationService>(TranslationService);
    
    // Mock the translation service methods
    jest.spyOn(translationService, 'translateWithOptions').mockImplementation((key, options) => {
      return `Translated: ${key}`;
    });
    
    jest.spyOn(translationService, 'translate').mockImplementation((key, locale, params) => {
      return `Translated: ${key}`;
    });

    // Set the module ref for TranslatedExceptions
    TranslatedExceptions.setModuleRef(moduleRef);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setModuleRef', () => {
    it('should set the module ref', () => {
      const newModuleRef = {} as ModuleRef;
      TranslatedExceptions.setModuleRef(newModuleRef);
      
      // Test that the module ref was set by checking if it throws the expected error
      expect(() => TranslatedExceptions.badRequest('TEST.KEY')).toThrow(
        'TranslationService not found. Make sure it is properly registered in your module.'
      );
    });
  });

  describe('badRequest', () => {
    it('should create a BadRequestException with translated message', () => {
      const exception = TranslatedExceptions.badRequest('TEST.KEY');
      
      expect(exception).toBeInstanceOf(BadRequestException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', {});
    });

    it('should create a BadRequestException with options', () => {
      const options = { locale: 'fr', params: { name: 'John' } };
      const exception = TranslatedExceptions.badRequest('TEST.KEY', options);
      
      expect(exception).toBeInstanceOf(BadRequestException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', options);
    });
  });

  describe('unauthorized', () => {
    it('should create an UnauthorizedException with translated message', () => {
      const exception = TranslatedExceptions.unauthorized('TEST.KEY');
      
      expect(exception).toBeInstanceOf(UnauthorizedException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', {});
    });
  });

  describe('notFound', () => {
    it('should create a NotFoundException with translated message', () => {
      const exception = TranslatedExceptions.notFound('TEST.KEY');
      
      expect(exception).toBeInstanceOf(NotFoundException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', {});
    });
  });

  describe('forbidden', () => {
    it('should create a ForbiddenException with translated message', () => {
      const exception = TranslatedExceptions.forbidden('TEST.KEY');
      
      expect(exception).toBeInstanceOf(ForbiddenException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', {});
    });
  });

  describe('conflict', () => {
    it('should create a ConflictException with translated message', () => {
      const exception = TranslatedExceptions.conflict('TEST.KEY');
      
      expect(exception).toBeInstanceOf(ConflictException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', {});
    });
  });

  describe('http', () => {
    it('should create a custom HttpException with translated message', () => {
      const exception = TranslatedExceptions.http('TEST.KEY', HttpStatus.INTERNAL_SERVER_ERROR);
      
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', {});
    });

    it('should create a custom HttpException with options', () => {
      const options = { locale: 'fr', params: { name: 'John' } };
      const exception = TranslatedExceptions.http('TEST.KEY', HttpStatus.BAD_GATEWAY, options);
      
      expect(exception).toBeInstanceOf(HttpException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_GATEWAY);
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', options);
    });
  });

  describe('create', () => {
    it('should create a custom exception with translation', () => {
      class CustomException extends HttpException {
        constructor(message: string) {
          super(message, HttpStatus.I_AM_A_TEAPOT);
        }
      }

      const exception = TranslatedExceptions.create(
        CustomException,
        'TEST.KEY',
        HttpStatus.I_AM_A_TEAPOT
      );
      
      expect(exception).toBeInstanceOf(CustomException);
      expect(exception.message).toBe('Translated: TEST.KEY');
      expect(exception.getStatus()).toBe(HttpStatus.I_AM_A_TEAPOT);
      expect(translationService.translateWithOptions).toHaveBeenCalledWith('TEST.KEY', {});
    });
  });

  describe('t (quick translation)', () => {
    it('should provide quick translation', () => {
      const result = TranslatedExceptions.t('TEST.KEY', 'fr', { name: 'John' });
      
      expect(result).toBe('Translated: TEST.KEY');
      expect(translationService.translate).toHaveBeenCalledWith('TEST.KEY', 'fr', { name: 'John' });
    });

    it('should provide quick translation with default locale', () => {
      const result = TranslatedExceptions.t('TEST.KEY');
      
      expect(result).toBe('Translated: TEST.KEY');
      expect(translationService.translate).toHaveBeenCalledWith('TEST.KEY', undefined, undefined);
    });
  });

  describe('Aliases', () => {
    it('should provide T alias for TranslatedExceptions', () => {
      expect(T).toBe(TranslatedExceptions);
    });

    it('should provide Ex alias for TranslatedExceptions', () => {
      expect(Ex).toBe(TranslatedExceptions);
    });

    it('should work with T alias', () => {
      const exception = T.badRequest('TEST.KEY');
      
      expect(exception).toBeInstanceOf(BadRequestException);
      expect(exception.message).toBe('Translated: TEST.KEY');
    });

    it('should work with Ex alias', () => {
      const exception = Ex.notFound('TEST.KEY');
      
      expect(exception).toBeInstanceOf(NotFoundException);
      expect(exception.message).toBe('Translated: TEST.KEY');
    });
  });

  describe('Error handling', () => {
    it('should throw error when ModuleRef is not set', () => {
      TranslatedExceptions.setModuleRef(null as any);
      
      expect(() => TranslatedExceptions.badRequest('TEST.KEY')).toThrow(
        'ModuleRef not set. Call TranslatedExceptions.setModuleRef() in your service initialization.'
      );
    });

    it('should throw error when TranslationService is not found', () => {
      const mockModuleRef = {
        get: jest.fn().mockImplementation(() => {
          throw new Error('Service not found');
        })
      } as any;
      
      TranslatedExceptions.setModuleRef(mockModuleRef);
      
      expect(() => TranslatedExceptions.badRequest('TEST.KEY')).toThrow(
        'TranslationService not found. Make sure it is properly registered in your module.'
      );
    });
  });
}); 