const ABaseCommand = require('./ABaseCommand')
const CommandArg = require('../models/CommandArg')

/**
 * Class representing GetAllowanceCommand. */
class GetAllowanceCommand extends ABaseCommand {
  /**
   * Create a GetAllowanceCommand object.
   * @param {Object} logger                       The logger helper.
   * @param {Object} getAllowanceCommandValidator The get allowance command validator.
   * @param {Object} privateKeyService            The privateKeyService.
   * @param {Object} privateKeyValidator          The privateKeyValidator.
   * @throws {TypeError}                          If some required property is missing.
   */
  constructor(logger, getAllowanceCommandValidator, privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!getAllowanceCommandValidator) {
      const errorMessage = `Invalid "getAllowanceCommandValidator" value: ${getAllowanceCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.getAllowanceCommandValidator = getAllowanceCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It gets the allowance of Erc20 token.'
  }

  setErc20Tokenservice(tokenAddress) {
    const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(tokenAddress)
    this.erc20TokenService = erc20TokenServiceBuilder.build()
  }

  setSynopsis() {
    let synopsis = 'get-allowance '
    this.builderArgs.forEach((item) => {
      synopsis += item.getReprForSynopsys()
    })
    return synopsis
  }

  /**
   * It set the builder args necessary to set args cli command.
   */
  static setBuilderArgs() {
    const from = new CommandArg('from','string', 'f', 'the from address i.e. who is asking for the balance', 1, true)
    const spender = new CommandArg('spender','string', 'n2', 'The spender i.e. the trading wallet address.', 1, true)
    const tokenArg = new CommandArg('token','string', 'tk', 'The token address.', 1, true)
    const draftArg = new CommandArg('draft','boolean', 'd', 'If set, it returns the TransactionObjectDraft.', 0, false, false)
    const rawTxArg = new CommandArg('raw-tx', 'boolean', 'rtx', 'If set, it returns the signed raw transaction data.', 0, false, false)
    return [from, spender, tokenArg, draftArg, rawTxArg]
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
   * @param {String} params.from           The from parameter.
   * @param {String} params.spender        The spender.
   * @param {String} params.token          The token address.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx         The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doValidateAsync({ from, spender, token, draft, rawTx }) {
    const params = this.getAllowanceValidator.getAllowance({from, spender, token, draft, rawTx  })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.from           The from parameter.
   * @param {String} params.spender        The spender.
   * @param {String} params.token          The token address.
   * @param {String} params.draft          The draft flag. If set to true it shows the TransactionObjectDraft.
   * @param {String} params.rawTwx         The raw tx flag. If set to true it shows the signed transaction data.
   */
  async doExecuteAsync({ from, spender, token, draft, rawTx }) {
    this.setErc20Tokenservice(token)
    
    const transactionObjectDraft = this.erc20TokenService.transactionBuilder
      .buildCreateWalletTransactionDraft( from, spender, token)

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
    const result = await this.erc20TokenService.(from, spender)
    return result
  }
}

module.exports = getAllowanceCommand

