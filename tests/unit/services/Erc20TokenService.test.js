const Web3 = require('web3')
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')
const sandbox = require('sinon').createSandbox()

const logger = require('../../../src/logger')
const { InvalidEthereumAddress } = require('../../../src/utils/errors')
const Erc20TokenService = require('../../../src/services/Erc20TokenService')
const MockTransactionDraftFactory = require('../../factories/MockTransactionDraftFactory')
const { TransactionLib } = require('../../../src/lib/TransactionLib')

const providerUrl = 'FAKE_PROVIDER_URL'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const erc20TokenSmartContractAddress = '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2e'
const tradingWalletSmartContractAddress = '0x0ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba'
const quantity = '500000000000000000000'
const tokenAddress = '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2d'

afterEach(() => {
  sandbox.restore()
})
const ethApiLibConf = {
  host: 'http:host.eidoo.io',
  port: 8080,
  useTLS: false,
}
const ethApiLib = new EidooEthApiLib(ethApiLibConf)

const transactionLibInstance = new TransactionLib(web3, logger, ethApiLib)
let erc20TokenService

beforeEach(() => {
  erc20TokenService = new Erc20TokenService(
    web3, { erc20TokenSmartContractAddress }, transactionLibInstance,
  )
})

describe('getApproveTrasferTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0xd57cb05EF66d2C7C952656Ddf5096e02281E3d2e'
    const encodedDataForApproveMethod = '0x095ea7b30000000000000000000000000ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba00000000000000000000000000000000000000000000001b1ae4d6e2ef500000'

    const expectedTransactionObjectDraft = MockTransactionDraftFactory
      .build({ from: personalWalletAddress, data: encodedDataForApproveMethod, to: erc20TokenSmartContractAddress })

    const result = erc20TokenService.getApproveTrasferTransactionDraft(personalWalletAddress, tradingWalletSmartContractAddress, quantity)

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })

  const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress is not a valid ethereum address %s',
    (invalidPersonalWalletAddress) => {
      try {
        erc20TokenService.getApproveTrasferTransactionDraft(invalidPersonalWalletAddress, tradingWalletSmartContractAddress, quantity)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })

  const invalidTradingWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidTradingWalletAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress is not a valid ethereum address %s',
    (invalidTradingWalletAddress) => {
      try {
        const validPersonalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        erc20TokenService.getApproveTrasferTransactionDraft(validPersonalWalletAddress, invalidTradingWalletAddress, quantity)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('approveTrasferAsync', () => {
  const privateKey = '0x0e72f985ad5de44fd7ffafe2b689f1030bb82e45537ed3a60aa10f9c49affbc2'
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'
  const quantity = '100000000000000000'
  test('calls correctly ethapi sendRawTransaction correctly', async() => {
    const expectedTransactionHash = '0xTransactionHash'
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
    sandbox.stub(transactionLibInstance, 'sign')
    sandbox.stub(ethApiLib, 'sendRawTransactionAsync').returns({ hash: expectedTransactionHash })
    sandbox.stub(ethApiLib, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiLib, 'getEstimateGasAsync').returns(gasEstimationResponse)

    const transactionHash = await erc20TokenService.approveTrasferAsync(personalWalletAddress,
      tradingWalletSmartContractAddress, quantity, tokenAddress, privateKey)

    expect(transactionHash).toEqual(expectedTransactionHash)
  })
})
