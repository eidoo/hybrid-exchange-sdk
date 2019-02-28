const ApproveCommandBuilder = require('../factories/commands/token/ApproveCommandBuilder')
const CreateWalletCommandBuilder = require('../factories/commands/trading-wallet/CreateWalletCommandBuilder')
const DepositEthCommandBuilder = require('../factories/commands/trading-wallet/DepositEthCommandBuilder')
const DepositTokenCommandBuilder = require('../factories/commands/trading-wallet/DepositTokenCommandBuilder')
const GetAddressCommandBuilder = require('../factories/commands/trading-wallet/GetAddressCommandBuilder')
const GetAllowanceCommandBuilder = require('../factories/commands/token/GetAllowanceCommandBuilder')
const GetBalanceCommandBuilder = require('../factories/commands/trading-wallet/GetBalanceCommandBuilder')
const OrderCancelCommandBuilder = require('../factories/commands/order/OrderCancelCommandBuilder')
const OrderSignCommandBuilder = require('../factories/commands/order/OrderSignCommandBuilder')
const WithdrawCommandBuilder = require('../factories/commands/trading-wallet/WithdrawCommandBuilder')

const approveCommand = ApproveCommandBuilder.build()
const createWalletCommand = CreateWalletCommandBuilder.build()
const depositEthCommand = DepositEthCommandBuilder.build()
const depositTokenCommand = DepositTokenCommandBuilder.build()
const getAddressCommand = GetAddressCommandBuilder.build()
const getAllowanceCommand = GetAllowanceCommandBuilder.build()
const getBalanceCommand = GetBalanceCommandBuilder.build()
const orderCancelCommand = OrderCancelCommandBuilder.build()
const signCommand = OrderSignCommandBuilder.build()
const withdrawCommand = WithdrawCommandBuilder.build()

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
