class CommandError {
  constructor(code, message, field = null) {
    this.code = code
    this.message = message
    this.field = field
  }
}

module.exports = CommandError
