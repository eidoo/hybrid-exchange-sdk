const Web3 = require('web3')
const _ = require('lodash')
const ethereumUtil = require('ethereumjs-util')
const Tx = require('ethereumjs-tx')

const { EidooEthApiLib } = require('@eidoo/ethapi-lib')

const ITransactionLib = require('./ITransactionLib')
const log = require('../../logger')
const TransactionValidator = require('../../validators/TransactionValidator')

const { ethApi } = require('../../config')
const { GasEstimationError, NonceError, SignTransactionError,
  TransactionCallError, TransactionExecutionError } = require('../../utils/errors')
const { SmartContractInterfaceError } = require('../../utils/errors')
const { TransactionObjectDraftFactory } = require('../../models/Transaction')

const providerUrl = 'urlToProvider'
const web3Instance = new Web3(new Web3.providers.HttpProvider(providerUrl))
const ethApiLibClient = new EidooEthApiLib(ethApi)


/**
 * It gets the transaction Object from the transactionObjectDraft adding nonce and gas.
 *
 * @param {Object} TransactionLibInstance  The Transaction lib istance.
 * @param {Object} transactionDraftObject The transactionObjectDraft
 * @param {String} [nonce]                The nonce.
 * @param {Number} [gas]                 The gas limit value to set.
 * @param {String} [gasPrice]            The gas price value to set.
 */
async function getTransactionObject(transactionLibInstance, transactionDraftObject, nonce, gas, gasPrice) {
  let currentNonce = nonce
  let estimatedGas
  let estimatedGasPrice

  const transactionDraftErrors = transactionLibInstance.transactionValidator
    .validateTransactionDraft(transactionDraftObject)
  if (transactionDraftErrors) {
    throw new Error(transactionDraftErrors)
  }
  if (!nonce) {
    currentNonce = await transactionLibInstance.getNonce(transactionDraftObject.from)
  }

  transactionLibInstance.log.info(
    { transactionDraftObject, currentNonce, fn: 'getTransactionObject' }, 'Transaction Object params to estimate gas.',
  )

  if (!gas || !gasPrice) {
    const gasEstimation = await transactionLibInstance.getGasEstimation(transactionDraftObject)
    estimatedGas = gasEstimation.gas
    estimatedGasPrice = gasEstimation.gasPrice
  }

  const transactionObject = {
    ...transactionDraftObject,
    gas: parseInt(gas || estimatedGas, 10),
    gasPrice: parseInt(gasPrice || estimatedGasPrice, 10),
    nonce: currentNonce,
  }
  transactionLibInstance.transactionValidator.validateTransactionObject(transactionObject)

  return transactionObject
}

/**
   * Class representing the Transaction library interface.
   */
class TransactionLib extends ITransactionLib {
  /**
     * Create an Transaction library instance.
     * @param  {Object}    logger       The logger instance.
     * @param  {Object}    ethApiClient The ethApiClient instance.
     * @throws {TypeError}              If logger objecs is not defined.
     */
  constructor(web3 = web3Instance, logger = log, ethApiClient = ethApiLibClient) {
    super()
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!web3) {
      throw new TypeError(`Invalid "web3" value: ${web3}`)
    }
    this.web3 = web3

    if (!ethApiClient) {
      const errorMessage = `Invalid "ethApiClient" value: ${ethApiClient}`
      throw new TypeError(errorMessage)
    }

