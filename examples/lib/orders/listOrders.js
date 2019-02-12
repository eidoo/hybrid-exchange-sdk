(async () => {
  const { OrderService } = require('@eidoo/hybrid-exchange-sdk').services

  const orderService = new OrderService()
  const tradingWalletAddress = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const orders = await orderService.listOrderAsync(tradingWalletAddress)
  console.log(orders)
})()
