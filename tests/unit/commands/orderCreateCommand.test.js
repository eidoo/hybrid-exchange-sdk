/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { orderCreateCommand } = require('../../../src/commands/commandList')
const ExchangeApiLibError = require('../../../src/lib/ExchangeApiLib/ExchangeApiLibError')

afterEach(() => {
  sandbox.restore()
})

describe('os create', () => {
  const validPrivateKeyFilePath = 'tests/fixtures/privateKeys/privateKey.key'
  const cliInputJson = '{"exchangeAddress":"0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e","maker":"0xdb1b9e1708aec862fee256821702fa1906ceff67","offerTokenAddress":"0x2b2c319799df9d98b0fd34c961a2e1181239de27","offerTokenAmount":"10000000000000000000","wantTokenAddress":"0x0000000000000000000000000000000000000000","wantTokenAmount":"30000000000000000000","expirationBlock":"1000","salt":"87497352680706752771859228505604318260083812617224296408163389250870428287169"}'
  const orderId = '0xOrderId'
  test('should return the expected order id created', async () => {
    sandbox.stub(orderCreateCommand.orderService, 'createOrderAsync').returns(orderId)

    const result = await orderCreateCommand
      .executeAsync({ cliInputJson, privateKeyFilePath: validPrivateKeyFilePath })

    expect(result).toBe(orderId)
  })
  test('should raise if order service raiese Exchange api error', async() => {
    const errorMessage = 'exchange error message'
    const cliInputJson = '{"exchangeAddress":"0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e","maker":"0xdb1b9e1708aec862fee256821702fa1906ceff67","offerTokenAddress":"0x2b2c319799df9d98b0fd34c961a2e1181239de27","offerTokenAmount":"10000000000000000000","wantTokenAddress":"0x0000000000000000000000000000000000000000","wantTokenAmount":"30000000000000000000","expirationBlock":"1000","salt":"87497352680706752771859228505604318260083812617224296408163389250870428287169"}'
    const expetedResult = [{
      code: 'ExchangeApiLibError',
      message: errorMessage,
      field: null,
    }]
    sandbox.stub(orderCreateCommand.orderService, 'createOrderAsync').throws(new ExchangeApiLibError(errorMessage))

    const result = await orderCreateCommand
      .executeAsync({ cliInputJson, privateKeyFilePath: validPrivateKeyFilePath })

    expect(result).toEqual(expetedResult)
  })
})
