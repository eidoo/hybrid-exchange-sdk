(async () => {
  const { PairService } = require('@eidoo/hybrid-exchange-sdk').services
  const pairService = new PairService()
  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'
  const price = await pairService.getLastPriceAsync(baseSymbol, quoteSymbol)
  console.log(price)
})()
