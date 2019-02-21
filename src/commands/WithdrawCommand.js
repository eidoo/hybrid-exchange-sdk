const ABaseCommand = require('./ABaseCommand')
const CommandArg = require('../models/CommandArg')

/**
 * Class representing WithdrawCommand.
 */
class WithdrawCommand extends ABaseCommand {
  /**
   * Create a signer controller.
   * @param {Object} logger                   The logger helper.
   * @param {Object} tradingWalletService     The tradingWallet service.
   * @param {Object} withdrawCommandValidator The WithdrawCommand validator.
   * @param {Object} privateKeyService        The privateKeyService.
   * @param {Object} privateKeyValidator      The privateKeyValidator.
   * @throws {TypeError}                      If some required property is missing.
   */
  constructor(logger, tradingWalletService, withdrawCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!withdrawCommandValidator) {
      const errorMessage = `Invalid "withdrawCommandValidator" value: ${withdrawCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.withdrawCommandValidator = withdrawCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It withdraws an asset amount from a trading wallet to its owner.'
  }

  setSynopsis() {
    let synopsis = 'withdraw '
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
      'string', 'q', 'The quantity to withdraw.', 1, true)
    const tokenArg = new CommandArg('token',
      'string', 'tk', 'The token address.', 1, true)
    const privateKeyFilePathArg = new CommandArg('private-key-path',
      'string', 'prv', 'The private key file path.', 1, false)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    const rawTxArg = new CommandArg('raw-tx',
      'boolean', 'rtx', 'If set, it returns the signed raw transaction data.', 0, false, false)
    return [fromArg, toArg, quantityArg, tokenArg, privateKeyFilePathArg, draftArg, rawTxArg]
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
   * @param {String} params.quantity       The personal wallet address (EOA).
   * @param {String} params.token          The token address.
   * @param {String} params.privateKeyPath The private key file path.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx         The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doValidateAsync({ from, to, quantity, token, privateKeyFilePath, draft, rawTx }) {
    const params = this.withdrawCommandValidator
      .withdraw({ from, to, quantity, token, privateKeyFilePath, draft, rawTx })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from           The personal wallet address (EOA).
   * @param {String} params.to             The trading wallet address.
   * @param {String} params.quantity       The personal wallet address (EOA).
   * @param {String} params.token          The token address.
   * @param {String} params.privateKeyPath The private key file path.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx         The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doExecuteAsync({ from, to, quantity, token, privateKeyFilePath, draft, rawTx }) {
    const privateKey = await this.extractPrivateKey(privateKeyFilePath)
    const personalWalletAddressRetrived = this.getAddressFromPrivateKey(from, privateKey)
    const transactionObjectDraft = this.tradingWalletService.transactionBuilder
      .buildWithdrawTransactionDraft(from, to, quantity, token)

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
    const result = await this.tradingWalletService.withdrawAsync(
      personalWalletAddressRetrived,
      to,
      quantity,
      token,
      privateKey,
    )
    return result
  }
}

module.exports = WithdrawCommand
