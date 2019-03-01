const logger = require('../../../logger')
const PrivateKeyServiceBuilder = require('../../../../src/factories/PrivateKeyServiceBuilder')
const OrderCreateCommand = require('../../../commands/order/OrderCreateCommand')
const OrderCreateCommandValidator = require('../../../validators/commands/order/OrderCreateCommandValidator')
const OrderService = require('../../../services/OrderService')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const orderService = new OrderService(logger)

const privateKeyService = PrivateKeyServiceBuilder.build()

const privateKeyValidator = new PrivateKeyValidator(logger)

/**
 * Class representing a simple factory to build OrderCreateCommandBuilder object.
 */
class OrderCreateCommandBuilder {
  static build() {
    const orderCreateCommandValidator = new OrderCreateCommandValidator(logger)
    const orderCreateCommand = new OrderCreateCommand(logger, orderService, orderCreateCommandValidator,
      privateKeyService, privateKeyValidator)
    return orderCreateCommand
  }
}

module.exports = OrderCreateCommandBuilder
