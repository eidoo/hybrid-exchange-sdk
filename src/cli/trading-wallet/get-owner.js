const logger = require('../../logger')

const { getOwnerCommand } = require('../../commands/commandList')

module.exports = {
  describe: getOwnerCommand.constructor.description,
  builder: getOwnerCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await getOwnerCommand.executeAsync(argv)),
}
