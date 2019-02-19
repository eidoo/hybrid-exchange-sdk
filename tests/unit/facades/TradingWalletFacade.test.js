/* global describe, expect, test */
const sandbox = require('sinon').createSandbox()

const { QuantityNotEnoughError } = require('../../../index').utils.errors

const { Erc20TokenServiceBuilder, TradingWalletServiceBuilder } = require('../../../index').factories
const { TradingWalletFacade } = require('../../../index').facades

const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'
const tradingWalletAddress = '0x9c6d1840381cc570235a4ed867bf8465e32ce753'
const privateKey = '0x4c7ee440ad699493b22732031e4a3277d2d8aa834b727aa0b358e3310aa37384'
const quantityToDeposit = '500000000000000000'

const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(tokenAddress)
const tradingWalletFacade = new TradingWalletFacade(
  TradingWalletServiceBuilder.build(),
  erc20TokenServiceBuilder.build(),
)

afterEach(() => {
  sandbox.restore()
})

describe('DepositTokenAsync', () => {
  test('should raise QuantityNotEnoughError if the asset balance is not enought.', async () => {
    const balanceOfQuantity = '10000000000000000'
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'getBalanceOfAsync').returns(balanceOfQuantity)
    const isApprovedMinedMock = sandbox.stub(tradingWalletFacade.transactionLib, 'isTransactionMined')
    isApprovedMinedMock.onFirstCall().returns(false)

    return expect(tradingWalletFacade.depositTokenAsync(
      personalWalletAddress,
      tradingWalletAddress,
      quantityToDeposit,
      tokenAddress,
      privateKey,
    )).rejects.toBeInstanceOf(QuantityNotEnoughError)
  })

  test('should call directly depositToken becuase the quantity its already approved', async () => {
    const balanceOfQuantity = '500000000000000000'
    const depositTxHash = '0xDepositTxHash'
    const expecetedResult = {
      approveToZeroTransactionHash: null,
      approveTransactionHash: null,
      depositTransactionHash: depositTxHash,
    }
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'getBalanceOfAsync').returns(balanceOfQuantity)
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'getAllowanceAsync').returns(quantityToDeposit)
    sandbox.stub(tradingWalletFacade.tradingWalletService, 'depositTokenAsync').returns(depositTxHash)

    const result = await tradingWalletFacade.depositTokenAsync(
      personalWalletAddress,
      tradingWalletAddress,
      quantityToDeposit,
      tokenAddress,
      privateKey,
    )

    expect(result).toMatchObject(expecetedResult)
  })

  test('should call approve becuase the allowance is zero', async () => {
    const balanceOfQuantity = '500000000000000000'
    const allowance = 0
    const depositTxHash = '0xDepositTxHash'
    const approveTxHash = '0xApproveTxHash'
    const expecetedResult = {
      approveToZeroTransactionHash: null,
      approveTransactionHash: approveTxHash,
      depositTransactionHash: depositTxHash,
    }
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'getBalanceOfAsync').returns(balanceOfQuantity)
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'getAllowanceAsync').returns(allowance)
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'approveTrasferAsync').returns(approveTxHash)
    sandbox.stub(tradingWalletFacade.tradingWalletService, 'depositTokenAsync').returns(depositTxHash)

    const result = await tradingWalletFacade.depositTokenAsync(
      personalWalletAddress,
      tradingWalletAddress,
      quantityToDeposit,
      tokenAddress,
      privateKey,
    )

    expect(result).toMatchObject(expecetedResult)
  })

  test('should call directly approve ', async () => {
    const balanceOfQuantity = '500000000000000000'
    const allowance = balanceOfQuantity - 1000
    const depositTxHash = '0xDepositTxHash'
    const approveZeroTxHash = '0xApproveZeroTxHash'
    const approveTxHash = '0xApproveTxHash'
    const expecetedResult = {
      approveToZeroTransactionHash: approveZeroTxHash,
      approveTransactionHash: approveTxHash,
      depositTransactionHash: depositTxHash,
    }
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'getBalanceOfAsync').returns(balanceOfQuantity)
    sandbox.stub(tradingWalletFacade.erc20TokenService, 'getAllowanceAsync').returns(allowance)
    const approveTrasferMock = sandbox.stub(tradingWalletFacade.erc20TokenService, 'approveTrasferAsync')
    approveTrasferMock.onFirstCall().returns(approveZeroTxHash)
    approveTrasferMock.onSecondCall().returns(approveTxHash)
    sandbox.stub(tradingWalletFacade.tradingWalletService, 'depositTokenAsync').returns(depositTxHash)

    const result = await tradingWalletFacade.depositTokenAsync(
      personalWalletAddress,
      tradingWalletAddress,
      quantityToDeposit,
      tokenAddress,
      privateKey,
    )

    expect(result).toMatchObject(expecetedResult)
  })
})
