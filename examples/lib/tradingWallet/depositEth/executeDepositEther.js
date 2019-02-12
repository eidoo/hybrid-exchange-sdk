(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib
  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'
  const depositEtherSignedTxData = '0xf86f04843b9aca00828ba69489bcbe6bc2e8aa1271316594b6467fedaf54aad58806f05b59d3b200008498ea5fca1ba0a5632043c3f2b958cd5c02598f52c41290f8330c202b7b8ae993f335e339346aa05922f0ff3dbae752927bb76c832f4e8791e39bd3f928b5214b9d93076f9cd8c4'

  const transactionHash = await transactionLib
    .execute(depositEtherSignedTxData, privateKey)
  console.log('Deposit Ether, transactionHash: ', transactionHash)
})()
