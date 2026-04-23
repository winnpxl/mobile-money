/**
 * Unit tests for currency formatter constants and default configurations
 */

import {
  DEFAULT_CURRENCY_CONFIGS,
  SUPPORTED_CURRENCIES,
  DEFAULT_CONFIG,
  COMPACT_THRESHOLDS,
  ROUNDING_MODES,
  CACHE_KEYS,
  METRIC_EVENTS,
  LOG_LEVELS,
} from '../../../src/utils/currency/constants';

import { SupportedCurrency } from '../../../src/utils/currency/types';

describe('Currency Formatter Constants', () => {
  describe('DEFAULT_CURRENCY_CONFIGS', () => {
    it('should have configurations for all supported currencies', () => {
      const expectedCurrencies: SupportedCurrency[] = ['XAF', 'GHS', 'NGN', 'USD'];
      
      expectedCurrencies.forEach(currency => {
        expect(DEFAULT_CURRENCY_CONFIGS[currency]).toBeDefined();
        expect(DEFAULT_CURRENCY_CONFIGS[currency].code).toBe(currency);
      });
    });

    describe('XAF configuration', () => {
      const xafConfig = DEFAULT_CURRENCY_CONFIGS.XAF;

      it('should have correct basic properties', () => {
        expect(xafConfig.code).toBe('XAF');
        expect(xafConfig.decimalPlaces).toBe(0);
        expect(xafConfig.locale).toBe('fr-CM');
        expect(xafConfig.symbol).toBe('FCFA');
        expect(xafConfig.showSymbol).toBe(true);
      });

      it('should have correct format options', () => {
        expect(xafConfig.formatOptions).toEqual({
          style: 'currency',
          currency: 'XAF',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      });
    });

    describe('GHS configuration', () => {
      const ghsConfig = DEFAULT_CURRENCY_CONFIGS.GHS;

      it('should have correct basic properties', () => {
        expect(ghsConfig.code).toBe('GHS');
        expect(ghsConfig.decimalPlaces).toBe(2);
        expect(ghsConfig.locale).toBe('en-GH');
        expect(ghsConfig.symbol).toBe('₵');
        expect(ghsConfig.showSymbol).toBe(true);
      });

      it('should have correct format options', () => {
        expect(ghsConfig.formatOptions).toEqual({
          style: 'currency',
          currency: 'GHS',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      });
    });

    describe('NGN configuration', () => {
      const ngnConfig = DEFAULT_CURRENCY_CONFIGS.NGN;

      it('should have correct basic properties', () => {
        expect(ngnConfig.code).toBe('NGN');
        expect(ngnConfig.decimalPlaces).toBe(2);
        expect(ngnConfig.locale).toBe('en-NG');
        expect(ngnConfig.symbol).toBe('₦');
        expect(ngnConfig.showSymbol).toBe(true);
      });

      it('should have correct format options', () => {
        expect(ngnConfig.formatOptions).toEqual({
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      });
    });

    describe('USD configuration', () => {
      const usdConfig = DEFAULT_CURRENCY_CONFIGS.USD;

      it('should have correct basic properties', () => {
        expect(usdConfig.code).toBe('USD');
        expect(usdConfig.decimalPlaces).toBe(2);
        expect(usdConfig.locale).toBe('en-US');
        expect(usdConfig.symbol).toBe('$');
        expect(usdConfig.showSymbol).toBe(true);
      });

      it('should have correct format options', () => {
        expect(usdConfig.formatOptions).toEqual({
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      });
    });

    it('should have consistent format options structure', () => {
      Object.values(DEFAULT_CURRENCY_CONFIGS).forEach(config => {
        expect(config.formatOptions).toBeDefined();
        expect(config.formatOptions!.style).toBe('currency');
        expect(config.formatOptions!.currency).toBe(config.code);
        expect(config.formatOptions!.minimumFractionDigits).toBe(config.decimalPlaces);
        expect(config.formatOptions!.maximumFractionDigits).toBe(config.decimalPlaces);
      });
    });
  });

  describe('SUPPORTED_CURRENCIES', () => {
    it('should contain exactly 4 currencies', () => {
      expect(SUPPORTED_CURRENCIES).toHaveLength(4);
    });

    it('should contain expected currencies', () => {
      expect(SUPPORTED_CURRENCIES).toContain('XAF');
      expect(SUPPORTED_CURRENCIES).toContain('GHS');
      expect(SUPPORTED_CURRENCIES).toContain('NGN');
      expect(SUPPORTED_CURRENCIES).toContain('USD');
    });

    it('should match currencies in DEFAULT_CURRENCY_CONFIGS', () => {
      const configCurrencies = Object.keys(DEFAULT_CURRENCY_CONFIGS) as SupportedCurrency[];
      const supportedCurrencies = [...SUPPORTED_CURRENCIES]; // Create a fresh copy
      expect(supportedCurrencies.sort()).toEqual(configCurrencies.sort());
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have all expected configuration values', () => {
      expect(DEFAULT_CONFIG.DEFAULT_LOCALE).toBe('en-US');
      expect(DEFAULT_CONFIG.MAX_CACHE_SIZE).toBe(100);
      expect(DEFAULT_CONFIG.CACHE_CLEANUP_THRESHOLD).toBe(80);
      expect(DEFAULT_CONFIG.MAX_CACHE_AGE).toBe(60 * 60 * 1000); // 1 hour
      expect(DEFAULT_CONFIG.METRICS_SAMPLE_RATE).toBe(0.1);
      expect(DEFAULT_CONFIG.MAX_FORMATTING_LATENCY).toBe(10);
    });

    it('should have reasonable safe amount limits', () => {
      expect(DEFAULT_CONFIG.MAX_SAFE_AMOUNT).toBe(Number.MAX_SAFE_INTEGER / 100);
      expect(DEFAULT_CONFIG.MIN_SAFE_AMOUNT).toBe(Number.MIN_SAFE_INTEGER / 100);
      expect(DEFAULT_CONFIG.MAX_SAFE_AMOUNT).toBeGreaterThan(0);
      expect(DEFAULT_CONFIG.MIN_SAFE_AMOUNT).toBeLessThan(0);
    });

    it('should have valid cache configuration', () => {
      expect(DEFAULT_CONFIG.MAX_CACHE_SIZE).toBeGreaterThan(0);
      expect(DEFAULT_CONFIG.CACHE_CLEANUP_THRESHOLD).toBeLessThan(DEFAULT_CONFIG.MAX_CACHE_SIZE);
      expect(DEFAULT_CONFIG.CACHE_CLEANUP_THRESHOLD).toBeGreaterThan(0);
    });

    it('should have valid metrics configuration', () => {
      expect(DEFAULT_CONFIG.METRICS_SAMPLE_RATE).toBeGreaterThan(0);
      expect(DEFAULT_CONFIG.METRICS_SAMPLE_RATE).toBeLessThanOrEqual(1);
      expect(DEFAULT_CONFIG.MAX_FORMATTING_LATENCY).toBeGreaterThan(0);
    });
  });

  describe('COMPACT_THRESHOLDS', () => {
    it('should have all expected thresholds', () => {
      expect(COMPACT_THRESHOLDS.K).toBe(1000);
      expect(COMPACT_THRESHOLDS.M).toBe(1000000);
      expect(COMPACT_THRESHOLDS.B).toBe(1000000000);
      expect(COMPACT_THRESHOLDS.T).toBe(1000000000000);
    });

    it('should have thresholds in ascending order', () => {
      expect(COMPACT_THRESHOLDS.K).toBeLessThan(COMPACT_THRESHOLDS.M);
      expect(COMPACT_THRESHOLDS.M).toBeLessThan(COMPACT_THRESHOLDS.B);
      expect(COMPACT_THRESHOLDS.B).toBeLessThan(COMPACT_THRESHOLDS.T);
    });
  });

  describe('ROUNDING_MODES', () => {
    it('should have all expected rounding modes', () => {
      expect(ROUNDING_MODES.HALF_EVEN).toBe('halfEven');
      expect(ROUNDING_MODES.HALF_UP).toBe('halfUp');
      expect(ROUNDING_MODES.HALF_DOWN).toBe('halfDown');
      expect(ROUNDING_MODES.FLOOR).toBe('floor');
      expect(ROUNDING_MODES.CEIL).toBe('ceil');
    });
  });

  describe('CACHE_KEYS', () => {
    it('should have all expected cache key prefixes', () => {
      expect(CACHE_KEYS.CURRENCY).toBe('currency');
      expect(CACHE_KEYS.COMPACT).toBe('compact');
      expect(CACHE_KEYS.SYMBOL).toBe('symbol');
      expect(CACHE_KEYS.CUSTOM).toBe('custom');
    });

    it('should have unique values', () => {
      const values = Object.values(CACHE_KEYS);
      const uniqueValues = [...new Set(values)];
      expect(values).toHaveLength(uniqueValues.length);
    });
  });

  describe('METRIC_EVENTS', () => {
    it('should have all expected metric event types', () => {
      expect(METRIC_EVENTS.FORMAT_COMPLETE).toBe('format_complete');
      expect(METRIC_EVENTS.CACHE_HIT).toBe('cache_hit');
      expect(METRIC_EVENTS.CACHE_MISS).toBe('cache_miss');
      expect(METRIC_EVENTS.FORMAT_ERROR).toBe('format_error');
      expect(METRIC_EVENTS.CACHE_CLEANUP).toBe('cache_cleanup');
    });

    it('should have unique values', () => {
      const values = Object.values(METRIC_EVENTS);
      const uniqueValues = [...new Set(values)];
      expect(values).toHaveLength(uniqueValues.length);
    });
  });

  describe('LOG_LEVELS', () => {
    it('should have all expected log levels', () => {
      expect(LOG_LEVELS.DEBUG).toBe('debug');
      expect(LOG_LEVELS.INFO).toBe('info');
      expect(LOG_LEVELS.WARN).toBe('warn');
      expect(LOG_LEVELS.ERROR).toBe('error');
    });

    it('should have unique values', () => {
      const values = Object.values(LOG_LEVELS);
      const uniqueValues = [...new Set(values)];
      expect(values).toHaveLength(uniqueValues.length);
    });
  });

  describe('Configuration consistency', () => {
    it('should have matching decimal places between configs and format options', () => {
      Object.values(DEFAULT_CURRENCY_CONFIGS).forEach(config => {
        expect(config.formatOptions!.minimumFractionDigits).toBe(config.decimalPlaces);
        expect(config.formatOptions!.maximumFractionDigits).toBe(config.decimalPlaces);
      });
    });

    it('should have matching currency codes between configs and format options', () => {
      Object.values(DEFAULT_CURRENCY_CONFIGS).forEach(config => {
        expect(config.formatOptions!.currency).toBe(config.code);
      });
    });

    it('should have valid locale formats', () => {
      Object.values(DEFAULT_CURRENCY_CONFIGS).forEach(config => {
        expect(config.locale).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
      });
    });

    it('should have non-empty symbols for all currencies', () => {
      Object.values(DEFAULT_CURRENCY_CONFIGS).forEach(config => {
        expect(config.symbol).toBeTruthy();
        expect(typeof config.symbol).toBe('string');
        expect(config.symbol!.length).toBeGreaterThan(0);
      });
    });
  });
});