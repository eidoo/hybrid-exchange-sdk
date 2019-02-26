const { PrivateKeyService } = require('../services/PrivateKeyService')
const OrderService = require('../services/OrderService')
const logger = require('../logger')

const ApproveCommand = require('../commands/ApproveCommand')
const ApproveCommandValidator = require('../validators/ApproveCommandValidator')
const CreateWalletCommand = require('../commands/CreateWalletCommand')
const CreateWalletCommandValidator = require('../validators/CreateWalletCommandValidator')
const DepositEthCommand = require('./DepositEthCommand')
const DepositEthCommandValidator = require('../validators/DepositEthCommandValidator')
const DepositTokenCommand = require('./DepositTokenCommand')
const DepositTokenCommandValidator = require('../validators/DepositTokenCommandValidator')
const GetAddressCommand = require('../commands/GetAddressCommand')
const GetAddressCommandValidator = require('../validators/GetAddressCommandValidator')
const GetAllowanceCommand = require('../commands/GetAllowanceCommand')
const GetAllowanceCommandValidator = require('../validators/GetAllowanceCommandValidator')
const GetBalanceCommand = require('../commands/GetBalanceCommand')
const GetBalanceCommandValidator = require('../validators/GetBalanceCommandValidator')
const OrderCancelCommand = require('../commands/OrderCancelCommand')
const OrderCancelCommandValidator = require('../validators/OrderCancelCommandValidator')
const OrderSignCommand = require('../commands/OrderSignCommand')
const OrderSignCommandValidator = require('../validators/OrderSignCommandValidator')
const OrderSignerHelper = require('../helpers/OrderSignerHelper')
const PrivateKeyValidator = require('../validators/PrivateKeyValidator')
const TradingWalletServiceBuilder = require('../factories/TradingWalletServiceBuilder')
const WithdrawCommand = require('../commands/WithdrawCommand')
const WithdrawCommandValidator = require('../validators/WithdrawCommandValidator')

const approveCommandValidator = new ApproveCommandValidator(logger)
const createWalletCommandValidator = new CreateWalletCommandValidator(logger)
const depositEthCommandValidator = new DepositEthCommandValidator(logger)
const depositTokenCommandValidator = new DepositTokenCommandValidator(logger)
const getAddressCommandValidator = new GetAddressCommandValidator(logger)
const getAllowanceCommandValidator = new GetAllowanceCommandValidator(logger)
const getBalanceCommandValidator = new GetBalanceCommandValidator(logger)
const orderCancelCommandValidator = new OrderCancelCommandValidator(logger)
const orderSignCommandValidator = new OrderSignCommandValidator(logger)
const ordersignerHelper = new OrderSignerHelper(logger)
const orderService = new OrderService(logger)
const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)
const withdrawCommandValidator = new WithdrawCommandValidator(logger)

const tradingWalletService = TradingWalletServiceBuilder.build()

const getAddressCommand = new GetAddressCommand(logger, tradingWalletService,
  getAddressCommandValidator, privateKeyService, privateKeyValidator)

const getAllowanceCommand = new GetAllowanceCommand(logger,
  getAllowanceCommandValidator, privateKeyService, privateKeyValidator)

const getBalanceCommand = new GetBalanceCommand(logger, tradingWalletService,
  getBalanceCommandValidator, privateKeyService, privateKeyValidator)

const createWalletCommand = new CreateWalletCommand(logger, getAllowanceCommandValidator,
  createWalletCommandValidator, privateKeyService, privateKeyValidator)

const depositEthCommand = new DepositEthCommand(logger, tradingWalletService,
  depositEthCommandValidator, privateKeyService, privateKeyValidator)

const depositTokenCommand = new DepositTokenCommand(logger, tradingWalletService,
  depositTokenCommandValidator, privateKeyService, privateKeyValidator)

const signCommand = new OrderSignCommand(logger, ordersignerHelper, orderSignCommandValidator,
  privateKeyService, privateKeyValidator)

const withdrawCommand = new WithdrawCommand(logger, tradingWalletService, withdrawCommandValidator,
  privateKeyService, privateKeyValidator)

const approveCommand = new ApproveCommand(logger, approveCommandValidator,
  privateKeyService, privateKeyValidator)

const orderCancelCommand = new OrderCancelCommand(logger, orderService, orderCancelCommandValidator,
  privateKeyService, privateKeyValidator)

module.exports = {
  approveCommand,
  createWalletCommand,
  depositEthCommand,
  depositTokenCommand,
  getAddressCommand,
  getAllowanceCommand,
  getBalanceCommand,
  orderCancelCommand,
  signCommand,
  withdrawCommand,
}
