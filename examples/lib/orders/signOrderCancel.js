const { OrderSignerHelper } = require('@eidoo/hybrid-exchange-sdk').helpers

const orderSignerHelper = new OrderSignerHelper()
const privateKey = '406718da1be75ed9a87d51a9dfe0a4b87f420e5126c765ea3fdab25297dfcb34'
const orderId = '0xee121cf566ffece86e3887f1dc337a553fd6a0bfe45f6a91b7715de1ea1f013d'

const signedTransactionData = orderSignerHelper.signOrderCancel(orderId, privateKey)
console.log(signedTransactionData)
