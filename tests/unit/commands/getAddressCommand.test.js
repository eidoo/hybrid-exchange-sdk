/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { exchange } = require('../../../src/config')

const logger = require('../../../src/logger')
const TradingWalletServiceBuilder = require('../../../src/factories/TradingWalletServiceBuilder')
const PrivateKeyValidator = require('../../../src/validators/PrivateKeyValidator')
const GetAddressCommandValidator = require('../../../src/validators/commands/trading-wallet/GetAddressCommandValidator')
const GetAddressCommand = require('../../../src/commands/trading-wallet/GetAddressCommand')

const getAddressCommandValidator = new GetAddressCommandValidator(logger)

const tradingWalletService = TradingWalletServiceBuilder.build()

const privateKeyValidator = new PrivateKeyValidator(logger)
const PrivateKeyServiceBuilder = require('../../../src/factories/PrivateKeyServiceBuilder')

const privateKeyService = PrivateKeyServiceBuilder.build()
const getAddressCommand = new GetAddressCommand(logger, tradingWalletService,
  getAddressCommandValidator, privateKeyService, privateKeyValidator)

afterEach(() => {
  sandbox.restore()
})

describe('tws get-address', () => {
  const validPrivateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'

  describe('should raise Error if personal wallet address was not defined as expected', () => {
    const invalidPersonalWalletAddresses = ['NotValidEthereumAddress', [], {}, 21]
    test.each(invalidPersonalWalletAddresses)(` personalWalletAddress 
      is not a valid ethereum address: %o`, async (invalidPersonalWalletAddress) => {
      const expectedResult = [{
        code: 'ValidationError',
        field: 'personalWalletAddress',
        message: 'personalWalletAddress needs to be an ethereum address',
      }]

      const result = await getAddressCommand
        .executeAsync({ personalWalletAddress: invalidPersonalWalletAddress, privateKeyPath: validPrivateKeyPath })

      expect(result).toMatchObject(expectedResult)
    })

    test(' personalWallet is not defined', async () => {
      const personalWalletAddress = undefined
      const expectedResult = [{
        code: 'ValidationError',
        field: 'personalWalletAddress',
        message: 'personalWalletAddress is required',
      }]

      const result = await getAddressCommand.executeAsync({ personalWalletAddress })
      expect(result).toMatchObject(expectedResult)
    })
  })

  describe('should raise Error if private key was not defined as expected', () => {
    test(`should raise InvalidPrivateKeyError if the private key in private key path 
      does not refer to EOA provided in input`, async() => {
      const misMatchPersonalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const expectedResult = [{
        code: 'InvalidPrivateKeyError',
        field: null,
        message: `The private key does not match the personal wallet address given in input:${misMatchPersonalWalletAddress}`,
      }]

      const result = await getAddressCommand.executeAsync({ personalWalletAddress: misMatchPersonalWalletAddress,
        privateKeyPath: validPrivateKeyPath })

      expect(result).toMatchObject(expectedResult)
    })

    const invalidPrivateKeyPaths = ['/notExistent/path', 1, [], {}]
    test.each(invalidPrivateKeyPaths)(`should raise ValidationError if the private key path 
  refers to a file which does not exist: %o`, async(invalidPrivateKeyPath) => {
      const personalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const expectedResult = [{
        code: 'ValidationError',
        field: 'privateKeyPath',
        message: 'privateKeyPath file does not exist!',
      }]

      const result = await getAddressCommand
        .executeAsync({ privateKeyPath: invalidPrivateKeyPath, personalWalletAddress })

      expect(result).toMatchObject(expectedResult)
    })
    test('should raise ValidationError if the private key is not a valid ethereum private key', async() => {
      const personalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const InvalidPrivateKeyPath = 'tests/fixtures/privateKeys/invalidPrivateKey.key'
      const expectedResult = [{
        code: 'ValidationError',
        field: 'privateKey',
        message: 'privateKey is an invalid ethereum private key.',
      }]

      const result = await getAddressCommand
        .executeAsync({ privateKeyPath: InvalidPrivateKeyPath, personalWalletAddress })

      expect(result).toMatchObject(expectedResult)
    })
  })

  describe('should execute GetAddressCommand as expected', () => {
    const draftValues = [false, undefined]
    test.each(draftValues)('should return the tradingWallet address with draft value = %o', async (draft) => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTradingWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8d80'
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'transactionCallAsync')
        .returns(`0x000000000000000000000000${expectedTradingWalletAddress.substring(2)}`)

      const result = await getAddressCommand.executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft })
      expect(result).toBe(expectedTradingWalletAddress)
    })

    test('should return the transactionObjectDraft for tradingWallet address call', async () => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTransactionObjectDraft = {
        data: '0x2e16cf540000000000000000000000009c858489661158d1721a66319f8683925d5a8b70',
        from: personalWalletAddress,
        to: exchange.smartContractAddress,
        value: '0x0',
      }

      const result = await getAddressCommand
        .executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
  })
})
