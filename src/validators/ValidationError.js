function sanitize(sourceToSanatize) {
  return sourceToSanatize.replace(/['"]+/g, '')
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.message = sanitize(message)
    this.field = field
    this.code = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ValidationError
