const { BaseError } = require('../../utils/errors')

/**
 * Class representing the ExchangeApiLibError.
 */
class ExchangeApiLibError extends BaseError {
  constructor(code, message = 'Error during exchangeApi http request') {
    super(message, code)
  }
}

module.exports = ExchangeApiLibError
