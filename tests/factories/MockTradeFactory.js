const { Factory } = require('rosie')
const ethereumUtil = require('ethereumjs-util')

const typeOptions = ['buy', 'sell']

const generateRandomTransactionHash = () => {
  let randomTransactionHash = ''
  for (let j = 0; j < 64; j += 1) {
    const randomByte = parseInt(Math.random() * 16, 10).toString(16)
    randomTransactionHash += randomByte
  }
  return randomTransactionHash
}

const MockTradeFactory = new Factory()
  .attrs(
    {
      id: () => ethereumUtil.addHexPrefix(generateRandomTransactionHash()),
      baseAddress: () => ethereumUtil.bufferToHex(ethereumUtil.generateAddress(Math.floor(Math.random() * (100 - 0)))),
      quoteAddress: () => ethereumUtil.bufferToHex(ethereumUtil.generateAddress(Math.floor(Math.random() * (100 - 0)))),
      price: () => (Math.random() * (1 - 0)).toFixed(5),
      lastUpdatedAt: () => new Date(),
      size: () => (Math.random() * (100 - 0)).toFixed(3),
      type: () => typeOptions[Math.floor(Math.random() * typeOptions.length)],
    },
  )

module.exports = MockTradeFactory
