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
const keystorePassword = 'password'

beforeEach(() => {
  sandbox.stub(withdrawCommand, 'promptKeyStorePasswordAsync')
    .returns(keystorePassword)
})

afterEach(() => {
  sandbox.restore()
})

describe('tws withdraw', () => {
  const from = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
  const to = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const token = '0xf6d686e52ffc5b9d224a9eb60b8e9c57978d5189'
  const quantity = '500000000000000000'
  const keystoreFilePath = 'tests/fixtures/keyStore/validKeystore'
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
        .executeAsync({ from, to, quantity, token, keystoreFilePath })

      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the transactionObjectDraft to create wallet', async () => {
      const expectedTransactionObjectDraft = { data:
     '0xf3fef3a3000000000000000000000000f6d686e52ffc5b9d224a9eb60b8e9c57978d518900000000000000000000000000000000000000000000000006f05b59d3b20000',
      from,
      to,
      value: '0x0' }

      const result = await withdrawCommand
        .executeAsync({ from, to, quantity, token, keystoreFilePath, keystorePassword, draft: true })

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
        .executeAsync({ from, to, quantity, token, keystoreFilePath, keystorePassword, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the signed transaction data to create wallet', async () => {
      const expectedTransactionSignedData = '0xf8a882113082633382520894230cd1dc412c44bb95aa39018e2a2aed28ebadfc80b844f3fef3a3000000000000000000000000f6d686e52ffc5b9d224a9eb60b8e9c57978d518900000000000000000000000000000000000000000000000006f05b59d3b200001ca0f85836c9ad66a178d6ff0245f810210c5b55068debebe00fe8160fc25354d9c5a05b944520c0e0bff58563b9d8cc16e760505dc6bac8d0124f4f8a12043a28c16d'
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(withdrawCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      const result = await withdrawCommand
        .executeAsync({ from, to, quantity, token, keystoreFilePath, keystorePassword, draft: false, rawTx: true })
      expect(result).toEqual(expectedTransactionSignedData)
    })
  })
})
