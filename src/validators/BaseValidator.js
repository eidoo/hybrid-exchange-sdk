const Joi = require('@hapi/joi')

const ValidatorError = require('./ValidationError')
const { MultiValidationError } = require('../utils/errors')

/**
 * Class representing a base validator.
 */
class BaseValidator {
  /**
   * Create a base validator.Base
   * @param  {Object}    logger The logger instance.
   * @throws {TypeError}        If some required property is missing.
   */
  constructor(logger) {
    if (!logger) {
      throw new TypeError(`Invalid "logger" value: ${logger}`)
    }
    this.log = logger.child({ module: this.constructor.name })
  }

  static validateWithSchema(value, schema) {
    const validatorOptions = {
      abortEarly: false,
    }
    const { error } = Joi.validate(value, schema, validatorOptions)
    if (error !== null && error.details) {
      return error.details.map(item => new ValidatorError(item.message, item.context.key))
    }
    return null
  }

  static validate(values, schema) {
    let errors
    const validatorOptions = {
      abortEarly: false,
    }
    const { error, value } = Joi.validate(values, schema, validatorOptions)

    if (error !== null && error.details) {
      errors = error.details.map(item => new ValidatorError(item.message, item.context.key))
    }

    if (errors) {
      throw new MultiValidationError((values && values.id) || '', errors)
    }

    return value
  }
}

module.exports = BaseValidator
