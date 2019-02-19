(async () => {
  const { TradingWalletServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tradingWalletService = TradingWalletServiceBuilder.build()

  const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
  const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'
  const tradingWalletAddress = '0x9c6d1840381cc570235a4ed867bf8465e32ce753'
  const privateKey = '0x4c7ee440ad699493b22732031e4a3277d2d8aa834b727aa0b358e3310aa37384'
  const quantityToDeposit = '500000000000000000'

  const transactionHash = await tradingWalletService.depositTokenAsync(
    personalWalletAddress,
    tradingWalletAddress,
    quantityToDeposit,
    tokenAddress,
    privateKey,
  )
  console.log(transactionHash)
})()
