const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const mnemonicSchema = customJoiValidator.mnemonic().ethereumValidMnemonic().required()

const privateKeySchema = customJoiValidator.object().keys({
  privateKey: customJoiValidator.privateKey().ethereumValidPrivateKey().required(),
})

// TODO: to be removed as soon as the migration to keystore is finished
const privateKeyFilePathSchema = customJoiValidator.object().keys({
  privateKeyFilePath: customJoiValidator.path()
    .existFile().required(),
})

const keystoreFilePathSchema = customJoiValidator.object().keys({
  keystoreFilePath: customJoiValidator.path()
    .existFile().required(),
})

class PrivateKeyValidator extends BaseValidator {
  validatePrivateKey(privateKey) {
    return this.constructor.validate(privateKey, privateKeySchema)
  }

  // TODO: to be removed as soon as the migration to keystore is finished
  validateFilePath(privateKeyFilePath) {
    this.constructor.validate(privateKeyFilePath, privateKeyFilePathSchema)
    return privateKeyFilePath
  }

  validateKeystoreFilePath(keystoreFilePath) {
    this.constructor.validate(keystoreFilePath, keystoreFilePathSchema)
    return keystoreFilePath
  }

  validateMnemonic(mnemonic) {
    return this.constructor.validate(mnemonic, mnemonicSchema)
  }
}

module.exports = PrivateKeyValidator
