const customJoiValidator = require('../../../utils/customJoiValidator')
const BaseValidator = require('../../BaseValidator')

const getExchangeSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    draft: customJoiValidator.boolean(),
  })

class GetExchangeCommandValidator extends BaseValidator {
  getExchange(getExchangeData) {
    return this.constructor.validate(getExchangeData, getExchangeSchema)
  }
}

module.exports = GetExchangeCommandValidator
