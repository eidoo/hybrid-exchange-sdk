const { Factory } = require('rosie')

const MockListPairFactory = new Factory()
  .attrs({
    status: 'success',
    data: {
      length: 2,
      results: [
        {
          base: {
            address: '0xf32e5074630ae7197589a1f97edc335bdd137816',
            symbol: 'AWN',
          },
          quote: {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
          },
          isInPresale: false,
          lastPrice: null,
          minTier: 2,
          priceChanges: {
            '1h': {
              perc: null,
            },
            '1d': {
              perc: null,
            },
            '1w': {
              perc: null,
            },
          },
          sellEnabled: true,
          fee: '0.8',
          minQuoteAmountAllowed: '300000000000000000',
        },
        {
          base: {
            address: '0x2b2c319799df9d98b0fd34c961a2e1181239de27',
            symbol: 'EDO',
          },
          quote: {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
          },
          isInPresale: false,
          lastPrice: '0.005',
          priceChanges: {
            '1h': {
              perc: 0,
            },
            '1d': {
              perc: -16.67,
            },
            '1w': {
              perc: null,
            },
          },
          sellEnabled: true,
          fee: '0.8',
          minQuoteAmountAllowed: '300000000000000000',
        },
      ],
    },
  })

module.exports = MockListPairFactory
