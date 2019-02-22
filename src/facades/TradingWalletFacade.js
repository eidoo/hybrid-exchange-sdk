const log = require('../logger')
const { QuantityNotEnoughError } = require('../utils').errors
const { TransactionLibBuilder } = require('../factories')

/**
 * Class representing a facade of tradingWallet utilities.
 */

class TradingWalletFacade {
  constructor(tradingWalletTransactionBuilder, erc20TokenService, erc20TokenTransactionBuilder,
    transactionLib = TransactionLibBuilder.build(), logger = log) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!tradingWalletTransactionBuilder) {
      const errorMessage = `Invalid "tradingWalletTransactionBuilder" value: ${tradingWalletTransactionBuilder}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletTransactionBuilder = tradingWalletTransactionBuilder

    if (!erc20TokenService) {
      const errorMessage = `Invalid "erc20TokenService" value: ${erc20TokenService}`
      throw new TypeError(errorMessage)
    }
    this.erc20TokenService = erc20TokenService

    if (!erc20TokenTransactionBuilder) {
      const errorMessage = `Invalid "erc20TokenTransactionBuilder" value: ${erc20TokenTransactionBuilder}`
      throw new TypeError(errorMessage)
    }
    this.erc20TokenTransactionBuilder = erc20TokenTransactionBuilder

    if (!transactionLib) {
      const errorMessage = `Invalid "transactionLib" value: ${transactionLib}`
      throw new TypeError(errorMessage)
    }
    this.transactionLib = transactionLib
  }

  async throwIfTokenWalletEnought(personalWalletAddress, quantity) {
    const assetBalance = await this.erc20TokenService.getBalanceOfAsync(personalWalletAddress)

    const assetBalanceToBigNumber = this.transactionLib.web3.toBigNumber(assetBalance)
    const quantityToBigNumber = this.transactionLib.web3.toBigNumber(quantity)
    if (assetBalanceToBigNumber.lt(quantityToBigNumber)) {
      const errorMessage = 'The asset balance is < than the quantity to depoist!'
      this.log.info({
        personalWalletAddress,
        quantity,
        assetBalance,
        fn: 'checkIfTokenWalletEnought',
      },
      errorMessage)
      throw new QuantityNotEnoughError(errorMessage)
    }
  }

  async depositTokenAsync(personalWalletAddress, tradingWalletAddress, quantity, tokenAddress, privateKey) {
    this.log.info({
      fn: 'depositTokenAsync',
      personalWalletAddress,
      tradingWalletAddress,
      tokenAddress,
      quantity,
    }, 'Deposit token.')

    let approveToZeroTransactionHash = null
    let approveTransactionHash = null

    await this.throwIfTokenWalletEnought(personalWalletAddress, quantity)

    const allowance = await this.erc20TokenService.getAllowanceAsync(personalWalletAddress, tradingWalletAddress)
    const allowanceToInt = +allowance

    if (quantity > allowance && allowance > 0) {
      this.log.info({
        personalWalletAddress,
        tradingWalletAddress,
        quantity,
        tokenAddress,
        allowance,
        fn: 'depositTokenAsync',
      },
      'The quantity to deposit is not completely allowed!')

      const zeroQuantity = 0
      approveToZeroTransactionHash = await this.erc20TokenService.approveTrasferAsync(
        personalWalletAddress,
        tradingWalletAddress,
        zeroQuantity,
        privateKey,
      )
    }

    const approveTransactionDraftObject = await this.erc20TokenTransactionBuilder.buildApproveTrasferTransactionDraft(
      personalWalletAddress,
      tradingWalletAddress,
      quantity,
    )
    const gasEstimationForApprove = await this.transactionLib.getGasEstimation(approveTransactionDraftObject)
    const nonceForApprove = await this.transactionLib.getNonce(personalWalletAddress)

    if (allowanceToInt === 0 || (quantity > allowanceToInt && allowanceToInt > 0)) {
      const signedApproveData = await this.transactionLib.sign(
        approveTransactionDraftObject,
        privateKey,
        nonceForApprove,
        gasEstimationForApprove.gas,
        gasEstimationForApprove.gasPrice,
      )
      approveTransactionHash = await this.transactionLib.execute(signedApproveData)
    }

    const depositTokenTransactionDraft = await this.tradingWalletTransactionBuilder
      .buildDepositTokenTransactionDraft(personalWalletAddress, tradingWalletAddress, quantity, tokenAddress)
    const depositTokenFixedGasEstimation = 100000

    const signedTransactionDataForDeposit = await this.transactionLib.sign(
      depositTokenTransactionDraft,
      privateKey,
      nonceForApprove + 1,
      depositTokenFixedGasEstimation,
      gasEstimationForApprove.gasPrice,
    )

    const depositTransactionHash = await this.transactionLib
      .execute(signedTransactionDataForDeposit, privateKey)

    this.log.info({
      fn: 'depositTokenAsync',
      personalWalletAddress,
      tradingWalletAddress,
      quantity,
      tokenAddress,
      approveToZeroTransactionHash,
      approveTransactionHash,
      depositTransactionHash,
    },
    'Deposit token completed successfully.')

    return {
      approveToZeroTransactionHash,
      approveTransactionHash,
      depositTransactionHash,
    }
  }
}

module.exports = TradingWalletFacade
