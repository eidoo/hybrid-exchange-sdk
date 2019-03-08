const logger = require('../../../logger')
const GetAddressCommand = require('../../../commands/trading-wallet/GetAddressCommand')
const GetAddressCommandValidator = require('../../../validators/commands/trading-wallet/GetAddressCommandValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build GetAddressCommandBuilder object.
 */
class GetAddressCommandBuilder {
  static build() {
    const getAddressCommandValidator = new GetAddressCommandValidator(logger)
    const getAddressCommand = new GetAddressCommand(logger, tradingWalletService, getAddressCommandValidator)
    return getAddressCommand
  }
}

module.exports = GetAddressCommandBuilder
