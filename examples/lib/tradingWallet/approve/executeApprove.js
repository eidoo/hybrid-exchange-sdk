(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib

  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'
  const approveTxSigned = '0xf8a812843b9aca00827033949727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a80b844095ea7b300000000000000000000000089bcbe6bc2e8aa1271316594b6467fedaf54aad500000000000000000000000000000000000000000000000006f05b59d3b200001ba0e3a276c4e1920a5b8aedd6598e13a81a8c51ae38353656beb2a2ce6d7a9a3defa06910ec8c5d2a7b7483321115c9a71dd740917d5616440b0884dce55ae96486dc'

  const transactionHash = await transactionLib
    .execute(approveTxSigned, privateKey)
  console.log('Approve, transactionHash: ', transactionHash)
})()
