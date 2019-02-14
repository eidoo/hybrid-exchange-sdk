const ABaseCommand = require('./ABaseCommand')
const CommandArg = require('../models/CommandArg')

/**
 * Class representing GetAddressCommand. */
class GetAddressCommand extends ABaseCommand {
  /**
   * Create a signer controller.
   * @param {Object} logger                     The logger helper.
   * @param {Object} tradingWalletService       The tradingWallet service.
   * @param {Object} getAddressCommandValidator The getAddressCommand validator.
   * @param {Object} privateKeyService          The privateKeyService.
   * @param {Object} privateKeyValidator        The privateKeyValidator.
   * @throws {TypeError}                        If some required property is missing.
   */
  constructor(logger, tradingWalletService, getAddressCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      this.throwError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!getAddressCommandValidator) {
      const errorMessage = `Invalid "getAddressCommandValidator" value: ${getAddressCommandValidator}`
      this.throwError(errorMessage)
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
    const privateKeyPathArg = new CommandArg('private-key-path',
      'string', 'prv', 'The private key file path.', 1, false)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    return [personalWalletAddressArg, privateKeyPathArg, draftArg]
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
   * @param {String} params.privateKeyPath        The private key file path.
   * @param {String} params.draft                 The draft parameter.
   */
  async doValidateAsync({ personalWalletAddress, privateKeyPath, draft }) {
    const params = this.getAddressCommandValidator
      .getTradingWalletAddress({ personalWalletAddress, privateKeyPath, draft })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.personalWalletAddress The personal wallet address (EOA).
   * @param {String} params.privateKeyPath        The private key file path.
   * @param {String} params.draft                 The draft. If set to true it shows the TransactionObjectDraft.
   */
  async doExecuteAsync({ personalWalletAddress, privateKeyPath, draft }) {
    let personalWalletAddressRetrived = personalWalletAddress

    if (privateKeyPath) {
      const privateKey = await this.extractPrivateKey(privateKeyPath)
      personalWalletAddressRetrived = this.getAddressFromPrivateKey(personalWalletAddress, privateKey)
    }

    if (draft) {
      return this.tradingWalletService.transactionBuilder.buildTradingWalletAddressTransactionDraft(personalWalletAddressRetrived)
    }

    const result = await this.tradingWalletService
      .getTradingWalletAddressAsync(personalWalletAddressRetrived)
    return result
  }
}

module.exports = GetAddressCommand
