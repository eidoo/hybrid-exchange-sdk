/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { exchange } = require('../../../src/config')
const { getAddressCommand } = require('../../../src/commands/commandList')
const TradingWalletServiceBuilder = require('../../../src/factories/TradingWalletServiceBuilder')

const tradingWalletService = TradingWalletServiceBuilder.build()

afterEach(() => {
  sandbox.restore()
})

describe('tws get-address', () => {
  const validPrivateKeyPath = 'tests/fixtures/privateKeys/privateKey.key'

  describe('should raise Error if personal wallet address was not defined as expected', () => {
    const invalidPersonalWalletAddresses = ['NotValidEthereumAddress', [], {}, 21]
    test.each(invalidPersonalWalletAddresses)(` personalWalletAddress 
      is not a valid ethereum address: %o`, async (invalidPersonalWalletAddress) => {
      const expectedResult = [{
        code: 'ValidationError',
        field: 'personalWalletAddress',
        message: 'personalWalletAddress needs to be an ethereum address',
      }]

      const result = await getAddressCommand
        .executeAsync({ personalWalletAddress: invalidPersonalWalletAddress, privateKeyPath: validPrivateKeyPath })

      expect(result).toMatchObject(expectedResult)
    })

    test(' personalWallet is not defined', async () => {
      const personalWalletAddress = undefined
      const expectedResult = [{
        code: 'ValidationError',
        field: 'personalWalletAddress',
        message: 'personalWalletAddress is required',
      }]

      const result = await getAddressCommand.executeAsync({ personalWalletAddress })
      expect(result).toMatchObject(expectedResult)
    })
  })

  describe('should execute GetAddressCommand as expected', () => {
    const draftValues = [false, undefined]
    test.each(draftValues)('should return the tradingWallet address with draft value = %o', async (draft) => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTradingWalletAddress = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8d80'
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'transactionCallAsync')
        .returns(`0x000000000000000000000000${expectedTradingWalletAddress.substring(2)}`)
      // eslint-disable-next-line max-len
      const result = await getAddressCommand.executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft })
      expect(result).toBe(expectedTradingWalletAddress)
    })

    test('should return the transactionObjectDraft for tradingWallet address call', async () => {
      const personalWalletAddress = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTransactionObjectDraft = {
        data: '0x2e16cf540000000000000000000000009c858489661158d1721a66319f8683925d5a8b70',
        from: personalWalletAddress,
        to: exchange.smartContractAddress,
        value: '0x0',
      }

      const result = await getAddressCommand
        .executeAsync({ personalWalletAddress, privateKeyPath: validPrivateKeyPath, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
  })
})
