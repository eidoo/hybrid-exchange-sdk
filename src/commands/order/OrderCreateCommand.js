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
    const keystoreFilePathArg = new CommandArg('keystore-file-path',
      'string', 'ksp', 'The private key file path.', 1, true)
    return [cliInputJsonArg, keystoreFilePathArg]
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
   * @param {String} params.keystoreFilePath The keystore file path.
   */
  async doValidateAsync({ cliInputJson, keystoreFilePath }) {
    const keystorePassword = await this.promptKeyStorePasswordAsync()
    const params = this.orderCreateCommandValidator.orderCreate({
      cliInputJson,
      keystoreFilePath,
      keystorePassword,
    })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.cliInputJson       The order create command payload.
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.keystorePassword The password to decrypt the keystore.
   */
  async doExecuteAsync({ cliInputJson, keystoreFilePath, keystorePassword }) {
    const privateKey = await this.extractPrivateKeyFromKeystore(keystoreFilePath, keystorePassword)
    const order = await this.orderService.createOrderAsync(cliInputJson, privateKey)
    return order
  }
}

module.exports = OrderCreateCommand
