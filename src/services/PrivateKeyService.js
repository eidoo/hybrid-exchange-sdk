const { promisify } = require('util')
const bip39 = require('bip39')
const crypto = require('crypto')
const ethereumUtil = require('ethereumjs-util')
const fs = require('fs')
const hdkey = require('ethereumjs-wallet/hdkey')
const keythereum = require('keythereum')

const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

const { BaseError } = require('../utils/errors')
const log = require('../logger')
const PrivateKeyValidator = require('../validators/PrivateKeyValidator')

const privateKeyValidatorInstance = new PrivateKeyValidator(log)

class EthereumAddressError extends BaseError {}
class InvalidPrivateKeyError extends BaseError {}
class InvalidPrivateKeyFile extends BaseError {}
class InvalidMnemonicError extends BaseError {}

const HD_PATH = "m/44'/60'/0/0"
const encoding = 'utf8'
/**
 * Class representing a service that manage private key.
 */
class PrivateKeyService {
  constructor(privateKeyValidator = privateKeyValidatorInstance, logger = log) {
    if (!privateKeyValidator) {
      throw new TypeError(`Invalid "privateKeyValidator" value: ${privateKeyValidator}`)
    }
    this.privateKeyValidator = privateKeyValidator

    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    this.keyStoreOptions = {
      kdf: 'pbkdf2',
      cipher: 'aes-128-ctr',
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: 'hmac-sha256',
      },
    }
  }

  /**
   * It gets the private key reading it from file.
   *
   * @param {String} privateKeyPath  The path of private key file.
   *
   * @throws {InvalidPrivateKeyFile} If does not exist the file.
   */
  async getPrivateKeyAsync(privateKeyPath) {
    try {
      const extractedData = await readFileAsync(privateKeyPath, encoding)
      // Regex for both windows and unix system.
      const rawPrivateKey = extractedData.split(/[\r\n]+/).shift()
      const privateKey = ethereumUtil.addHexPrefix(rawPrivateKey)
      this.log.debug({ privateKeyPath, fn: 'getPrivateKeyAsync' },
        'Get private key from file.')
      return privateKey
    } catch (err) {
      this.log.error({ privateKeyPath, fn: 'getPrivateKeyAsync' },
        'Error getting private key from file.')
      throw new InvalidPrivateKeyFile(err)
    }
  }

  /**
   * It gets the address from private key.
   *
   * @param {String} privateKey  The  private key.
   *
   * @throws {EthereumAddressError} If the address is not an ethereum address.
   */
  getAddressFromPrivateKey(privateKey) {
    try {
      const privateKeyBuffered = ethereumUtil.toBuffer(privateKey)
      const addressBufferedFromPrivateKey = ethereumUtil.privateToAddress(privateKeyBuffered)
      const personalWalletAddress = ethereumUtil.bufferToHex(addressBufferedFromPrivateKey)
      this.log.debug({ fn: 'getAddressFromPrivateKey' },
        'Get address from private key.')
      return personalWalletAddress
    } catch (err) {
      this.log.error({ fn: 'getAddressFromPrivateKey' },
        'Get address from private key.')
      throw new EthereumAddressError(err)
    }
  }

  /**
   * It gets the private key from mnemonic
   *
   * @param {String} mnemonic The mnemonic.
   *
   * @throws {InvalidMnemonicError} If the menomic is not valid.
   */
  getPrivateKeyFromMnemonic(mnemonic, hdPath = HD_PATH) {
    try {
      const validMnemonic = this.privateKeyValidator.validateMnemonic(mnemonic)
      const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(validMnemonic))
      const wallet = hdwallet.derivePath(hdPath).getWallet()
      const privateKey = wallet._privKey.toString('hex')
      this.log.debug({ fn: 'getPrivateKeyFromMnemonic' }, 'Retrieve private key from mnemonic.')
      return privateKey
    } catch (err) {
      this.log.error({ fn: 'getPrivateKeyFromMnemonic', err },
        'Get address from private key.')
      throw new InvalidMnemonicError(err)
    }
  }

  /**
   * It generates keystore file.
   *
   * @param {String} privateKey       The private key.
   * @param {String} keyStoreFilePath The keystore file path destination.
   * @param {String} keyStorePassword The keystore password.
   */
  async generateKeyStoreAsync(privateKey, keyStorePassword) {
    const params = { keyBytes: 32, ivBytes: 16 }
    const randomBytes = crypto.randomBytes(params.keyBytes + params.ivBytes + params.keyBytes)
    const iv = randomBytes.slice(params.keyBytes, params.keyBytes + params.ivBytes)
    const salt = randomBytes.slice(params.keyBytes + params.ivBytes)
    const keyStore = keythereum.dump(keyStorePassword, privateKey, salt, iv, this.keyStoreOptions)
    return keyStore
  }

  /**
   * It writes the keystore into a file.
   *
   * @param {String} keyStoreFilePath The keystore file path destination.
   */
  async writeKeyStoreToFileAsync(keyStore, keyStoreFilePath) {
    const parsedkeyStoreFilePath = keyStoreFilePath.split(/[\r\n]+/).shift()
    const fileName = `${parsedkeyStoreFilePath}/UTC--${new Date().toISOString()}--${keyStore.address}`
    await writeFileAsync(fileName, JSON.stringify(keyStore))
    this.log.info({ fn: 'generateKeyStore', fileName }, 'Generate keyStore file.')
    return fileName
  }
}

module.exports = { PrivateKeyService, InvalidPrivateKeyError, InvalidPrivateKeyFile, InvalidMnemonicError }
