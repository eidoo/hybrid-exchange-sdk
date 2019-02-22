/**
 * Class representing the transaction library interface.
 */
class ITransactionLib {
  // eslint-disable-next-line class-methods-use-this
  buildDraft() {
    return Promise.reject(new Error('Method "buildDraft" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  getGasEstimation() {
    return Promise.reject(new Error('Method "getGasEstimation" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  getNonce() {
    return Promise.reject(new Error('Method "getNonce" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  sign() {
    return Promise.reject(new Error('Method "sign" has not been implemented yet.'))
  }

  // eslint-disable-next-line class-methods-use-this
  execute() {
    return Promise.reject(new Error('Method "execute" has not been implemented yet.'))
  }
}

module.exports = ITransactionLib
