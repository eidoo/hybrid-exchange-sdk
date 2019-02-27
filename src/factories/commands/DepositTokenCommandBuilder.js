const logger = require('../../logger')
const { PrivateKeyService } = require('../../services/PrivateKeyService')

const DepositTokenCommand = require('../../commands/trading-wallet/DepositTokenCommand')
const DepositTokenCommandValidator = require('../../validators/DepositTokenCommandValidator')
const PrivateKeyValidator = require('../../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../TradingWalletServiceBuilder')

const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)
const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build DepositTokenCommandBuilder object.
 */
class DepositTokenCommandBuilder {
  static build() {
    const depositTokenCommandValidator = new DepositTokenCommandValidator(logger)
    const depositTokenCommand = new DepositTokenCommand(logger, tradingWalletService,
      depositTokenCommandValidator, privateKeyService, privateKeyValidator)
    return depositTokenCommand
  }
}

module.exports = DepositTokenCommandBuilder
