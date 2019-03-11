const CredentialBasedCommand = require('../CredentialBasedCommand')
const CommandArg = require('../../models/CommandArg')
const Erc20TokenServiceBuilder = require('../../factories/Erc20TokenServiceBuilder')

/**
 * Class representing approve command.
*/
class ApproveCommand extends CredentialBasedCommand {
  /**
   * Create an ApproveCommand controller.
   * @param {Object} logger                       The logger helper.
   * @param {Object} approveCommandValidator      The ApproveToken validator.
   * @param {Object} privateKeyService            The privateKeyService.
   * @param {Object} privateKeyValidator          The privateKeyValidator.
   * @throws {TypeError}                          If some required property is missing.
   */
  constructor(logger, approveCommandValidator, privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!approveCommandValidator) {
      const errorMessage = `Invalid "approveCommandValidator" value: ${approveCommandValidator}`
      throw new TypeError(errorMessage)
    }

    this.approveCommandValidator = approveCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()
    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It approves quantity to be deposited.'
  }

  setErc20Tokenservice(tokenAddress) {
    const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(tokenAddress)
    this.erc20TokenService = erc20TokenServiceBuilder.build()
  }

  setSynopsis() {
    let synopsis = 'approve '
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
    const spenderArg = new CommandArg('spender',
      'string', 's', 'The spender address.', 1, true)
    const keystoreFilePathArg = new CommandArg('keystore-file-path',
      'string', 'ksp', 'The keystore file path.', 1, true)
    const draftArg = new CommandArg('draft',
      'boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    const rawTxArg = new CommandArg('raw-tx',
      'boolean', 'rtx', 'If set, it returns the signed raw transaction data.', 0, false, false)
    return [fromArg, toArg, quantityArg, spenderArg, keystoreFilePathArg, draftArg, rawTxArg]
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
   * @param {String} params.to               The token address.
   * @param {String} params.quantity         The quantity to approve.
   * @param {String} params.spender          The spender address (i.e. trading wallet address)
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.draft            The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx           The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doValidateAsync({ from, to, quantity, spender, keystoreFilePath, draft, rawTx }) {
    const keystorePassword = await this.promptKeyStorePasswordAsync()
    const params = this.approveCommandValidator.approve({
      from,
      to,
      quantity,
      spender,
      keystoreFilePath,
      keystorePassword,
      draft,
      rawTx,
    })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from             The personal wallet address (EOA).
   * @param {String} params.to               The token address.
   * @param {String} params.quantity         The quantity to approve.
   * @param {String} params.spender          The spender address (i.e. trading wallet address)
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.keystorePassword The password to decrypt the keystore.
   * @param {String} params.draft            The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx           The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doExecuteAsync({ from, to, quantity, spender, keystoreFilePath, keystorePassword, draft, rawTx }) {
    const privateKey = await this.extractPrivateKeyFromKeystore(keystoreFilePath, keystorePassword)
    const personalWalletAddressRetrived = this.getAddressFromPrivateKey(from, privateKey)
    this.setErc20Tokenservice(to)

    const transactionObjectDraft = this.erc20TokenService.transactionBuilder
      .buildApproveTrasferTransactionDraft(from, spender, quantity)

    if (draft) {
      return transactionObjectDraft
    }

    if (rawTx) {
      const signedTransactionData = await this.erc20TokenService.getSignedTransactionData(
        transactionObjectDraft,
        privateKey,
      )
      return signedTransactionData
    }

    const result = await this.erc20TokenService.approveTransferAsync(
      personalWalletAddressRetrived,
      spender,
      quantity,
      privateKey,
    )
    return result
  }
}

module.exports = ApproveCommand
