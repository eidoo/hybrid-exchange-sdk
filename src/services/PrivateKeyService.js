const bip39 = require('bip39')
const ethereumUtil = require('ethereumjs-util')
const fs = require('fs')

const hdkey = require('ethereumjs-wallet/hdkey')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

const { BaseError } = require('../utils/errors')
const log = require('../logger')
const PrivateKeyValidator = require('../validators/PrivateKeyValidator')

const privateKeyValidatorInstance = new PrivateKeyValidator(log)

class EthereumAddressError extends BaseError {}
class InvalidPrivateKeyError extends BaseError {}
class InvalidPrivateKeyFile extends BaseError {}
class InvalidMnemonicError extends BaseError {}

const encoding = 'utf8'
/**
 * Class representing a service that manage private key.
 */
class PrivateKeyService {
  constructor(logger = log, privateKeyValidator = privateKeyValidatorInstance) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })
    if (!privateKeyValidator) {
      throw new TypeError(`Invalid "privateKeyValidator" value: ${privateKeyValidator}`)
    }
    this.privateKeyValidator = privateKeyValidator

    this.hdPath = "m/44'/60'/0/0"
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
  getPrivateKeyFromMnemonic(mnemonic) {
    try {
      const validMnemonic = this.privateKeyValidator.validateMenmonic(mnemonic)
      const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(validMnemonic))
      const wallet = hdwallet.derivePath(this.hdPath).getWallet()
      const privateKey = wallet._privKey.toString('hex')
      this.log.debug({ fn: 'getPrivateKeyFromMnemonic' }, 'Retrieve private key from mnemonic.')
      return privateKey
    } catch (err) {
      this.log.error({ fn: 'getPrivateKeyFromMnemonic', err },
        'Get address from private key.')
      throw new InvalidMnemonicError(err)
    }
  }
}

module.exports = { PrivateKeyService, InvalidPrivateKeyError, InvalidPrivateKeyFile, InvalidMnemonicError }
