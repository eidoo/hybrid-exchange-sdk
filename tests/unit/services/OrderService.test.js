/* global describe, expect, test */
const sandbox = require('sinon').createSandbox()

const { ExchangeApiLib, ExchangeApiLibError } = require('../../../src/lib/ExchangeApiLib')
const { InvalidPrivateKeyError } = require('../../../src/services/PrivateKeyService')
const OrderService = require('../../../src/services/OrderService')
const logger = require('../../../src/logger')
const MockOrderFactory = require('../../factories/MockOrderFactory')

const ExchangeApiLibUrl = 'fakeurl'
const exchangeApiLib = new ExchangeApiLib(ExchangeApiLibUrl)

let orderService

beforeEach(() => {
  orderService = new OrderService(logger, exchangeApiLib)
})

afterEach(() => {
  sandbox.restore()
})

const orderId = '0x7cbfd8954a9078a536407d632bd0a9302f4e79153fb21f3810fcc2783b1fdeae'
const tradingWalletAddress = '0xAaD5329c065B61f8d44d3d0417068eA74021Fb79'

describe('getOrderAsync', () => {
  const errors = [new TypeError(), new Error()]
  test.each(errors)('returns ExchangeApiLibError if getOrderAsync raise %s ', async (error) => {
    sandbox.stub(exchangeApiLib, 'callAsync').throws(error)
    return expect(orderService.getOrderAsync(tradingWalletAddress, orderId)).rejects
      .toBeInstanceOf(ExchangeApiLibError)
  })

  test('returns correct order data', async () => {
    const orderResponse = {
      status: 'success',
      data: MockOrderFactory.build(),
    }
    sandbox.stub(exchangeApiLib, 'callAsync').returns(orderResponse)
    const order = await orderService.getOrderAsync(tradingWalletAddress, orderId)
    expect(order).toMatchObject(orderResponse.data)
  })
})

describe('listOrderAsync', () => {
  const errors = [new TypeError(), new Error()]
  test.each(errors)('returns ExchangeApiLibError if listOrderAsync raise %s ', async (error) => {
    sandbox.stub(exchangeApiLib, 'callAsync').throws(error)
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

describe('cancelOrderAsync', () => {
  const orderIdToDelete = '0xOrderId'
  const mockedOrderCancelApiResponse = { result: { id: orderIdToDelete, db: MockOrderFactory.build() } }
  test('should return the order id deleted', async () => {
    const privateKey = '5ca4748dda543c064238a3f2b28ea3f6ec42c8eba5fa169d8c45fc7f421660a8'
    sandbox.stub(exchangeApiLib, 'callAsync').returns(mockedOrderCancelApiResponse)

    const result = await orderService.cancelOrderAsync(orderIdToDelete, privateKey)

    expect(result).toEqual(orderIdToDelete)
  })

  test('should raise InvalidPrivateKeyException', async () => {
    const privateKey = 'InvalidPkey'
    sandbox.stub(exchangeApiLib, 'callAsync').returns(mockedOrderCancelApiResponse)
    return expect(orderService.cancelOrderAsync(orderIdToDelete, privateKey))
      .rejects.toBeInstanceOf(InvalidPrivateKeyError)
  })
})

describe('createOrderAsync', () => {
  const orderId = '0xOrderId'
  const mockedOrderCreateApiResponse = { result: { id: orderId } }
  const order = MockOrderFactory.build()
  const {
    exchangeAddress,
    maker,
    offerTokenAddress,
    offerTokenAmount,
    wantTokenAddress,
    wantTokenAmount,
    expirationBlock,
    salt,
  } = order

  test('should return the created order id', async () => {
    const privateKey = '5ca4748dda543c064238a3f2b28ea3f6ec42c8eba5fa169d8c45fc7f421660a8'
    sandbox.stub(exchangeApiLib, 'callAsync').returns(mockedOrderCreateApiResponse)
    const orderPayload = {
      exchangeAddress,
      maker,
      offerTokenAddress,
      offerTokenAmount,
      wantTokenAddress,
      wantTokenAmount,
      expirationBlock,
      salt,
    }
    const result = await orderService.createOrderAsync(orderPayload, privateKey)

    expect(result).toEqual(orderId)
  })

  test('should raise InvalidPrivateKeyException', async () => {
    const orderId = '0xOrderId'
    const privateKey = 'InvalidPkey'
    const mockedOrderCreateApiResponse = { result: { id: orderId } }
    sandbox.stub(exchangeApiLib, 'callAsync').returns(mockedOrderCreateApiResponse)
    return expect(orderService.createOrderAsync(order, privateKey))
      .rejects.toBeInstanceOf(InvalidPrivateKeyError)
  })
})
