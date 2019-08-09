const Web3 = require('web3')

const logger = require('../logger')
const Erc20TokenTransactionBuilder = require('./Erc20TokenTransactionBuilder')

const { TransactionLib } = require('../lib/TransactionLib')
const { Erc20TokenService } = require('../services')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

const transactionLib = new TransactionLib({ web3, logger })

/**
   * Class representing a simple factory to build Erc20TokenService object.
   */

class Erc20TokenServiceBuilder {
  constructor(tokenAddress, { transactionLibInstance = transactionLib } = {}) {
    if (!tokenAddress) {
      const errorMessage = `Invalid "tokenAddress" value: ${tokenAddress}`
      throw new TypeError(errorMessage)
    }
    if (!transactionLibInstance) {
      const errorMessage = `Invalid "transactionLibInstance" value: ${transactionLibInstance}`
      throw new TypeError(errorMessage)
    }

    this.tokenAddress = tokenAddress
    this.transactionLibInstance = transactionLibInstance
  }

  build() {
    const erc20TokenTransactionBuilder = new Erc20TokenTransactionBuilder(
      web3,
      { erc20TokenSmartContractAddress: this.tokenAddress,
        transactionLib: this.transactionLibInstance },
      logger,
    )
    return new Erc20TokenService(web3, this.transactionLibInstance, erc20TokenTransactionBuilder, logger)
  }
}

module.exports = Erc20TokenServiceBuilder
