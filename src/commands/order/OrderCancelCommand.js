const CredentialBasedCommand = require('../CredentialBasedCommand')
const CommandArg = require('../../models/CommandArg')

/**
 * Class representing OrderCancelCommand. */
class OrderCancelCommand extends CredentialBasedCommand {
  /**
   * Create a OrderCancelCommand controller.
   * @param {Object} logger                      The logger helper.
   * @param {Object} orderService                The order service.
   * @param {Object} orderCancelCommandValidator The orderCancelCommandValidator.
   * @param {Object} privateKeyService           The privateKeyService.
   * @param {Object} privateKeyValidator         The privateKeyValidator.
   * @throws {TypeError}                         If some required property is missing.
   */
  constructor(logger, orderService, orderCancelCommandValidator,
    privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!orderService) {
      const errorMessage = `Invalid "orderService" value: ${orderService}`
      throw new TypeError(errorMessage)
    }
    this.orderService = orderService

    if (!orderCancelCommandValidator) {
      const errorMessage = `Invalid "orderCancelCommandValidator" value: ${orderCancelCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.orderCancelCommandValidator = orderCancelCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It cancel order from Eidoo hybrid exchange.'
  }

  setSynopsis() {
    let synopsis = 'cancel '
    this.builderArgs.forEach((item) => {
      synopsis += item.getReprForSynopsys()
    })
    return synopsis
  }

  /**
   * It set the builder args necessary to set args cli command.
   */
  static setBuilderArgs() {
    const orderId = new CommandArg('order-id',
      'string', 'id', 'The order id to cancel.', 1, true)
    const keystoreFilePathArg = new CommandArg('keystore-file-path',
      'string', 'ksp', 'The private key file path.', 1, true)
    return [orderId, keystoreFilePathArg]
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
   * @param {String} params.orderId           The orderId.
   * @param {String} params.keystoreFilePath  The keystore file path.
   */
  async doValidateAsync({ orderId, keystoreFilePath }) {
    const keystorePassword = await this.promptKeyStorePasswordAsync()
    const params = this.orderCancelCommandValidator.orderCancel({ orderId, keystoreFilePath, keystorePassword })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.orderId            The orderId.
   * @param {String} params.keystoreFilePath The keystore file path.
   * @param {String} params.keystorePassword The password to decrypt the keystore.
   */
  async doExecuteAsync({ orderId, keystoreFilePath, keystorePassword }) {
    const privateKey = await this.extractPrivateKeyFromKeystore(keystoreFilePath, keystorePassword)
    const cancelledOrderId = await this.orderService.cancelOrderAsync(orderId, privateKey)
    return cancelledOrderId
  }
}

module.exports = OrderCancelCommand
