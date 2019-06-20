(async () => {
  const { TradeService } = require('@eidoo/hybrid-exchange-sdk').services

  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'

  // data parameter format 'YYYY-MM-DDTHH:MM:SSZ' -> ISO 8601 / RFC3339 in UTC
  const fromDate = null // Optional, if omitted all the trades per pair from the beginning of time will be retrieved
  const toDate = null // Optional, if omitted all the trades per pair up until current time will be retrieved

  const tradeService = new TradeService()
  const trades = await tradeService.listTradesPerPairAsync(baseSymbol, quoteSymbol, fromDate, toDate)
  console.log(JSON.stringify(trades, null, 2))
})()
