const customJoiValidator = require('../../../utils/customJoiValidator')
const BaseValidator = require('../../BaseValidator')

const updateExchangeSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    keystoreFilePath: customJoiValidator.path().existFile().required(),
    keystorePassword: customJoiValidator.string().required(),
    exchange: customJoiValidator.address().ethereum().required(),
    draft: customJoiValidator.boolean(),
    rawTx: customJoiValidator.boolean(),
  })

class UpdateExchangeCommandValidator extends BaseValidator {
  updateExchange(updateExchangeData) {
    return this.constructor.validate(updateExchangeData, updateExchangeSchema)
  }
}

module.exports = UpdateExchangeCommandValidator
