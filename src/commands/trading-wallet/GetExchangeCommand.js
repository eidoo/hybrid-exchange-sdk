const ABaseCommand = require('../ABaseCommand')
const CommandArg = require('../../models/CommandArg')

/**
 * Class representing GetExchangeCommand. */
class GetExchangeCommand extends ABaseCommand {
  /**
   * Create a GetExchangeCommand controller.
   * @param {Object} logger                      The logger helper.
   * @param {Object} tradingWalletService        The tradingWallet service.
   * @param {Object} getExchangeCommandValidator The getExchangeCommand validator.
   * @throws {TypeError}                         If some required property is missing.
   */
  constructor(logger, tradingWalletService, getExchangeCommandValidator) {
    super(logger)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!getExchangeCommandValidator) {
      const errorMessage = `Invalid "getExchangeCommandValidator" value: ${getExchangeCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.getExchangeCommandValidator = getExchangeCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It gets the trading wallet current exchange address.'
  }

  setSynopsis() {
    let synopsis = 'get-exchange '
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
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    return [fromArg, toArg, draftArg]
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
   * @param {String} params.draft              The draft parameter.
   */
  async doValidateAsync({ from, to, draft }) {
    const params = this.getExchangeCommandValidator.getExchange({ from, to, draft })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from               The personal wallet address (EOA).
   * @param {String} params.to                 The trading wallet address.
   * @param {String} params.draft              The draft. If set to true it shows the TransactionObjectDraft.
   */
  async doExecuteAsync({ from, to, draft }) {
    if (draft) {
      return this.tradingWalletService.transactionBuilder.buildGetExchangeTransactionDraft(from, to)
    }

    const result = await this.tradingWalletService.getExchangeAsync(from, to)
    return result
  }
}

module.exports = GetExchangeCommand
