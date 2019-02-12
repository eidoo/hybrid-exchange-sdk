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
      (error) => { throw new ExchangeApiLibError(error, JSON.stringify(error.response.data)) },
    )
    return httpClient
  }

  async listOrderAsync(tradingWalletAddress) {
    const method = 'get'
    const endpoint = `/trading-wallet/v1/trading-wallets/${tradingWalletAddress}/orders`
    try {
      const response = await this.callAsync({ method, endpoint })
      return response.data.results
    } catch (err) {
      throw new ExchangeApiLibError(err)
    }
  }

  async listPairAsync() {
    const method = 'get'
    const endpoint = '/trading-wallet/v1/pairs'
    const response = await this.callAsync({ method, endpoint })
    return response.data.results
  }

  async getOrderAsync(walletAddress, orderId) {
    const method = 'get'
    const endpoint = `/trading-wallet/v1/trading-wallets/${walletAddress}/orders/${orderId}`
    try {
      const response = await this.callAsync({ method, endpoint })
      return response.data
    } catch (err) {
      throw new ExchangeApiLibError(err)
    }
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

  async cancelOrderAsync(orderId, ecSignature) {
    const method = 'patch'
    const endpoint = '/exchange-core/v1/order'
    const body = {
      id: orderId,
      confirmation: 'cancel_request',
      ecSignature,
    }
    try {
      const response = await this.callAsync({ method, endpoint, body })
      return response.result
    } catch (err) {
      throw new ExchangeApiLibError(err)
    }
  }

  async createOrderAsync(orderPayload, ecSignature) {
    const method = 'post'
    const endpoint = '/exchange-core/v1/order'
    const body = {
      ...orderPayload,
      ecSignature,
    }
    try {
      const response = await this.callAsync({ method, endpoint, body })
      return response.result
    } catch (err) {
      throw new ExchangeApiLibError(err)
    }
  }
}

module.exports = ExchangeApiLib
