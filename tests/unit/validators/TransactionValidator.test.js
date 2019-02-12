const log = require('../../../src/logger')
const { MultiValidationError } = require('../../../src/utils/errors')
const TransactionValidator = require('../../../src/validators/TransactionValidator')
const MockTransactionFactory = require('../../factories/MockTransactionFactory')

const transactionValidator = new TransactionValidator(log)

describe('validateTransactionObject', () => {
  const invalidTransactionObjects = [
    MockTransactionFactory.build({ from: 'test' }),
    MockTransactionFactory.build({ to: 'test' }),
    MockTransactionFactory.build({ to: 'test' }),
    MockTransactionFactory.build({ value: 10 }),
    MockTransactionFactory.build({ data: 'test' }),
    MockTransactionFactory.build({ nonce: 'test' }),
    MockTransactionFactory.build({ gas: '10' }),
    MockTransactionFactory.build({ gasPrice: '1' }),
    MockTransactionFactory.build({ gas: 0 }),
    MockTransactionFactory.build({ gasPrice: 0 }),
    undefined,
    [],
    {},
  ]
  test.each(invalidTransactionObjects)('should return error since the transactionObject is: %o',
    (invalidTransactionObject) => {
      expect(() => transactionValidator.validateTransactionObject(invalidTransactionObject))
        .toThrowError(MultiValidationError)
    })
  test('should pass the validation', () => {
    const transactionObject = {
      from: '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2e',
      to: '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2e',
      value: '10',
      data: '0xd67cb05ef66d1c7c952656ddf5096e02281e3d2e',
      nonce: 0,
      gas: 1,
      gasPrice: 1,
    }

    expect(transactionValidator.validateTransactionObject(transactionObject)).toMatchObject(transactionObject)
  })
})
