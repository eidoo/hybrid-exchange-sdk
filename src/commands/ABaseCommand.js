const CommandError = require('./CommandError')

/**
 * Class representing the command interface. */
class ABaseCommand {
  /**
   * Create a base command.
   * @param {Object} logger The logger.
   * @throws {TypeError}    If some required property is missing.
   */
  constructor(logger) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })
  }

  async executeAsync(params) {
    let result
    try {
      const validatedParams = await this.doValidateAsync(params)
      result = await this.doExecuteAsync(validatedParams)
    } catch (err) {
      result = this.formatErrors(err)
    }
    return result
  }

  // eslint-disable-next-line class-methods-use-this
  doExecuteAsync() {
    return Promise.reject(new Error('Method "doExecuteAsync" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  doValidateAsync() {
    return Promise.reject(new Error('Method "doValidateAsync" has not been implemented yet.'))
  }

  /**
   * It formats the errors.
   *
   * @param {Object} err  The err objects which contains errors list.
   */
  formatErrors(err) {
    this.log.error({ err, fn: 'formatErrors' }, 'Error during command execution.')
    let formattedErrors
    if (!Array.isArray(err.errors)) {
      formattedErrors = [
        new CommandError(
          err.code || err.name,
          err.message,
          err.field || null,
        ),
      ]
      return formattedErrors
    }
    formattedErrors = err.errors
      .map(error => new CommandError(
        error.code || error.name,
        error.message,
        error.field || null,
      ))
    return formattedErrors
  }

  async promptMnemonic() {
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

  async promptKeyStorePassword() {
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
   * TODO: remove as soon as the migration to keystore is completed
   */
  async extractPrivateKey(privateKeyFilePath) {
    this.privateKeyValidator.validateFilePath({ privateKeyFilePath })
    const privateKey = await this.privateKeyService.getPrivateKeyAsync(privateKeyFilePath)
    this.privateKeyValidator.validatePrivateKey({ privateKey })
    return privateKey
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
}

module.exports = ABaseCommand
