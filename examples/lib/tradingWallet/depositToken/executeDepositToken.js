(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib

  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'
  const executeDepositTokenTxSigned = '0xf8a916843b9aca0083015e9f9489bcbe6bc2e8aa1271316594b6467fedaf54aad580b8442039d9fd0000000000000000000000009727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a00000000000000000000000000000000000000000000000006f05b59d3b200001ca0bae31ab9f04ac419f5258004ea21c035bef2841c23d52d722b4da95f6d7b7974a053ad0b2f89b24e2705c469d4eea135b1dee6af0cab1fcc73c699606f087e967d'

  const transactionHash = await transactionLib
    .execute(executeDepositTokenTxSigned, privateKey)
  console.log('Deposit Erc20 token, transactionHash: ', transactionHash)
})()
