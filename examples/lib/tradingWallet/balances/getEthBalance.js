(async () => {
  const { TradingWalletServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tradingWalletService = TradingWalletServiceBuilder.build()

  const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'
  const tokenAddress = '0x0000000000000000000000000000000000000000'
  const assetBalance = await tradingWalletService.getAssetBalanceAsync(personalWalletAddress, tokenAddress)
  console.log(assetBalance)
})()
