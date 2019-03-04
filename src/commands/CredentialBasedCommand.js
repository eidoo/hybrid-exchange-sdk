const inquirer = require('inquirer')
const { InvalidPrivateKeyError } = require('../services/PrivateKeyService')
const ABaseCommand = require('./ABaseCommand')

/**
 * Class representing class to be used if the command requires credentials.
 */
class CredentialBasedCommand extends ABaseCommand {
  /**
   * Create a base command.
   * @param {Object} logger              The logger.
   * @param {Object} privateKeyService   The privateKeyService.
   * @param {Object} privateKeyValidator The privateKeyValidator.
   * @throws {TypeError}                 If some required property is missing.
   */
  constructor(logger, privateKeyService, privateKeyValidator) {
    super(logger)

    if (!privateKeyService) {
      const errorMessage = `Invalid "privateKeyService" value: ${privateKeyService}`
      throw new TypeError(errorMessage)
    }
    this.privateKeyService = privateKeyService

    if (!privateKeyValidator) {
      const errorMessage = `Invalid "privateKeyValidator" value: ${privateKeyValidator}`
      throw new TypeError(errorMessage)
    }
    this.privateKeyValidator = privateKeyValidator
  }

  async promptMnemonicAsync() {
    const { mnemonic } = await inquirer.prompt([
      {
        type: 'input',
        message: 'Enter mnemonic',
        name: 'mnemonic',
      },
    ])
    this.log.debug({ fn: 'promptMnemonic' }, 'Input mnemonic done.')
    return mnemonic
  }

  async promptKeyStorePasswordAsync() {
    const { keyStorePassword } = await inquirer.prompt([
      {
        type: 'password',
        message: 'Enter password to encrypt your keystore',
        name: 'keyStorePassword',
        mask: '*',
      },
    ])
    this.log.debug({ fn: 'promptKeyStorePassword' }, 'Input prompt KeyStore password.')
    return keyStorePassword
  }

  /**
   * It extract private key from file specified in privateKeyFilePath.
   *
   * @param {String} privateKeyFilePath  The path of private key file.
   *
   * @throws {InvalidPrivateKeyFile} If does not exist the file.
   *
   */
  async extractPrivateKey (privateKeyFilePath) {
    this.privateKeyValidator.validateFilePath({ privateKeyFilePath })
    const privateKey = await this.privateKeyService.getPrivateKeyAsync(privateKeyFilePath)
    this.privateKeyValidator.validatePrivateKey({ privateKey })
    return privateKey
  }

  /**
   * It gets address (EOA) from private key.s
   *
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {String} privateKey            The private key.
   *
   * @throws {InvalidPrivateKeyError} If does not exist the file.
   */
  getAddressFromPrivateKey(personalWalletAddress, privateKey) {
    const personalWalletAddressFromPrivateKey = this.privateKeyService.getAddressFromPrivateKey(privateKey)
    if (personalWalletAddress && personalWalletAddress !== personalWalletAddressFromPrivateKey) {
      this.log.error({ fn: 'getAddressFromPrivateKey', personalWalletAddress },
        'The private key does not match the personal wallet address.')
      throw new InvalidPrivateKeyError(`The private key does not match the personal wallet address given in input:${personalWalletAddress}`)
    }
    return personalWalletAddressFromPrivateKey
  }

  /**
   * It extract private key from keystore and password specified.
   *
   * @param {String} keystoreFilePath The keystore file path.
   * @param {String} keyStorePassword The keystore descrypt passowrd.
   *
   * @throws {InvalidKeystoreFile}    If does not exist the file.
   * @throws {InvalidKeystoreParams}  If something wrong during the recovering from keystore.
   */
  async extractPrivateKeyFromKeystore(keystoreFilePath, keyStorePassword) {
    this.privateKeyValidator.validateKeystoreFilePath({ keystoreFilePath })
    const keystore = await this.privateKeyService.getKeystoreAsync(keystoreFilePath)
    const privateKey = await this.privateKeyService.getPrivateKeyFromKeystore(keyStorePassword, keystore)
    this.privateKeyValidator.validatePrivateKey({ privateKey })
    return privateKey
  }
}

module.exports = CredentialBasedCommand
