const _ = require('lodash')

const ABaseCommand = require('../ABaseCommand')
const CommandArg = require('../../models/CommandArg')

/**
 * Class representing GetAddressCommand. */
class GetAddressCommand extends ABaseCommand {
  /**
   * Create a signer controller.
   * @param {Object} logger                     The logger helper.
   * @param {Object} tradingWalletService       The tradingWallet service.
   * @param {Object} getAddressCommandValidator The getAddressCommand validator.
   * @throws {TypeError}                        If some required property is missing.
   */
  constructor(logger, tradingWalletService, getAddressCommandValidator) {
    super(logger)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!getAddressCommandValidator) {
      const errorMessage = `Invalid "getAddressCommandValidator" value: ${getAddressCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.getAddressCommandValidator = getAddressCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It gets the trading wallet address from personal wallet address.'
  }

  setSynopsis() {
    let synopsis = 'get-address '
    this.builderArgs.forEach((item) => {
      synopsis += item.getReprForSynopsys()
    })
    return synopsis
  }

  /**
   * It set the builder args necessary to set args cli command.
   */
  static setBuilderArgs() {
    const personalWalletAddressArg = new CommandArg('personal-wallet-address',
      'string', 'eoa', 'The personal wallet address (EOA).', 1, true)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    return [personalWalletAddressArg, draftArg]
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
   * @param {String} params.personalWalletAddress The personal wallet address (EOA).
   * @param {String} params.draft                 The draft parameter.
   */
  async doValidateAsync({ personalWalletAddress, draft }) {
    const params = this.getAddressCommandValidator
      .getTradingWalletAddress({ personalWalletAddress, draft })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.personalWalletAddress The personal wallet address (EOA).
   * @param {String} params.draft                 The draft. If set to true it shows the TransactionObjectDraft.
   */
  async doExecuteAsync({ personalWalletAddress, draft }) {
    if (draft) {
      return this.tradingWalletService.transactionBuilder
        .buildTradingWalletAddressTransactionDraft(personalWalletAddress)
    }

    const result = await this.tradingWalletService
      .getTradingWalletAddressAsync(personalWalletAddress)
    return result
  }
}

module.exports = GetAddressCommand
