/**
 * Input validation class for the Currency Formatter Utility
 * 
 * This module provides comprehensive input validation for all currency formatter
 * operations, ensuring robust error handling with clear, descriptive error messages.
 * All validation methods are static for easy use throughout the application.
 */

import { SupportedCurrency } from './types';
import { 
  InvalidAmountError, 
  InvalidCurrencyError, 
  UnsupportedCurrencyError,
  ValidationError 
} from './errors';
import { SUPPORTED_CURRENCIES, DEFAULT_CONFIG } from './constants';

/**
 * Static input validation class for currency formatter operations
 * 
 * Provides comprehensive validation for amounts, currency codes, and other
 * input parameters with descriptive error messages for all validation failures.
 */
export class InputValidator {
  /**
   * Validates and normalizes an amount value for currency formatting
   * 
   * @param amount - The amount value to validate
   * @returns The validated amount as a number
   * @throws {InvalidAmountError} When the amount is invalid
   * 
   * @example
   * ```typescript
   * const validAmount = InputValidator.validateAmount(100.50); // Returns 100.50
   * const invalidAmount = InputValidator.validateAmount("not a number"); // Throws InvalidAmountError
   * ```
   */
  static validateAmount(amount: unknown): number {
    // Check for null or undefined
    if (amount === null || amount === undefined) {
      throw new InvalidAmountError(amount);
    }

    // Check if it's a number
    if (typeof amount !== 'number') {
      throw new InvalidAmountError(amount);
    }

    // Check for NaN
    if (Number.isNaN(amount)) {
      throw new InvalidAmountError(amount);
    }

    // Check for infinity
    if (!Number.isFinite(amount)) {
      throw new InvalidAmountError(amount);
    }

    // Check for safe number range to prevent overflow issues
    if (amount > DEFAULT_CONFIG.MAX_SAFE_AMOUNT) {
      throw new InvalidAmountError(amount, `Amount exceeds maximum safe value of ${DEFAULT_CONFIG.MAX_SAFE_AMOUNT}`);
    }

    if (amount < DEFAULT_CONFIG.MIN_SAFE_AMOUNT) {
      throw new InvalidAmountError(amount, `Amount is below minimum safe value of ${DEFAULT_CONFIG.MIN_SAFE_AMOUNT}`);
    }

    return amount;
  }

  /**
   * Validates and normalizes a currency code for currency formatting
   * 
   * @param currency - The currency code to validate
   * @returns The validated currency code as a SupportedCurrency
   * @throws {InvalidCurrencyError} When the currency code is invalid
   * @throws {UnsupportedCurrencyError} When the currency code is not supported
   * 
   * @example
   * ```typescript
   * const validCurrency = InputValidator.validateCurrency('USD'); // Returns 'USD'
   * const invalidCurrency = InputValidator.validateCurrency(null); // Throws InvalidCurrencyError
   * const unsupportedCurrency = InputValidator.validateCurrency('EUR'); // Throws UnsupportedCurrencyError
   * ```
   */
  static validateCurrency(currency: unknown): SupportedCurrency {
    // Check for null or undefined
    if (currency === null || currency === undefined) {
      throw new InvalidCurrencyError(currency);
    }

    // Check if it's a string
    if (typeof currency !== 'string') {
      throw new InvalidCurrencyError(currency);
    }

    // Check for empty string
    if (currency === '') {
      throw new InvalidCurrencyError(currency);
    }

    // Normalize to uppercase for case-insensitive comparison
    const normalizedCurrency = currency.toUpperCase();

    // Check if it's a supported currency
    if (!this.isSupportedCurrency(normalizedCurrency)) {
      throw new UnsupportedCurrencyError(normalizedCurrency, [...SUPPORTED_CURRENCIES]);
    }

    return normalizedCurrency as SupportedCurrency;
  }

