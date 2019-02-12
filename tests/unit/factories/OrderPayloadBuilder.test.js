const log = require('../../../src/logger')

const MockCreateOrderDataToSign = require('../../factories/MockCreateOrderDataToSign')
const OrderPayloadBuilderValidator = require('../../../src/validators/OrderPayloadBuilderValidator')

const orderPayloadBuilderValidator = new OrderPayloadBuilderValidator(log)
const OrderPayloadBuilder = require('../../../src/factories/OrderPayloadBuilder')

const orderPayloadBuilder = new OrderPayloadBuilder(orderPayloadBuilderValidator, log)

describe('orderPayloadBuilder', () => {
  test('should create OrderPayload object as expected', () => {
    const { order } = MockCreateOrderDataToSign.build()
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

    const result = orderPayloadBuilder
      .setPair({ wantTokenAddress, offerTokenAddress })
      .setPairAmount({ wantTokenAmount, offerTokenAmount })
      .setMaker(maker)
      .setExchangeAddress(exchangeAddress)
      .setExpirationBlock(expirationBlock)
      .setSalt(salt)
      .build()

    expect(result).toMatchObject(order)
  })
})
