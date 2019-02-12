/**
 * Class representing the Eidoo Exchange API library interface.
 */
class IExchangeApiLib {
  // eslint-disable-next-line class-methods-use-this
  callAsync() {
    return Promise.reject(new Error('Method "callAsync" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  listOrderAsync() {
    return Promise.reject(new Error('Method "getOrdersAsync" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  getOrderAsync() {
    return Promise.reject(new Error('Method "getOrderAsync" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  getOrderBookAsyncAsync() {
    return Promise.reject(new Error('Method "getOrderBookAsyncAsync" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  cancelOrderAsync() {
    return Promise.reject(new Error('Method "cancelOrderAsync" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  createOrderAsync() {
    return Promise.reject(new Error('Method "createOrderAsync" has not been implemented yet.'))
  }
}

module.exports = IExchangeApiLib
