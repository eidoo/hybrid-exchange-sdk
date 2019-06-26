const { exchange } = require('../config')
const { ExchangeApiLib } = require('../lib/ExchangeApiLib')
const log = require('../logger')

const ExchangeApiLibUrl = exchange.apiBaseUrl
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

/**
 * Class representing a service that manage orders.
 */
class TradeService {
  constructor(exchangeApiClient = exchangeApiLib, logger = log) {
    if (!exchangeApiClient) {
      throw new TypeError(`Invalid "exchangeApiClient" value: ${exchangeApiClient}`)
    }
    this.exchangeApiClient = exchangeApiClient

    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })
  }

  /** It gets the list of the all trades on the DEX.
   *
   * @param {String} from          The from date.
   * @param {String} to            The to date.
   * @throws {ExchangeApiLibError} If there was an error during read model api call.
   */
  async listAllTradesAsync(from, to) {
    const trades = await this.exchangeApiClient.listAllTradesAsync(from, to)
    return trades
  }

  /** It gets the list of the all trades per pair on the DEX.
   *
   * @param {String} baseSymbol    The base symbol.
   * @param {String} quoteSymbol   The quote symbol.
   * @param {String} from          The from date.
   * @param {String} to            The to date.
   * @throws {ExchangeApiLibError} If there was an error during read model api call.
   */
  async listTradesPerPairAsync(baseSymbol, quoteSymbol, from, to) {
    const trades = await this.exchangeApiClient.listTradesPerPairAsync(baseSymbol, quoteSymbol, from, to)
    return trades
  }
}

module.exports = TradeService
