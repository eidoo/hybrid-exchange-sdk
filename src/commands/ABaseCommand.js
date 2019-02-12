const { InvalidPrivateKeyError } = require('../services/PrivateKeyService')
const CommandError = require('./CommandError')

/**
 * Class representing the command interface. */
class ABaseCommand {
  /**
   * Create a base command.
   * @param {Object} logger              The logger.
   * @param {Object} privateKeyService   The privateKeyService.
   * @param {Object} privateKeyValidator The privateKeyValidator.
   * @throws {TypeError}                 If some required property is missing.
   */
  constructor(logger, privateKeyService, privateKeyValidator) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!privateKeyService) {
      const errorMessage = `Invalid "privateKeyService" value: ${privateKeyService}`
      this.throwError(errorMessage)
    }
    this.privateKeyService = privateKeyService

    if (!privateKeyValidator) {
      const errorMessage = `Invalid "privateKeyValidator" value: ${privateKeyValidator}`
      this.throwError(errorMessage)
    }
    this.privateKeyValidator = privateKeyValidator
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

  /**
   * It extract private key from file specified in privateKeyPath.
   *
   * @param {String} privateKeyPath  The path of private key file.
   *
   * @throws {InvalidPrivateKeyFile} If does not exist the file.
   *
   */
  async extractPrivateKey (privateKeyPath) {
    this.privateKeyValidator.validatePath({ privateKeyPath })
    const privateKey = await this.privateKeyService.getPrivateKeyAsync(privateKeyPath)
    this.privateKeyValidator.validatePrivateKey({ privateKey })
    return privateKey
  }

  /**
   * It gets address (EOA) from private key.s
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} privateKey            The private key.
   *
   * @throws {InvalidPrivateKeyError} If does not exist the file.
   */
  getAddressFromPrivateKey(personalWalletAddress, privateKey) {
    const personalWalletAddressFromPrivateKey = this.privateKeyService.getAddressFromPrivateKey(privateKey)
    if (personalWalletAddress && personalWalletAddress !== personalWalletAddressFromPrivateKey) {
      this.log.error({ fn: 'getAddressFromPrivateKey', personalWalletAddress },
        'The private key does not match the personal wallet address.')
      throw new InvalidPrivateKeyError(`The private key does not match the personal wallet address given in input:${personalWalletAddress}`)
    }
    return personalWalletAddressFromPrivateKey
  }

  /**
   * Throw an error, logging the message.
   * @param  {String} errorMessage        The error message.
   * @param  {Class}  ErrorType=TypeError The error class.
   * @throws {Class}                      The error.
   */
  throwError(errorMessage, ErrorType = TypeError) {
    this.log.error({ error: errorMessage })
    throw new ErrorType(errorMessage)
  }
}

module.exports = ABaseCommand
