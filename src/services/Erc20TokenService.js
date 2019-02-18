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
    const allowance = await this.transactionLib.call(transactionObjectDraft)

    return this.web3.toBigNumber(allowance).toString(10)
  }
}

module.exports = Erc20TokenService
