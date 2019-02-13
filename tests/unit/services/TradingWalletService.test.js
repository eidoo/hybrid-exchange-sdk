const Web3 = require('web3')
const sandbox = require('sinon').createSandbox()
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')

const log = require('../../../src/logger')
const TradingWalletService = require('../../../src/services/TradingWalletService')
const { SignTransactionError } = require('../../../src/utils/errors')
const { TradingWalletNotFoundError } = require('../../../src/utils/errors')
const { TransactionLib } = require('../../../src/lib/TransactionLib')
const TradingWalletTransactionBuilder = require('../../../src/factories/TradingWalletTransactionBuilder')

const MockTransactionDraftFactory = require('../../factories/MockTransactionDraftFactory')

const providerUrl = 'FAKE_PROVIDER_URL'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const tradingWalletSmartContractAddress = '0x0ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba'
const validtokenAddress = '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2e'

const exchangeSmartContractAddress = '0xf1c525a488a848b58b95d79da48c21ce434290f7'
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

const ethApiLibConf = {
  host: 'http:host.eidoo.io',
  port: 8080,
  useTLS: false,
}
const ethApiLib = new EidooEthApiLib(ethApiLibConf)

const transactionLibInstance = new TransactionLib(web3, log, ethApiLib)

const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(
  web3, { exchangeSmartContractAddress }, transactionLibInstance,
)
let tradingWalletService

beforeEach(() => {
  tradingWalletService = new TradingWalletService(web3, transactionLibInstance, tradingWalletTransactionBuilder)
})

afterEach(() => {
  sandbox.restore()
})

describe('getSignedDataAsync', () => {
  const privateKey = 'privateKey'
  test('calls correctly TransactionLib sign method', async() => {
    const transactionLibSignMock = sandbox.stub(tradingWalletService.transactionLib, 'sign')
    const transactionObjectDraft = MockTransactionDraftFactory.build()

    await tradingWalletService.getSignedTransactionData(transactionObjectDraft, privateKey)

    expect(transactionLibSignMock.calledOnceWithExactly(transactionObjectDraft, privateKey)).toBe(true)
  })
  const transactionObjectDraftInvalidProps = ['from', 'to', 'data', 'value']
  test.each(transactionObjectDraftInvalidProps)('raise SignTransactionError if TransactionObjectDraft is not valid',
    async (transactionObjectDraftInvalidProp) => {
      const transactionObjectDraft = MockTransactionDraftFactory
        .build({ [transactionObjectDraftInvalidProp]: undefined })
      return expect(tradingWalletService.getSignedTransactionData(transactionObjectDraft, privateKey))
        .rejects.toBeInstanceOf(SignTransactionError)
    })
})

describe('createWalletAsync', () => {
  const privateKey = '0e72f985ad5de44fd7ffafe2b689f1030bb82e45537ed3a60aa10f9c49affbc2'
  const personalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
  test('calls correctly ethapi sendRawTransaction correctly', async() => {
    const expectedSignedData = '0xf88782113082633382520894f1c525a488a848b58b95d79da48c21ce434290f780a4c1d5e84f000000000000000000000000d57cb05ef66d2c7c952656ddf5096e02281e3d2e1ba0c5f79b5bb10700cc384f4484edf376ef9e38bb6ada947db27e7f763e2898f2e3a06afd43f801275a1107abead95ad0d5af8a8fa4b2289db091d70e82f04e26ac57'
    const expectedTransactionHash = '0xTransactionHash'

    const ethApiLibMock = sandbox.stub(ethApiLib, 'sendRawTransactionAsync').returns({ hash: expectedTransactionHash })
    sandbox.stub(ethApiLib, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiLib, 'getEstimateGasAsync').returns(gasEstimationResponse)

    await tradingWalletService.createWalletAsync(personalWalletAddress, privateKey)

    expect(ethApiLibMock.calledOnceWith({ rawTx: expectedSignedData })).toBe(true)
  })
})

describe('depositEtherAsync', () => {
  const privateKey = '0e72f985ad5de44fd7ffafe2b689f1030bb82e45537ed3a60aa10f9c49affbc2'
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'
  const quantity = '100000000000000000'

  const tradingWalletAddress = '0x1cfda0c9a3e4e89865795a6370d87037c489a889'
  test('calls correctly ethapi sendRawTransaction correctly', async() => {
    const expectedSignedData = '0xf86f821130826333825208941cfda0c9a3e4e89865795a6370d87037c489a88988016345785d8a00008498ea5fca1ba0243468cd2260ca0917acc53519de367ac68ca68b0ec61586a904908e205cd551a01981a50d6c14e4a11c4c77e42968b60c49a0803783291e972c9db5a3ef7da329'
    const expectedTransactionHash = '0xTransactionHash'

    const ethApiLibMock = sandbox.stub(ethApiLib, 'sendRawTransactionAsync').returns({ hash: expectedTransactionHash })
    sandbox.stub(ethApiLib, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiLib, 'getEstimateGasAsync').returns(gasEstimationResponse)

    await tradingWalletService.depositEtherAsync(personalWalletAddress, tradingWalletAddress, quantity, privateKey)

    expect(ethApiLibMock.calledOnceWith({ rawTx: expectedSignedData })).toBe(true)
  })
})

