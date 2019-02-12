/**
 * Class representing the ExchangeApiLibError.
 */
class ExchangeApiLibError extends Error {
  constructor(parent, message = 'Error during http request') {
    super(message)
    this.parent = parent
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ExchangeApiLibError
