const { PrivateKeyService } = require('../services/PrivateKeyService')
const CreateWalletCommand = require('../commands/CreateWalletCommand')
const CreateWalletCommandValidator = require('../validators/CreateWalletCommandValidator')
const GetAddressCommand = require('../commands/GetAddressCommand')
const GetAddressCommandValidator = require('../validators/GetAddressCommandValidator')
const logger = require('../logger')
const OrderSignCommand = require('../commands/OrderSignCommand')
const OrderSignCommandValidator = require('../validators/OrderSignCommandValidator')
const OrderSignerHelper = require('../helpers/OrderSignerHelper')
const PrivateKeyValidator = require('../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../factories/TradingWalletServiceBuilder')
const WithdrawCommand = require('../commands/WithdrawCommand')
const WithdrawCommandValidator = require('../validators/WithdrawCommandValidator')

const createWalletCommandValidator = new CreateWalletCommandValidator(logger)
const getAddressCommandValidator = new GetAddressCommandValidator(logger)
const orderSignCommandValidator = new OrderSignCommandValidator(logger)
const withdrawCommandValidator = new WithdrawCommandValidator(logger)

const ordersignerHelper = new OrderSignerHelper(logger)
const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)

const tradingWalletService = TradingWalletServiceBuilder.build()

const getAddressCommand = new GetAddressCommand(logger, tradingWalletService,
  getAddressCommandValidator, privateKeyService, privateKeyValidator)

const createWalletCommand = new CreateWalletCommand(logger, tradingWalletService,
  createWalletCommandValidator, privateKeyService, privateKeyValidator)

const signCommand = new OrderSignCommand(logger, ordersignerHelper, orderSignCommandValidator,
  privateKeyService, privateKeyValidator)

const withdrawCommand = new WithdrawCommand(logger, tradingWalletService, withdrawCommandValidator,
  privateKeyService, privateKeyValidator)

module.exports = {
  createWalletCommand,
  getAddressCommand,
  signCommand,
  withdrawCommand,
}
