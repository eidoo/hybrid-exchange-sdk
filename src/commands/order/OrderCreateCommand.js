const CredentialBasedCommand = require('../CredentialBasedCommand')
const CommandArg = require('../../models/CommandArg')

/**
 * Class representing OrderCreateCommand. */
class OrderCreateCommand extends CredentialBasedCommand {
  /**
   * Create a OrderCreateCommand controller.
   * @param {Object} logger                      The logger helper.
   * @param {Object} orderService                The tradingWallet service.
   * @param {Object} orderCreateCommandValidator The orderCreateCommandValidator.
   * @param {Object} privateKeyService           The privateKeyService.
   * @param {Object} privateKeyValidator         The privateKeyValidator.
   * @throws {TypeError}                         If some required property is missing.
   */
  constructor(logger, orderService, orderCreateCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!orderService) {
      const errorMessage = `Invalid "orderService" value: ${orderService}`
      throw new TypeError(errorMessage)
    }
    this.orderService = orderService

    if (!orderCreateCommandValidator) {
      const errorMessage = `Invalid "orderCreateCommandValidator" value: ${orderCreateCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.orderCreateCommandValidator = orderCreateCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It creates an order on Eidoo Hybrid exchange.'
  }

  setSynopsis() {
    let synopsis = 'create '
    this.builderArgs.forEach((item) => {
      synopsis += item.getReprForSynopsys()
    })
    return synopsis
  }

  /**
   * It set the builder args necessary to set args cli command.
   */
  static setBuilderArgs() {
    const cliInputJsonArg = new CommandArg('cli-input-JSON',
      'string', 'input', 'The order creation payload.', 1, true, undefined)
    const privateKeyFilePathArg = new CommandArg('private-key-file-path',
      'string', 'prv', 'The private key file path.', 1, true)
    return [cliInputJsonArg, privateKeyFilePathArg]
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
   * @param {String} params.cliInputJson        The order create command payload.
   * @param {String} params.privateKeyFilePath  The private key file path.
   */
  async doValidateAsync({ cliInputJson, privateKeyFilePath }) {
    const params = this.orderCreateCommandValidator.orderCreate({
      cliInputJson,
      privateKeyFilePath,
    })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.cliInputJson       The order create command payload.
   * @param {String} params.privateKeyFilePath The private key file path.
   */
  async doExecuteAsync({ cliInputJson, privateKeyFilePath }) {
    const privateKey = await this.extractPrivateKey(privateKeyFilePath)
    const order = await this.orderService.createOrderAsync(cliInputJson, privateKey)
    return order
  }
}

module.exports = OrderCreateCommand
