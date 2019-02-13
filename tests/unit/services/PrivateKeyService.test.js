/* global describe, expect, test */
const logger = require('../../../src/logger')
const { InvalidPrivateKeyFile, InvalidMnemonicError,
  PrivateKeyService } = require('../../../src/services/PrivateKeyService')

let privateKeyService

beforeEach(() => {
  privateKeyService = new PrivateKeyService(logger)
})

describe('getPrivateKey', () => {
  test('should get the right private key', async() => {
    const privateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'
    const expectedPrivateKey = '0x5ca4748dda543c064238a3f2b28ea3f6ec42c8eba5fa169d8c45fc7f421660a8'

    const privateKey = await privateKeyService.getPrivateKeyAsync(privateKeyPath)

    expect(privateKey).toEqual(expectedPrivateKey)
  })
  test('should raise error if file does not exist', async() => {
    const privateKeyPath = 'tests/fixtures/privateKeys/notExistPrivateKeyFile.key'
    return expect(privateKeyService.getPrivateKeyAsync(privateKeyPath)).rejects.toBeInstanceOf(InvalidPrivateKeyFile)
  })
})

describe('getAddressFromPrivateKey', () => {
  test('should get the right address', async() => {
    const privateKey = '0x5ca4748dda543c064238a3f2b28ea3f6ec42c8eba5fa169d8c45fc7f421660a8'
    const expectedAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'

    const address = await privateKeyService.getAddressFromPrivateKey(privateKey)

    expect(address).toEqual(expectedAddress)
  })
  test('should raise error if there was an error during address parsing', async() => {
    const privateKey = 'NotValidPrivateKey8c45fc7f421660a8'
    try {
      privateKeyService.getAddressFromPrivateKey(privateKey)
    } catch (err) {
      expect(err instanceof Error).toBe(true)
    }
  })
})

describe('getPrivateKeyFromMnemonic', () => {
  test('should get the private key', () => {
    const expectedPrivateKey = 'a8345d27c6d41e4816163fe133daddf38298bb74c16ea5f8245727d03a5f85f8'
    const mnemonic = 'cedibile elica espresso castello poltrona chicca settimana regalato gelatina bulbo microbo assurdo'
    const result = privateKeyService.getPrivateKeyFromMnemonic(mnemonic)
    expect(result).toEqual(expectedPrivateKey)
  })

  const invalidMnemonics = ['', undefined, 1, [], {}, 'not 12 words']
  test.each(invalidMnemonics)('should raise InvalidMnemonicError with menmonic = %o', (invalidMnemonic) => {
    expect(() => privateKeyService.getPrivateKeyFromMnemonic(invalidMnemonic)).toThrowError(InvalidMnemonicError)
  })
})
