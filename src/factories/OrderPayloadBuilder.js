const log = require('../logger')
const OrderPayloadBuilderValidator = require('../validators/OrderPayloadBuilderValidator')

const orderPayloadBuilderValidatorInstance = new OrderPayloadBuilderValidator(log)

/**
   * Class representing a factory to build orders object.
   * @param  {Object}    orderPayloadBuilderValidator  The order builder validator instance.
   * @param  {Object}    [logger]               The logger instance.
   *
   * @throws {TypeError}                        If exchangeSmart contract objecs is not initialized as expected.
   */

class OrderPayloadBuilder {
  constructor(orderPayloadBuilderValidator = orderPayloadBuilderValidatorInstance, logger = log) {
    if (!orderPayloadBuilderValidator) {
      throw new TypeError(`Invalid "orderPayloadBuilderValidator" value: ${orderPayloadBuilderValidator}`)
    }
    this.orderPayloadBuilderValidator = orderPayloadBuilderValidator

    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    this.orderPayloadWithoutSig = {}
  }

  /**
   * It sets the offerTokenAddress and the wantTokenAddress.
   * @param  {Object} pair                      The pair object.
   * @param  {String} pair.offerTokenAddress    The order offered token address.
   * @param  {String} pair.wantTokenAddress     The order wanted token address.
   */
  setPair(pair) {
    this.orderPayloadBuilderValidator.validatePair(pair)
    this.orderPayloadWithoutSig.offerTokenAddress = pair.offerTokenAddress
    this.orderPayloadWithoutSig.wantTokenAddress = pair.wantTokenAddress
    return this
  }

  /**
   * It sets the offerTokenAmount and the wantTokenAmount of the pair.
   * @param  {Object} amount                    The amount object.
   * @param  {String} amount.offerTokenAmount   The order offered token amount.
   * @param  {String} amount.wantTokenAmount    The order wanted token amount.
   */
  setPairAmount(amount) {
    this.orderPayloadBuilderValidator.validatePairAmount(amount)
    this.orderPayloadWithoutSig.offerTokenAmount = amount.offerTokenAmount
    this.orderPayloadWithoutSig.wantTokenAmount = amount.wantTokenAmount
    return this
  }

  /**
   * It sets the order maker address (EOA).
   * @param  {String} makerAddress   The order maker address (EOA).
   */
  setMaker(makerAddress) {
    this.orderPayloadBuilderValidator.validateAddress(makerAddress)
    this.orderPayloadWithoutSig.maker = makerAddress
    return this
  }

  /**
   * It sets the exchange order address (smart contract).
   * @param  {String} exchangeAddress   The exchange smart contract address.
   */
  setExchangeAddress(exchangeAddress) {
    this.orderPayloadBuilderValidator.validateAddress(exchangeAddress)
    this.orderPayloadWithoutSig.exchangeAddress = exchangeAddress
    return this
  }

  /**
   * It sets the order expiration block since which that order will not be valid.
   * @param  {String} expirationBlock   The order expiration block.
   */
  setExpirationBlock(expirationBlock) {
    this.orderPayloadBuilderValidator.validateExpirationBlock(expirationBlock)
    this.orderPayloadWithoutSig.expirationBlock = expirationBlock
    return this
  }

  /**
   * It sets the salt of the order.
   * @param  {String} salt   The order salt.
   */
  setSalt(salt) {
    this.orderPayloadBuilderValidator.validateSalt(salt)
    this.orderPayloadWithoutSig.salt = salt
    return this
  }

  build() {
    this.orderPayloadBuilderValidator.validateBuildOrder(this.orderPayloadWithoutSig)
    return this.orderPayloadWithoutSig
  }
}

module.exports = OrderPayloadBuilder
