const BaseTransactionService = require('./BaseTransactionService')

/**
 * Class representing a service to build sign and execute transaction related to a Erc20 token.
 * @extends BaseTransactionService
 */
class Erc20TokenService extends BaseTransactionService {
  /**
   * It approves the trasfer of token quantity from trading to pesonal wallet.
   *
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @param {String} personalWalletAddress The personal wallet address (EOA).
   * @param {Number} quantity              The quantity of token to withdraw.
   * @param {String} tokenAddress          The address of the token asset to withdraw.
   * @param {String} privateKey            The private key.
   */
  async approveTrasferAsync(personalWalletAddress, tradingWalletAddress, quantity, privateKey) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    this.log.info({
      fn: 'approveTrasferAsync',
      tradingWalletAddress,
      quantity,
      personalWalletAddress,
    },
    'Approving quantity.')
    const transactionParams = [personalWalletAddress, tradingWalletAddress, quantity]
    const transactionDraftBuilderName = 'buildApproveTrasferTransactionDraft'
    const transactionHash = this.transactionExecutor(privateKey, transactionDraftBuilderName, transactionParams)

    return transactionHash
  }

  /**
   * It gets the allowance of an erc20 token.
   *
   * @param {String} personalWalletAddress The personal wallet address, owner of the  (EOA).
   * @param {String} tradingWalletAddress  The trading wallet address.
   * @throws {InvalidEthereumAddress}      If personalWalletAddress or the tokenAddress is not a valid ethereum address.
   */
  async getAllowanceAsync(personalWalletAddress, tradingWalletAddress) {
    this.checkEtherumAddress(personalWalletAddress)
    this.checkEtherumAddress(tradingWalletAddress)

    const transactionObjectDraft = this.transactionBuilder.buildGetAllowanceTransactionDraft(
      personalWalletAddress,
      tradingWalletAddress,
    )
    const allowanceHex = await this.transactionLib.call(transactionObjectDraft)
    const allowance = this.web3.toBigNumber(allowanceHex).toString(10)
    this.log.info({
      fn: 'getAllowanceAsync',
      allowance,
      tradingWalletAddress,
      personalWalletAddress,
    },
    'Retrieve allowance.')
    return allowance
  }

  /**
   * It gets balance of an erc20 token.
   *
   * @param {String} personalWalletAddress The personal wallet address, owner of the  (EOA).
   * @throws {InvalidEthereumAddress}      If personalWalletAddress or the tokenAddress is not a valid ethereum address.
   */
  async getBalanceOfAsync(personalWalletAddress) {
    this.checkEtherumAddress(personalWalletAddress)

    const transactionObjectDraft = this.transactionBuilder.buildGetBalanceOfTransactionDraft(
      personalWalletAddress,
    )
    const assetBalanceHex = await this.transactionLib.call(transactionObjectDraft)
    const assetBalance = this.web3.toBigNumber(assetBalanceHex).toString(10)
    this.log.info({ fn: 'getBalanceOfAsync', personalWalletAddress, assetBalance }, 'Retrieve token balanceOf.')

    return assetBalance
  }
}

module.exports = Erc20TokenService
