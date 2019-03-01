const logger = require('../../../logger')
const DepositEthCommand = require('../../../commands/trading-wallet/DepositEthCommand')
const DepositEthCommandValidator = require('../../../validators/commands/trading-wallet/DepositEthCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')
const PrivateKeyServiceBuilder = require('../../../../src/factories/PrivateKeyServiceBuilder')

const privateKeyService = PrivateKeyServiceBuilder.build()
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
