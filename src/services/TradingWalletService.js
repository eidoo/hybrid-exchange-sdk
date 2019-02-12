const Web3 = require('web3')

const { TransactionLib } = require('../lib/TransactionLib')
const { TradingWalletNotFoundError } = require('../utils/errors')
const BaseService = require('./BaseService')
const log = require('../logger')
const TradingWalletTransactionBuilder = require('../factories/TradingWalletTransactionBuilder')

const ETH_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ETH_ADDRESS_LENGTH = 40
const ETH_ADDRESS_LENGTH_256B = 66

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const transactionLibInstance = new TransactionLib(web3, log)

const tradingWalletTransactionBuilderInstance = new TradingWalletTransactionBuilder(web3)

async function transactionExecutor(tradingWalletServiceInstance, privateKey,
  transactionDraftBuilderName, transactionParams, { gasPrice, gas } = {}, nonce) {
  const transactionObjectDraft = tradingWalletServiceInstance
    .tradingWalletTransactionBuilder[transactionDraftBuilderName](
      ...transactionParams,
    )
  const transactionSignedHash = await tradingWalletServiceInstance.transactionLib.sign(
    transactionObjectDraft,
    privateKey,
    nonce,
    gas,
    gasPrice,
  )

  const transactionHash = await tradingWalletServiceInstance.transactionLib.execute(transactionSignedHash)
  return transactionHash
}

/**
 * Class representing a service to create trading, deposit and withdraw token or ether.
 * @extends BaseService
 */
class TradingWalletService extends BaseService {
  /**
   * Create a new instance of TradingWalletService.
   *
   * @param  {Object}    web3                              The web3 instance.
   * @param  {Object}    [transactionLib]                  The transaction lib istance.
   * @param  {Object}    [tradingWalletTransactionBuilder] The trading wallet transaction builder lib istance.
   * @param  {Object}    [logger]                          The logger instance.
   * @throws {TypeError}                                   If exchangeSmart contract objecs is not initialized as expected.
   */
  constructor(web3, transactionLib = transactionLibInstance,
    tradingWalletTransactionBuilder = tradingWalletTransactionBuilderInstance, logger = log) {
    super(logger, web3)

    if (!transactionLib) {
      const errorMessage = `Invalid "transactionLib" value: ${transactionLib}`
      this.throwError(errorMessage)
    }
    this.transactionLib = transactionLib

    if (!tradingWalletTransactionBuilder) {
      const errorMessage = `Invalid "tradingWalletTransactionBuilder" value: ${tradingWalletTransactionBuilder}`
      this.throwError(errorMessage)
    }
    this.tradingWalletTransactionBuilder = tradingWalletTransactionBuilder
  }

  /**
   * It gets the signed transaction data to execute the transaction.
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
  async getSignedTransactionData(transactionDraftObject, privateKey) {
    const signedTransactionData = await this.transactionLib.sign(transactionDraftObject, privateKey)
    return signedTransactionData
  }

  /**
   * It creates a trading wallet.
   *
   * @param   {String} personalWalletAddress The personal wallet address (EOA).
   * @param   {String} privateKey            The private key.

   * @throws {InvalidEthereumAddress}        If personalWalletAddress is not a valid ethereum address.
   * @throws {SignTransactionError}          If there was an error signing the transaction to create the wallet.
   * @throws {TransactionExecutionError}     If there was an error during the execution of the transaction.
   *
   * @returns {String}                       The transaction hash.
   */
  async createWalletAsync(personalWalletAddress, privateKey) {
    this.checkEtherumAddress(personalWalletAddress)
    const transactionParams = [personalWalletAddress]
    const transactionDraftBuilderName = 'buildCreateWalletTransactionDraft'
    const transactionHash = transactionExecutor(this, privateKey, transactionDraftBuilderName, transactionParams)

    return transactionHash
  }

  /**
   * It deposit ether to trading wallet.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {Number} quantity              The quantity of token to deposit.
   * @param {String} tokenAddress          The address of the token asset to deposit.
   * @param {String} privateKey            The private key.
   *
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   * @throws {SignTransactionError}        If there was an error signing the transaction to create the wallet.
   * @throws {TransactionExecutionError}   If there was an error during the execution of the transaction.
   */
  async depositEtherAsync(personalWalletAddress, tradingWalletAddress, quantity, privateKey) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    const transactionParams = [personalWalletAddress, tradingWalletAddress, quantity]
    const transactionDraftBuilderName = 'buildDepositEtherTransactionDraft'
    const transactionHash = transactionExecutor(this, privateKey, transactionDraftBuilderName, transactionParams)

