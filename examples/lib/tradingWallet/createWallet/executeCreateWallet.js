(async () => {
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib

  const transactionLib = new TransactionLib()

  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'
  const createWalletRawTxSigned = '0xf88880843b9aca0083095efd94bfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e80a4c1d5e84f00000000000000000000000070742a2530069fd1fa302766e2e58f7c03d63e4e1ca0fcaeabbb62f15a1c73e3fefcd8f63fdd324d768ecd13a90b6f1f539f15ab3a2fa0563d560fc414bda01afa8f850fc50284833a296be7ddca2c9951411f02dd81a6'

  const transactionHash = await transactionLib
    .execute(createWalletRawTxSigned, privateKey)
  console.log('createWallet, transactionHash: ', transactionHash)
})()
