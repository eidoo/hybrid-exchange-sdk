(async () => {
  const { TradingWalletTransactionBuilder } = require('@eidoo/hybrid-exchange-sdk').factories
  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(web3)

  const personalWalletAddress = '0x70742a2530069fd1fa302766e2e58f7c03d63e4e'
  const tradingWalletAddress = '0x89bcbe6bc2e8aa1271316594b6467fedaf54aad5'

  const toDeposit = '500000000000000000' // 0.5 ETH
  const depositEthTransactionDraft = await tradingWalletTransactionBuilder
    .buildDepositEtherTransactionDraft(personalWalletAddress, tradingWalletAddress, toDeposit)
  console.log('depositEthTransactionDraft: ', JSON.stringify(depositEthTransactionDraft, null, 2))
})()
