const logger = require('../../../logger')
const GetOwnerCommand = require('../../../commands/trading-wallet/GetOwnerCommand')
const GetOwnerCommandValidator = require('../../../validators/commands/trading-wallet/GetOwnerCommandValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build GetOwnerCommandBuilder object.
 */
class GetOwnerCommandBuilder {
  static build() {
    const getOwnerCommandValidator = new GetOwnerCommandValidator(logger)
    const getOwnerCommand = new GetOwnerCommand(logger, tradingWalletService,
      getOwnerCommandValidator)
    return getOwnerCommand
  }
}

module.exports = GetOwnerCommandBuilder
