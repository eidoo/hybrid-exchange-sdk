(async () => {
  const { PairService } = require('@eidoo/hybrid-exchange-sdk').services
  const pairService = new PairService()
  const fromSymbol = 'EDO'
  const toSymbol = 'ETH'
  const price = await pairService.getLastPriceAsync(fromSymbol, toSymbol)
  console.log(price)
})()
