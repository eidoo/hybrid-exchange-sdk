/* eslint-env node, jest */
const sandbox = require('sinon').createSandbox()

const { getAllowanceCommand } = require('../../../src/commands/commandList')

afterEach(() => {
  sandbox.restore()
})

describe('tks getAllowance', () => {

})
