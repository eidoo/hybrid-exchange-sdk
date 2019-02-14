(async () => {
  const { Erc20TokenService } = require('@eidoo/hybrid-exchange-sdk').services
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib
  const { Erc20TokenTransactionBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

  const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
  const personalWalletAddress = '0xf6ccfafbe3ac8b6c82f39f54530a5ff7c0a1ed52'
  const tradingWalletAddress = '0xa3725d5a71db4550770d5c96b0104e40e8be8d23'

  const transactionLib = new TransactionLib()

  const erc20TokenTransactionBuilder = new Erc20TokenTransactionBuilder(
    web3,
    { erc20TokenSmartContractAddress: tokenAddress,
      transactionLib },
  )

  const erc20TokenService = new Erc20TokenService(web3, transactionLib, erc20TokenTransactionBuilder)
  const allowance = await erc20TokenService.getAllowanceAsync(
    personalWalletAddress,
    tradingWalletAddress,
  )
  console.log('allowance: ', allowance)
})()
