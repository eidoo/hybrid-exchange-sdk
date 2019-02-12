const { exchange } = require('../config')
const { ExchangeApiLib } = require('../lib/ExchangeApiLib')
const log = require('../logger')
const OrderPayloadBuilder = require('../factories/OrderPayloadBuilder')
const OrderPayloadBuilderValidator = require('../validators/OrderPayloadBuilderValidator')
const OrderSignerHelper = require('../helpers/OrderSignerHelper')

const ExchangeApiLibUrl = exchange.apiBaseUrl
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

const orderPayloadBuilderValidator = new OrderPayloadBuilderValidator(log)
const orderBuilderInstance = new OrderPayloadBuilder(orderPayloadBuilderValidator)
const orderSignerHelperInstance = new OrderSignerHelper(log)

/**
 * Class representing a service that manage orders.
 */
class OrderService {
  constructor(logger = log, exchangeApiClient = exchangeApiLib,
    orderSignerHelper = orderSignerHelperInstance, orderBuilder = orderBuilderInstance) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!exchangeApiClient) {
      throw new TypeError(`Invalid "exchangeApiClient" value: ${exchangeApiClient}`)
    }
    this.exchangeApiClient = exchangeApiClient

    if (!orderSignerHelper) {
      throw new TypeError(`Invalid "orderSignerHelper" value: ${orderSignerHelper}`)
    }
    this.orderSignerHelper = orderSignerHelper

    if (!orderBuilder) {
      throw new TypeError(`Invalid "orderBuilder" value: ${orderBuilder}`)
    }
    this.orderBuilder = orderBuilder
  }

  /** It gets the list of the orders of the tranding wallet.
   *
   * @param {String} trandingWalletAddress The tranding wallet address.
   * @param {String} orderId               The order id.
   * @throws {ExchangeApiLibError}         If there was an error during read model api call.

   */
  async getOrderAsync(tradingWalletAddress, orderId) {
    try {
      const orderDetails = await this.exchangeApiClient.getOrderAsync(tradingWalletAddress, orderId)
      return orderDetails
    } catch (err) {
      this.log.error({ err, fn: 'getOrderAsync', orderId, tradingWalletAddress }, 'There was an error getting order')
      throw err
    }
  }

  /** It gets the list of the orders of the tranding wallet.
   *
   * @param {String} trandingWalletAddress The tranding wallet address.
   * @throws {ExchangeApiLibError}         If there was an error during read model api call.
   */
  async listOrderAsync(trandingWalletAddress) {
    try {
      const orderDetails = await this.exchangeApiClient.listOrderAsync(trandingWalletAddress)
      return orderDetails
    } catch (err) {
      this.log.error({ err, fn: 'listOrderAsync', trandingWalletAddress }, 'There was an error getting orders')
      throw err
    }
  }

  /**
   * It creates order on Eidoo hybrid exchange.
   *
  * @param {Object} orderParams                  The order to sign.
  * @param {String} orderParams.exchangeAddress  The exchange smart contract address.
  * @param {String} orderParams.maker            The maker address.
  * @param {String} orderParams.offerTokenAddres The offer token address.
  * @param {String} orderParams.offerTokenAmount The offer token amount.
  * @param {String} orderParams.wantTokenAddress The offer token amount.
  * @param {String} orderParams.wantTokenAmount  The want token amount.
  * @param {String} orderParams.expirationBlock  The expiration block.
  * @param {String} orderParams.salt             The salt used to sign.
  * @param {String} privateKey                   The private key.
  *
  */
  async createOrderAsync(orderParams, privateKey) {
    const {
      exchangeAddress,
      maker,
      offerTokenAddress,
      offerTokenAmount,
      wantTokenAddress,
      wantTokenAmount,
      expirationBlock,
      salt,
    } = orderParams

    const orderPayloadWithoutSig = this.orderBuilder
      .setPair({ wantTokenAddress, offerTokenAddress })
      .setPairAmount({ wantTokenAmount, offerTokenAmount })
      .setMaker(maker)
      .setExchangeAddress(exchangeAddress)
      .setExpirationBlock(expirationBlock)
      .setSalt(salt)
      .build()
    this.log.info({ orderPayloadWithoutSig, fn: 'createOrderAsync' }, 'Creating order.')
    const orderEcSignature = this.orderSignerHelper.signOrderCreate(orderPayloadWithoutSig, privateKey)
    const createOrderResponse = await this.exchangeApiClient.createOrderAsync(orderPayloadWithoutSig, orderEcSignature)
    const createdOrderId = createOrderResponse.id
    this.log.info({ createdOrderId, fn: 'createOrderAsync' }, 'Order created.')
    return createdOrderId
  }

  /**
   * It deletes the order from Eidoo hybrid exchange.
   *
   * @param {String} orderId    The order id.
   * @param {String} privateKey The private key.
   */
  async cancelOrderAsync(orderId, privateKey) {
    const orderEcSignature = this.orderSignerHelper.signOrderCancel(orderId, privateKey)
    const deletedOrderResponse = await this.exchangeApiClient.cancelOrderAsync(orderId, orderEcSignature)
    const deletedOrderId = deletedOrderResponse.id
    this.log.info({ deletedOrderId, fn: 'cancelOrderAsync' }, 'Order deleted.')
    return deletedOrderId
  }
}

module.exports = OrderService
