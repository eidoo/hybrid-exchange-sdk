const { exchange } = require('../config')
const { ExchangeApiLib } = require('../lib/ExchangeApiLib')
const log = require('../logger')

const ExchangeApiLibUrl = exchange.apiBaseUrl
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

/**
 * Class representing a service that manage orders.
 */
class PairService {
  constructor(logger = log, exchangeApiClient = exchangeApiLib) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!exchangeApiClient) {
      throw new TypeError(`Invalid "exchangeApiClient" value: ${exchangeApiClient}`)
    }
    this.exchangeApiClient = exchangeApiClient
  }

  /** It gets the list of the available exchange pairs.
   *
   * @throws {ExchangeApiLibError} If there was an error during read model api call.
   */
  async listPairAsync() {
    const pairs = await this.exchangeApiClient.listPairAsync()
    return pairs
  }

  /** It gets the order book of the specified pair.
   *
   * @param {String} baseSymbol  The base symbol of the pair.
   * @param {String} quoteSymbol The quote symbol of the pair.
   * @param {String} [orderType] The order type. It can be 'buy' or 'sell'.
   *
   * @throws {ExchangeApiLibError}  If there was an error during read model api call.
   */
  async getOrderBookAsync(baseSymbol, quoteSymbol, orderType) {
    const orderBook = await this.exchangeApiClient.getOrderBookAsync(baseSymbol, quoteSymbol, orderType)
    return orderBook
  }

  /**
   * It gets the fee of the specified pair.
   *
   * @param {String} baseSymbol  The base symbol of the pair.
   * @param {String} quoteSymbol The quote symbol of the pair.
   *
   * @throws {ExchangeApiLibError}  If there was an error during read model api call.
   */
  async getFeeAsync(baseSymbol, quoteSymbol) {
    const fee = await this.exchangeApiClient.getFeeAsync(baseSymbol, quoteSymbol)
    return fee
  }

  /**
   * It gets the last price of the specified pair.
   *
   * @param {String} baseSymbol  The base symbol of the pair.
   * @param {String} quoteSymbol The quote symbol of the pair.
   *
   * @throws {ExchangeApiLibError}  If there was an error during read model api call.
   */
  async getLastPriceAsync(baseSymbol, quoteSymbol) {
    const price = await this.exchangeApiClient.getLastPriceAsync(baseSymbol, quoteSymbol)
    return price
  }
}

module.exports = PairService
