const Web3 = require('web3')

const BaseTransactionService = require('./BaseTransactionService')
const log = require('../logger')

const { TransactionLib } = require('../lib/TransactionLib')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const transactionLibInstance = new TransactionLib(web3, log)

/**
 * Class representing a service to build sign and execute transaction related to a Erc20 token.
 * @extends BaseTransactionService
 */
class Erc20TokenService extends BaseTransactionService {
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
    transactionBuilder, logger = log) {
    super(logger, web3, transactionLib, transactionBuilder)
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
    const transactionHash = this.transactionExecutor(privateKey, transactionDraftBuilderName, transactionParams)
    return transactionHash
  }
}

module.exports = Erc20TokenService
