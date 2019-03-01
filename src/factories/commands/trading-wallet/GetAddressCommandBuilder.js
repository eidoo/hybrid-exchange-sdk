const logger = require('../../../logger')
const PrivateKeyServiceBuilder = require('../../../../src/factories/PrivateKeyServiceBuilder')
const GetAddressCommand = require('../../../commands/trading-wallet/GetAddressCommand')
const GetAddressCommandValidator = require('../../../validators/commands/trading-wallet/GetAddressCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const privateKeyService = PrivateKeyServiceBuilder.build()
const privateKeyValidator = new PrivateKeyValidator(logger)
const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build GetAddressCommandBuilder object.
 */
class GetAddressCommandBuilder {
  static build() {
    const getAddressCommandValidator = new GetAddressCommandValidator(logger)
    const getAddressCommand = new GetAddressCommand(logger, tradingWalletService,
      getAddressCommandValidator, privateKeyService, privateKeyValidator)
    return getAddressCommand
  }
}

module.exports = GetAddressCommandBuilder
