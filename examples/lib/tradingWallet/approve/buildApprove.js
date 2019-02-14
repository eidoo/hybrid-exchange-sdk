(async () => {
  const { Erc20TokenTransactionBuilder } = require('@eidoo/hybrid-exchange-sdk').factories
  const Web3 = require('web3')

  const providerUrl = 'providerUrl'
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  const tokenAddress = '0x9727e2fb13f7f42d5a6f1a4a9877d4a7e0404d6a'
  const erc20TokenTransactionBuilder = new Erc20TokenTransactionBuilder(web3, { erc20TokenSmartContractAddress: tokenAddress })

  const personalWalletAddress = '0x70742a2530069fd1fa302766e2e58f7c03d63e4e'
  const tradingWalletAddress = '0x89bcbe6bc2e8aa1271316594b6467fedaf54aad5'
  const toDeposit = '500000000000000000' // 0.5 ETH

  const approveTransactionDraft = await erc20TokenTransactionBuilder.buildApproveTrasferTransactionDraft(
    personalWalletAddress, tradingWalletAddress, toDeposit,
  )
  console.log('approveTransactionDraft: ', JSON.stringify(approveTransactionDraft, null, 2))
})()
