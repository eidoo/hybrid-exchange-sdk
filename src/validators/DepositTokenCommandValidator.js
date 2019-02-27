const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const depositTokenSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    quantity: customJoiValidator.bigNumber().valid().required(),
    token: customJoiValidator.address().ethereum().required(),
    privateKeyFilePath: customJoiValidator.path().existFile().required(),
    draft: customJoiValidator.boolean(),
    withApprove: customJoiValidator.boolean().required(),
  })

class DepositTokenCommandValidator extends BaseValidator {
  depositToken(depositTokenData) {
    return this.constructor.validate(depositTokenData, depositTokenSchema)
  }
}

module.exports = DepositTokenCommandValidator