  /**
   * Type guard to check if a currency code is supported
   * 
   * @param currency - The currency code to check
   * @returns True if the currency is supported, false otherwise
   * 
   * @example
   * ```typescript
   * if (InputValidator.isSupportedCurrency('USD')) {
   *   // TypeScript now knows currency is SupportedCurrency
   *   console.log('USD is supported');
   * }
   * ```
   */
  static isSupportedCurrency(currency: string): currency is SupportedCurrency {
    return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency);
  }

  /**
   * Validates decimal places parameter for rounding operations
   * 
   * @param decimalPlaces - The number of decimal places to validate
   * @returns The validated decimal places as a number
   * @throws {ValidationError} When decimal places is invalid
   * 
   * @example
   * ```typescript
   * const validDecimalPlaces = InputValidator.validateDecimalPlaces(2); // Returns 2
   * const invalidDecimalPlaces = InputValidator.validateDecimalPlaces(-1); // Throws ValidationError
   * ```
   */
  static validateDecimalPlaces(decimalPlaces: unknown): number {
    if (typeof decimalPlaces !== 'number') {
      throw new ValidationError('decimalPlaces', decimalPlaces, 'number');
    }

    if (!Number.isInteger(decimalPlaces)) {
      throw new ValidationError('decimalPlaces', decimalPlaces, 'integer');
    }

    if (decimalPlaces < 0) {
      throw new ValidationError('decimalPlaces', decimalPlaces, 'non-negative integer');
    }

    if (decimalPlaces > 20) {
      throw new ValidationError('decimalPlaces', decimalPlaces, 'integer between 0 and 20');
    }

    return decimalPlaces;
  }

  /**
   * Validates locale string for formatting operations
   * 
   * @param locale - The locale string to validate
   * @returns The validated locale string
   * @throws {ValidationError} When locale is invalid
   * 
   * @example
   * ```typescript
   * const validLocale = InputValidator.validateLocale('en-US'); // Returns 'en-US'
   * const invalidLocale = InputValidator.validateLocale(''); // Throws ValidationError
   * ```
   */
  static validateLocale(locale: unknown): string {
    if (typeof locale !== 'string') {
      throw new ValidationError('locale', locale, 'string');
    }

    if (locale === '') {
      throw new ValidationError('locale', locale, 'non-empty string');
    }

    // Basic locale format validation (language-country or language)
    const localePattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!localePattern.test(locale)) {
      throw new ValidationError('locale', locale, 'valid locale format (e.g., "en-US", "fr")');
    }

    return locale;
  }

  /**
   * Validates currency symbol for display purposes
   * 
   * @param symbol - The currency symbol to validate
   * @returns The validated currency symbol
   * @throws {ValidationError} When symbol is invalid
   * 
   * @example
   * ```typescript
   * const validSymbol = InputValidator.validateCurrencySymbol('$'); // Returns '$'
   * const invalidSymbol = InputValidator.validateCurrencySymbol(''); // Throws ValidationError
   * ```
   */
  static validateCurrencySymbol(symbol: unknown): string {
    if (typeof symbol !== 'string') {
      throw new ValidationError('currencySymbol', symbol, 'string');
    }

    if (symbol === '') {
      throw new ValidationError('currencySymbol', symbol, 'non-empty string');
    }

    // Currency symbols should be reasonably short
    if (symbol.length > 10) {
      throw new ValidationError('currencySymbol', symbol, 'string with length <= 10 characters');
    }

    return symbol;
  }

  /**
   * Validates a complete set of inputs for currency formatting operations
   * 
   * @param amount - The amount to validate
   * @param currency - The currency code to validate
   * @returns An object with validated amount and currency
   * @throws {InvalidAmountError|InvalidCurrencyError|UnsupportedCurrencyError} When inputs are invalid
   * 
   * @example
   * ```typescript
   * const { amount, currency } = InputValidator.validateInputs(100.50, 'USD');
   * // Returns { amount: 100.50, currency: 'USD' }
   * ```
   */
  static validateInputs(amount: unknown, currency: unknown): { amount: number; currency: SupportedCurrency } {
    const validatedAmount = this.validateAmount(amount);
    const validatedCurrency = this.validateCurrency(currency);

    return {
      amount: validatedAmount,
      currency: validatedCurrency,
    };
  }

  /**
   * Validates Intl.NumberFormatOptions for custom formatting
   * 
   * @param options - The formatting options to validate
   * @returns The validated formatting options
   * @throws {ValidationError} When options are invalid
   * 
   * @example
   * ```typescript
   * const validOptions = InputValidator.validateFormatOptions({
   *   style: 'currency',
   *   currency: 'USD'
   * });
   * ```
   */
  static validateFormatOptions(options: unknown): Partial<Intl.NumberFormatOptions> {
    if (options === null || options === undefined) {
      return {};
    }

    if (typeof options !== 'object') {
      throw new ValidationError('formatOptions', options, 'object');
    }

    const validOptions = options as Record<string, unknown>;
    const result: Partial<Intl.NumberFormatOptions> = {};

    // Validate specific known options
    if ('style' in validOptions) {
      const style = validOptions.style;
      if (typeof style === 'string' && ['decimal', 'currency', 'percent', 'unit'].includes(style)) {
        result.style = style as 'decimal' | 'currency' | 'percent' | 'unit';
      } else {
        throw new ValidationError('formatOptions.style', style, 'valid style ("decimal", "currency", "percent", "unit")');
      }
    }

    if ('currency' in validOptions) {
      const currency = validOptions.currency;
      if (typeof currency === 'string') {
        result.currency = this.validateCurrency(currency);
      } else {
        throw new ValidationError('formatOptions.currency', currency, 'string');
      }
    }

    if ('minimumFractionDigits' in validOptions) {
      const minDigits = validOptions.minimumFractionDigits;
      if (typeof minDigits === 'number' && Number.isInteger(minDigits) && minDigits >= 0 && minDigits <= 20) {
        result.minimumFractionDigits = minDigits;
      } else {
        throw new ValidationError('formatOptions.minimumFractionDigits', minDigits, 'integer between 0 and 20');
      }
    }

    if ('maximumFractionDigits' in validOptions) {
      const maxDigits = validOptions.maximumFractionDigits;
      if (typeof maxDigits === 'number' && Number.isInteger(maxDigits) && maxDigits >= 0 && maxDigits <= 20) {
        result.maximumFractionDigits = maxDigits;
      } else {
        throw new ValidationError('formatOptions.maximumFractionDigits', maxDigits, 'integer between 0 and 20');
      }
    }

    return result;
  }
}