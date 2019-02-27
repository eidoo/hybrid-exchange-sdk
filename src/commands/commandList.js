const ApproveCommandBuilder = require('../factories/commands/ApproveCommandBuilder')
const CreateWalletCommandBuilder = require('../factories/commands/CreateWalletCommandBuilder')
const DepositEthCommandBuilder = require('../factories/commands/DepositEthCommandBuilder')
const DepositTokenCommandBuilder = require('../factories/commands/DepositTokenCommandBuilder')
const GetAddressCommandBuilder = require('../factories/commands/GetAddressCommandBuilder')
const GetAllowanceCommandBuilder = require('../factories/commands/GetAllowanceCommandBuilder')
const GetBalanceCommandBuilder = require('../factories/commands/GetBalanceCommandBuilder')
const OrderCancelCommandBuilder = require('../factories/commands/OrderCancelCommandBuilder')
const OrderSignCommandBuilder = require('../factories/commands/OrderSignCommandBuilder')
const WithdrawCommandBuilder = require('../factories/commands/WithdrawCommandBuilder')

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
