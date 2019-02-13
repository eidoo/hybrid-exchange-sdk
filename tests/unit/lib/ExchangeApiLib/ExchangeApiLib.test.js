const _ = require('lodash')
const sandbox = require('sinon').createSandbox()

const { ExchangeApiLib } = require('../../../../src/lib/ExchangeApiLib')
const ExchangeApiLibError = require('../../../../src/lib/ExchangeApiLib/ExchangeApiLibError')
const MockOrderFactory = require('../../../factories/MockOrderFactory')

const ExchangeApiLibUrl = 'fakeurl'
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

afterEach(() => {
  sandbox.restore()
})

describe('listOrderAsync', () => {
  test('returns expected response', async () => {
    const tradingWalletAddress = '0xAaD5329c065B61f8d44d3d0417068eA74021Fb79'
    const expectedMethod = 'get'
    const expectedEndpoint = `/trading-wallet/v1/trading-wallets/${tradingWalletAddress}/orders`
    const orderListResponse = {
      status: 'success',
      data: {
        results: MockOrderFactory.buildList(1),
        length: 1,
      },
    }
    const callAsyncMock = sandbox.stub(exchangeApiLib, 'callAsync').returns(orderListResponse)

    const orders = await exchangeApiLib.listOrderAsync(tradingWalletAddress)

    expect(callAsyncMock.calledOnceWith({ method: expectedMethod, endpoint: expectedEndpoint })).toBe(true)
    expect(orders).toMatchObject(orderListResponse.data.results)
  })
})

describe('getOrderAsync', () => {
  test('returns expected response', async () => {
    const tradingWalletAddress = '0xAaD5329c065B61f8d44d3d0417068eA74021Fb79'
    const orderId = '0x7cbfd8954a9078a536407d632bd0a9302f4e79153fb21f3810fcc2783b1fdeae'
    const expectedMethod = 'get'
    const expectedEndpoint = `/trading-wallet/v1/trading-wallets/${tradingWalletAddress}/orders/${orderId}`
    const orderResponse = {
      status: 'success',
      data: MockOrderFactory.build(),
    }
    const callAsyncMock = sandbox.stub(exchangeApiLib, 'callAsync').returns(orderResponse)

    const order = await exchangeApiLib.getOrderAsync(tradingWalletAddress, orderId)

    expect(callAsyncMock.calledOnceWith({ method: expectedMethod, endpoint: expectedEndpoint })).toBe(true)
    expect(order).toMatchObject(orderResponse.data)
  })
  test('returns the expected error', async () => {
    const tradingWalletAddress = '0xAaD5329c065B61f8d44d3d0417068eA74021Fb79'
    const orderId = '0x7cbfd8954a9078a536407d632bd0a9302f4e79153fb21f3810fcc2783b1fdeae'
    sandbox.stub(exchangeApiLib, 'callAsync').throws(new ExchangeApiLibError())
    return expect(exchangeApiLib.getOrderAsync(tradingWalletAddress, orderId))
      .rejects.toBeInstanceOf(ExchangeApiLibError)
  })
})

describe('getOrderBookAsync', () => {
  test('returns expected response', async () => {
    const expectedMethod = 'get'
    const baseSymbol = 'EDO'
    const quoteSymbol = 'ETH'
    const expectedEndpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/book/`
    const getOrderBookAsyncResponse = {
      status: 'success',
      data: {
        buy: {
          meta: {
            pageNumber: 0,
            pageSize: 50,
            precision: 5,
            resultsLength: 1,
          },
          results: [{
            price: '0.0020000',
            volume: '10000000000000000000',
            total: '10000000000000000000',
          }],
        },
      },
    }

    const callAsyncMock = sandbox.stub(exchangeApiLib, 'callAsync').returns(getOrderBookAsyncResponse)
    const result = await exchangeApiLib.getOrderBookAsync(baseSymbol, quoteSymbol)

    expect(callAsyncMock.calledOnceWith({ method: expectedMethod, endpoint: expectedEndpoint })).toBe(true)
    expect(result).toMatchObject(getOrderBookAsyncResponse.data)
  })
})

describe('cancelOrderAsync', () => {
  test('returns expected response', async () => {
    const order = MockOrderFactory.build()
    const body = {
      id: order.id,
      confirmation: 'cancel_request',
      ecSignature: order.ecSignature,
    }
    const expectedMethod = 'patch'
    const expectedEndpoint = '/exchange-core/v1/order'
    const cancelOrderResponse = {
      code: 'Success',
      result: {
        id: order.id,
        db: {
          order,
        },
      },
    }

    const callAsyncMock = sandbox.stub(exchangeApiLib, 'callAsync').returns(cancelOrderResponse)
    const cancelOrder = await exchangeApiLib.cancelOrderAsync(order.id, order.ecSignature)

    expect(callAsyncMock.calledOnceWith({ method: expectedMethod, endpoint: expectedEndpoint, body })).toBe(true)
    expect(cancelOrder).toMatchObject(cancelOrderResponse.result)
  })
})

describe('createOrderAsync', () => {
  test('returns expected response', async () => {
    const order = MockOrderFactory.build()
    const expectedMethod = 'post'
    const expectedEndpoint = '/exchange-core/v1/order'
    const createOrderResponse = {
      code: 'Accepted',
      result: {
        id: order.id,
        db: {
          deleted: 0,
          errors: 0,
          inserted: 1,
          replaced: 0,
          skipped: 0,
          unchanged: 0,
        },
        pendingFilled: 0,
      },
    }

    const orderForApi = _.omit(order, 'ecSignature')

    const callAsyncMock = sandbox.stub(exchangeApiLib, 'callAsync').returns(createOrderResponse)

    const orderCreate = await exchangeApiLib.createOrderAsync(orderForApi, order.ecSignature)

    expect(callAsyncMock.calledOnceWith({ method: expectedMethod, endpoint: expectedEndpoint, body: order })).toBe(true)
    expect(orderCreate).toMatchObject(createOrderResponse.result)
  })
})

describe('getFeeAsync', () => {
  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'
  test('returns expected response', async () => {
    const expectedMethod = 'get'
    const expectedEndpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/fee`
    const getFeeAsyncResponse = {
      status: 'success',
      data: {
        fee: 0,
      },
    }
    const callAsyncMock = sandbox.stub(exchangeApiLib, 'callAsync').returns(getFeeAsyncResponse)

    const result = await exchangeApiLib.getFeeAsync(baseSymbol, quoteSymbol)

    expect(callAsyncMock.calledOnceWith({ method: expectedMethod, endpoint: expectedEndpoint })).toBe(true)
    expect(result).toEqual(getFeeAsyncResponse.data.fee)
  })
})

describe('getPriceAsync', () => {
  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'
  test('returns expected response', async () => {
    const expectedMethod = 'get'
    const expectedEndpoint = `/trading-wallet/v1/pairs/base/${baseSymbol}/quote/${quoteSymbol}/price`
    const getPriceAsyncResponse = {
      status: 'success',
      data: {
        change: {
          '1h': {
            perc: 0,
          },
          '1d': {
            perc: 0,
          },
          '1w': {
            perc: -3.99,
          },
        },
        last: '6097560000000000',
      },
    }
    const callAsyncMock = sandbox.stub(exchangeApiLib, 'callAsync').returns(getPriceAsyncResponse)

    const result = await exchangeApiLib.getPriceAsync(baseSymbol, quoteSymbol)

    expect(callAsyncMock.calledOnceWith({ method: expectedMethod, endpoint: expectedEndpoint })).toBe(true)
    expect(result).toEqual(getPriceAsyncResponse.data.last)
  })
})
