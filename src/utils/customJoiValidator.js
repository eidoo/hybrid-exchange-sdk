const ethereumUtil = require('ethereumjs-util')
const Joi = require('joi')
const Web3 = require('web3')

const { existsSync } = require('fs')

const hexRegExp = /^0x[0-9a-fA-F]*$/

const web3 = new Web3(new Web3.providers.HttpProvider(''))

const extensions = [
  {
    name: 'hex0x',
    base: Joi.string().regex(hexRegExp),
    language: {
      short: 'too short',
      long: 'too long',
    },
    pre (value, state, options) {
      if (this._min != null && value.length < 2 * this._min + 2) {
        return this.createError('hex0x.short', { v: value }, state, options)
      } if (this._max != null && value.length > 2 * this._max + 2) {
        return this.createError('hex0x.long', { v: value }, state, options)
      }
      return value
    },
    rules: [
      {
        name: 'minBytes',
        params: { len: Joi.number() },
        setup ({ len }) { this._min = len },
      },
      {
        name: 'maxBytes',
        params: { len: Joi.number() },
        setup ({ len }) { this._max = len },
      },
      {
        name: 'exactBytes',
        params: { len: Joi.number() },
        setup ({ len }) { this._max = this._min = len },
      },
      {
        name: 'bits256',
        setup (params) { this._max = this._min = 32 },
      },
      {
        name: 'bits128',
        setup (params) { this._max = this._min = 16 },
      },
    ],
  },
  {
    name: 'address',
    language: {
      ethereum: 'needs to be an ethereum address',
    },
    rules: [
      {
        name: 'ethereum',
        validate(params, value, state, options) {
          if (!ethereumUtil.isValidAddress(value)) {
            return this.createError('address.ethereum', {}, state, options)
          }
          return value.toLowerCase()
        },
      },
    ],
  },
  {
    name: 'json',
    language: {
      invalid: 'is not a valid JSON',
    },
    rules: [
      {
        name: 'valid',
        validate(params, value, state, options) {
          try {
            return JSON.parse(value)
          } catch (err) {
            return this.createError('json.invalid', {}, state, options)
          }
        },
      },
    ],
  },
  {
    name: 'path',
    language: {
      fileNotExist: 'file does not exist!',
    },
    rules: [
      {
        name: 'existFile',
        validate(params, value, state, options) {
          if (!existsSync(value)) {
            return this.createError('path.fileNotExist', {}, state, options)
          }

          return value
        },
      },
    ],
  },
  {
    name: 'privateKey',
    language: {
      invalidEthereumPrivateKey: 'is an invalid ethereum private key.',
    },
    rules: [
      {
        name: 'ethereumValidPrivateKey',
        validate(params, value, state, options) {
          const privateKeyWithPrefix = ethereumUtil.addHexPrefix(value)
          const privateKeyBuffered = ethereumUtil.toBuffer(privateKeyWithPrefix)
          const isValidPrivateKey = ethereumUtil.isValidPrivate(privateKeyBuffered)
          if (!isValidPrivateKey) {
            return this.createError('privateKey.invalidEthereumPrivateKey', {}, state, options)
          }

          return value
        },
      },
    ],
  },
  {
    name: 'bigNumber',
    language: {
      invalid: 'is not a valid BigNumber input',
    },
    rules: [
      {
        name: 'valid',
        validate(params, value, state, options) {
          try {
            const valueToBN = web3.toBigNumber(value)
            return valueToBN.toString(10)
          } catch (err) {
            return this.createError('json.invalid', {}, state, options)
          }
        },
      },
    ],
  },
  {
    name: 'gas',
    language: {
      notNumber: 'is not a number',
      isLessThanOne: 'is less than 1',
    },
    rules: [
      {
        name: 'valid',
        validate(params, value, state, options) {
          if (!(typeof value === 'number')) {
            return this.createError('gas.notNumber', {}, state, options)
          }
          if (value < 1) {
            return this.createError('gas.isLessThanOne', {}, state, options)
          }

          return value
        },
      },
    ],
  },
  {
    name: 'nonce',
    language: {
      notNumber: 'is not a number',
      isLessThanZero: 'is less than 0',
    },
    rules: [
      {
        name: 'valid',
        validate(params, value, state, options) {
          if (!(typeof value === 'number')) {
            return this.createError('nonce.notNumber', {}, state, options)
          }
          if (value < 0) {
            return this.createError('nonce.isLessThanOne', {}, state, options)
          }

          return value
        },
      },
    ],
  },
]

const customJoiValidator = Joi.extend(extensions)

module.exports = customJoiValidator
