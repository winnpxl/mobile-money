/**
 * Unit tests for currency formatter types and type guards
 */

import {
  SupportedCurrency,
  CurrencyConfig,
  FormatOptions,
  CacheStats,
  FormatterMetrics,
  HealthCheckResult,
  CurrencyFormatterConfig,
} from '../../../src/utils/currency/types';

import {
  isSupportedCurrency,
  SUPPORTED_CURRENCIES,
  CURRENCY_METADATA,
} from '../../../src/types/currency';

describe('Currency Types', () => {
  describe('SupportedCurrency type', () => {
    it('should include all expected currency codes', () => {
      const expectedCurrencies: SupportedCurrency[] = ['XAF', 'GHS', 'NGN', 'USD'];
      
      // This test ensures the type definition matches our expectations
      expectedCurrencies.forEach(currency => {
        expect(SUPPORTED_CURRENCIES).toContain(currency);
      });
    });
  });

  describe('CurrencyConfig interface', () => {
    it('should accept valid currency configuration', () => {
      const validConfig: CurrencyConfig = {
        code: 'USD',
        decimalPlaces: 2,
        locale: 'en-US',
        symbol: '$',
        showSymbol: true,
        formatOptions: {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      };

      expect(validConfig.code).toBe('USD');
      expect(validConfig.decimalPlaces).toBe(2);
      expect(validConfig.locale).toBe('en-US');
      expect(validConfig.symbol).toBe('$');
      expect(validConfig.showSymbol).toBe(true);
    });

    it('should accept configuration without optional fields', () => {
      const minimalConfig: CurrencyConfig = {
        code: 'XAF',
        decimalPlaces: 0,
        locale: 'fr-CM',
        showSymbol: false,
      };

      expect(minimalConfig.code).toBe('XAF');
      expect(minimalConfig.symbol).toBeUndefined();
      expect(minimalConfig.formatOptions).toBeUndefined();
    });
  });

  describe('FormatOptions interface', () => {
    it('should accept all optional format options', () => {
      const options: FormatOptions = {
        locale: 'en-GB',
        decimalPlaces: 3,
        includeSymbol: true,
        compact: false,
        roundingMode: 'halfEven',
      };

      expect(options.locale).toBe('en-GB');
      expect(options.decimalPlaces).toBe(3);
      expect(options.includeSymbol).toBe(true);
      expect(options.compact).toBe(false);
      expect(options.roundingMode).toBe('halfEven');
    });

    it('should accept empty options object', () => {
      const options: FormatOptions = {};
      expect(Object.keys(options)).toHaveLength(0);
    });
  });

  describe('CacheStats interface', () => {
    it('should accept valid cache statistics', () => {
      const stats: CacheStats = {
        totalEntries: 10,
        hitCount: 85,
        missCount: 15,
        hitRate: 85.0,
        mostUsedCurrency: 'USD',
        cacheSize: 1024,
      };

      expect(stats.totalEntries).toBe(10);
      expect(stats.hitRate).toBe(85.0);
      expect(stats.mostUsedCurrency).toBe('USD');
    });
  });

  describe('FormatterMetrics interface', () => {
    it('should accept valid formatter metrics', () => {
      const metrics: FormatterMetrics = {
        averageLatency: 0.5,
        totalOperations: 1000,
        operationsPerMinute: 60,
        cacheStats: {
          totalEntries: 5,
          hitCount: 90,
          missCount: 10,
          hitRate: 90.0,
          mostUsedCurrency: 'NGN',
          cacheSize: 512,
        },
      };

      expect(metrics.averageLatency).toBe(0.5);
      expect(metrics.cacheStats.mostUsedCurrency).toBe('NGN');
    });
  });

  describe('HealthCheckResult interface', () => {
    it('should accept valid health check result', () => {
      const healthCheck: HealthCheckResult = {
        status: 'healthy',
        cacheStatus: 'operational',
        formatterStatus: 'operational',
        lastSuccessfulFormat: new Date('2024-01-01T00:00:00Z'),
        errorRate: 0.1,
      };

      expect(healthCheck.status).toBe('healthy');
      expect(healthCheck.errorRate).toBe(0.1);
      expect(healthCheck.lastSuccessfulFormat).toBeInstanceOf(Date);
    });

    it('should accept degraded status values', () => {
      const healthCheck: HealthCheckResult = {
        status: 'degraded',
        cacheStatus: 'degraded',
        formatterStatus: 'error',
        lastSuccessfulFormat: new Date(),
        errorRate: 5.0,
      };

      expect(healthCheck.status).toBe('degraded');
      expect(healthCheck.cacheStatus).toBe('degraded');
      expect(healthCheck.formatterStatus).toBe('error');
    });
  });

  describe('CurrencyFormatterConfig interface', () => {
    it('should accept complete configuration', () => {
      const config: CurrencyFormatterConfig = {
        currencies: {
          USD: {
            code: 'USD',
            decimalPlaces: 2,
            locale: 'en-US',
            showSymbol: true,
          },
        },
        defaultLocale: 'en-US',
        maxCacheSize: 100,
        enableMetrics: true,
        enableDebugLogging: false,
      };

      expect(config.currencies.USD?.code).toBe('USD');
      expect(config.defaultLocale).toBe('en-US');
      expect(config.enableMetrics).toBe(true);
    });

    it('should accept minimal configuration', () => {
      const config: CurrencyFormatterConfig = {
        currencies: {},
      };

      expect(config.currencies).toEqual({});
      expect(config.defaultLocale).toBeUndefined();
    });
  });
});

describe('Currency Type Guards and Utilities', () => {
  describe('isSupportedCurrency', () => {
    it('should return true for supported currencies', () => {
      expect(isSupportedCurrency('XAF')).toBe(true);
      expect(isSupportedCurrency('GHS')).toBe(true);
      expect(isSupportedCurrency('NGN')).toBe(true);
      expect(isSupportedCurrency('USD')).toBe(true);
    });

    it('should return false for unsupported currencies', () => {
      expect(isSupportedCurrency('EUR')).toBe(false);
      expect(isSupportedCurrency('GBP')).toBe(false);
      expect(isSupportedCurrency('JPY')).toBe(false);
      expect(isSupportedCurrency('')).toBe(false);
      expect(isSupportedCurrency('invalid')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isSupportedCurrency('usd')).toBe(false); // case sensitive
      expect(isSupportedCurrency('USD ')).toBe(false); // whitespace
      expect(isSupportedCurrency(' USD')).toBe(false); // leading whitespace
    });
  });

  describe('SUPPORTED_CURRENCIES constant', () => {
    it('should contain exactly 4 currencies', () => {
      expect(SUPPORTED_CURRENCIES).toHaveLength(4);
    });

    it('should contain expected currencies in any order', () => {
      expect(SUPPORTED_CURRENCIES).toContain('XAF');
      expect(SUPPORTED_CURRENCIES).toContain('GHS');
      expect(SUPPORTED_CURRENCIES).toContain('NGN');
      expect(SUPPORTED_CURRENCIES).toContain('USD');
    });
  });

  describe('CURRENCY_METADATA constant', () => {
    it('should have metadata for all supported currencies', () => {
      SUPPORTED_CURRENCIES.forEach(currency => {
        expect(CURRENCY_METADATA[currency]).toBeDefined();
        expect(CURRENCY_METADATA[currency].code).toBe(currency);
        expect(CURRENCY_METADATA[currency].name).toBeTruthy();
        expect(CURRENCY_METADATA[currency].symbol).toBeTruthy();
        expect(typeof CURRENCY_METADATA[currency].decimalPlaces).toBe('number');
        expect(Array.isArray(CURRENCY_METADATA[currency].countries)).toBe(true);
      });
    });

    it('should have correct decimal places for each currency', () => {
      expect(CURRENCY_METADATA.XAF.decimalPlaces).toBe(0);
      expect(CURRENCY_METADATA.GHS.decimalPlaces).toBe(2);
      expect(CURRENCY_METADATA.NGN.decimalPlaces).toBe(2);
      expect(CURRENCY_METADATA.USD.decimalPlaces).toBe(2);
    });

    it('should have correct symbols for each currency', () => {
      expect(CURRENCY_METADATA.XAF.symbol).toBe('FCFA');
      expect(CURRENCY_METADATA.GHS.symbol).toBe('₵');
      expect(CURRENCY_METADATA.NGN.symbol).toBe('₦');
      expect(CURRENCY_METADATA.USD.symbol).toBe('$');
    });
  });
});