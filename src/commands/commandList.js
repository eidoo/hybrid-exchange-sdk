const Web3 = require('web3')

const logger = require('../logger')
const GetAddressCommandValidator = require('../validators/GetAddressCommandValidator')
const GetAddressCommand = require('../commands/GetAddressCommand')
const CreateWalletCommandValidator = require('../validators/CreateWalletCommandValidator')
const CreateWalletCommand = require('../commands/CreateWalletCommand')
const OrderSignCommand = require('../commands/OrderSignCommand')
const { PrivateKeyService } = require('../services/PrivateKeyService')
const PrivateKeyValidator = require('../validators/PrivateKeyValidator')
const OrderSignCommandValidator = require('../validators/OrderSignCommandValidator')
const OrderSignerHelper = require('../helpers/OrderSignerHelper')
const TradingWalletService = require('../services/TradingWalletService')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const createWalletCommandValidator = new CreateWalletCommandValidator(logger)
const getAddressCommandValidator = new GetAddressCommandValidator(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)
const orderSignCommandValidator = new OrderSignCommandValidator(logger)

const tradingWalletService = new TradingWalletService(web3)
const privateKeyService = new PrivateKeyService(logger)
const ordersignerHelper = new OrderSignerHelper(logger)

const getAddressCommand = new GetAddressCommand(logger, tradingWalletService,
  getAddressCommandValidator, privateKeyService, privateKeyValidator)

const createWalletCommand = new CreateWalletCommand(logger, tradingWalletService,
  createWalletCommandValidator, privateKeyService, privateKeyValidator)

const signCommand = new OrderSignCommand(logger, ordersignerHelper, orderSignCommandValidator,
  privateKeyService, privateKeyValidator)

module.exports = {
  createWalletCommand,
  getAddressCommand,
  signCommand,
}
