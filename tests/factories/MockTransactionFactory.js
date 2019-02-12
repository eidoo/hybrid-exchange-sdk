const _ = require('lodash')
const { addHexPrefix } = require('ethereumjs-util')
const { Factory } = require('rosie')
const { randomBytes } = require('crypto')

const { Transaction } = require('../../src/models/Transaction')

const HEX_ZERO_VALUE = '0x0'
const MIN_GAS_INTERVAL = 20000
const MAX_GAS_INTERVAL = 40000
const ETHEREUM_ADDRESS_LENGTH = 40
const DATA_LENGTH = 74

const getRandomHex = size => addHexPrefix(randomBytes(Math.ceil(size / 2)).toString('hex').slice(0, size))
const getRandomGas = () => _.random(MIN_GAS_INTERVAL, MAX_GAS_INTERVAL)

const MockTransactionFactory = Factory.define('Transaction', Transaction)
  .attrs({ data: getRandomHex(DATA_LENGTH),
    from: getRandomHex(ETHEREUM_ADDRESS_LENGTH),
    to: getRandomHex(ETHEREUM_ADDRESS_LENGTH),
    value: HEX_ZERO_VALUE,
    nonce: 0,
    gas: getRandomGas(),
    gasPrice: getRandomGas() })

module.exports = MockTransactionFactory
