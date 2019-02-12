const crypto = require('crypto')
const ethereumjsWallet = require('ethereumjs-wallet')

const { Factory } = require('rosie')

const getValueFromKey = (param, key, defaultValue) => (param && param[key] ? param[key] : defaultValue)

function getRandomAddress() {
  const wallet = ethereumjsWallet.generate()
  return wallet.getAddressString()
}

function getRandomIntValue(max) {
  return Math.floor(Math.random() * Math.floor(max)).toString()
}

const MockCreateOrderDataToSign = new Factory()
  .attrs({
    type: 'creation',
  })
  .attr('order', ['order'], order => ({
    exchangeAddress: getValueFromKey(order, 'exchangeAddress', getRandomAddress()),
    maker: getValueFromKey(order, 'maker', getRandomAddress()),
    offerTokenAddress: getValueFromKey(order, 'offerTokenAddress', getRandomAddress()),
    offerTokenAmount: getValueFromKey(order, 'offerTokenAmount', getRandomIntValue(10000).toString()),
    wantTokenAddress: getValueFromKey(order, 'wantTokenAddress', getRandomAddress()),
    wantTokenAmount: getValueFromKey(order, 'wantTokenAmount', getRandomIntValue(10000)).toString(),
    expirationBlock: getValueFromKey(order, 'expirationBlock', '1000'),
    salt: getValueFromKey(order, 'salt', crypto.randomBytes(64).toString('hex')),
  }))

module.exports = MockCreateOrderDataToSign
