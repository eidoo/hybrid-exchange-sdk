/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const config = require('../../../src/config')
const { createWalletCommand } = require('../../../src/commands/commandList')

const { smartContractAddress: exchangeSmartContractAddress } = config.exchange

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
      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

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
      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, keystoreFilePath, keystorePassword, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the signed transaction data to create wallet', async () => {
      const personalWalletAddress = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
      const expectedTransactionSignedData = '0xf88782113082633382520894bfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e80a4c1d5e84f000000000000000000000000db1b9e1708aec862fee256821702fa1906ceff671ba08e16c9a40e610b2a7facbb8c04fbd020c76d6e9fbdc62f720593038756b3073ea07e5726d2797dd59891574e3c8576044790b40b8d71770ce0ffecf6c3c40d0024'
      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(createWalletCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      const result = await createWalletCommand
        .executeAsync({ personalWalletAddress, keystoreFilePath, keystorePassword, draft: false, rawTx: true })

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

      const result = await createWalletCommand.executeAsync({ personalWalletAddress: misMatchPersonalWalletAddress, keystoreFilePath, keystorePassword })

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
