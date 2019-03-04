/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { depositEthCommand } = require('../../../src/commands/commandList')

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

describe('trading-wallet deposit-eth', () => {
  const from = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
  const keystoreFilePath = 'tests/fixtures/privateKeys/validKeystore'
  const keystorePassword = 'password'
  const to = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const quantity = '500000000000000000'
  describe('execute deposit eth command ', () => {
    test('should return the expected transaction hash', async () => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })
      sandbox.stub(depositEthCommand, 'promptKeyStorePassword')
        .returns(keystorePassword)

      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, keystoreFilePath, keystorePassword })

      expect(result).toBe(expectedTransactionHash)
    })
    test('should return the transactionObjectDraft to deposit eth', async () => {
      const expectedTransactionObjectDraft = {
        data: '0x98ea5fca',
        from,
        to,
        value: '0x6f05b59d3b20000',
      }
      sandbox.stub(depositEthCommand, 'promptKeyStorePassword')
        .returns(keystorePassword)
      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, keystoreFilePath, keystorePassword, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })

    const rawTxValues = [false, undefined]
    test.each(rawTxValues)('with rawTx value = %o', async (rawTx) => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })
      sandbox.stub(depositEthCommand, 'promptKeyStorePassword').returns(keystorePassword)

      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, keystoreFilePath, keystorePassword, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })
    test('should return the signed transaction data to deposit eth', async () => {
      // eslint-disable-next-line max-len
      const expectedTransactionSignedData = '0xf86f82113082633382520894230cd1dc412c44bb95aa39018e2a2aed28ebadfc8806f05b59d3b200008498ea5fca1ba05201b8c19ec97c3d54c7cd8c9fbb35b53cd4b1624f5247eaad494eefa2446256a07c8e87d8f89cf7facaf174aae1761c8ed2bbadffecceec7a203044b2070226e2'
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(depositEthCommand, 'promptKeyStorePassword')
        .returns(keystorePassword)

      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, keystoreFilePath, keystorePassword, draft: false, rawTx: true })
      expect(result).toEqual(expectedTransactionSignedData)
    })
  })
})
