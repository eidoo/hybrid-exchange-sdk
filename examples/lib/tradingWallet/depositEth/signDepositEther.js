(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib
  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'
  const depositEthTransactionDraft = {
    data: '0x98ea5fca',
    from: '0x70742a2530069fd1fa302766e2e58f7c03d63e4e',
    to: '0x89bcbe6bc2e8aa1271316594b6467fedaf54aad5',
    value: '0x6f05b59d3b20000',
  }

  const signedTransactionData = await transactionLib.sign(depositEthTransactionDraft, privateKey)
  console.log('signedTransactionData: ', signedTransactionData)
})()
