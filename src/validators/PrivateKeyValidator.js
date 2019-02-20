const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const mnemonicSchema = customJoiValidator.mnemonic().ethereumValidMnemonic().required()

const privateKeySchema = customJoiValidator.object().keys({
  privateKey: customJoiValidator.privateKey().ethereumValidPrivateKey().required(),
})

const privateKeyFilePathSchema = customJoiValidator.object().keys({
  privateKeyFilePath: customJoiValidator.path()
    .existFile().required(),
})

class PrivateKeyValidator extends BaseValidator {
  validatePrivateKey(privateKey) {
    return this.constructor.validate(privateKey, privateKeySchema)
  }

  validateFilePath(privateKeyFilePath) {
    this.constructor.validate(privateKeyFilePath, privateKeyFilePathSchema)
    return privateKeyFilePath
  }

  validateMnemonic(mnemonic) {
    return this.constructor.validate(mnemonic, mnemonicSchema)
  }
}

module.exports = PrivateKeyValidator
