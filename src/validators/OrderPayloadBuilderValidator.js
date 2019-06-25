const Joi = require('@hapi/joi')

const BaseValidator = require('./BaseValidator')
const customJoiValidator = require('../utils/customJoiValidator')

const addressSchema = customJoiValidator.address().ethereum().required()

const pairAmountSchema = Joi.object().keys({
  offerTokenAmount: customJoiValidator.bigNumber().valid().required(),
  wantTokenAmount: customJoiValidator.bigNumber().valid().required(),
}).required()

const expirationBlockSchema = Joi.string().required()

const pairSchema = Joi.object().keys({
  offerTokenAddress: addressSchema,
  wantTokenAddress: addressSchema,
}).required()

const saltSchema = Joi.string().required()

const orderBuildSchema = Joi.object().keys({
  exchangeAddress: addressSchema,
  maker: addressSchema,
  offerTokenAddress: addressSchema,
  offerTokenAmount: customJoiValidator.bigNumber().valid().required(),
  wantTokenAddress: addressSchema,
  wantTokenAmount: customJoiValidator.bigNumber().valid().required(),
  salt: saltSchema,
  expirationBlock: expirationBlockSchema,
}).required()

class OrderPayloadBuilderValidator extends BaseValidator {
  validatePair(pair) {
    return this.constructor.validate(pair, pairSchema)
  }

  validatePairAmount(pairAmount) {
    return this.constructor.validate(pairAmount, pairAmountSchema)
  }

  validateAddress(address) {
    return this.constructor.validate(address, addressSchema)
  }

  validateExpirationBlock(expirationBlock) {
    return this.constructor.validate(expirationBlock, expirationBlockSchema)
  }

  validateSalt(salt) {
    return this.constructor.validate(salt, saltSchema)
  }

  validateBuildOrder(orderBuild) {
    return this.constructor.validate(orderBuild, orderBuildSchema)
  }
}

module.exports = OrderPayloadBuilderValidator
