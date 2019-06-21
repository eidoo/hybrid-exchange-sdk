/* global describe, expect, test */
const sandbox = require('sinon').createSandbox()

const { ExchangeApiLib, ExchangeApiLibError } = require('../../../src/lib/ExchangeApiLib')
const TradeService = require('../../../src/services/TradeService')
const logger = require('../../../src/logger')
const MockTradeFactory = require('../../factories/MockTradeFactory')

const ExchangeApiLibUrl = 'fakeurl'
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

let tradeService

beforeEach(() => {
  tradeService = new TradeService(exchangeApiLib, logger)
})

afterEach(() => {
  sandbox.restore()
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
        items: MockTradeFactory.buildList(4),
        paging: {
          total: 4,
        },
      },
    }
    sandbox.stub(exchangeApiLib, 'callAsync').returns(tradeListResponse)
    const trades = await tradeService.listAllTradesAsync()
    expect(trades).toMatchObject(tradeListResponse.data)
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
        items: MockTradeFactory.buildList(4),
        paging: {
          total: 4,
        },
      },
    }
    sandbox.stub(exchangeApiLib, 'callAsync').returns(tradeListResponse)
    const trades = await tradeService.listTradesPerPairAsync(baseSymbol, quoteSymbol)
    expect(trades).toMatchObject(tradeListResponse.data)
  })
})
