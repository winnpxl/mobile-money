/**
 * Shared currency type definitions for the mobile money application
 * 
 * This module provides currency-related types that are used across different
 * parts of the application, ensuring consistency in currency handling.
 */

/**
 * Supported currency codes according to ISO 4217 standards
 * 
 * These are the currencies supported by the mobile money application:
 * - XAF: Central African CFA franc
 * - GHS: Ghanaian cedi
 * - NGN: Nigerian naira
 * - USD: United States dollar
 */
export type SupportedCurrency = 'XAF' | 'GHS' | 'NGN' | 'USD';

/**
 * Type guard to check if a string is a supported currency code
 * 
 * @param currency - The currency code to check
 * @returns True if the currency is supported, false otherwise
 * 
 * @example
 * ```typescript
 * if (isSupportedCurrency('USD')) {
 *   // TypeScript now knows currency is SupportedCurrency
 *   console.log('USD is supported');
 * }
 * ```
 */
export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return ['XAF', 'GHS', 'NGN', 'USD'].includes(currency);
}

/**
 * List of all supported currency codes
 */
export const SUPPORTED_CURRENCIES: readonly SupportedCurrency[] = [
  'XAF',
  'GHS',
  'NGN', 
  'USD'
] as const;

/**
 * Currency metadata for display purposes
 */
export interface CurrencyMetadata {
  /** ISO 4217 currency code */
  code: SupportedCurrency;
  /** Full currency name */
  name: string;
  /** Currency symbol */
  symbol: string;
  /** Number of decimal places typically used */
  decimalPlaces: number;
  /** Countries where this currency is used */
  countries: string[];
}

/**
 * Metadata for all supported currencies
 */
export const CURRENCY_METADATA: Record<SupportedCurrency, CurrencyMetadata> = {
  XAF: {
    code: 'XAF',
    name: 'Central African CFA franc',
    symbol: 'FCFA',
    decimalPlaces: 0,
    countries: ['Cameroon', 'Central African Republic', 'Chad', 'Republic of the Congo', 'Equatorial Guinea', 'Gabon'],
  },
  GHS: {
    code: 'GHS',
    name: 'Ghanaian cedi',
    symbol: '₵',
    decimalPlaces: 2,
    countries: ['Ghana'],
  },
  NGN: {
    code: 'NGN',
    name: 'Nigerian naira',
    symbol: '₦',
    decimalPlaces: 2,
    countries: ['Nigeria'],
  },
  USD: {
    code: 'USD',
    name: 'United States dollar',
    symbol: '$',
    decimalPlaces: 2,
    countries: ['United States', 'Ecuador', 'El Salvador', 'Zimbabwe'],
  },
};