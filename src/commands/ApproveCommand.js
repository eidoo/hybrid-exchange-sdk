const ABaseCommand = require('./ABaseCommand')
const CommandArg = require('../models/CommandArg')
const Erc20TokenServiceBuilder = require('../factories/Erc20TokenServiceBuilder')

/**
 * Class representing approve command.
*/
class ApproveCommand extends ABaseCommand {
  /**
<<<<<<< HEAD
   * Create an ApproveCommand controller.
=======
   * Create a signer controller.
>>>>>>> efe2de5... #18 Add ApproveCommand
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
<<<<<<< HEAD
   * @param {String} params.to             The token address.
   * @param {String} params.quantity       The quantity to approve.
   * @param {String} params.spender        The spender address (i.e. trading wallet address)
=======
   * @param {String} params.to             The trading wallet address.
   * @param {String} params.quantity       The personal wallet address (EOA).
   * @param {String} params.token          The token address.
>>>>>>> efe2de5... #18 Add ApproveCommand
   * @param {String} params.privateKeyPath The private key file path.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx         The raw tx flag. If set to true it shows the signed transaction data.
   */
<<<<<<< HEAD
  async doValidateAsync({ from, to, quantity, spender, privateKeyFilePath, draft, rawTx }) {
=======
  async doValidateAsync({ from, to, quantity, token, privateKeyFilePath, draft, rawTx }) {
>>>>>>> efe2de5... #18 Add ApproveCommand
    const params = this.approveCommandValidator.approve({
      from,
      to,
      quantity,
<<<<<<< HEAD
      spender,
=======
      token,
>>>>>>> efe2de5... #18 Add ApproveCommand
      privateKeyFilePath,
      draft,
      rawTx,
    })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from           The personal wallet address (EOA).
<<<<<<< HEAD
   * @param {String} params.to             The token address.
   * @param {String} params.quantity       The quantity to approve.
   * @param {String} params.spender        The spender address (i.e. trading wallet address)
=======
   * @param {String} params.to             The trading wallet address.
   * @param {String} params.quantity       The personal wallet address (EOA).
   * @param {String} params.token          The token address.
>>>>>>> efe2de5... #18 Add ApproveCommand
   * @param {String} params.privateKeyPath The private key file path.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx         The raw tx flag. If set to true it shows the signed transaction data.
   */
<<<<<<< HEAD
  async doExecuteAsync({ from, to, quantity, spender, privateKeyFilePath, draft, rawTx }) {
    const privateKey = await this.extractPrivateKey(privateKeyFilePath)
    const personalWalletAddressRetrived = this.getAddressFromPrivateKey(from, privateKey)
    this.setErc20Tokenservice(to)

    const transactionObjectDraft = this.erc20TokenService.transactionBuilder
      .buildApproveTrasferTransactionDraft(from, spender, quantity)
=======
  async doExecuteAsync({ from, to, quantity, token, privateKeyFilePath, draft, rawTx }) {
    const privateKey = await this.extractPrivateKey(privateKeyFilePath)
    const personalWalletAddressRetrived = this.getAddressFromPrivateKey(from, privateKey)
    this.setErc20Tokenservice(token)

    const transactionObjectDraft = this.erc20TokenService.transactionBuilder
      .buildApproveTrasferTransactionDraft(from, to, quantity, token)
>>>>>>> efe2de5... #18 Add ApproveCommand

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

    const result = await this.erc20TokenService.approveTrasferAsync(
      personalWalletAddressRetrived,
<<<<<<< HEAD
      spender,
=======
      to,
>>>>>>> efe2de5... #18 Add ApproveCommand
      quantity,
      privateKey,
    )
    return result
  }
}

module.exports = ApproveCommand
