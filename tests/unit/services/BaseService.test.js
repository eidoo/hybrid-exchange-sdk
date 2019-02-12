/* global describe, expect, test */

const BaseService = require('../../../src/services/BaseService')
const logger = require('../../../src/logger')

describe('BaseService (unit)', () => {
  describe('constructor', () => {
    test('should throw a TypeError if logger is undefined', () => {
      expect(() => new BaseService()).toThrow(TypeError, 'Invalid "logger" value: undefined')
    })
  })

  describe('throwError', () => {
    test('should throw the right error', () => {
      const baseService = new BaseService(logger, {}, {})
      expect(() => baseService.throwError('This is a test', RangeError)).toThrow(RangeError, 'This is a test')
    })
  })
})
