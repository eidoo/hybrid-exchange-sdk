const ApproveCommand = require('../../../commands/token/ApproveCommand')
const ApproveCommandValidator = require('../../../validators/commands/token/ApproveCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const PrivateKeyServiceBuilder = require('../../../factories/PrivateKeyServiceBuilder')
const logger = require('../../../logger')

const privateKeyService = PrivateKeyServiceBuilder.build()
const privateKeyValidator = new PrivateKeyValidator(logger)

/**
 * Class representing a simple factory to build ApproveCommandBuilder object.
 */
class ApproveCommandBuilder {
  static build() {
    const approveCommandValidator = new ApproveCommandValidator(logger)
    const approveCommand = new ApproveCommand(logger, approveCommandValidator,
      privateKeyService, privateKeyValidator)
    return approveCommand
  }
}

module.exports = ApproveCommandBuilder
