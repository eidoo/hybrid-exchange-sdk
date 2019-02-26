const logger = require('../../logger')

const { createCommand } = require('../../commands/commandList')

module.exports = {
  describe: createCommand.constructor.description,
  builder: createCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await createCommand.executeAsync(argv)),
}
