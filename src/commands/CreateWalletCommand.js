const ABaseCommand = require('./ABaseCommand')
const CommandArg = require('../models/CommandArg')

/**
 * Class representing CreateWalletCommand. */
class CreateWalletCommand extends ABaseCommand {
  /**
   * Create a signer controller.
   * @param {Object} logger                       The logger helper.
 * @param {Object} tradingWalletService           The tradingWallet service.
   * @param {Object} createWalletCommandValidator The CreateWalletCommand validator.
   * @param {Object} privateKeyService            The privateKeyService.
   * @param {Object} privateKeyValidator          The privateKeyValidator.
   * @throws {TypeError}                          If some required property is missing.
   */
  constructor(logger, tradingWalletService, createWalletCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      this.throwError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!createWalletCommandValidator) {
      const errorMessage = `Invalid "CreateWalletCommandValidator" value: ${createWalletCommandValidator}`
      this.throwError(errorMessage)
    }
    this.createWalletCommandValidator = createWalletCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It creates a trading wallet given the personal wallet address and private key.'
  }

  setSynopsis() {
    let synopsis = 'create-trading-wallet '
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
    const rawTxArg = new CommandArg('raw-tx',
      'boolean', 'rtx', 'If set, it returns the signed raw transaction data.', 0, false, false)
    return [personalWalletAddressArg, privateKeyPathArg, draftArg, rawTxArg]
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
   * @param {String} params.draft                 The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx                The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doValidateAsync({ personalWalletAddress, privateKeyPath, draft, rawTx }) {
    const params = this.createWalletCommandValidator
      .createWallet({ personalWalletAddress, privateKeyPath, draft, rawTx })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.personalWalletAddress The personal wallet address (EOA).
   * @param {String} params.privateKeyPath        The private key file path.
   * @param {String} params.draft                 The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx                The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doExecuteAsync({ personalWalletAddress, privateKeyPath, draft, rawTx }) {
    let personalWalletAddressRetrived = personalWalletAddress
    const privateKey = await this.extractPrivateKey(privateKeyPath)
    personalWalletAddressRetrived = this.getAddressFromPrivateKey(personalWalletAddress, privateKey)
    const transactionObjectDraft = this.tradingWalletService.tradingWalletTransactionBuilder
      .buildCreateWalletTransactionDraft(personalWalletAddressRetrived, privateKey)

    if (draft) {
      return transactionObjectDraft
    }

    if (rawTx) {
      const signedTransactionData = await this.tradingWalletService.getSignedTransactionData(
        transactionObjectDraft,
        privateKey,
      )
      return signedTransactionData
    }

    const result = await this.tradingWalletService.createWalletAsync(personalWalletAddressRetrived, privateKey)
    return result
  }
}

module.exports = CreateWalletCommand
