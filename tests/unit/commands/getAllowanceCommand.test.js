/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { getAllowanceCommand } = require('../../../src/commands/commandList')
const { Erc20TokenServiceBuilder } = require('../../../index').factories

const token = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8f77'
const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(token)

const erc20TokenService = erc20TokenServiceBuilder.build()

beforeEach(() => {
  getAllowanceCommand.erc20TokenService = erc20TokenService
})

afterEach(() => {
  delete getAllowanceCommand.erc20TokenService
  sandbox.restore()
})

describe('tks getAllowance', () => {
  const spender = '0x966b39c20dbd2d502f7a2aa8f47f38c01eac8c77'
  describe('should raise Error if personal wallet address was not defined as expected', () => {
    const invalidOwnerAdresses = ['NotValidEthereumAddress', [], {}, 21]
    test.each(invalidOwnerAdresses)(` personalWalletAddress 
    is not a valid ethereum address: %o`, async (invalidOwnerAdress) => {
      const expectedResult = [{
        code: 'ValidationError',
        field: 'owner',
        message: 'owner needs to be an ethereum address',
      }]

      const result = await getAllowanceCommand
        .executeAsync({ owner: invalidOwnerAdress, spender, token })

      expect(result).toMatchObject(expectedResult)
    })

    test('owner address is not defined', async () => {
      const invalidOwnerAdress = undefined
      const expectedResult = [{
        code: 'ValidationError',
        field: 'owner',
        message: 'owner is required',
      }]

      const result = await getAllowanceCommand.executeAsync({ owner: invalidOwnerAdress, spender, token })
      expect(result).toMatchObject(expectedResult)
    })
  })

  describe('should execute GetAAllowanceCommand as expected', () => {
    const draftValues = [false, undefined]
    test.each(draftValues)('should return the tradingWallet address with draft value = %o', async (draft) => {
      const owner = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const allowedQuantity = '5000000000'
      sandbox.stub(getAllowanceCommand.erc20TokenService.transactionLib.ethApiClient, 'transactionCallAsync')
        .returns(allowedQuantity)

      const result = await getAllowanceCommand.executeAsync({ owner, spender, token, draft })
      expect(result).toBe(allowedQuantity)
    })

    test('should return the transactionObjectDraft for tradingWallet address call', async () => {
      const owner = '0x9c858489661158d1721a66319f8683925d5a8b70'
      const expectedTransactionObjectDraft = {
        data: '0xdd62ed3e0000000000000000000000009c858489661158d1721a66319f8683925d5a8b70000000000000000000000000966b39c20dbd2d502f7a2aa8f47f38c01eac8c77',
        from: owner,
        to: token,
        value: '0x0',
      }

      const result = await getAllowanceCommand
        .executeAsync({ owner, spender, token, draft: true })

      expect(result).toMatchObject(expectedTransactionObjectDraft)
    })
  })
})
