const { OrderSignerHelper } = require('@eidoo/hybrid-exchange-sdk').helpers

const orderParams = {
  exchangeAddress: '0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e',
  maker: '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc',
  offerTokenAddress: '0x2b2c319799df9d98b0fd34c961a2e1181239de27',
  offerTokenAmount: '20000000000000000000',
  wantTokenAddress: '0x0000000000000000000000000000000000000000',
  wantTokenAmount: '90000000000000000000',
  expirationBlock: '1000',
  salt: '87497352680706752771859228505604318260083812617224296408163389250870428287169',
}

const privateKey = '406718da1be75ed0xa8345d27c6d41e4816163fe133daddf38298bb74c16ea5f8245727d03a5f85f89a87d51a9dfe0a4b87f420e5126c765ea3fdab25297dfcb34'
const orderSignerHelper = new OrderSignerHelper()

const signedTransactionData = orderSignerHelper.signOrderCreate(orderParams, privateKey)

console.log(signedTransactionData)
