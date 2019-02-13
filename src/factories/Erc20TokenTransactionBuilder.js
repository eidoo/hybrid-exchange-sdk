const ethereumUtil = require('ethereumjs-util')

const erc20TokenAbi = require('../../abi/erc20Token.json')
const log = require('../logger')

const { InvalidEthereumAddress } = require('../utils/errors')
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
class Erc20TokenTransactionBuilder {
  constructor(web3, { erc20TokenSmartContractAddress, erc20TokenSmartContractAbi = erc20TokenAbi,
    transactionLib = transactionLibInstance, logger = log } = {}) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!web3) {
      const errorMessage = `Invalid "web3" value: ${web3}`
      throw new TypeError(errorMessage)
    }
    this.web3 = web3

    if (!transactionLib) {
      const errorMessage = `Invalid "transactionLib" value: ${transactionLib}`
      throw new TypeError(errorMessage)
    }
    this.transactionLib = transactionLib

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
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

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

module.exports = Erc20TokenTransactionBuilder
