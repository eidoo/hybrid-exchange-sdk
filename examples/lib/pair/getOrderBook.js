(async () => {
  const { PairService } = require('@eidoo/hybrid-exchange-sdk').services

  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'

  const pairService = new PairService()
  const orderBook = await pairService.getOrderBookAsync(baseSymbol, quoteSymbol)
  console.log(JSON.stringify(orderBook, null, 2))
})()
