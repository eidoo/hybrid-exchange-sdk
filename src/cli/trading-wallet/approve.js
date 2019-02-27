const logger = require('../../logger')

const { approveCommand } = require('../../commands/commandList')

module.exports = {
  describe: approveCommand.constructor.description,
  builder: approveCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await approveCommand.executeAsync(argv)),
}
