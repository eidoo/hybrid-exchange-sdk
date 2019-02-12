(async () => {
  const { PairService } = require('@eidoo/hybrid-exchange-sdk').services
  const pairService = new PairService()
  const pairs = await pairService.listPairAsync()
  console.log(pairs)
})()
