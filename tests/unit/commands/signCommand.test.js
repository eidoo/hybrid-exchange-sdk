/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const MockCancelOrderDataToSign = require('../../factories/MockCancelOrderDataToSign')
const MockCreateOrderDataToSign = require('../../factories/MockCreateOrderDataToSign')
const logger = require('../../../src/logger')
const PrivateKeyServiceBuilder = require('../../../src/factories/PrivateKeyServiceBuilder')
const { InvalidKeystoreParams } = require('../../../src/services/PrivateKeyService')
const OrderSignerHelper = require('../../../src/helpers/OrderSignerHelper')
const PrivateKeyValidator = require('../../../src/validators/PrivateKeyValidator')
const OrderSignCommandValidator = require('../../../src/validators/commands/order/OrderSignCommandValidator')
const OrderSignCommand = require('../../../src/commands/order/OrderSignCommand')

const orderSignCommandValidator = new OrderSignCommandValidator(logger)
const orderSignerHelper = new OrderSignerHelper(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)

const privateKeyService = PrivateKeyServiceBuilder.build()

const signCommand = new OrderSignCommand(logger, orderSignerHelper,
  orderSignCommandValidator, privateKeyService, privateKeyValidator)
const keystorePassword = 'password'
const keystoreFilePath = 'tests/fixtures/keyStore/validKeystore'

beforeEach(() => {
  sandbox.stub(signCommand, 'promptKeyStorePasswordAsync')
    .returns(keystorePassword)
})

afterEach(() => {
  sandbox.restore()
})

describe('os sign', () => {
  test('should raise validationError if type is not creation or cancellation.', async() => {
    const cliInputJson = MockCancelOrderDataToSign.build({ type: 'wrongType' })
    const expectedResult = [{
      code: 'ValidationError',
      field: 'type',
      message: 'type must be one of [creation, cancellation]',
    }]

    const result = await signCommand
      .executeAsync({ keystorePassword, keystoreFilePath, cliInputJson: JSON.stringify(cliInputJson) })

    expect(result).toMatchObject(expectedResult)
  })

  const invalidKeystorePaths = ['/notExistent/path', 1, [], {}]
  test.each(invalidKeystorePaths)(`should raise ValidationError if the keystore path
       refers to a file which does not exist: %o`, async(invalidKeystorePath) => {
    const cliInputJson = MockCancelOrderDataToSign.build()
    const expectedResult = [{ code: 'ValidationError',
      message: 'keystoreFilePath file does not exist!',
      field: 'keystoreFilePath' }]

    const result = await signCommand
      .executeAsync({
        keystorePassword,
        keystoreFilePath: invalidKeystorePath,
        cliInputJson: JSON.stringify(cliInputJson),
      })

    expect(result).toMatchObject(expectedResult)
  })

  describe('sign cancel order', () => {
    test('confirmation field is not cancel_request.', async() => {
      const cliInputJson = MockCancelOrderDataToSign.build({ order: { confirmation: 'differentFrom cancel_request' } })

      const expectedResult = [{ code: 'ValidationError',
        field: 'confirmation',
        message: 'confirmation must be one of [cancel_request]' }]

      const result = await signCommand
        .executeAsync({ keystoreFilePath, keystorePassword, cliInputJson: JSON.stringify(cliInputJson) })

      expect(result).toMatchObject(expectedResult)
    })
  })

  test('should return the expected signature.', async() => {
    const orderId = '0x9090909090909090909090909090909090909090909090909090909090909090'
    const cliInputJson = MockCancelOrderDataToSign.build({ order: { id: orderId } })
    const expectedEcSignature = {
      r: '0x2c882baa96e7c38e2f38cdad9e2f4bd55934de27d52080e2782c3329cf7915f9',
      s: '0x39ef0b364b6f947ba0acc27a3df3abd87f05be4ee293e6ae54152cd835e29572',
      v: 27,
    }

    const result = await signCommand
      .executeAsync({ keystoreFilePath, keystorePassword, cliInputJson: JSON.stringify(cliInputJson) })

    expect(result).toMatchObject(expectedEcSignature)
  })
})

describe('sign create order', () => {
  test('should raise ValidationError if the private key is not a valid ethereum private key', async() => {
    const invalidPrivateKey = 'tests/fixtures/privateKeys/invalidPrivateKey.key'
    const cliInputJson = MockCreateOrderDataToSign.build()

    const expectedResult = [{
      code: 'ValidationError',
      field: 'privateKey',
      message: 'privateKey is an invalid ethereum private key.',
    }]

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
        r: '0xd002769436f9a0a7879d658077375a7b3506b00a5e51fb252edbd2f7ffec4cc3',
        s: '0x2f783203d66556983991a0c40622ac875065866248dffa3f397b42bdd8498f7e',
        v: 27,
      }

      const result = await signCommand
        .executeAsync({ keystoreFilePath, keystorePassword, cliInputJson: JSON.stringify(cliInputJson) })

      expect(result).toMatchObject(expectedEcSignature)
    })
  })
})
