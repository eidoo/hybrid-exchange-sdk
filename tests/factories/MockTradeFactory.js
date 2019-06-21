const { Factory } = require('rosie')

const MockTradeFactory = new Factory()
  .attrs(
    {
      id: '0x6687141574507f59f8af5b69b407b5ba6ef75c3a4e2b58057c6f7082caaf130a0',
      baseAddress: '0xced4e93198734ddaff8492d525bd258d49eb388e',
      quoteAddress: '0x0000000000000000000000000000000000000000',
      price: '0.0036221',
      lastUpdatedAt: '2019-06-21T06:54:01+00:00',
      size: '74.000',
      type: 'buy',
    },
    {
      id: '0xc84e053ecf71f2a1c8a04763c8f3f87c7a485306de604f20653c4eea85f0cf670',
      baseAddress: '0xced4e93198734ddaff8492d525bd258d49eb388e',
      quoteAddress: '0x0000000000000000000000000000000000000000',
      price: '0.0036221',
      lastUpdatedAt: '2019-06-21T06:53:18+00:00',
      size: '74.000',
      type: 'buy',
    },
    {
      id: '0x88203e12695f700cfd2e018e19200668e96213670ba243624e0e3d0ebef417620',
      baseAddress: '0xced4e93198734ddaff8492d525bd258d49eb388e',
      quoteAddress: '0x0000000000000000000000000000000000000000',
      price: '0.0036585',
      lastUpdatedAt: '2019-06-21T06:53:17+00:00',
      size: '85.000',
      type: 'buy',
    },
    {
      id: '0x482c57f68337898947db38e8c0752cd97167b04a0b5987ed939f6999a79c03630',
      baseAddress: '0xced4e93198734ddaff8492d525bd258d49eb388e',
      quoteAddress: '0x0000000000000000000000000000000000000000',
      price: '0.0036221',
      lastUpdatedAt: '2019-06-21T06:51:33+00:00',
      size: '74.000',
      type: 'buy',
    },
  )

module.exports = MockTradeFactory
