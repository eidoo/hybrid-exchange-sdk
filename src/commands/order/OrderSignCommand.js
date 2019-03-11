const CredentialBasedCommand = require('../CredentialBasedCommand')
const CommandArg = require('../../models/CommandArg')
const validRequestType = require('../../models/Request').TYPES

/**
 * Class representing orderSignCommand. */

class OrderSignCommand extends CredentialBasedCommand {
  /**
   * Create a signer controller.
   * @param {Object} logger                    The logger helper.
   * @param {Object} orderSignerHelper         The order signer helper.
   * @param {Object} orderSignCommandValidator The orderSignCommand validator.
   * @param {Object} privateKeyService         The privateKeyService.
   * @param {Object} privateKeyValidator       The privateKeyValidator.
   *
   * @throws {TypeError}                   If some required property is missing.
   */
  constructor(logger, orderSignerHelper, orderSignCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!orderSignerHelper) {
      const errorMessage = `Invalid "orderSignerHelper" value: ${orderSignerHelper}`
      throw new TypeError(errorMessage)
    }
    this.orderSignerHelper = orderSignerHelper

    if (!orderSignCommandValidator) {
      const errorMessage = `Invalid "orderSignCommandValidator" value: ${orderSignCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.orderSignCommandValidator = orderSignCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()
    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It returns the signature of the given order object.'
  }

  setSynopsis() {
    let synopsis = 'sign '
    this.builderArgs.forEach((item) => {
      synopsis += item.getReprForSynopsys()
    })
    return synopsis
  }

  /**
   * It set the builder args necessary to set args cli command.
   */
  static setBuilderArgs() {
    const keystoreFilePathArg = new CommandArg('keystore-file-path',
      'string', 'ksp', 'The private key file path.', 1, true)
    const cliInputJSON = new CommandArg('cli-input-json',
      'string', 'cij', 'Performs service operation based on the JSON string provided.', 1, true)
    return [keystoreFilePathArg, cliInputJSON]
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
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.cliInputJSON     The order payload.
   */
  async doValidateAsync({ keystoreFilePath, cliInputJson }) {
    const keystorePassword = await this.promptKeyStorePasswordAsync()

    const cliInputJsonParsed = this.orderSignCommandValidator.jsonValidate(cliInputJson)

    const { type } = this.orderSignCommandValidator
      .signOrderType(cliInputJsonParsed)

    const params = type === validRequestType.creation
      ? this.orderSignCommandValidator.signOrderCreation(cliInputJsonParsed)
      : this.orderSignCommandValidator.signOrderCancellation(cliInputJsonParsed)

    return { keystoreFilePath, keystorePassword, cliInputJson: params }
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.keystorePassword The password to decrypt the keystore.
   * @param {String} params.cliInputJSON     The order payload.
   */
  async doExecuteAsync({ keystoreFilePath, keystorePassword, cliInputJson }) {
    const privateKey = await this.extractPrivateKeyFromKeystore(keystoreFilePath, keystorePassword)
    const { type, order } = cliInputJson

    return type === validRequestType.creation
      ? this.orderSignerHelper.signOrderCreate(order, privateKey)
      : this.orderSignerHelper.signOrderCancel(order.id, privateKey)
  }
}

module.exports = OrderSignCommand
