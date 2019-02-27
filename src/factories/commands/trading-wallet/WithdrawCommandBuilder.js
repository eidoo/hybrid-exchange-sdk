const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const WithdrawCommand = require('../../../commands/trading-wallet/WithdrawCommand')
const WithdrawCommandValidator = require('../../../validators/WithdrawCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)
const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build WithdrawCommandBuilder object.
 */
class WithdrawCommandBuilder {
  static build() {
    const withdrawCommandValidator = new WithdrawCommandValidator(logger)
    const withdrawCommand = new WithdrawCommand(logger, tradingWalletService, withdrawCommandValidator,
      privateKeyService, privateKeyValidator)
    return withdrawCommand
  }
}

module.exports = WithdrawCommandBuilder
