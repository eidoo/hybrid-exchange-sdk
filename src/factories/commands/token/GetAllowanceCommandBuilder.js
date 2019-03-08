const logger = require('../../../logger')
const GetAllowanceCommand = require('../../../commands/token/GetAllowanceCommand')
const GetAllowanceCommandValidator = require('../../../validators/commands/token/GetAllowanceCommandValidator')

/**
 * Class representing a simple factory to build GetAllowanceCommandBuilder object.
 */
class GetAllowanceCommandBuilder {
  static build() {
    const getAllowanceCommandValidator = new GetAllowanceCommandValidator(logger)
    const getAllowanceCommand = new GetAllowanceCommand(logger, getAllowanceCommandValidator)
    return getAllowanceCommand
  }
}

module.exports = GetAllowanceCommandBuilder
