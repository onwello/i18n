import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  TranslationConfig,
  TranslationParams,
  TranslationOptions,
  TranslationMetadata,
  TranslationStats
} from '../interfaces/translation-config.interface';
import { isRTL, getRTLInfo, getTextDirection, wrapWithDirectionalMarkers, cleanDirectionalMarkers } from '../utils/rtl.utils';
import { 
  processRTLPluralization, 
  getPluralConfig, 
  formatNumberForLocale as formatNumberForLocaleUtil, 
  validatePluralRule,
  getSupportedRTLLocales,
  hasComplexPluralRules
} from '../utils/rtl-pluralization.utils';
import { PluralizationResult, PluralizationOptions } from '../interfaces/pluralization.interface';

/**
 * Enterprise-grade translation service
 * Features:
 * - Multi-locale support
 * - Parameter interpolation
 * - Caching with TTL
 * - Statistics tracking
 * - Fallback strategies
 * - Debug logging
 * - Error handling
 */
@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  
  private translations: Record<string, Record<string, string | Record<string, string>>> = {};
  private cache: Map<string, { value: string; timestamp: number }> = new Map();
  private interpolationCache: Map<string, RegExp> = new Map();
  private stats: TranslationStats = {
    totalRequests: 0,
    successfulTranslations: 0,
    failedTranslations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    localeUsage: {},
    keyUsage: {}
  };

  private config: TranslationConfig;

  constructor(config: TranslationConfig) {
    this.config = {
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr', 'es', 'de', 'ar'],
      translationsPath: 'src/translations',
      debug: false,
      interpolation: { prefix: '${', suffix: '}' },
      fallbackStrategy: 'default',
      cache: { enabled: true, ttl: 3600 },
      statistics: { enabled: true, trackKeyUsage: true, trackLocaleUsage: true },
      rtl: { enabled: true, autoDetect: true, wrapWithMarkers: false, includeDirectionalInfo: true },
      pluralization: { enabled: true, formatNumbers: true, useDirectionalMarkers: true, validatePluralRules: true, trackPluralizationStats: true },
      ...config
    };

    this.loadTranslations();
    this.logger.log(`TranslationService initialized for service: ${this.config.serviceName}`);
  }

  /**
   * Translate a key to the specified locale with parameter interpolation
   */
  translate(
    key: string,
    locale: string = this.config.defaultLocale!,
    params?: TranslationParams
  ): string {
    return this.translateWithOptions(key, { locale, params });
  }

  /**
   * Translate with full options
   */
  translateWithOptions(
    key: string,
    options: TranslationOptions = {}
  ): string {
    const { locale = this.config.defaultLocale!, params, useFallback = true } = options;
    
    // Update statistics
    this.updateStats(key, locale);
    
    // Check cache first
    const cacheKey = this.generateCacheKey(key, locale, params);
    if (this.config.cache?.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        if (this.config.statistics?.enabled) {
          this.stats.cacheHits++;
        }
        return cached;
      }
    }

    // Get translation
    let translation = this.getTranslation(key, locale, useFallback);
    
    // Interpolate parameters
    if (params) {
      translation = this.interpolateParams(translation, params);
    }

    // Cache the result
    if (this.config.cache?.enabled) {
      this.setCache(cacheKey, translation);
    }

    return translation;
  }

  /**
   * Get available locales
   */
  getAvailableLocales(): string[] {
    return Object.keys(this.translations);
  }

  /**
   * Check if a translation key exists
   */
  hasKey(key: string, locale: string = this.config.defaultLocale!): boolean {
    return !!(this.translations[locale]?.[key] || 
              (locale !== this.config.defaultLocale && this.translations[this.config.defaultLocale!]?.[key]));
  }

  /**
   * Get all keys for a locale
   */
  getKeys(locale: string = this.config.defaultLocale!): string[] {
    return Object.keys(this.translations[locale] || {});
  }

  /**
   * Get translation statistics
   */
  getStats(): TranslationStats {
    return { ...this.stats };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.debug('Translation cache cleared');
  }

  /**
   * Reload translations from files
   */
  reloadTranslations(): void {
    this.loadTranslations();
    this.clearCache();
    this.logger.log('Translations reloaded');
  }

  /**
   * Translate with RTL support
   */
  translateWithRTL(
    key: string,
    locale: string = this.config.defaultLocale!,
    params?: TranslationParams
  ): { text: string; rtl: { isRTL: boolean; direction: 'ltr' | 'rtl' | 'auto' } } {
    const text = this.translate(key, locale, params);
    const rtlInfo = getRTLInfo(locale);
    
    return {
      text,
      rtl: {
        isRTL: rtlInfo.isRTL,
        direction: rtlInfo.direction
      }
    };
  }

  /**
   * Translate with directional markers for RTL
   */
  translateWithDirectionalMarkers(
    key: string,
    locale: string = this.config.defaultLocale!,
    params?: TranslationParams
  ): string {
    const text = this.translate(key, locale, params);
    
    if (!this.config.rtl?.enabled) {
      return text;
    }

    const direction = getTextDirection(text);
    return wrapWithDirectionalMarkers(text, direction);
  }

  /**
   * Check if a locale is RTL
   */
  isRTLLocale(locale: string): boolean {
    return isRTL(locale);
  }

  /**
   * Get RTL information for a locale
   */
  getRTLInfo(locale: string): { isRTL: boolean; direction: 'ltr' | 'rtl'; script?: string; name?: string } {
    return getRTLInfo(locale);
  }

  /**
   * Get text direction for mixed content
   */
  getTextDirection(text: string): 'ltr' | 'rtl' | 'auto' {
    return getTextDirection(text);
  }

  /**
   * Translate with pluralization support
   */
  translatePlural(
    key: string,
    count: number,
    locale: string = this.config.defaultLocale!,
    params?: TranslationParams
  ): string {
    return this.translatePluralWithOptions(key, { count, locale, params });
  }

  /**
   * Translate with pluralization and full options
   */
  translatePluralWithOptions(
    key: string,
    options: PluralizationOptions
  ): string {
    const { count, locale = this.config.defaultLocale!, params, formatNumbers = true, useDirectionalMarkers = true, ordinal = false } = options;
    
    if (!this.config.pluralization?.enabled) {
      this.logger.warn('Pluralization is disabled. Enable it in config to use translatePlural.');
      // When pluralization is disabled, return key with count in parentheses
      return `${key} (${count})`;
    }

    // Update statistics
    this.updateStats(key, locale);
    
    // Check cache first
    const cacheKey = this.generatePluralCacheKey(key, count, locale, params);
    if (this.config.cache?.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        if (this.config.statistics?.enabled) {
          this.stats.cacheHits++;
        }
        return cached;
      }
    }

    // Get plural translation
    const result = this.getPluralTranslation(key, count, locale, params, formatNumbers, useDirectionalMarkers, ordinal);
    
    // Cache the result
    if (this.config.cache?.enabled) {
      this.setCache(cacheKey, result);
    }

    return result;
  }

  /**
   * Translate with pluralization and return detailed result
   */
  translatePluralWithResult(
    key: string,
    count: number,
    locale: string = this.config.defaultLocale!,
    params?: TranslationParams
  ): PluralizationResult {
    const { formatNumbers = true, useDirectionalMarkers = true, ordinal = false } = this.config.pluralization || {};
    
    return this.processPluralization(key, count, locale, params, formatNumbers, useDirectionalMarkers, ordinal);
  }

  /**
   * Check if a key has pluralization rules
   */
  hasPluralRules(key: string, locale: string = this.config.defaultLocale!): boolean {
    const translation = this.getTranslationValue(key, locale, true);
    
    if (!translation) return false;
    
    // Check if translation is a plural rule object
    return typeof translation === 'object' && translation !== null && 'other' in translation;
  }

  /**
   * Get plural categories for a locale
   */
  getPluralCategories(locale: string = this.config.defaultLocale!): string[] {
    const config = getPluralConfig(locale);
    const categories = new Set<string>();
    
    // Test with various numbers to determine all categories
    for (let i = 0; i <= 100; i++) {
      categories.add(config.pluralFunction(i));
    }
    
    return Array.from(categories);
  }

  /**
   * Get supported RTL locales with pluralization
   */
  getSupportedRTLLocales(): string[] {
    return getSupportedRTLLocales();
  }

  /**
   * Check if a locale has complex plural rules
   */
  hasComplexPluralRules(locale: string): boolean {
    return hasComplexPluralRules(locale);
  }

  /**
   * Format number for locale
   */
  formatNumberForLocale(num: number, locale: string): string {
    return formatNumberForLocaleUtil(num, locale);
  }

  /**
   * Get translation metadata for debugging
   */
  getTranslationMetadata(
    key: string,
    locale: string = this.config.defaultLocale!
  ): TranslationMetadata | null {
    const originalValue = this.translations[locale]?.[key] || 
                         this.translations[this.config.defaultLocale!]?.[key] || 
                         key;
    
    const originalText = typeof originalValue === 'string' ? originalValue : JSON.stringify(originalValue);
    const translatedText = this.translate(key, locale);
    const fallbackUsed = !this.translations[locale]?.[key] && 
                        !!this.translations[this.config.defaultLocale!]?.[key];

    // Get RTL information if enabled
    let rtlInfo = undefined;
    if (this.config.rtl?.enabled) {
      const rtlData = getRTLInfo(locale);
      rtlInfo = {
        isRTL: rtlData.isRTL,
        direction: rtlData.direction,
        script: rtlData.script,
        languageName: rtlData.name
      };
    }

    return {
      key,
      originalText,
      translatedText,
      locale,
      fallbackUsed,
      timestamp: new Date(),
      rtl: rtlInfo
    };
  }

  /**
   * Load translations from files
   */
  private loadTranslations(): void {
    try {
      const translationsDir = path.resolve(process.cwd(), this.config.translationsPath!);
      
      if (!fs.existsSync(translationsDir)) {
        this.logger.warn(`Translations directory not found: ${translationsDir}`);
        this.translations = { [this.config.defaultLocale!]: {} };
        return;
      }

      const files = fs.readdirSync(translationsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      for (const file of jsonFiles) {
        const locale = path.basename(file, '.json');
        const filePath = path.join(translationsDir, file);
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const translations = JSON.parse(content);
          
          this.translations[locale] = translations;
          
          if (this.config.debug) {
            this.logger.debug(`Loaded ${Object.keys(translations).length} translations for locale: ${locale}`);
          }
        } catch (error) {
          this.logger.error(`Failed to load translations from ${filePath}:`, error);
        }
      }

      if (Object.keys(this.translations).length === 0) {
        this.logger.warn('No translations loaded, using empty fallback');
        this.translations = { [this.config.defaultLocale!]: {} };
      }

    } catch (error) {
      this.logger.error('Failed to load translations:', error);
      this.translations = { [this.config.defaultLocale!]: {} };
    }
  }

  /**
   * Get translation with fallback strategy
   */
  private getTranslation(key: string, locale: string, useFallback: boolean): string {
    // Try requested locale first
    let translation = this.translations[locale]?.[key];
    
    if (translation) {
      if (this.config.statistics?.enabled) {
        this.stats.successfulTranslations++;
      }
      return typeof translation === 'string' ? translation : JSON.stringify(translation);
    }

    // Try fallback locale
    if (useFallback && locale !== this.config.defaultLocale) {
      translation = this.translations[this.config.defaultLocale!]?.[key];
      
      if (translation) {
        if (this.config.statistics?.enabled) {
          this.stats.failedTranslations++;
        }
        this.logger.debug(`Translation not found for key '${key}' in locale '${locale}', using fallback`);
        return typeof translation === 'string' ? translation : JSON.stringify(translation);
      }
    }

    // Handle missing translation based on strategy
    if (this.config.statistics?.enabled) {
      this.stats.failedTranslations++;
    }
    
    switch (this.config.fallbackStrategy) {
      case 'key':
        this.logger.warn(`Translation key not found: ${key} (locale: ${locale})`);
        return key;
      
      case 'throw':
        throw new Error(`Translation key not found: ${key} (locale: ${locale})`);
      
      case 'default':
      default:
        this.logger.warn(`Translation key not found: ${key} (locale: ${locale}), returning key`);
        return key;
    }
  }

  /**
   * Get translation value (string or object) for pluralization
   */
  private getTranslationValue(key: string, locale: string, useFallback: boolean): string | Record<string, string> | null {
    // Try requested locale first
    let translation = this.translations[locale]?.[key];
    
    if (translation) {
      if (this.config.statistics?.enabled) {
        this.stats.successfulTranslations++;
      }
      return translation;
    }

    // Try fallback locale
    if (useFallback && locale !== this.config.defaultLocale) {
      translation = this.translations[this.config.defaultLocale!]?.[key];
      
      if (translation) {
        if (this.config.statistics?.enabled) {
          this.stats.failedTranslations++;
        }
        this.logger.debug(`Translation not found for key '${key}' in locale '${locale}', using fallback`);
        return translation;
      }
    }

    // Handle missing translation based on strategy
    if (this.config.statistics?.enabled) {
      this.stats.failedTranslations++;
    }
    
    switch (this.config.fallbackStrategy) {
      case 'key':
        this.logger.warn(`Translation key not found: ${key} (locale: ${locale})`);
        return key;
      
      case 'throw':
        throw new Error(`Translation key not found: ${key} (locale: ${locale})`);
      
      case 'default':
      default:
        this.logger.warn(`Translation key not found: ${key} (locale: ${locale}), returning key`);
        return key;
    }
  }

  /**
   * Interpolate parameters into translation string (optimized with caching)
   */
  private interpolateParams(text: string, params: TranslationParams): string {
    const { prefix = '${', suffix = '}' } = this.config.interpolation || {};
    
    // Cache the regex for better performance
    const cacheKey = `${prefix}:${suffix}`;
    let regex = this.interpolationCache.get(cacheKey);
    
    if (!regex) {
      const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(`${escapedPrefix}(\\w+(?:\\.\\w+)*)${escapedSuffix}`, 'g');
      this.interpolationCache.set(cacheKey, regex);
    }
    
    return text
      .replace(regex, (match, key) => {
        // Handle nested object properties like validation.maxFiles
        const value = key.split('.').reduce((obj: any, prop: string) => obj?.[prop], params);
        return value !== undefined ? String(value) : match;
      })
      .replace(/\{(\w+)\}/g, (match, key) => {
        const value = params[key];
        return value !== undefined ? String(value) : match;
      });
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(key: string, locale: string, params?: TranslationParams): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${key}:${locale}:${paramsStr}`;
  }

  /**
   * Get value from cache
   */
  private getFromCache(key: string): string | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      if (this.config.statistics?.enabled) {
        this.stats.cacheMisses++;
      }
      return null;
    }

    const now = Date.now();
    const ttl = (this.config.cache?.ttl || 3600) * 1000;
    
    if (now - cached.timestamp > ttl) {
      this.cache.delete(key);
      if (this.config.statistics?.enabled) {
        this.stats.cacheMisses++;
      }
      return null;
    }

    return cached.value;
  }

  /**
   * Set value in cache
   */
  private setCache(key: string, value: string): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Update statistics
   */
  private updateStats(key: string, locale: string): void {
    if (!this.config.statistics?.enabled) {
      return;
    }

    this.stats.totalRequests++;
    
    if (this.config.statistics.trackLocaleUsage) {
      this.stats.localeUsage[locale] = (this.stats.localeUsage[locale] || 0) + 1;
    }
    
    if (this.config.statistics.trackKeyUsage) {
      this.stats.keyUsage[key] = (this.stats.keyUsage[key] || 0) + 1;
    }
  }

  /**
   * Get plural translation with RTL support
   */
  private getPluralTranslation(
    key: string,
    count: number,
    locale: string,
    params?: TranslationParams,
    formatNumbers: boolean = true,
    useDirectionalMarkers: boolean = true,
    ordinal: boolean = false
  ): string {
    // Get translation (could be string or plural rule object)
    const translation = this.getTranslationValue(key, locale, true);
    
    if (typeof translation === 'string') {
      // Fallback to regular translation with count parameter
      return this.interpolateParams(translation, { count, ...params });
    }
    
    if (typeof translation === 'object' && translation !== null) {
      // Validate plural rule structure
      if (this.config.pluralization?.validatePluralRules && !validatePluralRule(translation)) {
        this.logger.warn(`Invalid plural rule structure for key: ${key}`);
        return this.handleInvalidPluralRule(key, count, locale, params);
      }
      
      // Process pluralization with RTL support
      const useDirectionalMarkers = this.config.pluralization?.useDirectionalMarkers ?? true;
      const result = processRTLPluralization(key, count, locale, translation, params, useDirectionalMarkers);
      return result.text;
    }
    
    // Fallback to key if translation not found
    return this.handleMissingPluralTranslation(key, count, locale, params);
  }

  /**
   * Process pluralization with detailed result
   */
  private processPluralization(
    key: string,
    count: number,
    locale: string,
    params?: TranslationParams,
    formatNumbers: boolean = true,
    useDirectionalMarkers: boolean = true,
    ordinal: boolean = false
  ): PluralizationResult {
    const translation = this.getTranslationValue(key, locale, true);
    
    if (typeof translation === 'string') {
      // Fallback to regular translation
      const text = this.interpolateParams(translation, { count, ...params });
      return {
        text,
        category: 'other',
        rtl: {
          isRTL: this.isRTLLocale(locale),
          direction: this.getTextDirection(text)
        }
      };
    }
    
    if (typeof translation === 'object' && translation !== null) {
      // Validate plural rule structure
      if (this.config.pluralization?.validatePluralRules && !validatePluralRule(translation)) {
        this.logger.warn(`Invalid plural rule structure for key: ${key}`);
        return this.handleInvalidPluralRuleResult(key, count, locale, params);
      }
      
      // Process pluralization with RTL support
      const useDirectionalMarkers = this.config.pluralization?.useDirectionalMarkers ?? true;
      return processRTLPluralization(key, count, locale, translation, params, useDirectionalMarkers);
    }
    
    // Fallback for missing translation
    return this.handleMissingPluralTranslationResult(key, count, locale, params);
  }

  /**
   * Handle invalid plural rule
   */
  private handleInvalidPluralRule(
    key: string,
    count: number,
    locale: string,
    params?: TranslationParams
  ): string {
    const fallbackText = `${key} (${count})`;
    this.logger.warn(`Invalid plural rule for key: ${key}, using fallback: ${fallbackText}`);
    return fallbackText;
  }

  /**
   * Handle invalid plural rule with result
   */
  private handleInvalidPluralRuleResult(
    key: string,
    count: number,
    locale: string,
    params?: TranslationParams
  ): PluralizationResult {
    const fallbackText = `${key} (${count})`;
    this.logger.warn(`Invalid plural rule for key: ${key}, using fallback: ${fallbackText}`);
    
    return {
      text: fallbackText,
      category: 'other',
      rtl: {
        isRTL: this.isRTLLocale(locale),
        direction: 'ltr'
      }
    };
  }

  /**
   * Handle missing plural translation
   */
  private handleMissingPluralTranslation(
    key: string,
    count: number,
    locale: string,
    params?: TranslationParams
  ): string {
    const fallbackText = `${key} (${count})`;
    this.logger.warn(`Missing plural translation for key: ${key}, using fallback: ${fallbackText}`);
    return fallbackText;
  }

  /**
   * Handle missing plural translation with result
   */
  private handleMissingPluralTranslationResult(
    key: string,
    count: number,
    locale: string,
    params?: TranslationParams
  ): PluralizationResult {
    const fallbackText = `${key} (${count})`;
    this.logger.warn(`Missing plural translation for key: ${key}, using fallback: ${fallbackText}`);
    
    return {
      text: fallbackText,
      category: 'other',
      rtl: {
        isRTL: this.isRTLLocale(locale),
        direction: 'ltr'
      }
    };
  }

  /**
   * Generate cache key for pluralization
   */
  private generatePluralCacheKey(
    key: string,
    count: number,
    locale: string,
    params?: TranslationParams
  ): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `plural:${key}:${count}:${locale}:${paramsStr}`;
  }
} 