const ApproveCommand = require('../../../commands/trading-wallet/ApproveCommand')
const ApproveCommandValidator = require('../../../validators/ApproveCommandValidator')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const logger = require('../../../logger')

const privateKeyService = new PrivateKeyService(logger)
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
