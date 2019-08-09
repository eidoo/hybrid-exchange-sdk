const _ = require('lodash')

let config = {
  exchange: {
    apiBaseUrl: 'https://eidoo-api-1.eidoo.io',
    smartContractAddress: '0x560d5afc42ad137dece2277fd75001c165cb9a22',
  },
  ethApi: {
    host: 'eidoo-api-1.eidoo.io',
    port: 443,
    useTLS: true,
  },
}

let ovverrideConfig
try {
  // eslint-disable-next-line
  ovverrideConfig = require('./override.json')
  config = _.merge(config, ovverrideConfig)
} catch (err) {
  // Do nothing
}

module.exports = config
