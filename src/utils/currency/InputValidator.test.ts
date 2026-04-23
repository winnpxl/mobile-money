/**
 * Unit tests for InputValidator class
 * 
 * Tests comprehensive input validation for all currency formatter operations,
 * including edge cases, error conditions, and validation scenarios.
 */

import { InputValidator } from './InputValidator';
import { 
  InvalidAmountError, 
  InvalidCurrencyError, 
  UnsupportedCurrencyError,
  ValidationError,
  ErrorCodes 
} from './errors';
import { DEFAULT_CONFIG } from './constants';

describe('InputValidator', () => {
  describe('validateAmount', () => {
    describe('valid amounts', () => {
      it('should accept positive integers', () => {
        expect(InputValidator.validateAmount(100)).toBe(100);
        expect(InputValidator.validateAmount(1)).toBe(1);
        expect(InputValidator.validateAmount(999999)).toBe(999999);
      });

      it('should accept positive decimals', () => {
        expect(InputValidator.validateAmount(100.50)).toBe(100.50);
        expect(InputValidator.validateAmount(0.01)).toBe(0.01);
        expect(InputValidator.validateAmount(123.456789)).toBe(123.456789);
      });

      it('should accept zero', () => {
        expect(InputValidator.validateAmount(0)).toBe(0);
        expect(InputValidator.validateAmount(0.0)).toBe(0.0);
      });

      it('should accept negative numbers', () => {
        expect(InputValidator.validateAmount(-100)).toBe(-100);
        expect(InputValidator.validateAmount(-0.50)).toBe(-0.50);
      });

      it('should accept very small numbers', () => {
        expect(InputValidator.validateAmount(0.000001)).toBe(0.000001);
        expect(InputValidator.validateAmount(Number.MIN_VALUE)).toBe(Number.MIN_VALUE);
      });

      it('should accept large safe numbers', () => {
        const largeNumber = DEFAULT_CONFIG.MAX_SAFE_AMOUNT - 1;
        expect(InputValidator.validateAmount(largeNumber)).toBe(largeNumber);
      });
    });

    describe('invalid amounts', () => {
      it('should reject null', () => {
        expect(() => InputValidator.validateAmount(null)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount(null)).toThrow('amount cannot be null');
      });

      it('should reject undefined', () => {
        expect(() => InputValidator.validateAmount(undefined)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount(undefined)).toThrow('amount cannot be undefined');
      });

      it('should reject non-numeric types', () => {
        expect(() => InputValidator.validateAmount('100')).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount('100')).toThrow('expected number, received string');

        expect(() => InputValidator.validateAmount(true)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount({})).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount([])).toThrow(InvalidAmountError);
      });

      it('should reject NaN', () => {
        expect(() => InputValidator.validateAmount(NaN)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount(NaN)).toThrow('amount cannot be NaN');
      });

      it('should reject Infinity', () => {
        expect(() => InputValidator.validateAmount(Infinity)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount(Infinity)).toThrow('amount cannot be infinite');

        expect(() => InputValidator.validateAmount(-Infinity)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount(-Infinity)).toThrow('amount cannot be infinite');
      });

      it('should reject amounts exceeding safe limits', () => {
        const tooLarge = DEFAULT_CONFIG.MAX_SAFE_AMOUNT + 1;
        expect(() => InputValidator.validateAmount(tooLarge)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount(tooLarge)).toThrow('exceeds maximum safe value');

        const tooSmall = DEFAULT_CONFIG.MIN_SAFE_AMOUNT - 1;
        expect(() => InputValidator.validateAmount(tooSmall)).toThrow(InvalidAmountError);
        expect(() => InputValidator.validateAmount(tooSmall)).toThrow('below minimum safe value');
      });

      it('should throw errors with correct error codes', () => {
        try {
          InputValidator.validateAmount(null);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidAmountError);
          expect((error as InvalidAmountError).code).toBe(ErrorCodes.INVALID_AMOUNT);
        }
      });
    });
  });

  describe('validateCurrency', () => {
    describe('valid currencies', () => {
      it('should accept supported currency codes', () => {
        expect(InputValidator.validateCurrency('XAF')).toBe('XAF');
        expect(InputValidator.validateCurrency('GHS')).toBe('GHS');
        expect(InputValidator.validateCurrency('NGN')).toBe('NGN');
        expect(InputValidator.validateCurrency('USD')).toBe('USD');
      });

      it('should normalize currency codes to uppercase', () => {
        expect(InputValidator.validateCurrency('usd')).toBe('USD');
        expect(InputValidator.validateCurrency('xaf')).toBe('XAF');
        expect(InputValidator.validateCurrency('ghs')).toBe('GHS');
        expect(InputValidator.validateCurrency('ngn')).toBe('NGN');
      });

      it('should handle mixed case currency codes', () => {
        expect(InputValidator.validateCurrency('Usd')).toBe('USD');
        expect(InputValidator.validateCurrency('xAf')).toBe('XAF');
      });
    });

    describe('invalid currencies', () => {
      it('should reject null', () => {
        expect(() => InputValidator.validateCurrency(null)).toThrow(InvalidCurrencyError);
        expect(() => InputValidator.validateCurrency(null)).toThrow('currency code cannot be null');
      });

      it('should reject undefined', () => {
        expect(() => InputValidator.validateCurrency(undefined)).toThrow(InvalidCurrencyError);
        expect(() => InputValidator.validateCurrency(undefined)).toThrow('currency code cannot be undefined');
      });

      it('should reject non-string types', () => {
        expect(() => InputValidator.validateCurrency(123)).toThrow(InvalidCurrencyError);
        expect(() => InputValidator.validateCurrency(123)).toThrow('expected string, received number');

        expect(() => InputValidator.validateCurrency(true)).toThrow(InvalidCurrencyError);
        expect(() => InputValidator.validateCurrency({})).toThrow(InvalidCurrencyError);
        expect(() => InputValidator.validateCurrency([])).toThrow(InvalidCurrencyError);
      });

      it('should reject empty string', () => {
        expect(() => InputValidator.validateCurrency('')).toThrow(InvalidCurrencyError);
        expect(() => InputValidator.validateCurrency('')).toThrow('currency code cannot be empty');
      });

      it('should reject unsupported currency codes', () => {
        expect(() => InputValidator.validateCurrency('EUR')).toThrow(UnsupportedCurrencyError);
        expect(() => InputValidator.validateCurrency('EUR')).toThrow('Unsupported currency: EUR');
        expect(() => InputValidator.validateCurrency('EUR')).toThrow('Supported currencies: XAF, GHS, NGN, USD');

        expect(() => InputValidator.validateCurrency('GBP')).toThrow(UnsupportedCurrencyError);
        expect(() => InputValidator.validateCurrency('JPY')).toThrow(UnsupportedCurrencyError);
        expect(() => InputValidator.validateCurrency('INVALID')).toThrow(UnsupportedCurrencyError);
      });

      it('should throw errors with correct error codes', () => {
        try {
          InputValidator.validateCurrency(null);
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidCurrencyError);
          expect((error as InvalidCurrencyError).code).toBe(ErrorCodes.INVALID_CURRENCY);
        }

        try {
          InputValidator.validateCurrency('EUR');
        } catch (error) {
          expect(error).toBeInstanceOf(UnsupportedCurrencyError);
          expect((error as UnsupportedCurrencyError).code).toBe(ErrorCodes.UNSUPPORTED_CURRENCY);
        }
      });
    });
  });

  describe('isSupportedCurrency', () => {
    it('should return true for supported currencies', () => {
      expect(InputValidator.isSupportedCurrency('XAF')).toBe(true);
      expect(InputValidator.isSupportedCurrency('GHS')).toBe(true);
      expect(InputValidator.isSupportedCurrency('NGN')).toBe(true);
      expect(InputValidator.isSupportedCurrency('USD')).toBe(true);
    });

    it('should return false for unsupported currencies', () => {
      expect(InputValidator.isSupportedCurrency('EUR')).toBe(false);
      expect(InputValidator.isSupportedCurrency('GBP')).toBe(false);
      expect(InputValidator.isSupportedCurrency('JPY')).toBe(false);
      expect(InputValidator.isSupportedCurrency('INVALID')).toBe(false);
      expect(InputValidator.isSupportedCurrency('')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(InputValidator.isSupportedCurrency('usd')).toBe(false);
      expect(InputValidator.isSupportedCurrency('xaf')).toBe(false);
    });
  });

  describe('validateDecimalPlaces', () => {
    describe('valid decimal places', () => {
      it('should accept valid decimal place values', () => {
        expect(InputValidator.validateDecimalPlaces(0)).toBe(0);
        expect(InputValidator.validateDecimalPlaces(1)).toBe(1);
        expect(InputValidator.validateDecimalPlaces(2)).toBe(2);
        expect(InputValidator.validateDecimalPlaces(10)).toBe(10);
        expect(InputValidator.validateDecimalPlaces(20)).toBe(20);
      });
    });

    describe('invalid decimal places', () => {
      it('should reject non-numeric types', () => {
        expect(() => InputValidator.validateDecimalPlaces('2')).toThrow(ValidationError);
        expect(() => InputValidator.validateDecimalPlaces('2')).toThrow('expected number');
      });

      it('should reject non-integer values', () => {
        expect(() => InputValidator.validateDecimalPlaces(2.5)).toThrow(ValidationError);
        expect(() => InputValidator.validateDecimalPlaces(2.5)).toThrow('expected integer');
      });

      it('should reject negative values', () => {
        expect(() => InputValidator.validateDecimalPlaces(-1)).toThrow(ValidationError);
        expect(() => InputValidator.validateDecimalPlaces(-1)).toThrow('non-negative integer');
      });

      it('should reject values greater than 20', () => {
        expect(() => InputValidator.validateDecimalPlaces(21)).toThrow(ValidationError);
        expect(() => InputValidator.validateDecimalPlaces(21)).toThrow('integer between 0 and 20');
      });
    });
  });

  describe('validateLocale', () => {
    describe('valid locales', () => {
      it('should accept valid locale formats', () => {
        expect(InputValidator.validateLocale('en-US')).toBe('en-US');
        expect(InputValidator.validateLocale('fr-CM')).toBe('fr-CM');
        expect(InputValidator.validateLocale('en-GH')).toBe('en-GH');
        expect(InputValidator.validateLocale('en-NG')).toBe('en-NG');
      });

      it('should accept language-only locales', () => {
        expect(InputValidator.validateLocale('en')).toBe('en');
        expect(InputValidator.validateLocale('fr')).toBe('fr');
      });
    });

    describe('invalid locales', () => {
      it('should reject non-string types', () => {
        expect(() => InputValidator.validateLocale(123)).toThrow(ValidationError);
        expect(() => InputValidator.validateLocale(123)).toThrow('expected string');
      });

      it('should reject empty strings', () => {
        expect(() => InputValidator.validateLocale('')).toThrow(ValidationError);
        expect(() => InputValidator.validateLocale('')).toThrow('non-empty string');
      });

      it('should reject invalid locale formats', () => {
        expect(() => InputValidator.validateLocale('invalid')).toThrow(ValidationError);
        expect(() => InputValidator.validateLocale('en-us')).toThrow(ValidationError); // lowercase country
        expect(() => InputValidator.validateLocale('EN-US')).toThrow(ValidationError); // uppercase language
        expect(() => InputValidator.validateLocale('en-USA')).toThrow(ValidationError); // 3-letter country
      });
    });
  });

  describe('validateCurrencySymbol', () => {
    describe('valid symbols', () => {
      it('should accept valid currency symbols', () => {
        expect(InputValidator.validateCurrencySymbol('$')).toBe('$');
        expect(InputValidator.validateCurrencySymbol('₦')).toBe('₦');
        expect(InputValidator.validateCurrencySymbol('₵')).toBe('₵');
        expect(InputValidator.validateCurrencySymbol('FCFA')).toBe('FCFA');
      });

      it('should accept multi-character symbols', () => {
        expect(InputValidator.validateCurrencySymbol('USD')).toBe('USD');
        expect(InputValidator.validateCurrencySymbol('€')).toBe('€');
      });
    });

    describe('invalid symbols', () => {
      it('should reject non-string types', () => {
        expect(() => InputValidator.validateCurrencySymbol(123)).toThrow(ValidationError);
        expect(() => InputValidator.validateCurrencySymbol(123)).toThrow('expected string');
      });

      it('should reject empty strings', () => {
        expect(() => InputValidator.validateCurrencySymbol('')).toThrow(ValidationError);
        expect(() => InputValidator.validateCurrencySymbol('')).toThrow('non-empty string');
      });

      it('should reject symbols that are too long', () => {
        const longSymbol = 'A'.repeat(11);
        expect(() => InputValidator.validateCurrencySymbol(longSymbol)).toThrow(ValidationError);
        expect(() => InputValidator.validateCurrencySymbol(longSymbol)).toThrow('length <= 10 characters');
      });
    });
  });

  describe('validateInputs', () => {
    it('should validate both amount and currency together', () => {
      const result = InputValidator.validateInputs(100.50, 'USD');
      expect(result).toEqual({
        amount: 100.50,
        currency: 'USD'
      });
    });

    it('should normalize currency code in combined validation', () => {
      const result = InputValidator.validateInputs(100, 'usd');
      expect(result).toEqual({
        amount: 100,
        currency: 'USD'
      });
    });

    it('should throw appropriate errors for invalid inputs', () => {
      expect(() => InputValidator.validateInputs(null, 'USD')).toThrow(InvalidAmountError);
      expect(() => InputValidator.validateInputs(100, null)).toThrow(InvalidCurrencyError);
      expect(() => InputValidator.validateInputs(100, 'EUR')).toThrow(UnsupportedCurrencyError);
    });
  });

  describe('validateFormatOptions', () => {
    describe('valid format options', () => {
      it('should accept empty or undefined options', () => {
        expect(InputValidator.validateFormatOptions(undefined)).toEqual({});
        expect(InputValidator.validateFormatOptions(null)).toEqual({});
        expect(InputValidator.validateFormatOptions({})).toEqual({});
      });

      it('should validate style option', () => {
        const result = InputValidator.validateFormatOptions({ style: 'currency' });
        expect(result).toEqual({ style: 'currency' });

        expect(InputValidator.validateFormatOptions({ style: 'decimal' })).toEqual({ style: 'decimal' });
        expect(InputValidator.validateFormatOptions({ style: 'percent' })).toEqual({ style: 'percent' });
        expect(InputValidator.validateFormatOptions({ style: 'unit' })).toEqual({ style: 'unit' });
      });

      it('should validate currency option', () => {
        const result = InputValidator.validateFormatOptions({ currency: 'USD' });
        expect(result).toEqual({ currency: 'USD' });

        const result2 = InputValidator.validateFormatOptions({ currency: 'usd' });
        expect(result2).toEqual({ currency: 'USD' });
      });

      it('should validate fraction digits options', () => {
        const result = InputValidator.validateFormatOptions({
          minimumFractionDigits: 2,
          maximumFractionDigits: 4
        });
        expect(result).toEqual({
          minimumFractionDigits: 2,
          maximumFractionDigits: 4
        });
      });

      it('should validate complex options', () => {
        const result = InputValidator.validateFormatOptions({
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        expect(result).toEqual({
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      });
    });

    describe('invalid format options', () => {
      it('should reject non-object types', () => {
        expect(() => InputValidator.validateFormatOptions('invalid')).toThrow(ValidationError);
        expect(() => InputValidator.validateFormatOptions(123)).toThrow(ValidationError);
      });

      it('should reject invalid style values', () => {
        expect(() => InputValidator.validateFormatOptions({ style: 'invalid' })).toThrow(ValidationError);
        expect(() => InputValidator.validateFormatOptions({ style: 123 })).toThrow(ValidationError);
      });

      it('should reject invalid currency values', () => {
        expect(() => InputValidator.validateFormatOptions({ currency: 'EUR' })).toThrow(UnsupportedCurrencyError);
        expect(() => InputValidator.validateFormatOptions({ currency: 123 })).toThrow(ValidationError);
      });

      it('should reject invalid fraction digits', () => {
        expect(() => InputValidator.validateFormatOptions({ minimumFractionDigits: -1 })).toThrow(ValidationError);
        expect(() => InputValidator.validateFormatOptions({ maximumFractionDigits: 21 })).toThrow(ValidationError);
        expect(() => InputValidator.validateFormatOptions({ minimumFractionDigits: 2.5 })).toThrow(ValidationError);
      });
    });
  });

  describe('error handling', () => {
    it('should provide descriptive error messages', () => {
      try {
        InputValidator.validateAmount('not a number');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidAmountError);
        expect((error as Error).message).toContain('expected number, received string');
      }

      try {
        InputValidator.validateCurrency('EUR');
      } catch (error) {
        expect(error).toBeInstanceOf(UnsupportedCurrencyError);
        expect((error as Error).message).toContain('Supported currencies: XAF, GHS, NGN, USD');
      }
    });

    it('should include error codes for programmatic handling', () => {
      try {
        InputValidator.validateAmount(null);
      } catch (error) {
        expect((error as InvalidAmountError).code).toBe(ErrorCodes.INVALID_AMOUNT);
      }

      try {
        InputValidator.validateCurrency('EUR');
      } catch (error) {
        expect((error as UnsupportedCurrencyError).code).toBe(ErrorCodes.UNSUPPORTED_CURRENCY);
      }
    });
  });
});