    return transactionHash
  }

  /**
   * It deposit token to trading wallet.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {Number} quantity              The quantity of token to deposit.
   * @param {String} tokenAddress          The address of the token asset to deposit.
   * @param {String} privateKey            The private key.
   *
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   * @throws {SignTransactionError}        If there was an error signing the transaction to create the wallet.
   * @throws {TransactionExecutionError}   If there was an error during the execution of the transaction.
   */
  async depositTokenAsync(personalWalletAddress, tradingWalletAddress, quantity, tokenAddress, privateKey) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    const transactionParams = [personalWalletAddress, tradingWalletAddress, quantity, tokenAddress]
    const transactionDraftBuilderName = 'buildDepositTokenTransactionDraft'
    const transactionHash = transactionExecutor(this, privateKey, transactionDraftBuilderName, transactionParams)

    return transactionHash
  }

  /**
   * It withdraw token from trading wallet.
   *
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {Number} quantity              The quantity of token to withdraw.
   * @param {String} tokenAddress          The address of the token asset to withdraw.
   * @param {String} privateKey            The private key.
   *
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   * @throws {SignTransactionError}        If there was an error signing the transaction to create the wallet.
   * @throws {TransactionExecutionError}   If there was an error during the execution of the transaction.
   */
  async withdrawAsync(personalWalletAddress, tradingWalletAddress, quantity, tokenAddress, privateKey) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    const transactionParams = [personalWalletAddress, tradingWalletAddress, quantity, tokenAddress]
    const transactionDraftBuilderName = 'buildWithdrawTransactionDraft'
    const gas = 100000
    const transactionHash = transactionExecutor(
      this,
      privateKey,
      transactionDraftBuilderName,
      transactionParams,
      { gas },
    )
    return transactionHash
  }

  /**
   * It gets the trading wallet smart contract address from personal wallet address.
   * The `userAccountToWallet_` method of exchange smart contract should be called to
   * retrieve trading waller smart contract address.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   */
  async getTradingWalletAddressAsync(personalWalletAddress) {
    this.checkEtherumAddress(personalWalletAddress)
    let tradingWalletAddress

    try {
      const transactionObjectDraft = this.tradingWalletTransactionBuilder
        .buildTradingWalletAddressTransactionDraft(personalWalletAddress)
      const tradingWalletAddressFromCall = await this.transactionLib.call(transactionObjectDraft)
      const tradingWalletAddressWellFormed = `0x${tradingWalletAddressFromCall.substr(
        ETH_ADDRESS_LENGTH_256B - ETH_ADDRESS_LENGTH,
      )}`
      tradingWalletAddress = tradingWalletAddressWellFormed
    } catch (err) {
      this.log.error({ err, fn: 'getTradingWalletAddressAsync' },
        `Error getting tradingWallet for EOA:${personalWalletAddress}`)
      throw new Error(`Error retrieving tradingWalletAddress from EOA: ${personalWalletAddress}`)
    }

    if (tradingWalletAddress === ETH_ZERO_ADDRESS) {
      this.log.debug(
        { fn: 'getTradingWalletAddressAsync' },
        `tradingWallet not found for EOA:${personalWalletAddress}`,
      )
      return null
    }

    return tradingWalletAddress
  }

  /**
   * It gets the trading wallet asset balance.
   * The `tokenBalances_` method of trading wallet smart contract should be called to
   * retrieve the amount of the owned asset.
   *
   * @param {String} personalWalletAddress The personal wallet address, owner of the  (EOA).
   * @param {String} tokenAddress          The address of the owned asset.
   * @throws {InvalidEthereumAddress}      If personalWalletAddress or the tokenAddress is not a valid ethereum address.
   */
  async getAssetBalanceAsync(personalWalletAddress, tokenAddress) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tokenAddress)

    const tradingWalletAddress = await this.getTradingWalletAddressAsync(personalWalletAddress)
    if (!tradingWalletAddress) {
      this.log.error(
        { fn: 'getAssetBalanceAsync' },
        `tradingWallet not found for EOA:${personalWalletAddress}`,
      )
      throw new TradingWalletNotFoundError(`No trading wallet address for: ${personalWalletAddress}`)
    }

    const transactionObjectDraft = this.tradingWalletTransactionBuilder.buildAssetBalanceTransactionDraft(
      personalWalletAddress,
      tradingWalletAddress,
      tokenAddress,
    )

    const assetBalance = await this.transactionLib.call(transactionObjectDraft)

    return this.web3.toBigNumber(assetBalance).toString(10)
  }
}

module.exports = TradingWalletService
