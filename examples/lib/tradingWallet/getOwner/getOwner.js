(async () => {
  const { TradingWalletServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tradingWalletService = TradingWalletServiceBuilder.build()

  const unralatedPersonalWalletAddress = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
  const tradingWallet = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const ownerAddress = await tradingWalletService.getOwnerAsync(unralatedPersonalWalletAddress, tradingWallet)
  console.log(ownerAddress)
})()
