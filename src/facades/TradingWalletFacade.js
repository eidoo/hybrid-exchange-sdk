const log = require('../logger')
const { QuantityNotAllowedError, TransactionNotMinedError } = require('../utils').errors
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
    const approveTransactionHash = await this.erc20TokenService.approveTrasferAsync(
      personalWalletAddress,
      tradingWalletAddress,
      quantity,
      privateKey,
    )
    const isApproveMined = await this.transactionLib.isTransactionMined(approveTransactionHash, tradingWalletAddress)

    if (!isApproveMined) {
      const errMsg = 'Approve transaction not mined.'
      this.log.error({
        fn: 'depositTokenAsync',
        isApproveMined,
        personalWalletAddress,
        tradingWalletAddress,
        quantity,
      }, errMsg)
      throw new TransactionNotMinedError(errMsg)
    }

    const allowedQuantity = await this.erc20TokenService.getAllowanceAsync(personalWalletAddress, tradingWalletAddress)

    if (quantity <= allowedQuantity) {
      const errorMessage = 'The quantity to deposit is not allowed!'
      this.log.error({
        personalWalletAddress,
        tradingWalletAddress,
        quantity,
        tokenAddress,
        allowedQuantity,
      },
      errorMessage)
      throw new QuantityNotAllowedError(errorMessage)
    }
    const depositTransactionHash = await this.tradingWalletService.depositTokenAsync(
      personalWalletAddress,
      tradingWalletAddress,
      quantity,
      tokenAddress,
      privateKey,
    )
    const isDepositMined = await this.transactionLib.isTransactionMined(depositTransactionHash, tradingWalletAddress)

    if (!isDepositMined) {
      const errMsg = 'Deposit transaction not mined.'
      this.log.error({
        fn: 'depositTokenAsync',
        isDepositMined,
        personalWalletAddress,
        tradingWalletAddress,
        quantity,
      }, errMsg)
      throw new TransactionNotMinedError(errMsg)
    }

    this.log.info({
      fn: 'depositTokenAsync',
      personalWalletAddress,
      tradingWalletAddress,
      quantity,
      tokenAddress,
      privateKey,
    },
    'Deposit token completed successfully.')
  }
}

module.exports = TradingWalletFacade
