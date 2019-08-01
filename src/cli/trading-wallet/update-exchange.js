const logger = require('../../logger')

const { updateExchangeCommand } = require('../../commands/commandList')

module.exports = {
  describe: updateExchangeCommand.constructor.description,
  builder: updateExchangeCommand.getBuilderArgsDetails(),
  handler: async argv => logger.show(await updateExchangeCommand.executeAsync(argv)),
}
