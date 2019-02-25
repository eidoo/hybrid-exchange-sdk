const logger = require('../../logger')

const { getAllowanceCommand } = require('../../commands/commandList')

module.exports = {
  describe: getAllowanceCommand.constructor.description,
  builder: getAllowanceCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await getAllowanceCommand.executeAsync(argv)),
}
