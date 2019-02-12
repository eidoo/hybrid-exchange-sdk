const BaseValidator = require('./BaseValidator')
const customJoiValidator = require('../utils/customJoiValidator')

const getTradingWalletAddressSchema = customJoiValidator.object()
  .keys({ personalWalletAddress: customJoiValidator.address().ethereum().required(),
    privateKeyPath: customJoiValidator.path().existFile(),
    draft: customJoiValidator.boolean() })


class GetAddressCommandValidator extends BaseValidator {
  getTradingWalletAddress(getTradingWalletAddressData) {
    return this.constructor.validate(getTradingWalletAddressData, getTradingWalletAddressSchema)
  }
}

module.exports = GetAddressCommandValidator
