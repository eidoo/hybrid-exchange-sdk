// eslint-disable-next-line import/no-extraneous-dependencies
const ethereumjsWallet = require('ethereumjs-wallet')
const Web3 = require('web3')

const providerUrl = 'http://dev-shared.eidoo.io:8545'
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getFundedPersonalWallet = async () => {
  const wallet = ethereumjsWallet.generate()
  const address = wallet.getAddressString()
  const privateKey = wallet.getPrivateKeyString()
  console.log(`EOA: ${address}  - private key: ${privateKey}`)
  web3.eth.sendTransaction({ from: web3.eth.coinbase, to: address, value: web3.toWei(10) })
  console.log('Waiting for ETH deposit to EOA...')
  // TODO: remove in favor of a getTransactionReceipt status
  await sleep(6000)
  return {
    address,
    privateKey,
  }
}

module.exports = {
  getFundedPersonalWallet,
}
