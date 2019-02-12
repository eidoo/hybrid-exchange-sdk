const ethereumUtil = require('ethereumjs-util')

const exchangeScAbi = require('../../abi/exchange.json')
const log = require('../logger')
const tradingScAbi = require('../../abi/tradingWallet.json')

const { InvalidEthereumAddress } = require('../utils/errors')
const { TransactionLib } = require('../lib/TransactionLib')
const { exchange } = require('../config')

const transactionLibInstance = new TransactionLib()

/**
   * Class representing a factory to build draft transaction object.
   * @param  {Object} web3                                                 The web3 instance.
   * @param  {Object} [exchangeSmartContract]                              The exchange smart contract object.
   * @param  {Object} [exchangeSmartContract.exchangeSmartContractAddress] The exchange smart contract address.
   * @param  {Object} [exchangeSmartContract.exchangeSmartContractAbi]     The exchange smart contract abi interface.
   * @param  {Object} [tradingWalletSmartContractAbi]                      Thetrading wallet smart contract abi.
   * @param  {Object} [transactionLib]                                     The transaction lib istance.
   * @param  {Object} [logger]                                             The logger instance.
   *
   * @throws {TypeError}                                                    If exchangeSmart contract objecs is not initialized as expected.
   */
class TradingWalletTransactionBuilder {
  constructor(web3, { exchangeSmartContractAbi = exchangeScAbi, exchangeSmartContractAddress = exchange.smartContractAddress,
    transactionLib = transactionLibInstance, tradingWalletSmartContractAbi = tradingScAbi, logger = log } = {}) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!web3) {
      const errorMessage = `Invalid "web3" value: ${web3}`
      this.throwError(errorMessage)
    }
    this.web3 = web3

    this.transactionLib = transactionLib

    if (!exchangeSmartContractAbi) {
      const errorMessage = `Invalid "exchangeSmartContractAbi" value: ${exchangeSmartContractAbi}`
      this.throwError(errorMessage)
    }
    this.exchangeSmartContractInstance = this.web3.eth.contract(exchangeSmartContractAbi)
      .at(exchangeSmartContractAddress)

    if (!exchangeSmartContractAddress || this.checkEtherumAddress(exchangeSmartContractAddress)) {
      const errorMessage = `Invalid "exchangeSmartContractAddress" value: ${exchangeSmartContractAddress}`
      this.throwError(errorMessage)
    }
    this.exchangeSmartContractAddress = exchangeSmartContractAddress

    if (!tradingWalletSmartContractAbi) {
      const errorMessage = 'Invalid "tradingWalletSmartContractAbi"'
      this.throwError(errorMessage)
    }
    this.tradingWalletSmartContractAbi = tradingWalletSmartContractAbi
  }

  /**
     * It builds the transaction object to be used for trading wallet creation.
     * In order to create a new trading wallet `addNewUser` method of exchangeSmartContract
     * should be called.
     *
     * @param  {String} personalWalletAddress The personal wallet address (EOA).
     * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
     * @throws {SmartContractInterfaceError} If exchangeSmartContractInstance is not defined as expected.
     */
  buildCreateWalletTransactionDraft(personalWalletAddress) {
    this.checkEtherumAddress(personalWalletAddress)

    const smartContractMethodName = 'addNewUser'
    const smartContractParams = [personalWalletAddress]
    const transactionParams = {
      from: personalWalletAddress,
      to: this.exchangeSmartContractAddress,
    }

    const transactionDraft = this.transactionLib.buildDraft(this.exchangeSmartContractInstance,
      transactionParams, smartContractMethodName, smartContractParams)
    this.log.debug({ fn: 'buildCreateWalletTransactionDraft' }, 'Created wallet transaction draft successfully.')
    return transactionDraft
  }

  /**
   * It builds the transaction object to be used for deposit ether on trading wallet.
   * In order to deposit ether `depositEther` method of trading wallet smart contract
   * should be called.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {Number} quantity              The wei quantity of ether to deposit.
   *
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   * @throws {SmartContractInterfaceError} If exchangeSmartContractInstance is not defined as expected.
   */
  buildDepositEtherTransactionDraft(personalWalletAddress, tradingWalletAddress, quantity) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    const tradingWalletIstance = this.web3.eth.contract(this.tradingWalletSmartContractAbi).at(tradingWalletAddress)

    const smartContractMethodName = 'depositEther'
    const smartContractParams = null
    const transactionParams = {
      from: personalWalletAddress,
      to: tradingWalletAddress,
      value: quantity,
    }

    const transactionDraft = this.transactionLib.buildDraft(tradingWalletIstance, transactionParams,
      smartContractMethodName, smartContractParams)
    this.log.debug({ fn: 'buildDepositEtherTransactionDraft' }, 'Deposit ether transaction draft created successfully.')
    return transactionDraft
  }

  /**
   * It builds the transaction object to be used for deposit token on trading wallet.
   * In order to deposit ether `depositERC20Token` method of trading wallet smart contract
   * should be called.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {Number} quantity              The quantity of token to deposit.
   * @param {String} tokenAddress          The address of the token asset to deposit.
   *
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   * @throws {SmartContractInterfaceError} If exchangeSmartContractInstance is not defined as expected.
   */
  buildDepositTokenTransactionDraft(personalWalletAddress, tradingWalletAddress, quantity, tokenAddress) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)
    this.checkEtherumAddress(tokenAddress)

    const tradingWalletIstance = this.web3.eth.contract(this.tradingWalletSmartContractAbi).at(tradingWalletAddress)

    const smartContractMethodName = 'depositERC20Token'
    const smartContractParams = [tokenAddress, quantity]
    const transactionParams = {
      from: personalWalletAddress,
      to: tradingWalletAddress,
    }

    const transactionDraft = this.transactionLib.buildDraft(tradingWalletIstance, transactionParams,
      smartContractMethodName, smartContractParams)
    this.log.debug({ fn: 'buildDepositTokenTransactionDraft' }, 'Deposit token transaction draft created successfully.')
    return transactionDraft
  }

  /**
   * It builds the transaction object to be used for withdraw token on trading wallet.
   * In order to deposit ether `withdraw` method of trading wallet smart contract
   * should be called.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {Number} quantity              The quantity of token to withdraw.
   * @param {String} tokenAddress          The address of the token asset to withdraw.
   */
  buildWithdrawTransactionDraft(personalWalletAddress, tradingWalletAddress, quantity, tokenAddress) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)
    this.checkEtherumAddress(tokenAddress)

    const tradingWalletIstance = this.web3.eth.contract(this.tradingWalletSmartContractAbi).at(tradingWalletAddress)

    const smartContractMethodName = 'withdraw'
    const smartContractParams = [tokenAddress, quantity]
    const transactionParams = {
      from: personalWalletAddress,
      to: tradingWalletAddress,
    }

    const transactionDraft = this.transactionLib.buildDraft(tradingWalletIstance, transactionParams,
      smartContractMethodName, smartContractParams)
    this.log.debug({ fn: 'buildWithdrawTransactionDraft' }, 'Withdraw transaction draft created successfully.')
    return transactionDraft
  }

  /**
     * It builds the transaction object to be used for trading wallet address retrieval.
     * In order to createretrieve trading wallet address the `userAccountToWallet_` method of exchangeSmartContract
     * should be called.
     *
     * @param  {String} personalWalletAddress The personal wallet address (EOA).
     * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
     * @throws {SmartContractInterfaceError} If exchangeSmartContractInstance is not defined as expected.
     */
  buildTradingWalletAddressTransactionDraft(personalWalletAddress) {
    this.checkEtherumAddress(personalWalletAddress)
    const smartContractMethodName = 'retrieveWallet'
    const smartContractParams = [personalWalletAddress]
    const transactionParams = {
      from: personalWalletAddress,
      to: this.exchangeSmartContractAddress,
    }

    const transactionDraft = this.transactionLib.buildDraft(this.exchangeSmartContractInstance,
      transactionParams, smartContractMethodName, smartContractParams)
    this.log.debug({ transactionDraft, fn: 'buildTradingWalletAddressTransactionDraft' },
      'Created wallet transaction draft successfully.')
    return transactionDraft
  }

  /**
   * It gets the transaction object to be used for trading wallet asset balance.
   * In order to get a trading wallet asset balance the `tokenBalances_` method of tradingWalletSmartContract
   * should be called.
   *
   * @param  {String} personalWalletAddress The personal wallet address (EOA).
   * @param  {String} tradingWalletAddress  The trading wallet address.
   * @param  {String} tokenAddress          The address of the owned asset.
   * @throws {InvalidEthereumAddress}       If personalWalletAddress or the tokenAddress is not a valid ethereum address.
   * @throws {SmartContractInterfaceError}  If tradingWalletSmartContract is not defined as expected.
   */
  buildAssetBalanceTransactionDraft(personalWalletAddress, tradingWalletAddress, tokenAddress) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)
    this.checkEtherumAddress(tokenAddress)

    const smartContractMethodName = 'tokenBalances_'
    const smartContractParams = [tokenAddress]
    const transactionParams = {
      from: personalWalletAddress,
      to: tradingWalletAddress,
    }

    const tradingWalletInstance = this.web3.eth.contract(this.tradingWalletSmartContractAbi)
      .at(tradingWalletAddress)
    const transactionDraft = this.transactionLib.buildDraft(tradingWalletInstance,
      transactionParams, smartContractMethodName, smartContractParams)
    this.log.debug({ transactionDraft, fn: 'getAssetBalanceTransactionDraft' },
      'Asset balance transaction draft created successfully.')
    return transactionDraft
  }

  /**
   * It checks if the address is a valid ethereum address.
   * @param {String} address The address to check
   */
  // eslint-disable-next-line class-methods-use-this
  checkEtherumAddress(address) {
    if (!ethereumUtil.isValidAddress(address)) {
      throw new InvalidEthereumAddress(`The address: ${address} is not an ethereum valid address.`)
    }
  }
}

module.exports = TradingWalletTransactionBuilder
