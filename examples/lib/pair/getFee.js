(async () => {
  const { PairService } = require('@eidoo/hybrid-exchange-sdk').services
  const pairService = new PairService()
  const baseSymbol = 'EDO'
  const quoteSymbol = 'ETH'
  const fee = await pairService.getFeeAsync(baseSymbol, quoteSymbol)
  console.log(fee)
})()
