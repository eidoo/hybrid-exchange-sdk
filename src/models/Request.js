class Request {
  static get TYPES() {
    return {
      creation: 'creation',
      cancellation: 'cancellation',
    }
  }
}

module.exports = Request
