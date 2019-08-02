const customJoiValidator = require('../../../utils/customJoiValidator')
const BaseValidator = require('../../BaseValidator')

const getOwnerSchema = customJoiValidator.object()
  .keys({
    from: customJoiValidator.address().ethereum().required(),
    to: customJoiValidator.address().ethereum().required(),
    draft: customJoiValidator.boolean(),
  })

class GetOwnerCommandValidator extends BaseValidator {
  getOwner(getOwnerData) {
    return this.constructor.validate(getOwnerData, getOwnerSchema)
  }
}

module.exports = GetOwnerCommandValidator
