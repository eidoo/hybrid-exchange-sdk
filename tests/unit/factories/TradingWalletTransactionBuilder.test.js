const Web3 = require('web3')
const sandbox = require('sinon').createSandbox()
const ethereumUtil = require('ethereumjs-util')
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')

const log = require('../../../src/logger')
const { InvalidEthereumAddress } = require('../../../src/utils/errors')
const TradingWalletTransactionBuilder = require('../../../src/factories/TradingWalletTransactionBuilder')
const { TransactionLib } = require('../../../src/lib/TransactionLib')

const MockTransactionDraftFactory = require('../../factories/MockTransactionDraftFactory')

const providerUrl = 'FAKE_PROVIDER_URL'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const exchangeSmartContractAddress = '0x5bcd707ddb9bAA77ac414710273bffffae255ee5'
const tradingWalletSmartContractAddress = '0x0ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba'
const validtokenAddress = '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2e'
const etherTokenAddress = '0x0000000000000000000000000000000000000000'

const ethApiLibConf = {
  host: 'http:host.eidoo.io',
  port: 8080,
  useTLS: false,
}
const ethApiClient = new EidooEthApiLib(ethApiLibConf)

const transactionLibInstance = new TransactionLib({ web3, log, ethApiClient })

let tradingWalletTransactionBuilder

beforeEach(() => {
  tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(
    web3, { exchangeSmartContractAddress }, transactionLibInstance,
  )
})

afterEach(() => {
  sandbox.restore()
})

