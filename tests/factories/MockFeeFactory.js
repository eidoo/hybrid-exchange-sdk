const _ = require('lodash')
const { Factory } = require('rosie')

const MIN = 0
const MAX = 100

const getRandomFee = () => _.random(MIN, MAX)

const MockFeeFactory = new Factory().attrs({ status: 'success', data: { fee: getRandomFee() } })

module.exports = MockFeeFactory