describe('depositTokenAsync', () => {
  const privateKey = '0e72f985ad5de44fd7ffafe2b689f1030bb82e45537ed3a60aa10f9c49affbc2'
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'
  const quantity = '100000000000000000'
  test('calls correctly ethapi sendRawTransaction correctly', async() => {
    const expectedSignedData = '0xf8a8821130826333825208940ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba80b8442039d9fd000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e000000000000000000000000000000000000000000000000016345785d8a00001ba07c6b535c2a82feec42401e2ae9568cf92ea732dcd85c84fa1026d0cb2c0fec8aa05c062bdc3d21c820e0cd74ed1816b9e53033e417c97961d23c90293ca1f59114'
    const expectedTransactionHash = '0xTransactionHash'

    const ethApiLibMock = sandbox.stub(ethApiLib, 'sendRawTransactionAsync').returns({ hash: expectedTransactionHash })
    sandbox.stub(ethApiLib, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiLib, 'getEstimateGasAsync').returns(gasEstimationResponse)

    await tradingWalletService.depositTokenAsync(personalWalletAddress, tradingWalletSmartContractAddress,
      quantity, validtokenAddress, privateKey)

    expect(ethApiLibMock.calledOnceWith({ rawTx: expectedSignedData })).toBe(true)
  })
})

describe('WithdrawAsync', () => {
  const privateKey = '0e72f985ad5de44fd7ffafe2b689f1030bb82e45537ed3a60aa10f9c49affbc2'
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'
  const quantity = '100000000000000000'
  test('calls correctly ethapi sendRawTransaction correctly', async() => {
    const expectedTransactionHash = '0xTransactionHash'
    const expectedSignedData = '0xf8a9821130826333830186a0940ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba80b844f3fef3a3000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e000000000000000000000000000000000000000000000000016345785d8a00001ba05ec9740db856df484f1364161b99ddec3be9fe09834f8a84c8739d072da186c4a00a52a235fef3d4888bcacee94ee3e1149f764a2b41a25f71b013708b27285369'

    const ethApiLibMock = sandbox.stub(ethApiLib, 'sendRawTransactionAsync').returns({ hash: expectedTransactionHash })
    sandbox.stub(ethApiLib, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiLib, 'getEstimateGasAsync').returns(gasEstimationResponse)

    await tradingWalletService.withdrawAsync(personalWalletAddress,
      tradingWalletSmartContractAddress, quantity, validtokenAddress, privateKey)

    expect(ethApiLibMock.calledOnceWith({ rawTx: expectedSignedData })).toBe(true)
  })
  test('call exactly eth api to execute transaction and call getEstimateGas to take only gasPrice', async () => {
    const expectedTransactionHash = '0xTransactionHash'
    const expectedSignedData = '0xf8a9821130826333830186a0940ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba80b844f3fef3a3000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e000000000000000000000000000000000000000000000000016345785d8a00001ba05ec9740db856df484f1364161b99ddec3be9fe09834f8a84c8739d072da186c4a00a52a235fef3d4888bcacee94ee3e1149f764a2b41a25f71b013708b27285369'

    const sendRawTransactionAsyncMock = sandbox.stub(ethApiLib, 'sendRawTransactionAsync')
      .returns({ hash: expectedTransactionHash })
    sandbox.stub(ethApiLib, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiLib, 'getEstimateGasAsync').returns(gasEstimationResponse)

    await tradingWalletService.withdrawAsync(personalWalletAddress,
      tradingWalletSmartContractAddress, quantity, validtokenAddress, privateKey)

    expect(sendRawTransactionAsyncMock.calledOnceWith({ rawTx: expectedSignedData })).toBe(true)
  })
})

describe('getTradingWalletAddress', () => {
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'
  test('calls correctly ethapi transactionCallAsync correctly', async() => {
    const expectedResult = '0xresult'
    const transactionCallAsyncResponse = `0x000000000000000000000000${expectedResult.substring(2)}`
    sandbox.stub(ethApiLib, 'transactionCallAsync').returns(transactionCallAsyncResponse)

    const transactionCallResult = await tradingWalletService.getTradingWalletAddressAsync(personalWalletAddress)

    expect(transactionCallResult).toEqual(expectedResult)
  })
})

describe('getAssetBalanceAsync', () => {
  const personalWalletAddress = '0x52daf0caee4cf4e66a9c90dad58c3f0cc4cbf785'
  const tradingWalletOfThePersonalWallet = '0x31acf0caee4cf4e66a9c90dad58c3f0cc4cbf465'
  const noTradingWalletAssociated = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const tokenAddress = '0x0000000000000000000000000000000000000000'

  test('should return error since no trading wallet is found for personalWallet', async() => {
    sandbox.stub(tradingWalletService.transactionLib, 'call').returns(noTradingWalletAssociated)

    expect(tradingWalletService.getAssetBalanceAsync(personalWalletAddress, tokenAddress))
      .rejects.toBeInstanceOf(TradingWalletNotFoundError)
  })
  test('calls correctly ethapi transactionCallAsync correctly', async() => {
    const expectedAssetBalance = web3.toBigNumber(web3.toWei(5)).toString(10)

    sandbox.stub(tradingWalletService, 'getTradingWalletAddressAsync').returns(tradingWalletOfThePersonalWallet)
    sandbox.stub(ethApiLib, 'transactionCallAsync').returns(expectedAssetBalance)

    const tradingWalletAssetBalanceResult = await tradingWalletService.getAssetBalanceAsync(
      personalWalletAddress,
      tokenAddress,
    )

    expect(tradingWalletAssetBalanceResult).toEqual(expectedAssetBalance)
  })
})
