(async () => {
  const { TradingWalletServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tradingWalletService = TradingWalletServiceBuilder.build()

  const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'
  const tradingWalletAddress = '0x9c6d1840381cc570235a4ed867bf8465e32ce753'
  const exchangeAddress = '0xe0acbd29291abb23a4515d4fee57531eaa4c789f'
  const privateKey = '0x4c7ee440ad699493b22732031e4a3277d2d8aa834b727aa0b358e3310aa37384'

  const transactionHash = await tradingWalletService.updateExchangeAsync(
    personalWalletAddress,
    tradingWalletAddress,
    exchangeAddress,
    privateKey,
  )
  console.log(transactionHash)
})()
