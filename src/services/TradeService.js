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
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!exchangeApiClient) {
      throw new TypeError(`Invalid "exchangeApiClient" value: ${exchangeApiClient}`)
    }
    this.exchangeApiClient = exchangeApiClient
  }

  /** It gets the list of the all trades on the DEX.
   *
   * @throws {ExchangeApiLibError}         If there was an error during read model api call.
   */
  async listAllTradesAsync(from, to) {
    try {
      const trades = await this.exchangeApiClient.listAllTradesAsync(from, to)
      return trades
    } catch (err) {
      this.log.error({ err, fn: 'listAllTradesAsync' }, 'There was an error getting all trades')
      throw err
    }
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
    try {
      const trades = await this.exchangeApiClient.listTradesPerPairAsync(baseSymbol, quoteSymbol, from, to)
      return trades
    } catch (err) {
      this.log.error({ err, fn: 'listTradesPerPairAsync', baseSymbol, quoteSymbol, from, to },
        `There was an error getting trades for pair ${baseSymbol}/${quoteSymbol}`)
      throw err
    }
  }
}

module.exports = TradeService
