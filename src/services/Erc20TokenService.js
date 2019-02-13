const Web3 = require('web3')

const BaseService = require('./BaseService')
const log = require('../logger')

const { TransactionLib } = require('../lib/TransactionLib')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const transactionLibInstance = new TransactionLib(web3, log)

async function transactionExecutor(erc20TokenServiceInstance, privateKey,
  transactionDraftBuilderName, transactionParams, { gasPrice, gas } = {}, nonce) {
  const transactionObjectDraft = erc20TokenServiceInstance.erc20TokenTransactionBuilder[transactionDraftBuilderName](
    ...transactionParams,
  )
  const transactionSignedHash = await erc20TokenServiceInstance.transactionLib.sign(
    transactionObjectDraft,
    privateKey,
    nonce,
    gas,
    gasPrice,
  )

  const transactionHash = await erc20TokenServiceInstance.transactionLib.execute(transactionSignedHash)
  return transactionHash
}

/**
 * Class representing a service to build sign and execute transaction related to a Erc20 token.
 * @extends BaseService
 */
class Erc20TokenService extends BaseService {
  /**
     * Create a new instance of Erc20TokenService.
     *
     * @param  {Object}    web3                                                   The web3 instance.
     * @param  {Object}    erc20TokenSmartContract                                The exchange smart contract object.
     * @param  {Object}    erc20TokenSmartContract.erc20TokenSmartContractAddress The exchange smart contract address.
     * @param  {Object}    [erc20TokenSmartContract.erc20TokenSmartContractAbi]   The exchange smart contract abi interface.
     * @param  {Object}    [transactionLib]                                       The transaction lib istance.
     * @param  {Object}    [logger]                                               The logger instance.
     * @throws {TypeError}                                                        If exchangeSmart contract objecs is not initialized as expected.
     */
  constructor(web3, transactionLib = transactionLibInstance,
    erc20TokenTransactionBuilder, logger = log) {
    super(logger, web3)

    if (!transactionLib) {
      const errorMessage = `Invalid "transactionLib" value: ${transactionLib}`
      throw new TypeError(errorMessage)
    }
    this.transactionLib = transactionLib

    if (!erc20TokenTransactionBuilder) {
      const errorMessage = `Invalid "erc20TokenTransactionBuilder" value: ${erc20TokenTransactionBuilder}`
      throw new TypeError(errorMessage)
    }
    this.erc20TokenTransactionBuilder = erc20TokenTransactionBuilder
  }

  /**
   * It gets the signed transaction data to execute the transaction to withdraw ehter/token.
   *
   * @param {Object} transactionDraftObject        The transactionDraftObject.
   * @param {Object} transactionDraftObject.from   The from transaction parameter.
   * @param {Object} transactionDraftObject.to     The to transaction parameter.
   * @param {Object} transactionDraftObject.value] The value transaction parameter.
   * @param {Object} transactionDraftObject.data   The data transaction parameter.
   * @param {String} privateKey                    The private key.
   *
   * @throws {SignTransactionError}                If there was an error signing the transaction to create the wallet.
   */
  async getApproveTrasferSignedDataAsync(transactionDraftObject, privateKey) {
    const signedTransactionData = await this.transactionLib.sign(transactionDraftObject, privateKey)
    return signedTransactionData
  }

  /**
   * It approves the trasfer of token quantity from trading to pesonal wallet.
   *
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {Number} quantity              The quantity of token to withdraw.
   * @param {String} tokenAddress          The address of the token asset to withdraw.
   * @param {String} privateKey            The private key.
   */
  async approveTrasferAsync(personalWalletAddress, tradingWalletAddress, quantity, privateKey) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    const transactionParams = [personalWalletAddress, tradingWalletAddress, quantity]
    const transactionDraftBuilderName = 'buildApproveTrasferTransactionDraft'
    const transactionHash = transactionExecutor(this, privateKey, transactionDraftBuilderName, transactionParams)
    return transactionHash
  }
}

module.exports = Erc20TokenService
