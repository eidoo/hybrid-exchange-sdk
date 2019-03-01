const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const DepositEthCommand = require('../../../commands/trading-wallet/DepositEthCommand')
const DepositEthCommandValidator = require('../../../validators/commands/trading-wallet/DepositEthCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)
const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build DepositEthCommandBuilder object.
 */
class DepositEthCommandBuilder {
  static build() {
    const depositEthCommandValidator = new DepositEthCommandValidator(logger)
    const depositEthCommand = new DepositEthCommand(logger, tradingWalletService,
      depositEthCommandValidator, privateKeyService, privateKeyValidator)
    return depositEthCommand
  }
}

module.exports = DepositEthCommandBuilder