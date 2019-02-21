/* eslint-env node, jest */
const Web3 = require('web3')
const sandbox = require('sinon').createSandbox()
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')

const { PrivateKeyService } = require('../../../src/services/PrivateKeyService')
const { TransactionLib } = require('../../../src/lib/TransactionLib')
const CreateWalletCommand = require('../../../src/commands/CreateWalletCommand')
const CreateWalletCommandValidator = require('../../../src/validators/CreateWalletCommandValidator')
const logger = require('../../../src/logger')
const PrivateKeyValidator = require('../../../src/validators/PrivateKeyValidator')
const TradingWalletService = require('../../../src/services/TradingWalletService')
const TradingWalletTransactionBuilder = require('../../../src/factories/TradingWalletTransactionBuilder')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const createWalletCommandValidator = new CreateWalletCommandValidator(logger)

const exchangeSmartContractAddress = '0xf1c525a488a848b58b95d79da48c21ce434290f7'
const ethApiLibConf = {
  host: 'http:host.eidoo.io',
  port: 8080,
  useTLS: false,
}
const ethApiLib = new EidooEthApiLib(ethApiLibConf)
const transactionLib = new TransactionLib(web3, logger, ethApiLib)
const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(
  web3, { exchangeSmartContractAddress, transactionLib, logger },
)

const tradingWalletService = new TradingWalletService(web3, transactionLib, tradingWalletTransactionBuilder, logger)

const privateKeyValidator = new PrivateKeyValidator(logger)
const privateKeyService = new PrivateKeyService(logger)

const createWalletCommand = new CreateWalletCommand(logger, tradingWalletService,
  createWalletCommandValidator, privateKeyService, privateKeyValidator)

const nonceResponse = {
  nonce: 4400,
}
const gasEstimationResponse = {
  gas: 21000,
  gasPrices: {
    high: '0',
    medium: '25395',
    low: '0',
  },
}

afterEach(() => {
  sandbox.restore()
})

describe('tws create-trading-wallet', () => {
  const validPrivateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'
  describe('should execute CreateWalletCommand as expected', () => {
    test('should return the transaction hash with draft value = %o', async () => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft: false })

      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the transactionObjectDraft to create wallet', async () => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTransactionObjectDraft = { data:
     '0xc1d5e84f0000000000000000000000009c858489661158d1721a66319f8683925d5a8b70',
      from: personalWalletAddress,
      to: exchangeSmartContractAddress,
      value: '0x0' }

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
  })

  describe('should show signed transaction data', () => {
    const rawTxValues = [false, undefined]
    test.each(rawTxValues)('should return the transaction hash with rawTx value = %o', async (rawTx) => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the signed transaction data to create wallet', async () => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTransactionSignedData = '0xf88782113082633382520894f1c525a488a848b58b95d79da48c21ce434290f780a4c1d5e84f0000000000000000000000009c858489661158d1721a66319f8683925d5a8b701ca0b09e24fb6dbee7bc24d528c396448eede4ead9413275cb88327d97eed0537d2ea01e524f5c529c2d68626a571b024b82cc5e278f9e98933df676c20eb61c7ea6d0'
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft: false, rawTx: true })

      expect(result).toEqual(expectedTransactionSignedData)
    })
  })

  describe('should raise Error if private key was not defined as expected', () => {
    test(`should raise InvalidPrivateKeyError if the private key in private key path 
      does not refer to EOA provided in input`, async() => {
      const misMatchPersonalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const expectedResult = [{ code: 'InvalidPrivateKeyError',
        field: null,
        message: `The private key does not match the personal wallet address given in input:${misMatchPersonalWalletAddress}` }]

      const result = await createWalletCommand.executeAsync({ personalWalletAddress: misMatchPersonalWalletAddress,
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

      const result = await createWalletCommand
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

      const result = await createWalletCommand
        .executeAsync({ privateKeyPath: InvalidPrivateKeyPath, personalWalletAddress })

      expect(result).toMatchObject(expectedResult)
    })

    test('should raise Validation error if no private key was provided as input.', async () => {
      const personalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const privateKeyPath = undefined
      const expectedResult = [{
        code: 'ValidationError',
        field: 'privateKeyFilePath',
        message: 'privateKeyFilePath is required',
      }]

      const result = await createWalletCommand.executeAsync({ privateKeyPath, personalWalletAddress })
      expect(result).toMatchObject(expectedResult)
    })
  })
})
