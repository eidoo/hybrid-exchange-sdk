const ethereumUtil = require('ethereumjs-util')

const { InvalidEthereumAddress } = require('../utils/errors')
/**
 * Class representing a base service.
 * A service is an abstraction layer used to manipulate domain objects and provide data from various external sources.
 */
class BaseService {
  /**
     * Create a base service.
     * @param  {Object}    logger The logger instance.
     * @param  {Object}    web3   The web3 instance.
     * @throws {TypeError}        If some required property is missing.
     */
  constructor(logger, web3) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!web3) {
      const errorMessage = `Invalid "web3" value: ${web3}`
      this.throwError(errorMessage)
    }

    this.web3 = web3
  }

  /**
   * It checks if the address is a valid ethereum address.
   * @param {String} address The address to check
   */
  checkEtherumAddress(address) {
    if (!ethereumUtil.isValidAddress(address)) {
      this.throwError(`The address: ${address} is not an ethereum valid address.`, InvalidEthereumAddress)
    }
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

module.exports = BaseService
