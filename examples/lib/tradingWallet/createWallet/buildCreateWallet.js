(async () => {
  const { TradingWalletTransactionBuilder } = require('@eidoo/hybrid-exchange-sdk').factories
  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(web3)

  const personalWalletAddress = '0x70742a2530069fd1fa302766e2e58f7c03d63e4e'
  const privateKey = '78f07633a2f4f657ee962650d5946b629504551aff433182a1fd8ec9c29c67b4'

  const createWalletTransactionDraft = await tradingWalletTransactionBuilder
    .buildCreateWalletTransactionDraft(personalWalletAddress, privateKey)

  console.log(createWalletTransactionDraft)
})()
