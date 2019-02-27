const Web3 = require('web3')

const ABaseCommand = require('./ABaseCommand')
const CommandArg = require('../models/CommandArg')
const Erc20TokenServiceBuilder = require('../factories/Erc20TokenServiceBuilder')
const Erc20TokenTransactionBuilder = require('../factories/Erc20TokenTransactionBuilder')
const TradingWalletTransactionBuilder = require('../factories/TradingWalletTransactionBuilder')
const TradingWalletFacade = require('../facades/TradingWalletFacade')

const providerUrl = 'PROVIDER_URL'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

/**
 * Class representing DepositTokenCommand.
 */
class DepositTokenCommand extends ABaseCommand {
  /**
   * Create a deposit token command controller.
   * @param {Object} logger                       The logger helper.
   * @param {Object} tradingWalletService         The tradingWallet service.
   * @param {Object} depositTokenCommandValidator The DepositTokenCommand validator.
   * @param {Object} privateKeyService            The privateKeyService.
   * @param {Object} privateKeyValidator          The privateKeyValidator.
   * @throws {TypeError}                          If some required property is missing.
   */
  constructor(logger, tradingWalletService, depositTokenCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!depositTokenCommandValidator) {
      const errorMessage = `Invalid "depositTokenCommandValidator" value: ${depositTokenCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.depositTokenCommandValidator = depositTokenCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It deposits some Token amount from an EOA to a trading wallet.'
  }

  setTradingWalletFacade(erc20TokenSmartContractAddress) {
    const erc20TokenTransactionBuilder = new Erc20TokenTransactionBuilder(web3, { erc20TokenSmartContractAddress })
    const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(erc20TokenSmartContractAddress)
    const erc20TokenService = erc20TokenServiceBuilder.build()
    const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(web3)
    const tradingWalletFacade = new TradingWalletFacade(
      tradingWalletTransactionBuilder,
      erc20TokenService,
      erc20TokenTransactionBuilder,
    )
    this.tradingWalletFacade = tradingWalletFacade
  }

  setSynopsis() {
    let synopsis = 'deposit-token '
    this.builderArgs.forEach((item) => {
      synopsis += item.getReprForSynopsys()
    })
    return synopsis
  }

  /**
   * It set the builder args necessary to set args cli command.
   */
  static setBuilderArgs() {
    const fromArg = new CommandArg('from',
      'string', 'f', 'The from address. (e.g token holder)', 1, true)
    const toArg = new CommandArg('to',
      'string', 't', 'The to address. (e.g trading wallet)', 1, true)
    const quantityArg = new CommandArg('quantity',
      'string', 'q', 'The quantity to deposit.', 1, true)
    const tokenArg = new CommandArg('token',
      'string', 'tk', 'The token address.', 1, true)
    const privateKeyFilePathArg = new CommandArg('private-key-file-path',
      'string', 'prv', 'The private key file path.', 1, true)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    const withApproveArg = new CommandArg('with-approve',
      'boolean', 'wap', 'It executes the deposit transaction managing the approve flow.', 0, true)
    return [fromArg, toArg, quantityArg, tokenArg, privateKeyFilePathArg, draftArg, withApproveArg]
  }

  /**
   * It gets the args props to be injected in yargs cli command.
   */
  getBuilderArgsDetails() {
    const builderArgsDetails = {}
    this.builderArgs.forEach((item) => {
      builderArgsDetails[item.name] = item.getArgProps()
    })
    return builderArgsDetails
  }

  /**
   * It validates the input parameters in order to execute the command.
   *
   * @param {Object} params
   * @param {String} params.from           The personal wallet address (EOA).
   * @param {String} params.to             The trading wallet address.
   * @param {String} params.quantity       The amount of ETH to be deposited.
   * @param {String} params.token          The Token address to be deposited.
   * @param {String} params.privateKeyPath The private key file path.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.withApprove    The approve flag. Default false, it will automatically handle the approve flow required for the deposit.
   */
  async doValidateAsync({ from, to, quantity, token, privateKeyFilePath, draft, withApprove }) {
    const params = this.depositTokenCommandValidator
      .depositToken({ from, to, quantity, token, privateKeyFilePath, draft, withApprove })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from           The personal wallet address (EOA).
   * @param {String} params.to             The trading wallet address.
   * @param {String} params.quantity       The amount of ETH to be deposited.
   * @param {String} params.token          The Token address to be deposited.
   * @param {String} params.privateKeyPath The private key file path.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.withApprove    The approve flag. Default false, it will automatically handle the approve flow required for the deposit.
   */
  async doExecuteAsync({ from, to, quantity, token, privateKeyFilePath, draft, withApprove }) {
    const privateKey = await this.extractPrivateKey(privateKeyFilePath)
    const personalWalletAddressRetrived = this.getAddressFromPrivateKey(from, privateKey)
    this.setTradingWalletFacade(token)

    const transactionObjectDraft = this.tradingWalletService.transactionBuilder
      .buildDepositTokenTransactionDraft(personalWalletAddressRetrived, to, quantity, token)

    if (draft) {
      return transactionObjectDraft
    }

    if (!withApprove) {
      const resultWithoutApprove = await this.tradingWalletService.depositTokenAsync(
        personalWalletAddressRetrived,
        to,
        quantity,
        token,
        privateKey,
      )
      return resultWithoutApprove
    }

    const resultWithApprove = await this.tradingWalletFacade.depositTokenAsync(
      personalWalletAddressRetrived,
      to,
      quantity,
      token,
      privateKey,
    )
    const { depositTransactionHash } = resultWithApprove
    return depositTransactionHash
  }
}

module.exports = DepositTokenCommand
