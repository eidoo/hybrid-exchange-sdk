const ABaseCommand = require('../ABaseCommand')
const CommandArg = require('../../models/CommandArg')

const HD_PATH = "m/44'/60'/0/0"

/**
 * Class representing KeyStoreGenerateCommand. */
class KeyStoreGenerateCommand extends ABaseCommand {
  /**
   * Create a KeyStoreGenerateCommand.
   * @param {Object} logger                           The logger helper.
   * @param {Object} keyStoreGenerateCommandValidator The keyStoreGenerateCommand validator.
   * @param {Object} privateKeyService                The privateKeyService.
   * @param {Object} privateKeyValidator              The privateKeyValidator.
   * @throws {TypeError}                              If some required property is missing.
   */
  constructor(logger, keyStoreGenerateCommandValidator, privateKeyService, privateKeyValidator) {
    super(logger, privateKeyService, privateKeyValidator)

    if (!keyStoreGenerateCommandValidator) {
      const errorMessage = `Invalid "keyStoreGenerateCommandValidator" value: ${keyStoreGenerateCommandValidator}`
      throw new TypeError(errorMessage)
    }
    this.keyStoreGenerateCommandValidator = keyStoreGenerateCommandValidator

    this.builderArgs = this.constructor.setBuilderArgs()

    this.synopsis = this.setSynopsis()
  }

  static get description() {
    return 'It creates a keystore file from menemonic and hd path.'
  }

  setSynopsis() {
    let synopsis = 'keystore-generate '
    this.builderArgs.forEach((item) => {
      synopsis += item.getReprForSynopsys()
    })
    return synopsis
  }

  /**
   * It set the builder args necessary to set args cli command.
   */
  static setBuilderArgs() {
    const keyStoreFilePathArg = new CommandArg('key-store-file-path',
      'string', 'ksp', 'The private key file path.', 1, true)
    const hdPathArg = new CommandArg('hd-path',
      'string', 'p', 'It is the hd path used to derive the private key from mnemonic.', 1, false, HD_PATH)
    return [keyStoreFilePathArg, hdPathArg]
  }

  /**
   * It gets the args props to be injected in yargs cli command.
   */
  getBuilderArgsDetails() {
    const builderArgsDetails = {}
    this.builderArgs.forEach((item) => {
      builderArgsDetails[item.name] = item.getArgProps()
    })
    return builderArgsDetails
  }

  /**
   * It validates the input parameters in order to execute the command.
   *
   * @param {Object} params
   * @param {String} params.keyStoreFilePath The keystore path.
   * @param {String} params.hdPathArg        The hd path.
   */
  async doValidateAsync({ keyStoreFilePath, hdPath }) {
    const mnemonic = await this.promptMnemonic()
    const keyStorePassword = await this.promptKeyStorePassword()
    const params = this.keyStoreGenerateCommandValidator.keyStoreGenerate({ keyStoreFilePath, hdPath, mnemonic, keyStorePassword })
    return params
  }

  /**
   * It executes the command after the validation step.
   *
   * @param {Object} params
   * @param {String} params.keyStoreFilePath The keystore path.
   * @param {String} params.hdPath           The hd path.
   * @param {String} params.mnemonic         The mnemonic.
   * @param {String} params.keyStorePassword The key store password.
   */
  async doExecuteAsync({ keyStoreFilePath, hdPath, mnemonic, keyStorePassword }) {
    const privateKey = await this.privateKeyService.getPrivateKeyFromMnemonic(mnemonic, hdPath)
    const keyStoreFileName = await this.privateKeyService.generateKeyStore(
      privateKey,
      keyStoreFilePath,
      keyStorePassword,
    )
    const successMessageKeyStoreGenerated = `Keystore file generated: ${keyStoreFileName}`
    return successMessageKeyStoreGenerated
  }
}

module.exports = KeyStoreGenerateCommand
