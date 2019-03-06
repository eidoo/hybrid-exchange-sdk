const BaseValidator = require('../../BaseValidator')
const customJoiValidator = require('../../../utils/customJoiValidator')

const keyStoreGenerateCommandSchema = customJoiValidator.object()
  .keys({
    hdPath: customJoiValidator.string().required(),
    keystoreFilePath: customJoiValidator.string().required(),
    keystorePassword: customJoiValidator.string().required(),
    mnemonic: customJoiValidator.mnemonic().ethereumValidMnemonic().required(),
  })

class KeyStoreGenerateCommandValidator extends BaseValidator {
  keyStoreGenerate(keyStoreGenerateData) {
    return this.constructor.validate(keyStoreGenerateData, keyStoreGenerateCommandSchema)
  }
}

module.exports = KeyStoreGenerateCommandValidator
