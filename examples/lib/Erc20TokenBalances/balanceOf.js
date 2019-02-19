(async () => {
  const { Erc20TokenServiceBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
  const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'

  const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(tokenAddress)
  const erc20TokenService = erc20TokenServiceBuilder.build()
  const assetBalance = await erc20TokenService.getBalanceOfAsync(
    personalWalletAddress,
  )
  console.log('allowance: ', assetBalance)
})()
