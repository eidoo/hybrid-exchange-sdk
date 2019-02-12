/* global describe, expect, test */
const sandbox = require('sinon').createSandbox()

const { InvalidPrivateKeyError } = require('../../../src/services/PrivateKeyService')
const OrderSignerHelper = require('../../../src/helpers/OrderSignerHelper')

afterEach(() => {
  sandbox.restore()
})

afterEach(() => {
  sandbox.restore()
})

const privateKey = '406718da1be75ed9a87d51a9dfe0a4b87f420e5126c765ea3fdab25297dfcb34'
const orderSignerHelper = new OrderSignerHelper()

describe('signOrderCreate', () => {
  const order = {
    exchangeAddress: '0x1212121212121212121212121212121212121212121212121212121212121212',
    maker: '0x3434343434343434343434343434343434343434343434343434343434343434',
    offerTokenAddress: '0x0123456789',
    offerTokenAmount: '1.23456789',
    wantTokenAddress: '0x7878787878787878787878787878787878787878787878787878787878787878',
    wantTokenAmount: '9.87654321',
    expirationBlock: '1000',
    salt: '123456789123456789123456789',
  }

  test('should return the correct ecSignature for the given create order', async () => {
    const expectedEcSignature = {
      r: '0xb914724648c74eff5aaafbd09062d5ee6da4e1461b0882004adbf35299208c9e',
      s: '0x15fa882bcf18c7f1f300f2237b700d81a6a66e2ebe8fd2d2aac9c18b4fbedd67',
      v: 27,
    }

    const result = await orderSignerHelper.signOrderCreate(order, privateKey)

    expect(result).toMatchObject(expectedEcSignature)
  })

  const invalidPrivateKeys = [1, {}, [], '0xinvalid']
  test.each(invalidPrivateKeys)('should raise invalidPrivateKey error since privateKey = %o',
    async invalidPrivateKey => expect(
      () => orderSignerHelper.signOrderCreate(order, invalidPrivateKey),
    ).toThrow(InvalidPrivateKeyError))
})

describe('signOrderCancel', () => {
  const orderId = '0x9090909090909090909090909090909090909090909090909090909090909090'

  test('should return the correct ecSignature for the given cancel order id', async () => {
    const privateKey = '406718da1be75ed9a87d51a9dfe0a4b87f420e5126c765ea3fdab25297dfcb34'
    const expectedEcSignature = {
      r: '0x8cef620bd3f0ebea742fc2f00146db9826f1ef707063b9d4d59952ded79fd1c0',
      s: '0x2ec9d31594945485daa8a9b1cdb8e2f4caf1fb4cbbd62cbc7ff724bda7620651',
      v: 28,
    }

    const result = await orderSignerHelper.signOrderCancel(orderId, privateKey)

    expect(result).toMatchObject(expectedEcSignature)
  })

  const invalidPrivateKeys = [1, {}, [], '0xinvalid']
  test.each(invalidPrivateKeys)('should raise invalidPrivateKey error since privateKey = %o',
    async invalidPrivateKey => expect(
      () => orderSignerHelper.signOrderCancel(orderId, invalidPrivateKey),
    ).toThrow(InvalidPrivateKeyError))
})
