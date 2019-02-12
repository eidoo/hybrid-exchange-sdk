(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib
  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'

  const createWalletTransactionDraft = {
    data: '0xc1d5e84f00000000000000000000000070742a2530069fd1fa302766e2e58f7c03d63e4e',
    from: '0x70742a2530069fd1fa302766e2e58f7c03d63e4e',
    to: '0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e',
    value: '0x0',
  }

  const nonce = 0
  const gas = {
    gas: 614141,
    gasPrice: 1000000000,
  }

  const signedTransactionData = await transactionLib.sign(createWalletTransactionDraft, privateKey, nonce, gas)
  console.log('signedTransactionData: ', signedTransactionData)
})()
