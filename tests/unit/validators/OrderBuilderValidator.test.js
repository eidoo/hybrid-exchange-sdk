const log = require('../../../src/logger')

const MockCreateOrderDataToSign = require('../../factories/MockCreateOrderDataToSign')
const OrderPayloadBuilderValidator = require('../../../src/validators/OrderPayloadBuilderValidator')

const orderPayloadBuilderValidator = new OrderPayloadBuilderValidator(log)

describe('validatePair', () => {
  const invalidPairs = [
    { offerTokenAddress: 'invalid', wantTokenAddress: '0x300be6824289b48cb6726f99c16e51fb41d480da' },
    { offerTokenAddress: '0x300be6824289b48cb6726f99c16e51fb41d480da', wantTokenAddress: 'invalid' },
    undefined,
    [],
    {},
  ]
  test.each(invalidPairs)('should return error since the pair is: %o', (pair) => {
    expect(() => orderPayloadBuilderValidator.validatePair(pair)).toThrowError(Error)
  })
  test('should pass the validation', () => {
    const pair = {
      offerTokenAddress: '0x300be6824289b48cb6726f99c16e51fb41d480da',
      wantTokenAddress: '0x300be6824289b48cb6726f99c16e51fb41d480da',
    }
    expect(orderPayloadBuilderValidator.validatePair(pair)).toMatchObject(pair)
  })
})

describe('validatePairAmount', () => {
  const invalidAmounts = [
    { offerTokenAmount: 'invalid', wantTokenAmount: '1' },
    { offerTokenAmount: '1', wantTokenAmount: 'invalid' },
    undefined,
    [],
    {},
  ]
  test.each(invalidAmounts)('should return error since the amount is: %o', (amount) => {
    expect(() => orderPayloadBuilderValidator.validatePairAmount(amount)).toThrowError(Error)
  })
  test('should pass the validation', () => {
    const amount = {
      offerTokenAmount: '1',
      wantTokenAmount: '2',
    }
    expect(orderPayloadBuilderValidator.validatePairAmount(amount)).toMatchObject(amount)
  })
})

describe('validateAddress', () => {
  const invalidMakers = [
    'invalid',
    undefined,
    [],
    {},
    null,
  ]
  test.each(invalidMakers)('should return error since the maker is: %o', (maker) => {
    expect(() => orderPayloadBuilderValidator.validateAddress(maker)).toThrowError(Error)
  })
  test('should pass the validation', () => {
    const maker = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    expect(orderPayloadBuilderValidator.validateAddress(maker)).toEqual(maker)
  })
})

describe('validateExpirationBlock', () => {
  const invalidExpirations = [
    undefined,
    [],
    {},
    null,
  ]
  test.each(invalidExpirations)('should return error since the expirationBlock is: %o', (expirationBlock) => {
    expect(() => orderPayloadBuilderValidator.validateExpirationBlock(expirationBlock)).toThrowError(Error)
  })
  test('should pass the validation', () => {
    const expirationBlock = '1000000'
    expect(orderPayloadBuilderValidator.validateExpirationBlock(expirationBlock)).toEqual(expirationBlock)
  })
})

describe('validateSalt', () => {
  const invalidSalts = [
    undefined,
    [],
    {},
    null,
  ]
  test.each(invalidSalts)('should return error since the salt is: %o', (salt) => {
    expect(() => orderPayloadBuilderValidator.validateSalt(salt)).toThrowError(Error)
  })
  test('should pass the validation', () => {
    const salt = 'jjkas8d897as897dhjkasdhjksahdj897'
    expect(orderPayloadBuilderValidator.validateSalt(salt)).toEqual(salt)
  })
})

describe('validateBuildOrder', () => {
  const invalidOrderProperties = [
    'maker',
    'exchangeAddress',
    'offerTokenAddress',
    'wantTokenAddress',
    'offerTokenAmount',
    'wantTokenAmount',
    'salt',
    'expirationBlock',
  ]

  test.each(invalidOrderProperties)('should return error since the order is: %o', (invalidOrderProp) => {
    const order = MockCreateOrderDataToSign.build()
    order[invalidOrderProp] = undefined
    expect(() => orderPayloadBuilderValidator.validateBuildOrder(order)).toThrowError(Error)
  })
  test('should pass the validation', () => {
    const { order } = MockCreateOrderDataToSign.build()
    expect(orderPayloadBuilderValidator.validateBuildOrder(order)).toMatchObject(order)
  })
})
