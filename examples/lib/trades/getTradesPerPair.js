(async () => {
  const { TradeService } = require('@eidoo/hybrid-exchange-sdk').services

  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'

  const tradeService = new TradeService()
  const trades = await tradeService.getAllTradesAsync(baseSymbol, quoteSymbol)
  console.log(JSON.stringify(trades, null, 2))
})()
