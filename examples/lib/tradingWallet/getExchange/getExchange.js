(async () => {
  const { TradingWalletServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tradingWalletService = TradingWalletServiceBuilder.build()

  const personalWalletAddress = '0xdb1b9e1708aec862fee256821702fa1906ceff67'
  const exchangeAddress = await tradingWalletService.getExchangeAsync(personalWalletAddress)
  console.log(exchangeAddress)
})()
