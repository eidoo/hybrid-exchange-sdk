const Joi = require('@hapi/joi')
const customJoiValidator = require('../utils/customJoiValidator')

const BaseValidator = require('./BaseValidator')

const TransactionDraftSchema = customJoiValidator.object().keys({
  from: customJoiValidator.address().ethereum().required(),
  to: customJoiValidator.address().ethereum().required(),
  value: customJoiValidator.string().required(),
  data: customJoiValidator.hex0x().required(),
})

const TransactionObjectSchema = Joi.object().keys({
  from: customJoiValidator.address().ethereum().required(),
  to: customJoiValidator.address().ethereum().required(),
  value: customJoiValidator.string().required(),
  data: customJoiValidator.hex0x().required(),
  nonce: customJoiValidator.nonce().valid().required(),
  gas: customJoiValidator.gas().valid().required(),
  gasPrice: customJoiValidator.gas().valid().required(),
}).required()

class TransactionValidator extends BaseValidator {
  validateTransactionDraft(transactionDraft) {
    const errors = this.constructor.validateWithSchema(transactionDraft, TransactionDraftSchema)
    return errors
  }

  validateTransactionObject(transactionObject) {
    return this.constructor.validate(transactionObject, TransactionObjectSchema)
  }
}

module.exports = TransactionValidator
