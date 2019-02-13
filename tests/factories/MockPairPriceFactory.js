const _ = require('lodash')
const { Factory } = require('rosie')

const MIN = 100000000
const MAX = 200000000

const getRandomPrice = () => _.random(MIN, MAX)

const MockPairPriceFactory = new Factory().attrs({ status: 'success',
  data: {
    change: {
      '1h': {
        perc: 0,
      },
      '1d': {
        perc: 0,
      },
      '1w': {
        perc: 10,
      },
    },
    last: getRandomPrice,
  } })

module.exports = MockPairPriceFactory
