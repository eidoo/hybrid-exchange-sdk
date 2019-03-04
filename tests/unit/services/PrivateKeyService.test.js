/* global describe, expect, test */
const keythereum = require('keythereum')
const ethereumUtil = require('ethereumjs-util')
const PrivateKeyServiceBuilder = require('../../../src/factories/PrivateKeyServiceBuilder')

const { InvalidPrivateKeyFile, InvalidMnemonicError } = require('../../../src/services/PrivateKeyService')

let privateKeyService

beforeEach(() => {
  privateKeyService = PrivateKeyServiceBuilder.build()
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
    // eslint-disable-next-line max-len
    const mnemonic = 'cedibile elica espresso castello poltrona chicca settimana regalato gelatina bulbo microbo assurdo'
    const result = privateKeyService.getPrivateKeyFromMnemonic(mnemonic)
    expect(result).toEqual(expectedPrivateKey)
  })

  const invalidMnemonics = ['', undefined, 1, [], {}, 'not 12 words']
  test.each(invalidMnemonics)('should raise InvalidMnemonicError with menmonic = %o', (invalidMnemonic) => {
    expect(() => privateKeyService.getPrivateKeyFromMnemonic(invalidMnemonic)).toThrowError(InvalidMnemonicError)
  })
})

describe('generateKeyStore', () => {
  test('should return the expected privateKey encrypted in the generated keystore', async () => {
    const privateKey = 'a8345d27c6d41e4816163fe133daddf38298bb74c16ea5f8245727d03a5f85f8'
    const password = 'password'
    const keystore = await privateKeyService.generateKeyStoreAsync(privateKey, password)
    const retrivedPrivateKey = keythereum.recover(password, keystore)
    const expectedPrivateKey = ethereumUtil.bufferToHex(retrivedPrivateKey)
    expect(`0x${privateKey}`).toEqual(expectedPrivateKey)
  })
})

describe('getPrivateKeyFromKeystore', () => {
  test('should return the expected privateKey from encrypted keystore', async () => {
    const expectedPrivateKey = 'a8345d27c6d41e4816163fe133daddf38298bb74c16ea5f8245727d03a5f85f8'
    // eslint-disable-next-line max-len
    const keystore = { address: 'db1b9e1708aec862fee256821702fa1906ceff67', crypto: { cipher: 'aes-128-ctr', ciphertext: '5ca9d296c08a74d0badf3e70b170fd9c2f7652ff0fdbac8f37d982a26f564fe1', cipherparams: { iv: '6e4b0b42ba976a586e7550fc3ce190d7' }, mac: '7c87b34ce6ae422e2ee1b7aba9552d553efaa03c5a6bd903277b4235803eb881', kdf: 'pbkdf2', kdfparams: { c: 262144, dklen: 32, prf: 'hmac-sha256', salt: '4e2a8eba6d206fbf6f231bc37e7cd1a08e6509aa8cae76fdcf3719aec4326397' } }, id: '2ff913ac-a333-4ca3-a681-5e6a8f97629e', version: 3 }
    const password = 'password'
    const retrivedPrivateKey = await privateKeyService.getPrivateKeyFromKeystore(password, keystore)
    expect(retrivedPrivateKey).toEqual(expectedPrivateKey)
  })
})
