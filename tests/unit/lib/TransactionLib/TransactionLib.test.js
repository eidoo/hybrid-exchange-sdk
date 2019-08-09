/* eslint-env node, jest */
const { EidooEthApiLib } = require('@eidoo/ethapi-lib')
const Web3 = require('web3')
const sandbox = require('sinon').createSandbox()

const logger = require('../../../../src/logger')
const { GasEstimationError, NonceError,
  SignTransactionError, TransactionCallError, TransactionExecutionError } = require('../../../../src/utils/errors')
const MockTransactionDraftFactory = require('../../../factories/MockTransactionDraftFactory')

const { TransactionObjectDraft } = require('../../../../src/models/Transaction')
const { TransactionLib } = require('../../../../src/lib/TransactionLib')


const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
const ethApiLibConf = {
  host: 'http:host.eidoo.io',
  port: 8080,
  useTLS: false,
}
const ethApiClient = new EidooEthApiLib(ethApiLibConf)
const privateKey = '70f3b9e0f71cda37356c605c88cd93eef0813795e75ce78c293856f1889403b6'


let transactionLib

beforeEach(() => {
  transactionLib = new TransactionLib({ web3, logger, ethApiClient })
})

afterEach(() => {
  sandbox.restore()
})

describe('sign', () => {
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
  test('returns correct signed hash', async () => {
    sandbox.stub(ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiClient, 'getEstimateGasAsync').returns(gasEstimationResponse)

    const fromEthereumAddress = '0xd57cb05ef66d2c7c952656ddf5096e02281e3d2e'
    const toEtherumAddress = '0x0ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba'
    const encodedData = '0xf3fef3a3000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e00000000000000000000000000000000000000000000003635c9adc5dea00000'
    const value = '0x0'
    const transactionDraft = new TransactionObjectDraft(encodedData, fromEthereumAddress, toEtherumAddress, value)
    const expectedHash = '0xf8a8821130826333825208940ba8f4ca1ba7a76a9da66e1629c24eb432aa96ba80b844f3fef3a3000000000000000000000000d67cb05ef66d1c7c952656ddf5096e02281e3d2e00000000000000000000000000000000000000000000003635c9adc5dea000001ba046b3f193e1ce647573a082f499b0020532f49b791e25d8c87fe76a267940bed8a05494d2a430364f2dce776631b8df6cbde0112eaeb997c834ce1fd31dfe3a2945'

    const hash = await transactionLib.sign(transactionDraft, privateKey)

    expect(hash).toEqual(expectedHash)
  })

  test('raise SignTransactionError if getNonce raise NonceError.', async () => {
    sandbox.stub(ethApiClient, 'getAddressNonceAsync').throws(new NonceError('Nonce error'))
    const transactionDraft = MockTransactionDraftFactory.build()
    return expect(transactionLib.sign(transactionDraft, privateKey)).rejects.toBeInstanceOf(SignTransactionError)
  })

  test('raise SignTransactionError if getEstimateGasAsync raise GasEstimationError.', async() => {
    sandbox.stub(ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
    sandbox.stub(ethApiClient, 'getEstimateGasAsync').throws(new GasEstimationError('Gas price is equal to zero'))
    const transactionDraft = MockTransactionDraftFactory.build()
    return expect(transactionLib.sign(transactionDraft, privateKey)).rejects.toBeInstanceOf(SignTransactionError)
  })

  const badGasValues = [{
    gas: 21000,
    gasPrices: {
      high: '0',
      medium: '0',
      low: '0',
    },
  },
  {
    gas: 0,
    gasPrices: {
      high: '0',
      medium: '25395',
      low: '0',
    },
  }]
  test.each(badGasValues)('raise SignTransactionError since gas value is %o',
    async(badGasValue) => {
      sandbox.stub(ethApiClient, 'getAddressNonceAsync').returns(nonceResponse)
      sandbox.stub(ethApiClient, 'getEstimateGasAsync').returns(badGasValue)
      const transactionDraft = MockTransactionDraftFactory.build()
      return expect(transactionLib.sign(transactionDraft, privateKey)).rejects.toBeInstanceOf(SignTransactionError)
    })

  const transactionDraftObjectFields = ['data', 'from', 'to']
  test.each(transactionDraftObjectFields)('raise SignTransactionError if transactionDraftObject field "%s" is not valid.',
    async(transactionDraftObjectField) => {
      const transactionDraftObjectParams = {}
      transactionDraftObjectParams[transactionDraftObjectField] = undefined
      const transactionDraft = MockTransactionDraftFactory.build(transactionDraftObjectParams)
      return expect(transactionLib.sign(transactionDraft, privateKey)).rejects.toBeInstanceOf(SignTransactionError)
    })
})

describe('execute', () => {
  test('call ethApiClient.sendRawTransaction as expected', async () => {
    const transactionSignedData = '0xdsaib234ihfksanda'
    const sendRawTransactionAsyncMock = sandbox.stub(ethApiClient, 'sendRawTransactionAsync')
      .returns({ hash: transactionSignedData })

    await transactionLib.execute(transactionSignedData)

    expect(sendRawTransactionAsyncMock.calledOnceWithExactly({ rawTx: transactionSignedData })).toBe(true)
  })
  test('raise TransactionExecutionError if ethApiClient.sendRawTransaction raise an Error', async () => {
    sandbox.stub(ethApiClient, 'sendRawTransactionAsync').throws(new Error())
    const transactionSignedData = '0xdsaib234ihfksanda'

    return expect(transactionLib.execute(transactionSignedData)).rejects.toBeInstanceOf(TransactionExecutionError)
  })

  const transactionDraftObjectFields = ['data', 'from', 'to']
  test.each(transactionDraftObjectFields)('raise SignTransactionError if transactionDraftObject field "%s" is not valid.',
    (transactionDraftObjectField) => {
      const transactionDraftObjectParams = {}
      transactionDraftObjectParams[transactionDraftObjectField] = undefined
      const transactionDraft = MockTransactionDraftFactory.build(transactionDraftObjectParams)
      return expect(transactionLib.sign(transactionDraft, privateKey)).rejects.toBeInstanceOf(SignTransactionError)
    })
})


describe('call', () => {
  test('call ethApiClient.transactionCallAsync as expected', async () => {
    const transactionObjectDraft = MockTransactionDraftFactory.build()

    const transactionCallAsyncMock = sandbox.stub(ethApiClient, 'transactionCallAsync')
      .returns()

    await transactionLib.call(transactionObjectDraft)

    expect(transactionCallAsyncMock.calledOnceWithExactly({ transactionObject: transactionObjectDraft })).toBe(true)
  })
  test('raise TransactionCallError if ethApiClient.transactionCallAsync raise an Error', async () => {
    sandbox.stub(ethApiClient, 'transactionCallAsync').throws(new Error())
    const transactionObjectDraft = MockTransactionDraftFactory.build()

    return expect(transactionLib.call({ transactionObject: transactionObjectDraft })).rejects.toBeInstanceOf(TransactionCallError)
  })

  const transactionDraftObjectFields = ['data', 'from', 'to']
  test.each(transactionDraftObjectFields)('raise TransactionCallError if transactionDraftObject field "%s" is not valid.',
    (transactionDraftObjectField) => {
      const transactionDraftObjectParams = {}
      transactionDraftObjectParams[transactionDraftObjectField] = undefined
      const transactionObjectDraft = MockTransactionDraftFactory.build(transactionDraftObjectParams)
      return expect(transactionLib.call(transactionObjectDraft)).rejects.toBeInstanceOf(TransactionCallError)
    })
})
