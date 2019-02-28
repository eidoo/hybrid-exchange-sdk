const logger = require('../../logger')

const { depositTokenCommand } = require('../../commands/commandList')

module.exports = {
  describe: depositTokenCommand.constructor.description,
  builder: depositTokenCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await depositTokenCommand.executeAsync(argv)),
}
