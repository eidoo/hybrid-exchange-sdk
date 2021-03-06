const ABaseCommand = require('../ABaseCommand')
const CommandArg = require('../../models/CommandArg')

/**
 * Class representing GetBalanceCommand. */
class GetBalanceCommand extends ABaseCommand {
  /**
   * Create a GetBalanceCommand controller.
   * @param {Object} logger                     The logger helper.
   * @param {Object} tradingWalletService       The tradingWallet service.
   * @param {Object} getBalanceCommandValidator The getBalanceCommand validator.
   * @throws {TypeError}                        If some required property is missing.
   */
  constructor(logger, tradingWalletService, getBalanceCommandValidator) {
    super(logger)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!getBalanceCommandValidator) {
      const errorMessage = `Invalid "getBalanceCommandValidator" value: ${getBalanceCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.getBalanceCommandValidator = getBalanceCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It gets the trading wallet asset balance.'
  }

  setSynopsis() {
    let synopsis = 'get-balance '
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
      'string', 'f', 'The from address.', 1, true)
    const toArg = new CommandArg('to',
      'string', 't', 'The to address.', 1, true)
    const tokenArg = new CommandArg('token',
      'string', 'tk', 'The token address.', 1, true)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    return [fromArg, toArg, tokenArg, draftArg]
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
   * @param {String} params.from               The personal wallet address (EOA).
   * @param {String} params.to                 The trading wallet address.
   * @param {String} params.token              The token wallet address.
   * @param {String} params.draft              The draft parameter.
   */
  async doValidateAsync({ from, to, token, draft }) {
    const params = this.getBalanceCommandValidator.getBalance({ from, to, token, draft })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from               The personal wallet address (EOA).
   * @param {String} params.to                 The trading wallet address.
   * @param {String} params.token              The token wallet address.
   * @param {String} params.draft              The draft. If set to true it shows the TransactionObjectDraft.
   */
  async doExecuteAsync({ from, to, token, draft }) {
    if (draft) {
      return this.tradingWalletService.transactionBuilder.buildAssetBalanceTransactionDraft(from, to, token)
    }

    const result = await this.tradingWalletService.getAssetBalanceAsync(from, token, to)
    return result
  }
}

module.exports = GetBalanceCommand
