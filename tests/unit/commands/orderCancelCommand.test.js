/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { orderCancelCommand } = require('../../../src/commands/commandList')
const ExchangeApiLibError = require('../../../src/lib/ExchangeApiLib/ExchangeApiLibError')

afterEach(() => {
  sandbox.restore()
})

describe('os cancel', () => {
  const validPrivateKeyFilePath = 'tests/fixtures/privateKeys/privateKey.key'
  const orderId = '0xOrderId'
  test('should return the expected order id deleted', async () => {
    sandbox.stub(orderCancelCommand.orderService, 'cancelOrderAsync').returns(orderId)

    const result = await orderCancelCommand
      .executeAsync({ orderId, privateKeyFilePath: validPrivateKeyFilePath })

    expect(result).toBe(orderId)
  })
  test('', async() => {
    const expetedResult = [{
      code: 'ExchangeApiLibError',
      message: 'Error during exchangeApi http request',
      field: null,
    }]
    sandbox.stub(orderCancelCommand.orderService, 'cancelOrderAsync').throws(new ExchangeApiLibError())

    const result = await orderCancelCommand
      .executeAsync({ orderId, privateKeyFilePath: validPrivateKeyFilePath })

    expect(result).toEqual(expetedResult)
  })
})
