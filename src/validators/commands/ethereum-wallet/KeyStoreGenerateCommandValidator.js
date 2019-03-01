const BaseValidator = require('../../BaseValidator')
const customJoiValidator = require('../../../utils/customJoiValidator')

const keyStoreGenerateCommandSchema = customJoiValidator.object()
  .keys({
    hdPath: customJoiValidator.string().required(),
    keyStoreFilePath: customJoiValidator.string().required(),
    keyStorePassword: customJoiValidator.string().required(),
    mnemonic: customJoiValidator.mnemonic().ethereumValidMnemonic().required(),
  })

class KeyStoreGenerateCommandValidator extends BaseValidator {
  keyStoreGenerate(keyStoreGenerateData) {
    return this.constructor.validate(keyStoreGenerateData, keyStoreGenerateCommandSchema)
  }
}

module.exports = KeyStoreGenerateCommandValidator
