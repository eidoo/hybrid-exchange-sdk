const Web3 = require('web3')

const logger = require('../logger')

const { TransactionLib } = require('../lib/TransactionLib')

const providerUrl = 'urlToProvider'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

/**
   * Class representing a simple factory to build Transaction lib object.
   */
class TransactionLibBuilder {
  static build() {
    return new TransactionLib({ web3, logger })
  }
}

module.exports = TransactionLibBuilder
