/* eslint-env node, jest */

const { ITransactionLib } = require('../../../../src/lib/TransactionLib')

describe('ITransactionLib (unit tests)', () => {
  describe('buildDraft', () => {
    it('should reject if called', () => expect(
      (new ITransactionLib({})).buildDraft(),
    ).rejects.toEqual(Error('Method "buildDraft" has not been implemented yet.')))
  })
  describe('sign', () => {
    it('should reject if called', () => expect(
      (new ITransactionLib({})).sign(),
    ).rejects.toEqual(Error('Method "sign" has not been implemented yet.')))
  })
  describe('execute', () => {
    it('should reject if called', () => expect(
      (new ITransactionLib({})).execute(),
    ).rejects.toEqual(Error('Method "execute" has not been implemented yet.')))
  })
})
