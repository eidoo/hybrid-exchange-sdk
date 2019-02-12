const customJoiValidator = require('../utils/customJoiValidator')
const BaseValidator = require('./BaseValidator')

const privateKeySchema = customJoiValidator.object().keys({
  privateKey: customJoiValidator.privateKey().ethereumValidPrivateKey().required(),
})

const privateKeyPathSchema = customJoiValidator.object().keys({
  privateKeyPath: customJoiValidator.path()
    .existFile().required(),
})

class PrivateKeyValidator extends BaseValidator {
  validatePrivateKey(privateKey) {
    return this.constructor.validate(privateKey, privateKeySchema)
  }

  validatePath(privateKeyPath) {
    this.constructor.validate(privateKeyPath, privateKeyPathSchema)
    return privateKeyPath
  }
}

module.exports = PrivateKeyValidator
