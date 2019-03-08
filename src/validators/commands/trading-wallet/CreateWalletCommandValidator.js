const customJoiValidator = require('../../../utils/customJoiValidator')
const BaseValidator = require('../../BaseValidator')

const createWalletSchema = customJoiValidator.object()
  .keys({ personalWalletAddress: customJoiValidator.address().ethereum().required(),
    keystoreFilePath: customJoiValidator.path().existFile().required(),
    keystorePassword: customJoiValidator.string().required(),
    draft: customJoiValidator.boolean(),
    rawTx: customJoiValidator.boolean() })

class CreateWalletCommandValidator extends BaseValidator {
  createWallet(createWalletData) {
    return this.constructor.validate(createWalletData, createWalletSchema)
  }
}

module.exports = CreateWalletCommandValidator
