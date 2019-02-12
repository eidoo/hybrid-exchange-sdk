const BaseService = require('./BaseService')
const erc20TokenAbi = require('../../abi/erc20Token.json')
const log = require('../logger')
const { SmartContractInterfaceError } = require('../utils/errors')
const { TransactionObjectDraftFactory } = require('../models/Transaction')
const TransactionValidator = require('../validators/TransactionValidator')
const { TransactionLib } = require('../lib/TransactionLib')

const transactionLibInstance = new TransactionLib()

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
  constructor(web3, { erc20TokenSmartContractAbi = erc20TokenAbi, erc20TokenSmartContractAddress },
    transactionLib = transactionLibInstance, logger = log) {
    super(logger, web3)
    const transactionValidator = new TransactionValidator(logger)
    this.transactionObjectDraftFactory = new TransactionObjectDraftFactory(transactionValidator)
    this.transactionLib = transactionLib

    if (!erc20TokenSmartContractAddress) {
      const errorMessage = `Invalid "erc20TokenSmartContractAddress" value: ${erc20TokenSmartContractAddress}`
      this.throwError(errorMessage)
    }
    this.smartContractTokenAddress = erc20TokenSmartContractAddress

    if (!erc20TokenSmartContractAbi) {
      const errorMessage = `Invalid "erc20TokenSmartContractAbi" value: ${erc20TokenSmartContractAbi}`
      this.throwError(errorMessage)
    }
    this.erc20TokenSmartContract = this.web3.eth.contract(erc20TokenSmartContractAbi)
      .at(erc20TokenSmartContractAddress)
  }

  /**
   * It gets the transaction object to be used for approve token trasfer on trading wallet.
   * In order to approve token trasfer the `approve` method of erc20 token smart contract
   * should be called.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {Number} quantity              The wei quantity of ether to deposit.
   * @param {String} tradingWalletAddress  The trading wallet address.
   *
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   * @throws {SmartContractInterfaceError} If exchangeSmartContractInstance is not defined as expected.
   */
  getApproveTrasferTransactionDraft(personalWalletAddress, tradingWalletAddress, quantity) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    let payloadData
    try {
      payloadData = this.erc20TokenSmartContract.approve.getData(tradingWalletAddress, quantity)
    } catch (err) {
      throw new SmartContractInterfaceError()
    }

    const transactionDraftParams = {
      from: personalWalletAddress,
      to: this.smartContractTokenAddress,
      data: payloadData,
    }
    const transactionObjectDraft = this.transactionObjectDraftFactory.create(transactionDraftParams)
    return transactionObjectDraft
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
    const transactionObjectDraft = this.getApproveTrasferTransactionDraft(personalWalletAddress,
      tradingWalletAddress, quantity)
    const signedTransactionData = await this.getApproveTrasferSignedDataAsync(transactionObjectDraft, privateKey)
    const transactionHash = await this.transactionLib.execute(signedTransactionData)
    return transactionHash
  }
}

module.exports = Erc20TokenService
