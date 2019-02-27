const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const OrderSignCommand = require('../../../commands/order/OrderSignCommand')
const OrderSignCommandValidator = require('../../../validators/commands/order/OrderSignCommandValidator')
const OrderSignerHelper = require('../../../helpers/OrderSignerHelper')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const ordersignerHelper = new OrderSignerHelper(logger)
const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)

/**
 * Class representing a simple factory to build OrderSignCommandBuilder object.
 */
class OrderSignCommandBuilder {
  static build() {
    const orderSignCommandValidator = new OrderSignCommandValidator(logger)
    const signCommand = new OrderSignCommand(logger, ordersignerHelper, orderSignCommandValidator,
      privateKeyService, privateKeyValidator)
    return signCommand
  }
}

module.exports = OrderSignCommandBuilder
