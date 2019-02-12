(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib

  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'
  const approveTransactionDraft = {
    data: '0x095ea7b300000000000000000000000089bcbe6bc2e8aa1271316594b6467fedaf54aad500000000000000000000000000000000000000000000000006f05b59d3b20000',
    from: '0x70742a2530069fd1fa302766e2e58f7c03d63e4e',
    to: '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a',
    value: '0x0',
  }

  const signedTransactionData = await transactionLib.sign(approveTransactionDraft, privateKey)
  console.log('signedTransactionData: ', signedTransactionData)
})()
