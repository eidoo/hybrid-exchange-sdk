(async () => {
  const { TradingWalletService } = require('@eidoo/hybrid-exchange-sdk').services
  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  const tradingWalletService = new TradingWalletService(web3)

  const personalWalletAddress = '0x70742a2530069fd1fa302766e2e58f7c03d63e4e'

  const tradingWalletAddress = await tradingWalletService.getTradingWalletAddressAsync(personalWalletAddress)
  console.log(tradingWalletAddress)
})()
