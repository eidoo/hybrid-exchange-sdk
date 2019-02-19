class BaseError extends Error {
  constructor(...args) {
    super(...args)
    this.name = this.constructor.name
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(this.message)).stack
    }
  }
}

/**
 * This error will be reaised if the smart contract istance has not the definition
 * of the method the client is trying to call.
 */
class SmartContractInterfaceError extends BaseError {}

/**
 * This error will be raised if an address is not a valid Ethereum address.
 */
class InvalidEthereumAddress extends BaseError {}

/**
 * This error will be raised if the function was not implemetned.
 */
class NotImplementedError extends BaseError {}

/**
 * This error will be raised if there was an error during transaction sign process.
 */
class SignTransactionError extends BaseError {}

/**
 * This error will be raised if there was an error getting transaction nonce.
 */
class NonceError extends BaseError {}

/**
 * This error will be raised if there was an error getting transaction gas estiamtion.
 */
class GasEstimationError extends BaseError {}

/**
 * This error will be raised if there was an error executing transaction.
 */
class TransactionExecutionError extends BaseError {}

/**
 * This error will be raised if there was an error during call.
 */
class TransactionCallError extends BaseError {}

/**
 * This error will be raised if no trading wallet is found.
 */
class TradingWalletNotFoundError extends BaseError {}

/**
 * This error will be raised if the asset balance is less then the quantity to deposit.
 */
class QuantityNotEnoughError extends BaseError {}

/**
 * This error will be raised if the allowed quantity  is lower than approved quantity
 * during deposit token operation.
 */
class QuantityNotAllowedError extends BaseError {}


class MultiValidationError extends BaseError {
  constructor(id, errors) {
    super()
    this.id = id
    this.errors = errors
  }
}

module.exports = {
  BaseError,
  GasEstimationError,
  InvalidEthereumAddress,
  MultiValidationError,
  NonceError,
  NotImplementedError,
  QuantityNotAllowedError,
  SignTransactionError,
  SmartContractInterfaceError,
  TradingWalletNotFoundError,
  TransactionCallError,
  TransactionExecutionError,
  QuantityNotEnoughError,
}
