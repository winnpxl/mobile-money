/**
 * Type definitions for the Currency Formatter Utility
 * 
 * This module defines all TypeScript interfaces and types used throughout
 * the currency formatting system, ensuring type safety and consistency.
 */

/**
 * Supported currency codes according to ISO 4217 standards
 */
export type SupportedCurrency = 'XAF' | 'GHS' | 'NGN' | 'USD';

/**
 * Configuration for a specific currency including formatting rules and locale settings
 */
export interface CurrencyConfig {
  /** ISO 4217 currency code */
  code: SupportedCurrency;
  /** Number of decimal places for rounding */
  decimalPlaces: number;
  /** Locale for formatting (e.g., 'en-US', 'fr-CM') */
  locale: string;
  /** Currency symbol (e.g., '$', '₦', 'FCFA') */
  symbol?: string;
  /** Whether to show currency symbol in formatted output */
  showSymbol: boolean;
  /** Custom formatting options for Intl.NumberFormat */
  formatOptions?: Partial<Intl.NumberFormatOptions>;
}

/**
 * Options for customizing currency formatting behavior
 */
export interface FormatOptions {
  /** Override default locale */
  locale?: string;
  /** Force specific decimal places */
  decimalPlaces?: number;
  /** Include currency symbol */
  includeSymbol?: boolean;
  /** Use compact notation (K, M, B) */
  compact?: boolean;
  /** Custom rounding mode */
  roundingMode?: 'halfEven' | 'halfUp' | 'halfDown' | 'floor' | 'ceil';
}

/**
 * Statistics about formatter cache performance
 */
export interface CacheStats {
  /** Total number of cached formatters */
  totalEntries: number;
  /** Number of cache hits */
  hitCount: number;
  /** Number of cache misses */
  missCount: number;
  /** Cache hit rate as percentage */
  hitRate: number;
  /** Most frequently used currency */
  mostUsedCurrency: string;
  /** Current cache size in bytes (estimated) */
  cacheSize: number;
}

/**
 * Performance metrics for monitoring formatter operations
 */
export interface FormatterMetrics {
  /** Average formatting latency in milliseconds */
  averageLatency: number;
  /** Total number of formatting operations */
  totalOperations: number;
  /** Number of operations in the last minute */
  operationsPerMinute: number;
  /** Cache performance statistics */
  cacheStats: CacheStats;
}

/**
 * Health check result for the currency formatter system
 */
export interface HealthCheckResult {
  /** Overall system status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Cache system status */
  cacheStatus: 'operational' | 'degraded';
  /** Formatter system status */
  formatterStatus: 'operational' | 'error';
  /** Timestamp of last successful format operation */
  lastSuccessfulFormat: Date;
  /** Current error rate as percentage */
  errorRate: number;
}

/**
 * Configuration for the entire currency formatter system
 */
export interface CurrencyFormatterConfig {
  /** Currency-specific configurations */
  currencies: Partial<Record<SupportedCurrency, CurrencyConfig>>;
  /** Default locale to use when none specified */
  defaultLocale?: string;
  /** Maximum cache size (number of entries) */
  maxCacheSize?: number;
  /** Enable performance monitoring */
  enableMetrics?: boolean;
  /** Enable debug logging */
  enableDebugLogging?: boolean;
}