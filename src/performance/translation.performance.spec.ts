import { Test, TestingModule } from '@nestjs/testing';
import { TranslationModule } from '../modules/translation.module';
import { TranslationService } from '../services/translation.service';

describe('Translation Performance Tests', () => {
  let translationService: TranslationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TranslationModule.forRoot({
        serviceName: 'performance-test',
        translationsPath: './test-translations',
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr', 'es'],
        pluralization: { enabled: true },
        rtl: { enabled: true },
        cache: { enabled: true, ttl: 3600 },
        debug: false // Disable debug for performance tests
      })],
    }).compile();

    translationService = moduleFixture.get<TranslationService>(TranslationService);
  });

  describe('Translation Performance', () => {
    it('should handle 1000 translations within 100ms', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        translationService.translate('welcome', 'en', { name: `User${i}` });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
      console.log(`1000 translations completed in ${duration.toFixed(2)}ms`);
    });

    it('should handle 10000 translations within 500ms', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        translationService.translate('welcome', 'en');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(500);
      console.log(`10000 translations completed in ${duration.toFixed(2)}ms`);
    });

    it('should handle concurrent translations efficiently', async () => {
      const startTime = performance.now();
      
      const promises = Array(100).fill(null).map((_, i) => 
        Promise.resolve(translationService.translate('welcome', 'en', { name: `User${i}` }))
      );
      
      await Promise.all(promises);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(50);
      console.log(`100 concurrent translations completed in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Caching Performance', () => {
    it('should show significant performance improvement with cache hits', () => {
      // Clear cache first
      translationService.clearCache();
      
      // First call (cache miss)
      const cacheMissStart = performance.now();
      translationService.translate('welcome', 'en', { name: 'John' });
      const cacheMissDuration = performance.now() - cacheMissStart;
      
      // Second call (cache hit)
      const cacheHitStart = performance.now();
      translationService.translate('welcome', 'en', { name: 'John' });
      const cacheHitDuration = performance.now() - cacheHitStart;
      
      // Cache hit should be significantly faster
      expect(cacheHitDuration).toBeLessThan(cacheMissDuration * 0.5);
      console.log(`Cache miss: ${cacheMissDuration.toFixed(2)}ms, Cache hit: ${cacheHitDuration.toFixed(2)}ms`);
    });

    it('should handle 1000 cache hits efficiently', () => {
      // Prime the cache
      translationService.translate('welcome', 'en');
      
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        translationService.translate('welcome', 'en');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(50);
      console.log(`1000 cache hits completed in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Pluralization Performance', () => {
    it('should handle 1000 pluralizations within 200ms', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        translationService.translatePlural('items', i % 10, 'en', { count: i % 10 });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(200);
      console.log(`1000 pluralizations completed in ${duration.toFixed(2)}ms`);
    });

    it('should handle complex pluralization rules efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 500; i++) {
        translationService.translatePlural('items', i, 'ar', { count: i });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(300);
      console.log(`500 Arabic pluralizations completed in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Date Formatting Performance', () => {
    it('should handle 1000 date formatting operations within 150ms', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        translationService.formatDateForLocale(new Date(), 'en', { format: 'full' });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(150);
      console.log(`1000 date formatting operations completed in ${duration.toFixed(2)}ms`);
    });

    it('should handle different locale date formatting efficiently', () => {
      const locales = ['en', 'fr', 'es', 'de', 'ar'];
      const startTime = performance.now();
      
      for (let i = 0; i < 500; i++) {
        const locale = locales[i % locales.length];
        translationService.formatDateForLocale(new Date(), locale);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(200);
      console.log(`500 multi-locale date formatting operations completed in ${duration.toFixed(2)}ms`);
    });
  });

  describe('RTL Performance', () => {
    it('should handle 1000 RTL text detections within 50ms', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        translationService.getTextDirection('مرحبا بالعالم');
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(50);
      console.log(`1000 RTL text detections completed in ${duration.toFixed(2)}ms`);
    });

    it('should handle mixed text direction detection efficiently', () => {
      const texts = [
        'Hello مرحبا',
        'مرحبا Hello',
        '123 مرحبا',
        'مرحبا 123',
        'Hello World مرحبا بالعالم'
      ];
      
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        const text = texts[i % texts.length];
        translationService.getTextDirection(text);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
      console.log(`1000 mixed text direction detections completed in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory during repeated operations', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform many operations
      for (let i = 0; i < 10000; i++) {
        translationService.translate('welcome', 'en', { name: `User${i}` });
        translationService.translatePlural('items', i % 10, 'en', { count: i % 10 });
        translationService.formatDateForLocale(new Date(), 'en');
        translationService.getTextDirection('مرحبا');
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB for 40k operations)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });

    it('should handle cache memory efficiently', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Fill cache with many translations
      for (let i = 0; i < 1000; i++) {
        translationService.translate(`key${i}`, 'en', { param: `value${i}` });
      }
      
      const cacheMemory = process.memoryUsage().heapUsed;
      
      // Clear cache
      translationService.clearCache();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const cacheSize = cacheMemory - initialMemory;
      const memoryRecovery = cacheMemory - finalMemory;
      
      // Cache should use reasonable amount of memory
      expect(cacheSize).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
      console.log(`Cache size: ${(cacheSize / 1024).toFixed(2)}KB, Memory recovered: ${(memoryRecovery / 1024).toFixed(2)}KB`);
    });
  });

  describe('Load Testing', () => {
    it('should handle high load scenarios', async () => {
      const startTime = performance.now();
      
      // Simulate high load with multiple concurrent operations
      const promises = Array(1000).fill(null).map((_, i) => 
        Promise.all([
          translationService.translate('welcome', 'en', { name: `User${i}` }),
          translationService.translatePlural('items', i % 10, 'en', { count: i % 10 }),
          translationService.formatDateForLocale(new Date(), 'en'),
          translationService.getTextDirection('مرحبا')
        ])
      );
      
      await Promise.all(promises);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      console.log(`High load test (4000 operations) completed in ${duration.toFixed(2)}ms`);
    });

    it('should maintain performance under sustained load', async () => {
      const iterations = 10;
      const operationsPerIteration = 100;
      const durations: number[] = [];
      
      for (let iter = 0; iter < iterations; iter++) {
        const startTime = performance.now();
        
        const promises = Array(operationsPerIteration).fill(null).map((_, i) => 
          translationService.translate('welcome', 'en', { name: `User${iter}_${i}` })
        );
        
        await Promise.all(promises);
        
        const endTime = performance.now();
        durations.push(endTime - startTime);
      }
      
      // Performance should remain consistent (no degradation)
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      
      expect(maxDuration).toBeLessThan(avgDuration * 4); // Allow more variance for sustained load
      console.log(`Sustained load test - Average: ${avgDuration.toFixed(2)}ms, Max: ${maxDuration.toFixed(2)}ms`);
    });
  });

  describe('Statistics Performance', () => {
    it('should track statistics without performance impact', () => {
      const startTime = performance.now();
      
      // Perform operations with statistics tracking
      for (let i = 0; i < 1000; i++) {
        translationService.translate('welcome', 'en', { name: `User${i}` });
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Get statistics
      const stats = translationService.getStats();
      
      expect(duration).toBeLessThan(100);
      expect(stats.totalRequests).toBeGreaterThan(0);
      console.log(`Statistics tracking test completed in ${duration.toFixed(2)}ms`);
    });
  });
});
