(async () => {
  const { TradeService } = require('@eidoo/hybrid-exchange-sdk').services

  const tradeService = new TradeService()
  const trades = await tradeService.getAllTradesAsync()
  console.log(JSON.stringify(trades, null, 2))
})()
