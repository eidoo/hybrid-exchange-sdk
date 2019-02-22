const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const depositEthSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    privateKeyFilePath: customJoiValidator.path().existFile(),
    quantity: customJoiValidator.bigNumber().valid().required(),
    draft: customJoiValidator.boolean(),
    rawTx: customJoiValidator.boolean(),
  })

class DepositEthCommandValidator extends BaseValidator {
  depositEth(depositEthData) {
    return this.constructor.validate(depositEthData, depositEthSchema)
  }
}

module.exports = DepositEthCommandValidator
