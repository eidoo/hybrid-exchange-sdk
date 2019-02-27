const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const OrderCancelCommand = require('../../../commands/order/OrderCancelCommand')
const OrderCancelCommandValidator = require('../../../validators/OrderCancelCommandValidator')
const OrderService = require('../../../services/OrderService')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const orderService = new OrderService(logger)
const privateKeyService = new PrivateKeyService(logger)
const privateKeyValidator = new PrivateKeyValidator(logger)

/**
 * Class representing a simple factory to build OrderCancelCommandBuilder object.
 */
class OrderCancelCommandBuilder {
  static build() {
    const orderCancelCommandValidator = new OrderCancelCommandValidator(logger)
    const orderCancelCommand = new OrderCancelCommand(logger, orderService, orderCancelCommandValidator,
      privateKeyService, privateKeyValidator)
    return orderCancelCommand
  }
}

module.exports = OrderCancelCommandBuilder
