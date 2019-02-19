const ethereumUtil = require('ethereumjs-util')

const { InvalidEthereumAddress } = require('../utils/errors')
/**
 * Class representing a base transaction builder.
 */
class BaseTransactionBuilder {
  /**
     * Create a base service.
     * @param  {Object} logger         The logger instance.
     * @param  {Object} web3           The web3 instance.
     * @param  {Object} transactionLib The transaction lib istance.
     *
     * @throws {TypeError}             If some required property is missing.
     */
  constructor(logger, web3, transactionLib) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!web3) {
      const errorMessage = `Invalid "web3" value: ${web3}`
      throw new TypeError(errorMessage)
    }

    this.web3 = web3

    if (!transactionLib) {
      const errorMessage = `Invalid "transactionLib" value: ${transactionLib}`
      throw new TypeError(errorMessage)
    }
    this.transactionLib = transactionLib
  }

  /**
   * It checks if the address is a valid ethereum address.
   * @param {String} address The address to check
   */
  static checkEtherumAddress(address) {
    if (!ethereumUtil.isValidAddress(address)) {
      throw new InvalidEthereumAddress(`The address: ${address} is not an ethereum valid address.`)
    }
  }
}

module.exports = BaseTransactionBuilder
