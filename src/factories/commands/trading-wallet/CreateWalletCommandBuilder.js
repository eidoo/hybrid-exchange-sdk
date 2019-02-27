const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const CreateWalletCommand = require('../../../commands/trading-wallet/CreateWalletCommand')
const CreateWalletCommandValidator = require('../../../validators/CreateWalletCommandValidator')
const GetAllowanceCommandValidator = require('../../../validators/GetAllowanceCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const privateKeyService = new PrivateKeyService(logger)
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
