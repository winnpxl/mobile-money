/**
 * Currency Formatter Utility - Main Export Module
 * 
 * This module provides a centralized currency formatting service that standardizes
 * the display of XAF, GHS, NGN, and USD currencies across the entire mobile money
 * application. The utility implements an Intl.NumberFormat wrapper with currency-specific
 * rounding rules to ensure consistent formatting according to ISO 4217 standards.
 * 
 * @example
 * ```typescript
 * import { currencyFormatter, formatCurrency } from '@/utils/currency';
 * 
 * // Using the singleton instance
 * const formatted = currencyFormatter.formatCurrency(1000, 'USD');
 * // Result: "$1,000.00"
 * 
 * // Using the utility function
 * const formatted2 = formatCurrency(1000, 'XAF');
 * // Result: "1,000 FCFA"
 * ```
 */

// Re-export all types for external consumption
export type {
  SupportedCurrency,
  CurrencyConfig,
  FormatOptions,
  CacheStats,
  FormatterMetrics,
  HealthCheckResult,
  CurrencyFormatterConfig,
} from './types';

// Re-export error classes and codes
export {
  CurrencyFormatterError,
  InvalidAmountError,
  InvalidCurrencyError,
  UnsupportedCurrencyError,
  ConfigurationError,
  CacheError,
  FormattingError,
  ValidationError,
  ErrorCodes,
  isCurrencyFormatterError,
  hasErrorCode,
} from './errors';

// Re-export constants
export {
  DEFAULT_CURRENCY_CONFIGS,
  SUPPORTED_CURRENCIES,
  DEFAULT_CONFIG,
  COMPACT_THRESHOLDS,
  ROUNDING_MODES,
} from './constants';

// Export InputValidator class (implemented in Task 1.2)
export { InputValidator } from './InputValidator';

// Note: The main CurrencyFormatter class and utility functions will be exported
// once they are implemented in subsequent tasks. This maintains a clean API
// surface while allowing for incremental development.

/**
 * Placeholder for the main CurrencyFormatter class
 * This will be implemented in Task 3.1
 */
// export { CurrencyFormatter } from './CurrencyFormatter';

/**
 * Placeholder for utility functions
 * These will be implemented in Task 3.1
 */
// export { formatCurrency, formatCurrencyWithSymbol, formatCurrencyCompact } from './utils';

/**
 * Placeholder for singleton instance
 * This will be implemented in Task 7.1
 */
// export { currencyFormatter } from './instance';