(async () => {
  const { Erc20TokenServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
  const personalWalletAddress = '0xf6ccfafbe3ac8b6c82f39f54530a5ff7c0a1ed52'
  const tradingWalletAddress = '0xa3725d5a71db4550770d5c96b0104e40e8be8d23'

  const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(tokenAddress)
  const erc20TokenService = erc20TokenServiceBuilder.build()
  const allowance = await erc20TokenService.getAllowanceAsync(
    personalWalletAddress,
    tradingWalletAddress,
  )
  console.log('allowance: ', allowance)
})()
