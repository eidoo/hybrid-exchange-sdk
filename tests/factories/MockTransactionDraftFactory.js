const { addHexPrefix } = require('ethereumjs-util')
const { Factory } = require('rosie')
const { randomBytes } = require('crypto')

const HEX_ZERO_VALUE = '0x0'

const getRandomHex = size => addHexPrefix(randomBytes(Math.ceil(size / 2)).toString('hex').slice(0, size))

const MockTransactionDraftFactory = new Factory()
  .attrs({ data: getRandomHex(74), from: getRandomHex(40), to: getRandomHex(40), value: HEX_ZERO_VALUE })

module.exports = MockTransactionDraftFactory
