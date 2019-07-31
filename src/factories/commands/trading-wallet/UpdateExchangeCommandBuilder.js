const logger = require('../../../logger')
const PrivateKeyServiceBuilder = require('../../../../src/factories/PrivateKeyServiceBuilder')
const UpdateExchangeCommand = require('../../../commands/trading-wallet/UpdateExchangeCommand')
const UpdateExchangeCommandCommandValidator = require('../../../validators/commands/trading-wallet/UpdateExchangeCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const privateKeyService = PrivateKeyServiceBuilder.build()
const privateKeyValidator = new PrivateKeyValidator(logger)
const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build UpdateExchangeCommandBuilder object.
 */
class UpdateExchangeCommandBuilder {
  static build() {
    const updateExchangeCommandValidator = new UpdateExchangeCommandCommandValidator(logger)
    const updateExchangeCommand = new UpdateExchangeCommand(logger, tradingWalletService, updateExchangeCommandValidator,
      privateKeyService, privateKeyValidator)
    return updateExchangeCommand
  }
}

module.exports = UpdateExchangeCommandBuilder