    this.ethApiClient = ethApiClient
    this.transactionValidator = new TransactionValidator(logger)
    this.transactionObjectDraftFactory = new TransactionObjectDraftFactory(this.transactionValidator)
  }

  /**
     * It gets nonce from input address.
     *
     * @param {String} address               The address used to get nonce.
     */
  async getNonce(address) {
    try {
      const { nonce } = await this.ethApiClient.getAddressNonceAsync(address)
      return nonce
    } catch (err) {
      this.log.error({ err, fn: 'getNonce' }, `Error getting nonce for ${address}`)
      throw new NonceError(err)
    }
  }

  /**
   * It builds the transaction draft.
   *
   * @param {Object} smartContractInstance        The smart contract istance.
   * @param {Object} transactionDraftParams       The transaction parameters.
   * @param {Object} transactionDraftParams.from  The from transaction parameter.
   * @param {Object} transactionDraftParams.to    The to transaction parameter.
   * @param {Object} transactionDraftParams.value The value transaction parameter.
   * @param {String} smartContractMethodName      The smart contract method to be called.
   * @param {Array}  smartContractParams          The smart contract array parameters to use as args to call smartContractMethod specified.
   *
   * @throws {SmartContractInterfaceError}        If the method args of the smart contract are not called as expected.
   */
  buildDraft(smartContractInstance, { from, to, value }, smartContractMethodName, smartContractParams) {
    let payloadData
    try {
      const smartContractMethod = _.get(smartContractInstance, smartContractMethodName)
      payloadData = smartContractParams ? smartContractMethod.getData(...smartContractParams)
        : smartContractMethod.getData()
      this.log.debug({
        smartContractMethod,
        payloadData,
        smartContractParams,
        smartContractMethodName,
      }, 'Retrieving payload data to build transaction object draft')
    } catch (err) {
      this.log.error({ err, fn: 'buildDraft' }, 'Transaction draft not created.')
      throw new SmartContractInterfaceError(err)
    }

    const transactionDraftParams = {
      from,
      to,
      data: payloadData,
      value: value ? this.web3.toHex(value) : value,
    }
    const transactionObjectDraft = this.transactionObjectDraftFactory.create(transactionDraftParams)
    this.log.debug({ transactionObjectDraft, transactionDraftParams, fn: 'buildDraft' },
      'Transaction draft created correctly.')

    return transactionObjectDraft
  }

  /**
 * It get the gas estimation of doing the trnansaction
 *
 * @param {Object} transactionObject       The transaction object.
 * @param {Object} transactionObject.data  The transaction object.
 * @param {Object} transactionObject.from  The transaction object.
 * @param {Object} transactionObject.nonce The transaction object.
 * @param {Object} transactionObject.to    The transaction object.
 * @param {Object} transactionObject.value The transaction object.
 *
 */
  async getGasEstimation(transactionObject) {
    try {
      const { gas, gasPrices } = await this.ethApiClient
        .getEstimateGasAsync({ transactionObject })

      const { medium: gasPrice } = gasPrices

      return { gas, gasPrice }
    } catch (err) {
      this.log.error({ err, transactionObject, fn: 'getGasEstimation' }, 'Error getting gas.')
      throw new GasEstimationError(err)
    }
  }

  /**
   * It signs the transaction object in order to be executed.
   *
   * @param {Object} transactionDraftObject The transactionDraftObject.
   * @param {String} privateKey             The private key.
   * @param {Sting}  nonce                  The nonce.
   * @param {Number} gas                    The gas limit.
   * @param {String} gasPrice               The gas price.
   *
   * @throws {SignTransactionError}        If there was an error during build or sign transactionObject.
   */
  async sign(transactionDraftObject, privateKey, nonce, gas, gasPrice) {
    try {
      // TODO: add validation for privateKey. Handle it in the user story about password management.
      const privateKeyWithPrefix = ethereumUtil.addHexPrefix(privateKey)
      const privateKeyBuffered = ethereumUtil.toBuffer(privateKeyWithPrefix)
      const transactionObject = await getTransactionObject(this, transactionDraftObject, nonce, gas, gasPrice)
      this.log.debug({ transactionObject }, 'Transaction Object.')
      const rawTransaction = new Tx(transactionObject)
      rawTransaction.sign(privateKeyBuffered)

      const signedTransactionData = ethereumUtil.bufferToHex(rawTransaction.serialize())

      this.log.info({ transactionObject }, 'Transaction signed correctly.')
      return signedTransactionData
    } catch (err) {
      this.log.error({ err, fn: 'sign', transactionDraftObject }, 'Error during transaction signing.')
      throw new SignTransactionError(err)
    }
  }

  /**
   * It executes the raw transaction.
   * @param {String} signedTransactionData The signed transaction data.
   *
   * @throws {TransactionExecutionError}   If there was an error during transaction execution.
   */
  async execute(signedTransactionData) {
    try {
      const transactionPayload = await this.ethApiClient.sendRawTransactionAsync({ rawTx: signedTransactionData })
      this.log.info({ signedTransactionData, hash: transactionPayload.hash }, 'Transaction executed correctly.')
      return transactionPayload.hash
    } catch (err) {
      this.log.error({ err, fn: 'execute', signedTransactionData }, 'Error executing transaction.')
      throw new TransactionExecutionError(err)
    }
  }

  /**
   * It runs a transaction message call.
   * @param {Object} transactionObjectDraft
   *
   * @throws {TransactionCallError}   If there was an error during transaction execution.
   */
  async call(transactionObjectDraft) {
    try {
      const errors = this.transactionValidator.validateTransactionDraft(transactionObjectDraft)
      if (errors) {
        throw new Error(errors)
      }
      const transactionObject = Object.assign({}, transactionObjectDraft)

      const responsePayload = await this.ethApiClient
        .transactionCallAsync({ transactionObject })
      this.log.info({ fn: 'call', transactionObject, responsePayload }, 'Transaction call done.')
      return responsePayload
    } catch (err) {
      this.log.error({ err, fn: 'call', transactionObjectDraft }, 'Error executing transaction call.')
      throw new TransactionCallError(err)
    }
  }

  async getTransactionReceipt(hash, fromAddress) {
    try {
      const { transactions } = await this.ethApiClient.getAccountTxsDetailsAsync(fromAddress)

      const transactionReceipt = _.find(transactions, item => item.transactionReceipt.transactionHash === hash)
      this.log.info({
        fn: 'getTransactionReceipt',
        transactionReceipt,
        hash,
        fromAddress,
      }, 'Retrieve transaction receipt.')

      return transactionReceipt || null
    } catch (err) {
      throw new Error(`Error retriving transaction Receipt: ${hash}`)
    }
  }
}

module.exports = TransactionLib
