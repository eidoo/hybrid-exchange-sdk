const logger = require('../../../logger')
const { PrivateKeyService } = require('../../../services/PrivateKeyService')

const KeyStoreGenerateCommand = require('../../../commands/ethereum-wallet/KeyStoreGenerateCommand')
// eslint-disable-next-line
const KeyStoreGenerateCommandValidator = require('../../../validators/commands/ethereum-wallet/KeyStoreGenerateCommandValidator')
const PrivateKeyValidator = require('../../../validators/PrivateKeyValidator')

const privateKeyValidator = new PrivateKeyValidator(logger)
const privateKeyService = new PrivateKeyService()

/**
 * Class representing a simple factory to build KeyStoreGenerateCommandBuilder object.
 */
class KeyStoreGenerateCommandBuilder {
  static build() {
    const keyStoreGenerateCommandValidator = new KeyStoreGenerateCommandValidator(logger)
    const keyStoreGenerateCommand = new KeyStoreGenerateCommand(
      logger,
      keyStoreGenerateCommandValidator,
      privateKeyService,
      privateKeyValidator,
    )
    return keyStoreGenerateCommand
  }
}

module.exports = KeyStoreGenerateCommandBuilder
