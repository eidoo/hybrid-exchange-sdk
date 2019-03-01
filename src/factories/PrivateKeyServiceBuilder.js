const logger = require('../logger')
const { PrivateKeyService } = require('../services/PrivateKeyService')
const PrivateKeyValidator = require('../validators/PrivateKeyValidator')

const privateKeyValidator = new PrivateKeyValidator(logger)

/**
 * Class representing a simple factory to build PrivateKeyService object.
 */

class PrivateKeyServiceBuilder {
  static build() {
    return new PrivateKeyService(privateKeyValidator, logger)
  }
}

module.exports = PrivateKeyServiceBuilder
