(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib

  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'
  const withdrawSignedTxData = '0xf8a80e843b9aca00825df39489bcbe6bc2e8aa1271316594b6467fedaf54aad580b844f3fef3a3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006f05b59d3b200001ca003abc81e9f3a4b8504278d53f64103de260796bdc3b1fef4748fe0d6ecc5cd5ca0612765116ac0d0159ed13fcc8ce833f45e9cf2535d856e27d5fe4f37091911f2'

  const transactionHash = await transactionLib
    .execute(withdrawSignedTxData, privateKey)
  console.log('Withdraw, transactionHash: ', transactionHash)
})()
