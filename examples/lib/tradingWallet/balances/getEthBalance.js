(async () => {
  const { TradingWalletService } = require('@eidoo/hybrid-exchange-sdk').services
  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

  const tradingWalletService = new TradingWalletService(web3)

  const personalWalletAddress = '0xf6ccfafbe3ac8b6c82f39f54530a5ff7c0a1ed52'
  const tokenAddress = '0x0000000000000000000000000000000000000000'
  const assetBalance = await tradingWalletService.getAssetBalanceAsync(personalWalletAddress, tokenAddress)
  console.log(assetBalance)
})()
