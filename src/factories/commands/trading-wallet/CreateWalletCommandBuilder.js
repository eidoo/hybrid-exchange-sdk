const logger = require('../../../logger')
const CreateWalletCommand = require('../../../commands/trading-wallet/CreateWalletCommand')
const CreateWalletCommandValidator = require('../../../validators/commands/trading-wallet/CreateWalletCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const PrivateKeyServiceBuilder = require('../../../../src/factories/PrivateKeyServiceBuilder')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const privateKeyService = PrivateKeyServiceBuilder.build()
const privateKeyValidator = new PrivateKeyValidator(logger)
const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build CreateWalletCommand object.
 */
class CreateWalletCommandBuilder {
  static build() {
    const createWalletCommandValidator = new CreateWalletCommandValidator(logger)
    const createWalletCommand = new CreateWalletCommand(logger, tradingWalletService,
      createWalletCommandValidator, privateKeyService, privateKeyValidator)
    return createWalletCommand
  }
}

module.exports = CreateWalletCommandBuilder
