const { TradingWalletNotFoundError } = require('../utils/errors')
const BaseTransactionService = require('./BaseTransactionService')

const ETH_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const ETH_ADDRESS_LENGTH = 40
const ETH_ADDRESS_LENGTH_256B = 66

/**
 * Class representing a service to create trading, deposit and withdraw token or ether.
 * @extends BaseTransactionService
 */
class TradingWalletService extends BaseTransactionService {
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
    const transactionHash = this.transactionExecutor(privateKey, transactionDraftBuilderName, transactionParams)

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
    const transactionHash = this.transactionExecutor(privateKey, transactionDraftBuilderName, transactionParams)

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
    const transactionHash = this.transactionExecutor(privateKey, transactionDraftBuilderName, transactionParams)

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
    const transactionHash = this.transactionExecutor(
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
      const transactionObjectDraft = this.transactionBuilder
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
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} tokenAddress          The address of the owned asset.
   * @param {String} tradingWalletAddress  The trading wallet address address.
   * @throws {InvalidEthereumAddress}      If personalWalletAddress or the tokenAddress is not a valid ethereum address.
   */
  async getAssetBalanceAsync(personalWalletAddress, tokenAddress, tradingWalletAddress = null) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tokenAddress)

    let retrievedTradingWalletAddress = tradingWalletAddress

    if (!tradingWalletAddress) {
      retrievedTradingWalletAddress = await this.getTradingWalletAddressAsync(personalWalletAddress)
    }

    if (retrievedTradingWalletAddress === null) {
      this.log.error(
        { fn: 'getAssetBalanceAsync' },
        `tradingWallet not found for EOA:${personalWalletAddress}`,
      )
      throw new TradingWalletNotFoundError(`No trading wallet address for: ${personalWalletAddress}`)
    }

    const transactionObjectDraft = this.transactionBuilder.buildAssetBalanceTransactionDraft(
      personalWalletAddress,
      retrievedTradingWalletAddress,
      tokenAddress,
    )

    const assetBalance = await this.transactionLib.call(transactionObjectDraft)

    return this.web3.toBigNumber(assetBalance).toString(10)
  }

  /**
   * It updates the trading wallet exchange smart contract addrress reference.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {String} exchangeAddress       The personal wallet address (EOA).
   * @param {String} privateKey            The private key.
   *
   * @throws {InvalidEthereumAddress}      If no valid ethereum addresses are present.
   * @throws {SignTransactionError}        If there was an error signing the transaction to create the wallet.
   * @throws {TransactionExecutionError}   If there was an error during the execution of the transaction.
   */
  async updateExchange(personalWalletAddress, tradingWalletAddress, exchangeAddress, privateKey) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)
    this.checkEtherumAddress(exchangeAddress)

    const transactionParams = [personalWalletAddress, tradingWalletAddress, exchangeAddress]
    const transactionDraftBuilderName = 'buildUpdateExchangeTransactionDraft'
    const transactionHash = this.transactionExecutor(
      privateKey,
      transactionDraftBuilderName,
      transactionParams,
    )
    return transactionHash
  }
}

module.exports = TradingWalletService
