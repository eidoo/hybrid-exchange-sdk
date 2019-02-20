/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { withdrawCommand } = require('../../../src/commands/commandList')

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

describe('tws withdraw', () => {
  const from = '0x9c858489661158d1721a66319f8683925d5a8b70'
  const to = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const token = '0xf6d686e52ffc5b9d224a9eb60b8e9c57978d5189'
  const quantity = '500000000000000000'
  const validPrivateKeyFilePath = 'tests/fixtures/privateKeys/privateKey.key'
  describe('execute withdraw command ', () => {
    test('should return the expected transaction hash', async () => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await withdrawCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: false })

      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the transactionObjectDraft to create wallet', async () => {
      const expectedTransactionObjectDraft = { data:
     '0xf3fef3a3000000000000000000000000f6d686e52ffc5b9d224a9eb60b8e9c57978d518900000000000000000000000000000000000000000000000006f05b59d3b20000',
      from,
      to,
      value: '0x0' }

      const result = await withdrawCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
    const rawTxValues = [false, undefined]
    test.each(rawTxValues)('with rawTx value = %o', async (rawTx) => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await withdrawCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the signed transaction data to create wallet', async () => {
      const expectedTransactionSignedData = '0xf8a882113082633382520894230cd1dc412c44bb95aa39018e2a2aed28ebadfc80b844f3fef3a3000000000000000000000000f6d686e52ffc5b9d224a9eb60b8e9c57978d518900000000000000000000000000000000000000000000000006f05b59d3b200001ca0658fd577bda7281c9535e12e61ab271a87a2731ffdab753cfbf30d45124aa890a077b19ecf24bfd9ccc3ce9b2bed3ee2e3e56ad61967eb5127af41d5ad8adc42b5'
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      const result = await withdrawCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: false, rawTx: true })
      expect(result).toEqual(expectedTransactionSignedData)
    })
  })
})
