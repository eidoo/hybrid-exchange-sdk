const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const withdrawSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    privateKeyFilePath: customJoiValidator.path().existFile(),
    quantity: customJoiValidator.bigNumber().valid().required(),
    token: customJoiValidator.address().ethereum().required(),
    draft: customJoiValidator.boolean(),
    rawTx: customJoiValidator.boolean(),
  })

class WithdrawCommandValidator extends BaseValidator {
  withdraw(withdrawData) {
    return this.constructor.validate(withdrawData, withdrawSchema)
  }
}

module.exports = WithdrawCommandValidator
