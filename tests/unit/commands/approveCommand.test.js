/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { approveCommand } = require('../../../src/commands/commandList')
const { Erc20TokenServiceBuilder } = require('../../../index').factories

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
const to = '0xf6d686e52ffc5b9d224a9eb60b8e9c57978d5189'
const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(to)

const erc20TokenService = erc20TokenServiceBuilder.build()

const keystorePassword = 'password'
beforeEach(() => {
  sandbox.stub(approveCommand, 'promptKeyStorePasswordAsync')
    .returns(keystorePassword)
  approveCommand.erc20TokenService = erc20TokenService
})

afterEach(() => {
  delete approveCommand.erc20TokenService
  sandbox.restore()
})
describe('tws approve', () => {
  const from = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
  const spender = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const quantity = '500000000000000000'
  const keystoreFilePath = 'tests/fixtures/keyStore/validKeystore'
  describe('execute  approve command ', () => {
    test('should return the expected transaction hash', async () => {
      const expectedTransactionHash = '0xTransactionHash'

      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getAddressNonceAsync')
        .returns(nonceResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getEstimateGasAsync')
        .returns(gasEstimationResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'sendRawTransactionAsync')
        .returns({ hash: expectedTransactionHash })

      const result = await approveCommand
        .executeAsync({ from, to, quantity, spender, keystoreFilePath, keystorePassword, draft: false })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the transactionObjectDraft to approve', async () => {
      const expectedTransactionObjectDraft = { data:
     '0x095ea7b3000000000000000000000000230cd1dc412c44bb95aa39018e2a2aed28ebadfc00000000000000000000000000000000000000000000000006f05b59d3b20000',
      from,
      to,
      value: '0x0' }

      const result = await approveCommand
        .executeAsync({ from, to, quantity, spender, keystoreFilePath, keystorePassword, draft: true })

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
        .executeAsync({ from, to, quantity, spender, keystoreFilePath, keystorePassword, draft: false, rawTx })
      expect(result).toBe(expectedTransactionHash)
    })

    test('should return the signed transaction data for approve', async () => {
      const expectedTransactionSignedData = '0xf8a882113082633382520894f6d686e52ffc5b9d224a9eb60b8e9c57978d518980b844095ea7b3000000000000000000000000230cd1dc412c44bb95aa39018e2a2aed28ebadfc00000000000000000000000000000000000000000000000006f05b59d3b200001ba0248b313a0e5cac15c3071a4009a1b018311801092bf087ef32a601cf1afa0d79a053fa89ef94b71d923accd36fdd746aaec0325327ae821950df417dde92387d31'
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(approveCommand.erc20TokenService.transactionLib.ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

      const result = await approveCommand
        .executeAsync({ from, to, quantity, spender, keystoreFilePath, keystorePassword, draft: false, rawTx: true })
      expect(result).toEqual(expectedTransactionSignedData)
    })
  })
})
