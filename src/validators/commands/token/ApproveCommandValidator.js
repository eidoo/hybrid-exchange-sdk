const customJoiValidator = require('../../../utils/customJoiValidator')
const BaseValidator = require('../../BaseValidator')

const approveSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    quantity: customJoiValidator.bigNumber().valid().required(),
    spender: customJoiValidator.address().ethereum().required(),
    keystoreFilePath: customJoiValidator.path().existFile().required(),
    keystorePassword: customJoiValidator.string().required(),
    draft: customJoiValidator.boolean(),
    rawTx: customJoiValidator.boolean(),
  })

class ApproveCommandValidator extends BaseValidator {
  approve(approveData) {
    return this.constructor.validate(approveData, approveSchema)
  }
}

module.exports = ApproveCommandValidator
