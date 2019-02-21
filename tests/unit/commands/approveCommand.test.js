/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { approveCommand } = require('../../../src/commands/commandList')

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
const token = '0xf6d686e52ffc5b9d224a9eb60b8e9c57978d5189'

// beforeEach(() => {
//   approveCommand.setErc20Tokenservice(token)
// })

afterEach(() => {
  sandbox.restore()
})

describe('tws approve', () => {
  const from = '0x9c858489661158d1721a66319f8683925d5a8b70'
  const to = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const quantity = '500000000000000000'
  const validPrivateKeyFilePath = 'tests/fixtures/privateKeys/privateKey.key'
  describe('execute  approve command ', () => {
    test('should return the expected transaction hash', async () => {
      const expectedTransactionHash = '0xTransactionHash'
      approveCommand.setErc20Tokenservice(token)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await approveCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: false })

      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the transactionObjectDraft to approve', async () => {
      const expectedTransactionObjectDraft = { data:
     '0x095ea7b3000000000000000000000000230cd1dc412c44bb95aa39018e2a2aed28ebadfc00000000000000000000000000000000000000000000000006f05b59d3b20000',
      from,
      to: token,
      value: '0x0' }

      const result = await approveCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
    const rawTxValues = [false, undefined]
    test.each(rawTxValues)('with rawTx value = %o', async (rawTx) => {
      const expectedTransactionHash = '0xTransactionHash'
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await approveCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the signed transaction data for approve', async () => {
      const expectedTransactionSignedData = '0xf8a882113082633382520894f6d686e52ffc5b9d224a9eb60b8e9c57978d518980b844095ea7b3000000000000000000000000230cd1dc412c44bb95aa39018e2a2aed28ebadfc00000000000000000000000000000000000000000000000006f05b59d3b200001ba0bc575694c1a6ec237cb79b8d8d806b367d1e2a0eab4af92cf03e2542ea16ce76a076f37e5e31ee084e87454959c9082a3d826a9f4f933f6e912b12c4700bd8224b'
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      const result = await approveCommand
        .executeAsync({ from, to, quantity, token, privateKeyFilePath: validPrivateKeyFilePath, draft: false, rawTx: true })
      expect(result).toEqual(expectedTransactionSignedData)
    })
  })
})
