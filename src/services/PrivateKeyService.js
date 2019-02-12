const ethereumUtil = require('ethereumjs-util')
const fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

const { BaseError } = require('../utils/errors')

class EthereumAddressError extends BaseError {}
class InvalidPrivateKeyError extends BaseError {}
class InvalidPrivateKeyFile extends BaseError {}

const encoding = 'utf8'
/**
 * Class representing a service that manage private key.
 */
class PrivateKeyService {
  constructor(logger) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })
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
}

module.exports = { PrivateKeyService, InvalidPrivateKeyError, InvalidPrivateKeyFile }
