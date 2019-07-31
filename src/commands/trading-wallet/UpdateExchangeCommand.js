const CredentialBasedCommand = require('../CredentialBasedCommand')
const CommandArg = require('../../models/CommandArg')

/**
 * Class representing UpdateExchangeCommand.
 */
class UpdateExchangeCommand extends CredentialBasedCommand {
  /**
   * Create a signer controller.
   * @param {Object} logger                         The logger helper.
   * @param {Object} tradingWalletService           The tradingWallet service.
   * @param {Object} updateExchangeCommandValidator The UpdateExchangeCommand validator.
   * @param {Object} privateKeyService              The privateKeyService.
   * @param {Object} privateKeyValidator            The privateKeyValidator.
   * @throws {TypeError}                            If some required property is missing.
   */
  constructor(logger, tradingWalletService, updateExchangeCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!updateExchangeCommandValidator) {
      const errorMessage = `Invalid "updateExchangeCommandValidator" value: ${updateExchangeCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.updateExchangeCommandValidator = updateExchangeCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It updates the trading wallet exchange address reference.'
  }

  setSynopsis() {
    let synopsis = 'update-exchange '
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
    const exchangeArg = new CommandArg('exchange',
      'string', 'ex', 'The exchange address.', 1, true)
    const keystoreFilePathArg = new CommandArg('keystore-file-path',
      'string', 'ksp', 'The keystore file path.', 1, true)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    const rawTxArg = new CommandArg('raw-tx',
      'boolean', 'rtx', 'If set, it returns the signed raw transaction data.', 0, false, false)
    return [fromArg, toArg, exchangeArg, keystoreFilePathArg, draftArg, rawTxArg]
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
   * @param {String} params.from             The personal wallet address (EOA).
   * @param {String} params.to               The trading wallet address.
   * @param {String} params.exchange         The exchange address.
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.draft            The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx           The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doValidateAsync({ from, to, exchange, keystoreFilePath, draft, rawTx }) {
    const keystorePassword = await this.promptKeyStorePasswordAsync()
    const params = this.updateExchangeCommandValidator
      .updateExchange({ from, to, exchange, keystoreFilePath, keystorePassword, draft, rawTx })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from             The personal wallet address (EOA).
   * @param {String} params.to               The trading wallet address.
   * @param {String} params.exchange         The exchange address.
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.keystorePassword The password to decrypt the keystore.
   * @param {String} params.draft            The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx           The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doExecuteAsync({ from, to, exchange, keystoreFilePath, keystorePassword, draft, rawTx }) {
    const privateKey = await this.extractPrivateKeyFromKeystore(keystoreFilePath, keystorePassword)
    const personalWalletAddressRetrived = this.getAddressFromPrivateKey(from, privateKey)
    const transactionObjectDraft = this.tradingWalletService.transactionBuilder
      .buildUpdateExchangeTransactionDraft(from, to, exchange)

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
    const result = await this.tradingWalletService.updateExchangeAsync(
      personalWalletAddressRetrived,
      to,
      exchange,
      privateKey,
    )
    return result
  }
}

module.exports = UpdateExchangeCommand
