(async () => {
  const { OrderService } = require('@eidoo/hybrid-exchange-sdk').services

  const orderService = new OrderService()
  const tradingWalletAddress = '0x230cd1dc412c44bb95aa39018e2a2aed28ebadfc'
  const orderId = '0xfdacc84fd82c7b5ed9908e0010828f5a3b4434eabfbd542e25988133a13ffead'
  const orders = await orderService.getOrderAsync(tradingWalletAddress, orderId)
  console.log(orders)
 })()
