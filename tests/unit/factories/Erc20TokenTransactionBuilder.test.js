const Web3 = require('web3')
const sandbox = require('sinon').createSandbox()
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')

const logger = require('../../../src/logger')
const erc20Token = require('../../../abi/erc20Token')
const MockTransactionDraftFactory = require('../../factories/MockTransactionDraftFactory')
const Erc20TokenTransactionBuilder = require('../../../src/factories/Erc20TokenTransactionBuilder')
const { InvalidEthereumAddress } = require('../../../src/utils/errors')
const { TransactionLib } = require('../../../src/lib/TransactionLib')

const providerUrl = 'FAKE_PROVIDER_URL'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))


const ethApiLibConf = {
  host: 'FAKE_URL',
  port: 'FAKE_PORT',
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

afterEach(() => {
  sandbox.restore()
})

describe('Erc20TokenTransactionBuilder', () => {
  const tradingWalletSmartContractAddress = '0x0ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba'
  const personalWalletAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
  const quantity = '500000000000000000000'
  describe('buildApproveTrasferTransactionDraft', () => {
    test('returns correct transaction object', () => {
      const encodedDataForApproveMethod = '0x095ea7b30000000000000000000000000ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba00000000000000000000000000000000000000000000001b1ae4d6e2ef500000'

      const expectedTransactionObjectDraft = MockTransactionDraftFactory
        .build({ from: personalWalletAddress, data: encodedDataForApproveMethod, to: erc20TokenSmartContractAddress })

      const result = erc20TokenTransactionBuilder.buildApproveTrasferTransactionDraft(
        personalWalletAddress,
        tradingWalletSmartContractAddress,
        quantity,
      )

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })

    const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
    test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress is not a valid ethereum address %s',
      (invalidPersonalWalletAddress) => {
        try {
          erc20TokenTransactionBuilder.buildApproveTrasferTransactionDraft(
            invalidPersonalWalletAddress,
            tradingWalletSmartContractAddress,
            quantity,
          )
        } catch (e) {
          expect(e instanceof InvalidEthereumAddress).toBe(true)
        }
      })

    const invalidTradingWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
    test.each(invalidTradingWalletAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress is not a valid ethereum address %s',
      (invalidTradingWalletAddress) => {
        try {
          erc20TokenTransactionBuilder.buildApproveTrasferTransactionDraft(
            personalWalletAddress,
            invalidTradingWalletAddress,
            quantity,
          )
        } catch (e) {
          expect(e instanceof InvalidEthereumAddress).toBe(true)
        }
      })
  })

  describe('buildGetAllowanceTransactionDraft', () => {
    test('returns correct transaction object', () => {
      const encodedDataForApproveMethod = '0xdd62ed3e000000000000000000000000d57cb05ef66d2c7c952656ddf5096e02281e3d2e0000000000000000000000000ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba'

      const expectedTransactionObjectDraft = MockTransactionDraftFactory
        .build({ from: personalWalletAddress, data: encodedDataForApproveMethod, to: erc20TokenSmartContractAddress })

      const result = erc20TokenTransactionBuilder.buildGetAllowanceTransactionDraft(
        personalWalletAddress,
        tradingWalletSmartContractAddress,
        quantity,
      )

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })

    const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
    test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress is not a valid ethereum address %s',
      (invalidPersonalWalletAddress) => {
        try {
          erc20TokenTransactionBuilder.buildGetAllowanceTransactionDraft(
            invalidPersonalWalletAddress,
            tradingWalletSmartContractAddress,
            quantity,
          )
        } catch (e) {
          expect(e instanceof InvalidEthereumAddress).toBe(true)
        }
      })

    const invalidTradingWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
    test.each(invalidTradingWalletAddresses)('raise InvalidEthereumAddress error if the tradingWalletAddress is not a valid ethereum address %s',
      (invalidTradingWalletAddress) => {
        try {
          erc20TokenTransactionBuilder.buildGetAllowanceTransactionDraft(
            personalWalletAddress,
            invalidTradingWalletAddress,
            quantity,
          )
        } catch (e) {
          expect(e instanceof InvalidEthereumAddress).toBe(true)
        }
      })
  })

  describe('buildGetBalanceOfTransactionDraft', () => {
    test('returns correct transaction object', () => {
      const encodedDataForApproveMethod = '0x70a08231000000000000000000000000d57cb05ef66d2c7c952656ddf5096e02281e3d2e'

      const expectedTransactionObjectDraft = MockTransactionDraftFactory
        .build({ from: personalWalletAddress, data: encodedDataForApproveMethod, to: erc20TokenSmartContractAddress })

      const result = erc20TokenTransactionBuilder.buildGetBalanceOfTransactionDraft(
        personalWalletAddress,
        tradingWalletSmartContractAddress,
        quantity,
      )

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })

    const invalidPersonalWalletAddresses = [{}, [], 'I am not a valid ethereum address', 1, undefined, NaN, '0xNOOP']
    test.each(invalidPersonalWalletAddresses)('raise InvalidEthereumAddress error if the personalWalletAddress is not a valid ethereum address %s',
      (invalidPersonalWalletAddress) => {
        try {
          erc20TokenTransactionBuilder.buildGetBalanceOfTransactionDraft(invalidPersonalWalletAddress)
        } catch (e) {
          expect(e instanceof InvalidEthereumAddress).toBe(true)
        }
      })
  })
})
