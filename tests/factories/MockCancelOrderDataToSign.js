const crypto = require('crypto')

const { addHexPrefix } = require('ethereumjs-util')
const { Factory } = require('rosie')

const getRandomHex = size => addHexPrefix(crypto.randomBytes(Math.ceil(size / 2)).toString('hex').slice(0, size))

const MockCancelOrderDataToSign = new Factory()
  .attrs({
    type: 'cancellation',
  })
  .attr('order', ['order'], order => ({
    id: order && order.id
      ? order.id
      : getRandomHex(64),
    confirmation: order && order.confirmation ? order.confirmation : 'cancel_request',
  }))

module.exports = MockCancelOrderDataToSign
