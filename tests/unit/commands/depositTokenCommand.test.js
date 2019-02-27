/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { depositTokenCommand } = require('../../../src/commands/commandList')

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

describe('tws deposit-token', () => {
  const from = '0x9c858489661158d1721a66319f8683925d5a8b70'
  const to = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const quantity = '500000000000000000'
  const token = '0x230cd1dc412c44bb95aa39018e2a2aed28eccaec'
  const validPrivateKeyFilePath = 'tests/fixtures/privateKeys/privateKey.key'
  describe('execute deposit token command ', () => {
    test('should return the expected transaction hash', async () => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(depositTokenCommand.tradingWalletService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(depositTokenCommand.tradingWalletService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(depositTokenCommand.tradingWalletService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await depositTokenCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: false, withApprove: false })

      expect(result).toBe(expectedTransactionHash)
    })
    test('should return the transactionObjectDraft to deposit token', async () => {
      const expectedTransactionObjectDraft = { data:
     '0x2039d9fd000000000000000000000000230cd1dc412c44bb95aa39018e2a2aed28eccaec00000000000000000000000000000000000000000000000006f05b59d3b20000',
      from,
      to,
      value: '0x0' }

      const result = await depositTokenCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: true, withApprove: false })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
  })
})
