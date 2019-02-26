class ExchangeApiLibError extends Error {
  constructor(message) {
    super(message)
    this.code = this.constructor.name
    this.message = message
  }

  toJSON() {
    return {
      error: {
        code: this.name,
        message: this.message,
        stacktrace: this.stack,
      },
    }
  }
}

module.exports = ExchangeApiLibError
