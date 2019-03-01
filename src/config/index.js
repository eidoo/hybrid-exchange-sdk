const _ = require('lodash')

let config = {
  exchange: {
    apiBaseUrl: 'https://eidoo-api-1.eidoo.io',
    smartContractAddress: '0xf1c525a488a848b58b95d79da48c21ce434290f7',
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
  ovverrideConfig = config.get('override.config');
  config = _.merge(config, ovverrideConfig)
} catch (err) {
  // Do nothing
}

module.exports = config
