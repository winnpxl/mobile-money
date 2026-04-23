/**
 * Constants and default configurations for the Currency Formatter Utility
 * 
 * This module contains all default currency configurations, formatting rules,
 * and system constants used throughout the currency formatting system.
 */

import { SupportedCurrency, CurrencyConfig } from './types';
import { SUPPORTED_CURRENCIES as SUPPORTED_CURRENCY_LIST } from '../../types/currency';

/**
 * Default currency configurations for all supported currencies
 * 
 * These configurations follow ISO 4217 standards and include currency-specific
 * rounding rules, locale settings, and formatting options.
 */
export const DEFAULT_CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  /**
   * Central African CFA franc (XAF)
   * - No decimal places (whole units only)
   * - French locale for Central African countries
   * - FCFA symbol
   */
  XAF: {
    code: 'XAF',
    decimalPlaces: 0,
    locale: 'fr-CM',
    symbol: 'FCFA',
    showSymbol: true,
    formatOptions: {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },

  /**
   * Ghanaian cedi (GHS)
   * - 2 decimal places
   * - English locale for Ghana
   * - ₵ symbol
   */
  GHS: {
    code: 'GHS',
    decimalPlaces: 2,
    locale: 'en-GH',
    symbol: '₵',
    showSymbol: true,
    formatOptions: {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },

  /**
   * Nigerian naira (NGN)
   * - 2 decimal places
   * - English locale for Nigeria
   * - ₦ symbol
   */
  NGN: {
    code: 'NGN',
    decimalPlaces: 2,
    locale: 'en-NG',
    symbol: '₦',
    showSymbol: true,
    formatOptions: {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },

  /**
   * United States dollar (USD)
   * - 2 decimal places
   * - English locale for United States
   * - $ symbol
   */
  USD: {
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
  },
};

/**
 * List of all supported currency codes
 * Re-exported from the shared types module for consistency
 */
export const SUPPORTED_CURRENCIES = SUPPORTED_CURRENCY_LIST;

/**
 * Default system configuration values
 */
export const DEFAULT_CONFIG = {
  /** Default locale when none is specified */
  DEFAULT_LOCALE: 'en-US',
  
  /** Maximum number of formatters to cache */
  MAX_CACHE_SIZE: 100,
  
  /** Cache cleanup threshold (when to start removing old entries) */
  CACHE_CLEANUP_THRESHOLD: 80,
  
  /** Maximum age for cached formatters in milliseconds (1 hour) */
  MAX_CACHE_AGE: 60 * 60 * 1000,
  
  /** Performance monitoring sample rate (percentage of operations to track) */
  METRICS_SAMPLE_RATE: 0.1,
  
  /** Maximum formatting latency before logging a warning (milliseconds) */
  MAX_FORMATTING_LATENCY: 10,
  
  /** Maximum amount value to prevent overflow issues */
  MAX_SAFE_AMOUNT: Number.MAX_SAFE_INTEGER / 100,
  
  /** Minimum amount value to prevent underflow issues */
  MIN_SAFE_AMOUNT: Number.MIN_SAFE_INTEGER / 100,
} as const;

/**
 * Compact notation thresholds for different currencies
 */
export const COMPACT_THRESHOLDS = {
  /** Thousand */
  K: 1000,
  /** Million */
  M: 1000000,
  /** Billion */
  B: 1000000000,
  /** Trillion */
  T: 1000000000000,
} as const;

/**
 * Rounding modes supported by the formatter
 */
export const ROUNDING_MODES = {
  /** Round half to even (banker's rounding) - default */
  HALF_EVEN: 'halfEven',
  /** Round half up */
  HALF_UP: 'halfUp',
  /** Round half down */
  HALF_DOWN: 'halfDown',
  /** Always round down (floor) */
  FLOOR: 'floor',
  /** Always round up (ceiling) */
  CEIL: 'ceil',
} as const;

/**
 * Cache key prefixes for different types of formatters
 */
export const CACHE_KEYS = {
  /** Standard currency formatter */
  CURRENCY: 'currency',
  /** Compact notation formatter */
  COMPACT: 'compact',
  /** Symbol-only formatter */
  SYMBOL: 'symbol',
  /** Custom formatter */
  CUSTOM: 'custom',
} as const;

/**
 * Performance monitoring event types
 */
export const METRIC_EVENTS = {
  /** Formatting operation completed */
  FORMAT_COMPLETE: 'format_complete',
  /** Cache hit occurred */
  CACHE_HIT: 'cache_hit',
  /** Cache miss occurred */
  CACHE_MISS: 'cache_miss',
  /** Error occurred during formatting */
  FORMAT_ERROR: 'format_error',
  /** Cache cleanup performed */
  CACHE_CLEANUP: 'cache_cleanup',
} as const;

/**
 * Log levels for different types of events
 */
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;