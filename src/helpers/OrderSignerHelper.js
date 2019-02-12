const { soliditySHA3 } = require('ethereumjs-abi')

const etherumUtil = require('ethereumjs-util')
const BN = require('bn.js')

const log = require('../logger')

const { BaseError } = require('../utils/errors')
const { InvalidPrivateKeyError } = require('../services/PrivateKeyService')

class OrderSignerHelperError extends BaseError {}

const EXCHANGE_CANCEL_REQUEST_PARAM = 'cancel_request'

function toBN (value) {
  return new BN(value.toString(10), 10)
}

function getOrderHashHex(orderSignerHelperInstance, orderParts) {
  try {
    const types = orderParts.map(o => o.type)
    const values = orderParts.map(o => o.value)
    const hashBuff = soliditySHA3(types, values)
    const hashHex = etherumUtil.bufferToHex(hashBuff)
    orderSignerHelperInstance.log.debug(
      { fn: 'getOrderHashHex', types, values },
      'Hashed order using soliditySha3.',
    )

    return hashHex
  } catch (err) {
    orderSignerHelperInstance.log.error(
      { fn: 'getOrderHashHex', orderParts, err },
      'Hashed order using soliditySha3.',
    )

    throw new OrderSignerHelperError(err)
  }
}

function getEcSig(orderSignerHelperInstance, hash, privateKey) {
  try {
    const dataBuffer = etherumUtil.toBuffer(hash)
    const msgHash = etherumUtil.bufferToHex(etherumUtil.hashPersonalMessage(dataBuffer))
    const msgHashBuffered = etherumUtil.toBuffer(msgHash)
    const privateKeyWithPrefix = etherumUtil.addHexPrefix(privateKey)
    const privateKeyBuffered = etherumUtil.toBuffer(privateKeyWithPrefix)
    const sig = etherumUtil.ecsign(msgHashBuffered, privateKeyBuffered)
    const ecSig = {
      r: etherumUtil.bufferToHex(sig.r),
      s: etherumUtil.bufferToHex(sig.s),
      v: sig.v,
    }

    orderSignerHelperInstance.log.debug(
      { fn: 'getEcSig', ecSig },
      'Getting ecSignature.',
    )

    return ecSig
  } catch (err) {
    orderSignerHelperInstance.log.error(
      { fn: 'getEcSig', err },
      'Error getting ecSignature.',
    )

    throw new InvalidPrivateKeyError(err)
  }
}

function sign(orderSignerHelperInstance, dataToSign, privateKey) {
  const orderHashHex = getOrderHashHex(orderSignerHelperInstance, dataToSign)
  const ecSignature = getEcSig(orderSignerHelperInstance, orderHashHex, privateKey)
  return ecSignature
}

/**
 * Class representing an helper used to sign order creation and order delete.
 *
 * @param  {Object}    logger The logger instance
 */
class OrderSignerHelper {
  constructor(logger = log) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })
  }

  /**
   * Sign the order delete.
   *
   * @param {String} orderId    The order id.
   * @param {String} privateKey The private key.
   */
  signOrderCancel(orderId, privateKey) {
    const cancelOrderDataToSign = [
      { value: orderId, type: 'bytes32' },
      { value: EXCHANGE_CANCEL_REQUEST_PARAM, type: 'string' },
    ]
    const ecSignature = sign(this, cancelOrderDataToSign, privateKey)
    return ecSignature
  }

  /**
   * Sign the order create. If you want to create an order you have
   * add its signature in the create request.
   *
   * @param {Object} order                  The order to sign.
   * @param {String} order.exchangeAddress  The exchange smart contract address.
   * @param {String} order.maker            The maker address.
   * @param {String} order.offerTokenAddres The offer token address.
   * @param {String} order.offerTokenAmount The offer token amount.
   * @param {String} order.wantTokenAddress The offer token amount.
   * @param {String} order.wantTokenAmount  The want token amount.
   * @param {String} order.expirationBlock  The expiration block.
   * @param {String} order.salt             The salt used to sign.
   * @param {String} privateKey             The private key.
   */
  signOrderCreate(order, privateKey) {
    const createOrderDataToSign = [
      { value: order.exchangeAddress, type: 'address' },
      { value: order.maker, type: 'address' },
      { value: order.offerTokenAddress, type: 'address' },
      { value: toBN(order.offerTokenAmount), type: 'uint256' },
      { value: order.wantTokenAddress, type: 'address' },
      { value: toBN(order.wantTokenAmount), type: 'uint256' },
      { value: toBN(order.expirationBlock), type: 'uint256' },
      { value: toBN(order.salt), type: 'uint256' },
    ]
    const ecSignature = sign(this, createOrderDataToSign, privateKey)
    return ecSignature
  }
}

module.exports = OrderSignerHelper
