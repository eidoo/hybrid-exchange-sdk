const BaseTransactionBuilder = require('./BaseTransactionBuilder')
const erc20TokenAbi = require('../../abi/erc20Token.json')
const log = require('../logger')

const { TransactionLib } = require('../lib/TransactionLib')

const transactionLibInstance = new TransactionLib()

/**
   * Class representing a factory to build draft transaction object.
   * @param  {Object} web3                                    The web3 instance.
   * @param  {Object} [params]                                The params object.
   * @param  {Object} [params.erc20TokenSmartContractAbi]     The erc20 token smart contract abi interface.
   * @param  {Object} [params.erc20TokenSmartContractAddress] The erc20 smart token contract address.
   * @param  {Object} [params.transactionLib]                 The transaction lib istance.
   * @param  {Object} [params.logger]                         The logger instance.
   *
   * @throws {TypeError}                                      If Erc20TokenTransactionBuilder object is not initialized as expected.
   */
class Erc20TokenTransactionBuilder extends BaseTransactionBuilder {
  constructor(web3, { erc20TokenSmartContractAddress, erc20TokenSmartContractAbi = erc20TokenAbi,
    transactionLib = transactionLibInstance, logger = log } = {}) {
    super(logger, web3, transactionLib)

    if (!erc20TokenSmartContractAddress) {
      const errorMessage = `Invalid "erc20TokenSmartContractAddress" value: ${erc20TokenSmartContractAddress}`
      throw new TypeError(errorMessage)
    }
    this.erc20TokenSmartContractAddress = erc20TokenSmartContractAddress

    if (!erc20TokenSmartContractAbi) {
      const errorMessage = `Invalid "erc20TokenSmartContractAbi" value: ${erc20TokenSmartContractAbi}`
      throw new TypeError(errorMessage)
    }
    this.erc20TokenSmartContractInstance = this.web3.eth.contract(erc20TokenSmartContractAbi)
      .at(erc20TokenSmartContractAddress)
  }

  /**
   * It gets the transaction object to be used for approve token trasfer on trading wallet.
   * In order to approve token trasfer the `approve` method of erc20 token smart contract
   * should be called before deposit operation.
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {Number} quantity              The wei quantity of ether to deposit.
   * @param {String} tradingWalletAddress  The trading wallet address.
   *
   * @throws {InvalidEthereumAddress}      If personalWalletAddress is not a valid ethereum address.
   * @throws {SmartContractInterfaceError} If exchangeSmartContractInstance is not defined as expected.
   */
  buildApproveTrasferTransactionDraft(personalWalletAddress, tradingWalletAddress, quantity) {
    this.constructor.checkEtherumAddress(personalWalletAddress)
    this.constructor.checkEtherumAddress(tradingWalletAddress)

    const smartContractMethodName = 'approve'
    const smartContractParams = [tradingWalletAddress, quantity]
    const transactionParams = {
      from: personalWalletAddress,
      to: this.erc20TokenSmartContractAddress,
    }

    const transactionDraft = this.transactionLib.buildDraft(this.erc20TokenSmartContractInstance,
      transactionParams, smartContractMethodName, smartContractParams)
    this.log.debug(
      { fn: 'buildApproveTrasferTransactionDraft', personalWalletAddress, tradingWalletAddress, quantity },
      'Erc20 token approve transaction draft successfully.',
    )
    return transactionDraft
  }

  buildGetAllowanceTransactionDraft(personalWalletAddress, tradingWalletAddress) {
    this.constructor.checkEtherumAddress(personalWalletAddress)
    this.constructor.checkEtherumAddress(tradingWalletAddress)

    const smartContractMethodName = 'allowance'
    const smartContractParams = [personalWalletAddress, tradingWalletAddress]
    const transactionParams = {
      from: personalWalletAddress,
      to: this.erc20TokenSmartContractAddress,
    }

    const transactionDraft = this.transactionLib.buildDraft(this.erc20TokenSmartContractInstance,
      transactionParams, smartContractMethodName, smartContractParams)
    this.log.debug(
      { fn: 'buildGetAllowanceTransactionDraft', personalWalletAddress, tradingWalletAddress },
      'Erc20 token get allowance transaction draft builded successfully.',
    )
    return transactionDraft
  }

  buildGetBalanceOfTransactionDraft(personalWalletAddress) {
    this.constructor.checkEtherumAddress(personalWalletAddress)

    const smartContractMethodName = 'balanceOf'
    const smartContractParams = [personalWalletAddress]
    const transactionParams = {
      from: personalWalletAddress,
      to: this.erc20TokenSmartContractAddress,
    }

    const transactionDraft = this.transactionLib.buildDraft(this.erc20TokenSmartContractInstance,
      transactionParams, smartContractMethodName, smartContractParams)
    this.log.debug(
      { fn: 'buildGetBalanceOfTransactionDraft', personalWalletAddress },
      'Erc20 token get balance of transaction draft builded successfully.',
    )
    return transactionDraft
  }
}

module.exports = Erc20TokenTransactionBuilder
