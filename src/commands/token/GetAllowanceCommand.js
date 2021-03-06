const ABaseCommand = require('../ABaseCommand')
const CommandArg = require('../../models/CommandArg')
const { Erc20TokenServiceBuilder } = require('../../factories')

/**
 * Class representing GetAllowanceCommand. */
class GetAllowanceCommand extends ABaseCommand {
  /**
   * Create a GetAllowanceCommand object.
   * @param {Object} logger                       The logger helper.
   * @param {Object} getAllowanceCommandValidator The get allowance command validator.
   * @throws {TypeError}                          If some required property is missing.
   */
  constructor(logger, getAllowanceCommandValidator) {
    super(logger)

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
    const owner = new CommandArg('owner', 'string', 'o', 'the funds owner.', 1, true)
    const spender = new CommandArg('spender', 'string', 's', 'The spender i.e. the trading wallet address.', 1, true)
    const tokenArg = new CommandArg('token', 'string', 'tk', 'The token address.', 1, true)
    const draftArg = new CommandArg('draft', 'boolean', 'd',
      'If set, it returns the TransactionObjectDraft.', 0, false, false)
    return [owner, spender, tokenArg, draftArg]
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
   * @param {String} params.owner              The owner parameter.
   * @param {String} params.spender            The spender.
   * @param {String} params.token              The token address.
   * @param {String} params.draft              The draft flag. If set to true it shows the TransactionObjectDraft.
   */
  async doValidateAsync({ owner, spender, token, draft }) {
    const params = this.getAllowanceCommandValidator.getAllowance({ owner, spender, token, draft })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.owner               The owner parameter.
   * @param {String} params.spender            The spender.
   * @param {String} params.token              The token address.
   * @param {String} params.draft              The draft flag. If set to true it shows the TransactionObjectDraft.
   */
  async doExecuteAsync({ owner, spender, token, draft }) {
    this.setErc20Tokenservice(token)

    if (draft) {
      return this.erc20TokenService.transactionBuilder.buildGetAllowanceTransactionDraft(owner, spender)
    }
    const result = await this.erc20TokenService.getAllowanceAsync(owner, spender)
    return result
  }
}

module.exports = GetAllowanceCommand
