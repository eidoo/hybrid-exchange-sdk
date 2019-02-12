const logger = require('../../../src/logger')
const { TransactionObjectDraft, TransactionObjectDraftFactory } = require('../../../src/models/Transaction')
const MockTransactionDraftFactory = require('../../factories/MockTransactionDraftFactory')
const TransactionValidator = require('../../../src/validators/TransactionValidator')
const ValidationError = require('../../../src/validators/ValidationError')

const transactionValidator = new TransactionValidator(logger)
const transactionDraftFactory = new TransactionObjectDraftFactory(transactionValidator)

describe('TransactionObjectDraftFactory wrong input values', () => {
  const invalidFromValues = [1, '', 'NotHexadecimal', '0xISNOTETHERUMADDRESS', NaN, null, undefined, [], {}]

  test.each(invalidFromValues)('raise Error if from is not a valid Etherum address, from: %s.',
    (invalidFromValue) => {
      const transactionObjectDraft = MockTransactionDraftFactory.build({ from: invalidFromValue })

      try {
        transactionDraftFactory.create(transactionObjectDraft)
      } catch (e) {
        expect(e instanceof ValidationError).toBe(true)
      }
    })

  const invalidToValues = [1, '', 'NotHexadecimal', '0xISNOTETHERUMADDRESS', NaN, null, undefined, [], {}]

  test.each(invalidToValues)('raise Error if from is not a valid Etherum address, to: %s.',
    (invalidToValue) => {
      const transactionObjectDraft = MockTransactionDraftFactory.build({ to: invalidToValue })

      try {
        transactionDraftFactory.create(transactionObjectDraft)
      } catch (e) {
        expect(e instanceof ValidationError).toBe(true)
      }
    })
  const IvalidDataValues = [1, '', 'NotHexadecimal', NaN, null, undefined, [], {}]

  test.each(IvalidDataValues)('raise Error if data is not an hexadecimal value, data: %s.',
    (invalidDataValue) => {
      const transactionObjectDraft = MockTransactionDraftFactory.build({ data: invalidDataValue })
      try {
        transactionDraftFactory.create(transactionObjectDraft)
      } catch (e) {
        expect(e instanceof ValidationError).toBe(true)
      }
    })

  const invalidValueFields = [1, NaN, null, undefined, [], {}]

  test.each(invalidValueFields)('raise Error if value is not a string, value: %s.',
    (invalidValueField) => {
      const transactionObjectDraft = MockTransactionDraftFactory.build({ value: invalidValueField })
      try {
        transactionDraftFactory.create(transactionObjectDraft)
      } catch (e) {
        expect(e instanceof ValidationError).toBe(true)
      }
    })

  test('Correct params to TransactionObjectDraftFactory', () => {
    const transactionObjectDraftParams = {
      from: '0xc9b34b945c7aa00b21e32b0f811f369626c7d3db',
      to: '0xc9b34b945c7aa00b21e32b0f811f369626c7d3db',
      data: '0xc1d5e84f0000000000000000000000002457c09e911a79ccd81ef668a2092dbe73b610b5',
      value: '0x0',
    }
    const expectedTransactionDraft = new TransactionObjectDraft(
      transactionObjectDraftParams.data, transactionObjectDraftParams.from,
      transactionObjectDraftParams.to, transactionObjectDraftParams.value,
    )
    const result = transactionDraftFactory.create(transactionObjectDraftParams)
    expect(result).toMatchObject(expectedTransactionDraft)
  })
})
