(async () => {
  const { TradingWalletService } = require('@eidoo/hybrid-exchange-sdk').services
  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  const tradingWalletService = new TradingWalletService(web3)

  const personalWalletAddress = '0xf6ccfafbe3ac8b6c82f39f54530a5ff7c0a1ed52'
  const tradingWalletAddress = '0xa3725d5a71db4550770d5c96b0104e40e8be8d23'
  const privateKey = 'bf177acb6470f78c01209c1461fb0a104b2b0dbff9607d0b95b7e02f450b4142'
  const quantityToDeposit = '500000000000000000'

  const transactionHash = await tradingWalletService.depositEtherAsync(
    personalWalletAddress,
    tradingWalletAddress,
    quantityToDeposit,
    privateKey,
  )
  console.log(transactionHash)
})()
