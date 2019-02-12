(async () => {
  const { OrderService } = require('@eidoo/hybrid-exchange-sdk').services

  const privateKey = 'a8345d27c6d41e4816163fe133daddf38298bb74c16ea5f8245727d03a5f85f8'
  const orderParams = {
    exchangeAddress: '0xbfd9aaac82281b54ecf60b7d53ccc9cdf13cd14e',
    maker: '0xdb1b9e1708aec862fee256821702fa1906ceff67',
    offerTokenAddress: '0x2b2c319799df9d98b0fd34c961a2e1181239de27',
    offerTokenAmount: '10000000000000000000',
    wantTokenAddress: '0x0000000000000000000000000000000000000000',
    wantTokenAmount: '30000000000000000000',
    expirationBlock: '1000',
    salt: '87497352680706752771859228505604318260083812617224296408163389250870428287169',
  }
  const orderService = new OrderService()
  try {
    const orderId = await orderService.createOrderAsync(orderParams, privateKey)
    console.log(orderId)

  }catch(err){
    console.log(err)
  }
})()
