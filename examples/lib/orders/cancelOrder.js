(async () => {
  const { OrderService } = require('@eidoo/hybrid-exchange-sdk').services

  const orderService = new OrderService()
  const privateKey = '0xa8345d27c6d41e4816163fe133daddf38298bb74c16ea5f8245727d03a5f85f8'
  const orderId = '0xc8d56f5299752114e477317fa11b2a259c0683ddea6dbb22ae5104d8805ed62e'
  const deletedOrderId = await orderService.cancelOrderAsync(orderId, privateKey)
  console.log(deletedOrderId)
})()
