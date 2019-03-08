const BaseValidator = require('../../BaseValidator')
const customJoiValidator = require('../../../utils/customJoiValidator')

const orderCancelCommandSchema = customJoiValidator.object()
  .keys({ orderId: customJoiValidator.string().required(),
    keystoreFilePath: customJoiValidator.path().existFile().required(),
    keystorePassword: customJoiValidator.string().required() })

class OrderCancelCommandValidator extends BaseValidator {
  orderCancel(cancelOrderData) {
    return this.constructor.validate(cancelOrderData, orderCancelCommandSchema)
  }
}

module.exports = OrderCancelCommandValidator
