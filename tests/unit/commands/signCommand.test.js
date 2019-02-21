/* eslint-env node, jest */
const MockCancelOrderDataToSign = require('../../factories/MockCancelOrderDataToSign')
const MockCreateOrderDataToSign = require('../../factories/MockCreateOrderDataToSign')
const logger = require('../../../src/logger')
const { PrivateKeyService } = require('../../../src/services/PrivateKeyService')
const OrderSignerHelper = require('../../../src/helpers/OrderSignerHelper')
const PrivateKeyValidator = require('../../../src/validators/PrivateKeyValidator')
const OrderSignCommandValidator = require('../../../src/validators/OrderSignCommandValidator')
const OrderSignCommand = require('../../../src/commands/OrderSignCommand')

const orderSignCommandValidator = new OrderSignCommandValidator(logger)
const orderSignerHelper = new OrderSignerHelper(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)
const privateKeyService = new PrivateKeyService(logger)

const signCommand = new OrderSignCommand(logger, orderSignerHelper,
  orderSignCommandValidator, privateKeyService, privateKeyValidator)

describe('os sign', () => {
  describe('should raise validationError if', () => {
    test('type is not creation or cancellation.', async() => {
      const privateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'
      const cliInputJson = MockCancelOrderDataToSign.build({ type: 'wrongType' })

      const expectedResult = [{ code: 'ValidationError', field: 'type', message: 'type must be one of [creation, cancellation]' }]

      const result = await signCommand
        .executeAsync({ privateKeyPath, cliInputJson: JSON.stringify(cliInputJson) })

      expect(result).toMatchObject(expectedResult)
    })

    describe('private key was not defined as expected', () => {
      const invalidPrivateKeyPaths = ['/notExistent/path', 1, [], {}]
      test.each(invalidPrivateKeyPaths)(`should raise ValidationError if the private key path
       refers to a file which does not exist: %o`, async(invalidPrivateKeyPath) => {
        const expectedResult = [{ code: 'ValidationError', message: 'privateKeyFilePath file does not exist!', field: 'privateKeyFilePath' }]

        const result = await signCommand
          .executeAsync({ privateKeyPath: invalidPrivateKeyPath })

        expect(result).toMatchObject(expectedResult)
      })
    })
  })
  describe('sign cancel order', () => {
    test('should raise ValidationError if the private key is not a valid ethereum private key', async() => {
      const invalidPrivateKey = 'tests/fixtures/privateKeys/invalidPrivateKey.key'
      const cliInputJson = MockCancelOrderDataToSign.build()
      const expectedResult = [{ code: 'ValidationError', field: 'privateKey', message: 'privateKey is an invalid ethereum private key.' }]

      const result = await signCommand
        .executeAsync({ privateKeyPath: invalidPrivateKey, cliInputJson: JSON.stringify(cliInputJson) })

      expect(result).toMatchObject(expectedResult)
    })

    test('confirmation field is not cancel_request.', async() => {
      const privateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'
      const cliInputJson = MockCancelOrderDataToSign.build({ order: { confirmation: 'differentFrom cancel_request' } })

      const expectedResult = [{ code: 'ValidationError',
        field: 'confirmation',
        message: 'confirmation must be one of [cancel_request]' }]

      const result = await signCommand
        .executeAsync({ privateKeyPath, cliInputJson: JSON.stringify(cliInputJson) })

      expect(result).toMatchObject(expectedResult)
    })
  })

  test('should return the expected signature.', async() => {
    const privateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'

    const orderId = '0x9090909090909090909090909090909090909090909090909090909090909090'
    const cliInputJson = MockCancelOrderDataToSign.build({ order: { id: orderId } })
    const expectedEcSignature = {
      r: '0xfdba9197cdb4c360f666fe66658812f50156655439f8845d0c12d199074d3905',
      s: '0x660874341ed0ec11fe9b8f1fd9208d5b4a576884c442b7031f7d48fea4146d36',
      v: 27,
    }

    const result = await signCommand
      .executeAsync({ privateKeyPath, cliInputJson: JSON.stringify(cliInputJson) })

    expect(result).toMatchObject(expectedEcSignature)
  })
})

describe('sign create order', () => {
  test('should raise ValidationError if the private key is not a valid ethereum private key', async() => {
    const invalidPrivateKey = 'tests/fixtures/privateKeys/invalidPrivateKey.key'
    const cliInputJson = MockCreateOrderDataToSign.build()
    const expectedResult = [{ code: 'ValidationError', field: 'privateKey', message: 'privateKey is an invalid ethereum private key.' }]

    const result = await signCommand
      .executeAsync({ privateKeyPath: invalidPrivateKey, cliInputJson: JSON.stringify(cliInputJson) })

    expect(result).toMatchObject(expectedResult)
  })
  describe('should raise validationError if', () => {
    const invalidEthereumAddressFields = ['exchangeAddress', 'maker', 'offerTokenAddress', 'wantTokenAddress']
    test.each(invalidEthereumAddressFields)('should raise ValidationError if %o is not a valid ethereum address.', async(invalidEthereumAddressField) => {
      const privateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'
      const cliInputJson = MockCreateOrderDataToSign.build({ order: { [invalidEthereumAddressField]: 'wrong ethereum address' } })

      const expectedResult = [{ code: 'ValidationError',
        field: invalidEthereumAddressField,
        message: `${invalidEthereumAddressField} needs to be an ethereum address` }]

      const result = await signCommand
        .executeAsync({ privateKeyPath, cliInputJson: JSON.stringify(cliInputJson) })

      expect(result).toMatchObject(expectedResult)
    })
    test('should return the expected signature.', async() => {
      const privateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'

      const cliInputJson = MockCreateOrderDataToSign.build({ order: {
        exchangeAddress: '0xb05042c4e649DA88f0d4A55aC33312f38F3aeaef',
        maker: '0x062ca8979C5f30AA1bD23c4834eE048956ad02a4',
        offerTokenAddress: '0xb05042c4e649DA88f0d4A55aC33312f38F3aeaef',
        offerTokenAmount: '100000000000000',
        wantTokenAddress: '0xb05042c4e649DA88f0d4A55aC33312f38F3aeaef',
        wantTokenAmount: '100000000000000',
        expirationBlock: '1000',
        salt: '123458',
      } })

      const expectedEcSignature = {
        r: '0x2572776ce20cb5f161416eaa05a0e1eaba5f1bcb02176da872868675689a1d16',
        s: '0x52061b07ead176493d24bf382ec2506865587beb5dee717adea474f262dc0442',
        v: 28,
      }

      const result = await signCommand
        .executeAsync({ privateKeyPath, cliInputJson: JSON.stringify(cliInputJson) })

      expect(result).toMatchObject(expectedEcSignature)
    })
  })
})
