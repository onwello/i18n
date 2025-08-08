import { 
  BadRequestException, 
  UnauthorizedException, 
  NotFoundException, 
  ForbiddenException, 
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { TranslationService } from '../services/translation.service';
import { TranslationParams, TranslationOptions } from '../interfaces/translation-config.interface';

/**
 * Enterprise-grade translated exception utilities
 * Features:
 * - Dependency injection via ModuleRef
 * - Elegant syntax
 * - Memory efficient
 * - Fully testable
 * - No circular dependencies
 * - Type safety
 */
export class TranslatedExceptions {
  private static moduleRef: ModuleRef;

  /**
   * Set the ModuleRef for dependency injection
   * This should be called once during service initialization
   */
  static setModuleRef(moduleRef: ModuleRef): void {
    TranslatedExceptions.moduleRef = moduleRef;
  }

  /**
   * Get the TranslationService instance
   */
  private static getTranslationService(): TranslationService {
    if (!this.moduleRef) {
      throw new Error(
        'ModuleRef not set. Call TranslatedExceptions.setModuleRef() in your service initialization.'
      );
    }
    
    try {
      return this.moduleRef.get(TranslationService, { strict: false });
    } catch (error) {
      throw new Error(
        'TranslationService not found. Make sure it is properly registered in your module.'
      );
    }
  }

  /**
   * Create a BadRequestException with translation
   */
  static badRequest(
    translationKey: string, 
    options: TranslationOptions = {}
  ): BadRequestException {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new BadRequestException(message);
  }

  /**
   * Create an UnauthorizedException with translation
   */
  static unauthorized(
    translationKey: string, 
    options: TranslationOptions = {}
  ): UnauthorizedException {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new UnauthorizedException(message);
  }

  /**
   * Create a NotFoundException with translation
   */
  static notFound(
    translationKey: string, 
    options: TranslationOptions = {}
  ): NotFoundException {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new NotFoundException(message);
  }

  /**
   * Create a ForbiddenException with translation
   */
  static forbidden(
    translationKey: string, 
    options: TranslationOptions = {}
  ): ForbiddenException {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new ForbiddenException(message);
  }

  /**
   * Create a ConflictException with translation
   */
  static conflict(
    translationKey: string, 
    options: TranslationOptions = {}
  ): ConflictException {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new ConflictException(message);
  }

  /**
   * Create an InternalServerErrorException with translation
   */
  static internalServerError(
    translationKey: string, 
    options: TranslationOptions = {}
  ): InternalServerErrorException {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new InternalServerErrorException(message);
  }

  /**
   * Create a custom HttpException with translation
   */
  static http(
    translationKey: string, 
    statusCode: HttpStatus,
    options: TranslationOptions = {}
  ): HttpException {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new HttpException(message, statusCode);
  }

  /**
   * Create any exception with translation (generic method)
   */
  static create<T extends HttpException>(
    ExceptionClass: new (message: string, statusCode?: HttpStatus) => T,
    translationKey: string,
    statusCode: HttpStatus,
    options: TranslationOptions = {}
  ): T {
    const translationService = this.getTranslationService();
    const message = translationService.translateWithOptions(translationKey, options);
    return new ExceptionClass(message, statusCode);
  }

  /**
   * Convenience method for quick translations
   */
  static t(
    translationKey: string,
    locale?: string,
    params?: TranslationParams
  ): string {
    const translationService = this.getTranslationService();
    return translationService.translate(translationKey, locale, params);
  }
}

/**
 * Convenience aliases for shorter syntax
 */
export const T = TranslatedExceptions;
export const Ex = TranslatedExceptions; 