const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const GetAllowanceCommand = require('../../../commands/token/GetAllowanceCommand')
const GetAllowanceCommandValidator = require('../../../validators/commands/token/GetAllowanceCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)

/**
 * Class representing a simple factory to build GetAllowanceCommandBuilder object.
 */
class GetAllowanceCommandBuilder {
  static build() {
    const getAllowanceCommandValidator = new GetAllowanceCommandValidator(logger)
    const getAllowanceCommand = new GetAllowanceCommand(logger,
      getAllowanceCommandValidator, privateKeyService, privateKeyValidator)
    return getAllowanceCommand
  }
}

module.exports = GetAllowanceCommandBuilder
