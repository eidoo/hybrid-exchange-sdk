const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const withdrawSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    token: customJoiValidator.address().ethereum().required(),
    draft: customJoiValidator.boolean(),
  })

class GetTradingWalletBalanceCommandValidator extends BaseValidator {
  getBalance(getBalanceData) {
    return this.constructor.validate(getBalanceData, withdrawSchema)
  }
}

module.exports = GetTradingWalletBalanceCommandValidator
