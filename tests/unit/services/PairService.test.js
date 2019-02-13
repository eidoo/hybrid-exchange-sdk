const sandbox = require('sinon').createSandbox()

const { ExchangeApiLib, ExchangeApiLibError } = require('../../../src/lib/ExchangeApiLib')
const logger = require('../../../src/logger')
const MockFeeFactory = require('../../factories/MockFeeFactory')
const MockListPairFactory = require('../../factories/MockListPairFactory')
const MockOrderBookFactory = require('../../factories/MockOrderBookFactory')
const MockPairPriceFactory = require('../../factories/MockPairPriceFactory')
const PairService = require('../../../src/services/PairService')

const ExchangeApiLibUrl = 'FAKE_URL'
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

let pairService

beforeEach(() => {
  pairService = new PairService(logger, exchangeApiLib)
})

afterEach(() => {
  sandbox.restore()
})

describe('pairService', () => {
  describe('listPairAsync', () => {
    test('should return the expected list of pairs', async () => {
      const pairResponse = MockListPairFactory.build()
      const method = 'get'
      const endpoint = '/trading-wallet/v1/pairs'
      const callAsyncStub = sandbox.stub(exchangeApiLib, 'callAsync').returns(pairResponse)

      const pairs = await pairService.listPairAsync()

      callAsyncStub.calledOnceWith(method, endpoint)
      expect(pairs).toMatchObject(pairResponse.data.results)
    })
    test('should raise ExchangeApiLibError if Exchange api call fails',
      async() => {
        sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
        return expect(pairService.listPairAsync()).rejects.toBeInstanceOf(ExchangeApiLibError)
      })
  })

  describe('getOrderBookAsync', () => {
    const baseSymbol = 'EDO'
    const quoteSymbol = 'ETH'

    test('should return the expected order book', async () => {
      const orderBookResponse = MockOrderBookFactory.build()
      const method = 'get'
      const endpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/book/`
      const callAsyncStub = sandbox.stub(exchangeApiLib, 'callAsync').returns(orderBookResponse)

      const orderBook = await pairService.getOrderBookAsync(baseSymbol, quoteSymbol)

      callAsyncStub.calledOnceWith(method, endpoint)
      expect(orderBook).toMatchObject(orderBookResponse.data)
    })

    const orderTypes = ['buy', 'sell']
    test.each(orderTypes)('should return the expected order book for type = %o', async (orderType) => {
      const orderBookResponse = { data: { mockedResponse: `Response order book for type ${orderType}` } }
      const method = 'get'
      const endpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/book/${orderType}`
      const callAsyncStub = sandbox.stub(exchangeApiLib, 'callAsync').returns(orderBookResponse)

      const orderBook = await pairService.getOrderBookAsync(baseSymbol, quoteSymbol, orderType)

      callAsyncStub.calledOnceWith(method, endpoint)
      expect(orderBook).toMatchObject(orderBookResponse.data)
    })

    const invalidOrderTypes = [1, [], {}]
    test.each(invalidOrderTypes)('should raise ExchangeApiLibError for order type = %o', async (invalidOrderType) => {
      const orderBookResponse = MockOrderBookFactory.build()
      sandbox.stub(exchangeApiLib, 'callAsync').returns(orderBookResponse)
      return expect(pairService.getOrderBookAsync(baseSymbol, quoteSymbol, invalidOrderType))
        .rejects.toBeInstanceOf(ExchangeApiLibError)
    })
    test('should raise ExchangeApiLibError if Exchange api call fails',
      async() => {
        sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
        return expect(pairService.getOrderBookAsync('baseSymbol', 'quoteSymbol'))
          .rejects.toBeInstanceOf(ExchangeApiLibError)
      })
  })

  describe('getPriceAsync', () => {
    const baseSymbol = 'EDO'
    const quoteSymbol = 'ETH'

    test('should return the expected fee', async () => {
      const pairPriceResponse = MockPairPriceFactory.build()
      const method = 'get'
      const endpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/price`
      const callAsyncStub = sandbox.stub(exchangeApiLib, 'callAsync').returns(pairPriceResponse)

      const price = await pairService.getPriceAsync(baseSymbol, quoteSymbol)

      callAsyncStub.calledOnceWith(method, endpoint)
      expect(price).toEqual(pairPriceResponse.data.last)
    })

    test('should raise ExchangeApiLibError if Exchange api call fails',
      async() => {
        sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
        return expect(pairService.getPriceAsync(baseSymbol, quoteSymbol)).rejects.toBeInstanceOf(ExchangeApiLibError)
      })
  })
})


describe('getFeeAsync', () => {
  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'

  test('should return the expected fee', async () => {
    const feeResponse = MockFeeFactory.build()
    const method = 'get'
    const endpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/fee`
    const callAsyncStub = sandbox.stub(exchangeApiLib, 'callAsync').returns(feeResponse)

    const fee = await pairService.getFeeAsync(baseSymbol, quoteSymbol)

    callAsyncStub.calledOnceWith(method, endpoint)
    expect(fee).toEqual(feeResponse.data.fee)
  })

  test('should raise ExchangeApiLibError if Exchange api call fails',
    async() => {
      sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
      return expect(pairService.getFeeAsync(baseSymbol, quoteSymbol)).rejects.toBeInstanceOf(ExchangeApiLibError)
    })
})
