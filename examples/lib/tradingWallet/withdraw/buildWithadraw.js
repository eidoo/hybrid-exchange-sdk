(async () => {
  const { TradingWalletTransactionBuilder } = require('@eidoo/hybrid-exchange-sdk').factories
  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  const tradingWalletTransactionBuilder = new TradingWalletTransactionBuilder(web3)

  const personalWalletAddress = '0xb166ce917afe7ac26ae04783fe5de954b002a578'
  const tradingWalletAddress = '0x302a360a819956143cdb1e11a6363046c30ec8c6'
  const tokenAddress = '0x0000000000000000000000000000000000000000'
  const toWithdraw = '500000000000000000' // 0.5 ETH
  const withdrawTransactionDraft = await tradingWalletTransactionBuilder.buildWithdrawTransactionDraft(
    personalWalletAddress,
    tradingWalletAddress,
    toWithdraw,
    tokenAddress,
  )
  console.log('withdrawTransactionDraft: ', JSON.stringify(withdrawTransactionDraft, null, 2))
})()
