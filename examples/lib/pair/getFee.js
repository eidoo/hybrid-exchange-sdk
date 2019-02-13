(async () => {
  const { PairService } = require('@eidoo/hybrid-exchange-sdk').services
  const pairService = new PairService()
  const fromSymbol = 'EDO'
  const toSymbol = 'ETH'
  const fee = await pairService.getFeeAsync(fromSymbol, toSymbol)
  console.log(fee)
})()
