const Web3 = require('web3')
const sandbox = require('sinon').createSandbox()
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')

const logger = require('../../../src/logger')

const erc20Token = require('../../../abi/erc20Token')

const Erc20TokenService = require('../../../src/services/Erc20TokenService')
const Erc20TokenTransactionBuilder = require('../../../src/factories/Erc20TokenTransactionBuilder')
const { TransactionLib } = require('../../../src/lib/TransactionLib')

const providerUrl = 'FAKE_PROVIDER_URL'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const tradingWalletAddress = '0x0ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba'
const tokenAddress = '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2d'

const ethApiLibConf = {
  host: 'http:host.eidoo.io',
  port: 8080,
  useTLS: false,
}
const ethApiLib = new EidooEthApiLib(ethApiLibConf)

const transactionLib = new TransactionLib(web3, logger, ethApiLib)

const erc20TokenSmartContractAddress = '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2e'

const erc20TokenTransactionBuilder = new Erc20TokenTransactionBuilder(
  web3,
  { erc20TokenSmartContractAbi: erc20Token,
    erc20TokenSmartContractAddress,
    transactionLib,
    logger },
)

const erc20TokenService = new Erc20TokenService(web3, transactionLib, erc20TokenTransactionBuilder, logger)

afterEach(() => {
  sandbox.restore()
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
    sandbox.stub(transactionLib, 'sign')
    sandbox.stub(ethApiLib, 'sendRawTransactionAsync').returns({ hash: expectedTransactionHash })
    sandbox.stub(ethApiLib, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiLib, 'getEstimateGasAsync').returns(gasEstimationResponse)

    const transactionHash = await erc20TokenService.approveTrasferAsync(personalWalletAddress,
      tradingWalletAddress, quantity, tokenAddress, privateKey)

    expect(transactionHash).toEqual(expectedTransactionHash)
  })
})

describe('getAllowanceAsync', () => {
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'
  const tradingWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf585'

  test('calls correctly ethapi transactionCallAsync correctly', async() => {
    const expectedAllowed = '10000000000000'

    sandbox.stub(ethApiLib, 'transactionCallAsync').returns(expectedAllowed)

    const result = await erc20TokenService.getAllowanceAsync(
      personalWalletAddress,
      tradingWalletAddress,
    )
    expect(result).toEqual(expectedAllowed)
  })
})

describe('getBalanceOfAsync', () => {
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'

  test('calls correctly ethapi transactionCallAsync correctly', async() => {
    const expectedBalance = '10000000000000'

    sandbox.stub(ethApiLib, 'transactionCallAsync').returns(expectedBalance)

    const result = await erc20TokenService.getBalanceOfAsync(personalWalletAddress)
    expect(result).toEqual(expectedBalance)
  })
})
