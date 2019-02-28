const BaseValidator = require('../../BaseValidator')
const customJoiValidator = require('../../../utils/customJoiValidator')


const orderCreateCommandSchema = customJoiValidator.object().keys({
  cliInputJson: customJoiValidator.json().valid().required(),
  privateKeyFilePath: customJoiValidator.path().existFile().required(),
})

class OrderCreateCommandValidator extends BaseValidator {
  orderCreate(createOrderData) {
    return this.constructor.validate(createOrderData, orderCreateCommandSchema)
  }
}

module.exports = OrderCreateCommandValidator
