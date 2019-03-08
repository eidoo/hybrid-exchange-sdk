const logger = require('../../../logger')
const GetBalanceCommand = require('../../../commands/trading-wallet/GetBalanceCommand')
const GetBalanceCommandValidator = require('../../../validators/commands/trading-wallet/GetBalanceCommandValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build GetBalanceCommandBuilder object.
 */
class GetBalanceCommandBuilder {
  static build() {
    const getBalanceCommandValidator = new GetBalanceCommandValidator(logger)
    const getBalanceCommand = new GetBalanceCommand(logger, tradingWalletService,
      getBalanceCommandValidator)
    return getBalanceCommand
  }
}

module.exports = GetBalanceCommandBuilder
