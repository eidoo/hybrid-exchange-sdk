const logger = require('../../../logger')
const GetExchangeCommand = require('../../../commands/trading-wallet/GetExchangeCommand')
const GetExchangeCommandValidator = require('../../../validators/commands/trading-wallet/GetExchangeCommandValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build GetExchangeCommandBuilder object.
 */
class GetExchangeCommandBuilder {
  static build() {
    const getExchangeCommandValidator = new GetExchangeCommandValidator(logger)
    const getExchangeCommand = new GetExchangeCommand(logger, tradingWalletService,
      getExchangeCommandValidator)
    return getExchangeCommand
  }
}

module.exports = GetExchangeCommandBuilder
