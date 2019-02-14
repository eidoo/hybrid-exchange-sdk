const ethereumUtil = require('ethereumjs-util')

const { InvalidEthereumAddress } = require('../utils/errors')

/**
 * Class representing a base service.
 * A service is an abstraction layer used to manipulate domain objects and provide data from various external sources.
 */
class BaseTransactionService {
  /**
     * Create a base service.
     * @param  {Object}    logger             The logger instance.
     * @param  {Object}    web3               The web3 instance.
     * @param  {Object}    transactionLib     The transaction lib istance.
     * @param  {Object}    transactionBuilder The trading wallet transaction builder lib istance.
     * @throws {TypeError}                    If some required property is missing.
     */
  constructor(logger, web3, transactionLib, transactionBuilder) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!web3) {
      const errorMessage = `Invalid "web3" value: ${web3}`
      this.throwError(errorMessage)
    }

    this.web3 = web3

    if (!transactionLib) {
      const errorMessage = `Invalid "transactionLib" value: ${transactionLib}`
      this.throwError(errorMessage)
    }
    this.transactionLib = transactionLib

    if (!transactionBuilder) {
      const errorMessage = `Invalid "transactionBuilder" value: ${transactionBuilder}`
      this.throwError(errorMessage)
    }
    this.transactionBuilder = transactionBuilder
  }

  /**
   * It checks if the address is a valid ethereum address.
   * @param {String} address The address to check
   */
  checkEtherumAddress(address) {
    if (!ethereumUtil.isValidAddress(address)) {
      this.log.error({ fn: 'checkEtherumAddress', address }, `Address:  ${address} is not an ethereum valid address.`)
      throw new InvalidEthereumAddress(`The address: ${address} is not an ethereum valid address.`)
    }
  }

  /**
   * It builds a transaction draf, signs and executes transaction.
   *
   * @param {String} privateKey                  The private key.
   * @param {Object} transactionDraftBuilderName The transaction builder function name.
   * @param {Array}  transactionParams           The transaction input params for transaction builder function.
   * @param {Object} params
   * @param {Object} params.gasPrice             The gas price.
   * @param {Object} params.gas                  The gas limit.
   * @param {Number} nonce                       The nonce.
   */
  async transactionExecutor(privateKey, transactionDraftBuilderName, transactionParams, { gasPrice, gas } = {}, nonce) {
    const transactionObjectDraft = this
      .transactionBuilder[transactionDraftBuilderName](
        ...transactionParams,
      )
    const transactionSignedHash = await this.transactionLib.sign(
      transactionObjectDraft,
      privateKey,
      nonce,
      gas,
      gasPrice,
    )

    const transactionHash = await this.transactionLib.execute(transactionSignedHash)
    return transactionHash
  }
}

module.exports = BaseTransactionService
