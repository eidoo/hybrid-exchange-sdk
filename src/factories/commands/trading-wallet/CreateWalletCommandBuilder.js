const logger = require('../../../logger')
const CreateWalletCommand = require('../../../commands/trading-wallet/CreateWalletCommand')
const CreateWalletCommandValidator = require('../../../validators/commands/trading-wallet/CreateWalletCommandValidator')
const GetAllowanceCommandValidator = require('../../../validators/commands/token/GetAllowanceCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const PrivateKeyServiceBuilder = require('../../../../src/factories/PrivateKeyServiceBuilder')

const privateKeyService = PrivateKeyServiceBuilder.build()

const privateKeyValidator = new PrivateKeyValidator(logger)

/**
 * Class representing a simple factory to build CreateWalletCommand object.
 */
class CreateWalletCommandBuilder {
  static build() {
    const createWalletCommandValidator = new CreateWalletCommandValidator(logger)
    const getAllowanceCommandValidator = new GetAllowanceCommandValidator(logger)
    const createWalletCommand = new CreateWalletCommand(logger, getAllowanceCommandValidator,
      createWalletCommandValidator, privateKeyService, privateKeyValidator)
    return createWalletCommand
  }
}

module.exports = CreateWalletCommandBuilder
