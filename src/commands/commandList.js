const ApproveCommandBuilder = require('../factories/commands/token/ApproveCommandBuilder')
const CreateWalletCommandBuilder = require('../factories/commands/trading-wallet/CreateWalletCommandBuilder')
const DepositEthCommandBuilder = require('../factories/commands/trading-wallet/DepositEthCommandBuilder')
const DepositTokenCommandBuilder = require('../factories/commands/trading-wallet/DepositTokenCommandBuilder')
const GetAddressCommandBuilder = require('../factories/commands/trading-wallet/GetAddressCommandBuilder')
const GetAllowanceCommandBuilder = require('../factories/commands/token/GetAllowanceCommandBuilder')
const GetBalanceCommandBuilder = require('../factories/commands/trading-wallet/GetBalanceCommandBuilder')
const OrderCancelCommandBuilder = require('../factories/commands/order/OrderCancelCommandBuilder')
const OrderCreateCommandBuilder = require('../factories/commands/order/OrderCreateCommandBuilder')
const OrderSignCommandBuilder = require('../factories/commands/order/OrderSignCommandBuilder')
const UpdateExchangeCommandBuilder = require('../factories/commands/trading-wallet/UpdateExchangeCommandBuilder')
const WithdrawCommandBuilder = require('../factories/commands/trading-wallet/WithdrawCommandBuilder')
const KeyStoreGenerateCommandBuilder = require('../factories/commands/ehtereum-wallet/KeyStoreGenerateCommandBuilder')

const approveCommand = ApproveCommandBuilder.build()
const createWalletCommand = CreateWalletCommandBuilder.build()
const depositEthCommand = DepositEthCommandBuilder.build()
const depositTokenCommand = DepositTokenCommandBuilder.build()
const getAddressCommand = GetAddressCommandBuilder.build()
const getAllowanceCommand = GetAllowanceCommandBuilder.build()
const getBalanceCommand = GetBalanceCommandBuilder.build()
const keyStoreGenerateCommand = KeyStoreGenerateCommandBuilder.build()
const orderCancelCommand = OrderCancelCommandBuilder.build()
const orderCreateCommand = OrderCreateCommandBuilder.build()
const signCommand = OrderSignCommandBuilder.build()
const updateExchangeCommand = UpdateExchangeCommandBuilder.build()
const withdrawCommand = WithdrawCommandBuilder.build()

module.exports = {
  approveCommand,
  createWalletCommand,
  depositEthCommand,
  depositTokenCommand,
  getAddressCommand,
  getAllowanceCommand,
  getBalanceCommand,
  keyStoreGenerateCommand,
  orderCancelCommand,
  orderCreateCommand,
  signCommand,
  updateExchangeCommand,
  withdrawCommand,
}
