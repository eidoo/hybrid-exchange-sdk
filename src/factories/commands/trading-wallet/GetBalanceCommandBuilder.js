const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const GetBalanceCommand = require('../../../commands/trading-wallet/GetBalanceCommand')
const GetBalanceCommandValidator = require('../../../validators/commands/trading-wallet/GetBalanceCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../../TradingWalletServiceBuilder')

const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)
const tradingWalletService = TradingWalletServiceBuilder.build()

/**
 * Class representing a simple factory to build GetBalanceCommandBuilder object.
 */
class GetBalanceCommandBuilder {
  static build() {
    const getBalanceCommandValidator = new GetBalanceCommandValidator(logger)
    const getBalanceCommand = new GetBalanceCommand(logger, tradingWalletService,
      getBalanceCommandValidator, privateKeyService, privateKeyValidator)
    return getBalanceCommand
  }
}

module.exports = GetBalanceCommandBuilder
