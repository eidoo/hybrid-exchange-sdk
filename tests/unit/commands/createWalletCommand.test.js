/* eslint-env node, jest */
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')
const sandbox = require('sinon').createSandbox()
const Web3 = require('web3')

const { TransactionLib } = require('../../../src/lib/TransactionLib')
const CreateWalletCommand = require('../../../src/commands/trading-wallet/CreateWalletCommand')
// eslint-disable-next-line max-len
const CreateWalletCommandValidator = require('../../../src/validators/commands/trading-wallet/CreateWalletCommandValidator')
const logger = require('../../../src/logger')
const PrivateKeyServiceBuilder = require('../../../src/factories/PrivateKeyServiceBuilder')
const PrivateKeyValidator = require('../../../src/validators/PrivateKeyValidator')
const TradingWalletService = require('../../../src/services/TradingWalletService')
const TradingWalletTransactionBuilder = require('../../../src/factories/TradingWalletTransactionBuilder')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const exchangeSmartContractAddress = '0xf1c525a488a848b58b95d79da48c21ce434290f7'
const ethApiLibConf = {
  host: 'http:host.eidoo.io',
  port: 8080,
  useTLS: false,
}

const ethApiClient = new EidooEthApiLib(ethApiLibConf)
const transactionLib = new TransactionLib({ web3, logger, ethApiClient })
const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(
  web3, { exchangeSmartContractAddress, transactionLib, logger },
)
const tradingWalletService = new TradingWalletService(web3, transactionLib, tradingWalletTransactionBuilder, logger)

const privateKeyValidator = new PrivateKeyValidator(logger)
const privateKeyService = PrivateKeyServiceBuilder.build()

const createWalletCommandValidator = new CreateWalletCommandValidator(logger)
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

const keystorePassword = 'password'
beforeEach(() => {
  sandbox.stub(createWalletCommand, 'promptKeyStorePasswordAsync')
    .returns(keystorePassword)
})

afterEach(() => {
  sandbox.restore()
})

describe('tws create-trading-wallet', () => {
  const keystoreFilePath = 'tests/fixtures/keyStore/validKeystore'
  describe('should execute CreateWalletCommand as expected', () => {
    test('should return the transaction hash with draft value = %o', async () => {
      const personalWalletAddress = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(
        createWalletCommand.tradingWalletService.transactionLib.ethApiClient,
        'getAddressNonceAsync',
      ).returns(nonceResponse)
      sandbox.stub(
        createWalletCommand.tradingWalletService.transactionLib.ethApiClient,
        'getEstimateGasAsync',
      ).returns(gasEstimationResponse)

      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, keystoreFilePath, keystorePassword, draft: false })

      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the transactionObjectDraft to create wallet', async () => {
      const personalWalletAddress = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
      const expectedTransactionObjectDraft = { data:
     '0xc1d5e84f000000000000000000000000db1b9e1708aec862fee256821702fa1906ceff67',
      from: personalWalletAddress,
      to: exchangeSmartContractAddress,
      value: '0x0' }

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, keystoreFilePath, keystorePassword, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
  })

  describe('should show signed transaction data', () => {
    const rawTxValues = [false, undefined]
    test.each(rawTxValues)('should return the transaction hash with rawTx value = %o', async (rawTx) => {
      const personalWalletAddress = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(
        createWalletCommand.tradingWalletService.transactionLib.ethApiClient,
        'getAddressNonceAsync',
      ).returns(nonceResponse)
      sandbox.stub(
        createWalletCommand.tradingWalletService.transactionLib.ethApiClient,
        'getEstimateGasAsync',
      ).returns(gasEstimationResponse)

      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, keystoreFilePath, keystorePassword, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the signed transaction data to create wallet', async () => {
      const personalWalletAddress = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
      // eslint-disable-next-line max-len
      const expectedTransactionSignedData = '0xf88782113082633382520894f1c525a488a848b58b95d79da48c21ce434290f780a4c1d5e84f000000000000000000000000db1b9e1708aec862fee256821702fa1906ceff671ca0826ed3c2f8d016d307f3cffe416e5bfabee7517064a661a0bb90862b83a10e9ca053ee1253ff9e9c74885842491b5d92832c296a24127df9c2c9244c33a92665f0'
      sandbox.stub(
        createWalletCommand.tradingWalletService.transactionLib.ethApiClient,
        'getAddressNonceAsync',
      ).returns(nonceResponse)
      sandbox.stub(
        createWalletCommand.tradingWalletService.transactionLib.ethApiClient,
        'getEstimateGasAsync',
      ).returns(gasEstimationResponse)

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, keystoreFilePath, keystorePassword, draft: false, rawTx: true })

      expect(result).toEqual(expectedTransactionSignedData)
    })
  })

  describe('should raise Error if private key was not defined as expected', () => {
    test(`should raise InvalidPrivateKeyError if the private key in private key path 
      does not refer to EOA provided in input`, async() => {
      const misMatchPersonalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const expectedResult = [{
        code: 'InvalidPrivateKeyError',
        field: null,
        // eslint-disable-next-line max-len
        message: `The private key does not match the personal wallet address given in input:${misMatchPersonalWalletAddress}`,
      }]

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress: misMatchPersonalWalletAddress, keystoreFilePath, keystorePassword })

      expect(result).toMatchObject(expectedResult)
    })

    const invalidKeystoreFilePaths = ['/notExistent/path', 1, [], {}]
    test.each(invalidKeystoreFilePaths)(`should raise ValidationError if the private key path 
       refers to a file which does not exist: %o`, async(invalidKeystoreFilePath) => {
      const personalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const expectedResult = [{
        code: 'ValidationError',
        field: 'keystoreFilePath',
        message: 'keystoreFilePath file does not exist!',
      }]

      const result = await createWalletCommand
        .executeAsync({ keystoreFilePath: invalidKeystoreFilePath, personalWalletAddress })

      expect(result).toMatchObject(expectedResult)
    })

    test('should raise Validation error if no keystore was provided as input.', async () => {
      const personalWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
      const keystoreFilePath = undefined
      const expectedResult = [{
        code: 'ValidationError',
        field: 'keystoreFilePath',
        message: 'keystoreFilePath is required',
      }]

      const result = await createWalletCommand.executeAsync({ keystoreFilePath, personalWalletAddress })
      expect(result).toMatchObject(expectedResult)
    })
  })
})
