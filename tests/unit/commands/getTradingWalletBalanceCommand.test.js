/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { getBalanceCommand } = require('../../../src/commands/commandList')
const TradingWalletServiceBuilder = require('../../../src/factories/TradingWalletServiceBuilder')

const tradingWalletService = TradingWalletServiceBuilder.build()

afterEach(() => {
  sandbox.restore()
})

describe('tws get-balance', () => {
  const from = '0x9c858489661158d1721a66319f8683925d5a8b70'
  const to = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const token = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'

  describe('should raise Error if from wallet address was not defined as expected', () => {
    const invalidFromAddresses = ['NotValidEthereumAddress', [], {}, 21]
    test.each(invalidFromAddresses)(`from 
      is not a valid ethereum address: %o`, async (invalidFrom) => {
      const expectedResult = [
        {
          code: 'ValidationError',
          field: 'from',
          message: 'from needs to be an ethereum address',
        },
      ]

      const result = await getBalanceCommand
        .executeAsync({ from: invalidFrom, to, token })

      expect(result).toMatchObject(expectedResult)
    })

    test('from is not defined', async () => {
      const from = undefined
      const expectedResult = [{
        code: 'ValidationError',
        field: 'from',
        message: 'from is required',
      }]

      const result = await getBalanceCommand.executeAsync({ from, to, token })
      expect(result).toMatchObject(expectedResult)
    })
  })

  describe('should execute GetBalanceCommand as expected', () => {
    const draftValues = [false, undefined]
    test.each(draftValues)('should return the tradingWallet asset balance with draft value = %o', async (draft) => {
      const expectedTradinWalletAssetBalance = '1'
      sandbox.stub(tradingWalletService.transactionLib.ethApiClient, 'transactionCallAsync')
        .returns(expectedTradinWalletAssetBalance)

      const result = await getBalanceCommand.executeAsync({ from, to, token, draft })
      expect(result).toBe(expectedTradinWalletAssetBalance)
    })

    test('should return the transactionObjectDraft for tradingWallet asset balance', async () => {
      const expectedTransactionObjectDraft = {
        data: '0xf6b1b18b0000000000000000000000009727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a',
        from,
        to,
        value: '0x0',
      }

      const result = await getBalanceCommand
        .executeAsync({ from, to, token, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
  })
})
