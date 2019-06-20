class Trade {
  static get STATUSES() {
    return {
      fail: 'fail',
      pending: 'pending',
      success: 'success',
    }
  }

  static get TYPES() {
    return {
      limit: 'limit',
      market: 'market',
    }
  }
}

module.exports = Trade
