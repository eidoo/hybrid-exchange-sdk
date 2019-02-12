const { Factory } = require('rosie')

const MockOrderBookFactory = new Factory()
  .attrs({ status: 'success',
    data: { buy: {
      meta: {
        pageNumber: 0,
        pageSize: 50,
        precision: 5,
        resultsLength: 1,
      },
      results: [
        {
          price: '0.0050000',
          volume: '120000000000000000000',
          total: '120000000000000000000',
        },
      ],
    },
    sell: {
      meta: {
        pageNumber: 0,
        pageSize: 50,
        precision: 5,
        resultsLength: 1,
      },
      results: [
        {
          price: '1.0000',
          volume: '10000000000000000000',
          total: '1.375440402448604683841e+21',
        },
      ],
    } } })

module.exports = MockOrderBookFactory
