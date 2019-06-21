const axios = require('axios')
const log = require('../../logger')
const IExchangeApiLib = require('./IExchangeApiLib')
const ExchangeApiLibError = require('./ExchangeApiLibError')
const orderTypes = require('./models/Order').TYPES

const validOrderTypes = [orderTypes.sell, orderTypes.buy]
/**
 * Class representing the Eidoo Exchange API library interface.
 */
class ExchangeApiLib extends IExchangeApiLib {
  /**
   * Create an Eidoo Exchange API library instance.
   * @param  {String}  [url='http://127.0.0.1:8080'] The url.
   * @param  {Object}  [httpClientFactory=axios]     The http client factory.
   * @param  {Object}  [logger=log]                  The logger instance.
   */
  constructor(url = 'http://127.0.0.1:8080', httpClientFactory = axios, logger = log) {
    super()

    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}.`)
    }
    this.log = logger

    if (!url) {
      throw new TypeError(`Invalid "url" value: ${url}.`)
    }

    this.url = url

    if (!httpClientFactory) {
      throw new TypeError(`Invalid "httpClientFactory" value: ${httpClientFactory}.`)
    }

    this.httpClientFactory = httpClientFactory
  }

  callAsync({ method, endpoint, body }) {
    if (!this.httpClient) {
      this.httpClient = this.getHttpClient()
    }
    return this.httpClient[method](endpoint, body)
  }

  getBaseURL() {
    return `${this.url}/api`
  }

  getHttpClient() {
    const httpClient = this.httpClientFactory.create({
      baseURL: this.getBaseURL(),
      timeout: 15 * 1000,
    })

    httpClient.interceptors.response.use(
      response => response.data,
      (error) => {
        const message = error.response.data ? error.response.data.message : 'Error using exchange api lib'
        throw new ExchangeApiLibError(message)
      },
    )
    return httpClient
  }

  async listOrderAsync(tradingWalletAddress) {
    const method = 'get'
    const endpoint = `/trading-wallet/v1/trading-wallets/${tradingWalletAddress}/orders`
    const response = await this.callAsync({ method, endpoint })
    return response.data.results
  }

  async listPairAsync() {
    const method = 'get'
    const endpoint = '/trading-wallet/v1/pairs'
    const response = await this.callAsync({ method, endpoint })
    return response.data.results
  }

  async getFeeAsync(baseSymbol, quoteSymbol) {
    const method = 'get'
    const endpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/fee`
    const response = await this.callAsync({ method, endpoint })
    return response.data.fee
  }

  async getOrderAsync(walletAddress, orderId) {
    const method = 'get'
    const endpoint = `/trading-wallet/v1/trading-wallets/${walletAddress}/orders/${orderId}`
    const response = await this.callAsync({ method, endpoint })
    return response.data
  }

  async getOrderBookAsync(baseSymbol, quoteSymbol, orderType) {
    if (orderType && !validOrderTypes.includes(orderType)) {
      throw new ExchangeApiLibError(null, `${orderType} is not a valid order type`)
    }
    const method = 'get'
    const baseEndpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/book/`
    const endpoint = orderType ? `${baseEndpoint}${orderType}/` : baseEndpoint
    const response = await this.callAsync({ method, endpoint })
    return response.data
  }

  async getLastPriceAsync(baseSymbol, quoteSymbol) {
    const method = 'get'
    const endpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/price`
    const response = await this.callAsync({ method, endpoint })
    return response.data.last
  }

  async cancelOrderAsync(orderId, ecSignature) {
    const method = 'patch'
    const endpoint = '/exchange-core/v1/order'
    const body = {
      id: orderId,
      confirmation: 'cancel_request',
      ecSignature,
    }
    const response = await this.callAsync({ method, endpoint, body })
    return response.result
  }

  async createOrderAsync(orderPayload, ecSignature) {
    const method = 'post'
    const endpoint = '/exchange-core/v1/order'
    const body = {
      ...orderPayload,
      ecSignature,
    }
    const response = await this.callAsync({ method, endpoint, body })
    return response.result
  }

  async listAllTradesAsync(from, to) {
    const method = 'get'
    let endpoint = '/trading-wallet/v1/trades'

    if (from) {
      endpoint += `?from=${from}`
    }

    if (to) {
      endpoint += from ? `&to=${to}` : `?to=${to}`
    }

    const response = await this.callAsync({ method, endpoint })
    return response.data
  }

  async listTradesPerPairAsync(baseSymbol, quoteSymbol, from, to) {
    const method = 'get'
    let endpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/trades`

    if (from) {
      endpoint += `?from=${from}`
    }

    if (to) {
      endpoint += from ? `&to=${to}` : `?to=${to}`
    }

    const response = await this.callAsync({ method, endpoint })
    return response.data
  }
}

module.exports = ExchangeApiLib
