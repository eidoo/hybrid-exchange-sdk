const logger = require('../../logger')

const { withdrawCommand } = require('../../commands/commandList')

module.exports = {
  describe: withdrawCommand.constructor.description,
  builder: withdrawCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await withdrawCommand.executeAsync(argv)),
}
