const logger = require('../../../logger')
const PrivateKeyServiceBuilder = require('../../../../src/factories/PrivateKeyServiceBuilder')
const GetAllowanceCommand = require('../../../commands/token/GetAllowanceCommand')
const GetAllowanceCommandValidator = require('../../../validators/commands/token/GetAllowanceCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const privateKeyService = PrivateKeyServiceBuilder.build()
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
