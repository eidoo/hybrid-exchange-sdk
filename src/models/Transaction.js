const ValidationError = require('../validators/ValidationError')

const DEFAULT_VALUE_FIELD = '0x0'

class TransactionObject {
  constructor (data, from, gas, gasPrice, nonce, to, value = DEFAULT_VALUE_FIELD) {
    this.data = data
    this.from = from
    this.gas = gas
    this.nonce = nonce
    this.to = to
    this.value = value
    this.gasPrice = gasPrice
  }
}

class TransactionObjectDraft {
  constructor (data, from, to, value = DEFAULT_VALUE_FIELD) {
    this.data = data
    this.from = from
    this.to = to
    this.value = value
  }
}
class TransactionObjectDraftFactory {
  constructor(transactionValidator) {
    if (!transactionValidator) {
      const errorMessage = `Invalid "transactionValidator" value: ${transactionValidator}`
      this.throwError(errorMessage)
    }
    this.transactionValidator = transactionValidator
  }

  create({ data, from, to, value = DEFAULT_VALUE_FIELD }) {
    const validationErrors = this.transactionValidator.validateTransactionDraft({ data, from, to, value })
    if (validationErrors) {
      throw new ValidationError(`Validation error during TransactionObjectDraft creation, errors: ${validationErrors}`)
    }
    return new TransactionObjectDraft(data, from, to, value)
  }
}

module.exports = {
  TransactionObject,
  TransactionObjectDraft,
  TransactionObjectDraftFactory,
}
