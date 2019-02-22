(async () => {
  const { TradingWalletTransactionBuilder, Erc20TokenServiceBuilder, Erc20TokenTransactionBuilder } = require('@eidoo/hybrid-exchange-sdk').factories
  const { TradingWalletFacade } = require('@eidoo/hybrid-exchange-sdk').facades
  const { TransactionLib } = require('@eidoo/hybrid-exchange-sdk').lib.TransactionLib

  const Web3 = require('web3')
  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

  const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
  const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'
  const tradingWalletAddress = '0x9c6d1840381cc570235a4ed867bf8465e32ce753'
  const privateKey = '0x4c7ee440ad699493b22732031e4a3277d2d8aa834b727aa0b358e3310aa37384'
  const quantityToDeposit = '500000000000000000'

  const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(web3)
  const erc20TokenServiceBuilder = new Erc20TokenServiceBuilder(tokenAddress)
  const transactionLib = new TransactionLib()
  const erc20TokenTransactionBuilder = new Erc20TokenTransactionBuilder(
    web3,
    { erc20TokenSmartContractAddress: tokenAddress,
      transactionLib },
  )
  const tradingWalletFacade = new TradingWalletFacade(
    tradingWalletTransactionBuilder,
    erc20TokenServiceBuilder.build(),
    erc20TokenTransactionBuilder,
  )

  await tradingWalletFacade.depositTokenAsync(
    personalWalletAddress,
    tradingWalletAddress,
    quantityToDeposit,
    tokenAddress,
    privateKey,
  )
})()
