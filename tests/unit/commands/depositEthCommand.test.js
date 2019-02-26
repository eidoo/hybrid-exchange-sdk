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

describe('tws deposit-eth', () => {
  const from = '0x9c858489661158d1721a66319f8683925d5a8b70'
  const to = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const quantity = '500000000000000000'
  const validPrivateKeyFilePath = 'tests/fixtures/privateKeys/privateKey.key'
  describe('execute deposit eth command ', () => {
    test('should return the expected transaction hash', async () => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, privateKeyFilePath: validPrivateKeyFilePath, draft: false })

      expect(result).toBe(expectedTransactionHash)
    })
    test('should return the transactionObjectDraft to deposit eth', async () => {
      const expectedTransactionObjectDraft = { data:
     '0x98ea5fca',
      from,
      to,
      value: '0x6f05b59d3b20000' }

      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, privateKeyFilePath: validPrivateKeyFilePath, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })

    const rawTxValues = [false, undefined]
    test.each(rawTxValues)('with rawTx value = %o', async (rawTx) => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, privateKeyFilePath: validPrivateKeyFilePath, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })
    test('should return the signed transaction data to deposit eth', async () => {
      const expectedTransactionSignedData = '0xf86f82113082633382520894230cd1dc412c44bb95aa39018e2a2aed28ebadfc8806f05b59d3b200008498ea5fca1ca0121cd167aec2f138174218863ea7b1d09b21448cc99f9b5bf0aa420ee3dbc66da01553d4106a51ac5e087122f3c5b355d5106dd88515a4dcce69aa32e08378bf96'
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(depositEthCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      const result = await depositEthCommand
        .executeAsync({ from, to, quantity, privateKeyFilePath: validPrivateKeyFilePath, draft: false, rawTx: true })
      expect(result).toEqual(expectedTransactionSignedData)
    })
  })
})
