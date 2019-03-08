const customJoiValidator = require('../../../utils/customJoiValidator')
const BaseValidator = require('../../BaseValidator')

const getAllowanceSchema = customJoiValidator.object()
  .keys({
    owner: customJoiValidator.address().ethereum().required(),
    spender: customJoiValidator.address().ethereum().required(),
    token: customJoiValidator.address().ethereum().required(),
    draft: customJoiValidator.boolean(),
  })

class GetAllowanceCommandValidator extends BaseValidator {
  getAllowance(getAllowanceData) {
    return this.constructor.validate(getAllowanceData, getAllowanceSchema)
  }
}

module.exports = GetAllowanceCommandValidator