describe('buildCreateWalletTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    const encodedDataForAddNewUserMethod = '0xc1d5e84f000000000000000000000000300be6824289b48cb6726f99c16e51fb41d480da'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory
      .build({ from: personalWalletAddress, data: encodedDataForAddNewUserMethod, to: exchangeSmartContractAddress })

    const result = tradingWalletTransactionBuilder.buildCreateWalletTransactionDraft(personalWalletAddress)

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })

  const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress s not a valid ethereum address %s',
    (invalidPersonalWalletAddress) => {
      try {
        tradingWalletTransactionBuilder.buildCreateWalletTransactionDraft(invalidPersonalWalletAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildDepositEtherTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
    const encodedDataFordepositEtherMethod = '0x98ea5fca'
    const quantity = '100000000000000000'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory
      .build({ from: personalWalletAddress,
        data: encodedDataFordepositEtherMethod,
        to: tradingWalletSmartContractAddress,
        value: web3.toHex(quantity) })

    const result = tradingWalletTransactionBuilder.buildDepositEtherTransactionDraft(personalWalletAddress, tradingWalletSmartContractAddress, quantity)

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })

  const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress s not a valid ethereum address %s',
    (invalidPersonalWalletAddress) => {
      try {
        const validTradingWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildDepositEtherTransactionDraft(invalidPersonalWalletAddress, validTradingWalletAddress, 1000)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })

  const invalidTradingWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidTradingWalletAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress s not a valid ethereum address %s',
    (invalidTradingWalletAddress) => {
      try {
        const validPersonalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildDepositEtherTransactionDraft(validPersonalWalletAddress, invalidTradingWalletAddress, 1000)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildDepositTokenTransactionDraft', () => {
  const quantity = '500000000000000000000'

  test('returns correct transaction object', () => {
    const personalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
    const encodedDataForTokenEtherMethod = '0x2039d9fd000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e00000000000000000000000000000000000000000000001b1ae4d6e2ef500000'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory
      .build({ from: personalWalletAddress,
        data: encodedDataForTokenEtherMethod,
        to: tradingWalletSmartContractAddress })

    const result = tradingWalletTransactionBuilder.buildDepositTokenTransactionDraft(personalWalletAddress, tradingWalletSmartContractAddress, quantity, validtokenAddress)

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })

  const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress is not a valid ethereum address %s',
    (invalidPersonalWalletAddress) => {
      try {
        const validTradingWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildDepositTokenTransactionDraft(invalidPersonalWalletAddress, validTradingWalletAddress, quantity, validtokenAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })

  const invalidTradingWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidTradingWalletAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress is not a valid ethereum address %s',
    (invalidTradingWalletAddress) => {
      try {
        const validPersonalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildDepositTokenTransactionDraft(validPersonalWalletAddress, invalidTradingWalletAddress, quantity, validtokenAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })

  const invalidTokenAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidTokenAddresses)('raise InvalidEthereumAddress error if the tokenAddess is not a valid ethereum address %s',
    (invalidTokenAddress) => {
      try {
        const validPersonalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildDepositTokenTransactionDraft(validPersonalWalletAddress, quantity, tradingWalletSmartContractAddress, quantity, invalidTokenAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildWithdrawTransactionDraft', () => {
  const quantity = '1000000000000000000000'
  const encodedDataForTokenMethod = '0xf3fef3a3000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e00000000000000000000000000000000000000000000003635c9adc5dea00000'
  const encodedDataForEtherTokenMethod = '0xf3fef3a3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003635c9adc5dea00000'
  const tests = [{
    tokenAddress: validtokenAddress,
    data: encodedDataForTokenMethod,
  }, {
    tokenAddress: etherTokenAddress,
    data: encodedDataForEtherTokenMethod,
  }]
  test.each(tests)('returns correct transaction object for token', (params) => {
    const personalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory
      .build({ from: personalWalletAddress,
        data: params.data,
        to: tradingWalletSmartContractAddress })

    const result = tradingWalletTransactionBuilder.buildWithdrawTransactionDraft(
      personalWalletAddress,
      tradingWalletSmartContractAddress,
      quantity,
      params.tokenAddress,
    )

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })

  const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress is not a valid ethereum address %s',
    (invalidPersonalWalletAddress) => {
      try {
        const validTradingWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildWithdrawTransactionDraft(validTradingWalletAddress,
          invalidPersonalWalletAddress, quantity, validtokenAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })

  const invalidTradingWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidTradingWalletAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress is not a valid ethereum address %s',
    (invalidTradingWalletAddress) => {
      try {
        const validPersonalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildWithdrawTransactionDraft(invalidTradingWalletAddress,
          validPersonalWalletAddress, quantity, validtokenAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })

  const invalidTokenAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidTokenAddresses)('raise InvalidEthereumAddress error if the tokenAddess is not a valid ethereum address %s',
    (invalidTokenAddress) => {
      try {
        const validPersonalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
        tradingWalletTransactionBuilder.buildWithdrawTransactionDraft(tradingWalletSmartContractAddress,
          validPersonalWalletAddress, quantity, invalidTokenAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildTradingWalletAddressTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    const encodedDataForAddNewUserMethod = '0x2e16cf54000000000000000000000000300be6824289b48cb6726f99c16e51fb41d480da'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory
      .build({ from: personalWalletAddress, data: encodedDataForAddNewUserMethod, to: exchangeSmartContractAddress })

    const result = tradingWalletTransactionBuilder.buildTradingWalletAddressTransactionDraft(personalWalletAddress)

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })

  const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress s not a valid ethereum address %s',
    (invalidPersonalWalletAddress) => {
      try {
        tradingWalletTransactionBuilder.buildTradingWalletAddressTransactionDraft(invalidPersonalWalletAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildAssetBalanceTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    const encodedDataForAddNewUserMethod = '0xf6b1b18b000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory.build({
      from: personalWalletAddress,
      data: encodedDataForAddNewUserMethod,
      to: tradingWalletSmartContractAddress,
    })

    const result = tradingWalletTransactionBuilder.buildAssetBalanceTransactionDraft(
      personalWalletAddress,
      tradingWalletSmartContractAddress,
      validtokenAddress,
    )

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })

  const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress s not a valid ethereum address %s',
    (invalidPersonalWalletAddress) => {
      try {
        tradingWalletTransactionBuilder.buildAssetBalanceTransactionDraft(invalidPersonalWalletAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildUpdateExchangeTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    const fakeExchangeAddress = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    const updateExchangeEncodedData = '0x648a0c91000000000000000000000000300be6824289b48cb6726f99c16e51fb41d480da'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory.build({
      from: personalWalletAddress,
      data: updateExchangeEncodedData,
      to: tradingWalletSmartContractAddress,
    })

    const result = tradingWalletTransactionBuilder.buildUpdateExchangeTransactionDraft(
      personalWalletAddress,
      tradingWalletSmartContractAddress,
      fakeExchangeAddress,
    )

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })
  const invalidAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress s not a valid ethereum address %s',
    (invalidAddress) => {
      try {
        tradingWalletTransactionBuilder.buildUpdateExchangeTransactionDraft(invalidAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
  test.each(invalidAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress s not a valid ethereum address %s',
    (invalidAddress) => {
      try {
        tradingWalletTransactionBuilder.buildUpdateExchangeTransactionDraft('0x300be6824289b48cb6726f99c16e51fb41d480da', invalidAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
  test.each(invalidAddresses)('raise InvalidEthereumAddress error if the exchangeAddress s not a valid ethereum address %s',
    (invalidAddress) => {
      try {
        tradingWalletTransactionBuilder.buildUpdateExchangeTransactionDraft('0x300be6824289b48cb6726f99c16e51fb41d480da', '0x300be6824289b48cb6726f99c16e51fb41d480da', invalidAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildGetExchangeTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    const getExchangeEncodedData = '0xc0668179'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory.build({
      from: personalWalletAddress,
      to: tradingWalletSmartContractAddress,
      data: getExchangeEncodedData,
    })

    const result = tradingWalletTransactionBuilder.buildGetExchangeTransactionDraft(
      personalWalletAddress,
      tradingWalletSmartContractAddress,
    )

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })
  const invalidAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress s not a valid ethereum address %s',
    (invalidAddress) => {
      try {
        tradingWalletTransactionBuilder.buildGetExchangeTransactionDraft(invalidAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
  test.each(invalidAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress s not a valid ethereum address %s',
    (invalidAddress) => {
      try {
        tradingWalletTransactionBuilder.buildGetExchangeTransactionDraft('0x300be6824289b48cb6726f99c16e51fb41d480da', invalidAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})

describe('buildGetOwnerTransactionDraft', () => {
  test('returns correct transaction object', () => {
    const personalWalletAddress = '0x300be6824289b48cb6726f99c16e51fb41d480da'
    const getExchangeEncodedData = '0xe7663079'
    const expectedTransactionObjectDraft = MockTransactionDraftFactory.build({
      from: personalWalletAddress,
      to: tradingWalletSmartContractAddress,
      data: getExchangeEncodedData,
    })

    const result = tradingWalletTransactionBuilder.buildGetOwnerTransactionDraft(
      personalWalletAddress,
      tradingWalletSmartContractAddress,
    )

    expect(result).toMatchObject(expectedTransactionObjectDraft)
  })
  const invalidAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
  test.each(invalidAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress s not a valid ethereum address %s',
    (invalidAddress) => {
      try {
        tradingWalletTransactionBuilder.buildGetOwnerTransactionDraft(invalidAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
  test.each(invalidAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress s not a valid ethereum address %s',
    (invalidAddress) => {
      try {
        tradingWalletTransactionBuilder.buildGetOwnerTransactionDraft('0x300be6824289b48cb6726f99c16e51fb41d480da', invalidAddress)
      } catch (e) {
        expect(e instanceof InvalidEthereumAddress).toBe(true)
      }
    })
})
