/**
 * Error handling classes and error codes for the Currency Formatter Utility
 * 
 * This module provides comprehensive error handling with descriptive error messages
 * and structured error codes for programmatic error handling.
 */

/**
 * Error codes for different types of currency formatter failures
 */
export const ErrorCodes = {
  /** Invalid amount provided (not a number, null, undefined, NaN, Infinity) */
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  /** Invalid currency code provided (null, undefined, empty, or unsupported) */
  INVALID_CURRENCY: 'INVALID_CURRENCY',
  /** Currency code is not supported by the formatter */
  UNSUPPORTED_CURRENCY: 'UNSUPPORTED_CURRENCY',
  /** Invalid configuration provided for currency setup */
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  /** Cache operation failed */
  CACHE_ERROR: 'CACHE_ERROR',
  /** Formatting operation failed */
  FORMATTING_ERROR: 'FORMATTING_ERROR',
  /** Validation failed for input parameters */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

/**
 * Type for error codes to ensure type safety
 */
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Base error class for all currency formatter related errors
 * 
 * Provides structured error information with error codes for programmatic handling
 * and descriptive messages for debugging and user feedback.
 */
export class CurrencyFormatterError extends Error {
  /**
   * Creates a new CurrencyFormatterError
   * 
   * @param message - Descriptive error message
   * @param code - Structured error code for programmatic handling
   * @param cause - Optional underlying error that caused this error
   */
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'CurrencyFormatterError';
    
    // Maintain proper stack trace for V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CurrencyFormatterError);
    }
  }

  /**
   * Returns a JSON representation of the error for logging and debugging
   */
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack,
      cause: this.cause?.message,
    };
  }
}

/**
 * Error thrown when an invalid amount is provided to the formatter
 */
export class InvalidAmountError extends CurrencyFormatterError {
  constructor(amount: unknown, details?: string) {
    const baseMessage = `Invalid amount: ${getAmountErrorMessage(amount)}`;
    const message = details ? `${baseMessage}. ${details}` : baseMessage;
    super(message, ErrorCodes.INVALID_AMOUNT);
  }
}

/**
 * Error thrown when an invalid currency code is provided to the formatter
 */
export class InvalidCurrencyError extends CurrencyFormatterError {
  constructor(currency: unknown, details?: string) {
    const baseMessage = `Invalid currency: ${getCurrencyErrorMessage(currency)}`;
    const message = details ? `${baseMessage}. ${details}` : baseMessage;
    super(message, ErrorCodes.INVALID_CURRENCY);
  }
}

/**
 * Error thrown when a currency code is not supported by the formatter
 */
export class UnsupportedCurrencyError extends CurrencyFormatterError {
  constructor(currency: string, supportedCurrencies: string[]) {
    const message = `Unsupported currency: ${currency}. Supported currencies: ${supportedCurrencies.join(', ')}`;
    super(message, ErrorCodes.UNSUPPORTED_CURRENCY);
  }
}

/**
 * Error thrown when invalid configuration is provided
 */
export class ConfigurationError extends CurrencyFormatterError {
  constructor(message: string, details?: string) {
    const fullMessage = details ? `${message}. ${details}` : message;
    super(`Configuration error: ${fullMessage}`, ErrorCodes.CONFIGURATION_ERROR);
  }
}

/**
 * Error thrown when cache operations fail
 */
export class CacheError extends CurrencyFormatterError {
  constructor(operation: string, details?: string) {
    const message = `Cache ${operation} failed${details ? `: ${details}` : ''}`;
    super(message, ErrorCodes.CACHE_ERROR);
  }
}

/**
 * Error thrown when formatting operations fail
 */
export class FormattingError extends CurrencyFormatterError {
  constructor(message: string, cause?: Error) {
    super(`Formatting failed: ${message}`, ErrorCodes.FORMATTING_ERROR, cause);
  }
}

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends CurrencyFormatterError {
  constructor(field: string, value: unknown, expectedType: string) {
    const message = `Validation failed for ${field}: expected ${expectedType}, received ${typeof value}`;
    super(message, ErrorCodes.VALIDATION_ERROR);
  }
}

/**
 * Helper function to generate descriptive error messages for invalid amounts
 */
function getAmountErrorMessage(amount: unknown): string {
  if (amount === null) return 'amount cannot be null';
  if (amount === undefined) return 'amount cannot be undefined';
  if (typeof amount !== 'number') return `expected number, received ${typeof amount}`;
  if (Number.isNaN(amount)) return 'amount cannot be NaN';
  if (!Number.isFinite(amount)) return 'amount cannot be infinite';
  return 'invalid numeric value';
}

/**
 * Helper function to generate descriptive error messages for invalid currencies
 */
function getCurrencyErrorMessage(currency: unknown): string {
  if (currency === null) return 'currency code cannot be null';
  if (currency === undefined) return 'currency code cannot be undefined';
  if (typeof currency !== 'string') return `expected string, received ${typeof currency}`;
  if (currency === '') return 'currency code cannot be empty';
  return 'invalid currency code format';
}

/**
 * Type guard to check if an error is a CurrencyFormatterError
 */
export function isCurrencyFormatterError(error: unknown): error is CurrencyFormatterError {
  return error instanceof CurrencyFormatterError;
}

/**
 * Type guard to check if an error has a specific error code
 */
export function hasErrorCode(error: unknown, code: ErrorCode): boolean {
  return isCurrencyFormatterError(error) && error.code === code;
}