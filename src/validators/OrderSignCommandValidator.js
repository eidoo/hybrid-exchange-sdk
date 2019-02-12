const Joi = require('joi')

const BaseValidator = require('./BaseValidator')
const customJoiValidator = require('../utils/customJoiValidator')
const validRequestType = require('../models/Request').TYPES

const EXCHANGE_CANCEL_REQUEST_PARAM = 'cancel_request'

const jsonValidateSchema = customJoiValidator.json().valid()

const signOrderCreationSchema = Joi.object().keys({
  type: Joi.string().valid(validRequestType.creation).required(),
  order: Joi.object().keys({
    exchangeAddress: customJoiValidator.address().ethereum().required(),
    maker: customJoiValidator.address().ethereum().required(),
    offerTokenAddress: customJoiValidator.address().ethereum().required(),
    offerTokenAmount: Joi.string().required(),
    wantTokenAddress: customJoiValidator.address().ethereum().required(),
    wantTokenAmount: Joi.string().required(),
    expirationBlock: Joi.string().required(),
    salt: Joi.string().required(),
  }),
})

const signOrderCancellationSchema = Joi.object().keys({
  type: Joi.string().valid(validRequestType.cancellation).required(),
  order: Joi.object().keys({
    id: Joi.string().required(),
    confirmation: Joi.string().valid(EXCHANGE_CANCEL_REQUEST_PARAM).required(),
  }),
})

const signOrderTypeSchema = Joi.object().keys({
  type: Joi.string().valid([validRequestType.creation, validRequestType.cancellation]).required(),
})

class OrderSignCommandValidator extends BaseValidator {
  signOrderCreation(signCreateOrderData) {
    return this.constructor.validate(signCreateOrderData, signOrderCreationSchema)
  }

  signOrderCancellation(signCancelOrderData) {
    return this.constructor.validate(signCancelOrderData, signOrderCancellationSchema)
  }

  signOrderType({ type }) {
    return this.constructor.validate({ type }, signOrderTypeSchema)
  }

  jsonValidate(jsonData) {
    return this.constructor.validate(jsonData, jsonValidateSchema)
  }
}

module.exports = OrderSignCommandValidator
