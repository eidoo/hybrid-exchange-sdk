const CommandError = require('./CommandError')

/**
 * Class representing the command interface. */
class ABaseCommand {
  /**
   * Create a base command.
   * @param {Object} logger The logger.
   * @throws {TypeError}    If some required property is missing.
   */
  constructor(logger) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })
  }

  async executeAsync(params) {
    let result
    try {
      const validatedParams = await this.doValidateAsync(params)
      result = await this.doExecuteAsync(validatedParams)
    } catch (err) {
      result = this.formatErrors(err)
    }
    return result
  }

  // eslint-disable-next-line class-methods-use-this
  doExecuteAsync() {
    return Promise.reject(new Error('Method "doExecuteAsync" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  doValidateAsync() {
    return Promise.reject(new Error('Method "doValidateAsync" has not been implemented yet.'))
  }

  /**
   * It formats the errors.
   *
   * @param {Object} err  The err objects which contains errors list.
   */
  formatErrors(err) {
    this.log.error({ err, fn: 'formatErrors' }, 'Error during command execution.')
    let formattedErrors
    if (!Array.isArray(err.errors)) {
      formattedErrors = [
        new CommandError(
          err.code || err.name,
          err.message,
          err.field || null,
        ),
      ]
      return formattedErrors
    }
    formattedErrors = err.errors
      .map(error => new CommandError(
        error.code || error.name,
        error.message,
        error.field || null,
      ))
    return formattedErrors
  }
}

module.exports = ABaseCommand
