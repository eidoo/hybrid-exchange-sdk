const logger = require('../../logger')

const { getBalanceCommand } = require('../../commands/commandList')

module.exports = {
  describe: getBalanceCommand.constructor.description,
  builder: getBalanceCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await getBalanceCommand.executeAsync(argv)),
}
