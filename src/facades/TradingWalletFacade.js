const log = require('../logger')
const { QuantityNotEnoughError } = require('../utils').errors
const { TransactionLibBuilder } = require('../factories')

/**
 * Class representing a facade of tradingWallet utilities.
 */

class TradingWalletFacade {
  constructor(tradingWalletService, erc20TokenService, transactionLib = TransactionLibBuilder.build(), logger = log) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })

    if (!tradingWalletService) {
      const errorMessage = `Invalid "tradingWalletService" value: ${tradingWalletService}`
      throw new TypeError(errorMessage)
    }
    this.tradingWalletService = tradingWalletService

    if (!erc20TokenService) {
      const errorMessage = `Invalid "erc20TokenService" value: ${erc20TokenService}`
      throw new TypeError(errorMessage)
    }
    this.erc20TokenService = erc20TokenService

    if (!transactionLib) {
      const errorMessage = `Invalid "transactionLib" value: ${transactionLib}`
      throw new TypeError(errorMessage)
    }
    this.transactionLib = transactionLib
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

    const assetBalance = this.erc20TokenService.getBalanceOfAsync(personalWalletAddress)

    if (assetBalance < quantity) {
      const errorMessage = 'The asset balance is < than the quantity to depoist!'
      this.log.info({
        personalWalletAddress,
        tradingWalletAddress,
        quantity,
        tokenAddress,
        assetBalance,
        fn: 'depositTokenAsync',
      },
      errorMessage)
      throw new QuantityNotEnoughError(errorMessage)
    }

    const allowance = await this.erc20TokenService.getAllowanceAsync(personalWalletAddress, tradingWalletAddress)
    const allowanceToInt = +allowance
    if (quantity > allowanceToInt && allowanceToInt > 0) {
      this.log.info({
        personalWalletAddress,
        tradingWalletAddress,
        quantity,
        tokenAddress,
        allowanceToInt,
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

    if (allowanceToInt === 0 || (quantity > allowanceToInt && allowanceToInt > 0)) {
      approveTransactionHash = await this.erc20TokenService.approveTrasferAsync(
        personalWalletAddress,
        tradingWalletAddress,
        quantity,
        privateKey,
      )
    }

    const depositTransactionHash = await this.tradingWalletService.depositTokenAsync(
      personalWalletAddress,
      tradingWalletAddress,
      quantity,
      tokenAddress,
      privateKey,
    )

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
