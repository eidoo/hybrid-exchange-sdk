/* global describe, expect, test */
const sandbox = require('sinon').createSandbox()

const { ExchangeApiLib, ExchangeApiLibError } = require('../../../src/lib/ExchangeApiLib')
const { InvalidPrivateKeyError } = require('../../../src/services/PrivateKeyService')
const OrderService = require('../../../src/services/OrderService')
const TradeService = require('../../../src/services/TradeService')
const logger = require('../../../src/logger')
const MockOrderFactory = require('../../factories/MockOrderFactory')

const ExchangeApiLibUrl = 'fakeurl'
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

let orderService
let tradeService

beforeEach(() => {
  orderService = new OrderService(exchangeApiLib, logger)
  tradeService = new TradeService(exchangeApiLib, logger)
})

afterEach(() => {
  sandbox.restore()
})

const orderId = '0x7cbfd8954a9078a536407d632bd0a9302f4e79153fb21f3810fcc2783b1fdeae'
const tradingWalletAddress = '0xAaD5329c065B61f8d44d3d0417068eA74021Fb79'

describe('listOrderAsync', () => {
  test('returns ExchangeApiLibError if listOrderAsync raise ExchangeApiLibError ', async () => {
    sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
    return expect(orderService.listOrderAsync(tradingWalletAddress, orderId)).rejects
      .toBeInstanceOf(ExchangeApiLibError)
  })

  test('returns correct order data', async () => {
    const orderListResponse = {
      status: 'success',
      data: {
        results: MockOrderFactory.buildList(1),
        length: 1,
      },
    }
    sandbox.stub(exchangeApiLib, 'callAsync').returns(orderListResponse)
    const orders = await orderService.listOrderAsync(tradingWalletAddress, orderId)
    expect(orders).toMatchObject(orderListResponse.data.results)
  })
})

describe('listAllTradesAsync', () => {
  test('returns ExchangeApiLibError if listOrderAsync raise ExchangeApiLibError ', async () => {
    sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
    return expect(tradeService.listAllTradesAsync()).rejects
      .toBeInstanceOf(ExchangeApiLibError)
  })

  test('returns correct trade data', async () => {
    const tradeListResponse = {
      status: 'success',
      data: {
        results: MockOrderFactory.buildList(1),
        length: 1,
      },
    }
    sandbox.stub(exchangeApiLib, 'callAsync').returns(tradeListResponse)
    const trades = await tradeService.listAllTradesAsync()
    expect(trades).toMatchObject(tradeListResponse.data.results)
  })
})

const baseSymbol = 'EDO'
const quoteSymbol = 'ETH'
describe('listTradesPerPairAsync', () => {
  test('returns ExchangeApiLibError if listOrderAsync raise ExchangeApiLibError ', async () => {
    sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
    return expect(tradeService.listTradesPerPairAsync(baseSymbol, quoteSymbol)).rejects
      .toBeInstanceOf(ExchangeApiLibError)
  })

  test('returns correct trade data per pair', async () => {
    const tradeListResponse = {
      status: 'success',
      data: {
        results: MockOrderFactory.buildList(1),
        length: 1,
      },
    }
    sandbox.stub(exchangeApiLib, 'callAsync').returns(tradeListResponse)
    const trades = await tradeService.listTradesPerPairAsync(baseSymbol, quoteSymbol)
    expect(trades).toMatchObject(tradeListResponse.data.results)
  })
})
