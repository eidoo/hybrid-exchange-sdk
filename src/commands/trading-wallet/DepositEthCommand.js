const CredentialBasedCommand = require('../CredentialBasedCommand')
const CommandArg = require('../../models/CommandArg')

/**
 * Class representing DepositEthCommand.
 */
class DepositEthCommand extends CredentialBasedCommand {
  /**
   * Create a deposit ethereum command controller.
   * @param {Object} logger                     The logger helper.
   * @param {Object} tradingWalletService       The tradingWallet service.
   * @param {Object} depositEthCommandValidator The DepositEthCommand validator.
   * @param {Object} privateKeyService          The privateKeyService.
   * @param {Object} privateKeyValidator        The privateKeyValidator.
   * @throws {TypeError}                        If some required property is missing.
   */
  constructor(logger, tradingWalletService, depositEthCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!depositEthCommandValidator) {
      const errorMessage = `Invalid "depositEthCommandValidator" value: ${depositEthCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.depositEthCommandValidator = depositEthCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It deposits some ETH amount from an EOA to a trading wallet.'
  }

  setSynopsis() {
    let synopsis = 'deposit-eth '
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
    const quantityArg = new CommandArg('quantity',
      'string', 'q', 'The quantity to deposit.', 1, true)
    const keystoreFilePathArg = new CommandArg('keystore-file-path',
      'string', 'ksp', 'The keystore file path.', 1, true)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    const rawTxArg = new CommandArg('raw-tx',
      'boolean', 'rtx', 'If set, it returns the signed raw transaction data.', 0, false, false)
    return [fromArg, toArg, quantityArg, keystoreFilePathArg, draftArg, rawTxArg]
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
   * @param {String} params.quantity         The amount of ETH to be deposited.
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.draft            The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx           The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doValidateAsync({ from, to, quantity, keystoreFilePath, draft, rawTx }) {
    const keystorePassword = await this.promptKeyStorePasswordAsync()
    const params = this.depositEthCommandValidator
      .depositEth({ from, to, quantity, keystoreFilePath, keystorePassword, draft, rawTx })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from             The personal wallet address (EOA).
   * @param {String} params.to               The trading wallet address.
   * @param {String} params.quantity         The amount of ETH to be deposited.
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.keystorePassword The password to decrypt the keystore.
   * @param {String} params.draft            The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx           The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doExecuteAsync({ from, to, quantity, keystoreFilePath, keystorePassword, draft, rawTx }) {
    const privateKey = await this.extractPrivateKeyFromKeystore(keystoreFilePath, keystorePassword)
    const personalWalletAddressRetrived = this.getAddressFromPrivateKey(from, privateKey)
    const transactionObjectDraft = this.tradingWalletService.transactionBuilder
      .buildDepositEtherTransactionDraft(personalWalletAddressRetrived, to, quantity)

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
    const result = await this.tradingWalletService.depositEtherAsync(
      personalWalletAddressRetrived,
      to,
      quantity,
      privateKey,
    )
    return result
  }
}

module.exports = DepositEthCommand
