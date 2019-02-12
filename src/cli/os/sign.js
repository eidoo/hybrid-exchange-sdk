const logger = require('../../logger')

const { signCommand } = require('../../commands/commandList')

module.exports = {
  describe: signCommand.constructor.description,
  builder: signCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await signCommand.executeAsync(argv)),
}
