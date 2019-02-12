const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const createWalletSchema = customJoiValidator.object()
  .keys({ personalWalletAddress: customJoiValidator.address().ethereum().required(),
    privateKeyPath: customJoiValidator.path().existFile(),
    draft: customJoiValidator.boolean(),
    rawTx: customJoiValidator.boolean() })

class CreateWalletCommandValidator extends BaseValidator {
  createWallet(createWalletData) {
    return this.constructor.validate(createWalletData, createWalletSchema)
  }
}

module.exports = CreateWalletCommandValidator
