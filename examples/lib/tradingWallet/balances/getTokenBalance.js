(async () => {
  const { TradingWalletServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tradingWalletService = TradingWalletServiceBuilder.build()

  const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'
  const tradingWalletAddress = '0x9c6d1840381cc570235a4ed867bf8465e32ce753'
  const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
  const assetBalance = await tradingWalletService
    .getAssetBalanceAsync(personalWalletAddress, tokenAddress, tradingWalletAddress)
  console.log(assetBalance)
})()
