const Web3 = require('web3')

const logger = require('../logger')
const TradingWalletTransactionBuilder = require('./TradingWalletTransactionBuilder')

const { TransactionLib } = require('../lib/TransactionLib')
const { TradingWalletService } = require('../services')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
const transactionLibInstance = new TransactionLib(web3, logger)

/**
   * Class representing a simple factory to build TradingWalletService object.
   */

class TradingWalletServiceBuilder {
  static build() {
    const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(web3)
    return new TradingWalletService(web3, transactionLibInstance, tradingWalletTransactionBuilder, logger)
  }
}

module.exports = TradingWalletServiceBuilder
