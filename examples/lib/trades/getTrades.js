(async () => {
  const { TradeService } = require('@eidoo/hybrid-exchange-sdk').services

  // data parameter format 'YYYY-MM-DDTHH:MM:SSZ' -> ISO 8601 / RFC3339 in UTC
  const fromDate = null // Optional, if omitted all the trades from the beginning of time will be retrieved
  const toDate = null // Optional, if omitted all the trades up until current time will be retrieved

  const tradeService = new TradeService()
  const trades = await tradeService.listAllTradesAsync(fromDate, toDate)
  console.log(JSON.stringify(trades, null, 2))
})()
