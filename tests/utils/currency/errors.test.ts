/**
 * Unit tests for currency formatter error classes and error handling
 */

import {
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
} from '../../../src/utils/currency/errors';

describe('Currency Formatter Errors', () => {
  describe('CurrencyFormatterError base class', () => {
    it('should create error with message and code', () => {
      const error = new CurrencyFormatterError('Test message', ErrorCodes.INVALID_AMOUNT);
      
      expect(error.message).toBe('Test message');
      expect(error.code).toBe(ErrorCodes.INVALID_AMOUNT);
      expect(error.name).toBe('CurrencyFormatterError');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should create error with cause', () => {
      const cause = new Error('Original error');
      const error = new CurrencyFormatterError('Wrapper error', ErrorCodes.FORMATTING_ERROR, cause);
      
      expect(error.cause).toBe(cause);
      expect(error.message).toBe('Wrapper error');
      expect(error.code).toBe(ErrorCodes.FORMATTING_ERROR);
    });

    it('should serialize to JSON correctly', () => {
      const cause = new Error('Original error');
      const error = new CurrencyFormatterError('Test error', ErrorCodes.CACHE_ERROR, cause);
      
      const json = error.toJSON();
      
      expect(json).toEqual({
        name: 'CurrencyFormatterError',
        message: 'Test error',
        code: ErrorCodes.CACHE_ERROR,
        stack: expect.any(String),
        cause: 'Original error',
      });
    });

    it('should serialize to JSON without cause', () => {
      const error = new CurrencyFormatterError('Test error', ErrorCodes.VALIDATION_ERROR);
      
      const json = error.toJSON();
      
      expect(json).toEqual({
        name: 'CurrencyFormatterError',
        message: 'Test error',
        code: ErrorCodes.VALIDATION_ERROR,
        stack: expect.any(String),
        cause: undefined,
      });
    });
  });

  describe('InvalidAmountError', () => {
    it('should create error for null amount', () => {
      const error = new InvalidAmountError(null);
      
      expect(error.message).toBe('Invalid amount: amount cannot be null');
      expect(error.code).toBe(ErrorCodes.INVALID_AMOUNT);
      expect(error).toBeInstanceOf(InvalidAmountError);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should create error for undefined amount', () => {
      const error = new InvalidAmountError(undefined);
      
      expect(error.message).toBe('Invalid amount: amount cannot be undefined');
      expect(error.code).toBe(ErrorCodes.INVALID_AMOUNT);
    });

    it('should create error for non-number amount', () => {
      const error = new InvalidAmountError('not a number');
      
      expect(error.message).toBe('Invalid amount: expected number, received string');
      expect(error.code).toBe(ErrorCodes.INVALID_AMOUNT);
    });

    it('should create error for NaN amount', () => {
      const error = new InvalidAmountError(NaN);
      
      expect(error.message).toBe('Invalid amount: amount cannot be NaN');
      expect(error.code).toBe(ErrorCodes.INVALID_AMOUNT);
    });

    it('should create error for infinite amount', () => {
      const error = new InvalidAmountError(Infinity);
      
      expect(error.message).toBe('Invalid amount: amount cannot be infinite');
      expect(error.code).toBe(ErrorCodes.INVALID_AMOUNT);
    });

    it('should create error with additional details', () => {
      const error = new InvalidAmountError(null, 'Amount must be provided for transaction');
      
      expect(error.message).toBe('Invalid amount: amount cannot be null. Amount must be provided for transaction');
      expect(error.code).toBe(ErrorCodes.INVALID_AMOUNT);
    });
  });

  describe('InvalidCurrencyError', () => {
    it('should create error for null currency', () => {
      const error = new InvalidCurrencyError(null);
      
      expect(error.message).toBe('Invalid currency: currency code cannot be null');
      expect(error.code).toBe(ErrorCodes.INVALID_CURRENCY);
      expect(error).toBeInstanceOf(InvalidCurrencyError);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should create error for undefined currency', () => {
      const error = new InvalidCurrencyError(undefined);
      
      expect(error.message).toBe('Invalid currency: currency code cannot be undefined');
      expect(error.code).toBe(ErrorCodes.INVALID_CURRENCY);
    });

    it('should create error for non-string currency', () => {
      const error = new InvalidCurrencyError(123);
      
      expect(error.message).toBe('Invalid currency: expected string, received number');
      expect(error.code).toBe(ErrorCodes.INVALID_CURRENCY);
    });

    it('should create error for empty currency', () => {
      const error = new InvalidCurrencyError('');
      
      expect(error.message).toBe('Invalid currency: currency code cannot be empty');
      expect(error.code).toBe(ErrorCodes.INVALID_CURRENCY);
    });

    it('should create error with additional details', () => {
      const error = new InvalidCurrencyError(null, 'Currency is required for formatting');
      
      expect(error.message).toBe('Invalid currency: currency code cannot be null. Currency is required for formatting');
      expect(error.code).toBe(ErrorCodes.INVALID_CURRENCY);
    });
  });

  describe('UnsupportedCurrencyError', () => {
    it('should create error with supported currencies list', () => {
      const error = new UnsupportedCurrencyError('EUR', ['USD', 'XAF', 'GHS', 'NGN']);
      
      expect(error.message).toBe('Unsupported currency: EUR. Supported currencies: USD, XAF, GHS, NGN');
      expect(error.code).toBe(ErrorCodes.UNSUPPORTED_CURRENCY);
      expect(error).toBeInstanceOf(UnsupportedCurrencyError);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should handle empty supported currencies list', () => {
      const error = new UnsupportedCurrencyError('EUR', []);
      
      expect(error.message).toBe('Unsupported currency: EUR. Supported currencies: ');
      expect(error.code).toBe(ErrorCodes.UNSUPPORTED_CURRENCY);
    });
  });

  describe('ConfigurationError', () => {
    it('should create error with message', () => {
      const error = new ConfigurationError('Invalid decimal places');
      
      expect(error.message).toBe('Configuration error: Invalid decimal places');
      expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should create error with details', () => {
      const error = new ConfigurationError('Invalid decimal places', 'Must be non-negative');
      
      expect(error.message).toBe('Configuration error: Invalid decimal places. Must be non-negative');
      expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
    });
  });

  describe('CacheError', () => {
    it('should create error for cache operation', () => {
      const error = new CacheError('retrieval');
      
      expect(error.message).toBe('Cache retrieval failed');
      expect(error.code).toBe(ErrorCodes.CACHE_ERROR);
      expect(error).toBeInstanceOf(CacheError);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should create error with details', () => {
      const error = new CacheError('cleanup', 'Memory limit exceeded');
      
      expect(error.message).toBe('Cache cleanup failed: Memory limit exceeded');
      expect(error.code).toBe(ErrorCodes.CACHE_ERROR);
    });
  });

  describe('FormattingError', () => {
    it('should create error with message', () => {
      const error = new FormattingError('Intl.NumberFormat failed');
      
      expect(error.message).toBe('Formatting failed: Intl.NumberFormat failed');
      expect(error.code).toBe(ErrorCodes.FORMATTING_ERROR);
      expect(error).toBeInstanceOf(FormattingError);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should create error with cause', () => {
      const cause = new Error('Invalid locale');
      const error = new FormattingError('Locale error', cause);
      
      expect(error.message).toBe('Formatting failed: Locale error');
      expect(error.code).toBe(ErrorCodes.FORMATTING_ERROR);
      expect(error.cause).toBe(cause);
    });
  });

  describe('ValidationError', () => {
    it('should create error for field validation', () => {
      const error = new ValidationError('amount', 'not a number', 'number');
      
      expect(error.message).toBe('Validation failed for amount: expected number, received string');
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error).toBeInstanceOf(CurrencyFormatterError);
    });

    it('should handle different value types', () => {
      const error = new ValidationError('currency', null, 'string');
      
      expect(error.message).toBe('Validation failed for currency: expected string, received object');
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
    });
  });

  describe('Error codes', () => {
    it('should have all expected error codes', () => {
      expect(ErrorCodes.INVALID_AMOUNT).toBe('INVALID_AMOUNT');
      expect(ErrorCodes.INVALID_CURRENCY).toBe('INVALID_CURRENCY');
      expect(ErrorCodes.UNSUPPORTED_CURRENCY).toBe('UNSUPPORTED_CURRENCY');
      expect(ErrorCodes.CONFIGURATION_ERROR).toBe('CONFIGURATION_ERROR');
      expect(ErrorCodes.CACHE_ERROR).toBe('CACHE_ERROR');
      expect(ErrorCodes.FORMATTING_ERROR).toBe('FORMATTING_ERROR');
      expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    });
  });

  describe('Type guards', () => {
    describe('isCurrencyFormatterError', () => {
      it('should return true for CurrencyFormatterError instances', () => {
        const error = new CurrencyFormatterError('Test', ErrorCodes.INVALID_AMOUNT);
        expect(isCurrencyFormatterError(error)).toBe(true);
      });

      it('should return true for subclass instances', () => {
        const error = new InvalidAmountError(null);
        expect(isCurrencyFormatterError(error)).toBe(true);
      });

      it('should return false for regular Error instances', () => {
        const error = new Error('Regular error');
        expect(isCurrencyFormatterError(error)).toBe(false);
      });

      it('should return false for non-error values', () => {
        expect(isCurrencyFormatterError('string')).toBe(false);
        expect(isCurrencyFormatterError(null)).toBe(false);
        expect(isCurrencyFormatterError(undefined)).toBe(false);
        expect(isCurrencyFormatterError({})).toBe(false);
      });
    });

    describe('hasErrorCode', () => {
      it('should return true for matching error code', () => {
        const error = new InvalidAmountError(null);
        expect(hasErrorCode(error, ErrorCodes.INVALID_AMOUNT)).toBe(true);
      });

      it('should return false for non-matching error code', () => {
        const error = new InvalidAmountError(null);
        expect(hasErrorCode(error, ErrorCodes.INVALID_CURRENCY)).toBe(false);
      });

      it('should return false for non-CurrencyFormatterError', () => {
        const error = new Error('Regular error');
        expect(hasErrorCode(error, ErrorCodes.INVALID_AMOUNT)).toBe(false);
      });

      it('should return false for non-error values', () => {
        expect(hasErrorCode('string', ErrorCodes.INVALID_AMOUNT)).toBe(false);
        expect(hasErrorCode(null, ErrorCodes.INVALID_AMOUNT)).toBe(false);
      });
    });
  });
});