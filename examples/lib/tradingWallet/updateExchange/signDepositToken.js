(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib
  const transactionLib = new TransactionLib()

  const privateKey = '4c7ee440ad699493b22732031e4a3277d2d8aa834b727aa0b358e3310aa37384'
  const updateExchangeTransactionDraft = {
    data: '0x648a0c91000000000000000000000000e0acbd29291abb23a4515d4fee57531eaa4c789f',
    from: '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02',
    to: '0x9c6d1840381cc570235a4ed867bf8465e32ce753',
    value: '0x0',
  }

  const signedTransactionData = await transactionLib.sign(updateExchangeTransactionDraft, privateKey)
  console.log('signedTransactionData: ', signedTransactionData)
})()
