(async () => {
  const { TradingWalletTransactionBuilder } = require('@eidoo/hybrid-exchange-sdk').factories

  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(web3)

  const personalWalletAddress = '0xcf4b07a79b5d29988f488f30c4a676ecaad35c02'
  const tradingWalletAddress = '0x9c6d1840381cc570235a4ed867bf8465e32ce753'
  const exchangeAddress = '0xe0acbd29291abb23a4515d4fee57531eaa4c789f'

  const updateExchangeTransactionDraft = await tradingWalletTransactionBuilder
    .buildUpdateExchangeTransactionDraft(
      personalWalletAddress,
      tradingWalletAddress,
      exchangeAddress,
    )
  console.log('depositTokenTransactionDraft: ', JSON.stringify(updateExchangeTransactionDraft, null, 2))
})()
